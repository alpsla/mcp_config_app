import React, { useState, useEffect } from 'react';
import SharedHeader from '../../components/shared/SharedHeader';
import SharedFooter from '../../components/shared/SharedFooter';
import { InfoIcon } from '../../components/icons';
import { UserConfigService } from '../../services/userConfigService';
import { useAuth } from '../../auth/AuthContext';
import '../../styles/ConfigurationStyles.css';
import '../../styles/ProgressBar.css';
import '../../styles/FooterFix.css'; // Import the footer fix CSS
import '../../styles/SpaceFix.css'; // Import additional spacing fix

// Import step components
import ServiceSelectionStep from './steps/ServiceSelectionStep';
import ModelSelectionStep from './steps/ModelSelectionStep';
import ConfigurationExportStep from './steps/ConfigurationExportStep';

const MCPStudioPage = ({ history, onSaveConfiguration }) => {
  // Get authentication state from context
  const { authState, signOut, getUserSubscriptionTier, updateSubscriptionTier } = useAuth();
  
  // Active service for configuration
  const [activeService, setActiveService] = useState(null);
  
  // Multi-step process state
  const [currentStep, setCurrentStep] = useState(1); // 1: Choose Services, 2: Select Models, 3: Configure & Export
  
  // Subscription tier - Start with 'none' and load from URL parameter or auth context
  const [subscriptionTier, setSubscriptionTier] = useState('none');
  
  // Effect to set the subscription tier from URL parameters or auth context
  useEffect(() => {
    // Check if there's a tier parameter in the URL
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const tierParam = hashParams.get('tier');
    
    if (tierParam) {
      // Use the tier parameter if available
      console.log(`Setting subscription tier from URL: ${tierParam}`);
      setSubscriptionTier(tierParam);
      // Also update in auth context
      if (updateSubscriptionTier) {
        updateSubscriptionTier(tierParam);
      }
    } else {
      // Otherwise use the user's subscription tier from auth context
      const userTier = getUserSubscriptionTier ? getUserSubscriptionTier() : 'none';
      console.log(`Setting subscription tier from user context: ${userTier}`);
      setSubscriptionTier(userTier);
    }
  }, [getUserSubscriptionTier, updateSubscriptionTier]);
  
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
  
  // Selected models state for step 2
  const [selectedModels, setSelectedModels] = useState([]);
  
  // Validation and deployment status
  const [validationStatus, setValidationStatus] = useState({
    isValidating: false,
    isValid: false,
    errors: []
  });
  
  const [deploymentStatus, setDeploymentStatus] = useState({
    isDeploying: false,
    isDeployed: false,
    error: null
  });
  
  // Scroll to top when component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check authentication state on mount
  useEffect(() => {
    const userIsAuthenticated = authState?.user !== null;
    console.log('MCPStudioPage: Authentication state updated', { isAuthenticated: userIsAuthenticated });
    
    // Redirect if not authenticated
    if (!userIsAuthenticated && history?.push) {
      history.push('/signin');
      return;
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
      // If all are configured, move to next step
      if (currentStep === 1) {
        setCurrentStep(2); // Move to Select Models step
      } else if (currentStep === 2) {
        setCurrentStep(3); // Move to Configure & Export step
      }
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
  
  // Select a model for HuggingFace integration
  const handleModelSelect = (modelId, selected) => {
    if (selected) {
      // Check tier limitations
      if (subscriptionTier === 'basic' && selectedModels.length >= 3) {
        // Show upgrade prompt
        handleUpgradeSubscription();
        return;
      }
      setSelectedModels([...selectedModels, modelId]);
    } else {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    }
    
    // Update HuggingFace config
    updateServiceConfig('huggingFace', { selectedModels: selectedModels });
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
  
  // Render the progress bar to exactly match the design in the screenshot
  const renderProgressBar = () => {
    // Calculate percentage complete based on current step
    const percentComplete = (() => {
      if (currentStep === 1) return 33;
      if (currentStep === 2) return 66;
      if (currentStep >= 3) return 100;
      return 0;
    })();
    
    return (
      <div className="exact-progress-bar">
        <div className="progress-steps-container">
          <div className="progress-step-number-container">
            <div className={`progress-step-circle ${currentStep >= 1 ? 'active' : ''}`}>
              <span>1</span>
            </div>
            <div className="progress-step-label">Choose Services</div>
          </div>
          
          <div className="progress-line-container">
            <div className="progress-line"></div>
          </div>
          
          <div className="progress-step-number-container">
            <div className={`progress-step-circle ${currentStep >= 2 ? 'active' : ''}`}>
              <span>2</span>
            </div>
            <div className="progress-step-label">Select Models</div>
          </div>
          
          <div className="progress-line-container">
            <div className="progress-line"></div>
          </div>
          
          <div className="progress-step-number-container">
            <div className={`progress-step-circle ${currentStep >= 3 ? 'active' : ''}`}>
              <span>3</span>
            </div>
            <div className="progress-step-label">Configure & Export</div>
          </div>
          
          <div className="progress-percentage">
            {percentComplete}% Complete
          </div>
        </div>
        
        <div className="progress-indicator-container">
          <div className="progress-indicator-background">
            <div 
              className="progress-indicator-fill" 
              style={{width: `${percentComplete}%`}}
            ></div>
          </div>
        </div>
      </div>
    );
  };
  
  // Handle continue from first step
  const handleStep1Continue = () => {
    const hasHuggingFace = services.some(s => s.id === 'huggingFace' && s.enabled);
    if (hasHuggingFace) {
      setCurrentStep(2); // Go to model selection
    } else {
      setCurrentStep(3); // Skip to Configure & Export
    }
  };
  
  // Handle continue from second step
  const handleStep2Continue = () => {
    // Update HuggingFace config with selected models
    updateServiceConfig('huggingFace', { selectedModels });
    // Mark HuggingFace as configured if models are selected
    if (selectedModels.length > 0) {
      setServices(services.map(service => 
        service.id === 'huggingFace' 
          ? { ...service, configured: true } 
          : service
      ));
    }
    setCurrentStep(3);
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
          {currentStep === 1 && (
            <ServiceSelectionStep 
              services={services}
              toggleService={toggleService}
              getServiceStatus={getServiceStatus}
              getStatusClass={getStatusClass}
              subscriptionTier={subscriptionTier}
              onContinue={handleStep1Continue}
              onCancel={() => window.history.back()}
            />
          )}
          
          {currentStep === 2 && (
            <ModelSelectionStep 
              selectedModels={selectedModels}
              handleModelSelect={handleModelSelect}
              subscriptionTier={subscriptionTier}
              onBack={() => setCurrentStep(1)}
              onContinue={handleStep2Continue}
            />
          )}
          
          {currentStep === 3 && (
            <ConfigurationExportStep 
              services={services}
              activeService={activeService}
              selectService={selectService}
              getServiceStatus={getServiceStatus}
              getStatusClass={getStatusClass}
              updateServiceConfig={updateServiceConfig}
              saveServiceConfiguration={saveServiceConfiguration}
              isServiceConfigValid={isServiceConfigValid}
              configName={configName}
              setConfigName={setConfigName}
              validationStatus={validationStatus}
              deploymentStatus={deploymentStatus}
              onValidate={validateConfiguration}
              onCopyToClipboard={copyConfigToClipboard}
              onDeploy={deployConfiguration}
              onBack={() => {
                // Go back to appropriate step
                const hasHuggingFace = services.some(s => s.id === 'huggingFace' && s.enabled);
                setCurrentStep(hasHuggingFace ? 2 : 1);
              }}
            />
          )}
        </div>
      </main>
      
      <div className="desktop-notice-container">
        <div className="desktop-notice">
          <InfoIcon className="info-icon" />
          <p>Desktop Application Required: These integrations require the Claude Desktop application.</p>
          <a href="#/learn-more">Learn More</a>
        </div>
      </div>
      
      <SharedFooter />
    </>
  );
};

export default MCPStudioPage;