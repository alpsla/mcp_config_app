import React, { useState } from 'react';
import { sendMagicLink } from '../../services/auth/magicLinkAuth';
import './MagicLinkLogin.css';

interface MagicLinkLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * Magic Link Login Component
 * 
 * Provides a simple form for magic link authentication
 * Includes validation and error handling
 */
const MagicLinkLogin: React.FC<MagicLinkLoginProps> = ({ 
  onSuccess, 
  onError,
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple email validation
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous status
    setStatus(null);
    setError(null);
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Log more details for debugging
      console.log('Sending magic link to:', email);
      
      // Send magic link
      const result = await sendMagicLink(email);
      console.log('Magic link send result:', result);
      
      if (!result.success) {
        setError(result.error || 'Failed to send magic link');
        onError && onError(result.error || 'Failed to send magic link');
      } else {
        setStatus(result.message || 'Magic link sent! Please check your email.');
        onSuccess && onSuccess();
      }
    } catch (err: any) {
      console.error('Error sending magic link:', err);
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      onError && onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`magic-link-login ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Email Sign In</h3>
          <p>
            Enter your email to receive a secure sign-in link. 
            No password required. Check your inbox after submitting.
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-control"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {status && (
          <div className="success-message">
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default MagicLinkLogin;