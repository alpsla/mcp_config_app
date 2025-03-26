import React, { useState } from 'react';
import '../AuthStatus.css';
// import { Link } from 'react-router-dom'; // Not currently used
import { useAuth } from '../../../auth/AuthContext';
import { sendMagicLink } from '../../../services/auth/magicLinkAuth';
import { validateEmail } from '../../../utils/validation';
import { AuthErrorType, AuthErrorHandler } from '../../../utils/authErrorHandler';
import { AuthErrorMessage } from '../../AuthErrorMessage';
import '../../auth/MagicLinkLogin.css';

/**
 * SignIn Component
 * 
 * Dedicated component for returning user authentication without name fields
 */
const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { socialLogin } = useAuth();
  const [validationError, setValidationError] = useState<{
    type: AuthErrorType;
    message: string;
    actions: ReturnType<typeof AuthErrorHandler.getErrorAction>;
  } | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  // Clear any existing error
  const clearValidationError = () => {
    setValidationError(null);
  };
  
  // Validate the form - checks email format
  const validateForm = (): boolean => {
    // Clear previous validation errors
    clearValidationError();
    
    // Check email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setValidationError({
        type: AuthErrorType.INVALID_EMAIL,
        message: emailValidation.message,
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.INVALID_EMAIL)
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log('Sending magic link to:', email);
      
      // Send magic link
      const result = await sendMagicLink(email);
      console.log('Magic link result:', result);
      
      if (result.error) {
        console.error('Magic link error:', result.error);
        setStatus(`Error: ${result.error}`);
        return;
      }
      
      // Show success message
      setVerificationMessage(
        result.message || 'A login link has been sent to your email. Please check your inbox (including spam/junk folders).'
      );
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">MCP Configuration Tool</h1>
        <h2 className="auth-subtitle">Sign In</h2>

        {validationError && (
          <AuthErrorMessage 
            error={validationError} 
            onPrimaryAction={() => setValidationError(null)}
            onSecondaryAction={() => setValidationError(null)}
          />
        )}
        
        {verificationMessage ? (
          <div className="auth-verification-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>{verificationMessage}</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear validation error when user starts typing
                  if (validationError?.type === AuthErrorType.INVALID_EMAIL) {
                    clearValidationError();
                  }
                }}
                required
                disabled={loading}
                placeholder="Enter your email address"
              />
            </div>
            
            <div className="auth-help-text">
              <p>
                We'll send you a secure login link via email.
                No password needed!
              </p>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading || !email}
            >
              {loading
                ? 'Sending...'
                : 'Sign In with Email'}
            </button>
            
            {status && <div className="auth-status-message">{status}</div>}
            
            {/* Account creation link removed as per requirements */}
          </form>
        )}

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="social-button google"
            onClick={() => socialLogin('google')}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className="social-button github"
            onClick={() => socialLogin('github')}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;