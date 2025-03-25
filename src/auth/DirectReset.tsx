import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase/supabaseClient';
import { useSafeNavigation } from '../utils/navigation/useSafeNavigation';
import './AuthContainer.css';
import './AuthFix.css';

/**
 * A simplified password reset component that focuses on direct password update
 * without the complexity of token validation
 */
const DirectReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetCodeFound, setResetCodeFound] = useState<boolean>(false);
  const [resetCode, setResetCode] = useState<string | null>(null);
  
  const location = useLocation();
  const { navigateSafely } = useSafeNavigation();
  
  // Check for reset code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('Direct Reset: Found reset code:', code.substring(0, 8) + '...');
      setResetCodeFound(true);
      setResetCode(code);
    } else {
      console.log('Direct Reset: No reset code found in URL');
      setResetCodeFound(false);
      setError('No reset code found. Please request a new password reset link.');
    }
  }, [location]);
  
  // Attempt to fix profile issues
  const attemptProfileFix = async () => {
    try {
      setMessage(null);
      setError('Attempting to fix profile issues... This may take a moment.');
      setLoading(true);
      
      // First check if user exists in Supabase auth
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user data:', userError);
        setError(`User check error: ${userError.message}`);
        setLoading(false);
        return;
      }
      
      if (!userData || !userData.user) {
        // User may not be authenticated - try exchanging the reset code first
        if (resetCode) {
          try {
            console.log('Attempting to exchange code for session...');
            
            // This might fail but we'll continue anyway
            await supabase.auth.exchangeCodeForSession(resetCode);
            
            // Check if we have a user now
            const { data: newUserData } = await supabase.auth.getUser();
            
            if (!newUserData || !newUserData.user) {
              setError('Could not authenticate with reset code.');
              setLoading(false);
              return;
            }
          } catch (err: any) {
            console.log('Code exchange failed, continuing anyway:', err.message);
          }
        } else {
          setError('You are not signed in. Please sign in to fix profile issues.');
          setLoading(false);
          return;
        }
      }
      
      // Get user data again after possible authentication
      const { data: checkedUserData } = await supabase.auth.getUser();
      
      if (!checkedUserData || !checkedUserData.user) {
        setError('Could not authenticate user.');
        setLoading(false);
        return;
      }
      
      console.log('User authenticated:', checkedUserData.user.email);
      
      // Now check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', checkedUserData.user.id)
        .single();
      
      if (profileError && !profileError.message.includes('No rows found')) {
        console.error('Error checking profile:', profileError);
        setError(`Profile check error: ${profileError.message}`);
        setLoading(false);
        return;
      }
      
      // If profile doesn't exist, create it
      if (!profileData) {
        console.log('No profile found, creating one...');
        
        const newProfile = {
          id: checkedUserData.user.id,
          email: checkedUserData.user.email,
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
          setError(`Profile creation error: ${insertError.message}`);
          setLoading(false);
          return;
        }
        
        console.log('Profile created successfully');
        setMessage('Profile created successfully. You can now reset your password.');
      } else {
        console.log('Profile exists:', profileData);
        setMessage('Your user profile is already set up properly.');
      }
    } catch (err: any) {
      console.error('Profile fix error:', err);
      setError(`Profile fix error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      // Skip exchange code and directly update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) {
        console.error('Error updating password:', updateError);
        setError(`Error: ${updateError.message}`);
        
        // If error mentions session, try to create one
        if (updateError.message.includes('session') || updateError.message.includes('valid credentials')) {
          setError('Your reset link appears to be invalid or expired. Please request a new one.');
        }
      } else {
        console.log('Password updated successfully');
        setMessage('Your password has been successfully updated! Redirecting to login...');
        
        // Redirect to login after a brief delay
        setTimeout(() => {
          navigateSafely('/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">MCP Configuration Tool</h1>
        <h2 className="auth-subtitle">Reset Your Password</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}
        
        {resetCodeFound && !message ? (
          <form className="auth-form" onSubmit={handleSubmit}>
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
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Confirm your new password"
              />
            </div>
            
            <div className="auth-helper-text">
              <p>Password must be at least 8 characters long</p>
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        ) : !message ? (
          <div className="auth-error-container">
            <p>No valid reset code found. Please request a new password reset link.</p>
            <div className="button-group" style={{ marginTop: '15px' }}>
            <button 
            className="auth-button" 
            onClick={() => navigateSafely('/login')}
            >
            Back to Login
            </button>
            <button 
            className="auth-button secondary" 
            onClick={() => navigateSafely('/forgot-password')}
            >
            Request New Reset Link
            </button>
              <button 
              className="auth-button secondary" 
              onClick={attemptProfileFix}
            >
              Fix Profile Issues
            </button>
          </div>
          </div>
        ) : null}
        
        <div className="auth-toggle">
          <button type="button" onClick={() => navigateSafely('/login')}>
            Back to Login
          </button>
          {!resetCodeFound && (
            <button type="button" onClick={() => navigateSafely('/forgot-password')}>
              Forgot Password
            </button>
          )}
          {process.env.NODE_ENV === 'development' && (
            <button 
              type="button" 
              onClick={() => navigateSafely('/reset-password/debug')}
              style={{ color: '#6b7280' }}
            >
              Debug Mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectReset;