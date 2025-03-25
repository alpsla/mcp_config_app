/**
 * Authentication error handling utilities
 * Centralizes error handling for authentication flows
 */
import { standardErrorMessages, errorHandlingConfig } from './errorConfig';

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
  ROUTER_CONTEXT_MISSING = "ROUTER_CONTEXT_MISSING",
  PROFILE_MISMATCH = "PROFILE_MISMATCH",
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
  if (msg.includes('router') || msg.includes('navigate') || msg.includes('context')) {
    return AuthErrorType.ROUTER_CONTEXT_MISSING;
  }
  if (msg.includes('profile') || msg.includes('mismatch')) {
    return AuthErrorType.PROFILE_MISMATCH;
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
    case AuthErrorType.ROUTER_CONTEXT_MISSING:
      return "Navigation error - router context missing. The application will be refreshed to fix this issue.";
    case AuthErrorType.PROFILE_MISMATCH:
      return "There appears to be an issue with your profile. Please try signing out and back in.";
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

/**
 * Handles router context errors by refreshing the page
 * This is a common fix for useNavigate issues
 */
export const handleRouterContextError = (error: Error): void => {
  console.error('Router context error detected:', error);
  
  // Log additional diagnostic information
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  
  // Create and show an error notification
  showErrorNotification(standardErrorMessages.NAVIGATION_ERROR, 'warning');
  
  // Add a small delay before reloading to allow logs to be sent
  setTimeout(() => {
    // Reload the page to fix the router context
    window.location.reload();
  }, errorHandlingConfig.actionDelay);
};

/**
 * Shows an error notification in the UI
 */
export const showErrorNotification = (message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error'): void => {
  // Create container element
  const notificationContainer = document.createElement('div');
  notificationContainer.className = `error-notification ${type}`;
  notificationContainer.style.position = 'fixed';
  notificationContainer.style.top = '20px';
  notificationContainer.style.right = '20px';
  notificationContainer.style.padding = '12px 20px';
  notificationContainer.style.borderRadius = '6px';
  notificationContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  notificationContainer.style.display = 'flex';
  notificationContainer.style.alignItems = 'center';
  notificationContainer.style.justifyContent = 'space-between';
  notificationContainer.style.maxWidth = '400px';
  notificationContainer.style.zIndex = '1000';
  notificationContainer.style.animation = 'slideIn 0.3s ease-out';
  
  // Add animation keyframes to the document if not already present
  if (!document.getElementById('error-notification-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'error-notification-styles';
    styleElement.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // Set background and border colors based on type
  switch (type) {
    case 'error':
      notificationContainer.style.backgroundColor = '#FEE2E2';
      notificationContainer.style.borderLeft = '4px solid #DC2626';
      notificationContainer.style.color = '#7F1D1D';
      break;
    case 'warning':
      notificationContainer.style.backgroundColor = '#FEF3C7';
      notificationContainer.style.borderLeft = '4px solid #F59E0B';
      notificationContainer.style.color = '#78350F';
      break;
    case 'info':
      notificationContainer.style.backgroundColor = '#E0F2FE';
      notificationContainer.style.borderLeft = '4px solid #0EA5E9';
      notificationContainer.style.color = '#0C4A6E';
      break;
    case 'success':
      notificationContainer.style.backgroundColor = '#DCFCE7';
      notificationContainer.style.borderLeft = '4px solid #22C55E';
      notificationContainer.style.color = '#166534';
      break;
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = 'error-message';
  messageElement.style.flex = '1';
  messageElement.style.fontSize = '14px';
  messageElement.style.lineHeight = '1.4';
  messageElement.textContent = message;
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'error-close-button';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0 0 0 10px';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.opacity = '0.6';
  closeButton.style.transition = 'opacity 0.2s';
  closeButton.textContent = '×';
  
  // Add hover effect for close button
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.opacity = '1';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.opacity = '0.6';
  });
  
  // Add close functionality
  closeButton.addEventListener('click', () => {
    document.body.removeChild(notificationContainer);
  });
  
  // Assemble notification
  notificationContainer.appendChild(messageElement);
  notificationContainer.appendChild(closeButton);
  
  // Add to the DOM
  document.body.appendChild(notificationContainer);
  
  // Auto-hide after delay if configured
  if (errorHandlingConfig.autoHideDelay) {
    setTimeout(() => {
      if (document.body.contains(notificationContainer)) {
        document.body.removeChild(notificationContainer);
      }
    }, errorHandlingConfig.autoHideDelay || 5000);
  }
};

// The complete AuthErrorHandler class for convenient use
export class AuthErrorHandler {
  static mapSupabaseError = mapSupabaseError;
  static getUserFriendlyMessage = getUserFriendlyMessage;
  static getErrorAction = getErrorAction;
  static handleRouterContextError = handleRouterContextError;
  static showErrorNotification = showErrorNotification;
  
  /**
   * Diagnose a general error and handle it appropriately
   * @param error Any error thrown during authentication
   * @returns Appropriate error type and message
   */
  static diagnoseError(error: any): { type: AuthErrorType; message: string } {
    let errorMessage = '';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for React Router errors
      if (
        errorMessage.includes('useNavigate') || 
        errorMessage.includes('Router') ||
        errorMessage.includes('outside')
      ) {
        this.handleRouterContextError(error);
        return {
          type: AuthErrorType.ROUTER_CONTEXT_MISSING,
          message: this.getUserFriendlyMessage(AuthErrorType.ROUTER_CONTEXT_MISSING)
        };
      }
    } else if (error && typeof error === 'object') {
      errorMessage = error.message || error.error_description || JSON.stringify(error);
    }
    
    const errorType = this.mapSupabaseError(errorMessage);
    const message = this.getUserFriendlyMessage(errorType, errorMessage);
    
    // Show notification for certain error types if configured
    if (errorHandlingConfig.showNotification && 
        !errorHandlingConfig.silentErrors.includes(errorType)) {
      this.showErrorNotification(message, 
        errorType === AuthErrorType.NETWORK_ERROR ? 'warning' : 'error'
      );
    }
    
    return {
      type: errorType,
      message: message
    };
  }
}
