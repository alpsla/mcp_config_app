import React, { useState, useEffect } from 'react';
import './ConfigComponents.css';
import { useAuth } from '../../auth/AuthContext';

const HuggingFaceConfig = ({ config = {}, updateConfig }) => {
  const { getUserSubscriptionTier } = useAuth();
  const [apiToken, setApiToken] = useState(config.apiToken || '');
  const [showToken, setShowToken] = useState(false);
  const [selectedModels, setSelectedModels] = useState(config.selectedModels || []);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  // Get current subscription tier
  const subscriptionTier = getUserSubscriptionTier() || 'none';
  
  // Available models data - with tier requirements
  const availableModels = [
    { id: 'flux-1-dev', name: 'Flux.1-dev-infer', type: 'Image Generation', tier: 'basic' },
    { id: 'whisper-v3', name: 'Whisper-large-v3-turbo', type: 'Audio Transcription', tier: 'basic' },
    { id: 'qwen2-72b', name: 'Qwen2-72B-Instruct', type: 'Language Model', tier: 'basic' },
    { id: 'shuttle-3-1', name: 'Shuttle-3.1-aesthetic', type: 'Image Generation', tier: 'basic' },
    { id: 'llama3-70b', name: 'Llama3-70B-Instruct', type: 'Language Model', tier: 'basic' },
    { id: 'musicgen', name: 'MusicGen-Large', type: 'Audio Generation', tier: 'complete' },
    { id: 'deepseek-coder', name: 'DeepSeek-Coder-33B', type: 'Code Generation', tier: 'complete' },
    { id: 'sdxl-turbo', name: 'SDXL-Turbo', type: 'Image Generation', tier: 'complete' },
    { id: 'videocrafter', name: 'VideoCrafter-2', type: 'Video Generation', tier: 'complete' },
    { id: 'stable-cascade', name: 'Stable Cascade', type: 'Image Generation', tier: 'complete' },
  ];
  
  // Update parent component when values change
  useEffect(() => {
    updateConfig({
      apiToken,
      selectedModels
    });
  }, [apiToken, selectedModels, updateConfig]);
  
  // Handle token input
  const handleTokenChange = (e) => {
    const token = e.target.value;
    setApiToken(token);
    // Simple validation for demonstration
    setIsTokenValid(token.startsWith('hf_') && token.length > 10);
  };
  
  // Toggle token visibility
  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };
  
  // Handle model selection
  const handleModelToggle = (modelId) => {
    if (selectedModels.includes(modelId)) {
      // Remove from selection
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else {
      // Add to selection if not at tier limit
      const modelTier = availableModels.find(m => m.id === modelId)?.tier;
      const userCanAccessModel = canUserAccessTier(modelTier);
      
      if (userCanAccessModel && !atModelLimit()) {
        setSelectedModels([...selectedModels, modelId]);
      }
    }
  };
  
  // Check if user is at their model selection limit
  const atModelLimit = () => {
    const modelLimit = getModelLimit();
    return selectedModels.length >= modelLimit;
  };
  
  // Get model limit based on tier
  const getModelLimit = () => {
    switch(subscriptionTier) {
      case 'basic': return 3;
      case 'complete': return availableModels.length;
      default: return 0;
    }
  };
  
  // Check if user can access a model tier
  const canUserAccessTier = (modelTier) => {
    if (subscriptionTier === 'complete') return true;
    if (subscriptionTier === 'basic' && modelTier === 'basic') return true;
    return false;
  };
  
  // Filter models based on user's subscription
  const getAccessibleModels = () => {
    if (subscriptionTier === 'none') {
      return availableModels; // Show all but don't allow selection
    }
    
    if (subscriptionTier === 'basic') {
      return availableModels; // Show all but limit selection to basic tier
    }
    
    return availableModels; // Complete tier can access all
  };
  
  const accessibleModels = getAccessibleModels();

  return (
    <div className="config-component">
      <h2 className="config-component-title">Hugging Face Integration</h2>
      
      <p className="config-component-description">
        Connect specialized AI models from Hugging Face to extend Claude's capabilities.
      </p>
      
      <div className="config-form">
        <div className="config-form-group">
          <label className="config-form-label">
            Hugging Face API Token
          </label>
          
          <div className="config-token-input">
            <input 
              type={showToken ? "text" : "password"} 
              className="config-form-input" 
              value={apiToken}
              onChange={handleTokenChange}
              placeholder="hf_..."
            />
            <button 
              type="button" 
              className="config-token-toggle"
              onClick={toggleTokenVisibility}
            >
              {showToken ? "Hide" : "Show"}
            </button>
          </div>
          
          <p className="config-form-helper">
            Enter your Hugging Face API token. You can get one from the{" "}
            <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">
              Hugging Face settings page
            </a>.
          </p>
          
          {apiToken && !isTokenValid && (
            <div className="config-validation-error">
              Invalid token format. Tokens should start with "hf_" and be at least 10 characters long.
            </div>
          )}
        </div>
        
        <div className="config-tier-info">
          <div className="config-tier-badge">
            Subscription Tier: {subscriptionTier === 'none' ? 'None' : subscriptionTier === 'basic' ? 'Basic' : 'Complete'}
          </div>
          
          {subscriptionTier === 'none' && (
            <div className="config-subscription-required">
              A subscription is required to use Hugging Face models.
              <button className="config-upgrade-button">Subscribe Now</button>
            </div>
          )}
          
          {subscriptionTier === 'basic' && (
            <div className="config-tier-limit">
              You can select up to 3 basic tier models.
              {selectedModels.length >= 3 && (
                <button className="config-upgrade-button">Upgrade to Complete</button>
              )}
            </div>
          )}
          
          {subscriptionTier === 'complete' && (
            <div className="config-tier-complete">
              You have access to all available models.
            </div>
          )}
        </div>
        
        <div className="config-model-selection">
          <label className="config-form-label">
            Available Models
          </label>
          
          <div className="config-models-grid">
            {accessibleModels.map(model => (
              <div 
                key={model.id} 
                className={`
                  config-model-card 
                  ${selectedModels.includes(model.id) ? 'selected' : ''} 
                  ${!canUserAccessTier(model.tier) ? 'locked' : ''}
                `}
                onClick={() => canUserAccessTier(model.tier) && handleModelToggle(model.id)}
              >
                <div className="config-model-header">
                  <h4 className="config-model-name">{model.name}</h4>
                  {model.tier === 'complete' && subscriptionTier !== 'complete' && (
                    <div className="config-model-subscription-indicator">
                      Complete Tier
                    </div>
                  )}
                </div>
                
                <div className="config-model-type">{model.type}</div>
                
                <div className="config-model-selection-indicator">
                  {selectedModels.includes(model.id) && <span>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedModels.length > 0 && (
          <div className="config-selected-models-summary">
            <label className="config-form-label">
              Selected Models ({selectedModels.length}/{getModelLimit()})
            </label>
            
            <ul className="config-selected-models-list">
              {selectedModels.map(modelId => {
                const model = availableModels.find(m => m.id === modelId);
                return (
                  <li key={modelId} className="config-selected-model-item">
                    <div className="config-selected-model-info">
                      <span className="config-selected-model-name">{model.name}</span>
                      <span className="config-selected-model-type">{model.type}</span>
                    </div>
                    <button 
                      className="config-remove-model"
                      onClick={() => handleModelToggle(modelId)}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        
        <div className="config-coming-soon">
          <h4>Coming Soon</h4>
          <ul>
            <li>Unlimited model selection from thousands of Hugging Face models</li>
            <li>Custom parameter configuration for each model</li>
            <li>Model performance analytics</li>
          </ul>
        </div>
      </div>
      
      <div className="config-platform-compatibility">
        <h4>Platform Compatibility</h4>
        <p>Hugging Face integration is available on all desktop platforms.</p>
      </div>
      
      <div className="config-component-footer">
        <div className="config-status">
          {apiToken && isTokenValid && selectedModels.length > 0 ? (
            <>
              <div className="config-status-icon config-status-success"></div>
              <span>Hugging Face Integration is properly configured</span>
            </>
          ) : (
            <>
              <div className="config-status-icon config-status-warning"></div>
              <span>
                {!apiToken ? 'API token required' : 
                 !isTokenValid ? 'Valid API token required' : 
                 selectedModels.length === 0 ? 'Select at least one model' : ''}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HuggingFaceConfig;