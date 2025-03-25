import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../services/supabase/supabaseClient';
import { diagnoseAndFixAuth } from '../../services/auth/emailAuthFix';
// Only using directAccessLogin from this import
import { directAccessLogin } from '../../services/supabase/authService';
import './Diagnostic.css';

// Error display component
const ErrorAlert = ({ message }: { message: string | null }) => {
  if (!message) return null;
  
  return (
    <div className="error-alert">
      <strong>Error:</strong> {message}
      {message.includes('profile') && (
        <p>
          This could be a profile sync issue. Try clicking the "Diagnose & Fix" button to repair your account.
        </p>
      )}
    </div>
  );
};

interface AuthDiagnosticProps {
  onClose?: () => void;
}

export const AuthDiagnostic: React.FC<AuthDiagnosticProps> = ({ onClose }) => {
  const { authState, login, robustLogin, resendVerification, clearError } = useAuth();
  
  // Get auth state safely even if not logged in
  const safeAuthState = useMemo(() => authState || {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    session: null,
    requiresEmailConfirmation: false,
    confirmationMessage: null
  }, [authState]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const [diagnosticStatus, setDiagnosticStatus] = useState<string | null>(null);
  const [fixAttempted, setFixAttempted] = useState(false);
  const [fixResult, setFixResult] = useState<string | null>(null);

  // Run diagnostics on component mount
  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        // Check Supabase configuration
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
        
        const supabaseConfig = {
          url: supabaseUrl ? 'Configured' : 'Missing',
          key: supabaseKey ? 'Configured' : 'Missing',
          urlPrefix: supabaseUrl?.substring(0, 8) + '...' || 'undefined',
          keyPrefix: supabaseKey?.substring(0, 5) + '...' || 'undefined'
        };
        
        // Check session status
        const { data } = await supabase.auth.getSession();
        
        const sessionStatus = {
          active: !!data.session,
          expiration: data.session && data.session.expires_at 
            ? new Date(data.session.expires_at * 1000).toISOString() 
            : 'No session or expiration',
          userId: data.session?.user?.id || 'No user ID'
        };
        
        setDiagnosticInfo({
          supabaseConfig,
          authState: {
            isAuthenticated: safeAuthState.isAuthenticated,
            hasUser: !!safeAuthState.user,
            hasError: !!safeAuthState.error,
            errorMessage: safeAuthState.error || 'None',
            requiresEmailConfirmation: safeAuthState.requiresEmailConfirmation
          },
          sessionStatus,
          timestamp: new Date().toISOString()
        });
      } catch (err: any) {
        setDiagnosticInfo({
          error: err.message,
          timestamp: new Date().toISOString()
        });
      }
    };
    
    checkEnvironment();
  }, [safeAuthState]);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiagnosticStatus('Testing standard login...');
    
    try {
      await login(email, password);
      if (safeAuthState.error) {
        setDiagnosticStatus(`Standard login failed: ${safeAuthState.error}`);
      } else if (safeAuthState.requiresEmailConfirmation) {
        setDiagnosticStatus('Email confirmation required');
      } else {
        setDiagnosticStatus('Standard login successful!');
      }
    } catch (err: any) {
      setDiagnosticStatus(`Error: ${err.message}`);
    }
  };
  
  const handleRobustLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiagnosticStatus('Testing robust login with diagnostics...');
    
    try {
      await robustLogin(email, password);
      if (safeAuthState.error) {
        setDiagnosticStatus(`Robust login failed: ${safeAuthState.error}`);
      } else if (safeAuthState.requiresEmailConfirmation) {
        setDiagnosticStatus('Email confirmation required');
      } else {
        setDiagnosticStatus('Robust login successful!');
      }
    } catch (err: any) {
      setDiagnosticStatus(`Error: ${err.message}`);
    }
  };
  
  const handleResendVerification = async () => {
    setDiagnosticStatus('Resending verification email...');
    
    try {
      const result = await resendVerification(email);
      setDiagnosticStatus(result.message);
    } catch (err: any) {
      setDiagnosticStatus(`Error: ${err.message}`);
    }
  };
  
  // Direct login with redirect
  const handleDirectLogin = async () => {
    if (!email || !password) {
      setDiagnosticStatus('Email and password are required');
      return;
    }
    
    setDiagnosticStatus('Attempting direct login with redirect...');
    
    try {
      // Attempt a direct login
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      if (error) {
        setDiagnosticStatus(`Login error: ${error.message}`);
        return;
      }
      
      // Check session and give time for it to establish
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setDiagnosticStatus('Login successful! Redirecting to home page...');
        
        // Wait a bit to ensure session is fully established
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setDiagnosticStatus('Session not established after login. Try again.');
      }
    } catch (err: any) {
      setDiagnosticStatus(`Error: ${err.message}`);
    }
  };
  
  // Independent diagnose and fix function not requiring authentication
  const handleDiagnoseAndFixIndependent = async () => {
    setDiagnosticStatus('Running direct profile fix...');
    
    try {
      // First, attempt to sign in to get the user ID
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false, // Only attempt for existing users
        }
      });
      
      if (error) {
        console.log('OTP attempt for diagnostic purposes:', error.message);
        // Continue anyway - this was just to confirm user exists
      }
      
      // Try to find auth user by email using auth API
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user?.email === email.trim()) {
        // We have the user ID from the current session
        const userId = sessionData.session.user.id;
        
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId);
        
        if (existingProfile && existingProfile.length > 0) {
          // If profile exists but doesn't have name fields, add them
          // First get the existing profile to see what fields it has
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          // Update the profile with missing fields
          const updateData: any = { email: email.trim() };
          
          // Add first name if missing
          if (!profileData?.first_name) {
            updateData.first_name = 'User';
          }
          
          // Add last name if missing
          if (!profileData?.last_name) {
            updateData.last_name = 'Name';
          }
          
          // Add subscription tier if missing
          if (!profileData?.subscription_tier) {
            updateData.subscription_tier = 'FREE';
          }
          
          // Execute the update
          const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);
          
          if (updateError) {
            setFixAttempted(true);
            setFixResult(`Error updating profile: ${updateError.message}`);
            setDiagnosticStatus('Profile update failed');
            return;
          }
          
          setFixAttempted(true);
          setFixResult('Success: Profile updated with email');
          setDiagnosticStatus('Profile update complete - try logging in now');
          return;
        }
        
        // Profile doesn't exist, create it
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: email.trim(),
            first_name: 'User', // Add default first name
            last_name: 'Name',  // Add default last name
            created_at: new Date().toISOString(),
            subscription_tier: 'FREE'
          }]);
        
        if (createError) {
          setFixAttempted(true);
          setFixResult(`Error creating profile: ${createError.message}`);
          setDiagnosticStatus('Profile creation failed');
          return;
        }
        
        setFixAttempted(true);
        setFixResult('Success: Profile created for your account');
        setDiagnosticStatus('Profile creation complete - try logging in now');
        return;
      }
      
      // Direct DB query to check if there are any users with this email
      // This uses the profiles table directly
      const { data: profilesByEmail } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email.trim());
      
      if (profilesByEmail && profilesByEmail.length > 0) {
        setFixAttempted(true);
        setFixResult(`Profile with this email exists but not linked to your auth account. ID: ${profilesByEmail[0].id}`);
        setDiagnosticStatus('Found existing profile - admin assistance may be needed');
        return;
      }
      
      // If we can't find any user, tell user to try signing up
      setFixAttempted(true);
      setFixResult(`No user or profile found with email: ${email}. You may need to sign up.`);
      setDiagnosticStatus('Diagnostic complete - no user found');
      
    } catch (err: any) {
      setDiagnosticStatus(`Error: ${err.message}`);
      setFixAttempted(true);
      setFixResult(`Error: ${err.message}`);
    }
  };
  
  const handleDiagnoseAndFix = async () => {
    setDiagnosticStatus('Running comprehensive fix...');
    
    try {
      // First try our independent direct fix function
      await handleDiagnoseAndFixIndependent();
      
      // Only if that doesn't create any visible result, try the backup method
      if (!fixAttempted) {
        // Also try the original diagnose function as a backup
        const result = await diagnoseAndFixAuth(email);
        
        setFixAttempted(true);
        setFixResult(
          result.success 
            ? `Success: ${result.fixAttempted ? result.fixResult : 'No fixes needed'}` 
            : `Failed: ${result.issues.join(', ')}`
        );
      }
      
      setDiagnosticStatus('Fix attempt complete');
    } catch (err: any) {
      if (!fixAttempted) {
        setDiagnosticStatus(`Error: ${err.message}`);
        setFixAttempted(true);
        setFixResult(`Error: ${err.message}`);
      }
    }
  };

  // Magic link access (bypasses password authentication)
  const handleMagicLink = async () => {
    if (!email) {
      setDiagnosticStatus('Email is required');
      return;
    }
    
    setDiagnosticStatus('Sending magic link...');
    setFixAttempted(false);
    setFixResult(null);
    
    try {
      // Use our enhanced direct access function
      const result = await directAccessLogin(email.trim());
      
      if (!result.success) {
        setDiagnosticStatus(`Error: ${result.error}`);
        return;
      }
      
      setFixAttempted(true);
      setFixResult('Success: Magic link sent! Please check your email inbox.');
      setDiagnosticStatus('Magic link sent successfully. Check your email and click the link to log in.');
    } catch (err: any) {
      setDiagnosticStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="diagnostic-container">
      <h2>Authentication Diagnostic Tool</h2>
      
      {onClose && (
        <button 
          className="close-button"
          onClick={onClose}
        >
          Close
        </button>
      )}
      
      <div className="diagnostic-panel highlight">
        <h3>Account Recovery</h3>
        <p className="recovery-message">
          If you're having trouble logging in with an existing account, the system may need to create or update your user profile.
          Enter your email address and click "Diagnose & Fix" to attempt an automatic repair.
          You can also use our <a href="/magic-link" style={{ fontWeight: 'bold', color: '#4F46E5' }}>Magic Link Login Page</a> for a simpler login experience.
        </p>
        
        <div className="form-group">
          <label htmlFor="recovery-email">Your Email Address:</label>
          <input
            id="recovery-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter the email you signed up with"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="recovery-password">Password (for login attempts):</label>
          <input
            id="recovery-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
        
        <div className="button-group">
          <button 
            type="button" 
            className="diagnostic-button primary"
            onClick={handleDiagnoseAndFix}
            disabled={!email}
          >
            1. Diagnose & Fix My Account
          </button>
          
          <button 
            type="button" 
            className="diagnostic-button"
            onClick={handleMagicLink}
            disabled={!email}
          >
            2. Send Magic Link
          </button>
          
          <button 
            type="button" 
            className="diagnostic-button"
            onClick={handleDirectLogin}
            disabled={!email || !password}
          >
            3. Login & Redirect
          </button>
        </div>
        
        <p className="step-instructions">First click "Diagnose & Fix" to repair your profile, then either use the Magic Link option (recommended) or try direct login.</p>
        
        {safeAuthState.error && <ErrorAlert message={safeAuthState.error} />}
        
        {fixAttempted && fixResult && (
          <div className={`fix-result ${fixResult.includes('Success') ? 'success' : 'error'}`}>
            {fixResult}
          </div>
        )}
        
        {diagnosticStatus && (
          <div className={`status-message ${diagnosticStatus.includes('successful') ? 'success' : ''}`}>
            {diagnosticStatus}
          </div>
        )}
      </div>
      
      <div className="diagnostic-panel">
        <h3>System Information</h3>
        {diagnosticInfo ? (
          <pre className="diagnostic-output">
            {JSON.stringify(diagnosticInfo, null, 2)}
          </pre>
        ) : (
          <p>Loading diagnostic information...</p>
        )}
      </div>
      
      <div className="diagnostic-panel">
        <h3>Authentication Test</h3>
        <form onSubmit={handleStandardLogin} className="diagnostic-form">
          <div className="form-group">
            <label htmlFor="test-email">Email:</label>
            <input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="test-password">Password:</label>
            <input
              id="test-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="diagnostic-button"
            >
              Standard Login
            </button>
            
            <button 
              type="button" 
              className="diagnostic-button"
              onClick={handleRobustLogin}
            >
              Robust Login
            </button>
            
            <button
              type="button"
              className="diagnostic-button secondary"
              onClick={clearError}
              disabled={!safeAuthState.error}
            >
              Clear Error
            </button>
          </div>
        </form>
        
        <div className="button-group vertical">
          <button 
            type="button" 
            className="diagnostic-button"
            onClick={handleResendVerification}
            disabled={!email}
          >
            Resend Verification
          </button>
          
          <button 
            type="button" 
            className="diagnostic-button"
            onClick={handleDiagnoseAndFix}
            disabled={!email}
          >
            Diagnose & Fix
          </button>
        </div>
        
        {diagnosticStatus && (
          <div className={`status-message ${diagnosticStatus.includes('successful') ? 'success' : ''}`}>
            {diagnosticStatus}
          </div>
        )}
        
        {safeAuthState.error && <ErrorAlert message={safeAuthState.error} />}
        
        {fixAttempted && fixResult && (
          <div className={`fix-result ${fixResult.includes('Success') ? 'success' : 'error'}`}>
            {fixResult}
          </div>
        )}
      </div>
      
      <div className="diagnostic-panel">
        <h3>Common Authentication Issues</h3>
        <ul className="issue-list">
          <li>
            <strong>Email Not Verified:</strong> Verification email might be in spam folder or never received.
          </li>
          <li>
            <strong>Database Profile Missing:</strong> User exists in auth but profile wasn't created.
          </li>
          <li>
            <strong>Invalid Credentials:</strong> Case-sensitive password or email mismatch.
          </li>
          <li>
            <strong>Session Issues:</strong> Browser cookies might be blocked or expired.
          </li>
          <li>
            <strong>OAuth Problems:</strong> Popup blockers can prevent social login.
          </li>
        </ul>
      </div>
      
      <div className="diagnostic-panel">
        <h3>Direct Profile Fix</h3>
        <p>If the Diagnose & Fix option doesn't work, you can use this SQL query in Supabase:</p>
        <pre className="diagnostic-output">
{`UPDATE profiles 
SET 
  email = '${email || 'your.email@example.com'}',
  first_name = 'YourFirstName',
  last_name = 'YourLastName'
WHERE id = 'your-user-id';`}
        </pre>
        <p>Replace 'your-user-id' with your actual user ID from the diagnostic output above.</p>
      </div>
    </div>
  );
};

export default AuthDiagnostic;