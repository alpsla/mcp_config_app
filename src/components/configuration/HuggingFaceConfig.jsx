import React, { useState, useEffect } from 'react';
import './ConfigComponents.css';
import { Platform } from '../../utils/platform';

const HuggingFaceConfig = ({ config = {}, updateConfig }) => {
  // Initialize state with values from props or defaults
  const [token, setToken] = useState(config.token || '');
  const [selectedModel, setSelectedModel] = useState(config.selectedModel || '');
  const [showToken, setShowToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userTier, setUserTier] = useState('starter'); // starter, standard, or complete
  
  // Mock models for each tier (in a real implementation, these would be fetched from API)
  const models = {
    starter: [
      { id: 'bert-base-uncased', name: 'BERT Base Uncased', description: 'BERT model with 12 layers, uncased' },
      { id: 'distilbert-base-uncased', name: 'DistilBERT Base Uncased', description: 'Distilled version of BERT Base' },
      { id: 'gpt2', name: 'GPT-2', description: 'Base GPT-2 model with 117M parameters' }
    ],
    standard: [
      { id: 'roberta-base', name: 'RoBERTa Base', description: 'RoBERTa model with 12 layers' },
      { id: 'xlm-roberta-base', name: 'XLM-RoBERTa Base', description: 'Multilingual RoBERTa model' },
      { id: 't5-base', name: 'T5 Base', description: 'Text-to-Text Transfer Transformer' }
    ],
    complete: [
      { id: 'gpt2-large', name: 'GPT-2 Large', description: 'Large GPT-2 model with 774M parameters' },
      { id: 'llama-7b', name: 'Llama 7B', description: 'Open source equivalent of Large Language Models' },
      { id: 'falcon-7b', name: 'Falcon 7B', description: 'High-performance large language model' },
      { id: 'gemma-7b', name: 'Gemma 7B', description: 'Lightweight LLM from Google' }
    ]
  };
  
  // Get all available models based on user's tier
  const getAvailableModels = () => {
    switch (userTier) {
      case 'complete':
        return [...models.starter, ...models.standard, ...models.complete];
      case 'standard':
        return [...models.starter, ...models.standard];
      case 'starter':
      default:
        return models.starter;
    }
  };
  
  // Update parent component when values change
  useEffect(() => {
    updateConfig({
      token,
      selectedModel
    });
  }, [token, selectedModel, updateConfig]);
  
  // Simulate token validation (in a real implementation, this would make an API call)
  useEffect(() => {
    const validateToken = () => {
      // Simple mock validation - just check if token is at least 8 chars and starts with 'hf_'
      const isValid = token.length >= 8 && token.startsWith('hf_');
      setIsTokenValid(isValid);
      
      // Mock tier detection based on token length
      if (isValid) {
        if (token.length > 20) {
          setUserTier('complete');
        } else if (token.length > 12) {
          setUserTier('standard');
        } else {
          setUserTier('starter');
        }
      } else {
        setUserTier('starter');
      }
    };
    
    // Add delay to simulate API call
    const timerId = setTimeout(validateToken, 500);
    return () => clearTimeout(timerId);
  }, [token]);
  
  // Handle model selection
  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
  };
  
  // Get tier name for display
  const getTierName = (tier) => {
    switch(tier) {
      case 'starter': return 'Starter Tier (3 Models)';
      case 'standard': return 'Standard Tier (6 Models)';
      case 'complete': return 'Complete Tier (10 Models)';
      default: return 'Starter Tier';
    }
  };
  
  // Get tier badge class
  const getTierBadgeClass = (modelTier) => {
    switch(modelTier) {
      case 'starter': return 'config-model-tier-starter';
      case 'standard': return 'config-model-tier-standard';
      case 'complete': return 'config-model-tier-complete';
      default: return 'config-model-tier-starter';
    }
  };
  
  // Determine which tier a model belongs to
  const getModelTier = (modelId) => {
    if (models.starter.some(model => model.id === modelId)) return 'starter';
    if (models.standard.some(model => model.id === modelId)) return 'standard';
    if (models.complete.some(model => model.id === modelId)) return 'complete';
    return 'starter';
  };

  return (
    <div className="config-component">
      <h2 className="config-component-title">Hugging Face Models Configuration</h2>
      <p className="config-component-description">
        Connect Claude to specialized AI models from Hugging Face to extend its capabilities.
      </p>
      
      <div className="config-form">
        <div className="config-form-group">
          <label className="config-form-label" htmlFor="hfToken">
            Hugging Face API Token
          </label>
          <div className="config-token-input-container">
            <input 
              type={showToken ? "text" : "password"} 
              id="hfToken" 
              className="config-form-input config-token-input" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Hugging Face API token (e.g., hf_...)"
            />
            <button 
              type="button" 
              className="config-token-visibility-toggle" 
              onClick={() => setShowToken(!showToken)}
              aria-label={showToken ? "Hide token" : "Show token"}
            >
              {showToken ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              }
            </button>
          </div>
          <p className="config-form-helper">
            Your API token allows Claude to connect to your Hugging Face account and access the models you have permission to use.
          </p>
          
          <div className="config-token-security-note">
            <strong>Security Note:</strong> Your token is stored securely on your device and is never sent to our servers. It will be used only at runtime to authenticate with Hugging Face API.
          </div>
        </div>
        
        {token && (
          <div className="config-form-group">
            <div className="config-token-status">
              {isTokenValid ? (
                <div className="config-token-valid">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Valid API Token - {getTierName(userTier)}</span>
                </div>
              ) : (
                <div className="config-token-invalid">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  <span>Invalid API Token Format</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {isTokenValid && (
          <div className="config-form-group">
            <label className="config-form-label">
              Select Model ({getAvailableModels().length} Available)
            </label>
            
            <div className="config-model-grid">
              {getAvailableModels().map((model) => {
                const modelTier = getModelTier(model.id);
                return (
                  <div 
                    key={model.id} 
                    className={`config-model-card ${selectedModel === model.id ? 'selected' : ''}`}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <div className="config-model-card-header">
                      <div className="config-model-card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 22 12 16 6"></polyline>
                          <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                      </div>
                      <div className="config-model-name" title={model.name}>
                        {model.name}
                      </div>
                    </div>
                    <div className="config-model-description">
                      {model.description}
                    </div>
                    <div className="config-model-meta">
                      <span className="config-model-id">{model.id}</span>
                    </div>
                    <span className={`config-model-tier-badge ${getTierBadgeClass(modelTier)}`}>
                      {modelTier.charAt(0).toUpperCase() + modelTier.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {selectedModel && (
              <div className="config-selected-model-display">
                <p className="config-form-helper">
                  Selected Model: <strong>{selectedModel}</strong>
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="config-platform-compatibility">
          <h4>Platform Compatibility</h4>
          <div className="config-platform-icons">
            <div className={`config-platform-icon ${Platform.isWindows() ? 'compatible' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>Windows</span>
            </div>
            <div className={`config-platform-icon ${Platform.isMacOS() ? 'compatible' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>macOS</span>
            </div>
            <div className={`config-platform-icon ${Platform.isLinux() ? 'compatible' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="9" x2="20" y2="9"></line>
                <line x1="4" y1="15" x2="20" y2="15"></line>
                <line x1="10" y1="3" x2="8" y2="21"></line>
                <line x1="16" y1="3" x2="14" y2="21"></line>
              </svg>
              <span>Linux</span>
            </div>
          </div>
          <p className="config-platform-note">All desktop platforms supported</p>
        </div>
      </div>
      
      <div className="config-component-footer">
        <div className="config-status">
          {isTokenValid && selectedModel ? (
            <>
              <div className="config-status-icon config-status-success"></div>
              <span>Hugging Face integration is properly configured</span>
            </>
          ) : (
            <>
              <div className="config-status-icon config-status-warning"></div>
              <span>
                {!isTokenValid ? 'Valid API token required' : 'Please select a model'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HuggingFaceConfig;