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
      <button className="action-button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyState;