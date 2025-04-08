import React, { useState, useEffect } from 'react';
import HuggingFaceTokenInput from './HuggingFaceTokenInput';
import TieredModelSelector from './TieredModelSelector';
import ParameterManager from './ParameterManager';
import { HuggingFaceService } from '../../services/huggingFaceService';
import { useAuth } from '../../auth/AuthContext';
import { useSubscription, SubscriptionProvider } from '../../contexts/SubscriptionContext';
import './config-steps-fix.css';
import './toggle-fix.css';
import './HuggingFaceTokenInput.css';
import './ParameterManager.css';

interface HuggingFaceConfigProps {
  onConfigurationUpdate: (config: { 
    enabled: boolean; 
    modelIds: string[];
    parameters: Record<string, any>;
  }) => void;
  initialConfig?: { 
    enabled: boolean; 
    modelIds: string[];
    parameters: Record<string, any>;
  };
  userTier?: 'none' | 'basic' | 'complete' | 'free' | 'standard' | 'premium';
}

// Define available models for mapping IDs to names
const AVAILABLE_MODELS = [
  { 
    id: 'flux-1-dev-infer', 
    name: 'Flux.1-dev', 
    description: 'High-quality image generation model',
    type: 'Image Generation'
  },
  { 
    id: 'shuttle-3.1-aesthetic', 
    name: 'Shuttle 3.1 Aesthetic', 
    description: 'Artistic image generation with aesthetic optimization',
    type: 'Image Generation'
  },
  { 
    id: 'sdxl-turbo', 
    name: 'SDXL Turbo', 
    description: 'Fast real-time image generation',
    type: 'Image Generation'
  },
  { 
    id: 'stable-cascade', 
    name: 'Stable Cascade', 
    description: 'Advanced diffusion-based image generation',
    type: 'Image Generation'
  },
  { 
    id: 'whisper-large-v3-turbo', 
    name: 'Whisper Large V3 Turbo', 
    description: 'State-of-the-art speech recognition and transcription',
    type: 'Audio Transcription'
  },
  { 
    id: 'qwen2-72b-instruct', 
    name: 'Qwen2-72B-Instruct', 
    description: 'Large language model for text generation and understanding',
    type: 'Language Model'
  },
  { 
    id: 'llama3-70b-instruct', 
    name: 'Llama3-70B-Instruct', 
    description: 'Open-source large language model for instructions',
    type: 'Language Model'
  },
  { 
    id: 'deepseek-coder-33b', 
    name: 'DeepSeek-Coder-33B', 
    description: 'Specialized model for code generation and completion',
    type: 'Code Generation'
  },
  { 
    id: 'videocrafter-2', 
    name: 'VideoCrafter-2', 
    description: 'Text-to-video generation model',
    type: 'Video Generation'
  },
  { 
    id: 'musicgen-large', 
    name: 'MusicGen-Large', 
    description: 'Audio generation from text prompts',
    type: 'Audio Generation'
  }
];

