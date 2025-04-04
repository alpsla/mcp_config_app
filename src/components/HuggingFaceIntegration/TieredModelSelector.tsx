import React, { useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import './TieredModelSelector.css';
import UpgradePrompt from './UpgradePrompt';

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

// Define model categories for grouping
const MODEL_CATEGORIES = [
  'Image Generation',
  'Audio Transcription',
  'Language Model',
  'Code Generation',
  'Video Generation',
  'Audio Generation'
];

interface TieredModelSelectorProps {
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
}

const TieredModelSelector: React.FC<TieredModelSelectorProps> = ({
  selectedModels,
  onModelToggle
}) => {
  const { subscription } = useSubscription();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<boolean>(false);
  
  // Get the model limit based on subscription tier
  const getModelLimit = (): number => {
    switch (subscription) {
      case 'basic': return 3;
      case 'complete': return AVAILABLE_MODELS.length;
      default: return 0;
    }
  };
  
  // Calculate how many more models can be selected
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const remainingSelections = getModelLimit() - selectedModels.length;
  
  // Group models by category
  const getModelsByCategory = (): Record<string, typeof AVAILABLE_MODELS> => {
    return MODEL_CATEGORIES.reduce((acc, category) => {
      acc[category] = AVAILABLE_MODELS.filter(model => model.type === category);
      return acc;
    }, {} as Record<string, typeof AVAILABLE_MODELS>);
  };
  
  const modelsByCategory = getModelsByCategory();
  
  // Handle model selection
  const handleModelSelection = (modelId: string) => {
    // If the user is trying to select a model but has reached the limit
    if (
      !selectedModels.includes(modelId) && 
      selectedModels.length >= getModelLimit() &&
      subscription !== 'complete'
    ) {
      // Show upgrade prompt if on basic tier
      if (subscription === 'basic') {
        setShowUpgradePrompt(true);
      }
      return;
    }
    
    // Otherwise, toggle the model
    onModelToggle(modelId);
  };
  
  // Close the upgrade prompt
  const handleCloseUpgradePrompt = () => {
    setShowUpgradePrompt(false);
  };
  
  return (
    <div className="tiered-model-selector">
      {/* Display subscription status banner */}
      <div className={`subscription-banner ${subscription}`}>
        {subscription === 'none' ? (
          <div className="subscription-info">
            <h3>Subscribe to Enable Model Selection</h3>
            <p>Subscribe to our Basic plan to use up to 3 models or Complete plan for unlimited models.</p>
            <button className="subscribe-button">Subscribe Now</button>
          </div>
        ) : subscription === 'basic' ? (
          <div className="subscription-info">
            <h3>Basic Subscription</h3>
            <p>You can select up to 3 models with your current plan. Upgrade to Complete for unlimited models.</p>
            <div className="selection-counter">
              <span>{selectedModels.length} of 3 models selected</span>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${(selectedModels.length / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="subscription-info">
            <h3>Complete Subscription</h3>
            <p>You can select unlimited models with your current plan.</p>
            <div className="selection-counter">
              <span>{selectedModels.length} models selected</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Model selection grid, grouped by category */}
      <div className="model-categories">
        {MODEL_CATEGORIES.map(category => (
          <div key={category} className="model-category">
            <h3 className="category-title">{category}</h3>
            <div className="models-grid">
              {modelsByCategory[category].map(model => (
                <div 
                  key={model.id}
                  className={`model-card ${selectedModels.includes(model.id) ? 'selected' : ''} ${
                    subscription === 'none' ? 'disabled' : ''
                  }`}
                  onClick={() => subscription !== 'none' && handleModelSelection(model.id)}
                >
                  <div className="model-header">
                    <h4 className="model-name">{model.name}</h4>
                    <div className="model-toggle">
                      {subscription !== 'none' ? (
                        <div className={`toggle-switch ${selectedModels.includes(model.id) ? 'on' : 'off'}`}>
                          <div className="toggle-slider"></div>
                        </div>
                      ) : (
                        <div className="subscription-lock">🔒</div>
                      )}
                    </div>
                  </div>
                  <p className="model-description">{model.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Upgrade prompt modal */}
      {showUpgradePrompt && (
        <UpgradePrompt 
          currentTier="basic"
          targetTier="complete"
          benefit="unlimited models"
          onClose={handleCloseUpgradePrompt}
        />
      )}
      
      {/* Coming Soon section for Complete subscribers */}
      {subscription === 'complete' && (
        <div className="coming-soon-section">
          <h3>Coming Soon: Full Hugging Face Marketplace</h3>
          <p>
            As a Complete subscriber, you'll soon have access to thousands of models
            from the entire Hugging Face ecosystem, with advanced filtering, recommendations,
            and performance metrics!
          </p>
          <div className="feature-preview">
            <div className="preview-item">
              <span className="preview-icon">🔍</span>
              <span className="preview-text">Advanced Search & Filtering</span>
            </div>
            <div className="preview-item">
              <span className="preview-icon">📈</span>
              <span className="preview-text">Performance Analytics</span>
            </div>
            <div className="preview-item">
              <span className="preview-icon">🤝</span>
              <span className="preview-text">Community Ratings & Reviews</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TieredModelSelector;