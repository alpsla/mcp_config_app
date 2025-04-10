import React from 'react';

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
  disabled?: boolean;
  unit?: string;
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
  disabled = false,
  unit = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const incrementValue = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };
  
  const decrementValue = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };
  
  const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  
  return (
    <div style={{
      marginBottom: '40px',
      backgroundColor: '#FAFAFA',
      padding: '20px',
      borderRadius: '10px',
      opacity: disabled ? 0.7 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <label style={{ fontWeight: 'bold', color: '#333' }}>
          {label}: {displayValue}{unit}
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <button 
            onClick={decrementValue}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px'
            }}
          >-</button>
          <input 
            type="number" 
            value={value} 
            min={min} 
            max={max} 
            step={step}
            onChange={handleInputChange}
            style={{
              width: unit === '' ? '60px' : '80px',
              padding: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          />
          <button 
            onClick={incrementValue}
            style={{
              width: '30px',
              height: '30px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px'
            }}
          >+</button>
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={handleSliderChange}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '5px',
          outline: 'none',
          appearance: 'none',
          background: `linear-gradient(to right, #1976D2 0%, #1976D2 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`,
          cursor: 'pointer'
        }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        fontSize: '14px',
        color: '#666'
      }}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {description && (
        <div style={{
          backgroundColor: '#f1f8ff',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#666',
          marginTop: '15px'
        }}>
          {description}
        </div>
      )}
    </div>
  );
};

export default ParameterSlider;