import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase/supabaseClient';
import './AuthContainer.css';
import './AuthFix.css';

export const VerifyEmail: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL
        const hash = location.hash;
        const query = new URLSearchParams(hash.substring(1)); // Remove the '#' character
        const accessToken = query.get('access_token');
        const refreshToken = query.get('refresh_token');
        const type = query.get('type');
        
        // Check if this is a valid email verification URL
        if (!accessToken || type !== 'signup') {
          setError('Invalid or missing verification token. Please check your email for a valid link or request a new one.');
          setLoading(false);
          return;
        }

        // Verify the token with Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
        
        if (sessionError) {
          console.error('Verification error:', sessionError);
          setError('Your verification link has expired or is invalid. Please request a new one.');
        } else {
          // Verification successful
          setMessage('Your email has been successfully verified! Redirecting to login...');
          
          // Redirect to login page after a brief delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err: any) {
        console.error('Email verification error:', err);
        setError('An error occurred during email verification. Please try again or request a new verification link.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">MCP Configuration Tool</h1>
        <h2 className="auth-subtitle">Email Verification</h2>
        
        {loading ? (
          <div className="auth-loading">
            <p>Verifying your email address...</p>
          </div>
        ) : (
          <div className="auth-result">
            {error && (
              <div className="auth-error-container">
                <p>{error}</p>
                <button 
                  className="auth-button" 
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            )}
            
            {message && (
              <div className="auth-success">
                <p>{message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
