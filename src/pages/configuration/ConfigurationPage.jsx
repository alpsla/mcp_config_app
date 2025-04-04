import React, { useState, useEffect } from 'react';
import SharedHeader from '../../components/shared/SharedHeader';
import SharedFooter from '../../components/shared/SharedFooter';
import ConfigurationManager from '../../components/ConfigurationManager';
import TestComponent from '../../components/TestComponent'; // Import the test component
import { InfoIcon } from '../../components/icons';
import { UserConfigService } from '../../services/userConfigService';
import { useAuth } from '../../auth/AuthContext';
import '../../styles/ConfigurationStyles.css';

const ConfigurationPage = ({ history, onSaveConfiguration }) => {
  // Get authentication state from context
  const { authState, signOut, getUserSubscriptionTier } = useAuth();
  
  // Subscription tier
  const [subscriptionTier, setSubscriptionTier] = useState(getUserSubscriptionTier() || 'none');
  
  // Configuration state
  const [configuration, setConfiguration] = useState({});
  
  // Check authentication state on mount
  useEffect(() => {
    const userIsAuthenticated = authState?.user !== null;
    console.log('ConfigurationPage: Authentication state updated', { isAuthenticated: userIsAuthenticated });
    
    // Redirect if not authenticated
    if (!userIsAuthenticated && history?.push) {
      history.push('/login');
    }
  }, [authState, history]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Handle configuration updates
  const handleConfigurationUpdate = (newConfig) => {
    setConfiguration(newConfig);
    
    // If onSaveConfiguration callback exists, call it
    if (onSaveConfiguration) {
      onSaveConfiguration(newConfig);
    }
  };
  
  // Save configuration to database
  const saveConfiguration = async (config) => {
    try {
      if (authState?.user?.id) {
        await UserConfigService.saveConfiguration(
          authState.user.id,
          config.name || 'Unnamed Configuration',
          config
        );
        
        // Redirect to dashboard
        if (history && history.push) {
          history.push('/dashboard');
        } else {
          window.location.hash = '/dashboard';
        }
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };
  
  return (
    <>
      <SharedHeader 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/features', label: 'Features' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/documentation', label: 'Documentation' }
        ]}
        isAuthenticated={authState?.user !== null}
        onSignOut={handleSignOut}
        languageSelector={true}
      />
      
      {/* Add the test component */}
      <TestComponent />
      
      <main className="mcp-studio-main">
        <div className="mcp-studio-container">
          <div className="studio-header">
            <h1 className="studio-title">MCP Studio</h1>
            
            <div className="subscription-controls">
              <span>Subscription: </span>
              <select 
                value={subscriptionTier} 
                onChange={(e) => setSubscriptionTier(e.target.value)}
                className="subscription-selector"
              >
                <option value="none">Not Subscribed</option>
                <option value="basic">Basic ($2/month)</option>
                <option value="complete">Complete ($5/month)</option>
              </select>
            </div>
          </div>
          
          {/* New Configuration Manager */}
          <ConfigurationManager 
            onConfigurationComplete={handleConfigurationUpdate}
            userTier={subscriptionTier}
          />
        </div>
      </main>
      
      <footer className="configuration-footer">
        <div className="desktop-notice">
          <InfoIcon />
          <p>Desktop Application Required: These integrations require the Claude Desktop application.</p>
          <a href="#/learn-more">Learn More</a>
        </div>
      </footer>
      
      <SharedFooter />
    </>
  );
};

export default ConfigurationPage;