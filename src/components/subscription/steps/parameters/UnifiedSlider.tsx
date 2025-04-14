import React from 'react';
import './unified-slider.css';

interface UnifiedSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  ariaLabel: string;
}

/**
 * UnifiedSlider Component
 * A consistent slider implementation for use across both main parameters
 * and advanced parameters sections.
 */
const UnifiedSlider: React.FC<UnifiedSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  disabled = false,
  ariaLabel
}) => {
  // Calculate the fill percentage for visual indication
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Handle change with numeric validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };
  
  return (
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
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
    </div>
  );
};

export default UnifiedSlider;
