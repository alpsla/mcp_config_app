import React, { useState, useEffect } from 'react';
import HuggingFaceConfig from './HuggingFaceConfig';
import SubscriptionFlow from '../subscription/SubscriptionFlow';
import { useAuth } from '../../auth/AuthContext';
import { enhancedConfigurationManager } from '../../services/EnhancedConfigurationManager';
import { mapTierToSimpleType, SubscriptionTierSimple } from '../../types/enhanced-types';
import './EnhancedHuggingFaceConfig.css';

interface EnhancedHuggingFaceConfigProps {
  onConfigurationUpdate: (config: { 
    enabled: boolean; 
    modelIds: string[];
    parameters: Record<string, any>;
  }) => void;
  initialConfig?: { 
    enabled: boolean; 
    modelIds: string[];
    parameters: Record<string, any>;
  };
}

/**
 * Enhanced wrapper for HuggingFaceConfig that handles subscription flow
 * and global parameters integration
 */
const EnhancedHuggingFaceConfig: React.FC<EnhancedHuggingFaceConfigProps> = ({
  onConfigurationUpdate,
  initialConfig
}) => {
  const { authState, getUserSubscriptionTier } = useAuth();
  const [showSubscriptionFlow, setShowSubscriptionFlow] = useState<boolean>(false);
  const [currentTier, setCurrentTier] = useState<SubscriptionTierSimple>('none');
  const [globalParams, setGlobalParams] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user subscription info and global parameters
  useEffect(() => {
    const loadUserInfo = async () => {
      if (authState?.user?.id) {
        try {
          // Get subscription tier
          const tier = getUserSubscriptionTier?.();
          setCurrentTier(mapTierToSimpleType(tier));
          
          // Get global parameters
          const params = await enhancedConfigurationManager.getGlobalParamsFromUserPreferences(
            authState.user.id
          );
          setGlobalParams(params);
        } catch (error) {
          console.error('Error loading user info:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadUserInfo();
  }, [authState?.user?.id, getUserSubscriptionTier]);

  // Handle subscription flow completion
  const handleSubscriptionComplete = () => {
    setShowSubscriptionFlow(false);
    
    // Reload the current tier
    if (getUserSubscriptionTier) {
      const newTier = getUserSubscriptionTier();
      setCurrentTier(mapTierToSimpleType(newTier));
    }
    
    // Reload global parameters
    if (authState?.user?.id) {
      enhancedConfigurationManager.getGlobalParamsFromUserPreferences(authState.user.id)
        .then(params => setGlobalParams(params))
        .catch(error => console.error('Error loading global parameters:', error));
    }
  };

  // Handle configuration updates from the HuggingFaceConfig component
  const handleConfigUpdate = (config: { 
    enabled: boolean; 
    modelIds: string[];
    parameters: Record<string, any>;
  }) => {
    // Apply global parameters to any model without specific overrides
    const enhancedParameters = { ...config.parameters };
    
    // For global parameters, ensure they're applied as defaults
    if (globalParams) {
      Object.entries(globalParams).forEach(([key, value]) => {
        // Only set if not already defined
        if (enhancedParameters[key] === undefined) {
          enhancedParameters[key] = value;
        }
      });
    }
    
    // Pass the enhanced config to the parent component
    onConfigurationUpdate({
      ...config,
      parameters: enhancedParameters
    });
  };

  // Handle subscription prompt with specific tier
  const handleSubscribe = (tier?: SubscriptionTierSimple) => {
    if (tier) {
      setCurrentTier(tier);
    }
    setShowSubscriptionFlow(true);
  };

  // Map subscription tiers to component props
  const mapTierToProps = (tier: SubscriptionTierSimple): any => {
    switch (tier) {
      case 'basic':
        return { userTier: 'basic' };
      case 'complete':
        return { userTier: 'complete' };
      default:
        return { userTier: 'none' };
    }
  };

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="enhanced-huggingface-config">
      {showSubscriptionFlow ? (
        <SubscriptionFlow
          onComplete={handleSubscriptionComplete}
          onCancel={() => setShowSubscriptionFlow(false)}
          initialTier={currentTier !== 'none' ? currentTier : undefined}
        />
      ) : (
        <>
          {/* Subscription Banner (for non-subscribers) */}
          {currentTier === 'none' && (
            <div className="subscription-banner">
              <div className="banner-content">
                <h3>Unlock Hugging Face Integration</h3>
                <p>
                  Hugging Face integration is only available on paid plans. Subscribe to
                  access powerful AI models that enhance Claude with specialized capabilities
                  for image generation, code assistance, and more.
                </p>
                <div className="premium-benefits">
                  <div className="benefit-item">
                    <span className="benefit-icon">🎨</span>
                    <span className="benefit-text">Image Generation</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">💻</span>
                    <span className="benefit-text">Code Assistance</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🔍</span>
                    <span className="benefit-text">Data Analysis</span>
                  </div>
                </div>
                <div className="subscription-options">
                  <button 
                    className="subscribe-button basic-tier"
                    onClick={() => handleSubscribe('basic')}
                  >
                    Basic Plan - $9.99/month
                  </button>
                  <button 
                    className="subscribe-button complete-tier"
                    onClick={() => handleSubscribe('complete')}
                  >
                    Complete Plan - $19.99/month
                  </button>
                </div>
              </div>
              <div className="banner-feature">
                <div className="feature-icons">
                  <div className="feature-icon">🖼️</div>
                  <div className="feature-icon">🎵</div>
                  <div className="feature-icon">💻</div>
                </div>
                <p>Image, Audio, and Code AI Models</p>
              </div>
            </div>
          )}

          {/* Upgrade Banner (for basic subscribers) */}
          {currentTier === 'basic' && (
            <div className="upgrade-banner">
              <div className="banner-content">
                <div className="tier-badge">Basic Plan</div>
                <h3>Ready to Upgrade?</h3>
                <p>
                  You're on the Basic plan with access to 3 models.
                  Upgrade to Complete for unlimited models and advanced parameters.
                </p>
                <button 
                  className="upgrade-button"
                  onClick={() => handleSubscribe('complete')}
                >
                  Upgrade to Complete
                </button>
              </div>
              <div className="global-params-preview">
                <h4>Your Global Parameters</h4>
                <div className="param-preview-items">
                  {Object.entries(globalParams).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="param-preview-item">
                      <span className="param-name">
                        {key === 'temperature' ? 'Temperature' : 
                         key === 'max_tokens' ? 'Max Length' :
                         key === 'top_p' ? 'Top P' :
                         key}
                      </span>
                      <span className="param-value">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="edit-params-button"
                  onClick={() => handleSubscribe()}
                >
                  Edit Parameters
                </button>
              </div>
            </div>
          )}

          {/* Parameter View (for complete subscribers) */}
          {currentTier === 'complete' && (
            <div className="complete-subscriber-header">
              <div className="subscriber-info">
                <div className="tier-badge premium">Complete Plan</div>
                <h3>Advanced Configuration</h3>
                <p>
                  You have access to all models and advanced parameters.
                  Your global parameters are applied to all models by default.
                </p>
              </div>
              <div className="global-params-preview">
                <h4>Your Global Parameters</h4>
                <div className="param-preview-items">
                  {Object.entries(globalParams).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="param-preview-item">
                      <span className="param-name">
                        {key === 'temperature' ? 'Temperature' : 
                         key === 'max_tokens' ? 'Max Length' :
                         key === 'top_p' ? 'Top P' :
                         key === 'top_k' ? 'Top K' :
                         key}
                      </span>
                      <span className="param-value">{value}</span>
                    </div>
                  ))}
                  {Object.keys(globalParams).length > 4 && (
                    <div className="param-preview-more">+{Object.keys(globalParams).length - 4} more</div>
                  )}
                </div>
                <button 
                  className="edit-params-button"
                  onClick={() => handleSubscribe()}
                >
                  Edit Parameters
                </button>
              </div>
            </div>
          )}

          {/* The actual HuggingFaceConfig component */}
          <HuggingFaceConfig
            onConfigurationUpdate={handleConfigUpdate}
            initialConfig={initialConfig}
            {...mapTierToProps(currentTier)}
          />
          
          {/* Parameter Info Section - show for subscribers */}
          {currentTier !== 'none' && (
            <div className="parameter-info-section">
              <h3>About Global Parameters</h3>
              <p>
                Global parameters are applied to all models by default, but you can
                override them for specific models if needed. This saves time when
                configuring multiple models with similar settings.
              </p>
              <div className="parameter-info-grid">
                <div className="parameter-info-item">
                  <h4>Temperature</h4>
                  <p>Controls randomness. Lower values are more predictable, higher values more creative.</p>
                </div>
                <div className="parameter-info-item">
                  <h4>Max Length</h4>
                  <p>Maximum length of text to generate (in tokens).</p>
                </div>
                <div className="parameter-info-item">
                  <h4>Top P</h4>
                  <p>Controls diversity by only considering tokens with top probability mass.</p>
                </div>
                {currentTier === 'complete' && (
                  <>
                    <div className="parameter-info-item">
                      <h4>Top K</h4>
                      <p>Limits token selection to the top K most likely tokens.</p>
                    </div>
                    <div className="parameter-info-item">
                      <h4>Presence Penalty</h4>
                      <p>Penalizes tokens that appear in the text so far, encouraging more topic diversity.</p>
                    </div>
                    <div className="parameter-info-item">
                      <h4>Frequency Penalty</h4>
                      <p>Penalizes tokens based on their frequency, reducing word repetition.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EnhancedHuggingFaceConfig;
