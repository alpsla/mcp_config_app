import React, { useState } from 'react';
import { resetPassword } from '../../services/supabase/authService';
import { validateEmail } from '../../utils/validation';
import { AuthErrorType, AuthErrorHandler } from '../../utils/authErrorHandler';
import { AuthErrorMessage } from '../../components/AuthErrorMessage';
import { useSafeNavigation } from '../../utils/navigation/useSafeNavigation';
import '../../auth/AuthContainer.css';
import '../../auth/AuthFix.css';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<{
    type: AuthErrorType;
    message: string;
    actions: ReturnType<typeof AuthErrorHandler.getErrorAction>;
  } | null>(null);

  // Use our safe navigation hook
  const { navigateSafely } = useSafeNavigation();

  const validateForm = (): boolean => {
    // Clear previous validation errors
    setValidationError(null);
    
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
    setError(null);
    setMessage(null);

    try {
      const result = await resetPassword(email);
      
      if (result.error) {
        // Use enhanced error handling
        const diagnosis = AuthErrorHandler.diagnoseError(result.error);
        setValidationError({
          type: diagnosis.type,
          message: diagnosis.message,
          actions: AuthErrorHandler.getErrorAction(diagnosis.type)
        });
      } else {
        setMessage(result.message || 'Reset instructions sent! Please check your email, including spam/junk folders.');
      }
    } catch (err: any) {
      console.error('Password reset request error:', err);
      
      // Use enhanced error handling for unhandled errors
      const diagnosis = AuthErrorHandler.diagnoseError(err);
      setValidationError({
        type: diagnosis.type,
        message: diagnosis.message,
        actions: AuthErrorHandler.getErrorAction(diagnosis.type)
      });
    } finally {
      setLoading(false);
    }
  };

  // Render the form or success message
  const renderContent = () => {
    if (message) {
      // Show success message and return to login button
      return (
        <div className="auth-success-container">
          <div className="auth-success">{message}</div>
          <button
            className="auth-button secondary"
            onClick={() => navigateSafely('/login')}
          >
            Return to Login
          </button>
          
          {/* Debug link only shown in development */}
          {process.env.NODE_ENV === 'development' && (
            <button
              className="auth-button text-button"
              style={{ marginTop: '10px', fontSize: '13px', color: '#6b7280' }}
              onClick={() => navigateSafely('/reset-password/debug')}
            >
              Debug Reset Flow
            </button>
          )}
        </div>
      );
    }

    // Show the form
    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError?.type === AuthErrorType.INVALID_EMAIL) {
                setValidationError(null);
              }
            }}
            required
            disabled={loading}
            placeholder="Enter your email address"
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading || !email}
        >
          {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
        </button>
        
        <div className="auth-helper-text">
          <p>
            If an account exists with this email address, you will receive instructions 
            to reset your password.
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
        
        {error && <div className="auth-error">{error}</div>}
        
        {validationError && (
          <AuthErrorMessage 
            error={validationError} 
            onPrimaryAction={() => setValidationError(null)}
            onSecondaryAction={() => setValidationError(null)}
          />
        )}

        {renderContent()}
        
        {!message && (
          <div className="auth-toggle">
            <button 
              type="button" 
              onClick={() => navigateSafely('/login')}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
