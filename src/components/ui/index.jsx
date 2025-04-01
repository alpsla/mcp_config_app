import React from 'react';
import '../../styles/SliderStyles.css';

export const Button = ({ children, className, disabled, onClick }) => (
  <button 
    className={className} 
    disabled={disabled} 
    onClick={onClick}
  >
    {children}
  </button>
);

export const Input = ({ type, value, onChange, placeholder, className, disabled }) => (
  <input
    type={type || 'text'}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
    disabled={disabled}
  />
);

export const Alert = ({ type, message, onClose, action }) => (
  <div className={`alert alert-${type}`}>
    <span>{message}</span>
    {action && (
      <button onClick={action.onClick}>{action.label}</button>
    )}
    {onClose && (
      <button className="alert-close" onClick={onClose}>×</button>
    )}
  </div>
);

export const Toggle = ({ checked, onChange, label, disabled }) => (
  <div className="toggle-wrapper">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
    {label && <span>{label}</span>}
  </div>
);

export const Card = ({ children, className }) => (
  <div className={`card ${className || ''}`}>
    {children}
  </div>
);

export const Badge = ({ children, type }) => (
  <span className={`badge badge-${type || 'default'}`}>
    {children}
  </span>
);

export const Modal = ({ isOpen, onClose, title, children }) => (
  isOpen ? (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  ) : null
);

export const Slider = ({ min, max, value, onChange, marks }) => {
  // Calculate the percentage of the slider value
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="slider-container">
      <div className="slider-value">{value}</div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
        }}
        className="styled-slider"
      />
      {marks && (
        <div className="slider-marks">
          {Object.entries(marks).map(([markValue, label]) => (
            <span 
              key={markValue} 
              className="slider-mark"
              style={{ left: `${(parseInt(markValue) - min) / (max - min) * 100}%` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};