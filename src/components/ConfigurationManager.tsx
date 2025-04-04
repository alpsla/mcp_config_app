import React, { useState, useEffect } from 'react';
import FileSystemConfig from './FileSystemIntegration/FileSystemConfig';
import WebSearchConfig from './WebSearchIntegration/WebSearchConfig';
import HuggingFaceConfig from './HuggingFaceIntegration/HuggingFaceConfig';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import '../styles/configurationManager.css';

interface ConfigurationManagerProps {
  onConfigurationComplete?: (config: any) => void;
  initialConfig?: any;
}

const ConfigurationManager: React.FC<ConfigurationManagerProps> = ({
  onConfigurationComplete,
  initialConfig = {}
}) => {
  // Track selected services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Track configurations for each service
  const [fileSystemConfig, setFileSystemConfig] = useState<any>(
    initialConfig.fileSystem || { enabled: false }
  );
  const [webSearchConfig, setWebSearchConfig] = useState<any>(
    initialConfig.webSearch || { enabled: false }
  );
  const [huggingFaceConfig, setHuggingFaceConfig] = useState<any>(
    initialConfig.huggingFace || { enabled: false, modelIds: [], parameters: {} }
  );
  
  // Track active service tab
  const [activeTab, setActiveTab] = useState<string>('fileSystem');
  
  // Track configuration name
  const [configurationName, setConfigurationName] = useState<string>(
    initialConfig.name || `Configuration ${new Date().toLocaleDateString()}`
  );
  
  // Track deployment process
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStep, setDeploymentStep] = useState<number>(0);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'progress' | 'success' | 'error'>('idle');
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  
  // Initialize selected services based on enabled services in initialConfig
  useEffect(() => {
    const services = [];
    if (initialConfig.fileSystem?.enabled) services.push('fileSystem');
    if (initialConfig.webSearch?.enabled) services.push('webSearch');
    if (initialConfig.huggingFace?.enabled) services.push('huggingFace');
    setSelectedServices(services);
    
    // Set active tab to the first enabled service, or fileSystem by default
    if (services.length > 0) {
      setActiveTab(services[0]);
    }
  }, [initialConfig]);
  
  // Update configuration when any service configuration changes
  useEffect(() => {
    const combinedConfig = {
      name: configurationName,
      fileSystem: fileSystemConfig,
      webSearch: webSearchConfig,
      huggingFace: huggingFaceConfig
    };
    
    // If onConfigurationComplete is provided, call it with the updated config
    if (onConfigurationComplete) {
      onConfigurationComplete(combinedConfig);
    }
  }, [configurationName, fileSystemConfig, webSearchConfig, huggingFaceConfig, onConfigurationComplete]);
  
  // Handle service selection
  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        // If already selected, remove it
        return prev.filter(s => s !== service);
      } else {
        // If not selected, add it
        return [...prev, service];
      }
    });
    
    // Update the service's enabled status
    switch (service) {
      case 'fileSystem':
        setFileSystemConfig(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
      case 'webSearch':
        setWebSearchConfig(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
      case 'huggingFace':
        setHuggingFaceConfig(prev => ({ ...prev, enabled: !prev.enabled }));
        break;
    }
    
    // If service is being enabled, switch to its tab
    if (!selectedServices.includes(service)) {
      setActiveTab(service);
    }
  };
  
  // Handle tab switching
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Start deployment process
  const handleDeploy = async () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service before deploying.');
      return;
    }
    
    setIsDeploying(true);
    setDeploymentStatus('progress');
    setDeploymentStep(0);
    
    try {
      // Step 1: Configuration Stitching
      setDeploymentStep(1);
      await simulateStep(1000); // Simulate processing time
      
      // Step 2: Validation
      setDeploymentStep(2);
      await simulateStep(1500);
      
      // Step 3: Auto-fixing (if needed)
      setDeploymentStep(3);
      await simulateStep(1200);
      
      // Step 4: Deployment
      setDeploymentStep(4);
      await simulateStep(2000);
      
      // Step 5: Integration Testing
      setDeploymentStep(5);
      await simulateStep(1800);
      
      // Deployment successful
      setDeploymentStatus('success');
    } catch (error) {
      // Deployment failed
      setDeploymentStatus('error');
      setDeploymentError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsDeploying(false);
    }
  };
  
  // Simulate a deployment step with a delay
  const simulateStep = (delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  };
  
  // Get display name for each service
  const getServiceDisplayName = (service: string): string => {
    switch (service) {
      case 'fileSystem': return 'File System';
      case 'webSearch': return 'Web Search';
      case 'huggingFace': return 'Hugging Face';
      default: return service;
    }
  };
  
  // Render deployment progress
  const renderDeploymentProgress = () => {
    if (deploymentStatus === 'idle') return null;
    
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
            <p>Configuration "{configurationName}" has been successfully deployed and integrated with Claude.</p>
            <div className="deployment-summary">
              <h5>Services Included:</h5>
              <ul>
                {selectedServices.map(service => (
                  <li key={service}>{getServiceDisplayName(service)}</li>
                ))}
              </ul>
              {huggingFaceConfig.enabled && huggingFaceConfig.modelIds.length > 0 && (
                <div className="model-summary">
                  <h5>Hugging Face Models:</h5>
                  <ul>
                    {huggingFaceConfig.modelIds.map((modelId: string) => (
                      <li key={modelId}>{modelId}</li>
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
  
  return (
    <SubscriptionProvider>
      <div className="configuration-manager">
        {/* Configuration Name */}
        <div className="configuration-header">
          <input
            type="text"
            className="configuration-name-input"
            value={configurationName}
            onChange={(e) => setConfigurationName(e.target.value)}
            placeholder="Configuration Name"
          />
          
          {selectedServices.length > 0 && (
            <button 
              className="deploy-button"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? 'Deploying...' : 'Deploy Configuration'}
            </button>
          )}
        </div>
        
        {/* Service Selection Tabs */}
        <div className="service-tabs">
          {['fileSystem', 'webSearch', 'huggingFace'].map(service => (
            <div 
              key={service}
              className={`service-tab ${activeTab === service ? 'active' : ''}`}
              onClick={() => handleTabChange(service)}
            >
              <div className="service-checkbox">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <span className="service-name">{getServiceDisplayName(service)}</span>
            </div>
          ))}
        </div>
        
        {/* Active Service Configuration */}
        <div className="service-config-container">
          {activeTab === 'fileSystem' && (
            <FileSystemConfig
              onConfigurationUpdate={setFileSystemConfig}
              initialConfig={fileSystemConfig}
            />
          )}
          
          {activeTab === 'webSearch' && (
            <WebSearchConfig
              onConfigurationUpdate={setWebSearchConfig}
              initialConfig={webSearchConfig}
            />
          )}
          
          {activeTab === 'huggingFace' && (
            <HuggingFaceConfig
              onConfigurationUpdate={setHuggingFaceConfig}
              initialConfig={huggingFaceConfig}
            />
          )}
        </div>
        
        {/* Deployment Progress */}
        {renderDeploymentProgress()}
        
        {/* Additional Configuration Guidance */}
        {selectedServices.length > 0 && deploymentStatus === 'idle' && (
          <div className="configuration-guidance">
            <p>
              <strong>You can configure multiple services!</strong> Use the tabs above to switch between 
              services and configure each one. When you're ready, click the "Deploy Configuration" button to 
              deploy all selected services.
            </p>
          </div>
        )}
      </div>
    </SubscriptionProvider>
  );
};

export default ConfigurationManager;