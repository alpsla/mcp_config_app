import React, { useState, useRef, useEffect } from 'react';
import './ParameterInputField.css';

interface ParameterInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  disabled?: boolean;
  isPassword?: boolean;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  id?: string;
  testId?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Enhanced input field component for parameters that ensures
 * all input events are properly handled and not blocked
 */
const ParameterInputField: React.FC<ParameterInputFieldProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  isPassword = false,
  min,
  max,
  step,
  label,
  description,
  id,
  testId,
  className = '',
  style = {}
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fieldType, setFieldType] = useState(type);
  
  // Set proper field type based on isPassword flag
  useEffect(() => {
    setFieldType(isPassword ? (showPassword ? 'text' : 'password') : type);
  }, [isPassword, showPassword, type]);
  
  // Add event listener to ensure the input field works correctly
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const handleInputChange = (e: Event) => {
        const newValue = (e.target as HTMLInputElement).value;
        onChange(newValue);
      };
      
      // Remove any existing listeners to avoid duplicates
      input.removeEventListener('input', handleInputChange);
      // Add the listener back
      input.addEventListener('input', handleInputChange);
      
      return () => {
        input.removeEventListener('input', handleInputChange);
      };
    }
  }, [onChange]);
  
  // Handle change through React's onChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Generate default styles if none provided
  // Merge custom styles with default ones
  const inputStyles = {
    ...style
  };
  
  return (
    <div className={`parameter-input-wrapper ${className || ''}`}>
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}
      
      <div style={{ display: 'flex', position: 'relative' }}>
        <input
          ref={inputRef}
          id={id}
          data-testid={testId}
          type={fieldType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          style={inputStyles}
          className={isPassword ? 'password-input' : ''}
        />
        
        {isPassword && (
          <button 
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle-button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      
      {description && (
        <p className="input-description">
          {description}
        </p>
      )}
    </div>
  );
};

export default ParameterInputField;