const HuggingFaceConfig: React.FC<HuggingFaceConfigProps> = ({
  onConfigurationUpdate,
  initialConfig = { 
    enabled: false, 
    modelIds: [],
    parameters: {}
  },
  userTier = 'none'
}) => {
  const { getUserSubscriptionTier } = useAuth();
  const { subscription, updateSubscription } = useSubscription();
  const [isEnabled, setIsEnabled] = useState<boolean>(initialConfig.enabled);
  const [hasValidToken, setHasValidToken] = useState<boolean>(false);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(
    initialConfig.modelIds || []
  );
  
  // Update to handle per-model parameters with maxLength set to 512 as requested
  const [globalParameters, setGlobalParameters] = useState<Record<string, any>>({
    temperature: 0.7,
    max_length: 512, // Changed from 2048 to 512 as requested
    top_p: 0.9
  });
  
  // Store parameters for each model separately
  const [modelParameters, setModelParameters] = useState<Record<string, Record<string, any>>>(
    initialConfig.parameters as Record<string, Record<string, any>> || {}
  );
  
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Map old tier values to new tier values if needed
  const getMappedTier = (tier: string): 'none' | 'basic' | 'complete' => {
    switch(tier) {
      case 'free': return 'none';
      case 'standard': return 'basic';
      case 'premium': return 'complete';
      default: return tier as 'none' | 'basic' | 'complete';
    }
  };
  
  // If no subscription is explicitly provided from the context, use the prop or get from auth context
  useEffect(() => {
    if (subscription === 'none') {
      const mappedTier = getMappedTier(userTier !== 'none' ? userTier : (getUserSubscriptionTier() || 'none'));
      updateSubscription(mappedTier);
    }
  }, [subscription, userTier, getUserSubscriptionTier, updateSubscription]);
  
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
    // Compile all parameters into a single object for the parent component
    // This combines global parameters with any model-specific overrides
    const combinedParameters: Record<string, any> = {
      ...globalParameters,
      ...Object.fromEntries(
        Object.entries(modelParameters).map(([modelId, params]) => [
          `model.${modelId}`, params
        ])
      )
    };
    
    onConfigurationUpdate({
      enabled: isEnabled,
      modelIds: selectedModelIds,
      parameters: combinedParameters
    });
  }, [isEnabled, selectedModelIds, globalParameters, modelParameters, onConfigurationUpdate]);
  
  const handleToggle = () => {
    // If user is not subscribed, don't allow enabling
    if (subscription === 'none' && !isEnabled) {
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
  
  const handleModelToggle = (modelId: string) => {
    setSelectedModelIds(prev => {
      if (prev.includes(modelId)) {
        // Remove the model if already selected
        const newSelectedModels = prev.filter(id => id !== modelId);
        
        // Also remove model parameters if they exist
        const newModelParameters = { ...modelParameters };
        delete newModelParameters[modelId];
        setModelParameters(newModelParameters);
        
        return newSelectedModels;
      } else {
        // Add the model if not already selected
        return [...prev, modelId];
      }
    });
  };
  
  const handleParametersUpdate = (modelId: string, parameters: Record<string, any>, isGlobal: boolean) => {
    if (isGlobal) {
      // Update global parameters
      setGlobalParameters(parameters);
    } else {
      // Update model-specific parameters
      setModelParameters(prev => ({
        ...prev,
        [modelId]: parameters
      }));
    }
  };
  
  // Navigate between steps
  const goToStep = (step: number) => {
    setActiveStep(step);
  };
  
  // Helper to find model name by ID
  const getModelNameById = (modelId: string): string => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };
  
  return (
    <div className="huggingface-config" style={{ position: 'relative', zIndex: 5 }}>
      <div className="config-header" style={{ position: 'relative', zIndex: 10 }}>
        <h2>Hugging Face Integration</h2>
        <div className="toggle-container" style={{ position: 'relative', zIndex: 10 }}>
          {subscription !== 'none' ? (
            <>
              {/* Use a simplified toggle instead of the problematic one */}
              <button 
                onClick={handleToggle}
                className={`simple-toggle ${isEnabled ? 'enabled' : 'disabled'}`}
                style={{
                  padding: '8px 12px',
                  backgroundColor: isEnabled ? '#4e5dde' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                {isEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </>
          ) : (
            // For non-subscribers, show subscription indicator
            <div className="subscription-required">Subscription Required</div>
          )}
        </div>
      </div>
      
      {/* For subscribers, show toggle and additional components when enabled */}
      {isEnabled && subscription !== 'none' && (
        <>
          {/* Apply inline styles to force proper layout */}
          <div className="config-steps" style={{ position: 'relative', zIndex: 5, overflow: 'visible' }}>
            <div className="step-indicators" style={{ position: 'relative', zIndex: 10, backgroundColor: 'white' }}>
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
                <span className="step-label">Select Models</span>
              </div>
              <div 
                className={`step-indicator ${activeStep >= 2 ? 'active' : ''}`}
                onClick={() => selectedModelIds.length > 0 && goToStep(2)}
              >
                <span className="step-number">3</span>
                <span className="step-label">Configure Parameters</span>
              </div>
            </div>
            
            <div className="step-content" style={{ position: 'relative', zIndex: 5, overflow: 'visible', backgroundColor: 'white' }}>
              {activeStep === 0 && (
                <div className="token-step">
                  <HuggingFaceTokenInput onTokenValidated={handleTokenValidated} />
                </div>
              )}
              
              {activeStep === 1 && (
                <div className="model-step" style={{ position: 'relative', zIndex: 5, overflow: 'visible' }}>
                  <TieredModelSelector 
                    selectedModels={selectedModelIds}
                    onModelToggle={handleModelToggle}
                  />
                </div>
              )}
              
              {activeStep === 2 && (
                <div className="parameters-step">
                  <h3>Global Parameters</h3>
                  <p>These parameters will be applied to all models unless overridden.</p>
                  <ParameterManager 
                    globalParameters={globalParameters}
                    modelSpecificParameters={{}}
                    onParametersChange={(params, isGlobal) => handleParametersUpdate('global', params, true)}
                  />
                  
                  <h3>Model-Specific Parameters</h3>
                  <p>Configure individual parameters for each selected model.</p>
                  <div className="model-specific-parameters">
                    {selectedModelIds.map(modelId => (
                      <div key={modelId} className="model-parameter-card">
                        <h4>{getModelNameById(modelId)}</h4>
                        <ParameterManager 
                          globalParameters={globalParameters}
                          modelSpecificParameters={modelParameters[modelId] || {}}
                          onParametersChange={(params, isGlobal) => {
                            if (!isGlobal) {
                              handleParametersUpdate(modelId, params, false);
                            }
                          }}
                          modelId={modelId}
                        />
                      </div>
                    ))}
                  </div>
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
                <span className="summary-label">Selected Models:</span>
                <span className="summary-value">
                  {selectedModelIds.length} models selected
                </span>
                <ul className="model-list">
                  {selectedModelIds.map(modelId => (
                    <li key={modelId}>
                      {getModelNameById(modelId)}
                    </li>
                  ))}
                </ul>
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
      
      {/* For non-subscribers, show the TieredModelSelector in "preview" mode */}
      {subscription === 'none' && (
        <TieredModelSelector 
          selectedModels={selectedModelIds}
          onModelToggle={handleModelToggle}
        />
      )}
    </div>
  );
};

// Wrap component with SubscriptionProvider if needed
const WrappedHuggingFaceConfig: React.FC<HuggingFaceConfigProps> = (props) => {
  return (
    <SubscriptionProvider>
      <HuggingFaceConfig {...props} />
    </SubscriptionProvider>
  );
};

export default WrappedHuggingFaceConfig;