import React from 'react';
import './EmptyState.css';

export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="#0078D4" strokeWidth="4" strokeDasharray="4 4"/>
          <path d="M60 30V60L75 75" stroke="#0078D4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="empty-state-title">Select a Service</h3>
      <p className="empty-state-text">
        Choose a service from the left panel to configure it.
      </p>
    </div>
  );
};
