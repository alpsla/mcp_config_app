import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { AuthContainer } from './auth/AuthContainer';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAuth } from './auth/AuthContext';
import { SupabaseCheck } from './components/diagnostic/SupabaseCheck';
import { AuthDiagnostic } from './components/diagnostic/AuthDiagnostic';
import ErrorBoundary from './components/ErrorBoundary';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/reset-password';
import DirectDebug from './pages/reset-password/DirectDebug';
import ForgotPassword from './pages/forgot-password';
import AuthCallbackPage from './pages/auth/callback';
import MagicLinkPage from './pages/magic-link';
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
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

// Protected Route component to handle authentication
const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { authState } = useAuth();
  const location = useLocation();
  
  if (!authState.user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// We need this component to use the useAuth hook inside the AuthProvider
const AppContent: React.FC = () => {
  const { authState } = useAuth();
  const location = useLocation();
  
  // Log path changes
  useEffect(() => {
    console.log('Path changed to:', location.pathname);
    
    // Log query parameters for debugging
    const urlParams = new URLSearchParams(location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      console.log('Reset code detected:', codeParam.substring(0, 5) + '...');
    }
    
    console.log('URL hash:', location.hash);
  }, [location]);
  
  return (
    <div>
      <SupabaseCheck />
      
      <ErrorBoundary>
        <Routes>
          <Route path="/auth-diagnostic" element={<AuthDiagnostic />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/debug" element={<DirectDebug />} />
          <Route path="/magic-link" element={<MagicLinkPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/login" element={<AuthContainer />} />
          <Route path="/" element={
            authState.user ? (
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

// Export App as both a named export and a default export
export { App };
export default App;