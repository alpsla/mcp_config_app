import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * Component to diagnose and fix authentication issues
 */
export const AuthFix: React.FC = () => {
  const { authState, login, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);

  // Helper function to check if an object has the expected shape
  const validateObject = (obj: any, expectedKeys: string[]): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    return expectedKeys.every(key => key in obj);
  };

  // Run diagnostics on component mount
  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        // Check if Supabase is configured
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
        
        // Try to get services
        const authServiceDiag = {
          url: supabaseUrl ? 'OK' : 'Missing',
          key: supabaseKey ? 'OK' : 'Missing',
          urlValue: supabaseUrl?.substring(0, 10) + '...' || 'undefined',
          keyValue: supabaseKey?.substring(0, 5) + '...' || 'undefined'
        };
        
        // Get basic auth state info
        const authStateDiag = {
          userPresent: authState.user ? 'Yes' : 'No',
          isAuthenticated: authState.isAuthenticated ? 'Yes' : 'No',
          loading: authState.loading ? 'Yes' : 'No',
          error: authState.error || 'None',
          validStructure: validateObject(authState, [
            'user', 'loading', 'error', 'isAuthenticated', 'session'
          ]) ? 'Yes' : 'No'
        };
        
        setDiagnosticInfo({
          authService: authServiceDiag,
          authState: authStateDiag,
          timestamp: new Date().toISOString()
        });
      } catch (err: any) {
        setDiagnosticInfo({
          error: err.message,
          timestamp: new Date().toISOString()
        });
      }
    };
    
    runDiagnostics();
  }, [authState]);

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestStatus('Testing login...');
    
    try {
      await login(email, password);
      if (authState.error) {
        setTestStatus(`Login failed: ${authState.error}`);
      } else {
        setTestStatus('Login successful!');
      }
    } catch (err: any) {
      setTestStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="auth-fix-container" style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>Authentication Diagnostic Tool</h2>
      
      <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
        <h3>System Diagnostics</h3>
        {diagnosticInfo ? (
          <pre style={{ overflow: 'auto', maxHeight: 300 }}>
            {JSON.stringify(diagnosticInfo, null, 2)}
          </pre>
        ) : (
          <p>Running diagnostics...</p>
        )}
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <h3>Test Authentication</h3>
        <form onSubmit={handleTestLogin}>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="test-email" style={{ display: 'block', marginBottom: 5 }}>
              Email:
            </label>
            <input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label htmlFor="test-password" style={{ display: 'block', marginBottom: 5 }}>
              Password:
            </label>
            <input
              id="test-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#4F46E5', 
              color: 'white', 
              border: 'none', 
              borderRadius: 5,
              cursor: 'pointer'
            }}
          >
            Test Login
          </button>
          
          {authState.error && (
            <button
              type="button"
              onClick={clearError}
              style={{ 
                marginLeft: 10,
                padding: '10px 15px', 
                backgroundColor: '#6B7280', 
                color: 'white', 
                border: 'none', 
                borderRadius: 5,
                cursor: 'pointer'
              }}
            >
              Clear Error
            </button>
          )}
        </form>
        
        {testStatus && (
          <div 
            style={{ 
              marginTop: 15, 
              padding: 10, 
              backgroundColor: testStatus.includes('successful') ? '#D1FAE5' : '#FEE2E2',
              borderRadius: 5
            }}
          >
            {testStatus}
          </div>
        )}
      </div>
      
      <div>
        <h3>Common Authentication Issues</h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: 20 }}>
          <li>
            <strong>Email verification:</strong> If you're getting email verification errors, check your inbox and spam folder for the verification email.
          </li>
          <li>
            <strong>Credentials mismatch:</strong> Ensure case sensitivity matches what you used during registration.
          </li>
          <li>
            <strong>OAuth errors:</strong> For social login issues, check if popup blockers are preventing the OAuth window from opening.
          </li>
          <li>
            <strong>Session persistence:</strong> If logged in but keep getting logged out, check browser cookie settings.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthFix;
