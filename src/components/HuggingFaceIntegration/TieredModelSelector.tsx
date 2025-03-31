import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import './TieredModelSelector.css';

// Model data structure
interface Model {
  id: string;
  name: string;
  description: string;
  type: string;
}

// Props for the component
interface TieredModelSelectorProps {
  onModelSelect: (modelIds: string[]) => void;
  selectedModelIds: string[];
}

// Sample models data - in a real app, this would come from an API
const AVAILABLE_MODELS: Model[] = [
  { id: 'flux-1-dev', name: 'Flux.1-dev-infer', description: 'Advanced image generation model', type: 'Image Generation' },
  { id: 'whisper-v3', name: 'Whisper-large-v3-turbo', description: 'Powerful audio transcription system', type: 'Audio Transcription' },
  { id: 'qwen2-72b', name: 'Qwen2-72B-Instruct', description: 'Large language model with instruction following', type: 'Language Model' },
  { id: 'shuttle-3-1', name: 'Shuttle-3.1-aesthetic', description: 'Image generation with aesthetic focus', type: 'Image Generation' },
  { id: 'llama3-70b', name: 'Llama3-70B-Instruct', description: 'Open source large language model', type: 'Language Model' },
  { id: 'musicgen', name: 'MusicGen-Large', description: 'Music generation from text prompts', type: 'Audio Generation' },
  { id: 'deepseek-coder', name: 'DeepSeek-Coder-33B', description: 'Specialized for code generation', type: 'Code Generation' },
  { id: 'sdxl-turbo', name: 'SDXL-Turbo', description: 'Fast high-quality image generation', type: 'Image Generation' },
  { id: 'videocrafter', name: 'VideoCrafter-2', description: 'Text-to-video generation', type: 'Video Generation' },
  { id: 'stable-cascade', name: 'Stable Cascade', description: 'Multi-step image generation model', type: 'Image Generation' },
];

