import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../services/supabase/supabaseClient';
import { diagnoseAndFixAuth } from '../../services/auth/emailAuthFix';
import './Diagnostic.css';

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
  
  // Independent diagnose and fix function not requiring authentication
  const handleDiagnoseAndFixIndependent = async () => {
    setDiagnosticStatus('Running email verification diagnostic...');
    
    try {
      // Extract user ID from entered email
      const { data: userList } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email);
      
      if (!userList || userList.length === 0) {
        setFixAttempted(true);
        setFixResult(`No user found with email: ${email}`);
        setDiagnosticStatus('Diagnostic complete - no user found');
        return;
      }
      
      const userId = userList[0].id;
      
      // Update the profile with the email and optional names
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: email,
          first_name: 'User', // Default value
          last_name: 'Name'   // Default value
        })
        .eq('id', userId);
      
      if (updateError) {
        setFixAttempted(true);
        setFixResult(`Error updating profile: ${updateError.message}`);
        setDiagnosticStatus('Profile update failed');
        return;
      }
      
      setFixAttempted(true);
      setFixResult('Success: Profile updated with email and name values');
      setDiagnosticStatus('Profile fix complete');
      
    } catch (err: any) {
      setDiagnosticStatus(`Error: ${err.message}`);
      setFixAttempted(true);
      setFixResult(`Error: ${err.message}`);
    }
  };
  
  const handleDiagnoseAndFix = async () => {
    setDiagnosticStatus('Running email verification diagnostic...');
    
    try {
      // First try our independent direct fix function
      await handleDiagnoseAndFixIndependent();
      
      // Also try the original diagnose function as a backup
      const result = await diagnoseAndFixAuth(email);
      if (!fixAttempted) {
        setFixAttempted(true);
        setFixResult(
          result.success 
            ? `Success: ${result.fixAttempted ? result.fixResult : 'No fixes needed'}`
            : `Failed: ${result.issues.join(', ')}`
        );
      }
      
      setDiagnosticStatus('Diagnostic complete');
    } catch (err: any) {
      if (!fixAttempted) {
        setDiagnosticStatus(`Error: ${err.message}`);
        setFixAttempted(true);
        setFixResult(`Error: ${err.message}`);
      }
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
