import React, { useEffect } from 'react';
import SignIn from './components/auth/signin/SignIn';
// SignUp component removed as per requirements
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Dashboard from './components/dashboard';
import { useAuth } from './auth/AuthContext';
import { AuthDiagnostic } from './components/diagnostic/AuthDiagnostic';
import ErrorBoundary from './components/ErrorBoundary';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/reset-password';
import DirectDebug from './pages/reset-password/DirectDebug';
import ForgotPassword from './pages/forgot-password';
import AuthCallbackPage from './pages/auth/callback';
import MagicLinkPage from './pages/magic-link';
// New pages
import Homepage from './pages/homepage/Homepage';
import Pricing from './components/pricing/Pricing';
// Profile components not currently used
// import ProfileCompletion from './components/profile/ProfileCompletion';
// import ProfileChecker from './components/profile/ProfileChecker';
import './App.css';

// Removed AuthenticatedApp component as we are now using the standalone Dashboard component

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
      <ErrorBoundary>
        <Routes>
          <Route path="/auth-diagnostic" element={<AuthDiagnostic />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/debug" element={<DirectDebug />} />
          <Route path="/magic-link" element={<MagicLinkPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/login" element={
            authState.loading ? (
              <div className="loading-screen">
                <p>Loading...</p>
              </div>
            ) : (
              authState.user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <SignIn />
              )
            )
          } />
          <Route path="/signup" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={
            authState.loading ? (
              <div className="loading-screen">
                <p>Loading...</p>
              </div>
            ) : (
              authState.user ? (
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" replace />
              )
            )
          } />
          <Route path="/" element={<Homepage />} />
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