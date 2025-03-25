/**
 * Email Authentication Fix
 * This module provides enhanced email validation and authentication fixes
 * for the MCP Configuration Tool.
 */

import { supabase } from '../supabase/supabaseClient';
import { validateEmail } from '../../utils/validation';
import { AuthErrorType, AuthErrorHandler } from '../../utils/authErrorHandler';

/**
 * Validate and sanitize email address before authentication
 * @param email The email address to validate and sanitize
 * @returns Object with validation results and sanitized email if valid
 */
export const validateAndSanitizeEmail = (email: string): {
  valid: boolean;
  sanitizedEmail?: string;
  errorType?: AuthErrorType;
  errorMessage?: string;
} => {
  // Trim whitespace
  const trimmedEmail = email.trim();
  
  // Perform validation
  const validation = validateEmail(trimmedEmail);
  
  if (!validation.valid) {
    return {
      valid: false,
      errorType: AuthErrorType.INVALID_EMAIL,
      errorMessage: validation.message
    };
  }
  
  // Email is valid, return sanitized version
  return {
    valid: true,
    sanitizedEmail: trimmedEmail
  };
};

/**
 * Enhanced login that includes proper email validation
 * @param email The email address to use for login
 * @param password The password to use for login
 * @returns Authentication result with appropriate error handling
 */
export const enhancedLogin = async (email: string, password: string) => {
  // First validate the email
  const emailValidation = validateAndSanitizeEmail(email);
  
  if (!emailValidation.valid) {
    return {
      success: false,
      error: {
        type: AuthErrorType.INVALID_EMAIL,
        message: emailValidation.errorMessage || 'Invalid email format',
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.INVALID_EMAIL)
      }
    };
  }
  
  // Use sanitized email for authentication
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailValidation.sanitizedEmail as string,
      password
    });
    
    if (error) {
      // Map Supabase error to our standard error types
      const errorType = AuthErrorHandler.mapSupabaseError(error.message);
      
      return {
        success: false,
        error: {
          type: errorType,
          message: AuthErrorHandler.getUserFriendlyMessage(errorType),
          actions: AuthErrorHandler.getErrorAction(errorType)
        }
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Login error:', error);
    
    return {
      success: false,
      error: {
        type: AuthErrorType.UNKNOWN_ERROR,
        message: 'An unexpected error occurred during login',
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.UNKNOWN_ERROR)
      }
    };
  }
};

/**
 * Enhanced signup that includes proper email validation
 * @param email The email to use for signup
 * @param password The password to use
 * @param firstName Optional first name
 * @param lastName Optional last name
 * @returns Signup result with appropriate error handling
 */
export const enhancedSignup = async (
  email: string, 
  password: string,
  firstName?: string, 
  lastName?: string
) => {
  // First validate the email
  const emailValidation = validateAndSanitizeEmail(email);
  
  if (!emailValidation.valid) {
    return {
      success: false,
      error: {
        type: AuthErrorType.INVALID_EMAIL,
        message: emailValidation.errorMessage || 'Invalid email format',
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.INVALID_EMAIL)
      }
    };
  }
  
  // Use sanitized email for signup
  try {
    const { data, error } = await supabase.auth.signUp({
      email: emailValidation.sanitizedEmail as string,
      password,
      options: {
        data: {
          first_name: firstName || '',
          last_name: lastName || ''
        }
      }
    });
    
    if (error) {
      // Map Supabase error to our standard error types
      const errorType = AuthErrorHandler.mapSupabaseError(error.message);
      
      return {
        success: false,
        error: {
          type: errorType,
          message: AuthErrorHandler.getUserFriendlyMessage(errorType),
          actions: AuthErrorHandler.getErrorAction(errorType)
        }
      };
    }
    
    // Check if email confirmation is required
    const requiresEmailConfirmation = data.user && !data.session;
    
    return {
      success: true,
      data,
      requiresEmailConfirmation
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    
    return {
      success: false,
      error: {
        type: AuthErrorType.UNKNOWN_ERROR,
        message: 'An unexpected error occurred during signup',
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.UNKNOWN_ERROR)
      }
    };
  }
};

/**
 * Enhanced password reset with proper email validation
 * @param email The email to send password reset instructions to
 * @returns Password reset result with appropriate error handling
 */
export const enhancedResetPassword = async (email: string) => {
  // First validate the email
  const emailValidation = validateAndSanitizeEmail(email);
  
  if (!emailValidation.valid) {
    return {
      success: false,
      error: {
        type: AuthErrorType.INVALID_EMAIL,
        message: emailValidation.errorMessage || 'Invalid email format',
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.INVALID_EMAIL)
      }
    };
  }
  
  // Use sanitized email for password reset
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      emailValidation.sanitizedEmail as string
    );
    
    if (error) {
      // Special case for rate limiting
      if (error.message.includes('rate limit')) {
        return {
          success: false,
          error: {
            type: AuthErrorType.RATE_LIMIT,
            message: 'Too many password reset attempts. Please try again later.',
            actions: AuthErrorHandler.getErrorAction(AuthErrorType.RATE_LIMIT)
          }
        };
      }
      
      // For security reasons, we don't expose whether the email exists or not
      // So we return a generic success message even if there was an error
      console.warn('Password reset error (not exposed to user):', error.message);
    }
    
    return {
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.'
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    // Still return success for security reasons
    return {
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.'
    };
  }
};

