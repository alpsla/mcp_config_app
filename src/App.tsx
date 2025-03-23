import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { AuthContainer } from './auth/AuthContainer';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAuth } from './auth/AuthContext';
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
  
  if (authState.user) {
    return <AuthenticatedApp />;
  }
  
  return <AuthContainer />;
};

// Export App as both a named export and a default export
export { App };
export default App;
