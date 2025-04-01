import React, { useState, useEffect } from 'react';

/**
 * Redesigned WebSearchConfiguration component 
 * Uses a more reliable numeric selector instead of a slider
 */
const WebSearchConfig = ({ 
  config = { resultsCount: 5, safeSearch: true, useTrustedSources: false },
  updateConfig 
}) => {
  const [resultsCount, setResultsCount] = useState(config.resultsCount || 5);
  const [safeSearch, setSafeSearch] = useState(config.safeSearch !== false);
  const [useTrustedSources, setUseTrustedSources] = useState(config.useTrustedSources || false);
  
  // Update parent component when config changes
  useEffect(() => {
    updateConfig({
      ...config,
      resultsCount,
      safeSearch,
      useTrustedSources
    });
  }, [resultsCount, safeSearch, useTrustedSources]);
  
  // Handle results count change
  const handleResultsCountChange = (value) => {
    setResultsCount(value);
  };
  
  // Toggle handlers
  const handleSafeSearchToggle = () => {
    setSafeSearch(!safeSearch);
  };
  
  const handleTrustedSourcesToggle = () => {
    setUseTrustedSources(!useTrustedSources);
  };
  
  // Number selector component
  const NumberSelector = ({ value, onChange, min, max }) => {
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    
    return (
      <div className="number-selector">
        <div className="selector-row">
          {numbers.map(num => (
            <button
              key={num}
              className={`number-button ${num === value ? 'selected' : ''}`}
              onClick={() => onChange(num)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  // Toggle component
  const Toggle = ({ checked, onChange, label }) => (
    <div className="toggle-control">
      <button 
        className={`toggle-button ${checked ? 'active' : ''}`}
        onClick={onChange}
        aria-pressed={checked}
      >
        <span className="toggle-track">
          <span className="toggle-thumb"></span>
        </span>
        <span className="toggle-label">{label}</span>
      </button>
    </div>
  );
  
  return (
    <div className="web-search-configuration">
      <div className="configuration-header">
        <h3>Web Search Configuration</h3>
        <p>Configure how Claude interacts with web search results to provide up-to-date information.</p>
      </div>

      <div className="configuration-section">
        <div className="setting-group">
          <div className="setting-header">
            <h4>Number of Search Results</h4>
            <div className="setting-value">{resultsCount}</div>
          </div>
          <p className="setting-description">Controls how many search results Claude can access. More results provide broader information but may increase response time.</p>
          
          <NumberSelector
            value={resultsCount}
            onChange={handleResultsCountChange}
            min={1}
            max={10}
          />
        </div>

        <div className="setting-group">
          <div className="setting-header">
            <h4>Safe Search</h4>
          </div>
          <p className="setting-description">Filter out explicit content from search results. Recommended for most use cases.</p>
          
          <Toggle
            checked={safeSearch}
            onChange={handleSafeSearchToggle}
            label={safeSearch ? 'Enabled' : 'Disabled'}
          />
        </div>

        <div className="setting-group">
          <div className="setting-header">
            <h4>Trusted Sources</h4>
          </div>
          <p className="setting-description">Prioritize authoritative sources in search results.</p>
          
          <Toggle
            checked={useTrustedSources}
            onChange={handleTrustedSourcesToggle}
            label={useTrustedSources ? 'Enabled' : 'Disabled'}
          />
        </div>
      </div>

      <div className="advanced-section">
        <div className="advanced-header">
          <h4>Advanced Settings</h4>
        </div>
        <p className="advanced-description">Additional configuration options will be available in future updates.</p>
      </div>

      <div className="tools-section">
        <h4>Tools that will be available:</h4>
        <div className="tools-list">
          <div className="tool-item">
            <span className="tool-icon">⚙️</span> fetch
          </div>
          <div className="tool-item">
            <span className="tool-icon">⚙️</span> web_search
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .web-search-configuration {
          padding: 1rem;
          color: #333;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .configuration-header {
          margin-bottom: 1.5rem;
        }
        
        .configuration-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }
        
        .configuration-header p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
        }
        
        .configuration-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .setting-group {
          border-bottom: 1px solid #eee;
          padding-bottom: 1.5rem;
        }
        
        .setting-group:last-child {
          border-bottom: none;
        }
        
        .setting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .setting-header h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        
        .setting-value {
          background-color: #3b82f6;
          color: white;
          font-weight: bold;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
        }
        
        .setting-description {
          margin: 0 0 1rem;
          font-size: 0.875rem;
          color: #666;
          line-height: 1.5;
        }
        
        /* Number Selector */
        .number-selector {
          margin: 1rem 0;
        }
        
        .selector-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .number-button {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          background-color: white;
          color: #333;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .number-button:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }
        
        .number-button.selected {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        /* Toggle Control */
        .toggle-control {
          margin: 1rem 0;
        }
        
        .toggle-button {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          gap: 0.75rem;
        }
        
        .toggle-track {
          position: relative;
          display: inline-block;
          width: 3.5rem;
          height: 1.75rem;
          background-color: #e5e7eb;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }
        
        .toggle-button.active .toggle-track {
          background-color: #3b82f6;
        }
        
        .toggle-thumb {
          position: absolute;
          top: 0.2rem;
          left: 0.2rem;
          width: 1.35rem;
          height: 1.35rem;
          background-color: white;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .toggle-button.active .toggle-thumb {
          left: calc(100% - 1.55rem);
        }
        
        .toggle-label {
          font-size: 0.95rem;
          color: #333;
        }
        
        /* Advanced and Tools Sections */
        .advanced-section,
        .tools-section {
          background-color: #f9fafb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .advanced-header h4,
        .tools-section h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }
        
        .advanced-description {
          font-size: 0.875rem;
          color: #666;
          margin: 0;
        }
        
        .tools-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        
        .tool-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background-color: white;
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
          font-size: 0.875rem;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default WebSearchConfig;