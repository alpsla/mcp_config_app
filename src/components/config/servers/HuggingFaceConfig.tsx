import React from 'react';
import { HuggingFaceConfig as HuggingFaceConfigType, SubscriptionTier } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import './ServerConfigs.css';

interface HuggingFaceConfigProps {
  config: HuggingFaceConfigType;
  onChange: (config: HuggingFaceConfigType) => void;
}

export const HuggingFaceConfig: React.FC<HuggingFaceConfigProps> = ({ 
  config, 
  onChange 
}) => {
  const { authState } = useAuth();
  const userTier = authState.user?.subscriptionTier || SubscriptionTier.FREE;

  const handleToggleEnabled = () => {
    onChange({
      ...config,
      enabled: !config.enabled
    });
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...config,
      token: e.target.value
    });
  };

  const handleToggleModel = (modelId: string) => {
    const updatedModels = config.models.map(model => {
      if (model.id === modelId) {
        return { ...model, enabled: !model.enabled };
      }
      return model;
    });

    onChange({
      ...config,
      models: updatedModels
    });
  };

  const isModelAvailable = (modelTier: SubscriptionTier) => {
    // Check if the model is available based on user's subscription tier
    switch (userTier) {
      case SubscriptionTier.COMPLETE:
        return true;
      case SubscriptionTier.STANDARD:
        return modelTier !== SubscriptionTier.COMPLETE;
      case SubscriptionTier.STARTER:
        return modelTier === SubscriptionTier.STARTER;
      default:
        return false;
    }
  };

  const getAvailableModelCount = () => {
    switch (userTier) {
      case SubscriptionTier.COMPLETE:
        return config.models.length;
      case SubscriptionTier.STANDARD:
        return 6;
      case SubscriptionTier.STARTER:
        return 3;
      default:
        return 0;
    }
  };

  const getTierLabel = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.STARTER:
        return 'Starter';
      case SubscriptionTier.STANDARD:
        return 'Standard';
      case SubscriptionTier.COMPLETE:
        return 'Complete';
      default:
        return '';
    }
  };

  return (
    <div className="server-config-container">
      <div className="server-config-header">
        <h2 className="server-config-title">Hugging Face Models Configuration</h2>
        <p className="server-config-description">
          Configure Hugging Face models to enhance Claude's capabilities.
        </p>
      </div>

      {userTier === SubscriptionTier.FREE ? (
        <div className="disabled-message">
          <p>Hugging Face model integration requires a paid subscription.</p>
          <button className="btn btn-primary">Upgrade Now</button>
        </div>
      ) : (
        <>
          <div className="form-checkbox">
            <input 
              type="checkbox"
              id="huggingface-enabled"
              checked={config.enabled}
              onChange={handleToggleEnabled}
            />
            <label htmlFor="huggingface-enabled">Enable Hugging Face Models</label>
          </div>

          {config.enabled && (
            <>
              <div className="form-group">
                <label htmlFor="huggingface-token">Hugging Face API Token</label>
                <input 
                  type="password"
                  id="huggingface-token"
                  className="form-control"
                  value={config.token}
                  onChange={handleTokenChange}
                  placeholder="Enter your Hugging Face API token"
                />
                <div className="help-text">
                  Your API token is encrypted and securely stored. <a href="#" className="help-link">Need help?</a>
                </div>
              </div>

              <div className="form-group">
                <label>Available Models</label>
                <div className="help-text">
                  Your {userTier} plan includes {getAvailableModelCount()} models.
                </div>

                <div className="model-list">
                  {config.models.map((model) => {
                    const isAvailable = isModelAvailable(model.tier);
                    
                    return (
                      <div 
                        key={model.id}
                        className={`model-item ${model.enabled && isAvailable ? 'model-item-enabled' : ''} ${!isAvailable ? 'model-item-unavailable' : ''}`}
                      >
                        <div className="model-item-info">
                          <div className="model-item-name">{model.name}</div>
                          <div className={`tier-indicator tier-${model.tier.toLowerCase()}`}>
                            {getTierLabel(model.tier)}
                          </div>
                        </div>
                        
                        {isAvailable ? (
                          <div className="model-item-actions">
                            <input 
                              type="checkbox"
                              id={`model-${model.id}`}
                              checked={model.enabled}
                              onChange={() => handleToggleModel(model.id)}
                            />
                            <label htmlFor={`model-${model.id}`}>Enable</label>
                          </div>
                        ) : (
                          <div className="model-item-upgrade">
                            Upgrade to {getTierLabel(model.tier)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="platform-compatibility">
                <span className="platform-compatibility-icon">ℹ️</span>
                <span>Hugging Face integration is compatible with both desktop and web environments.</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
