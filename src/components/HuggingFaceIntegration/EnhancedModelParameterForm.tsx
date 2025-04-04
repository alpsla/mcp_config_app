import React, { useState, useEffect } from 'react';
import { enhancedConfigurationManager, GLOBAL_PARAMETER_DEFINITIONS } from '../../services/EnhancedConfigurationManager';
import { useAuth } from '../../auth/AuthContext';
import { GlobalParameter, mapTierToSimpleType, SubscriptionTierSimple } from '../../types/enhanced-types';
import './EnhancedModelParameterForm.css';

interface ModelParameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'string' | 'boolean';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

interface EnhancedModelParameterFormProps {
  modelId: string;
  modelName: string;
  initialParams?: Record<string, any>;
  onSave: (modelId: string, params: Record<string, any>) => void;
  onCancel: () => void;
}

/**
 * Enhanced model parameter form that integrates with global parameters
 */
const EnhancedModelParameterForm: React.FC<EnhancedModelParameterFormProps> = ({
  modelId,
  modelName,
  initialParams = {},
  onSave,
  onCancel
}) => {
  const { authState, getUserSubscriptionTier } = useAuth();
  const [params, setParams] = useState<Record<string, any>>({});
  const [globalParams, setGlobalParams] = useState<Record<string, any>>({});
  const [useGlobalParams, setUseGlobalParams] = useState<Record<string, boolean>>({});
  const [currentTier, setCurrentTier] = useState<SubscriptionTierSimple>('none');
  const [modelParameters, setModelParameters] = useState<ModelParameter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load global parameters and determine which ones are being overridden
  useEffect(() => {
    const loadGlobalParams = async () => {
      if (authState?.user?.id) {
        try {
          // Get subscription tier
          const tier = getUserSubscriptionTier?.();
          setCurrentTier(mapTierToSimpleType(tier));
          
          // Get global parameters
          const globals = await enhancedConfigurationManager.getGlobalParamsFromUserPreferences(
            authState.user.id
          );
          setGlobalParams(globals);
          
          // Determine which parameters are using global values
          const useGlobals: Record<string, boolean> = {};
          const modelSpecificParams = { ...initialParams };
          
          // For each parameter, check if it's using the global value
          Object.keys(globals).forEach(key => {
            const isUsingGlobal = initialParams[key] === undefined || 
                                 initialParams[key] === globals[key];
            useGlobals[key] = isUsingGlobal;
            
            // If using global, don't include in model-specific params
            if (isUsingGlobal && modelSpecificParams[key] !== undefined) {
              delete modelSpecificParams[key];
            }
          });
          
          setUseGlobalParams(useGlobals);
          setParams(modelSpecificParams);
          
          // Create model parameters list from global parameters
          const parameters = GLOBAL_PARAMETER_DEFINITIONS.map(paramDef => ({
            id: paramDef.id,
            name: paramDef.name,
            description: paramDef.description,
            type: paramDef.type === 'select' ? 'string' : paramDef.type as 'number' | 'string' | 'boolean',
            defaultValue: paramDef.defaultValue,
            min: paramDef.min,
            max: paramDef.max,
            step: paramDef.step
          }));
          
          setModelParameters(parameters);
        } catch (error) {
          console.error('Error loading parameters:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadGlobalParams();
  }, [authState?.user?.id, getUserSubscriptionTier, initialParams]);

  // Handle parameter toggle between global and model-specific
  const handleToggleGlobal = (paramId: string) => {
    const isUsingGlobal = !useGlobalParams[paramId];
    
    // Update the toggle state
    setUseGlobalParams(prev => ({
      ...prev,
      [paramId]: isUsingGlobal
    }));
    
    // Update the parameters
    if (isUsingGlobal) {
      // Switch to global parameter, remove from model params
      setParams(prev => {
        const updated = { ...prev };
        delete updated[paramId];
        return updated;
      });
    } else {
      // Switch to model-specific parameter, add to model params
      setParams(prev => ({
        ...prev,
        [paramId]: globalParams[paramId]
      }));
    }
  };

  // Handle parameter change
  const handleParamChange = (paramId: string, value: any) => {
    // Convert to appropriate type based on parameter definition
    const param = modelParameters.find(p => p.id === paramId);
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
    } else if (param && param.type === 'boolean') {
      typedValue = value === true || value === 'true';
    }
    
    // Update the parameter
    setParams(prev => ({
      ...prev,
      [paramId]: typedValue
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine model-specific parameters with global parameters
    const combinedParams: Record<string, any> = {};
    
    // Only include model-specific parameters (not using global)
    Object.keys(params).forEach(key => {
      if (!useGlobalParams[key]) {
        combinedParams[key] = params[key];
      }
    });
    
    onSave(modelId, combinedParams);
  };

  // Filter parameters based on subscription tier
  const getFilteredParameters = (): ModelParameter[] => {
    if (currentTier === 'complete') {
      // Complete subscribers get all parameters
      return modelParameters;
    } else {
      // Basic subscribers get only basic parameters
      return modelParameters.filter(param => 
        ['temperature', 'max_tokens', 'top_p'].includes(param.id)
      );
    }
  };

  if (isLoading) {
    return <div className="loading-parameters">Loading parameters...</div>;
  }

  return (
    <div className="enhanced-model-parameter-form">
      <h2>Configure Parameters for {modelName}</h2>
      <p className="form-description">
        Customize how this model behaves by setting parameters below.
        You can use global parameters or specify custom values for this model.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="parameter-list">
          {getFilteredParameters().map(param => (
            <div key={param.id} className="parameter-item">
              <div className="parameter-header">
                <label htmlFor={`param-${param.id}`}>{param.name}</label>
                <div className="parameter-toggle">
                  <span className={`toggle-label ${useGlobalParams[param.id] ? 'active' : ''}`}>
                    Use Global
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={useGlobalParams[param.id] || false}
                      onChange={() => handleToggleGlobal(param.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              
              <div className="parameter-input-container">
                {param.type === 'number' && (
                  <>
                    <input
                      id={`param-${param.id}`}
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={useGlobalParams[param.id] 
                        ? globalParams[param.id] ?? param.defaultValue
                        : params[param.id] ?? param.defaultValue}
                      onChange={e => handleParamChange(param.id, e.target.value)}
                      disabled={useGlobalParams[param.id]}
                      className="range-slider"
                    />
                    <div className="parameter-value">
                      <input
                        type="number"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={useGlobalParams[param.id]
                          ? globalParams[param.id] ?? param.defaultValue
                          : params[param.id] ?? param.defaultValue}
                        onChange={e => handleParamChange(param.id, e.target.value)}
                        disabled={useGlobalParams[param.id]}
                        className="number-input"
                      />
                    </div>
                  </>
                )}
                
                {param.type === 'boolean' && (
                  <input
                    id={`param-${param.id}`}
                    type="checkbox"
                    checked={useGlobalParams[param.id]
                      ? globalParams[param.id] ?? param.defaultValue
                      : params[param.id] ?? param.defaultValue}
                    onChange={e => handleParamChange(param.id, e.target.checked)}
                    disabled={useGlobalParams[param.id]}
                  />
                )}
                
                {param.type === 'string' && (
                  <input
                    id={`param-${param.id}`}
                    type="text"
                    value={useGlobalParams[param.id]
                      ? globalParams[param.id] ?? param.defaultValue
                      : params[param.id] ?? param.defaultValue}
                    onChange={e => handleParamChange(param.id, e.target.value)}
                    disabled={useGlobalParams[param.id]}
                  />
                )}
              </div>
              
              <p className="parameter-description">{param.description}</p>
              
              {useGlobalParams[param.id] && (
                <div className="global-parameter-indicator">
                  <span className="global-icon">🌐</span>
                  <span className="global-message">Using global value</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="parameter-comparison">
          <h3>How this model compares to global settings</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Global Value</th>
                <th>This Model</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredParameters().map(param => (
                <tr key={param.id} className={useGlobalParams[param.id] ? 'using-global' : ''}>
                  <td>{param.name}</td>
                  <td>{globalParams[param.id] !== undefined 
                    ? `${globalParams[param.id]}` 
                    : 'Not set'}
                  </td>
                  <td>
                    {useGlobalParams[param.id] 
                      ? <span className="global-value">Same as global</span>
                      : <span className="custom-value">{params[param.id]}</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-button"
          >
            Save Parameters
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedModelParameterForm;
