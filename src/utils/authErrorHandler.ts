/**
 * Authentication error handling utilities
 * Centralizes error handling for authentication flows
 */

export enum AuthErrorType {
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  PASSWORDS_DONT_MATCH = "PASSWORDS_DONT_MATCH",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED",
  ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  PROVIDER_ERROR = "PROVIDER_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

/**
 * Maps Supabase error messages to our standardized error types
 * @param errorMessage The error message from Supabase
 * @returns Standardized error type
 */
export const mapSupabaseError = (errorMessage: string): AuthErrorType => {
  const msg = errorMessage.toLowerCase();
  
  if (msg.includes('rate limit')) {
    return AuthErrorType.RATE_LIMIT;
  }
  if (msg.includes('network') || msg.includes('connection')) {
    return AuthErrorType.NETWORK_ERROR;
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return AuthErrorType.INVALID_CREDENTIALS;
  }
  if (msg.includes('not confirmed') || msg.includes('not verified')) {
    return AuthErrorType.EMAIL_NOT_VERIFIED;
  }
  if (msg.includes('already registered') || msg.includes('already exists')) {
    return AuthErrorType.EMAIL_ALREADY_REGISTERED;
  }
  if (msg.includes('user not found') || msg.includes('no user found')) {
    return AuthErrorType.ACCOUNT_NOT_FOUND;
  }
  if (msg.includes('invalid email')) {
    return AuthErrorType.INVALID_EMAIL;
  }
  if (msg.includes('password')) {
    return AuthErrorType.INVALID_PASSWORD;
  }
  
  return AuthErrorType.UNKNOWN_ERROR;
};

/**
 * Gets a user-friendly error message for display
 * @param errorType The type of authentication error
 * @param details Optional additional details about the error
 * @returns User-friendly error message
 */
export const getUserFriendlyMessage = (errorType: AuthErrorType, details?: string): string => {
  switch (errorType) {
    case AuthErrorType.INVALID_EMAIL:
      return "Please enter a valid email address (e.g., example@domain.com)";
    case AuthErrorType.INVALID_PASSWORD:
      return "Your password doesn't meet the requirements";
    case AuthErrorType.PASSWORDS_DONT_MATCH:
      return "The passwords you entered don't match";
    case AuthErrorType.EMAIL_NOT_VERIFIED:
      return "Please verify your email before logging in. We've sent a verification link to your email address.";
    case AuthErrorType.EMAIL_ALREADY_REGISTERED:
      return "This email is already registered. Please sign in instead.";
    case AuthErrorType.ACCOUNT_NOT_FOUND:
      return "We couldn't find an account with this email. Would you like to create one?";
    case AuthErrorType.INVALID_CREDENTIALS:
      return "The email or password you entered is incorrect";
    case AuthErrorType.PROVIDER_ERROR:
      return `There was an issue with the authentication provider. ${details || ''}`;
    case AuthErrorType.NETWORK_ERROR:
      return "Connection issue detected. Please check your internet connection and try again.";
    case AuthErrorType.RATE_LIMIT:
      return "Too many attempts. Please wait a few minutes and try again.";
    case AuthErrorType.UNKNOWN_ERROR:
      return details || "An unexpected error occurred. Please try again or contact support.";
    default:
      return "Authentication error. Please try again.";
  }
};

/**
 * Gets appropriate actions for a given error type
 * @param errorType The type of authentication error
 * @returns Actions that can be presented to the user
 */
export const getErrorAction = (errorType: AuthErrorType): { 
  primaryAction: string; 
  primaryActionLabel: string;
  secondaryAction?: string;
  secondaryActionLabel?: string;
} => {
  switch (errorType) {
    case AuthErrorType.INVALID_EMAIL:
    case AuthErrorType.INVALID_PASSWORD:
    case AuthErrorType.PASSWORDS_DONT_MATCH:
    case AuthErrorType.INVALID_CREDENTIALS:
      return {
        primaryAction: "STAY_ON_FORM",
        primaryActionLabel: "Try Again",
      };
    case AuthErrorType.EMAIL_NOT_VERIFIED:
      return {
        primaryAction: "RESEND_VERIFICATION",
        primaryActionLabel: "Resend Verification Email",
        secondaryAction: "CONTACT_SUPPORT",
        secondaryActionLabel: "I Need Help"
      };
    case AuthErrorType.EMAIL_ALREADY_REGISTERED:
      return {
        primaryAction: "SWITCH_TO_LOGIN",
        primaryActionLabel: "Sign In Instead",
        secondaryAction: "RESET_PASSWORD",
        secondaryActionLabel: "Forgot Password?"
      };
    case AuthErrorType.ACCOUNT_NOT_FOUND:
      return {
        primaryAction: "SWITCH_TO_SIGNUP",
        primaryActionLabel: "Create Account",
        secondaryAction: "STAY_ON_FORM",
        secondaryActionLabel: "Try Again"
      };
    case AuthErrorType.RATE_LIMIT:
      return {
        primaryAction: "WAIT",
        primaryActionLabel: "Try Again Later",
      };
    default:
      return {
        primaryAction: "RETRY",
        primaryActionLabel: "Try Again",
        secondaryAction: "CONTACT_SUPPORT",
        secondaryActionLabel: "Contact Support"
      };
  }
};

// The complete AuthErrorHandler class for convenient use
export class AuthErrorHandler {
  static mapSupabaseError = mapSupabaseError;
  static getUserFriendlyMessage = getUserFriendlyMessage;
  static getErrorAction = getErrorAction;
}