const TieredModelSelector: React.FC<TieredModelSelectorProps> = ({
  onModelSelect,
  selectedModelIds
}) => {
  const { authState, updateSubscriptionTier, getUserSubscriptionTier } = useAuth();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  // Get current subscription tier
  const subscriptionTier = getUserSubscriptionTier() || 'none';
  
  // Determine model limit based on tier
  const getModelLimit = (): number => {
    switch(subscriptionTier) {
      case 'basic': return 3;
      case 'complete': return AVAILABLE_MODELS.length;
      default: return 0;
    }
  };
  
  const modelLimit = getModelLimit();
  
  // Check if user has reached their model limit
  const hasReachedLimit = selectedModelIds.length >= modelLimit && modelLimit > 0;
  
  // Handle model selection
  const handleModelToggle = (modelId: string) => {
    if (subscriptionTier === 'none') {
      setShowSubscriptionModal(true);
      return;
    }
    
    // If model is already selected, remove it
    if (selectedModelIds.includes(modelId)) {
      const newSelection = selectedModelIds.filter(id => id !== modelId);
      onModelSelect(newSelection);
      return;
    }
    
    // Check if adding would exceed limit
    if (selectedModelIds.length >= modelLimit) {
      setShowUpgradePrompt(true);
      return;
    }
    
    // Add the model
    onModelSelect([...selectedModelIds, modelId]);
  };
  
  // Handle subscription
  const handleSubscribe = async (tier: 'basic' | 'complete') => {
    try {
      // Update user's subscription tier - in a real app, this would process payment
      await updateSubscriptionTier(tier);
      setShowSubscriptionModal(false);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };
  
  // Quick test function for direct upgrade
  const handleDirectUpgrade = async () => {
    await updateSubscriptionTier('basic');
  };
  
  // Handle upgrade from basic to complete
  const handleUpgrade = async () => {
    try {
      await updateSubscriptionTier('complete');
      setShowUpgradePrompt(false);
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };
  
  // Render different UI based on subscription tier
  if (subscriptionTier === 'none') {
    return (
      <div className="tiered-model-selector none-subscriber">
        <h4>Hugging Face Models</h4>
        <p className="description">Connect specialized AI models to extend Claude's capabilities.</p>
        
        <button 
          className="subscribe-button"
          onClick={() => handleDirectUpgrade()} // For testing, directly upgrade
        >
          Subscribe to Enable
        </button>
        
        <div className="model-preview">
          <h5>Available Models (Requires Subscription):</h5>
          <p>Basic Tier ($2/month) - Select up to 3 models:</p>
          <ul className="preview-list">
            {AVAILABLE_MODELS.slice(0, 3).map(model => (
              <li key={model.id} className="preview-item">
                • {model.name} ({model.type})
              </li>
            ))}
            <li className="preview-more">• And {AVAILABLE_MODELS.length - 3} more models with Complete tier</li>
          </ul>
        </div>
        
        {showSubscriptionModal && (
          <div className="subscription-modal">
            <div className="modal-content">
              <h3>Choose Your Subscription</h3>
              
              <div className="subscription-options">
                <div className="subscription-option">
                  <h4>Basic Tier</h4>
                  <p className="price">$2/month</p>
                  <ul>
                    <li>Select up to 3 models</li>
                    <li>Regular model updates</li>
                    <li>Basic parameter configuration</li>
                  </ul>
                  <button onClick={() => handleSubscribe('basic')}>
                    Subscribe to Basic
                  </button>
                </div>
                
                <div className="subscription-option recommended">
                  <div className="recommended-badge">Recommended</div>
                  <h4>Complete Tier</h4>
                  <p className="price">$5/month</p>
                  <ul>
                    <li>Select all 10 available models</li>
                    <li>Priority model updates</li>
                    <li>Advanced parameter configuration</li>
                    <li>Premium support</li>
                  </ul>
                  <button onClick={() => handleSubscribe('complete')}>
                    Subscribe to Complete
                  </button>
                </div>
              </div>
              
              <button 
                className="close-button"
                onClick={() => setShowSubscriptionModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="tiered-model-selector">
      <h4>Hugging Face Models</h4>
      <p className="description">Connect specialized AI models to extend Claude's capabilities.</p>
      
      <div className="tier-indicator">
        {subscriptionTier === 'basic' ? (
          <div className="tier-info">
            <span className="tier-badge basic">Basic Tier</span>
            <span className="model-count">Select up to 3 models ({selectedModelIds.length}/{modelLimit} selected)</span>
            <button 
              className="upgrade-button"
              onClick={() => setShowUpgradePrompt(true)}
            >
              Upgrade to Complete Tier
            </button>
          </div>
        ) : (
          <div className="tier-info">
            <span className="tier-badge complete">Complete Tier</span>
            <span className="model-count">Select up to 10 models ({selectedModelIds.length}/{modelLimit} selected)</span>
          </div>
        )}
      </div>
      
      <div className="model-list">
        {AVAILABLE_MODELS.map(model => {
          const isSelected = selectedModelIds.includes(model.id);
          return (
            <div 
              key={model.id}
              className={`model-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleModelToggle(model.id)}
            >
              <div className="model-checkbox">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  readOnly 
                />
              </div>
              <div className="model-info">
                <div className="model-name">{model.name}</div>
                <div className="model-type">{model.type}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showUpgradePrompt && (
        <div className="upgrade-prompt">
          <div className="prompt-content">
            <h3>You've reached your Basic tier limit</h3>
            <p>
              Your current plan allows selection of up to 3 models. 
              Upgrade to the Complete tier to access all 10 models.
            </p>
            <div className="prompt-actions">
              <button 
                className="upgrade-now-button"
                onClick={handleUpgrade}
              >
                Upgrade Now
              </button>
              <button 
                className="later-button"
                onClick={() => setShowUpgradePrompt(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="coming-soon">
        <h4>✨ Coming Soon in Full Release ✨</h4>
        <ul className="coming-soon-features">
          <li>Unlimited Model Selection - Browse and search thousands of Hugging Face models</li>
          <li>Personalized Model Recommendations based on your usage patterns</li>
          <li>New Model Alerts - Get notified when models you use are updated</li>
          <li>Model Performance Analytics - See how your models are performing</li>
        </ul>
        <button className="updates-button">Sign Up for Updates</button>
      </div>
    </div>
  );
};

export default TieredModelSelector;