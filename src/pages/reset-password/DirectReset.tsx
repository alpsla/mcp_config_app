import React, { useState, useEffect } from 'react';
import { resetPasswordWithToken, extractResetToken } from '../../services/auth/passwordResetHandler';
import './styles.css';

const DirectReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL on load
    const token = extractResetToken();
    setResetToken(token);

    if (!token) {
      setError('You need a valid reset link to access this page. Please request a new password reset from the login page.');
      console.error('No reset token found in URL');
    } else {
      console.log('Valid reset token found: ' + token.substring(0, 8) + '...');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!resetToken) {
      setError('No reset token available. Please request a new password reset link.');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Resetting password with token...');
      
      const result = await resetPasswordWithToken(password, resetToken);
      
      if (!result.success) {
        throw new Error(result.error || 'Password reset failed');
      }
      
      setResetSuccess(true);
      setMessage('Password has been reset successfully! You can now sign in with your new password.');
      console.log('Password reset successful');
    } catch (error: any) {
      console.error('Error during password reset:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h1 className="reset-title">MCP Configuration Tool</h1>
        <h2 className="reset-subtitle">Reset Your Password</h2>
        
        {error && <div className="reset-error">{error}</div>}
        {message && <div className="reset-success">{message}</div>}
        
        {!resetSuccess ? (
          <form className="reset-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !resetToken}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !resetToken}
              />
            </div>
            
            <button
              type="submit"
              className="reset-button"
              disabled={loading || !resetToken}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <div className="help-section">
              <p className="help-text">
                Having trouble? Try these steps:
              </p>
              <ul className="help-list">
                <li>Make sure you're using the most recent reset link</li>
                <li>Check that you're not using an expired link (links expire after 24 hours)</li>
                <li>Try requesting a new password reset from the login page</li>
              </ul>
              <button
                type="button"
                className="text-button"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h3>Password Reset Successful!</h3>
            <p>Your password has been changed successfully. You can now log in with your new password.</p>
            <button
              className="reset-button"
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectReset;
