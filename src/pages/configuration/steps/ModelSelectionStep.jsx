import React from 'react';

const ModelSelectionStep = ({
  selectedModels,
  handleModelSelect,
  subscriptionTier,
  onBack,
  onContinue
}) => {
  // All available models with tier limitations
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
  
  // Get max models based on tier
  const getMaxModels = () => {
    switch (subscriptionTier) {
      case 'basic': return 3;
      case 'complete': return 10;
      default: return 0;
    }
  };
  
  // Check if model can be selected
  const canSelectModel = (modelId) => {
    if (selectedModels.includes(modelId)) return true;
    return selectedModels.length < getMaxModels();
  };
  
  // Group models by type for horizontal display
  const modelTypes = {};
  availableModels.forEach(model => {
    if (!modelTypes[model.type]) {
      modelTypes[model.type] = [];
    }
    modelTypes[model.type].push(model);
  });

  return (
    <div className="step-content model-selection-step">
      <h2>Select Models</h2>
      <p className="step-description">
        Choose which Hugging Face models you want to use with Claude.
        {subscriptionTier === 'basic' && (
          <span className="tier-note"> Your Basic plan allows selecting up to 3 models.</span>
        )}
        {subscriptionTier === 'complete' && (
          <span className="tier-note"> Your Complete plan allows selecting all available models.</span>
        )}
      </p>
      
      <div className="model-categories">
        {Object.entries(modelTypes).map(([type, models]) => (
          <div key={type} className="model-category">
            <h3 className="category-title">{type}</h3>
            <div className="horizontal-models-list">
              {models.map(model => (
                <div 
                  key={model.id}
                  className={`horizontal-model-card ${selectedModels.includes(model.id) ? 'selected' : ''} ${!canSelectModel(model.id) && !selectedModels.includes(model.id) ? 'disabled' : ''}`}
                >
                  <div className="model-header">
                    <h4>{model.name}</h4>
                  </div>
                  
                  <p className="model-description">{model.description}</p>
                  
                  <div className="model-footer">
                    <span className={`popularity ${model.popularity.toLowerCase()}`}>
                      {model.popularity} Usage
                    </span>
                    
                    <label className="model-toggle">
                      <input
                        type="checkbox"
                        checked={selectedModels.includes(model.id)}
                        onChange={(e) => handleModelSelect(model.id, e.target.checked)}
                        disabled={!canSelectModel(model.id) && !selectedModels.includes(model.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="step-actions">
        <button 
          className="btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
        
        <button 
          className="btn-primary"
          onClick={onContinue}
          disabled={selectedModels.length === 0}
        >
          Continue to Configuration
        </button>
      </div>
    </div>
  );
};

export default ModelSelectionStep;