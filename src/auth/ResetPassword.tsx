import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase/supabaseClient';
import { validatePassword, validatePasswordMatch } from '../utils/validation';
import { AuthErrorType, AuthErrorHandler } from '../utils/authErrorHandler';
import { AuthErrorMessage } from '../components/AuthErrorMessage';
import { useSafeNavigation } from '../utils/navigation/useSafeNavigation';
import './AuthContainer.css';
import './AuthFix.css';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<{
    type: AuthErrorType;
    message: string;
    actions: ReturnType<typeof AuthErrorHandler.getErrorAction>;
  } | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const location = useLocation();
  const { navigateSafely } = useSafeNavigation();

  // Add debugging message when component loads
  useEffect(() => {
    console.log('ResetPassword component mounted');
    console.log('Current URL:', window.location.href);
    console.log('Location state:', location);
    
    // Check if we're in development mode and should show debug page
    if (process.env.NODE_ENV === 'development') {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      
      if (code) {
        // In development, redirect to debug page to diagnose issues
        console.log('Development mode: redirecting to debug page with code');
        navigateSafely(`/reset-password/debug?code=${code}`);
      }
    }
  }, [location, navigateSafely]);

  // Extract hash parameters and validate token
  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log('Checking for reset token...');
        console.log('Current URL:', window.location.href);
        console.log('Hash:', location.hash);
        console.log('Search params:', location.search);
        
        // Two potential formats for reset token:
        // 1. Hash format: #access_token=xxx&refresh_token=xxx&type=recovery
        // 2. Query param format: ?code=xxx
        
        // First check for code parameter (most common)
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (code) {
          console.log('Found code parameter in URL:', code.substring(0, 8) + '...');
          // With code param, don't need to validate further at this point
          setTokenValid(true);
          return;
        }
        
        // If no code, check for hash format
        let accessToken = null;
        let refreshToken = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let tokenType = null;
        
        if (location.hash) {
          const hash = location.hash;
          const query = new URLSearchParams(hash.substring(1)); // Remove the '#' character
          accessToken = query.get('access_token');
          refreshToken = query.get('refresh_token');
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          tokenType = query.get('type');
          
          if (accessToken) {
            console.log('Found access token in hash');
          }
        }
        
        // No code, check if we have an access token
        if (!accessToken) {
          console.log('No token found in URL');
          setTokenValid(false);
          setError('No reset token found. Please request a new password reset link.');
          return;
        }

        // Validate the token
        console.log('Found token, validating...');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
        
        if (error) {
          console.error('Token validation error:', error);
          setTokenValid(false);
          setError('Your password reset link has expired. Please request a new one.');
        } else {
          console.log('Token is valid, user can reset password');
          setTokenValid(true);
        }
      } catch (err: any) {
        console.error('Error validating token:', err);
        setTokenValid(false);
        setError('An error occurred while validating your reset link. Please try again or request a new link.');
      }
    };

    checkToken();
  }, [location]);

  const validateForm = (): boolean => {
    // Clear previous validation errors
    setValidationError(null);
    
    // Check password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setValidationError({
        type: AuthErrorType.INVALID_PASSWORD,
        message: passwordValidation.message,
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.INVALID_PASSWORD)
      });
      return false;
    }

    // Validate password confirmation
    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.valid) {
      setValidationError({
        type: AuthErrorType.PASSWORDS_DONT_MATCH,
        message: passwordMatchValidation.message,
        actions: AuthErrorHandler.getErrorAction(AuthErrorType.PASSWORDS_DONT_MATCH)
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
    setError(null);
    setMessage(null);

    try {
      console.log('Attempting to update password');

      // Check if we have a code in the URL
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      
      console.log('Code parameter for password reset:', code ? `${code.substring(0, 8)}...` : 'No code found');
      
      // If we have a code, use it to update the password
      let updateError;
      
      if (code) {
        console.log('Using code parameter to exchange for session');
        try {
          // Set up the session with the code
          const { data, error: setSessionError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (setSessionError) {
            console.error('Error exchanging code for session:', setSessionError);
            updateError = setSessionError;
          } else {
            console.log('Successfully exchanged code for session:', data ? 'Session established' : 'No session data');
            // Now update password with the session
            const { error } = await supabase.auth.updateUser({
              password: password,
            });
            
            if (error) {
              console.error('Error updating password with session:', error);
            } else {
              console.log('Password update successful');
            }
            
            updateError = error;
          }
        } catch (exchangeError: any) {
          console.error('Exception during code exchange:', exchangeError);
          updateError = exchangeError;
        }
      } else {
        // Use normal session update (from token)
        const { error } = await supabase.auth.updateUser({
          password: password,
        });
        updateError = error;
      }

      if (updateError) {
        console.error('Error updating password:', updateError);
        setError(updateError.message);
      } else {
        setMessage('Your password has been successfully reset! Redirecting to login...');
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
          navigateSafely('/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (tokenValid === null) {
      // Still checking token validity
      return (
        <div className="auth-loading">
          <p>Validating your password reset link...</p>
        </div>
      );
    }

    if (tokenValid === false) {
      // Invalid or expired token
      return (
        <div className="auth-error-container">
          <h3>Password Reset Failed</h3>
          <p>{error}</p>
          <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              className="auth-button" 
              onClick={() => navigateSafely('/login')}
            >
              Go to Login
            </button>
            <button 
              className="auth-button secondary" 
              onClick={() => navigateSafely('/forgot-password')}
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      );
    }

    // Token is valid, show password reset form
    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}
        
        {validationError && (
          <AuthErrorMessage 
            error={validationError} 
            onPrimaryAction={() => setValidationError(null)}
            onSecondaryAction={() => setValidationError(null)}
          />
        )}

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationError?.type === AuthErrorType.INVALID_PASSWORD) {
                setValidationError(null);
              }
            }}
            required
            disabled={loading}
            placeholder="Enter your new password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationError?.type === AuthErrorType.PASSWORDS_DONT_MATCH) {
                setValidationError(null);
              }
            }}
            required
            disabled={loading}
            placeholder="Confirm your new password"
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
        
        <div className="auth-helper-text">
          <p>
            Password must be at least 8 characters long and include a mix of 
            letters, numbers, and special characters for better security.
          </p>
        </div>
      </form>
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">MCP Configuration Tool</h1>
        <h2 className="auth-subtitle">Reset Your Password</h2>
        
        {renderContent()}
        
        <div className="auth-toggle">
          <button type="button" onClick={() => navigateSafely('/login')}>
            Back to Login
          </button>
          {tokenValid === false && (
            <button type="button" onClick={() => navigateSafely('/forgot-password')}>
              Request New Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
