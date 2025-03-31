import React, { useState, useEffect } from 'react';
import './ConfigComponents.css';

const WebSearchConfig = ({ config = {}, updateConfig }) => {
  // Initialize state with values from props or defaults
  const [resultsCount, setResultsCount] = useState(config.resultsCount || 3);
  const [safeSearch, setSafeSearch] = useState(config.safeSearch !== false); // Default to true
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Update parent component when values change
  useEffect(() => {
    updateConfig({
      resultsCount,
      safeSearch
    });
  }, [resultsCount, safeSearch, updateConfig]);

  // Handle slider change
  const handleResultsCountChange = (e) => {
    setResultsCount(parseInt(e.target.value, 10));
  };
  
  // Handle toggle change
  const handleSafeSearchChange = (e) => {
    setSafeSearch(e.target.checked);
  };

  return (
    <div className="config-component">
      <h2 className="config-component-title">Web Search Configuration</h2>
      <p className="config-component-description">
        Configure how Claude interacts with web search results to provide up-to-date information.
      </p>
      
      <div className="config-form">
        <div className="config-form-group">
          <label className="config-form-label">
            Number of Search Results
            <span className="config-value-display">{resultsCount}</span>
          </label>
          <div className="config-slider-container">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={resultsCount} 
              onChange={handleResultsCountChange}
              className="config-slider"
            />
            <div className="config-slider-labels">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          <p className="config-form-helper">
            Controls how many search results Claude can access. More results provide broader information but may increase response time.
          </p>
        </div>
        
        <div className="config-form-group config-toggle-group">
          <div className="config-toggle-label-container">
            <label className="config-form-label" htmlFor="safeSearch">
              Safe Search
            </label>
            <div className="config-toggle-container">
              <input 
                type="checkbox" 
                id="safeSearch" 
                checked={safeSearch} 
                onChange={handleSafeSearchChange}
              />
              <label htmlFor="safeSearch" className="toggle-switch"></label>
            </div>
          </div>
          <p className="config-form-helper">
            Filter out explicit content from search results. Recommended for most use cases.
          </p>
        </div>
        
        <div className="config-form-group">
          <button 
            className="config-advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {showAdvanced && (
            <div className="config-advanced-options">
              <div className="config-form-group config-coming-soon">
                <label className="config-form-label">
                  Custom Search Engines
                </label>
                <div className="config-coming-soon-badge">Coming Soon</div>
                <p className="config-form-helper">
                  Select preferred search engines and configure search priorities.
                </p>
              </div>
              
              <div className="config-form-group config-coming-soon">
                <label className="config-form-label">
                  Content Filters
                </label>
                <div className="config-coming-soon-badge">Coming Soon</div>
                <p className="config-form-helper">
                  Fine-tune content filtering settings beyond basic safe search.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="config-component-footer">
        <div className="config-status">
          <div className="config-status-icon config-status-success"></div>
          <span>Web Search is properly configured</span>
        </div>
      </div>
    </div>
  );
};

export default WebSearchConfig;