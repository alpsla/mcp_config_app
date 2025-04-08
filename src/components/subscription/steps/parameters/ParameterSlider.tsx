import React, { useState, useEffect } from 'react';
import '../../SubscriptionFlow.css';
import '../ParametersStep.css';

interface ParameterDefinition {
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

interface ParameterSliderProps {
  parameter: ParameterDefinition;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  parameter,
  value,
  onChange,
  disabled
}) => {
  // Local state for input value to handle transitions
  const [localValue, setLocalValue] = useState<string>(value.toString());
  const [isChanging, setIsChanging] = useState<boolean>(false);

  // Update local value when prop value changes
  useEffect(() => {
    if (!isChanging) {
      setLocalValue(value.toString());
    }
  }, [value, isChanging]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
    setLocalValue(newValue.toString());
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsChanging(true);
  };

  // Handle input blur
  const handleInputBlur = () => {
    setIsChanging(false);
    let newValue = parseFloat(localValue);
    
    // Validate and constrain the value
    if (isNaN(newValue)) {
      newValue = parameter.defaultValue;
    } else {
      if (newValue < parameter.min) newValue = parameter.min;
      if (newValue > parameter.max) newValue = parameter.max;
    }
    
    onChange(newValue);
    setLocalValue(newValue.toString());
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  // Calculate gradient color based on value position
  const percentage = ((value - parameter.min) / (parameter.max - parameter.min)) * 100;
  const gradientStyle = {
    background: `linear-gradient(to right, #1976d2 ${percentage}%, #e0e0e0 ${percentage}%)`
  };

  // Handle value increment/decrement
  const incrementValue = () => {
    const newValue = Math.min(parameter.max, value + parameter.step);
    onChange(newValue);
  };

  const decrementValue = () => {
    const newValue = Math.max(parameter.min, value - parameter.step);
    onChange(newValue);
  };

  return (
    <div className="parameter-slider-container">
      <div className="slider-wrapper">
        <input
          type="range"
          min={parameter.min}
          max={parameter.max}
          step={parameter.step}
          value={value}
          onChange={handleSliderChange}
          disabled={disabled}
          className={disabled ? 'disabled' : ''}
          style={!disabled ? gradientStyle : {}}
        />
        
        <div className="slider-labels">
          <span className="min-label">{parameter.min}</span>
          <span className="max-label">{parameter.max}</span>
        </div>
      </div>
      
      <div className="parameter-value-controls">
        <button 
          type="button"
          className="value-control-button"
          onClick={decrementValue}
          disabled={disabled || value <= parameter.min}
          aria-label={`Decrease ${parameter.name}`}
        >
          –
        </button>
        
        <div className="parameter-value-input">
          <input
            type="text"
            min={parameter.min}
            max={parameter.max}
            step={parameter.step}
            value={localValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className={disabled ? 'disabled' : ''}
            aria-label={`${parameter.name} value`}
          />
          {parameter.unit && (
            <span className="parameter-unit">{parameter.unit}</span>
          )}
        </div>
        
        <button 
          type="button"
          className="value-control-button"
          onClick={incrementValue}
          disabled={disabled || value >= parameter.max}
          aria-label={`Increase ${parameter.name}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ParameterSlider;
