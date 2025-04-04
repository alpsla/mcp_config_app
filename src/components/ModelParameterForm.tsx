import React, { useState, useEffect, useCallback } from 'react';
import './ModelParameterForm.css';
import { Model } from './ModelSelector';

interface ModelParameterFormProps {
  model: Model;
  isConfigured: boolean;
  initialParams: Record<string, any>;
  globalParams: Record<string, any>;
  onSave: (modelId: string, params: Record<string, any>) => void;
  onCancel: () => void;
}

// Define common parameter metadata
const PARAMETER_METADATA: Record<string, {
  type: 'number' | 'string' | 'boolean';
  label: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  options?: { value: any, label: string }[];
  isGlobal?: boolean;
}> = {
  temperature: {
    type: 'number',
    label: 'Temperature',
    description: 'Controls randomness in generation. Higher values (e.g., 1.0) make output more random, while lower values (e.g., 0.2) make it more deterministic.',
    min: 0,
    max: 2,
    step: 0.1,
    isGlobal: true
  },
  max_tokens: {
    type: 'number',
    label: 'Max Tokens',
    description: 'Maximum number of tokens to generate. A token is roughly 4 characters for English text.',
    min: 1,
    max: 4096,
    step: 1,
    isGlobal: true
  },
  top_p: {
    type: 'number',
    label: 'Top P',
    description: 'Controls diversity via nucleus sampling. 0.9 means only consider tokens comprising the top 90% probability mass.',
    min: 0,
    max: 1,
    step: 0.01,
    isGlobal: true
  },
  top_k: {
    type: 'number',
    label: 'Top K',
    description: 'Limits token selection to the top K tokens with highest probability.',
    min: 1,
    max: 100,
    step: 1,
    isGlobal: true
  },
  token: {
    type: 'string',
    label: 'API Token',
    description: 'Your Hugging Face API token. This will be stored securely.',
    placeholder: 'hf_...',
    isGlobal: true
  },
  image_width: {
    type: 'number',
    label: 'Image Width',
    description: 'Width of generated images in pixels.',
    min: 128,
    max: 1024,
    step: 8
  },
  image_height: {
    type: 'number',
    label: 'Image Height',
    description: 'Height of generated images in pixels.',
    min: 128,
    max: 1024,
    step: 8
  },
  num_inference_steps: {
    type: 'number',
    label: 'Inference Steps',
    description: 'Number of diffusion steps. Higher values give better quality but take longer.',
    min: 1,
    max: 100,
    step: 1
  },
  guidance_scale: {
    type: 'number',
    label: 'Guidance Scale',
    description: 'Controls how closely the image follows the prompt. Higher values adhere more strictly.',
    min: 1,
    max: 20,
    step: 0.1
  }
};

// Define which parameters apply to which model types
const MODEL_TYPE_PARAMS: Record<string, string[]> = {
  'Image Generation': ['image_width', 'image_height', 'num_inference_steps', 'guidance_scale'],
  'Image Editing': ['image_width', 'image_height', 'num_inference_steps', 'guidance_scale'],
  'Text Generation': ['temperature', 'max_tokens', 'top_p', 'top_k'],
  'Language Model': ['temperature', 'max_tokens', 'top_p', 'top_k'],
  'Video Generation': ['image_width', 'image_height', 'num_inference_steps', 'guidance_scale']
};

// Default parameters by model category
const DEFAULT_PARAMS: Record<string, Record<string, any>> = {
  'Image Generation': {
    image_width: 512,
    image_height: 512,
    num_inference_steps: 30,
    guidance_scale: 7.5
  },
  'Image Editing': {
    image_width: 512,
    image_height: 512,
    num_inference_steps: 30,
    guidance_scale: 7.5
  },
  'Text Generation': {
    temperature: 0.7,
    max_tokens: 100,
    top_p: 0.9,
    top_k: 50
  },
  'Language Model': {
    temperature: 0.7,
    max_tokens: 100,
    top_p: 0.9,
    top_k: 50
  },
  'Video Generation': {
    image_width: 512,
    image_height: 512,
    num_inference_steps: 30,
    guidance_scale: 7.5
  }
};

// Add global token parameter to all model types
Object.keys(MODEL_TYPE_PARAMS).forEach(type => {
  MODEL_TYPE_PARAMS[type].push('token');
});

const ModelParameterForm: React.FC<ModelParameterFormProps> = ({
  model,
  isConfigured,
  initialParams,
  globalParams,
  onSave,
  onCancel
}) => {
  // Get applicable parameters for this model
  const getApplicableParams = (): string[] => {
    return MODEL_TYPE_PARAMS[model.category] || [];
  };

  // Initialize parameters with defaults, global params, and model-specific overrides
  const initializeParams = useCallback((): Record<string, any> => {
    const defaultModelParams = DEFAULT_PARAMS[model.category] || {};
    
    // Start with category defaults
    const params = { ...defaultModelParams };
    
    // Apply global parameters
    Object.entries(globalParams).forEach(([key, value]) => {
      if (PARAMETER_METADATA[key]?.isGlobal) {
        params[key] = value;
      }
    });
    
    // Override with model-specific params if available
    if (initialParams) {
      Object.entries(initialParams).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    
    return params;
  }, [model.category, globalParams, initialParams]);

  const [params, setParams] = useState<Record<string, any>>(initializeParams());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState<boolean>(true);

  // Extract dependencies for useEffect
  const modelId = model.id;
  const initialParamsString = JSON.stringify(initialParams);
  const globalParamsString = JSON.stringify(globalParams);

  // Update form when model or initialParams change
  useEffect(() => {
    setParams(initializeParams());
  }, [modelId, initialParamsString, globalParamsString, initializeParams]);

  // Validate all parameters
  const validateParams = (currentParams: Record<string, any>): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    const applicableParams = getApplicableParams();
    
    applicableParams.forEach(paramKey => {
      const metadata = PARAMETER_METADATA[paramKey];
      
      if (!metadata) return;
      
      const value = currentParams[paramKey];
      
      // Required validation
      if (paramKey === 'token' && (!value || value.trim() === '')) {
        newErrors[paramKey] = 'API Token is required';
      }
      
      // Number range validation
      if (metadata.type === 'number' && value !== undefined) {
        if (metadata.min !== undefined && value < metadata.min) {
          newErrors[paramKey] = `Value must be at least ${metadata.min}`;
        }
        if (metadata.max !== undefined && value > metadata.max) {
          newErrors[paramKey] = `Value must be at most ${metadata.max}`;
        }
      }
    });
    
    return newErrors;
  };

  // Handle parameter changes
  const handleParamChange = (paramKey: string, value: any) => {
    const newParams = { ...params, [paramKey]: value };
    setParams(newParams);
    
    // Validate the changed parameter
    const newErrors = { ...errors };
    
    const metadata = PARAMETER_METADATA[paramKey];
    if (!metadata) return;
    
    // Clear existing error
    delete newErrors[paramKey];
    
    // Validate the new value
    if (metadata.type === 'number') {
      if (metadata.min !== undefined && value < metadata.min) {
        newErrors[paramKey] = `Value must be at least ${metadata.min}`;
      }
      if (metadata.max !== undefined && value > metadata.max) {
        newErrors[paramKey] = `Value must be at most ${metadata.max}`;
      }
    }
    
    // Required validation for API token
    if (paramKey === 'token' && (!value || value.trim() === '')) {
      newErrors[paramKey] = 'API Token is required';
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all parameters
    const validationErrors = validateParams(params);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, save the parameters
      onSave(model.id, params);
    } else {
      setIsValid(false);
    }
  };

  // Render a parameter input field based on its type
  const renderParameterInput = (paramKey: string, metadata: typeof PARAMETER_METADATA[string]) => {
    if (!metadata) return null;
    
    const value = params[paramKey];
    const error = errors[paramKey];
    
    // Check if this is a global parameter or not
    const isGlobalParam = metadata.isGlobal;
    const useGlobalValue = isGlobalParam && !initialParams[paramKey];
    const isUsingGlobal = isGlobalParam && useGlobalValue;
    
    // For global parameters, show the "Use global" checkbox
    const globalToggle = isGlobalParam && (
      <div className="global-toggle">
        <label>
          <input
            type="checkbox"
            checked={useGlobalValue}
            onChange={(e) => {
              if (e.target.checked) {
                // Use global value
                const newParams = { ...params };
                delete newParams[paramKey]; // Remove the override
                setParams(newParams);
              } else {
                // Set to current global value as a starting point
                handleParamChange(paramKey, globalParams[paramKey]);
              }
            }}
          />
          Use global value
        </label>
      </div>
    );
    
    switch (metadata.type) {
      case 'number':
        return (
          <div className={`param-input-container ${error ? 'has-error' : ''}`} key={paramKey}>
            <div className="param-header">
              <label htmlFor={paramKey}>{metadata.label}</label>
              {globalToggle}
            </div>
            <input
              id={paramKey}
              type="number"
              min={metadata.min}
              max={metadata.max}
              step={metadata.step}
              value={isUsingGlobal ? globalParams[paramKey] : value}
              onChange={(e) => handleParamChange(paramKey, parseFloat(e.target.value))}
              disabled={isUsingGlobal}
              className={error ? 'input-error' : ''}
            />
            <p className="param-description">{metadata.description}</p>
            {error && <p className="error-message">{error}</p>}
          </div>
        );
        
      case 'string':
        return (
          <div className={`param-input-container ${error ? 'has-error' : ''}`} key={paramKey}>
            <div className="param-header">
              <label htmlFor={paramKey}>{metadata.label}</label>
              {globalToggle}
            </div>
            {/* If it's a token field, use password input */}
            {paramKey === 'token' ? (
              <input
                id={paramKey}
                type="password"
                placeholder={metadata.placeholder}
                value={isUsingGlobal ? globalParams[paramKey] : value || ''}
                onChange={(e) => handleParamChange(paramKey, e.target.value)}
                disabled={isUsingGlobal}
                className={error ? 'input-error' : ''}
              />
            ) : (
              <input
                id={paramKey}
                type="text"
                placeholder={metadata.placeholder}
                value={isUsingGlobal ? globalParams[paramKey] : value || ''}
                onChange={(e) => handleParamChange(paramKey, e.target.value)}
                disabled={isUsingGlobal}
                className={error ? 'input-error' : ''}
              />
            )}
            <p className="param-description">{metadata.description}</p>
            {error && <p className="error-message">{error}</p>}
          </div>
        );
        
      case 'boolean':
        return (
          <div className={`param-input-container ${error ? 'has-error' : ''}`} key={paramKey}>
            <div className="param-header">
              <label htmlFor={paramKey}>{metadata.label}</label>
              {globalToggle}
            </div>
            <div className="boolean-input">
              <input
                id={paramKey}
                type="checkbox"
                checked={isUsingGlobal ? globalParams[paramKey] : value}
                onChange={(e) => handleParamChange(paramKey, e.target.checked)}
                disabled={isUsingGlobal}
                className={error ? 'input-error' : ''}
              />
              <span>Enabled</span>
            </div>
            <p className="param-description">{metadata.description}</p>
            {error && <p className="error-message">{error}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };

  const applicableParams = getApplicableParams();
  
  return (
    <div className="model-parameter-form">
      <h3 className="form-title">Configure {model.name}</h3>
      <p className="form-subtitle">{model.description}</p>
      
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <div className="parameter-groups">
            {/* Global Parameters */}
            <div className="parameter-group">
              <h4 className="group-title">Global Parameters</h4>
              {applicableParams
                .filter(paramKey => PARAMETER_METADATA[paramKey]?.isGlobal)
                .map(paramKey => renderParameterInput(paramKey, PARAMETER_METADATA[paramKey]))}
            </div>
            
            {/* Model-Specific Parameters */}
            <div className="parameter-group">
              <h4 className="group-title">Model-Specific Parameters</h4>
              {applicableParams
                .filter(paramKey => !PARAMETER_METADATA[paramKey]?.isGlobal)
                .map(paramKey => renderParameterInput(paramKey, PARAMETER_METADATA[paramKey]))}
            </div>
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
              disabled={!isValid}
            >
              {isConfigured ? 'Update Configuration' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelParameterForm;