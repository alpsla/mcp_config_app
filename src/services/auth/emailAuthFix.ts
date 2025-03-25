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
    const { data, error } = await supabase.auth.resetPasswordForEmail(
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
    const { data, error } = await supabase.auth.signInWithOtp({
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
