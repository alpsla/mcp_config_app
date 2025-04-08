import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { enhancedConfigurationManager, GLOBAL_PARAMETER_DEFINITIONS } from '../../services/EnhancedConfigurationManager';
import { SubscriptionTierSimple } from '../../types/enhanced-types';
import './GlobalParameterConfig.css';
import './steps/buttons.css';

interface GlobalParameterConfigProps {
  onComplete?: (params: Record<string, any>) => void;
  onCancel?: () => void;
  initialParams?: Record<string, any>;
  tier: SubscriptionTierSimple;
}

/**
 * Component for configuring global parameters during subscription
 * This is presented to users when they subscribe or change subscription tier
 */
const GlobalParameterConfig: React.FC<GlobalParameterConfigProps> = ({
  onComplete,
  onCancel,
  initialParams = {},
  tier
}) => {
  const { authState } = useAuth();
  const [params, setParams] = useState<Record<string, any>>(initialParams);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useDefaults, setUseDefaults] = useState<boolean>(
    Object.keys(initialParams).length === 0
  );

  // Load existing global parameters if available
  useEffect(() => {
    const loadGlobalParams = async () => {
      if (authState?.user?.id) {
        try {
          setIsLoading(true);
          const userParams = await enhancedConfigurationManager.getGlobalParamsFromUserPreferences(
            authState.user.id
          );
          
          if (Object.keys(userParams).length > 0) {
            setParams(userParams);
            setUseDefaults(false);
          }
        } catch (error) {
          console.error('Error loading global parameters:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadGlobalParams();
  }, [authState?.user?.id]);

  // Handle parameter change
  const handleParamChange = (paramId: string, value: any) => {
    // Convert to appropriate type
    const param = GLOBAL_PARAMETER_DEFINITIONS.find(p => p.id === paramId);
    let typedValue = value;
    
    if (param && param.type === 'number') {
      typedValue = parseFloat(value);
      // Ensure value is within bounds
      if (param.min !== undefined && typedValue < param.min) {
        typedValue = param.min;
      }
      if (param.max !== undefined && typedValue > param.max) {
        typedValue = param.max;
      }
    }
    
    setParams(prev => ({
      ...prev,
      [paramId]: typedValue
    }));
  };

  // Handle toggle for using defaults
  const handleUseDefaultsToggle = () => {
    const newUseDefaults = !useDefaults;
    setUseDefaults(newUseDefaults);
    
    // Reset to default values if using defaults
    if (newUseDefaults) {
      const defaultParams = GLOBAL_PARAMETER_DEFINITIONS.reduce(
        (acc, param) => ({
          ...acc,
          [param.id]: param.defaultValue
        }),
        {}
      );
      
      setParams(defaultParams);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (authState?.user?.id) {
      try {
        setIsLoading(true);
        
        // Save to user preferences
        await enhancedConfigurationManager.createOrUpdateSubscriptionProfile(
          authState.user.id,
          tier,
          params
        );
        
        if (onComplete) {
          onComplete(params);
        }
      } catch (error) {
        console.error('Error saving global parameters:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get parameter display units
  const getParamUnits = (paramId: string): string => {
    switch (paramId) {
      case 'temperature':
      case 'top_p':
        return '';
      case 'max_tokens':
        return 'tokens';
      default:
        return '';
    }
  };

  return (
    <div className="global-parameter-config">
      <div className="parameter-header">
        <h2>Configure Default AI Parameters</h2>
        <p className="parameter-description">
          These settings will apply to all models unless you override them specifically.
          {tier === 'complete' && ' As a Complete subscriber, you have access to advanced parameters.'}
        </p>
        
        <div className="use-defaults-toggle">
          <label>
            <input
              type="checkbox"
              checked={useDefaults}
              onChange={handleUseDefaultsToggle}
            />
            Use recommended defaults
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Loading parameters...</div>
      ) : (
        <div className="parameters-container">
          {GLOBAL_PARAMETER_DEFINITIONS.map(param => (
            // Only show advanced parameters for complete tier
            (tier === 'complete' || ['temperature', 'max_tokens', 'top_p'].includes(param.id)) && (
              <div key={param.id} className="parameter-item">
                <label htmlFor={`param-${param.id}`}>{param.name}</label>
                
                <div className="parameter-input-container">
                  {param.type === 'number' && (
                    <>
                      <input
                        id={`param-${param.id}`}
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={params[param.id] ?? param.defaultValue}
                        onChange={e => handleParamChange(param.id, e.target.value)}
                        disabled={useDefaults}
                        className="range-slider"
                      />
                      <div className="parameter-value-display">
                        <input
                          type="number"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={params[param.id] ?? param.defaultValue}
                          onChange={e => handleParamChange(param.id, e.target.value)}
                          disabled={useDefaults}
                          className="number-input"
                        />
                        <span className="param-unit">{getParamUnits(param.id)}</span>
                      </div>
                    </>
                  )}
                  
                  {param.type === 'boolean' && (
                    <input
                      id={`param-${param.id}`}
                      type="checkbox"
                      checked={params[param.id] ?? param.defaultValue}
                      onChange={e => handleParamChange(param.id, e.target.checked)}
                      disabled={useDefaults}
                    />
                  )}
                </div>
                
                <p className="parameter-description">{param.description}</p>
              </div>
            )
          ))}
        </div>
      )}
      
      <div className="step-actions">
        <div className="button-container">
          {onCancel && (
            <button className="secondary-button" onClick={onCancel}>
              Cancel
            </button>
          )}
          
          <button
            className={`primary-button ${tier}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Parameters'}
          </button>
        </div>
      </div>
      
      <div className="parameter-help">
        <h3>About These Parameters</h3>
        <p>
          These parameters control how AI models generate text and respond to your prompts.
          You can adjust them now or change them later in your account settings.
        </p>
        <ul>
          <li>
            <strong>Temperature:</strong> Controls randomness. Lower values give more predictable outputs; higher values are more creative.
          </li>
          <li>
            <strong>Maximum Length:</strong> Controls the length of generated text in tokens.
          </li>
          <li>
            <strong>Top P:</strong> Controls diversity. Lower values focus on more likely tokens; higher values consider a broader range.
          </li>
          {tier === 'complete' && (
            <>
              <li>
                <strong>Top K:</strong> Limits choices to the K most likely tokens. 0 means no limit.
              </li>
              <li>
                <strong>Presence & Frequency Penalties:</strong> Control repetition by penalizing previously used tokens.
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GlobalParameterConfig;
