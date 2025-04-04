import { supabase, checkSupabaseConfig } from '../core/authClient';
import { verifyAndEnsureProfile } from '../profile/profileService';
import { getCurrentUser } from '../core/authService';
import { SubscriptionTier } from '../types/authTypes';

// Import templates
import { 
  getMagicLinkEmailTemplate, 
  getPasswordResetEmailTemplate,
  getVerificationEmailTemplate
} from './emailTemplates';

/**
 * Send a magic link for passwordless login
 */
export async function sendMagicLink(email: string) {
  console.log('sendMagicLink called with email:', email);
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getMagicLinkEmailTemplate();
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback#/dashboard`,
        shouldCreateUser: true,  // Always create a new user account if it doesn't exist
        ...(emailTemplate && { emailTemplate })
      }
    });
    
    if (error) {
      console.error('Magic link error:', error.message);
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Magic link sent to your email'
    };
  } catch (error: any) {
    console.error('Magic link error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred sending magic link' 
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  checkSupabaseConfig();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Check if this is the first login after email confirmation
    const isFirstLoginAfterConfirmation = data.user && data.user.email_confirmed_at && 
      data.user.last_sign_in_at && 
      // If confirmation time and first login are close (within 5 minutes)
      (new Date(data.user.email_confirmed_at).getTime() - new Date(data.user.last_sign_in_at).getTime() < 300000);
    
    if (isFirstLoginAfterConfirmation) {
      console.log('First login after email confirmation detected, ensuring profile exists...');
    }
    
    // Always try to create a profile for this user if needed
    // This is crucial for users who just confirmed their email
    try {
      const metadata = data.user?.user_metadata || {};
      const firstName = metadata.first_name || metadata.given_name || 'User';
      const lastName = metadata.last_name || metadata.family_name || 'Name';
      
      // Force profile check/creation
      const profileResult = await verifyAndEnsureProfile(
        data.user?.id || '',
        email,
        firstName,
        lastName
      );
      
      if (profileResult.success) {
        console.log(`Profile ${profileResult.action} during signin:`, data.user?.id);
      } else {
        console.error('Error ensuring profile exists during signin:', profileResult.error);
      }
    } catch (profileError) {
      console.error('Critical error handling profile during signin:', profileError);
    }
    
    // Get user profile - this should now exist
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Failed to get user after profile creation - critical error');
      return { 
        success: false, 
        error: 'Failed to retrieve user profile after login. Please contact support.' 
      };
    }
    
    return {
      success: true,
      user,
      session: data.session,
      requiresEmailConfirmation: false
    };
  } catch (error: any) {
    // Check for verification error in the message
    const isVerificationError = 
      error.message?.toLowerCase().includes('email') && 
      error.message?.toLowerCase().includes('verify');
    
    return { 
      success: false, 
      error: error.message || 'An error occurred during sign in',
      requiresEmailConfirmation: isVerificationError
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, firstName?: string, lastName?: string) {
  checkSupabaseConfig();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Create profile in database
    if (data.user) {
      // Use our centralized profile verification
      const profileResult = await verifyAndEnsureProfile(
        data.user.id, 
        email, 
        firstName || 'User', 
        lastName || 'Name'
      );
      
      if (!profileResult.success) {
        console.error('Error creating profile during signup:', profileResult.error);
        // Continue with the sign-up flow despite profile creation error
        // The profile will be auto-created on first login
      } else {
        console.log(`Profile ${profileResult.action} for new user:`, data.user.id);
      }
    }
    
    return {
      success: true,
      user: data.user ? {
        id: data.user.id,
        email,
        app_metadata: {},
        user_metadata: {
          firstName: firstName,
          lastName: lastName,
          subscriptionTier: SubscriptionTier.FREE
        },
        aud: 'authenticated',
        created_at: data.user.created_at || new Date().toISOString()
      } : null,
      session: data.session,
      requiresEmailConfirmation: true,
      message: 'Please check your email to confirm your account before logging in.'
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred during sign up' 
    };
  }
}

/**
 * Reset password with email
 */
export async function resetPassword(email: string) {
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getPasswordResetEmailTemplate();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      ...(emailTemplate && { emailTemplate })
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Password reset instructions sent to your email'
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred during password reset' 
    };
  }
}

/**
 * Update the user's password
 */
export async function updatePassword(password: string) {
  checkSupabaseConfig();
  
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) {
      console.error('Update password error:', error.message);
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error: any) {
    console.error('Update password error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred while updating password' 
    };
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getVerificationEmailTemplate();
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        ...(emailTemplate && { emailTemplate })
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Verification email has been resent. Please check your inbox.'
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Error resending verification email' 
    };
  }
}

/**
 * Direct access authentication - bypasses normal login flow
 * Uses a magic link to authenticate the user
 */
export async function directAccessLogin(email: string) {
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getMagicLinkEmailTemplate();
    
    // Step 1: Send a magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,  // Always create a new user account if it doesn't exist
        ...(emailTemplate && { emailTemplate })
      }
    });
    
    if (error) {
      console.error('Direct access login error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Step 2: Ensure profile exists (will be used when the user clicks the link)
    try {
      // Find the user by email from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .maybeSingle();
      
      // If profile doesn't exist, we'll handle it when the user clicks the link
      // through our enhanced callback handler
      if (!profileData || !profileData.id) {
        console.log('No profile found for email:', email, 'Will create during callback.');
      }
    } catch (profileError) {
      // Ignore profile lookup errors - we'll handle it when the user clicks the link
      console.warn('Profile lookup warning:', profileError);
    }
    
    return {
      success: true,
      message: 'Access link sent to your email. Please check your inbox and click the link to log in.'
    };
  } catch (error: any) {
    console.error('Direct access login error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred during direct access login' 
    };
  }
}