/**
 * Enhanced magic link login with proper email validation
 * @param email The email to send a magic link to
 * @returns Magic link result with appropriate error handling
 */
export const enhancedMagicLink = async (email: string) => {
  // First validate the email
  const emailValidation = validateAndSanitizeEmail(email);
  
  if (!emailValidation.valid) {
    return {
      success: false,
      error: {
        type: AuthErrorType.INVALID_EMAIL,
        message: emailValidation.errorMessage || 'Invalid email format',
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.INVALID_EMAIL)
      }
    };
  }
  
  // Use sanitized email for magic link
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: emailValidation.sanitizedEmail as string
    });
    
    if (error) {
      // Special case for rate limiting
      if (error.message.includes('rate limit')) {
        return {
          success: false,
          error: {
            type: AuthErrorType.RATE_LIMIT,
            message: 'Too many login attempts. Please try again later.',
            actions: AuthErrorHandler.getErrorAction(AuthErrorType.RATE_LIMIT)
          }
        };
      }
      
      // For security reasons, we don't expose whether the email exists or not
      // So we return a generic success message even if there was an error
      console.warn('Magic link error (not exposed to user):', error.message);
    }
    
    return {
      success: true,
      message: 'If an account exists with this email, a magic link has been sent.'
    };
  } catch (error: any) {
    console.error('Magic link error:', error);
    
    // Still return success for security reasons
    return {
      success: true,
      message: 'If an account exists with this email, a magic link has been sent.'
    };
  }
};

/**
 * Update AuthContext to use the enhanced authentication functions
 * This function should be imported and called in the app's initialization
 */
export const applyAuthFixes = () => {
  console.log('Applied enhanced email validation and authentication fixes');
  // This is a hook for any global fixes that need to be applied
  // Currently, the individual enhanced functions can be used directly
};

/**
 * Diagnose and attempt to fix common authentication issues
 * This function is used by the Auth Diagnostic Tool
 * @param email The email to diagnose and fix issues for
 * @returns Results of the diagnosis and any fixes attempted
 */
export const diagnoseAndFixAuth = async (email: string) => {
  const issues: string[] = [];
  let fixAttempted = false;
  let fixResult = '';
  let success = false;
  
  try {
    // Validate email first
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      issues.push(`Invalid email format: ${emailValidation.message}`);
      return { success: false, issues, fixAttempted, fixResult };
    }
    
    // Check if user exists in auth
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      issues.push(`Admin API error: ${userError.message}`);
      
      // Try alternate method - sign in with wrong password to check if user exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: 'test-password-diagnostic-only'
      });
      
      // If error includes 'Invalid login credentials', user might exist
      if (signInError && !signInError.message.includes('Invalid login credentials')) {
        issues.push(`User not found in authentication system`);
      } else {
        issues.push(`User likely exists but verification status unknown`);
      }
      
      // Check profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.trim());
        
      if (!profileData || profileData.length === 0) {
        issues.push(`No profile found in database for email: ${email}`);
      } else {
        success = true;
        issues.push(`Profile found in database`);
      }
      
      return { success, issues, fixAttempted, fixResult };
    }
    
    // Check if user exists in auth list
    const users = userData.users as any[];
    const user = users.find(u => u.email === email.trim());
    
    if (!user) {
      issues.push(`No user found with email: ${email}`);
      return { success: false, issues, fixAttempted, fixResult };
    }
    
    // Check if email is confirmed
    if (!user.email_confirmed_at) {
      issues.push(`Email not confirmed`);
      
      // Try to fix by sending verification email
      try {
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email.trim()
        });
        
        if (resendError) {
          issues.push(`Failed to resend verification: ${resendError.message}`);
        } else {
          fixAttempted = true;
          fixResult = `Verification email resent successfully`;
        }
      } catch (error: any) {
        issues.push(`Error resending verification: ${error.message}`);
      }
    } else {
      success = true;
      issues.push(`Email confirmed at: ${new Date(user.email_confirmed_at).toLocaleString()}`);
    }
    
    // Check if user has a profile in database
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', user.id);
      
    if (!profileData || profileData.length === 0) {
      issues.push(`No profile found in database`);
      
      // Try to fix by creating a profile
      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            email: email.trim(),
            created_at: new Date().toISOString()
          }]);
          
        if (insertError) {
          issues.push(`Failed to create profile: ${insertError.message}`);
        } else {
          fixAttempted = true;
          fixResult = `Profile created successfully`;
          success = true;
        }
      } catch (error: any) {
        issues.push(`Error creating profile: ${error.message}`);
      }
    } else {
      success = true;
      issues.push(`Profile found in database`);
      
      // Check if profile has email
      if (!profileData[0].email) {
        issues.push(`Profile missing email field`);
        
        // Try to fix by updating profile
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ email: email.trim() })
            .eq('id', user.id);
            
          if (updateError) {
            issues.push(`Failed to update profile: ${updateError.message}`);
          } else {
            fixAttempted = true;
            fixResult = `Profile updated with email`;
            success = true;
          }
        } catch (error: any) {
          issues.push(`Error updating profile: ${error.message}`);
        }
      }
    }
    
    return { success, issues, fixAttempted, fixResult };
  } catch (error: any) {
    issues.push(`Diagnostic error: ${error.message}`);
    return { success: false, issues, fixAttempted, fixResult };
  }
};
