import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import TierSelectionConnector from '../dashboard/TierSelectionConnector';
import SubscriptionFlow from '../subscription/SubscriptionFlow';
import EnhancedHuggingFaceConfig from '../HuggingFaceIntegration/EnhancedHuggingFaceConfig';
import { enhancedConfigurationManager } from '../../services/EnhancedConfigurationManager';
import { SubscriptionTierSimple } from '../../types/enhanced-types';
import './MainConfigurationFlow.css';

/**
 * Main Configuration Flow that integrates:
 * - Existing dashboard tier selection
 * - Subscription flow with parameter configuration
 * - Enhanced service configuration (HuggingFace, etc.)
 */
const MainConfigurationFlow: React.FC = () => {
  const { authState } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { configId } = useParams<{ configId?: string }>();
  
  const [showSubscriptionFlow, setShowSubscriptionFlow] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierSimple>('none');
  const [configurationStep, setConfigurationStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  
  // Handle tier selection from dashboard or URL
  const handleTierSelected = (tier: SubscriptionTierSimple) => {
    setSelectedTier(tier);
    
    // Check if user needs to go through subscription flow
    const needsSubscription = tier !== 'none' && !authState.user?.user_metadata?.subscriptionTier;
    setShowSubscriptionFlow(needsSubscription);
  };
  
  // Load existing configuration if editing
  useEffect(() => {
    const loadConfig = async () => {
      if (configId && authState?.user?.id) {
        try {
          setIsLoading(true);
          const config = await enhancedConfigurationManager.getConfigurationById(
            authState.user.id,
            configId
          );
          
          if (config) {
            setCurrentConfig(config);
          }
        } catch (error) {
          console.error('Error loading configuration:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, [configId, authState?.user?.id]);
  
  // Handle subscription completion
  const handleSubscriptionComplete = () => {
    setShowSubscriptionFlow(false);
    
    // Move to first configuration step
    setConfigurationStep(1);
  };
  
  // Handle configuration update
  const handleConfigurationUpdate = (serviceId: string, config: any) => {
    // Update the current configuration
    // This would need to be expanded based on the service type
    setCurrentConfig(prev => ({
      ...prev,
      [serviceId]: config
    }));
  };
  
  // Render loading state
  if (isLoading) {
    return <div className="loading-state">Loading configuration...</div>;
  }
  
  // Render subscription flow if needed
  if (showSubscriptionFlow) {
    return (
      <SubscriptionFlow
        onComplete={handleSubscriptionComplete}
        onCancel={() => navigate('/dashboard')}
        initialTier={selectedTier !== 'none' ? selectedTier : undefined}
      />
    );
  }
  
  // Determine what to render based on configuration step
  const renderConfigurationStep = () => {
    switch (configurationStep) {
      case 0:
        // Service selection step
        return (
          <div className="service-selection">
            <h2>Select Services to Configure</h2>
            <p>Choose which services you want to enable for Claude:</p>
            
            <div className="service-options">
              <div 
                className="service-option" 
                onClick={() => setConfigurationStep(1)}
              >
                <h3>File System</h3>
                <p>Allow Claude to access files on your computer</p>
              </div>
              
              <div 
                className="service-option"
                onClick={() => setConfigurationStep(2)}
              >
                <h3>Web Search</h3>
                <p>Enable Claude to search the web for information</p>
              </div>
              
              <div 
                className="service-option"
                onClick={() => setConfigurationStep(3)}
              >
                <h3>Hugging Face Models</h3>
                <p>Extend Claude with specialized AI models</p>
              </div>
            </div>
          </div>
        );
        
      case 1:
        // File System configuration
        return (
          <div className="file-system-config">
            <h2>File System Configuration</h2>
            {/* Your existing File System configuration component would go here */}
            <button onClick={() => setConfigurationStep(0)}>Back</button>
          </div>
        );
        
      case 2:
        // Web Search configuration
        return (
          <div className="web-search-config">
            <h2>Web Search Configuration</h2>
            {/* Your existing Web Search configuration component would go here */}
            <button onClick={() => setConfigurationStep(0)}>Back</button>
          </div>
        );
        
      case 3:
        // Hugging Face configuration with our enhanced component
        return (
          <div className="hugging-face-config">
            <h2>Hugging Face Models</h2>
            <EnhancedHuggingFaceConfig
              onConfigurationUpdate={(config) => 
                handleConfigurationUpdate('huggingFace', config)
              }
              initialConfig={currentConfig?.huggingFace}
            />
            <button onClick={() => setConfigurationStep(0)}>Back</button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="main-configuration-flow">
      {/* Connect to existing dashboard tier selection */}
      <TierSelectionConnector
        onTierSelected={handleTierSelected}
        initialTier={location.state?.tier}
      />
      
      {/* Configuration steps */}
      {renderConfigurationStep()}
    </div>
  );
};

export default MainConfigurationFlow;
