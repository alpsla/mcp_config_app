/**
 * Robust Authentication Service
 * Provides enhanced authentication functions with proper email validation
 * and improved error handling.
 */

import { supabase } from '../supabase/supabaseClient';
import { validateEmail } from '../../utils/validation';
import { AuthErrorType, AuthErrorHandler } from '../../utils/authErrorHandler';
import { getCurrentUser } from '../supabase/authService';

/**
 * Robust login implementation with email validation
 * and improved error handling
 */
export const robustLogin = async (email: string, password: string) => {
  try {
    // Validate and sanitize email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return {
        success: false,
        error: emailValidation.message,
        requiresEmailConfirmation: false
      };
    }
    
    // Attempt to login with sanitized email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    
    if (error) {
      console.log('Login error:', error.message);
      
      // Check if this is an email verification issue
      if (error.message.includes('Email not confirmed') || 
          error.message.includes('not verified')) {
        return {
          success: false,
          requiresEmailConfirmation: true,
          error: 'Your email is not yet verified. Please check your inbox for the verification email.'
        };
      }
      
      return {
        success: false,
        error: error.message,
        requiresEmailConfirmation: false
      };
    }
    
    // Login successful
    return {
      success: true,
      session: data.session,
      requiresEmailConfirmation: false
    };
  } catch (error: any) {
    console.error('Error in robustLogin:', error);
    return {
      success: false,
      error: error.message,
      requiresEmailConfirmation: false
    };
  }
};

/**
 * Force resend verification with multiple fallback methods
 * This is a more robust version that tries multiple approaches if needed
 */
export const forceResendVerification = async (email: string) => {
  try {
    // Validate email first
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return {
        success: false,
        message: emailValidation.message
      };
    }
    
    // Try standard verification resend first
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim()
    });
    
    if (!error) {
      return {
        success: true,
        message: 'Verification email has been sent. Please check your inbox.'
      };
    }
    
    // If standard method failed due to rate limiting, let the user know
    if (error.message.includes('rate limit')) {
      return {
        success: false,
        message: 'Too many attempts. Please wait a few minutes before trying again.'
      };
    }
    
    // For other errors, try alternate approach - sign up again which will 
    // send another verification if the user exists but isn't verified
    console.log('Standard verification resend failed, trying alternate approach');
    
    // Generate a unique password that won't be used (for security)
    const tempPassword = Math.random().toString(36).slice(-8) + 
                         Math.random().toString(36).slice(-8);
    
    const { error: signupError, data } = await supabase.auth.signUp({
      email: email.trim(),
      password: tempPassword
    });
    
    // The signup might fail with "User already registered" which is fine
    // or it might succeed but not create a session (when email confirmation required)
    if ((!signupError && data && !data.session) || 
        (signupError && signupError.message.includes('already registered'))) {
      return {
        success: true,
        message: 'Verification email has been sent. Please check your inbox (including spam/junk folders).'
      };
    }
    
    console.log('Alternate verification method result:', { signupError, data });
    
    // If we couldn't send a verification email, return the original error
    return {
      success: false,
      message: error.message
    };
  } catch (error: any) {
    console.error('Error in forceResendVerification:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Update user authentication profile
 * Used to update password, email, or other auth-related data
 */
export const updateAuthProfile = async (
  updates: { password?: string; email?: string }
) => {
  try {
    // If updating email, validate it first
    if (updates.email) {
      const emailValidation = validateEmail(updates.email);
      if (!emailValidation.valid) {
        return {
          success: false,
          error: {
            type: AuthErrorType.INVALID_EMAIL,
            message: emailValidation.message,
            actions: AuthErrorHandler.getErrorAction(AuthErrorType.INVALID_EMAIL)
          }
        };
      }
      
      // Use sanitized email
      updates.email = updates.email.trim();
    }
    
    // Update the user profile
    const { data, error } = await supabase.auth.updateUser(updates);
    
    if (error) {
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
    
    // Get updated user profile
    const user = await getCurrentUser();
    
    return {
      success: true,
      user,
      data
    };
  } catch (error: any) {
    console.error('Error in updateAuthProfile:', error);
    
    return {
      success: false,
      error: {
        type: AuthErrorType.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while updating your profile',
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.UNKNOWN_ERROR)
      }
    };
  }
};
