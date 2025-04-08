import React, { useState } from 'react';
import './CustomParameterStyles.css';

interface CustomParameter {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  advancedOnly: boolean;
}

interface CustomParameterSectionProps {
  onParameterAdded: (parameter: CustomParameter) => void;
  onParameterRemoved: (parameterId: string) => void;
  customParameters: CustomParameter[];
  disabled: boolean;
}

const CustomParameterSection: React.FC<CustomParameterSectionProps> = ({
  onParameterAdded,
  onParameterRemoved,
  customParameters,
  disabled
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParameter, setNewParameter] = useState<CustomParameter>({
    id: '',
    name: '',
    description: '',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    unit: '',
    advancedOnly: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateParameter = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!newParameter.name.trim()) {
      newErrors.name = 'Parameter name is required';
    }
    
    if (!newParameter.id.trim()) {
      newErrors.id = 'Parameter ID is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(newParameter.id)) {
      newErrors.id = 'Parameter ID can only contain letters, numbers, and underscores';
    } else if (customParameters.some(p => p.id === newParameter.id)) {
      newErrors.id = 'Parameter ID must be unique';
    }
    
    if (newParameter.min >= newParameter.max) {
      newErrors.range = 'Maximum value must be greater than minimum value';
    }
    
    if (newParameter.defaultValue < newParameter.min || newParameter.defaultValue > newParameter.max) {
      newErrors.defaultValue = 'Default value must be between minimum and maximum values';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setNewParameter(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleAddParameter = () => {
    if (validateParameter()) {
      onParameterAdded({
        ...newParameter,
        // Generate an ID based on name if not provided
        id: newParameter.id.trim() || newParameter.name.toLowerCase().replace(/\s+/g, '_')
      });
      
      // Reset form
      setNewParameter({
        id: '',
        name: '',
        description: '',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        unit: '',
        advancedOnly: false
      });
      
      setShowAddForm(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setErrors({});
  };

  return (
    <div className="custom-parameter-section">
      <div className="section-header-with-actions">
        <h3 className="section-header">Custom Parameters</h3>
        {!showAddForm && (
          <button 
            type="button" 
            className="add-parameter-button"
            onClick={toggleAddForm}
            disabled={disabled}
          >
            + Add Parameter
          </button>
        )}
      </div>

      {customParameters.length === 0 && !showAddForm && (
        <div className="no-parameters-message">
          <p>Create your own custom parameters to fine-tune AI model behavior for specific use cases. Custom parameters will be saved with your profile and can be reused across multiple configurations.</p>
        </div>
      )}

      {customParameters.length > 0 && (
        <div className="custom-parameters-list">
          {customParameters.map(param => (
            <div key={param.id} className="custom-parameter-card">
              <div className="parameter-info">
                <div className="parameter-card-header">
                  <h4>{param.name}</h4>
                  {param.advancedOnly && (
                    <span className="premium-badge">Premium</span>
                  )}
                </div>
                <p className="parameter-description">{param.description}</p>
                <div className="parameter-details">
                  <span className="parameter-detail">
                    <span className="detail-label">Range:</span> 
                    {param.min} to {param.max} {param.unit}
                  </span>
                  <span className="parameter-detail">
                    <span className="detail-label">Default:</span> 
                    {param.defaultValue} {param.unit}
                  </span>
                  <span className="parameter-detail">
                    <span className="detail-label">Step:</span> 
                    {param.step}
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                className="remove-parameter-button"
                onClick={() => onParameterRemoved(param.id)}
                disabled={disabled}
                aria-label={`Remove ${param.name} parameter`}
              >
                <span className="remove-icon">×</span>
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="add-parameter-form">
          <h4>Add New Parameter</h4>
          
          <div className="form-group">
            <label htmlFor="param-name">Parameter Name <span className="required">*</span></label>
            <input
              type="text"
              id="param-name"
              name="name"
              value={newParameter.name}
              onChange={handleInputChange}
              placeholder="e.g., Response Creativity"
              className={errors.name ? 'error' : ''}
              autoFocus
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="param-id">Parameter ID</label>
            <input
              type="text"
              id="param-id"
              name="id"
              value={newParameter.id}
              onChange={handleInputChange}
              placeholder="e.g., response_creativity"
              className={errors.id ? 'error' : ''}
            />
            <div className="helper-text">Leave blank to auto-generate from name</div>
            {errors.id && <div className="error-message">{errors.id}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="param-description">Description</label>
            <textarea
              id="param-description"
              name="description"
              value={newParameter.description}
              onChange={handleInputChange}
              placeholder="Describe what this parameter controls"
              rows={2}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="param-min">Minimum Value <span className="required">*</span></label>
              <input
                type="number"
                id="param-min"
                name="min"
                value={newParameter.min}
                onChange={handleInputChange}
                step="any"
                className={errors.range ? 'error' : ''}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="param-max">Maximum Value <span className="required">*</span></label>
              <input
                type="number"
                id="param-max"
                name="max"
                value={newParameter.max}
                onChange={handleInputChange}
                step="any"
                className={errors.range ? 'error' : ''}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="param-step">Step Size</label>
              <input
                type="number"
                id="param-step"
                name="step"
                value={newParameter.step}
                onChange={handleInputChange}
                step="any"
                min="0.001"
              />
            </div>
          </div>
          {errors.range && <div className="error-message">{errors.range}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="param-default">Default Value <span className="required">*</span></label>
              <input
                type="number"
                id="param-default"
                name="defaultValue"
                value={newParameter.defaultValue}
                onChange={handleInputChange}
                step="any"
                className={errors.defaultValue ? 'error' : ''}
              />
              {errors.defaultValue && <div className="error-message">{errors.defaultValue}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="param-unit">Unit</label>
              <input
                type="text"
                id="param-unit"
                name="unit"
                value={newParameter.unit}
                onChange={handleInputChange}
                placeholder="e.g., ms, tokens"
              />
            </div>
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="advancedOnly"
                checked={newParameter.advancedOnly}
                onChange={handleInputChange}
              />
              <span>Premium Parameter (only available in Complete tier)</span>
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={toggleAddForm}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="save-parameter-button"
              onClick={handleAddParameter}
            >
              Add Parameter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomParameterSection;