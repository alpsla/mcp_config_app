import React, { useState, useEffect } from 'react';
import SharedHeader from '../../components/shared/SharedHeader';
import SharedFooter from '../../components/shared/SharedFooter';
import './ConfigurationPage.css';
import { useAuth } from '../../auth/AuthContext';

// Import configuration components
import WebSearchConfig from '../../components/configuration/WebSearchConfig';
import FileSystemConfig from '../../components/configuration/FileSystemConfig';
import HuggingFaceConfig from '../../components/configuration/HuggingFaceConfig';
import { UserConfigService } from '../../services/userConfigService';

const ConfigurationPage = ({ history, onSaveConfiguration }) => {
  // Get authentication state from context
  const { authState, signOut, getUserSubscriptionTier, updateSubscriptionTier } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Selected server state
  const [selectedServer, setSelectedServer] = useState(null);
  
  // Get current subscription tier
  const subscriptionTier = getUserSubscriptionTier();
  
  // Server configurations state
  const [configurations, setConfigurations] = useState({
    webSearch: {
      enabled: false,
      config: {} // Will store web search specific configuration
    },
    fileSystem: {
      enabled: false,
      config: {} // Will store file system specific configuration
    },
    huggingFace: {
      enabled: false,
      config: {} // Will store Hugging Face specific configuration
    }
  });

  // Configuration name
  const [configName, setConfigName] = useState("My MCP Configuration");

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
  
  // Set authentication state based on AuthContext
  useEffect(() => {
    const userIsAuthenticated = authState.user !== null;
    setIsAuthenticated(userIsAuthenticated);
    
    console.log('ConfigurationPage: Authentication state updated', { isAuthenticated: userIsAuthenticated });
  }, [authState]);

  // Toggle server configuration - the critical function that handles toggle clicks
  const toggleServerConfig = (serverType, event) => {
    if (event) {
      event.stopPropagation(); // Stop event propagation to prevent card click
    }
    
    // Special handling for Hugging Face - check subscription
    if (serverType === 'huggingFace' && !configurations.huggingFace.enabled && 
        (subscriptionTier === 'none' || subscriptionTier === 'free')) {
      // For non-subscribers, auto-upgrade for testing
      handleSubscribeNow();
      return;
    }
    
    // Actually update the configuration state
    setConfigurations(prevConfig => ({
      ...prevConfig,
      [serverType]: {
        ...prevConfig[serverType],
        enabled: !prevConfig[serverType].enabled
      }
    }));
    
    // If enabling, select this server
    if (!configurations[serverType].enabled) {
      setSelectedServer(serverType);
    } else if (selectedServer === serverType) {
      // If disabling the currently selected server, clear selection
      setSelectedServer(null);
    }
  };

  // Handle subscription upgrade
  const handleSubscribeNow = async () => {
    try {
      // For testing purposes, directly upgrade to basic tier
      await updateSubscriptionTier('basic');
      
      // After upgrading, enable Hugging Face
      setConfigurations(prevConfig => ({
        ...prevConfig,
        huggingFace: {
          ...prevConfig.huggingFace,
          enabled: true
        }
      }));
      
      // Also select Hugging Face
      setSelectedServer('huggingFace');
      
      alert('Subscription upgraded to Basic tier. You can now use Hugging Face models.');
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  // Update configuration for a specific server
  const updateServerConfig = (serverType, newConfig) => {
    setConfigurations(prevConfig => ({
      ...prevConfig,
      [serverType]: {
        ...prevConfig[serverType],
        config: {
          ...prevConfig[serverType].config,
          ...newConfig
        }
      }
    }));
  };

  // Export configuration as JSON
  const exportConfiguration = () => {
    const enabledServers = Object.entries(configurations)
      .filter(([_, config]) => config.enabled)
      .reduce((acc, [serverType, serverConfig]) => {
        // Transform server config for export format
        let exportConfig = {};
        
        // Implement proper export format for each server type
        switch(serverType) {
          case 'webSearch':
            exportConfig = {
              command: "npx",
              args: ["@anthropic-ai/mcp-web-search", ...formatWebSearchArgs(serverConfig.config)]
            };
            break;
          case 'fileSystem':
            exportConfig = {
              command: "npx",
              args: ["@anthropic-ai/mcp-filesystem", ...formatFileSystemArgs(serverConfig.config)]
            };
            break;
          case 'huggingFace':
            exportConfig = {
              command: "npx",
              args: ["@anthropic-ai/mcp-huggingface", ...formatHuggingFaceArgs(serverConfig.config)]
            };
            break;
          default:
            break;
        }
        
        // Add to accumulated config
        return {
          ...acc,
          [serverType]: exportConfig
        };
      }, {});
    
    // Final JSON structure
    const exportJSON = {
      mcpServers: enabledServers
    };
    
    // Convert to string and copy to clipboard
    const jsonString = JSON.stringify(exportJSON, null, 2);
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        alert('Configuration copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy configuration:', err);
        alert('Failed to copy configuration. See console for details.');
      });
    
    return jsonString;
  };
  
  // Save configuration and return to dashboard
  const saveConfiguration = async () => {
    // Generate the configuration JSON
    const configJSON = exportConfiguration();
    
    try {
      if (authState.user?.id) {
        await UserConfigService.saveConfiguration(
          authState.user.id,
          configName,
          JSON.parse(configJSON)
        );
      }
      
      // Call the parent component's save function if provided
      if (onSaveConfiguration) {
        onSaveConfiguration({
          name: configName,
          configuration: JSON.parse(configJSON)
        });
      }
      
      // Navigate back to dashboard
      if (history && history.push) {
        history.push('/dashboard');
      } else {
        window.location.hash = '/dashboard';
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };
  
  // Helper functions to format args for each server type
  const formatWebSearchArgs = (config) => {
    const args = ["--results-count", String(config.resultsCount || "3")];
    
    if (config.safeSearch !== undefined) {
      args.push("--safe-search", config.safeSearch ? "true" : "false");
    }
    
    return args;
  };
  
  const formatFileSystemArgs = (config) => {
    const args = [];
    
    if (config.directories && config.directories.length > 0) {
      args.push("--directory");
      args.push(config.directories[0]); // Currently only supporting one directory
    }
    
    return args;
  };
  
  const formatHuggingFaceArgs = (config) => {
    const args = [];
    
    if (config.selectedModel) {
      args.push("--model", config.selectedModel);
    }
    
    if (config.token) {
      args.push("--token", config.token);
    }
    
    return args;
  };

  // Render the right panel content based on selected server
  const renderRightPanel = () => {
    if (!selectedServer) {
      return (
        <div className="config-empty-state">
          <div className="config-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h3>Select a Service to Configure</h3>
          <p>Choose an option from the left panel to get started with your MCP configuration.</p>
        </div>
      );
    }
    
    switch(selectedServer) {
      case 'webSearch':
        return (
          <WebSearchConfig 
            config={configurations.webSearch.config}
            updateConfig={(newConfig) => updateServerConfig('webSearch', newConfig)}
          />
        );
      case 'fileSystem':
        return (
          <FileSystemConfig 
            config={configurations.fileSystem.config}
            updateConfig={(newConfig) => updateServerConfig('fileSystem', newConfig)}
          />
        );
      case 'huggingFace':
        return (
          <HuggingFaceConfig 
            config={configurations.huggingFace.config}
            updateConfig={(newConfig) => updateServerConfig('huggingFace', newConfig)}
          />
        );
      default:
        return null;
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
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        languageSelector={true}
      />
      
      <main className="config-main">
        <div className="config-container">
          <div className="config-header">
            <h1 className="config-title">Configure New MCP Server</h1>
            <div className="config-name-input">
              <label htmlFor="configName">Configuration Name:</label>
              <input 
                type="text" 
                id="configName" 
                value={configName} 
                onChange={(e) => setConfigName(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <p className="config-description">
            Configure Claude AI capabilities by selecting and setting up the services you want to enable.
          </p>
          
          <div className="config-layout">
            {/* Left Panel: Server Selection */}
            <div className="config-left-panel">
              <h2 className="config-panel-title">Available Services</h2>
              
              <div className="config-server-list">
                <div 
                  className={`config-server-item ${configurations.webSearch.enabled ? 'enabled' : ''} ${selectedServer === 'webSearch' ? 'selected' : ''}`}
                  onClick={() => setSelectedServer('webSearch')}
                >
                  <div className="config-server-toggle">
                    <input 
                      type="checkbox" 
                      id="webSearch" 
                      checked={configurations.webSearch.enabled}
                      onChange={(e) => toggleServerConfig('webSearch', e)}
                    />
                    <label 
                      htmlFor="webSearch" 
                      className="toggle-switch"
                      onClick={(e) => toggleServerConfig('webSearch', e)}
                    ></label>
                  </div>
                  <div className="config-server-info">
                    <h3>Web Search</h3>
                    <p>Enable Claude to search the web for up-to-date information.</p>
                  </div>
                </div>
                
                <div 
                  className={`config-server-item ${configurations.fileSystem.enabled ? 'enabled' : ''} ${selectedServer === 'fileSystem' ? 'selected' : ''}`}
                  onClick={() => setSelectedServer('fileSystem')}
                >
                  <div className="config-server-toggle">
                    <input 
                      type="checkbox" 
                      id="fileSystem" 
                      checked={configurations.fileSystem.enabled}
                      onChange={(e) => toggleServerConfig('fileSystem', e)}
                    />
                    <label 
                      htmlFor="fileSystem" 
                      className="toggle-switch"
                      onClick={(e) => toggleServerConfig('fileSystem', e)}
                    ></label>
                  </div>
                  <div className="config-server-info">
                    <h3>File System Access</h3>
                    <p>Allow Claude to access files on your computer.</p>
                  </div>
                </div>
                
                <div 
                  className={`config-server-item ${configurations.huggingFace.enabled ? 'enabled' : ''} ${selectedServer === 'huggingFace' ? 'selected' : ''}`}
                  onClick={() => setSelectedServer('huggingFace')}
                >
                  <div className="config-server-toggle">
                    <input 
                      type="checkbox" 
                      id="huggingFace" 
                      checked={configurations.huggingFace.enabled}
                      onChange={(e) => toggleServerConfig('huggingFace', e)}
                    />
                    <label 
                      htmlFor="huggingFace" 
                      className="toggle-switch"
                      onClick={(e) => toggleServerConfig('huggingFace', e)}
                    ></label>
                  </div>
                  <div className="config-server-info">
                    <h3>Hugging Face Models</h3>
                    <p>Connect specialized AI models to extend Claude's capabilities.</p>
                    {(subscriptionTier === 'none' || subscriptionTier === 'free') && (
                      <button className="subscription-button" onClick={handleSubscribeNow}>
                        Subscribe Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="config-actions">
                <button 
                  className="btn-primary btn-export" 
                  onClick={exportConfiguration}
                  disabled={!Object.values(configurations).some(config => config.enabled)}
                >
                  Export Configuration
                </button>
                
                <button 
                  className="btn-secondary btn-save" 
                  onClick={saveConfiguration}
                  disabled={!Object.values(configurations).some(config => config.enabled)}
                >
                  Save Configuration
                </button>
                
                <button 
                  className="btn-tertiary btn-cancel" 
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* Right Panel: Configuration Options */}
            <div className="config-right-panel">
              {renderRightPanel()}
            </div>
          </div>
        </div>
      </main>
      
      <SharedFooter />
    </>
  );
};

export default ConfigurationPage;