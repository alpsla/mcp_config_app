import React, { useState } from 'react';
import { HuggingFaceConfig as HuggingFaceConfigType, HuggingFaceModel, SubscriptionTier } from '../../../types';
import './ServerConfigs.css';

interface HuggingFaceConfigProps {
  config: HuggingFaceConfigType;
  onChange: (config: HuggingFaceConfigType) => void;
}

export const HuggingFaceConfig: React.FC<HuggingFaceConfigProps> = ({ 
  config, 
  onChange 
}) => {
  const [token, setToken] = useState(config.token || '');
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  
  const AVAILABLE_MODELS: HuggingFaceModel[] = [
    { id: 'flux-1-dev', name: 'Flux.1-dev-infer', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'whisper-v3', name: 'Whisper-large-v3-turbo', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'qwen2-72b', name: 'Qwen2-72B-Instruct', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'shuttle-3-1', name: 'Shuttle-3.1-aesthetic', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'llama3-70b', name: 'Llama3-70B-Instruct', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'musicgen', name: 'MusicGen-Large', enabled: false, tier: SubscriptionTier.COMPLETE },
    { id: 'deepseek-coder', name: 'DeepSeek-Coder-33B', enabled: false, tier: SubscriptionTier.COMPLETE },
    { id: 'sdxl-turbo', name: 'SDXL-Turbo', enabled: false, tier: SubscriptionTier.COMPLETE },
    { id: 'videocrafter', name: 'VideoCrafter-2', enabled: false, tier: SubscriptionTier.COMPLETE },
    { id: 'stable-cascade', name: 'Stable Cascade', enabled: false, tier: SubscriptionTier.COMPLETE },
  ];

  // Set initial models from config or use defaults
  const [models, setModels] = useState<HuggingFaceModel[]>(
    config.models && config.models.length > 0 
      ? config.models 
      : AVAILABLE_MODELS
  );

  const handleToggleEnabled = () => {
    onChange({
      ...config,
      enabled: !config.enabled
    });
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    onChange({
      ...config,
      token: newToken
    });
  };

  const toggleTokenVisibility = () => {
    setIsTokenVisible(!isTokenVisible);
  };

  const handleModelToggle = (modelId: string) => {
    const updatedModels = models.map(model => 
      model.id === modelId 
        ? { ...model, enabled: !model.enabled } 
        : model
    );
    
    setModels(updatedModels);
    onChange({
      ...config,
      models: updatedModels
    });
  };

  return (
    <div className="server-config-container">
      <div className="server-config-header">
        <h2 className="server-config-title">Hugging Face Integration</h2>
        <p className="server-config-description">
          Connect to Hugging Face models to extend Claude's capabilities with specialized AI models.
        </p>
      </div>

      <div className="form-checkbox">
        <input 
          type="checkbox"
          id="huggingface-enabled"
          checked={config.enabled}
          onChange={handleToggleEnabled}
        />
        <label htmlFor="huggingface-enabled">Enable Hugging Face Integration</label>
      </div>

      {config.enabled && (
        <>
          <div className="form-group">
            <label htmlFor="api-token">API Token</label>
            <div className="token-input-container">
              <input 
                type={isTokenVisible ? "text" : "password"}
                id="api-token"
                className="form-control"
                placeholder="Enter your Hugging Face API token"
                value={token}
                onChange={handleTokenChange}
              />
              <button 
                type="button"
                className="token-visibility-toggle"
                onClick={toggleTokenVisibility}
              >
                {isTokenVisible ? "Hide" : "Show"}
              </button>
            </div>
            <div className="help-text">
              An API token is required to access Hugging Face models. 
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">
                Get your token from Hugging Face
              </a>
            </div>
          </div>

          <div className="form-group">
            <label>Select Models</label>
            <div className="model-grid">
              {models.map(model => (
                <div 
                  key={model.id} 
                  className={`model-item ${model.enabled ? 'selected' : ''}`}
                  onClick={() => handleModelToggle(model.id)}
                >
                  <div className="model-header">
                    <input 
                      type="checkbox"
                      checked={model.enabled}
                      onChange={() => {}}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="model-name">{model.name}</span>
                    {model.tier === SubscriptionTier.COMPLETE && (
                      <div className="subscription-required">Subscription Required</div>
                    )}
                  </div>
                  <div className="model-id">{model.id}</div>
                </div>
              ))}
            </div>
            <div className="help-text">
              Select which models you want to use with Claude. Some models require a paid subscription.
            </div>
          </div>

          <div className="platform-compatibility">
            <span className="platform-compatibility-icon">ℹ️</span>
            <span>Hugging Face integration works on all desktop platforms.</span>
          </div>
        </>
      )}
    </div>
  );
};
