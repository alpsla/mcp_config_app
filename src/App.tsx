import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import MCPServerService from './services/mcpServerService';
import ConfigurationService from './services/configurationService';
import { MCPServer, MCPConfiguration } from './types';
import RouteHandler from './utils/RouteHandler';
import { navigate } from './utils/RouteHandler';
import SubscriptionFlow from './components/subscription/SubscriptionFlow';

// Import page components
import HomePage from './pages/main/HomePage';
import Homepage from './pages/homepage/Homepage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/main/Dashboard';
import PricingPage from './pages/main/PricingPage';
import DocumentationPage from './pages/main/DocumentationPage';
import ConfigurationPage from './pages/configuration/ConfigurationPage';
import MainConfigurationFlow from './components/configuration/MainConfigurationFlow';
import { useAuth } from './auth/AuthContext';

// Import shared header and footer components
import SharedHeader from './components/shared/SharedHeader';
import SharedFooter from './components/shared/SharedFooter';
import AuthCallbackPage from './pages/auth/callback';

// Import test and configuration components
import TestHuggingFaceRender from './components/TestHuggingFaceRender';
import Configure from './pages/configuration/Configure';

const App: React.FC = () => {
  const { authState, signOut } = useAuth();
  const isAuthenticated = authState?.user !== null;

  // Services
  const serverService = useMemo(() => new MCPServerService(), []);
  const configService = useMemo(() => new ConfigurationService(), []);

  // State
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

  // Define routes, conditionally rendering based on auth and configuration state
  const routes = [
    // Home page - different based on authentication
    { 
      path: '/', 
      component: isAuthenticated ? HomePage : Homepage 
    },
    { path: '/login', component: LoginPage },
    { path: '/signin', component: LoginPage },
    { path: '/subscribe', component: (props) => <SubscriptionFlow onComplete={() => navigate('/configuration')} {...props} /> },
    { path: '/subscribe/basic', component: (props) => <SubscriptionFlow initialTier="basic" onComplete={() => navigate('/configuration')} {...props} /> },
    { path: '/subscribe/complete', component: (props) => <SubscriptionFlow initialTier="complete" onComplete={() => navigate('/configuration')} {...props} /> },
    // Dashboard - different based on configuration history
    { 
      path: '/dashboard', 
      component: hasConfigurations 
        ? DashboardPage // Dashboard for users with configurations
        : DashboardPage // Config management dashboard
    },
    { 
      path: '/dashboard/intro', 
      component: DashboardPage // Introductory dashboard
    },
    { path: '/pricing', component: PricingPage },
    { path: '/documentation', component: DocumentationPage },
    // Use either legacy configuration or new enhanced flow
    { 
      path: '/configuration', 
      component: MainConfigurationFlow // New enhanced flow 
    },
    { 
      path: '/configuration/:id', 
      component: MainConfigurationFlow 
    },
    // Keep legacy configuration page route for backward compatibility
    { 
      path: '/legacy-configuration', 
      component: ConfigurationPage 
    },
    { 
      path: '/legacy-configuration/:id', 
      component: ConfigurationPage 
    },
    // Auth callback route for magic links and OAuth
    {
      path: '/auth/callback',
      component: AuthCallbackPage
    },
    // Test route
    {
      path: '/test-huggingface',
      component: TestHuggingFaceRender
    },
    // Redirect from old route to new route
    {
      path: '/configure',
      component: Configure
    },
  ];

  // Show message with auto-dismiss
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // We no longer need this since we're using RouteHandler
  // const currentPath = window.location.hash.substring(1).split('?')[0] || '/';
  
  // Create the navigation links array for the header
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/documentation', label: 'Documentation' }
  ];

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