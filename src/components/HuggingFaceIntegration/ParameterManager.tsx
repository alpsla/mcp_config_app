import React, { useState, useEffect } from 'react';

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
    global: globalParameters.max_length || 512, // Changed from 100 to 512 as requested
    modelSpecific: modelSpecificParameters.max_length || 512 // Changed from 100 to 512 as requested
  });
  const [topPs, setTopPs] = useState<Record<string, number>>({
    global: globalParameters.top_p || 0.9,
    modelSpecific: modelSpecificParameters.top_p || 0.9
  });
  
  // Advanced parameters handling
  const [showAdvancedParams, setShowAdvancedParams] = useState(true);
  const [customParams, setCustomParams] = useState<Record<string, string>>({});
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  
  // Initialize custom parameters from any existing ones in props
  useEffect(() => {
    const params = useModelSpecific ? modelSpecificParameters : globalParameters;
    const knownKeys = ['temperature', 'max_length', 'top_p'];
    const advancedParams: Record<string, string> = {};
    
    // Find any parameters that aren't standard ones
    Object.entries(params).forEach(([key, value]) => {
      if (!knownKeys.includes(key)) {
        advancedParams[key] = String(value);
      }
    });
    
    setCustomParams(advancedParams);
  }, [globalParameters, modelSpecificParameters, useModelSpecific]);
  
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
      top_p: paramType === 'top_p' ? value : (paramGroup === 'global' ? topPs.global : topPs.modelSpecific),
      ...customParams // Include any custom parameters
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
  
  // Handle adding a new custom parameter
  const handleAddCustomParam = () => {
    if (newParamKey.trim() === '' || newParamValue.trim() === '') {
      return;
    }
    
    // Add new parameter
    const updatedParams = {
      ...customParams,
      [newParamKey]: newParamValue
    };
    
    setCustomParams(updatedParams);
    setNewParamKey('');
    setNewParamValue('');
    
    // Update all parameters
    const combinedParams = {
      temperature: useModelSpecific ? temperatures.modelSpecific : temperatures.global,
      max_length: useModelSpecific ? maxLengths.modelSpecific : maxLengths.global,
      top_p: useModelSpecific ? topPs.modelSpecific : topPs.global,
      ...updatedParams
    };
    
    onParametersChange(combinedParams, !useModelSpecific);
  };
  
  // Handle removing a custom parameter
  const handleRemoveCustomParam = (key: string) => {
    const updatedParams = { ...customParams };
    delete updatedParams[key];
    
    setCustomParams(updatedParams);
    
    // Update all parameters
    const combinedParams = {
      temperature: useModelSpecific ? temperatures.modelSpecific : temperatures.global,
      max_length: useModelSpecific ? maxLengths.modelSpecific : maxLengths.global,
      top_p: useModelSpecific ? topPs.modelSpecific : topPs.global,
      ...updatedParams
    };
    
    onParametersChange(combinedParams, !useModelSpecific);
  };

  // Styles
  const styles = {
    container: {
      marginBottom: '24px',
      padding: '20px',
      backgroundColor: '#f5f7fa',
      borderRadius: '8px'
    },
    heading: {
      marginTop: 0,
      marginBottom: '16px',
      color: '#333',
      fontSize: '18px'
    },
    toggleContainer: {
      marginBottom: '16px'
    },
    toggleLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#555',
      cursor: 'pointer'
    },
    toggleInput: {
      marginRight: '8px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '20px'
    },
    paramGroup: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#333'
    },
    rangeInput: {
      width: '100%',
      margin: '8px 0'
    },
    numberInput: {
      width: '120px',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    paramValue: {
      fontSize: '14px',
      color: '#555'
    },
    description: {
      margin: '4px 0 0',
      fontSize: '12px',
      color: '#555',
      lineHeight: 1.5
    },
    advancedSection: {
      marginTop: '24px',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '16px'
    },
    advancedHeader: {
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
      padding: '10px 16px',
      borderRadius: '6px'
    },
    advancedHeading: {
      margin: 0,
      fontSize: '16px'
    },
    advancedContent: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#edf2f7',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    },
    advancedDescription: {
      marginTop: 0,
      marginBottom: '16px',
      fontSize: '14px',
      color: '#555'
    },
    addParamForm: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      alignItems: 'center'
    },
    paramInput: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    addButton: {
      padding: '8px 16px',
      backgroundColor: '#4a6cf7',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer'
    },
    disabledButton: {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed'
    },
    paramsListContainer: {
      marginBottom: '16px'
    },
    paramsListHeading: {
      fontSize: '14px',
      marginTop: 0,
      marginBottom: '8px',
      color: '#333'
    },
    paramsList: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    },
    paramsListItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      backgroundColor: '#f5f7fa',
      borderRadius: '4px',
      marginBottom: '8px'
    },
    paramName: {
      fontWeight: 500,
      marginRight: '8px'
    },
    paramValueStyle: {
      flex: 1,
      color: '#555'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontSize: '14px',
      padding: '4px 8px',
      borderRadius: '4px'
    },
    noParams: {
      color: '#9ca3af',
      fontStyle: 'italic',
      fontSize: '14px',
      margin: '8px 0'
    },
    helpSection: {
      marginTop: '16px',
      paddingTop: '12px',
      borderTop: '1px dashed #e5e7eb',
      fontSize: '13px'
    },
    link: {
      color: '#4a6cf7',
      textDecoration: 'none'
    }
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>{modelId ? `Parameters for ${modelId}` : 'Model Parameters'}</h3>
      
      {/* Toggle between global and model-specific parameters */}
      {modelId && (
        <div style={styles.toggleContainer}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={useModelSpecific}
              onChange={handleToggleParameterType}
              style={styles.toggleInput}
            />
            Use model-specific parameters
          </label>
        </div>
      )}
      
      {/* Parameters form */}
      <div style={styles.form}>
        <div style={styles.paramGroup}>
          <label htmlFor={`temperature-${useModelSpecific ? 'model' : 'global'}`} style={styles.label}>
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
            style={styles.rangeInput}
          />
          <span style={styles.paramValue}>
            {useModelSpecific ? temperatures.modelSpecific : temperatures.global}
          </span>
          <p style={styles.description}>
            Controls randomness: Lower values produce more focused outputs, higher values produce more creative outputs.
          </p>
        </div>
        
        <div style={styles.paramGroup}>
          <label htmlFor={`max-length-${useModelSpecific ? 'model' : 'global'}`} style={styles.label}>
            Maximum Length:
          </label>
          <input
            id={`max-length-${useModelSpecific ? 'model' : 'global'}`}
            type="number"
            min="10"
            max="512" // Changed from 1000 to 512 as requested
            step="10"
            value={useModelSpecific ? maxLengths.modelSpecific : maxLengths.global}
            onChange={(e) => handleParameterChange('max_length', parseInt(e.target.value), useModelSpecific ? 'modelSpecific' : 'global')}
            style={styles.numberInput}
          />
          <p style={styles.description}>
            The maximum number of tokens to generate in the output (limited to 512 for security and performance).
          </p>
        </div>
        
        <div style={styles.paramGroup}>
          <label htmlFor={`top-p-${useModelSpecific ? 'model' : 'global'}`} style={styles.label}>
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
            style={styles.rangeInput}
          />
          <span style={styles.paramValue}>
            {useModelSpecific ? topPs.modelSpecific : topPs.global}
          </span>
          <p style={styles.description}>
            Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.
          </p>
        </div>
        
        {/* Advanced Parameters Section */}
        <div style={styles.advancedSection}>
          <div 
            style={styles.advancedHeader}
            onClick={() => setShowAdvancedParams(!showAdvancedParams)}
          >
            <h4 style={styles.advancedHeading}>Advanced Parameters {showAdvancedParams ? '▼' : '►'}</h4>
          </div>
          
          {showAdvancedParams && (
            <div style={styles.advancedContent}>
              <p style={styles.advancedDescription}>
                Add custom parameters for advanced model configuration.
              </p>
              
              {/* Add new parameter form */}
              <div style={styles.addParamForm}>
                <input
                  type="text"
                  placeholder="Parameter Name"
                  value={newParamKey}
                  onChange={(e) => setNewParamKey(e.target.value)}
                  style={styles.paramInput}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={newParamValue}
                  onChange={(e) => setNewParamValue(e.target.value)}
                  style={styles.paramInput}
                />
                <button 
                  type="button" 
                  onClick={handleAddCustomParam}
                  disabled={!newParamKey.trim() || !newParamValue.trim()}
                  style={{
                    ...styles.addButton,
                    ...(!newParamKey.trim() || !newParamValue.trim() ? styles.disabledButton : {})
                  }}
                >
                  Add
                </button>
              </div>
              
              {/* List of current custom parameters */}
              {Object.keys(customParams).length > 0 ? (
                <div style={styles.paramsListContainer}>
                  <h5 style={styles.paramsListHeading}>Custom Parameters:</h5>
                  <ul style={styles.paramsList}>
                    {Object.entries(customParams).map(([key, value]) => (
                      <li key={key} style={styles.paramsListItem}>
                        <span style={styles.paramName}>{key}:</span>
                        <span style={styles.paramValueStyle}>{value}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomParam(key)}
                          style={styles.removeButton}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={styles.noParams}>No custom parameters added yet.</p>
              )}
              
              <div style={styles.helpSection}>
                <p>
                  <strong>Need help?</strong> See the <a 
                    href="https://huggingface.co/docs/api-inference/detailed_parameters" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    Hugging Face API documentation
                  </a> for available parameters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterManager;