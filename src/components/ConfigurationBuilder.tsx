import React, { useState, useEffect } from 'react';
import './ConfigurationBuilder.css';
import { useAuth } from '../auth/AuthContext';
import ServiceSelector from './ServiceSelector';
import ModelSelector, { AVAILABLE_MODELS } from './ModelSelector';
import ModelParameterForm from './ModelParameterForm';
import { ConfigurationManager, MCPConfiguration } from '../services/configurationManager';
import { SubscriptionTier } from '../types';

interface ConfigurationBuilderProps {
  initialConfig?: MCPConfiguration;
  onConfigurationSaved?: (config: MCPConfiguration) => void;
}

/**
 * Main component for building MCP configurations
 * Integrates service selection, model selection, and parameter configuration
 */
const ConfigurationBuilder: React.FC<ConfigurationBuilderProps> = ({
  initialConfig,
  onConfigurationSaved
}) => {
  const { authState, getUserSubscriptionTier, updateSubscriptionTier } = useAuth();
  
  // Current configuration
  const [config, setConfig] = useState<MCPConfiguration>(() => {
    if (initialConfig) {
      return initialConfig;
    }
    
    return ConfigurationManager.createConfiguration(
      authState?.user?.id || 'anonymous'
    );
  });
  
  // Subscription tier
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(
    getUserSubscriptionTier?.() || SubscriptionTier.FREE
  );
  
  // Current view state
  const [activeService, setActiveService] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [showDeploymentProgress, setShowDeploymentProgress] = useState<boolean>(false);
  const [deploymentStep, setDeploymentStep] = useState<number>(0);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'progress' | 'success' | 'error'>('idle');
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  
  // Get all selected model IDs
  const configuredModelIds = config.models
    .filter(model => model.configured)
    .map(model => model.id);
  
  // Set subscription tier from auth context
  useEffect(() => {
    if (getUserSubscriptionTier) {
      setSubscriptionTier(getUserSubscriptionTier());
    }
  }, [getUserSubscriptionTier]);
  
  // Define services
  const services = [
    {
      id: 'fileSystem',
      name: 'File System',
      description: 'Allow Claude to read and write files on your computer.',
      enabled: config.services.fileSystem.enabled,
      configured: config.services.fileSystem.configured
    },
    {
      id: 'webSearch',
      name: 'Web Search',
      description: 'Allow Claude to search the internet for up-to-date information.',
      enabled: config.services.webSearch.enabled,
      configured: config.services.webSearch.configured
    },
    {
      id: 'huggingFace',
      name: 'Hugging Face Models',
      description: 'Connect specialized AI models to extend Claude\'s capabilities.',
      enabled: config.services.huggingFace.enabled,
      configured: config.services.huggingFace.configured,
      requiresSubscription: true
    }
  ];
  
  // Find the selected model
  const selectedModel = AVAILABLE_MODELS.find(model => model.id === selectedModelId);
  
  // Get model config if it exists
  const selectedModelConfig = config.models.find(model => model.id === selectedModelId);
  
  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setActiveService(serviceId);
    
    // If selecting Hugging Face, clear selected model
    if (serviceId === 'huggingFace') {
      setSelectedModelId(null);
    } else {
      // For other services, also clear selected model
      setSelectedModelId(null);
    }
  };
  
  // Handle service toggle
  const handleServiceToggle = (serviceId: string) => {
    // Update the config
    const updatedConfig = ConfigurationManager.toggleService(config, serviceId as any);
    setConfig(updatedConfig);
    
    // If enabling a service, select it
    if (!config.services[serviceId as keyof typeof config.services].enabled) {
      setActiveService(serviceId);
      
      // If enabling Hugging Face, clear selected model
      if (serviceId === 'huggingFace') {
        setSelectedModelId(null);
      }
    } 
    // If disabling, deselect if it's the active service
    else if (activeService === serviceId) {
      setActiveService(null);
      setSelectedModelId(null);
    }
  };
  
  // Handle subscription upgrade
  const handleUpgradeSubscription = () => {
    // Determine new tier
    const newTier = subscriptionTier === SubscriptionTier.FREE ? SubscriptionTier.STARTER : SubscriptionTier.COMPLETE;
    
    // Update subscription tier
    setSubscriptionTier(newTier);
    if (updateSubscriptionTier) {
      updateSubscriptionTier(newTier);
    }
    
    // Enable Hugging Face service if it's not already enabled
    if (!config.services.huggingFace.enabled) {
      const updatedConfig = ConfigurationManager.toggleService(config, 'huggingFace');
      setConfig(updatedConfig);
      setActiveService('huggingFace');
    }
  };
  
  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
  };
  
  // Handle model parameter save
  const handleSaveModelParams = (modelId: string, params: Record<string, any>) => {
    // Find the model in the available models
    const modelData = AVAILABLE_MODELS.find(model => model.id === modelId);
    
    if (!modelData) return;
    
    // Create or update the model configuration
    const modelConfig = {
      id: modelId,
      name: modelData.name,
      enabled: true,
      configured: true,
      params
    };
    
    // Update the configuration
    const updatedConfig = ConfigurationManager.addOrUpdateModel(config, modelConfig);
    setConfig(updatedConfig);
    
    // Update Hugging Face service status
    if (!config.services.huggingFace.configured) {
      const configWithHuggingFace = ConfigurationManager.setServiceConfigured(
        updatedConfig,
        'huggingFace',
        true
      );
      setConfig(configWithHuggingFace);
    }
    
    // Close the parameter form
    setSelectedModelId(null);
  };
  
  // Handle parameter form cancel
  const handleCancelModelParams = () => {
    setSelectedModelId(null);
  };
  
  // Update global parameters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateGlobalParams = (params: Record<string, any>) => {
    const updatedConfig = ConfigurationManager.updateGlobalParams(config, params);
    setConfig(updatedConfig);
  };
  
  // Start deployment process
  const handleDeploy = async () => {
    setShowDeploymentProgress(true);
    setDeploymentStatus('progress');
    setDeploymentStep(1); // Start at step 1 (Configuration Stitching)
    
    try {
      // Step 1: Configuration Stitching
      await simulateDeploymentStep(1000);
      setDeploymentStep(2);
      
      // Step 2: Validation
      const validation = ConfigurationManager.validateConfiguration(config);
      await simulateDeploymentStep(1500);
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      setDeploymentStep(3);
      
      // Step 3: Auto-fixing
      await simulateDeploymentStep(1200);
      setDeploymentStep(4);
      
      // Step 4: Deployment
      const deployedConfig = await ConfigurationManager.deployConfiguration(config);
      await simulateDeploymentStep(2000);
      setDeploymentStep(5);
      
      // Step 5: Integration Testing
      await simulateDeploymentStep(1800);
      
      // Update our local config with the deployed one
      setConfig(deployedConfig);
      
      // Deployment successful
      setDeploymentStatus('success');
      
      // Call the onConfigurationSaved callback if provided
      if (onConfigurationSaved) {
        onConfigurationSaved(deployedConfig);
      }
    } catch (error) {
      // Deployment failed
      setDeploymentStatus('error');
      setDeploymentError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  // Simulate a deployment step with a delay
  const simulateDeploymentStep = (delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };
  
  // Check if configuration has any services enabled
  const hasEnabledServices = Object.values(config.services).some(service => service.enabled);
  
  // Check if all enabled services are configured
  const allServicesConfigured = Object.entries(config.services)
    .filter(([_, service]) => service.enabled)
    .every(([_, service]) => service.configured);
  
  // Render the deployment progress
  const renderDeploymentProgress = () => {
    if (!showDeploymentProgress) return null;
    
    const steps = [
      'Configuration Stitching',
      'Validation',
      'Auto-fixing Issues',
      'Deployment',
      'Integration Testing'
    ];
    
    return (
      <div className="deployment-progress">
        <h3>Deployment Progress</h3>
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`progress-step ${
                deploymentStep > index 
                  ? 'completed' 
                  : deploymentStep === index + 1 
                    ? 'active' 
                    : ''
              }`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-name">{step}</div>
            </div>
          ))}
        </div>
        
        {deploymentStatus === 'success' && (
          <div className="deployment-success">
            <h4>Deployment Successful!</h4>
            <p>Configuration "{config.name}" has been successfully deployed and integrated with Claude.</p>
            <div className="deployment-summary">
              <h5>Services Included:</h5>
              <ul>
                {Object.entries(config.services)
                  .filter(([_, service]) => service.enabled && service.configured)
                  .map(([id]) => (
                    <li key={id}>
                      {services.find(s => s.id === id)?.name}
                    </li>
                  ))}
              </ul>
              
              {config.services.huggingFace.enabled && config.models.length > 0 && (
                <div className="model-summary">
                  <h5>Hugging Face Models:</h5>
                  <ul>
                    {config.models.map(model => (
                      <li key={model.id}>{model.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button className="test-button">Test with Claude</button>
          </div>
        )}
        
        {deploymentStatus === 'error' && (
          <div className="deployment-error">
            <h4>Deployment Failed</h4>
            <p>{deploymentError || 'An unknown error occurred during deployment.'}</p>
            <button className="retry-button" onClick={handleDeploy}>Retry Deployment</button>
          </div>
        )}
      </div>
    );
  };
  
  // Render configuration name editor
  const renderConfigNameEditor = () => {
    return (
      <div className="config-name-editor">
        <label htmlFor="config-name">Configuration Name:</label>
        <input
          id="config-name"
          type="text"
          value={config.name}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
          placeholder="Enter a name for this configuration"
        />
      </div>
    );
  };
  
  // Render file system configuration if active
  const renderFileSystemConfig = () => {
    if (activeService !== 'fileSystem') return null;
    
    return (
      <div className="file-system-config">
        <h3>File System Configuration</h3>
        <p>Allow Claude to access files and directories on your computer.</p>
        
        <div className="directory-selector">
          <h4>Select Directories</h4>
          <p>Choose directories that Claude can access:</p>
          
          <div className="selected-directories">
            {config.services.fileSystem.params.directories && 
             config.services.fileSystem.params.directories.length > 0 ? (
              <ul>
                {config.services.fileSystem.params.directories.map((dir, index) => (
                  <li key={index}>
                    <span className="directory-path">{dir}</span>
                    <button 
                      className="remove-directory"
                      onClick={() => {
                        const updatedDirs = [...config.services.fileSystem.params.directories];
                        updatedDirs.splice(index, 1);
                        
                        const updatedConfig = ConfigurationManager.updateServiceConfig(
                          config,
                          'fileSystem',
                          { directories: updatedDirs }
                        );
                        
                        setConfig(updatedConfig);
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-directories">No directories selected.</p>
            )}
          </div>
          
          <div className="add-directory">
            <input
              type="text"
              placeholder="Enter directory path"
              value={config.tempDirectoryInput || ''}
              onChange={(e) => setConfig({ ...config, tempDirectoryInput: e.target.value })}
            />
            <button
              onClick={() => {
                if (!config.tempDirectoryInput) return;
                
                const updatedDirs = [
                  ...(config.services.fileSystem.params.directories || []),
                  config.tempDirectoryInput
                ];
                
                const updatedConfig = ConfigurationManager.updateServiceConfig(
                  config,
                  'fileSystem',
                  { directories: updatedDirs }
                );
                
                // Mark as configured if we now have directories
                if (updatedDirs.length > 0) {
                  const configuredConfig = ConfigurationManager.setServiceConfigured(
                    updatedConfig,
                    'fileSystem',
                    true
                  );
                  
                  setConfig({
                    ...configuredConfig,
                    tempDirectoryInput: ''
                  });
                } else {
                  setConfig({
                    ...updatedConfig,
                    tempDirectoryInput: ''
                  });
                }
              }}
            >
              Add Directory
            </button>
          </div>
        </div>
        
        <div className="config-actions">
          <button 
            className="save-button"
            onClick={() => {
              // Mark as configured if we have directories
              if (config.services.fileSystem.params.directories &&
                  config.services.fileSystem.params.directories.length > 0) {
                const updatedConfig = ConfigurationManager.setServiceConfigured(
                  config,
                  'fileSystem',
                  true
                );
                
                setConfig(updatedConfig);
              }
            }}
            disabled={
              !config.services.fileSystem.params.directories ||
              config.services.fileSystem.params.directories.length === 0
            }
          >
            Save Configuration
          </button>
        </div>
      </div>
    );
  };
  
  // Render web search configuration if active
  const renderWebSearchConfig = () => {
    if (activeService !== 'webSearch') return null;
    
    return (
      <div className="web-search-config">
        <h3>Web Search Configuration</h3>
        <p>Allow Claude to search the internet for up-to-date information.</p>
        
        <div className="search-parameters">
          <div className="parameter">
            <label htmlFor="results-count">Results Count:</label>
            <input
              id="results-count"
              type="number"
              min="1"
              max="20"
              value={config.services.webSearch.params.resultsCount || 5}
              onChange={(e) => {
                const updatedConfig = ConfigurationManager.updateServiceConfig(
                  config,
                  'webSearch',
                  { resultsCount: parseInt(e.target.value) }
                );
                
                setConfig(updatedConfig);
              }}
            />
            <p className="parameter-description">
              Number of search results to return (1-20)
            </p>
          </div>
          
          <div className="parameter">
            <label htmlFor="safe-search">Safe Search:</label>
            <input
              id="safe-search"
              type="checkbox"
              checked={config.services.webSearch.params.safeSearch !== false}
              onChange={(e) => {
                const updatedConfig = ConfigurationManager.updateServiceConfig(
                  config,
                  'webSearch',
                  { safeSearch: e.target.checked }
                );
                
                setConfig(updatedConfig);
              }}
            />
            <p className="parameter-description">
              Filter out adult content from search results
            </p>
          </div>
          
          <div className="parameter">
            <label htmlFor="trusted-sources">Use Trusted Sources Only:</label>
            <input
              id="trusted-sources"
              type="checkbox"
              checked={config.services.webSearch.params.useTrustedSources === true}
              onChange={(e) => {
                const updatedConfig = ConfigurationManager.updateServiceConfig(
                  config,
                  'webSearch',
                  { useTrustedSources: e.target.checked }
                );
                
                setConfig(updatedConfig);
              }}
            />
            <p className="parameter-description">
              Prioritize results from trusted sources
            </p>
          </div>
        </div>
        
        <div className="config-actions">
          <button 
            className="save-button"
            onClick={() => {
              const updatedConfig = ConfigurationManager.setServiceConfigured(
                config,
                'webSearch',
                true
              );
              
              setConfig(updatedConfig);
            }}
          >
            Save Configuration
          </button>
        </div>
      </div>
    );
  };
  
  // Main render function
  return (
    <div className="configuration-builder">
      {/* Configuration Name */}
      {renderConfigNameEditor()}
      
      {/* Service Selection */}
      <ServiceSelector
        services={services}
        selectedService={activeService}
        subscriptionTier={subscriptionTier}
        onServiceSelect={handleServiceSelect}
        onServiceToggle={handleServiceToggle}
        onUpgradeSubscription={handleUpgradeSubscription}
      />
      
      {/* Service specific configuration */}
      {renderFileSystemConfig()}
      {renderWebSearchConfig()}
      
      {/* Hugging Face Model Selection */}
      {activeService === 'huggingFace' && !selectedModelId && (
        <ModelSelector
          models={AVAILABLE_MODELS}
          selectedModelId={selectedModelId}
          configuredModels={configuredModelIds}
          subscriptionTier={subscriptionTier}
          onModelSelect={handleModelSelect}
          onUpgradeSubscription={handleUpgradeSubscription}
        />
      )}
      
      {/* Model Parameter Form */}
      {activeService === 'huggingFace' && selectedModelId && selectedModel && (
        <ModelParameterForm
          model={selectedModel}
          isConfigured={!!selectedModelConfig?.configured}
          initialParams={selectedModelConfig?.params || {}}
          globalParams={config.globalParams}
          onSave={handleSaveModelParams}
          onCancel={handleCancelModelParams}
        />
      )}
      
      {/* Deploy Button */}
      {hasEnabledServices && allServicesConfigured && !showDeploymentProgress && (
        <div className="deploy-container">
          <button 
            className="deploy-button"
            onClick={handleDeploy}
          >
            Deploy Configuration
          </button>
          <p className="deploy-description">
            This will generate and deploy the configuration file for Claude.
          </p>
        </div>
      )}
      
      {/* Deployment Progress */}
      {renderDeploymentProgress()}
      
      {/* Configuration Guidance */}
      {hasEnabledServices && !showDeploymentProgress && (
        <div className="configuration-guidance">
          <p>
            <strong>You can configure multiple services!</strong> Use the service selector above to switch between 
            services and configure each one. When you're ready, click the "Deploy Configuration" button to 
            deploy all selected services.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfigurationBuilder;