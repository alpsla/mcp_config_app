import React from 'react';
import './ConfigureButton.css';

/**
 * Button component to launch the new MCP server configuration page
 */
const ConfigureButton = ({ onClick, className = '' }) => {
  return (
    <button 
      className={`configure-button ${className}`}
      onClick={onClick}
      aria-label="Configure new MCP server"
    >
      <div className="configure-button-content">
        <div className="configure-button-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <div className="configure-button-text">
          <h3>Configure New MCP Server</h3>
          <p>Connect Claude to web search, file system, or Hugging Face models</p>
        </div>
      </div>
    </button>
  );
};

export default ConfigureButton;