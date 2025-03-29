import React from 'react';
import './EmptyState.css';

const EmptyState = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="empty-state">
      <div className="empty-illustration">
        {/* SVG illustration */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="60" fill="#F5F7FA" />
          <path d="M40 60H80M60 40V80" stroke="#0066CC" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="empty-message">{message}</p>
      
      <div className="preset-options">
        <div className="preset-option">
          <h4>Free Configuration</h4>
          <p>File System + Web Search</p>
          <button className="preset-button" onClick={() => onButtonClick('free')}>
            Create Free Config
          </button>
        </div>
        
        <div className="preset-option basic">
          <h4>Basic Configuration</h4>
          <p>Free + 3 Premium Models</p>
          <button className="preset-button basic" onClick={() => onButtonClick('basic')}>
            Create Basic Config
          </button>
        </div>
        
        <div className="preset-option premium">
          <h4>Complete Configuration</h4>
          <p>Free + 10 Premium Models</p>
          <button className="preset-button premium" onClick={() => onButtonClick('complete')}>
            Create Complete Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;