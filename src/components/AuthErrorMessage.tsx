import React from 'react';
import { AuthErrorType } from '../utils/authErrorHandler';

interface AuthErrorProps {
  error: {
    type: AuthErrorType;
    message: string;
    actions: ReturnType<typeof import('../utils/authErrorHandler').getErrorAction>;
  };
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

/**
 * Enhanced error message component for authentication flows
 * Displays user-friendly errors with appropriate actions
 */
export const AuthErrorMessage: React.FC<AuthErrorProps> = ({ 
  error, 
  onPrimaryAction, 
  onSecondaryAction 
}) => {
  // Determine icon based on error type
  let iconType = "error";
  
  if (error.type === AuthErrorType.EMAIL_NOT_VERIFIED || 
      error.type === AuthErrorType.EMAIL_ALREADY_REGISTERED) {
    iconType = "email";
  } else if (error.type === AuthErrorType.NETWORK_ERROR) {
    iconType = "network";
  } else if (error.type === AuthErrorType.RATE_LIMIT) {
    iconType = "wait";
  }
  
  // Icon components for different error types
  const getIcon = () => {
    switch (iconType) {
      case "email":
        return (
          <svg className="auth-error-icon email" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
          </svg>
        );
      case "network":
        return (
          <svg className="auth-error-icon network" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 9L3 11C7.97 6.03 16.03 6.03 21 11L23 9C16.93 2.93 7.08 2.93 1 9ZM9 17L12 20L15 17C13.35 15.34 10.66 15.34 9 17ZM5 13L7 15C9.76 12.24 14.24 12.24 17 15L19 13C15.14 9.14 8.87 9.14 5 13Z" fill="currentColor"/>
          </svg>
        );
      case "wait":
        return (
          <svg className="auth-error-icon wait" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
          </svg>
        );
      default:
        return (
          <svg className="auth-error-icon error" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="currentColor"/>
          </svg>
        );
    }
  };
  
  return (
    <div className="auth-error-container">
      <div className="auth-error-content">
        {getIcon()}
        <div className="auth-error-message">{error.message}</div>
      </div>
      
      <div className="auth-error-actions">
        <button 
          className="auth-error-primary-action" 
          onClick={onPrimaryAction}
        >
          {error.actions.primaryActionLabel}
        </button>
        
        {error.actions.secondaryAction && onSecondaryAction && (
          <button 
            className="auth-error-secondary-action" 
            onClick={onSecondaryAction}
          >
            {error.actions.secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
