import React, { useState, useEffect } from 'react';
import SharedHeader from '../../components/shared/SharedHeader';
import SharedFooter from '../../components/shared/SharedFooter';
import WebSearchConfig from '../../components/configuration/WebSearchConfig';
import FileSystemConfig from '../../components/configuration/FileSystemConfig';
import HuggingFaceConfig from '../../components/configuration/HuggingFaceConfig';
import { InfoIcon } from '../../components/icons';
import { UserConfigService } from '../../services/userConfigService';
import { useAuth } from '../../auth/AuthContext';
import '../../styles/ConfigurationStyles.css';
import '../../styles/ProgressBar.css';

const ConfigurationPage = ({ history, onSaveConfiguration }) => {
  // Get authentication state from context
  const { authState, signOut, getUserSubscriptionTier, updateSubscriptionTier } = useAuth();
  
  // Active service for configuration
  const [activeService, setActiveService] = useState(null);
  
  // Multi-step process state
  const [currentStep, setCurrentStep] = useState(1); // 1: Select, 2: Configure, 3: Validate, 4: Deploy
  
  // Subscription tier
  const [subscriptionTier, setSubscriptionTier] = useState(getUserSubscriptionTier() || 'none');
  
  // Service configurations
  const [services, setServices] = useState([
    {
      id: 'webSearch',
      name: 'Web Search',
      description: 'Allow Claude to search the internet for up-to-date information.',
      enabled: false,
      configured: false,
      config: {
        resultsCount: 5,
        safeSearch: true,
        useTrustedSources: false
      }
    },
    {
      id: 'fileSystem',
      name: 'File System Access',
      description: 'Allow Claude to read and write files on your computer.',
      enabled: false,
      configured: false,
      config: {
        directories: []
      }
    },
    {
      id: 'huggingFace',
      name: 'Hugging Face Models',
      description: 'Connect specialized AI models to extend Claude\'s capabilities.',
      enabled: false,
      configured: false,
      requiresSubscription: true,
      config: {
        token: '',
        selectedModels: []
      }
    }
  ]);
  
  // Configuration name
  const [configName, setConfigName] = useState("My MCP Configuration");
  
  // Validation status
  const [validationStatus, setValidationStatus] = useState({
    isValidating: false,
    isValid: false,
    errors: []
  });
  
  // Deployment status
  const [deploymentStatus, setDeploymentStatus] = useState({
    isDeploying: false,
    isDeployed: false,
    error: null
  });
  
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
  
  // Function to toggle a service on/off
  const toggleService = (serviceId) => {
    // Check if trying to enable Hugging Face without subscription
    const service = services.find(s => s.id === serviceId);
    if (serviceId === 'huggingFace' && 
        !service.enabled && 
        service.requiresSubscription && 
        subscriptionTier === 'none') {
      // Show subscription prompt
      handleUpgradeSubscription();
      return;
    }
    
    // Toggle the service
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, enabled: !service.enabled } 
        : service
    ));
    
    // If enabling, make this the active service
    if (!service.enabled) {
      setActiveService(serviceId);
    } else if (activeService === serviceId) {
      // If disabling the active service, clear selection
      setActiveService(null);
    }
  };
  
  // Function to select a service
  const selectService = (serviceId) => {
    setActiveService(serviceId);
  };
  
  // Update service configuration
  const updateServiceConfig = (serviceId, newConfig) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, config: { ...service.config, ...newConfig } } 
        : service
    ));
  };
  
  // Save the configuration of a service
  const saveServiceConfiguration = (serviceId) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, configured: true } 
        : service
    ));
    
    console.log(`Configuration saved for ${serviceId}`);
    
    // Check if all enabled services are configured
    const allConfigured = services
      .filter(service => service.enabled)
      .every(service => service.configured || service.id === serviceId);
    
    if (allConfigured) {
      // If all are configured, move to validation step
      setCurrentStep(3);
    }
  };
  
  // Function to upgrade subscription
  const handleUpgradeSubscription = () => {
    // For demo purposes, upgrade to next tier
    if (subscriptionTier === 'none') {
      setSubscriptionTier('basic');
      if (updateSubscriptionTier) {
        updateSubscriptionTier('basic');
      }
    } else if (subscriptionTier === 'basic') {
      setSubscriptionTier('complete');
      if (updateSubscriptionTier) {
        updateSubscriptionTier('complete');
      }
    }
    
    // Enable Hugging Face service after upgrade
    setServices(services.map(service => 
      service.id === 'huggingFace' 
        ? { ...service, enabled: true } 
        : service
    ));
    
    // Make Hugging Face the active service
    setActiveService('huggingFace');
  };
  
  // Check if a service's configuration is valid for saving
  const isServiceConfigValid = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return false;
    
    switch (serviceId) {
      case 'fileSystem':
        return service.config.directories && service.config.directories.length > 0;
      case 'webSearch':
        return service.config.resultsCount > 0;
      case 'huggingFace':
        return service.config.token && 
               service.config.token.length >= 8 && 
               service.config.selectedModels && 
               service.config.selectedModels.length > 0;
      default:
        return false;
    }
  };
  
  // Generate export configuration JSON
  const generateExportConfig = () => {
    const enabledServers = services
      .filter(service => service.enabled && service.configured)
      .reduce((acc, service) => {
        let exportConfig = {};
        
        // Format each service's config for export
        switch(service.id) {
          case 'webSearch':
            exportConfig = {
              command: "npx",
              args: [
                "@anthropic-ai/mcp-web-search", 
                "--results-count", 
                String(service.config.resultsCount),
                ...(service.config.safeSearch !== undefined ? ["--safe-search", service.config.safeSearch ? "true" : "false"] : [])
              ]
            };
            break;
          case 'fileSystem':
            exportConfig = {
              command: "npx",
              args: [
                "@anthropic-ai/mcp-filesystem", 
                ...(service.config.directories && service.config.directories.length > 0 
                  ? ["--directory", service.config.directories[0]] 
                  : [])
              ]
            };
            break;
          case 'huggingFace':
            exportConfig = {
              command: "npx",
              args: [
                "@anthropic-ai/mcp-huggingface",
                ...(service.config.selectedModels && service.config.selectedModels.length > 0
                  ? ["--model", service.config.selectedModels[0]]
                  : []),
                "--token", "ENV:HF_TOKEN" // Use environment variable for token
              ]
            };
            break;
          default:
            break;
        }
        
        return {
          ...acc,
          [service.id]: exportConfig
        };
      }, {});
    
    return {
      mcpServers: enabledServers
    };
  };
  
  // Validate the configuration
  const validateConfiguration = async () => {
    setValidationStatus({
      ...validationStatus,
      isValidating: true,
      errors: []
    });
    
    try {
      // In a real implementation, this would call an API to validate
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if any services are enabled
      const enabledServices = services.filter(service => service.enabled);
      if (enabledServices.length === 0) {
        setValidationStatus({
          isValidating: false,
          isValid: false,
          errors: ['At least one service must be enabled.']
        });
        return;
      }
      
      // Check if all enabled services are configured
      const unconfiguredServices = enabledServices.filter(service => !service.configured);
      if (unconfiguredServices.length > 0) {
        setValidationStatus({
          isValidating: false,
          isValid: false,
          errors: [`The following services need to be configured: ${unconfiguredServices.map(s => s.name).join(', ')}`]
        });
        return;
      }
      
      // Perform service-specific validation
      const validationErrors = [];
      
      for (const service of enabledServices) {
        switch (service.id) {
          case 'fileSystem':
            if (!service.config.directories || service.config.directories.length === 0) {
              validationErrors.push('File System: At least one directory must be added.');
            }
            break;
          case 'huggingFace':
            if (!service.config.token) {
              validationErrors.push('Hugging Face: API token is required.');
            } else if (service.config.token.length < 8) {
              validationErrors.push('Hugging Face: API token is invalid.');
            }
            
            if (!service.config.selectedModels || service.config.selectedModels.length === 0) {
              validationErrors.push('Hugging Face: At least one model must be selected.');
            }
            break;
          default:
            break;
        }
      }
      
      // Set validation status
      if (validationErrors.length > 0) {
        setValidationStatus({
          isValidating: false,
          isValid: false,
          errors: validationErrors
        });
      } else {
        setValidationStatus({
          isValidating: false,
          isValid: true,
          errors: []
        });
        
        // Move to deployment step
        setCurrentStep(4);
      }
    } catch (error) {
      console.error('Error validating configuration:', error);
      setValidationStatus({
        isValidating: false,
        isValid: false,
        errors: ['An error occurred during validation. Please try again.']
      });
    }
  };
  
  // Deploy the configuration
  const deployConfiguration = async () => {
    setDeploymentStatus({
      ...deploymentStatus,
      isDeploying: true,
      error: null
    });
    
    try {
      // Generate export configuration
      const exportConfig = generateExportConfig();
      
      // In a real implementation, this would save to a file, database, etc.
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save configuration
      if (authState?.user?.id) {
        await UserConfigService.saveConfiguration(
          authState.user.id,
          configName,
          exportConfig
        );
      }
      
      // Call parent component's save function if provided
      if (onSaveConfiguration) {
        onSaveConfiguration({
          name: configName,
          configuration: exportConfig
        });
      }
      
      setDeploymentStatus({
        isDeploying: false,
        isDeployed: true,
        error: null
      });
      
      // Optionally redirect to dashboard
      setTimeout(() => {
        if (history && history.push) {
          history.push('/dashboard');
        } else {
          window.location.hash = '/dashboard';
        }
      }, 2000);
    } catch (error) {
      console.error('Error deploying configuration:', error);
      setDeploymentStatus({
        isDeploying: false,
        isDeployed: false,
        error: 'An error occurred during deployment. Please try again.'
      });
    }
  };
  
  // Function to copy configuration to clipboard
  const copyConfigToClipboard = () => {
    const exportConfig = generateExportConfig();
    const jsonString = JSON.stringify(exportConfig, null, 2);
    
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        alert('Configuration copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy configuration:', err);
        alert('Failed to copy configuration. See console for details.');
      });
  };
  
  // Get service status text
  const getServiceStatus = (service) => {
    if (!service.enabled) return "Inactive";
    if (service.configured) return "Active";
    return "Pending Configuration";
  };
  
  // Get service status class
  const getStatusClass = (service) => {
    if (!service.enabled) return "inactive";
    if (service.configured) return "active";
    return "pending";
  };
  
  // Render the progress bar
  const renderProgressBar = () => {
    return (
      <div className="progress-bar">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select Services</div>
        </div>
        <div className="progress-connector"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Configure</div>
        </div>
        <div className="progress-connector"></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Validate</div>
        </div>
        <div className="progress-connector"></div>
        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Deploy</div>
        </div>
      </div>
    );
  };
  
  // Render the content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Select Services
        return renderServiceSelection();
      case 2: // Configure
        return renderServiceConfiguration();
      case 3: // Validate
        return renderValidation();
      case 4: // Deploy
        return renderDeployment();
      default:
        return null;
    }
  };
  
  // Render the service selection step
  const renderServiceSelection = () => {
    return (
      <div className="step-content selection-step">
        <h2>Select MCP Services</h2>
        <p className="step-description">
          Choose which services you want to enable for your Claude MCP configuration.
        </p>
        
        <div className="services-grid">
          {services.map(service => (
            <div 
              key={service.id}
              className={`service-card ${service.enabled ? 'enabled' : ''}`}
              onClick={() => toggleService(service.id)}
            >
              <div className="card-header">
                <div className="service-info">
                  <h3>{service.name}</h3>
                  <span className={`status-badge ${getStatusClass(service)}`}>
                    {getServiceStatus(service)}
                  </span>
                </div>
                
                <div className="toggle-container">
                  <input
                    type="checkbox"
                    id={`toggle-${service.id}`}
                    checked={service.enabled}
                    onChange={() => toggleService(service.id)}
                    className="toggle-input"
                  />
                  <label 
                    htmlFor={`toggle-${service.id}`}
                    className="toggle-label"
                  ></label>
                </div>
              </div>

              <div className="card-content">
                <p>{service.description}</p>
                
                {service.id === 'huggingFace' && subscriptionTier === 'none' && (
                  <div className="subscription-notice">
                    <InfoIcon />
                    <p>Requires subscription to enable</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="step-actions">
          <button 
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => setCurrentStep(2)}
            disabled={!services.some(service => service.enabled)}
          >
            Continue to Configuration
          </button>
        </div>
      </div>
    );
  };
  
  // Render the service configuration step
  const renderServiceConfiguration = () => {
    const enabledServices = services.filter(service => service.enabled);
    const allConfigured = enabledServices.every(service => service.configured);
    
    return (
      <div className="step-content configuration-step">
        <div className="configuration-layout">
          <div className="services-list">
            <h3>Enabled Services</h3>
            
            {enabledServices.map(service => (
              <div 
                key={service.id}
                className={`service-card ${activeService === service.id ? 'selected' : ''} ${service.enabled ? 'enabled' : ''}`}
                onClick={() => selectService(service.id)}
              >
                <div className="card-header">
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    <span className={`status-badge ${getStatusClass(service)}`}>
                      {getServiceStatus(service)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="configuration-panel">
            {!activeService && (
              <div className="empty-state">
                <h3>Select a Service to Configure</h3>
                <p>Click on one of the services on the left to begin configuration.</p>
              </div>
            )}
            
            {activeService === 'webSearch' && (
              <div className="web-search-panel">
                <WebSearchConfig
                  config={services.find(s => s.id === 'webSearch').config}
                  updateConfig={(newConfig) => updateServiceConfig('webSearch', newConfig)}
                />
                
                <div className="action-buttons">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setActiveService(null)}
                  >
                    Cancel
                  </button>
                  
                  <button 
                    className={`btn-primary ${isServiceConfigValid('webSearch') ? '' : 'disabled'}`}
                    onClick={() => saveServiceConfiguration('webSearch')}
                    disabled={!isServiceConfigValid('webSearch')}
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
            
            {activeService === 'fileSystem' && (
              <div className="file-system-panel">
                <FileSystemConfig
                  config={services.find(s => s.id === 'fileSystem').config}
                  updateConfig={(newConfig) => updateServiceConfig('fileSystem', newConfig)}
                />
                
                <div className="action-buttons">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setActiveService(null)}
                  >
                    Cancel
                  </button>
                  
                  <button 
                    className={`btn-primary ${isServiceConfigValid('fileSystem') ? '' : 'disabled'}`}
                    onClick={() => saveServiceConfiguration('fileSystem')}
                    disabled={!isServiceConfigValid('fileSystem')}
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
            
            {activeService === 'huggingFace' && (
              <div className="huggingface-panel">
                <HuggingFaceConfig
                  config={services.find(s => s.id === 'huggingFace').config}
                  updateConfig={(newConfig) => updateServiceConfig('huggingFace', newConfig)}
                />
                
                <div className="action-buttons">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setActiveService(null)}
                  >
                    Cancel
                  </button>
                  
                  <button 
                    className={`btn-primary ${isServiceConfigValid('huggingFace') ? '' : 'disabled'}`}
                    onClick={() => saveServiceConfiguration('huggingFace')}
                    disabled={!isServiceConfigValid('huggingFace')}
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="step-actions">
          <button 
            className="btn-secondary"
            onClick={() => setCurrentStep(1)}
          >
            Back to Selection
          </button>
          
          <button 
            className="btn-primary"
            onClick={() => setCurrentStep(3)}
            disabled={!allConfigured}
          >
            Continue to Validation
          </button>
        </div>
      </div>
    );
  };
  
  // Render the validation step
  const renderValidation = () => {
    return (
      <div className="step-content validation-step">
        <h2>Validate Your Configuration</h2>
        <p className="step-description">
          Verify that your MCP configuration is valid and ready for deployment.
        </p>
        
        <div className="validation-summary">
          <h3>Configuration Summary</h3>
          
          <div className="validation-services">
            {services.filter(service => service.enabled).map(service => (
              <div key={service.id} className="validation-service">
                <h4>{service.name}</h4>
                
                {service.id === 'webSearch' && (
                  <div className="service-summary">
                    <p><strong>Results Count:</strong> {service.config.resultsCount}</p>
                    <p><strong>Safe Search:</strong> {service.config.safeSearch ? 'Enabled' : 'Disabled'}</p>
                    <p><strong>Trusted Sources:</strong> {service.config.useTrustedSources ? 'Enabled' : 'Disabled'}</p>
                  </div>
                )}
                
                {service.id === 'fileSystem' && (
                  <div className="service-summary">
                    <p><strong>Directories:</strong></p>
                    <ul className="directories-summary">
                      {service.config.directories.map((dir, index) => (
                        <li key={index}>{dir}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {service.id === 'huggingFace' && (
                  <div className="service-summary">
                    <p><strong>API Token:</strong> {service.config.token ? '••••••••' : 'Not Set'}</p>
                    <p><strong>Selected Models:</strong></p>
                    <ul className="models-summary">
                      {service.config.selectedModels.map((model, index) => (
                        <li key={index}>{model}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {validationStatus.errors.length > 0 && (
            <div className="validation-errors">
              <h4>Validation Errors</h4>
              <ul>
                {validationStatus.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {validationStatus.isValid && (
            <div className="validation-success">
              <h4>Validation Successful</h4>
              <p>Your configuration is valid and ready for deployment!</p>
            </div>
          )}
        </div>
        
        <div className="step-actions">
          <button 
            className="btn-secondary"
            onClick={() => setCurrentStep(2)}
          >
            Back to Configuration
          </button>
          
          <button 
            className="btn-primary validate-button"
            onClick={validateConfiguration}
            disabled={validationStatus.isValidating}
          >
            {validationStatus.isValidating ? 'Validating...' : 'Validate Configuration'}
          </button>
          
          {validationStatus.isValid && (
            <button 
              className="btn-primary"
              onClick={() => setCurrentStep(4)}
            >
              Continue to Deployment
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Render the deployment step
  const renderDeployment = () => {
    return (
      <div className="step-content deployment-step">
        <h2>Deploy Your Configuration</h2>
        <p className="step-description">
          Deploy your MCP configuration to your Claude Desktop application.
        </p>
        
        <div className="deployment-options">
          <div className="configuration-name">
            <label htmlFor="configName">Configuration Name:</label>
            <input 
              type="text" 
              id="configName" 
              value={configName} 
              onChange={(e) => setConfigName(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="export-options">
            <h3>Export Options</h3>
            
            <button 
              className="btn-secondary export-button"
              onClick={copyConfigToClipboard}
            >
              Copy to Clipboard
            </button>
            
            <button 
              className="btn-primary deploy-button"
              onClick={deployConfiguration}
              disabled={deploymentStatus.isDeploying || deploymentStatus.isDeployed}
            >
              {deploymentStatus.isDeploying 
                ? 'Deploying...' 
                : deploymentStatus.isDeployed 
                  ? 'Deployed Successfully!' 
                  : 'Deploy Configuration'}
            </button>
          </div>
          
          {deploymentStatus.error && (
            <div className="deployment-error">
              <p>{deploymentStatus.error}</p>
            </div>
          )}
          
          {deploymentStatus.isDeployed && (
            <div className="deployment-success">
              <h4>Deployment Successful!</h4>
              <p>Your configuration has been deployed and saved to your account.</p>
              <p>You will be redirected to the dashboard shortly...</p>
            </div>
          )}
        </div>
        
        <div className="step-actions">
          <button 
            className="btn-secondary"
            onClick={() => setCurrentStep(3)}
            disabled={deploymentStatus.isDeployed}
          >
            Back to Validation
          </button>
          
          {deploymentStatus.isDeployed && (
            <button 
              className="btn-primary"
              onClick={() => {
                if (history && history.push) {
                  history.push('/dashboard');
                } else {
                  window.location.hash = '/dashboard';
                }
              }}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    );
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
          
          {/* Progress Bar */}
          {renderProgressBar()}
          
          {/* Step Content */}
          {renderStepContent()}
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