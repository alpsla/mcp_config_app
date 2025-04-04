import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import './ModelSelector.css';

// Define the model interface
export interface Model {
  id: string;
  name: string;
  category: string;
  description: string;
  usage: 'high' | 'medium' | 'low';
}

interface ModelSelectorProps {
  models: Model[];
  selectedModelId: string | null;
  configuredModels: string[];
  subscriptionTier: SubscriptionTier;
  onModelSelect: (modelId: string) => void;
  onUpgradeSubscription?: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  configuredModels,
  subscriptionTier,
  onModelSelect,
  onUpgradeSubscription
}) => {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  // Helper to check if subscription is Basic tier (STARTER or STANDARD/BASIC)
  const isBasicTier = (): boolean => {
    return subscriptionTier === SubscriptionTier.STARTER || 
           String(subscriptionTier) === "BASIC";
  };
  
  // Helper to check if subscription is Complete tier
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isCompleteTier = (): boolean => {
    return subscriptionTier === SubscriptionTier.COMPLETE;
  };
  
  // Get allowed model count based on tier
  const getModelLimit = (): number => {
    switch (subscriptionTier) {
      case SubscriptionTier.STARTER:
      case SubscriptionTier.STANDARD: return 3;
      case SubscriptionTier.COMPLETE: return 10;
      default: return 0;
    }
  };

  // Check if user has reached their model limit
  const modelLimit = getModelLimit();
  const hasReachedLimit = configuredModels.length >= modelLimit && modelLimit > 0;
  
  // Group models by category
  const getModelsByCategory = () => {
    const categorized: Record<string, Model[]> = {};
    
    models.forEach(model => {
      if (!categorized[model.category]) {
        categorized[model.category] = [];
      }
      categorized[model.category].push(model);
    });
    
    return categorized;
  };
  
  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    // If already selected, do nothing (we don't deselect from here)
    if (selectedModelId === modelId) return;
    
    // Check if model is already configured
    const alreadyConfigured = configuredModels.includes(modelId);
    if (alreadyConfigured) {
      // If already configured, just select it
      onModelSelect(modelId);
      return;
    }
    
    // Check if user has reached their tier limit
    if (hasReachedLimit) {
      // Show upgrade prompt for basic tier
      if (isBasicTier()) {
        setShowUpgradePrompt(true);
      }
      return;
    }
    
    // Select the model
    onModelSelect(modelId);
  };
  
  // Handle upgrade subscription
  const handleUpgrade = () => {
    if (onUpgradeSubscription) {
      onUpgradeSubscription();
    }
    setShowUpgradePrompt(false);
  };
  
  // Cancel upgrade
  const handleCancelUpgrade = () => {
    setShowUpgradePrompt(false);
  };
  
  // If no subscription, show subscription required message
  if (subscriptionTier === SubscriptionTier.FREE) {
    return (
      <div className="model-selector subscription-required-container">
        <div className="subscription-message">
          <h3>Subscription Required</h3>
          <p>A subscription is required to use Hugging Face models with Claude.</p>
          <button 
            className="subscribe-button"
            onClick={onUpgradeSubscription}
          >
            Subscribe Now
          </button>
          
          <div className="subscription-tiers">
            <div className="tier-info">
              <h4>Basic Tier ($2/month)</h4>
              <ul>
                <li>Access to all 10 models</li>
                <li>Select up to 3 models</li>
              </ul>
            </div>
            
            <div className="tier-info">
              <h4>Complete Tier ($5/month)</h4>
              <ul>
                <li>Access to all 10 models</li>
                <li>Select up to 10 models</li>
                <li>Priority access to new models</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Group models by category
  const modelsByCategory = getModelsByCategory();
  
  return (
    <div className="model-selector">
      <div className="model-selector-header">
        <h2>Select Hugging Face Models</h2>
        <p className="tier-info">
          Your {isBasicTier() ? 'Basic' : 'Complete'} tier allows {modelLimit} models.
          <span className="model-count">({configuredModels.length}/{modelLimit} used)</span>
        </p>
      </div>
      
      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className="upgrade-prompt">
          <div className="upgrade-prompt-content">
            <h3>Upgrade Your Subscription</h3>
            <p>You've reached your limit of {modelLimit} models with the Basic tier.</p>
            <p>Upgrade to the Complete tier to configure up to 10 models.</p>
            
            <div className="upgrade-actions">
              <button 
                className="upgrade-button"
                onClick={handleUpgrade}
              >
                Upgrade to Complete
              </button>
              
              <button 
                className="cancel-button"
                onClick={handleCancelUpgrade}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Models by Category */}
      {Object.entries(modelsByCategory).map(([category, categoryModels]) => (
        <div key={category} className="model-category">
          <h3 className="category-title">{category}</h3>
          
          <div className="model-grid">
            {categoryModels.map(model => {
              const isSelected = model.id === selectedModelId;
              const isConfigured = configuredModels.includes(model.id);
              const isDisabled = !isSelected && !isConfigured && hasReachedLimit;
              
              return (
                <div 
                  key={model.id}
                  className={`model-card ${isSelected ? 'selected' : ''} ${isConfigured ? 'configured' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => !isDisabled && handleModelSelect(model.id)}
                >
                  <div className="model-header">
                    <h4 className="model-name">{model.name}</h4>
                    <span className={`usage-badge ${model.usage}`}>
                      {model.usage.charAt(0).toUpperCase() + model.usage.slice(1)} Usage
                    </span>
                  </div>
                  
                  <p className="model-description">{model.description}</p>
                  
                  <div className="model-status">
                    {isConfigured ? (
                      <span className="configured-badge">Configured</span>
                    ) : isSelected ? (
                      <span className="selected-badge">Selected</span>
                    ) : (
                      <span className="select-prompt">Click to Configure</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="coming-soon-section">
        <h3>✨ Coming Soon in Full Release ✨</h3>
        <ul className="coming-soon-features">
          <li><strong>Unlimited Model Selection</strong> - Browse and search thousands of Hugging Face models</li>
          <li><strong>Personalized Recommendations</strong> - Get model suggestions based on your usage patterns</li>
          <li><strong>New Model Alerts</strong> - Be notified when your favorite models are updated</li>
          <li><strong>Performance Analytics</strong> - Track model performance and optimize your setup</li>
        </ul>
      </div>
    </div>
  );
};

// Define the models that match the recommended 10 from dashboard
export const AVAILABLE_MODELS: Model[] = [
  { 
    id: 'gpt-neo-2-7b', 
    name: 'EleutherAI/gpt-neo-2.7B', 
    category: 'Text Generation',
    description: 'Versatile text generation for creative writing, document drafting',
    usage: 'medium'
  },
  { 
    id: 'whisper-v3', 
    name: 'Whisper-large-v3-turbo', 
    category: 'Audio Processing',
    description: 'Superior transcription accuracy',
    usage: 'high'
  },
  { 
    id: 'stable-diffusion-2', 
    name: 'stabilityai/stable-diffusion-2', 
    category: 'Image Generation',
    description: 'Higher quality outputs and broader recognition',
    usage: 'high'
  },
  { 
    id: 'qwen2-72b', 
    name: 'Qwen2-72B-Instruct', 
    category: 'Language Model',
    description: 'Strong complementary LLM to Claude',
    usage: 'high'
  },
  { 
    id: 'all-minilm-l6-v2', 
    name: 'sentence-transformers/all-MiniLM-L6-v2', 
    category: 'Semantic Search',
    description: 'Enables vector search capabilities',
    usage: 'medium'
  },
  { 
    id: 'bart-large-cnn', 
    name: 'facebook/bart-large-cnn', 
    category: 'Content Summarization',
    description: 'Specialized for document summarization',
    usage: 'medium'
  },
  { 
    id: 'instruct-pix2pix', 
    name: 'CompVis/instruct-pix2pix', 
    category: 'Image Editing',
    description: 'Text-guided image editing capabilities',
    usage: 'medium'
  },
  { 
    id: 'layoutlmv3-base', 
    name: 'microsoft/layoutlmv3-base', 
    category: 'Document Understanding',
    description: 'Document processing for forms and structured documents',
    usage: 'medium'
  },
  { 
    id: 'roberta-squad2', 
    name: 'deepset/roberta-base-squad2', 
    category: 'Question Answering',
    description: 'Precise answers from documents',
    usage: 'medium'
  },
  { 
    id: 'text-to-video-ms', 
    name: 'ali-vilab/text-to-video-ms-1.7b', 
    category: 'Video Generation',
    description: 'Efficient video generation (up to 25 seconds)',
    usage: 'high'
  }
];

export default ModelSelector;
