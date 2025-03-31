import React, { useState } from 'react';

interface Parameter {
  name: string;
  displayName: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  description: string;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: any; label: string }>;
}

interface ParameterManagerProps {
  globalParameters: Record<string, any>;
  modelSpecificParameters?: Record<string, any>;
  onParametersChange: (parameters: Record<string, any>, isGlobal: boolean) => void;
}

const ParameterManager: React.FC<ParameterManagerProps> = ({
  globalParameters,
  modelSpecificParameters = {},
  onParametersChange
}) => {
  const [useGlobalSettings, setUseGlobalSettings] = useState<boolean>(!Object.keys(modelSpecificParameters).length);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  // Define common parameters with descriptions
  const commonParameters: Parameter[] = [
    {
      name: 'temperature',
      displayName: 'Temperature',
      type: 'number',
      description: 'Controls randomness: Lower values produce more predictable outputs, higher values more creative ones.',
      defaultValue: 0.7,
      min: 0,
      max: 1,
      step: 0.1
    },
    {
      name: 'max_length',
      displayName: 'Maximum Length',
      type: 'number',
      description: 'Maximum number of tokens to generate.',
      defaultValue: 100,
      min: 10,
      max: 1000,
      step: 10
    },
    {
      name: 'top_p',
      displayName: 'Top P',
      type: 'number',
      description: 'Controls diversity via nucleus sampling: 0.9 means consider the top 90% probability tokens.',
      defaultValue: 0.9,
      min: 0,
      max: 1,
      step: 0.1
    }
  ];
  
  // Advanced parameters with descriptions
  const advancedParameters: Parameter[] = [
    {
      name: 'top_k',
      displayName: 'Top K',
      type: 'number',
      description: 'Controls diversity by limiting to the k most likely tokens.',
      defaultValue: 50,
      min: 1,
      max: 100,
      step: 1
    },
    {
      name: 'repetition_penalty',
      displayName: 'Repetition Penalty',
      type: 'number',
      description: 'Penalizes repeated tokens to reduce repetition in text.',
      defaultValue: 1.0,
      min: 1.0,
      max: 2.0,
      step: 0.1
    },
    {
      name: 'do_sample',
      displayName: 'Enable Sampling',
      type: 'boolean',
      description: 'If false, uses greedy decoding (most likely token always chosen).',
      defaultValue: true
    }
  ];
  
  // Get appropriate parameter value (model-specific or global)
  const getParameterValue = (paramName: string) => {
    if (!useGlobalSettings && paramName in modelSpecificParameters) {
      return modelSpecificParameters[paramName];
    }
    return globalParameters[paramName] !== undefined 
      ? globalParameters[paramName] 
      : getDefaultValue(paramName);
  };
  
  // Get default value for a parameter
  const getDefaultValue = (paramName: string) => {
    const param = [...commonParameters, ...advancedParameters]
      .find(p => p.name === paramName);
      
    return param ? param.defaultValue : null;
  };
  
  // Handle parameter change
  const handleParameterChange = (paramName: string, value: any) => {
    // Convert string values to numbers for number inputs
    if ([...commonParameters, ...advancedParameters]
        .find(p => p.name === paramName)?.type === 'number') {
      value = parseFloat(value);
    }
    
    // Update parameters based on whether using global or model-specific
    const updatedParams = useGlobalSettings
      ? { ...globalParameters, [paramName]: value }
      : { ...modelSpecificParameters, [paramName]: value };
      
    onParametersChange(updatedParams, useGlobalSettings);
  };
  
  // Handle toggle for global vs. model-specific settings
  const handleSettingsToggle = () => {
    setUseGlobalSettings(!useGlobalSettings);
    
    // If switching to global, notify parent component
    if (!useGlobalSettings) {
      onParametersChange({}, true);
    }
  };
  
  // Render parameter input based on type
  const renderParameterInput = (param: Parameter) => {
    const value = getParameterValue(param.name);
    
    switch (param.type) {
      case 'number':
        return (
          <div className="parameter-input-range">
            <input
              type="range"
              id={param.name}
              min={param.min}
              max={param.max}
              step={param.step}
              value={value}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
            />
            <span className="parameter-value">{value}</span>
          </div>
        );
        
      case 'boolean':
        return (
          <div className="parameter-input-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                id={param.name}
                checked={value}
                onChange={(e) => handleParameterChange(param.name, e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span>{value ? 'Enabled' : 'Disabled'}</span>
          </div>
        );
        
      case 'select':
        return (
          <div className="parameter-input-select">
            <select
              id={param.name}
              value={value}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
            >
              {param.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
        
      default:
        return (
          <div className="parameter-input-text">
            <input
              type="text"
              id={param.name}
              value={value}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
            />
          </div>
        );
    }
  };
  
  return (
    <div className="parameter-manager">
      <div className="settings-toggle">
        <label>
          <input
            type="checkbox"
            checked={useGlobalSettings}
            onChange={handleSettingsToggle}
          />
          Use global settings for all models
        </label>
        {!useGlobalSettings && (
          <div className="model-specific-notice">
            <span>Using model-specific settings</span>
          </div>
        )}
      </div>
      
      <div className="parameters-section">
        <h3>Basic Parameters</h3>
        
        {commonParameters.map(param => (
          <div className="parameter-item" key={param.name}>
            <div className="parameter-header">
              <label htmlFor={param.name}>{param.displayName}</label>
              <div className="parameter-description">
                <p>{param.description}</p>
              </div>
            </div>
            {renderParameterInput(param)}
          </div>
        ))}
      </div>
      
      <div className="advanced-toggle">
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Hide Advanced Parameters' : 'Show Advanced Parameters'}
        </button>
      </div>
      
      {showAdvanced && (
        <div className="parameters-section advanced">
          <h3>Advanced Parameters</h3>
          
          {advancedParameters.map(param => (
            <div className="parameter-item" key={param.name}>
              <div className="parameter-header">
                <label htmlFor={param.name}>{param.displayName}</label>
                <div className="parameter-description">
                  <p>{param.description}</p>
                </div>
              </div>
              {renderParameterInput(param)}
            </div>
          ))}
        </div>
      )}
      
      <div className="presets-section">
        <h3>Quick Presets</h3>
        <div className="preset-buttons">
          <button onClick={() => {
            const presetParams = {
              temperature: 0.3,
              top_p: 0.95,
              max_length: 100
            };
            onParametersChange(presetParams, useGlobalSettings);
          }}>
            Precise & Factual
          </button>
          
          <button onClick={() => {
            const presetParams = {
              temperature: 0.8,
              top_p: 0.9,
              max_length: 150
            };
            onParametersChange(presetParams, useGlobalSettings);
          }}>
            Creative & Varied
          </button>
          
          <button onClick={() => {
            const presetParams = {
              temperature: 0.5,
              top_p: 0.9,
              max_length: 100
            };
            onParametersChange(presetParams, useGlobalSettings);
          }}>
            Balanced
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterManager;
