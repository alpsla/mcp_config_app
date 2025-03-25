import React, { useState, useEffect } from 'react';
import { AuthProvider } from './auth/AuthContext';
import { AuthContainer } from './auth/AuthContainer';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAuth } from './auth/AuthContext';
import { SupabaseCheck } from './components/diagnostic/SupabaseCheck';
import { AuthDiagnostic } from './components/diagnostic/AuthDiagnostic';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/reset-password';
import './App.css';

const AuthenticatedApp: React.FC = () => {
  const { authState, logout } = useAuth();
  const user = authState.user;
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">MCP Config Tool</div>
        <div className="app-user-info">
          <span>{user?.email}</span>
          <button onClick={logout} className="signout-button">Sign Out</button>
        </div>
      </header>
      <main className="app-main">
        <Dashboard />
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} MCP Configuration Tool</p>
          <p className="beta-indicator">Beta Version</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

// We need this component to use the useAuth hook inside the AuthProvider
const AppContent: React.FC = () => {
  const { authState } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  
  // Listen to path changes
  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
      console.log('Path changed to:', window.location.pathname);
      
      // Log query parameters for debugging
      const urlParams = new URLSearchParams(window.location.search);
      const codeParam = urlParams.get('code');
      if (codeParam) {
        console.log('Reset code detected:', codeParam.substring(0, 5) + '...');
      }
      
      console.log('URL hash:', window.location.hash);
    };
    
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);
  
  // Process the current path on initial load
  useEffect(() => {
    console.log('Initial path:', currentPath);
    console.log('Initial search params:', window.location.search);
    console.log('Initial hash:', window.location.hash);
    
    // Check for reset code
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      console.log('Reset code detected on load:', codeParam.substring(0, 5) + '...');
    }
  }, [currentPath]);
  
  // Check for reset password code or hash to trigger the reset form
  const urlParams = new URLSearchParams(window.location.search);
  const resetCode = urlParams.get('code');
  const isResetPasswordRequest = currentPath === '/reset-password' || resetCode || window.location.hash.includes('type=recovery');
  
  // Check for the auth-diagnostic path
  if (currentPath === '/auth-diagnostic') {
    console.log('Showing authentication diagnostic tool');
    return <AuthDiagnostic />;
  }
  
  // Check for email verification
  if (currentPath === '/verify-email' || window.location.search.includes('error=access_denied') || window.location.search.includes('error=otp_expired')) {
    console.log('Detected email verification request or error');
    return <VerifyEmail />;
  }
  
  // Check for reset password request
  if (isResetPasswordRequest) {
    console.log('Detected password reset request');
    // Log additional details to help with debugging
    if (resetCode) {
      console.log(`Reset code found: ${resetCode.substring(0, 8)}... URL: ${window.location.href}`);
    } else if (window.location.hash.includes('type=recovery')) {
      console.log('Recovery hash detected, URL:', window.location.href);
    } else {
      console.log('No specific reset parameters found, URL:', window.location.pathname + window.location.search);
    }
    return <ResetPassword />;
  }
  
  return (
    <div>
      <SupabaseCheck />
      {currentPath === '/auth-diagnostic' ? (
        <AuthDiagnostic />
      ) : (
        authState.user ? <AuthenticatedApp /> : <AuthContainer />
      )}
      
      {/* Temporary diagnostic tool access link */}
      <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#4F46E5', padding: '10px 15px', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'}}>
        <a href="/auth-diagnostic" style={{color: 'white', textDecoration: 'none', fontWeight: 'bold'}}>
          Auth Diagnostic Tool
        </a>
      </div>
    </div>
  );
};

// Export App as both a named export and a default export
export { App };
export default App;
