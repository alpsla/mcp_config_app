import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import './styles/ProgressBar.css';
import MCPServerService from './services/mcpServerService';
import ConfigurationService from './services/configurationService';
import { MCPServer, MCPConfiguration } from './types';
import RouteHandler from './utils/RouteHandler';
import { useAuth } from './auth/AuthContext';

// Import shared header and footer components
import SharedHeader from './components/shared/SharedHeader';
import SharedFooter from './components/shared/SharedFooter';

// Import routes
import { getRoutes, getNavLinks } from './routes/AppRoutes';

const App = () => {
  const { authState, signOut } = useAuth();
  const isAuthenticated = authState?.user !== null;

  // Services
  const serverService = useMemo(() => new MCPServerService(), []);
  const configService = useMemo(() => new ConfigurationService(), []);

  // State for app configuration
  // These state variables are used by child components via props/context
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [servers, setServers] = useState<MCPServer[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filteredServers, setFilteredServers] = useState<MCPServer[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [categories, setCategories] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [configurations, setConfigurations] = useState<MCPConfiguration[]>([]);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [hasConfigurations, setHasConfigurations] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    // Load servers
    const allServers = serverService.getAllServers();
    setServers(allServers);
    setFilteredServers(allServers);
    
    // Load categories
    const allCategories = serverService.getCategories();
    setCategories(allCategories);
    
    // Load configurations
    if (authState?.user?.id) {
      const loadConfigurations = async () => {
        try {
          const allConfigurations = await configService.getAllConfigurations(authState.user.id);
          setConfigurations(allConfigurations);
          setHasConfigurations(allConfigurations.length > 0);
        } catch (error) {
          console.error('Failed to load configurations:', error);
          // Fallback to empty array
          setConfigurations([]);
          setHasConfigurations(false);
        }
      };
      
      loadConfigurations();
    } else {
      // If user is not authenticated, use local configurations
      const localConfigs = configService.getLocalConfigurations();
      setConfigurations(localConfigs);
      setHasConfigurations(localConfigs.length > 0);
    }
  }, [authState?.user?.id, configService, serverService]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      
      // Navigate to home page after sign out
      window.location.hash = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      showMessage('Failed to sign out. Please try again.', 'error');
    }
  };

  // Show message with auto-dismiss
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // Get navigation links for the header
  const navLinks = getNavLinks();

  // Get routes based on authentication and configuration state
  const routes = getRoutes(isAuthenticated, hasConfigurations);

  return (
    <div className="app">
      {/* Use the SharedHeader component for all pages */}
      <SharedHeader 
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        languageSelector={true}
      />

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <main className="app-content">
        <RouteHandler routes={routes} defaultRoute="/" />
      </main>

      {/* Use the SharedFooter component for all pages */}
      <SharedFooter />
    </div>
  );
};

export default App;