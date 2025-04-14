import React, { useState } from 'react';
import './CustomParametersSection.css';

interface CustomParameter {
  name: string;
  value: string | number | boolean;
}

interface CustomParametersSectionProps {
  parameters: CustomParameter[];
  onAddParameter: (param: CustomParameter) => void;
  onRemoveParameter: (index: number) => void;
}

/**
 * Component for adding and managing custom model parameters
 */
const CustomParametersSection: React.FC<CustomParametersSectionProps> = ({
  parameters,
  onAddParameter,
  onRemoveParameter
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParamName, setNewParamName] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  const [newParamType, setNewParamType] = useState<'text' | 'number' | 'boolean'>('text');
  
  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Handle form submission
  const handleAddParameter = () => {
    if (!newParamName.trim()) return;
    
    let processedValue: string | number | boolean = newParamValue;
    
    // Convert value based on selected type
    if (newParamType === 'number') {
      processedValue = parseFloat(newParamValue);
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    } else if (newParamType === 'boolean') {
      processedValue = newParamValue.toLowerCase() === 'true';
    }
    
    onAddParameter({
      name: newParamName.trim(),
      value: processedValue
    });
    
    // Reset form
    setNewParamName('');
    setNewParamValue('');
    setShowAddForm(false);
  };
  
  // Render value based on its type
  const renderParameterValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    return value.toString();
  };
  
  return (
    <div className="custom-parameters">
      <div className="section-header" onClick={toggleExpand}>
        <h3 className="section-title">
          <span className="section-icon">➕</span>
          Custom Parameters
        </h3>
        <div className="parameter-count">
          {parameters.length > 0 ? `${parameters.length} parameter${parameters.length > 1 ? 's' : ''}` : 'No custom parameters'}
        </div>
        <button 
          type="button" 
          className="expand-button"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse custom parameters section" : "Expand custom parameters section"}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          <div className="section-description">
            Add custom parameters for specific models or special use cases. 
            These will be included when saving presets.
          </div>
          
          {/* List of existing parameters */}
          {parameters.length > 0 && (
            <div className="parameter-list">
              <div className="parameter-list-header">
                <div className="param-name-header">Parameter Name</div>
                <div className="param-value-header">Value</div>
                <div className="param-actions-header">Action</div>
              </div>
              
              {parameters.map((param, index) => (
                <div key={index} className="parameter-item">
                  <div className="param-name">{param.name}</div>
                  <div className="param-value">{renderParameterValue(param.value)}</div>
                  <div className="param-actions">
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => onRemoveParameter(index)}
                      aria-label={`Remove parameter ${param.name}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Form to add new parameter */}
          {!showAddForm ? (
            <button 
              type="button"
              className="add-button"
              onClick={() => setShowAddForm(true)}
            >
              + Add Custom Parameter
            </button>
          ) : (
            <div className="add-parameter-form">
              <h4 className="form-title">Add New Parameter</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="paramName">Parameter Name:</label>
                  <input
                    type="text"
                    id="paramName"
                    className="form-input"
                    value={newParamName}
                    onChange={(e) => setNewParamName(e.target.value)}
                    placeholder="e.g., repetition_penalty"
                  />
                  <div className="input-help">
                    The name of the parameter, as specified by the model documentation.
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="paramType">Value Type:</label>
                  <select
                    id="paramType"
                    className="form-select"
                    value={newParamType}
                    onChange={(e) => setNewParamType(e.target.value as 'text' | 'number' | 'boolean')}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">True/False</option>
                  </select>
                  <div className="input-help">
                    Select the type of value this parameter needs.
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="paramValue">Parameter Value:</label>
                  {newParamType === 'boolean' ? (
                    <select
                      id="paramValue"
                      className="form-select"
                      value={newParamValue}
                      onChange={(e) => setNewParamValue(e.target.value)}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <input
                      type={newParamType === 'number' ? 'number' : 'text'}
                      id="paramValue"
                      className="form-input"
                      value={newParamValue}
                      onChange={(e) => setNewParamValue(e.target.value)}
                      placeholder={newParamType === 'number' ? '0.5' : 'Enter value'}
                    />
                  )}
                  <div className="input-help">
                    {newParamType === 'number' ? 'Enter a number value for this parameter.' :
                     newParamType === 'boolean' ? 'Choose whether this parameter should be True or False.' :
                     'Enter the text value for this parameter.'}
                  </div>
                </div>
              </div>
              
              <div className="form-examples">
                <h5>Common Examples:</h5>
                <ul>
                  <li><strong>repetition_penalty</strong> (number): 1.2 - Controls how much the model avoids repeating the same phrases.</li>
                  <li><strong>frequency_penalty</strong> (number): 0.5 - Reduces repetition by lowering the likelihood of repeating tokens.</li>
                  <li><strong>presence_penalty</strong> (number): 0.8 - Encourages model to talk about new topics.</li>
                  <li><strong>use_cache</strong> (boolean): True - Whether to use cache for faster responses.</li>
                </ul>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewParamName('');
                    setNewParamValue('');
                  }}
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  className="add-param-button"
                  onClick={handleAddParameter}
                  disabled={!newParamName.trim()}
                >
                  Add Parameter
                </button>
              </div>
            </div>
          )}
          
          {parameters.length > 0 && !showAddForm && (
            <div className="parameters-hint">
              <div className="hint-icon">💡</div>
              <div className="hint-text">
                <strong>Tip:</strong> Custom parameters are great for advanced model settings 
                like repetition control. They allow you to use model-specific features 
                without changing your code.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomParametersSection;