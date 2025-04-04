import React, { useState } from 'react';

interface ParameterManagerProps {
  globalParameters: Record<string, any>;
  modelSpecificParameters: Record<string, any>;
  onParametersChange: (parameters: Record<string, any>, isGlobal: boolean) => void;
  modelId?: string; // Optional model ID for model-specific parameters
}

const ParameterManager: React.FC<ParameterManagerProps> = ({
  globalParameters,
  modelSpecificParameters,
  onParametersChange,
  modelId
}) => {
  const [useModelSpecific, setUseModelSpecific] = useState(Object.keys(modelSpecificParameters).length > 0);
  const [temperatures, setTemperatures] = useState<Record<string, number>>({
    global: globalParameters.temperature || 0.7,
    modelSpecific: modelSpecificParameters.temperature || 0.7
  });
  const [maxLengths, setMaxLengths] = useState<Record<string, number>>({
    global: globalParameters.max_length || 100,
    modelSpecific: modelSpecificParameters.max_length || 100
  });
  const [topPs, setTopPs] = useState<Record<string, number>>({
    global: globalParameters.top_p || 0.9,
    modelSpecific: modelSpecificParameters.top_p || 0.9
  });
  
  // Handle parameter changes
  const handleParameterChange = (
    paramType: 'temperature' | 'max_length' | 'top_p',
    value: number,
    paramGroup: 'global' | 'modelSpecific'
  ) => {
    // Update the state based on parameter type
    switch (paramType) {
      case 'temperature':
        setTemperatures(prev => ({
          ...prev,
          [paramGroup]: value
        }));
        break;
      case 'max_length':
        setMaxLengths(prev => ({
          ...prev,
          [paramGroup]: value
        }));
        break;
      case 'top_p':
        setTopPs(prev => ({
          ...prev,
          [paramGroup]: value
        }));
        break;
    }
    
    // Update parameters object
    const updatedParams = {
      temperature: paramType === 'temperature' ? value : (paramGroup === 'global' ? temperatures.global : temperatures.modelSpecific),
      max_length: paramType === 'max_length' ? value : (paramGroup === 'global' ? maxLengths.global : maxLengths.modelSpecific),
      top_p: paramType === 'top_p' ? value : (paramGroup === 'global' ? topPs.global : topPs.modelSpecific)
    };
    
    // Call callback function
    onParametersChange(updatedParams, paramGroup === 'global');
  };
  
  // Toggle between global and model-specific parameters
  const handleToggleParameterType = () => {
    setUseModelSpecific(!useModelSpecific);
    
    // Update parameters based on new toggle state
    const newIsGlobal = useModelSpecific; // If currently using model specific, will switch to global
    
    // Get appropriate parameters based on toggle state
    const params = newIsGlobal ? globalParameters : modelSpecificParameters;
    
    // Call callback with same parameters but changed "isGlobal" flag
    onParametersChange(params, newIsGlobal);
  };
  
  return (
    <div className="parameter-manager">
      <h3>{modelId ? `Parameters for ${modelId}` : 'Model Parameters'}</h3>
      
      {/* Toggle between global and model-specific parameters */}
      {modelId && (
        <div className="parameter-type-toggle">
          <label>
            <input
              type="checkbox"
              checked={useModelSpecific}
              onChange={handleToggleParameterType}
            />
            Use model-specific parameters
          </label>
        </div>
      )}
      
      {/* Parameters form */}
      <div className="parameters-form">
        <div className="parameter-group">
          <label htmlFor={`temperature-${useModelSpecific ? 'model' : 'global'}`}>
            Temperature:
          </label>
          <input
            id={`temperature-${useModelSpecific ? 'model' : 'global'}`}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={useModelSpecific ? temperatures.modelSpecific : temperatures.global}
            onChange={(e) => handleParameterChange('temperature', parseFloat(e.target.value), useModelSpecific ? 'modelSpecific' : 'global')}
          />
          <span className="parameter-value">
            {useModelSpecific ? temperatures.modelSpecific : temperatures.global}
          </span>
          <p className="parameter-description">
            Controls randomness: Lower values produce more focused outputs, higher values produce more creative outputs.
          </p>
        </div>
        
        <div className="parameter-group">
          <label htmlFor={`max-length-${useModelSpecific ? 'model' : 'global'}`}>
            Maximum Length:
          </label>
          <input
            id={`max-length-${useModelSpecific ? 'model' : 'global'}`}
            type="number"
            min="10"
            max="1000"
            step="10"
            value={useModelSpecific ? maxLengths.modelSpecific : maxLengths.global}
            onChange={(e) => handleParameterChange('max_length', parseInt(e.target.value), useModelSpecific ? 'modelSpecific' : 'global')}
          />
          <p className="parameter-description">
            The maximum number of tokens to generate in the output.
          </p>
        </div>
        
        <div className="parameter-group">
          <label htmlFor={`top-p-${useModelSpecific ? 'model' : 'global'}`}>
            Top P:
          </label>
          <input
            id={`top-p-${useModelSpecific ? 'model' : 'global'}`}
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={useModelSpecific ? topPs.modelSpecific : topPs.global}
            onChange={(e) => handleParameterChange('top_p', parseFloat(e.target.value), useModelSpecific ? 'modelSpecific' : 'global')}
          />
          <span className="parameter-value">
            {useModelSpecific ? topPs.modelSpecific : topPs.global}
          </span>
          <p className="parameter-description">
            Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParameterManager;