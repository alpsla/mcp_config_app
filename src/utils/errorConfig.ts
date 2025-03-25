/**
 * Centralized error handling configuration
 * This file contains settings for how different types of errors should be handled
 */

// Common error messages that we want to standardize across the application
export const standardErrorMessages = {
  NAVIGATION_ERROR: 'Navigation error detected. The application will refresh to fix this issue.',
  AUTH_ERROR: 'An error occurred during authentication. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  NETWORK_ERROR: 'Network connection issue detected. Please check your internet connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again or contact support.',
};

// Configuration for how errors should be handled automatically
export const errorHandlingConfig = {
  // Should page refresh automatically for certain errors?
  autoRefreshOn: ['ROUTER_CONTEXT_MISSING', 'SESSION_EXPIRED'],
  
  // Delay before taking automatic action (in ms)
  actionDelay: 1500,
  
  // Whether to log errors to console
  logToConsole: true,
  
  // Whether to show a toast/notification for errors
  showNotification: true,
  
  // Auto-hide delay for notifications (in ms)
  autoHideDelay: 5000,
  
  // Errors that should be silent (no user-facing message)
  silentErrors: ['TOKEN_REFRESH'],
  
  // Should specific errors trigger automatic refresh
  shouldAutoRefresh: true,
};

// Helper method to determine whether an error should trigger a refresh
export const shouldRefreshOnError = (errorType: string): boolean => {
  return errorHandlingConfig.autoRefreshOn.includes(errorType);
};

// Create a named export for the error configuration
const errorConfig = {
  messages: standardErrorMessages,
  config: errorHandlingConfig,
  shouldRefreshOnError,
};

// Central configuration
export default errorConfig;
