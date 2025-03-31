import React, { useState, useEffect } from 'react';
import TokenInput from './TokenInput';
import TieredModelSelector from './TieredModelSelector';
import ParameterManager from './ParameterManager';
import { HuggingFaceService } from '../../services/huggingFaceService';
import { Platform } from '../../utils/platform';
import { useAuth } from '../../auth/AuthContext';

interface HuggingFaceConfigProps {
  onConfigurationUpdate: (config: { 
    enabled: boolean; 
    modelId: string;
    parameters: Record<string, any>;
  }) => void;
  initialConfig?: { 
    enabled: boolean; 
    modelId: string;
    parameters: Record<string, any>;
  };
  userTier?: 'none' | 'basic' | 'complete' | 'free' | 'standard' | 'premium';
}

const HuggingFaceConfig: React.FC<HuggingFaceConfigProps> = ({
  onConfigurationUpdate,
  initialConfig = { 
    enabled: false, 
    modelId: '',
    parameters: {}
  },
  userTier = 'none'
}) => {
  const { getUserSubscriptionTier } = useAuth();
  const [isEnabled, setIsEnabled] = useState<boolean>(initialConfig.enabled);
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(
    initialConfig.modelId ? [initialConfig.modelId] : []
  );
  const [globalParameters, setGlobalParameters] = useState<Record<string, any>>({
    temperature: 0.7,
    max_length: 100,
    top_p: 0.9
  });
  const [modelParameters, setModelParameters] = useState<Record<string, any>>(
    initialConfig.parameters || {}
  );
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Get current subscription tier - use provided userTier or get from context
  const subscriptionTier = userTier !== 'free' && userTier !== 'standard' && userTier !== 'premium' 
    ? userTier 
    : (getUserSubscriptionTier() || 'none');
  
  // Map old tier values to new tier values if needed
  const getMappedTier = (tier: string): 'none' | 'basic' | 'complete' => {
    switch(tier) {
      case 'free': return 'none';
      case 'standard': return 'basic';
      case 'premium': return 'complete';
      default: return tier as 'none' | 'basic' | 'complete';
    }
  };
  
  // Use the mapped tier value
  const currentTier = getMappedTier(subscriptionTier);
  
  // Check for valid token on component mount
  useEffect(() => {
    const checkToken = async () => {
      const token = await HuggingFaceService.getToken();
      if (token) {
        const result = await HuggingFaceService.validateToken(token);
        setHasValidToken(result.isValid);
      }
    };
    
    checkToken();
  }, []);
  
  // Update configuration when dependencies change
  useEffect(() => {
    onConfigurationUpdate({
      enabled: isEnabled,
      modelId: selectedModelIds[0] || '',
      parameters: Object.keys(modelParameters).length > 0 ? modelParameters : globalParameters
    });
  }, [isEnabled, selectedModelIds, globalParameters, modelParameters, onConfigurationUpdate]);
  
  const handleToggle = () => {
    // If user is not subscribed, don't allow enabling
    if (currentTier === 'none' && !isEnabled) {
      return;
    }
    
    const newState = !isEnabled;
    setIsEnabled(newState);
  };
  
  const handleTokenValidated = (token: string) => {
    setHasValidToken(true);
    // Move to next step if token is valid
    if (activeStep === 0) {
      setActiveStep(1);
    }
  };
  
  const handleModelsSelected = (modelIds: string[]) => {
    setSelectedModelIds(modelIds);
    // Move to next step if at least one model is selected
    if (activeStep === 1 && modelIds.length > 0) {
      setActiveStep(2);
    }
  };
  
  const handleParametersUpdate = (parameters: Record<string, any>, isGlobal: boolean) => {
    if (isGlobal) {
      setGlobalParameters(parameters);
      setModelParameters({});
    } else {
      setModelParameters(parameters);
    }
  };
  
  // Navigate between steps
  const goToStep = (step: number) => {
    setActiveStep(step);
  };
  
  return (
    <div className="huggingface-config">
      <div className="config-header">
        <h2>Hugging Face Integration</h2>
        <div className="toggle-container">
          {currentTier !== 'none' ? (
            <>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={handleToggle}
                />
                <span className="toggle-slider"></span>
              </label>
              <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
            </>
          ) : (
            // For non-subscribers, show subscription indicator
            <div className="subscription-required">Subscription Required</div>
          )}
        </div>
      </div>
      
      {/* For non-subscribers, show the TieredModelSelector component */}
      {currentTier === 'none' && (
        <div className="subscription-callout">
          <p>A subscription is required to use Hugging Face models with Claude.</p>
          <button className="subscribe-button">Subscribe to Enable</button>
        </div>
      )}
      
      {/* For subscribers, show toggle and additional components when enabled */}
      {currentTier !== 'none' && (
        <>
          {isEnabled && (
            <>
              <div className="config-steps">
                <div className="step-indicators">
                  <div 
                    className={`step-indicator ${activeStep >= 0 ? 'active' : ''} ${hasValidToken ? 'completed' : ''}`}
                    onClick={() => goToStep(0)}
                  >
                    <span className="step-number">1</span>
                    <span className="step-label">API Token</span>
                  </div>
                  <div 
                    className={`step-indicator ${activeStep >= 1 ? 'active' : ''} ${selectedModelIds.length > 0 ? 'completed' : ''}`}
                    onClick={() => hasValidToken && goToStep(1)}
                  >
                    <span className="step-number">2</span>
                    <span className="step-label">Select Model</span>
                  </div>
                  <div 
                    className={`step-indicator ${activeStep >= 2 ? 'active' : ''}`}
                    onClick={() => selectedModelIds.length > 0 && goToStep(2)}
                  >
                    <span className="step-number">3</span>
                    <span className="step-label">Configure Parameters</span>
                  </div>
                </div>
                
                <div className="step-content">
                  {activeStep === 0 && (
                    <div className="token-step">
                      <TokenInput onTokenValidated={handleTokenValidated} />
                    </div>
                  )}
                  
                  {activeStep === 1 && (
                    <div className="model-step">
                      <TieredModelSelector 
                        onModelSelect={handleModelsSelected}
                        selectedModelIds={selectedModelIds}
                      />
                    </div>
                  )}
                  
                  {activeStep === 2 && (
                    <div className="parameters-step">
                      <ParameterManager 
                        globalParameters={globalParameters}
                        modelSpecificParameters={modelParameters}
                        onParametersChange={handleParametersUpdate}
                      />
                    </div>
                  )}
                </div>
                
                <div className="step-navigation">
                  {activeStep > 0 && (
                    <button 
                      className="prev-button"
                      onClick={() => goToStep(activeStep - 1)}
                    >
                      Previous
                    </button>
                  )}
                  
                  {activeStep < 2 && (
                    <button 
                      className="next-button"
                      onClick={() => goToStep(activeStep + 1)}
                      disabled={(activeStep === 0 && !hasValidToken) || (activeStep === 1 && selectedModelIds.length === 0)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
  
              {hasValidToken && selectedModelIds.length > 0 && (
                <div className="configuration-summary">
                  <h3>Configuration Summary</h3>
                  <div className="summary-item">
                    <span className="summary-label">Models:</span>
                    <span className="summary-value">
                      {selectedModelIds.join(', ')}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Parameters:</span>
                    <div className="parameters-summary">
                      {Object.entries(Object.keys(modelParameters).length > 0 ? modelParameters : globalParameters)
                        .map(([key, value]) => (
                          <div key={key} className="parameter-summary-item">
                            <span className="parameter-name">{key}:</span>
                            <span className="parameter-value">{value.toString()}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="platform-compatibility">
                    <h4>Platform Compatibility</h4>
                    <div className="platform-indicators">
                      <div className="platform-indicator">
                        <span className="platform-icon windows">🖥️</span>
                        <span className="platform-name">Windows</span>
                        <span className="compatibility-status">✓</span>
                      </div>
                      <div className="platform-indicator">
                        <span className="platform-icon macos">🖥️</span>
                        <span className="platform-name">macOS</span>
                        <span className="compatibility-status">✓</span>
                      </div>
                      <div className="platform-indicator">
                        <span className="platform-icon linux">🖥️</span>
                        <span className="platform-name">Linux</span>
                        <span className="compatibility-status">✓</span>
                      </div>
                    </div>
                    <p className="compatibility-note">
                      This integration works on all desktop platforms.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HuggingFaceConfig;