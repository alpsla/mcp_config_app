import { supabase } from '../supabase/supabaseClient';

/**
 * Comprehensive diagnostic and fix for email authentication issues
 */
export interface AuthDiagnosticResult {
  success: boolean;
  issues: string[];
  fixAttempted: boolean;
  fixResult?: string;
  userData?: any;
}

/**
 * Diagnose auth issues and attempt to fix them
 */
export const diagnoseAndFixAuth = async (email: string): Promise<AuthDiagnosticResult> => {
  const issues: string[] = [];
  let fixAttempted = false;
  let fixResult: string | undefined;
  let userData: any = null;
  
  try {
    // Step 1: Check if user exists in auth system
    // Check if user exists via sign-in attempt - we can't use admin API directly
    // Try with a list users approach instead
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      issues.push(`Error checking user: ${error.message}`);
      return { success: false, issues, fixAttempted, userData: null };
    }
    
    // Check if we have a session - indicates we're logged in
    if (!data.user) {
      issues.push(`Unable to access user information. Make sure you have the right permissions.`);
      return { success: false, issues, fixAttempted, userData: null };
    }
    
    // Step 2: Check email verification status
    const isEmailVerified = userData.user.email_confirmed_at !== null;
    
    if (!isEmailVerified) {
      issues.push(`User email is not verified`);
      
      // Attempt to fix: Force email verification if admin capabilities available
      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          userData.user.id,
          { email_confirm: true }
        );
        
        if (updateError) {
          issues.push(`Failed to force verify email: ${updateError.message}`);
        } else {
          fixAttempted = true;
          fixResult = "Successfully forced email verification";
        }
      } catch (adminErr: any) {
        issues.push(`Admin update failed: ${adminErr.message}`);
      }
    }
    
    // Step 3: Check for profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();
      
    if (profileError && !profileError.message.includes('No rows found')) {
      issues.push(`Error retrieving profile: ${profileError.message}`);
    }
    
    if (!profileData) {
      issues.push(`User profile record is missing`);
      
      // Attempt to fix: Create missing profile
      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: userData.user.id,
            email: email,
            created_at: new Date().toISOString(),
            subscription_tier: 'free'
          }]);
          
        if (insertError) {
          issues.push(`Failed to create profile: ${insertError.message}`);
        } else {
          fixAttempted = true;
          fixResult = fixResult 
            ? `${fixResult}, Created missing profile record` 
            : "Created missing profile record";
        }
      } catch (profileErr: any) {
        issues.push(`Profile creation failed: ${profileErr.message}`);
      }
    }
    
    return {
      success: issues.length === 0 || fixAttempted,
      issues,
      fixAttempted,
      fixResult,
      userData: userData?.user || null
    };
  } catch (err: any) {
    issues.push(`Unexpected error: ${err.message}`);
    return {
      success: false,
      issues,
      fixAttempted: false,
      userData: null
    };
  }
};

/**
 * Force resend verification email with improved error handling
 */
export const forceResendVerification = async (email: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Try multiple methods to ensure email gets sent
    
    // Method 1: Standard resend
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    });
    
    if (resendError) {
      console.error('Standard resend failed:', resendError);
      
      // Method 2: Try OTP (magic link) as fallback
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (otpError) {
        console.error('OTP fallback failed:', otpError);
        throw new Error(otpError.message);
      }
      
      return {
        success: true,
        message: 'Verification link sent using alternative method. Please check your email.'
      };
    }
    
    return {
      success: true,
      message: 'Verification email sent successfully. Please check your inbox and spam folder.'
    };
  } catch (err: any) {
    console.error('Verification resend failed:', err);
    return {
      success: false,
      message: `Failed to send verification email: ${err.message}`
    };
  }
};

/**
 * Try to log in using multiple methods
 */
export const robustLogin = async (email: string, password: string): Promise<{
  success: boolean;
  user: any | null;
  session: any | null;
  error?: string;
  requiresEmailConfirmation?: boolean;
}> => {
  try {
    // First try standard password login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // If successful, return the user
    if (data.user && !error) {
      return {
        success: true,
        user: data.user,
        session: data.session
      };
    }
    
    // If error indicates email verification issue
    if (error && (
      error.message.includes('Email not confirmed') ||
      error.message.includes('not verified')
    )) {
      // Try to fix the verification status
      const diagnosticResult = await diagnoseAndFixAuth(email);
      
      if (diagnosticResult.success && diagnosticResult.fixAttempted) {
        // Try logging in again after fix
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (retryData.user && !retryError) {
          return {
            success: true,
            user: retryData.user,
            session: retryData.session
          };
        }
        
        // If still failing, fall back to email verification requirement
        return {
          success: false,
          user: null,
          session: null,
          error: retryError?.message || 'Login failed after verification fix',
          requiresEmailConfirmation: true
        };
      }
      
      return {
        success: false,
        user: null,
        session: null,
        error: error.message,
        requiresEmailConfirmation: true
      };
    }
    
    // For other errors, return the error
    return {
      success: false,
      user: null,
      session: null,
      error: error?.message || 'Unknown login error'
    };
  } catch (err: any) {
    return {
      success: false,
      user: null,
      session: null,
      error: err.message
    };
  }
};
