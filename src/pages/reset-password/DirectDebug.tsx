import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../services/supabase/supabaseClient';
import { useSafeNavigation } from '../../utils/navigation/useSafeNavigation';

/**
 * Component to directly test the password reset flow
 * This is a simplified version for debugging purposes
 */
const DirectDebug: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { navigateSafely } = useSafeNavigation();
  
  // Get Supabase configuration status
  const [supabaseStatus, setSupabaseStatus] = useState<{ configured: boolean; url?: string; }>({ 
    configured: false 
  });
  
  useEffect(() => {
    // Check Supabase configuration
    const checkSupabase = async () => {
      try {
        const configured = isSupabaseConfigured();
        const url = process.env.REACT_APP_SUPABASE_URL || 'Not configured';
        
        setSupabaseStatus({
          configured,
          url: url.substring(0, 30) + '...' // Truncate for display
        });
        
        // Try a simple request to see if Supabase is responding
        if (configured) {
          try {
            const { data, error } = await supabase.auth.getSession();
            console.log('Supabase session check:', data ? 'Success' : 'No session', error ? `Error: ${error.message}` : 'No error');
          } catch (err) {
            console.error('Error checking Supabase session:', err);
          }
        }
      } catch (err) {
        console.error('Error checking Supabase configuration:', err);
      }
    };
    
    checkSupabase();
  }, []);
  
  // Attempt to fix user profile issues
  const attemptProfileFix = async (userEmail: string) => {
    try {
      setStatus('Attempting to fix profile issues...');
      
      // First, check if we can get user information
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user data:', userError);
        setStatus(`User check error: ${userError.message}`);
        return false;
      }
      
      if (!userData || !userData.user) {
        console.log('No user data found - user is not authenticated');
        setStatus('No authenticated user found. Try signing in first.');
        return false;
      }
      
      // Now check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();
      
      if (profileError && !profileError.message.includes('No rows found')) {
        console.error('Error checking profile:', profileError);
        setStatus(`Profile check error: ${profileError.message}`);
        return false;
      }
      
      // If profile doesn't exist, create it
      if (!profileData) {
        console.log('No profile found, creating one...');
        
        const newProfile = {
          id: userData.user.id,
          email: userEmail,
          first_name: '',
          last_name: '',
          created_at: new Date().toISOString(),
          subscription_tier: 'FREE'
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          setStatus(`Profile creation error: ${insertError.message}`);
          return false;
        }
        
        console.log('Profile created successfully');
        setStatus('Profile created successfully. Try resetting password again.');
        return true;
      } else {
        console.log('Profile exists:', profileData);
        setStatus('User profile already exists.');
        return true;
      }
    } catch (err: any) {
      console.error('Profile fix error:', err);
      setStatus(`Profile fix error: ${err.message}`);
      return false;
    }
  };
  
  useEffect(() => {
    // Check the URL for reset parameters
    console.log('DirectDebug mounted');
    console.log('Current URL:', window.location.href);
    
    // Properly extract and handle the reset code
    let code = null;
    
    // First check the query parameters
    const urlParams = new URLSearchParams(location.search);
    code = urlParams.get('code');
    
    // Also check for code in parent URL if this is /debug path
    if (!code && location.pathname.includes('/debug')) {
      // Try getting code from the parent reset-password URL
      const resetBaseUrl = window.location.href.split('/debug')[0];
      // Extract parameters from the full URL (might be from the parent path)
      const fullUrl = new URL(resetBaseUrl);
      code = fullUrl.searchParams.get('code');
      
      console.log('Checking parent URL for code:', resetBaseUrl);
      
      // If code found in parent URL, update the URL to include it
      if (code) {
        console.log('Found code in parent URL:', code.substring(0, 8) + '...');
        // This helps with debugging but doesn't navigate
        window.history.replaceState(null, '', `${location.pathname}?code=${code}`);
      }
    }
    
    if (code) {
      setToken(code);
      setTokenType('code');
      console.log('Found code parameter:', code.substring(0, 8) + '...');
      setStatus('Code found in URL. Ready to reset password.');
    } else if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        setToken(accessToken);
        setTokenType('hash');
        console.log('Found access token in hash');
        setStatus('Access token found in URL hash. Ready to reset password.');
      } else {
        setStatus('No valid reset token found in URL hash.');
      }
    } else {
      setStatus('No reset token found in URL. Please request a password reset link.');
    }
  }, [location]);
  
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !password || password.length < 8) {
      setStatus('Please enter a valid password (at least 8 characters).');
      return;
    }
    
    setLoading(true);
    
    try {
      if (tokenType === 'code') {
        // Use direct updateUser method for password reset
        console.log('Resetting password directly instead of using code exchange');
        
        // Try direct password update first
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          });
          
          if (updateError) {
            console.error('Error updating password directly:', updateError);
            setStatus(`Error: ${updateError.message}`);
            
            // If error mentions verification or profile, offer to fix
            if (updateError.message.includes('verification') || 
                updateError.message.includes('profile') || 
                updateError.message.includes('not allowed')) {
              setStatus(`Error: ${updateError.message}. Try using the "Fix Profile Issues" button below.`);
            }
            
          } else {
            console.log('Password updated successfully');
            setStatus('Password reset successful! Redirecting to login...');
            
            // Redirect to login after success
            setTimeout(() => {
              navigateSafely('/login');
            }, 3000);
          }
        } catch (updateErr: any) {
          console.error('Exception during direct password update:', updateErr);
          setStatus(`Error updating password: ${updateErr.message}`);
        }
      } else if (tokenType === 'hash') {
        // Use access token to reset password
        const { error } = await supabase.auth.updateUser({
          password: password
        });
        
        if (error) {
          console.error('Error updating password with access token:', error);
          setStatus(`Error: ${error.message}`);
        } else {
          console.log('Password updated successfully with access token');
          setStatus('Password reset successful! Redirecting to login...');
          
          // Redirect to login after success
          setTimeout(() => {
            navigateSafely('/login');
          }, 3000);
        }
      } else {
        setStatus('No valid reset token available. Please request a new password reset link.');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to try and fix email verification
  const fixEmailVerification = async () => {
    try {
      setStatus('Attempting to verify email...');
      
      // Get the email from the URL if possible
      const urlParams = new URLSearchParams(location.search);
      const email = urlParams.get('email') || '';
      
      if (!email) {
        setStatus('No email found in URL. Please enter your email in the form below.');
        return;
      }
      
      // Try to sign in to check if user exists
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email
      });
      
      if (signInError) {
        console.error('Error sending OTP:', signInError);
        setStatus(`Error sending verification: ${signInError.message}`);
        return;
      }
      
      setStatus(`Verification email sent to ${email}. Please check your inbox.`);
    } catch (err: any) {
      console.error('Email verification error:', err);
      setStatus(`Error verifying email: ${err.message}`);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">MCP Configuration Tool</h1>
        <h2 className="auth-subtitle">Debug Reset Password</h2>
        
        <div className="debug-info" style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Debug Information</h3>
          <div><strong>URL:</strong> {window.location.href}</div>
          <div><strong>Token Type:</strong> {tokenType || 'None'}</div>
          <div><strong>Token:</strong> {token ? `${token.substring(0, 8)}...` : 'None'}</div>
          <div><strong>Status:</strong> {status}</div>
          <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
            <strong>Supabase Config:</strong> {supabaseStatus.configured ? 'Configured' : 'Not Configured'}<br />
            <strong>Supabase URL:</strong> {supabaseStatus.url || 'Not available'}<br />
            <strong>Environment:</strong> {process.env.NODE_ENV || 'Not set'}<br />
            <strong>Mock API:</strong> {process.env.REACT_APP_USE_MOCK_API === 'true' ? 'Enabled' : 'Disabled'}<br />
          </div>
        </div>
        
        {token ? (
          <form onSubmit={handleReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your new password"
                minLength={8}
              />
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                Password must be at least 8 characters long
              </small>
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={loading || !password || password.length < 8}
            >
              {loading ? 'Resetting Password...' : 'Reset Password (Debug)'}
            </button>
            
            <div className="button-group" style={{ marginTop: '15px' }}>
              <button
                type="button"
                className="auth-button secondary"
                onClick={() => attemptProfileFix(token)}
              >
                Fix Profile Issues
              </button>
              <button
                type="button"
                className="auth-button secondary"
                onClick={fixEmailVerification}
              >
                Fix Email Verification
              </button>
            </div>
          </form>
        ) : (
          <div className="auth-error-container">
            <p>No reset token found. Please request a password reset link.</p>
            <div className="button-group" style={{ marginTop: '20px' }}>
              <button 
                className="auth-button" 
                onClick={() => navigateSafely('/forgot-password')}
              >
                Request Password Reset
              </button>
              <button
                className="auth-button secondary"
                onClick={() => attemptProfileFix(token || '')}
              >
                Fix Profile Issues
              </button>
            </div>
          </div>
        )}
        
        <div className="auth-toggle">
          <button 
            type="button" 
            onClick={() => navigateSafely('/login')}
          >
            Back to Login
          </button>
          <button 
            type="button" 
            onClick={() => navigateSafely('/forgot-password')}
          >
            Forgot Password
          </button>
          <button 
            type="button" 
            onClick={() => navigateSafely('/reset-password')}
          >
            Standard Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectDebug;
