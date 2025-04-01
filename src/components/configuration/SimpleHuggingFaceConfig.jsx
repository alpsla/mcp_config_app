import React, { useState, useEffect } from 'react';
import './ConfigComponents.css';

const SimpleHuggingFaceConfig = ({ config = {}, updateConfig }) => {
  const [apiToken, setApiToken] = useState(config.apiToken || '');
  const [showToken, setShowToken] = useState(false);
  const [selectedModels, setSelectedModels] = useState(config.selectedModels || []);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  // Available models data
  const availableModels = [
    { id: 'flux-1-dev', name: 'Flux.1-dev-infer', type: 'Image Generation' },
    { id: 'whisper-v3', name: 'Whisper-large-v3-turbo', type: 'Audio Transcription' },
    { id: 'qwen2-72b', name: 'Qwen2-72B-Instruct', type: 'Language Model' },
    { id: 'shuttle-3-1', name: 'Shuttle-3.1-aesthetic', type: 'Image Generation' },
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
    console.log(`Toggling model: ${modelId}`);
    if (selectedModels.includes(modelId)) {
      // Remove from selection
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else {
      // Add to selection
      setSelectedModels([...selectedModels, modelId]);
    }
  };

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
        
        <div className="config-model-selection">
          <label className="config-form-label">
            Available Models
          </label>
          
          <div className="config-models-grid">
            {availableModels.map(model => (
              <div 
                key={model.id} 
                className={`config-model-card ${selectedModels.includes(model.id) ? 'selected' : ''}`}
                onClick={() => handleModelToggle(model.id)}
              >
                <div className="config-model-header">
                  <h4 className="config-model-name">{model.name}</h4>
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
              Selected Models ({selectedModels.length}/{availableModels.length})
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
      </div>
      
      <div className="config-additional-info">
        <h4>Additional Information</h4>
        <p>Select individual models to enhance Claude's capabilities.</p>
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

export default SimpleHuggingFaceConfig;