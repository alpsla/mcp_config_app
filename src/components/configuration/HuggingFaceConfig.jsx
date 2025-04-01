import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Alert, Toggle, Card, Badge } from '../ui';
import { EyeIcon, EyeOffIcon, CheckIcon } from '../icons';
import { useAuth } from '../../auth/AuthContext';

/**
 * HuggingFaceConfiguration component for managing Hugging Face API integration
 * 
 * @param {Object} props
 * @param {Object} props.config - Current Hugging Face configuration
 * @param {Function} props.updateConfig - Callback to update the configuration
 */
const HuggingFaceConfig = ({
  config = { token: '', selectedModels: [] },
  updateConfig
}) => {
  // Get authentication context for subscription info
  const { getUserSubscriptionTier, updateSubscriptionTier } = useAuth();
  
  // State for token management
  const [token, setToken] = useState(config.token || '');
  const [showToken, setShowToken] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isValidating, setIsValidatingToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  // State for model selection
  const [selectedModels, setSelectedModels] = useState(config.selectedModels || []);
  
  // Get current subscription tier
  const [subscriptionTier, setSubscriptionTier] = useState(getUserSubscriptionTier() || 'none');

  // All available models
  const availableModels = [
    {
      id: 'flux-1-dev-infer',
      name: 'Flux.1-dev',
      description: 'High-quality image generation model',
      type: 'Image Generation',
      popularity: 'High'
    },
    {
      id: 'whisper-large-v3-turbo',
      name: 'Whisper Large V3 Turbo',
      description: 'State-of-the-art speech recognition and transcription',
      type: 'Audio Transcription',
      popularity: 'High'
    },
    {
      id: 'qwen2-72b-instruct',
      name: 'Qwen2-72B-Instruct',
      description: 'Large language model for text generation and understanding',
      type: 'Language Model',
      popularity: 'Medium'
    },
    {
      id: 'shuttle-3-1-aesthetic',
      name: 'Shuttle 3.1 Aesthetic',
      description: 'Artistic image generation with aesthetic optimization',
      type: 'Image Generation',
      popularity: 'Medium'
    },
    {
      id: 'llama3-70b-instruct',
      name: 'Llama3-70B-Instruct',
      description: 'Open-source large language model for instructions',
      type: 'Language Model',
      popularity: 'High'
    },
    {
      id: 'musicgen-large',
      name: 'MusicGen Large',
      description: 'Generate high-quality music from text prompts',
      type: 'Audio Generation',
      popularity: 'Medium'
    },
    {
      id: 'deepseek-coder-33b',
      name: 'DeepSeek Coder 33B',
      description: 'Specialized model for code generation and understanding',
      type: 'Code Generation',
      popularity: 'Medium'
    },
    {
      id: 'sdxl-turbo',
      name: 'SDXL Turbo',
      description: 'Fast real-time image generation',
      type: 'Image Generation',
      popularity: 'High'
    },
    {
      id: 'videocrafter-2',
      name: 'VideoCrafter 2',
      description: 'Generate short videos from text descriptions',
      type: 'Video Generation',
      popularity: 'Low'
    },
    {
      id: 'stable-cascade',
      name: 'Stable Cascade',
      description: 'Advanced diffusion model for detailed image generation',
      type: 'Image Generation',
      popularity: 'Medium'
    }
  ];

  // Update parent component when config changes
  useEffect(() => {
    updateConfig({
      ...config,
      token,
      selectedModels
    });
  }, [token, selectedModels, config, updateConfig]);

  // Function to validate the Hugging Face API token
  const validateToken = useCallback(async () => {
    // Skip validation if token is empty
    if (!token || token.length < 8) {
      setTokenError('Token must be at least 8 characters.');
      setIsTokenValid(false);
      return false;
    }

    try {
      setIsValidatingToken(true);
      
      // In a real implementation, this would call the Hugging Face API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, consider token valid if it starts with "hf_"
      const isValid = token.startsWith('hf_');
      
      if (!isValid) {
        setTokenError('Invalid token format. Hugging Face tokens typically start with "hf_".');
        setIsTokenValid(false);
      } else {
        setTokenError(null);
        setIsTokenValid(true);
      }
      
      setIsValidatingToken(false);
      return isValid;
    } catch (error) {
      console.error('Error validating token:', error);
      setTokenError('Failed to validate token. Please try again.');
      setIsTokenValid(false);
      setIsValidatingToken(false);
      return false;
    }
  }, [token]);

  // Validate token when it changes
  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        validateToken();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setIsTokenValid(false);
      setTokenError(null);
    }
  }, [token, validateToken]);

  // Function to handle token input change
  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  // Function to toggle token visibility
  const handleToggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  // Function to toggle a model in the selected list
  const handleModelToggle = (modelId) => {
    // Check if we're trying to select a model
    const isSelecting = !selectedModels.includes(modelId);
    
    // If selecting and we're at the limit for basic tier, show upgrade prompt
    if (isSelecting && 
        subscriptionTier === 'basic' && 
        selectedModels.length >= 3) {
      // Show upgrade prompt
      handleUpgradeRequest();
      return;
    }
    
    // Otherwise, toggle the model
    if (isSelecting) {
      setSelectedModels([...selectedModels, modelId]);
    } else {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    }
  };

  // Function to handle subscription upgrade request
  const handleUpgradeRequest = () => {
    // For demo purposes, just upgrade to next tier
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
  };

  // Get the maximum number of models allowed for current tier
  const getMaxModelsAllowed = () => {
    switch (subscriptionTier) {
      case 'none':
        return 0;
      case 'basic':
        return 3;
      case 'complete':
      case 'premium':
        return 10;
      default:
        return 0;
    }
  };

  // Check if a model can be selected based on tier and current selections
  const canSelectModel = (modelId) => {
    if (subscriptionTier === 'none') return false;
    if (selectedModels.includes(modelId)) return true;
    if (subscriptionTier === 'complete' || subscriptionTier === 'premium') return true;
    return selectedModels.length < getMaxModelsAllowed();
  };

  return (
    <div className="huggingface-configuration">
      <div className="huggingface-header">
        <h3>Hugging Face Models</h3>
        <p>Connect specialized AI models to extend Claude's capabilities.</p>
      </div>

      {subscriptionTier === 'none' && (
        <Alert 
          type="info" 
          message="A subscription is required to use Hugging Face models." 
          action={{
            label: "Subscribe",
            onClick: handleUpgradeRequest
          }}
        />
      )}

      {subscriptionTier === 'basic' && selectedModels.length >= 3 && (
        <Alert 
          type="info" 
          message="You're using 3/3 models available in your Basic subscription." 
          action={{
            label: "Upgrade",
            onClick: handleUpgradeRequest
          }}
        />
      )}

      <div className="token-section">
        <h4>API Token</h4>
        <p>Enter your Hugging Face API token to access models.</p>
        
        <div className="token-input-container">
          <Input
            type={showToken ? "text" : "password"}
            value={token}
            onChange={handleTokenChange}
            placeholder="Enter Hugging Face API token"
            className="token-input"
            disabled={subscriptionTier === 'none'}
          />
          <Button
            onClick={handleToggleTokenVisibility}
            className="show-token-button"
            disabled={subscriptionTier === 'none'}
          >
            {showToken ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
        
        {tokenError && (
          <div className="token-error">
            {tokenError}
          </div>
        )}
        
        {isValidating && (
          <div className="token-validating">
            Validating token...
          </div>
        )}
        
        {isTokenValid && (
          <div className="token-valid">
            <CheckIcon /> Token verified successfully
          </div>
        )}
      </div>

      <div className="models-section">
        <div className="models-header">
          <h4>Select Models</h4>
          {subscriptionTier !== 'none' && (
            <div className="models-counter">
              {selectedModels.length}/{getMaxModelsAllowed()} models selected
            </div>
          )}
        </div>
        
        <div className="model-grid">
          {availableModels.map(model => (
            <Card 
              key={model.id}
              className={`model-card ${selectedModels.includes(model.id) ? 'selected' : ''} ${!canSelectModel(model.id) && !selectedModels.includes(model.id) ? 'disabled' : ''}`}
            >
              <div className="model-card-header">
                <h5>{model.name}</h5>
                <Badge type={model.popularity === 'High' ? 'primary' : model.popularity === 'Medium' ? 'secondary' : 'default'}>
                  {model.popularity} popularity
                </Badge>
              </div>
              
              <p className="model-description">{model.description}</p>
              
              <div className="model-footer">
                <span className="model-type">{model.type}</span>
                
                <Toggle
                  checked={selectedModels.includes(model.id)}
                  onChange={() => handleModelToggle(model.id)}
                  disabled={!canSelectModel(model.id) && !selectedModels.includes(model.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="tools-list">
        <h4>Tools that will be available:</h4>
        <div className="tools-grid">
          {[
            'FLUX_1-schnell-infer',
            'Flux_1-dev-infer',
            'shuttle-3_1-aesthetic-infer',
            'whisper-large-v3-turbo-predict',
            'Qwen2-72B-Instruct-model_chat'
          ].map(tool => (
            <div key={tool} className="tool-item">
              <span className="tool-icon">⚙️</span> {tool}
            </div>
          ))}
        </div>
      </div>

      {subscriptionTier !== 'none' && (
        <div className="subscription-info">
          <h4>Your Subscription: {subscriptionTier === 'basic' ? 'Basic' : 'Complete'}</h4>
          {subscriptionTier === 'basic' ? (
            <p>
              Basic subscription allows you to select up to 3 models. 
              <Button className="upgrade-link" onClick={handleUpgradeRequest}>
                Upgrade to select all 10 models
              </Button>
            </p>
          ) : (
            <p>Complete subscription allows you to select all available models.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HuggingFaceConfig;