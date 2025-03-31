import React, { useState, useEffect } from 'react';
import TokenInput from './TokenInput';
import ModelSelection from './ModelSelection';
import ParameterManager from './ParameterManager';
import { HuggingFaceService } from '../../services/huggingFaceService';
import { Platform } from '../../utils/platform';

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
  userTier?: 'free' | 'standard' | 'premium';
}

const HuggingFaceConfig: React.FC<HuggingFaceConfigProps> = ({
  onConfigurationUpdate,
  initialConfig = { 
    enabled: false, 
    modelId: '',
    parameters: {}
  },
  userTier = 'free'
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(initialConfig.enabled);
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(initialConfig.modelId);
  const [globalParameters, setGlobalParameters] = useState<Record<string, any>>({
    temperature: 0.7,
    max_length: 100,
    top_p: 0.9
  });
  const [modelParameters, setModelParameters] = useState<Record<string, any>>(
    initialConfig.parameters || {}
  );
  const [activeStep, setActiveStep] = useState<number>(0);
  
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
      modelId: selectedModelId,
      parameters: Object.keys(modelParameters).length > 0 ? modelParameters : globalParameters
    });
  }, [isEnabled, selectedModelId, globalParameters, modelParameters, onConfigurationUpdate]);
  
  const handleToggle = () => {
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
  
  const handleModelSelected = (modelId: string) => {
    setSelectedModelId(modelId);
    // Move to next step if model is selected
    if (activeStep === 1) {
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
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
            />
            <span className="toggle-slider"></span>
          </label>
          <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
      
      {isEnabled && (
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
              className={`step-indicator ${activeStep >= 1 ? 'active' : ''} ${selectedModelId ? 'completed' : ''}`}
              onClick={() => hasValidToken && goToStep(1)}
            >
              <span className="step-number">2</span>
              <span className="step-label">Select Model</span>
            </div>
            <div 
              className={`step-indicator ${activeStep >= 2 ? 'active' : ''}`}
              onClick={() => selectedModelId && goToStep(2)}
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
                <ModelSelection 
                  userTier={userTier} 
                  onModelSelected={handleModelSelected}
                  selectedModelId={selectedModelId}
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
                disabled={(activeStep === 0 && !hasValidToken) || (activeStep === 1 && !selectedModelId)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
      
      {isEnabled && hasValidToken && selectedModelId && (
        <div className="configuration-summary">
          <h3>Configuration Summary</h3>
          <div className="summary-item">
            <span className="summary-label">Model:</span>
            <span className="summary-value">{selectedModelId}</span>
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
          
          <div className="desktop-compatibility">
            <h4>Desktop Compatibility</h4>
            <p>
              {Platform.isWindows() && "Windows: ✓ Fully Compatible"}
              {Platform.isMac() && "macOS: ✓ Fully Compatible"}
              {Platform.isLinux() && "Linux: ✓ Fully Compatible"}
            </p>
            <p className="compatibility-note">
              This integration requires the desktop application for secure token handling.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HuggingFaceConfig;
