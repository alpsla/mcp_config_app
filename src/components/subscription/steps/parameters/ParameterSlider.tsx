import React from 'react';
import './ParameterSlider.css';

interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  leftLabel?: string;
  rightLabel?: string;
  description?: string;
  unit?: string;
  disabled?: boolean;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  leftLabel = '',
  rightLabel = '',
  description = '',
  unit = '',
  disabled = false
}) => {
  // Calculate the fill percentage for visual indication
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Handle change with numeric validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };
  
  // Format the display value
  const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  
  return (
    <div className={`parameter-container ${disabled ? 'disabled' : ''}`}>
      <div className="parameter-header">
        <div className="parameter-label">{label}</div>
        <div className="parameter-value">{displayValue}{unit}</div>
      </div>
      
      <div className="slider-container">
        {/* Track with fill */}
        <div className="slider-track">
          <div 
            className="slider-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="parameter-slider"
          disabled={disabled}
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      
      {/* Labels for scale endpoints */}
      <div className="slider-labels">
        <div className="left-label">{leftLabel}</div>
        <div className="right-label">{rightLabel}</div>
      </div>
      
      {/* Description if provided */}
      {description && (
        <div className="parameter-description">
          {description}
        </div>
      )}
    </div>
  );
};

export default ParameterSlider;