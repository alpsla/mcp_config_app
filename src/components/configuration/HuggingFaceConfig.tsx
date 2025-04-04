import React, { useState, useEffect, useCallback } from 'react';
import { SubscriptionTier } from '../../types';
import { useAuth } from '../../auth/AuthContext';
import './ConfigComponents.css';

// Use our custom UI components, not bootstrap
import { Button, Input, Card, Badge, Toggle } from '../ui';

// Import icons
import { EyeIcon, EyeOffIcon, CheckIcon } from '../icons';

interface HuggingFaceModel {
  id: string;
  name: string;
  description: string;
  type: string;
  popularity: 'High' | 'Medium' | 'Low';
}

interface HuggingFaceConfigData {
  token?: string;
  selectedModels?: string[];
}

interface HuggingFaceConfigProps {
  config: HuggingFaceConfigData;
  updateConfig: (config: HuggingFaceConfigData) => void;
}

interface SubscriptionModalProps {
  onSubscribe: (tier: 'basic' | 'complete') => void;
  onCancel: () => void;
}

/**
 * Custom Modal Component
 */
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string; 
}

const Modal: React.FC<ModalProps> = ({ children, onClose, className }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal-container ${className || ''}`}>
        <div className="modal-close-button" onClick={onClose}>
          &times;
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Subscription Modal Component
 */
const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onSubscribe, onCancel }) => {
  return (
    <Modal onClose={onCancel} className="subscription-modal">
      <div className="subscription-modal-header">
        <h2>Subscribe to Enable Hugging Face Models</h2>
        <p>Choose a subscription plan to access powerful AI models</p>
      </div>
      
      <div className="subscription-options">
        <Card className="subscription-option">
          <h3>Basic Tier</h3>
          <div className="subscription-price">$2<span>/month</span></div>
          <ul className="subscription-features">
            <li>Access to all 10 models</li>
            <li>Select up to 3 models at a time</li>
            <li>Monthly model updates</li>
            <li>Standard support</li>
          </ul>
          <Button 
            className="subscribe-button" 
            onClick={() => onSubscribe('basic')}
            disabled={false}
          >
            Subscribe to Basic
          </Button>
        </Card>
        
        <Card className="subscription-option featured">
          <div className="best-value-badge">Best Value</div>
          <h3>Complete Tier</h3>
          <div className="subscription-price">$5<span>/month</span></div>
          <ul className="subscription-features">
            <li>Access to all 10 models</li>
            <li>Use all models simultaneously</li>
            <li>Early access to new models</li>
            <li>Priority support</li>
          </ul>
          <Button 
            className="subscribe-button primary" 
            onClick={() => onSubscribe('complete')}
            disabled={false}
          >
            Subscribe to Complete
          </Button>
        </Card>
      </div>
      
      <div className="subscription-footer">
        <p>Cancel anytime. No long-term commitment required.</p>
        <Button className="cancel-button" onClick={onCancel} disabled={false}>Maybe Later</Button>
      </div>
    </Modal>
  );
};

/**
 * Upgrade Prompt Component
 */
interface UpgradePromptProps {
  onUpgrade: () => void;
  onDismiss: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ onUpgrade, onDismiss }) => {
  return (
    <Modal onClose={onDismiss} className="upgrade-modal">
      <div className="upgrade-modal-header">
        <h2>You've reached your Basic tier limit</h2>
      </div>
      
      <div className="upgrade-modal-content">
        <p>
          Your current plan allows selection of up to 3 models. 
          Upgrade to the Complete tier to access all 10 models.
        </p>
        
        <div className="tier-comparison">
          <div className="current-tier">
            <h4>Basic Tier</h4>
            <p>3 models maximum</p>
            <p>$2/month</p>
          </div>
          
          <div className="upgrade-tier">
            <h4>Complete Tier</h4>
            <p>All 10 models</p>
            <p>$5/month</p>
          </div>
        </div>
      </div>
      
      <div className="upgrade-modal-footer">
        <Button className="upgrade-now-button primary" onClick={onUpgrade} disabled={false}>
          Upgrade Now
        </Button>
        <Button className="maybe-later-button" onClick={onDismiss} disabled={false}>
          Maybe Later
        </Button>
      </div>
    </Modal>
  );
};

/**
 * Main HuggingFaceConfig Component
 */
const HuggingFaceConfig: React.FC<HuggingFaceConfigProps> = ({
  config = { token: '', selectedModels: [] },
  updateConfig
}) => {
  // Get authentication context for subscription info
  const { getUserSubscriptionTier, updateSubscriptionTier } = useAuth();
  
  // State for token management
  const [token, setToken] = useState(config.token || '');
  const [showToken, setShowToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isValidating, setIsValidatingToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  // State for model selection
  const [selectedModels, setSelectedModels] = useState<string[]>(config.selectedModels || []);
  
  // Get current subscription tier
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(
    getUserSubscriptionTier() || SubscriptionTier.FREE
  );

  // Modal state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // All available models
  const availableModels: HuggingFaceModel[] = [
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
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  // Function to toggle token visibility
  const handleToggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  // Function to handle subscription
const handleSubscribe = (tier: 'basic' | 'complete') => {
  setSubscriptionTier(tier === 'basic' ? SubscriptionTier.STARTER : SubscriptionTier.COMPLETE);
  if (updateSubscriptionTier) {
  updateSubscriptionTier(tier === 'basic' ? SubscriptionTier.STARTER : SubscriptionTier.COMPLETE);
  }
  setShowSubscriptionModal(false);
};

  // Function to toggle a model in the selected list
  const handleModelToggle = (modelId: string) => {
    // Check if we're trying to select a model
    const isSelecting = !selectedModels.includes(modelId);
    
    // For non-subscribers, show subscription modal
    if (subscriptionTier === SubscriptionTier.FREE) {
      setShowSubscriptionModal(true);
      return;
    }
    
    // If selecting and we're at the limit for basic tier, show upgrade prompt
if (isSelecting && 
    subscriptionTier === SubscriptionTier.STARTER && 
    selectedModels.length >= 3) {
    setShowUpgradePrompt(true);
    return;
}
    
    // Otherwise, toggle the model
    if (isSelecting) {
      setSelectedModels([...selectedModels, modelId]);
    } else {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    }
  };

  // Function to handle upgrade
  const handleUpgrade = () => {
    setSubscriptionTier(SubscriptionTier.COMPLETE);
    if (updateSubscriptionTier) {
      updateSubscriptionTier(SubscriptionTier.COMPLETE);
    }
    setShowUpgradePrompt(false);
  };

  // Get the maximum number of models allowed for current tier
  const getMaxModelsAllowed = () => {
    switch (subscriptionTier) {
      case SubscriptionTier.FREE:
        return 0;
      case SubscriptionTier.STARTER:
      case SubscriptionTier.STANDARD:
        return 3;
      case SubscriptionTier.COMPLETE:
        return 10;
      default:
        return 0;
    }
  };

  // Check if a model can be selected based on tier and current selections
  const canSelectModel = (modelId: string) => {
    if (subscriptionTier === SubscriptionTier.FREE) return false;
    if (selectedModels.includes(modelId)) return true;
    if (subscriptionTier === SubscriptionTier.COMPLETE) return true;
    return selectedModels.length < getMaxModelsAllowed();
  };

  // Render subscription status section
  const renderSubscriptionStatus = () => {
    switch (subscriptionTier) {
      case SubscriptionTier.FREE:
        return (
          <div className="subscription-prompt">
            <h4>Subscribe to Enable</h4>
            <p>
              Access specialized AI models by subscribing to a paid plan.
              View all models below, but a subscription is required to use them.
            </p>
            <Button 
              className="subscribe-button primary"
              onClick={() => setShowSubscriptionModal(true)}
              disabled={false}
            >
              Subscribe to Enable
            </Button>
          </div>
        );
      case SubscriptionTier.STARTER:
        return (
          <div className="subscription-status">
            <h4>
              Basic Tier: Select up to 3 models 
              <span className="selection-counter">({selectedModels.length}/3 selected)</span>
            </h4>
            <p>
              Your current plan allows you to select up to 3 models from the collection.
            </p>
            <Button 
              className="upgrade-button"
              onClick={() => setShowUpgradePrompt(true)}
              disabled={false}
            >
              Upgrade to Complete Tier
            </Button>
          </div>
        );
      case SubscriptionTier.COMPLETE:

        return (
          <div className="subscription-status complete">
            <h4>
              Complete Tier: Select up to 10 models
              <span className="selection-counter">({selectedModels.length}/10 selected)</span>
            </h4>
            <p>
              You have access to all available models with your Complete subscription.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="huggingface-configuration">
      <div className="huggingface-header">
        <h3>Hugging Face Models</h3>
        <p>Connect specialized AI models to extend Claude's capabilities.</p>
      </div>

      {renderSubscriptionStatus()}

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
            disabled={subscriptionTier === SubscriptionTier.FREE}
          />
          <Button
            onClick={handleToggleTokenVisibility}
            className="show-token-button"
            disabled={subscriptionTier === SubscriptionTier.FREE}
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
          <h4>Available Models</h4>
          {subscriptionTier !== SubscriptionTier.FREE && (
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
                  disabled={subscriptionTier === SubscriptionTier.FREE}
                  label=""
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="coming-soon-section">
        <h4>✨ Coming Soon in Full Release ✨</h4>
        <div className="coming-soon-features">
          <div className="feature-item">
            <h5>Unlimited Model Selection</h5>
            <p>Browse and search thousands of Hugging Face models</p>
          </div>
          
          <div className="feature-item">
            <h5>Personalized Model Recommendations</h5>
            <p>Get suggestions based on your usage patterns and preferences</p>
          </div>
          
          <div className="feature-item">
            <h5>New Model Alerts</h5>
            <p>Get notified when models you use are updated or when similar models are released</p>
          </div>
          
          <div className="feature-item">
            <h5>Model Performance Analytics</h5>
            <p>See how your models are performing and optimize your setup</p>
          </div>
        </div>
        
        <Button className="updates-button" onClick={() => {}} disabled={false}>
          Sign Up for Updates
        </Button>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal 
          onSubscribe={handleSubscribe}
          onCancel={() => setShowSubscriptionModal(false)}
        />
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt 
          onUpgrade={handleUpgrade}
          onDismiss={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
};

export default HuggingFaceConfig;