import React, { useState, useEffect } from 'react';
import { Toggle } from '../ui';

/**
 * WebSearchConfiguration component for configuring web search settings
 * 
 * @param {Object} props
 * @param {Object} props.config - Current web search configuration
 * @param {Function} props.updateConfig - Callback to update the configuration
 */
const WebSearchConfig = ({ 
  config = { resultsCount: 5, safeSearch: true, useTrustedSources: false },
  updateConfig 
}) => {
  const [resultsCount, setResultsCount] = useState(config.resultsCount || 5);
  const [safeSearch, setSafeSearch] = useState(config.safeSearch !== false);
  const [useTrustedSources, setUseTrustedSources] = useState(config.useTrustedSources || false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
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
  
  // Handle safe search toggle
  const handleSafeSearchToggle = (checked) => {
    setSafeSearch(checked);
  };
  
  // Handle trusted sources toggle
  const handleTrustedSourcesToggle = (checked) => {
    setUseTrustedSources(checked);
  };
  
  return (
    <div className="web-search-configuration">
      <div className="web-search-header">
        <h3>Web Search</h3>
        <p>Allow Claude to search the internet for up-to-date information.</p>
      </div>

      <div className="search-settings">
        <div className="setting-item">
          <h4>Number of Search Results</h4>
          <p>Specify how many search results to include in Claude's responses.</p>
          
          <div className="results-dropdown-container" style={{ marginTop: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select 
                value={resultsCount} 
                onChange={(e) => handleResultsCountChange(parseInt(e.target.value))}
                style={{
                  appearance: 'none',
                  padding: '8px 32px 8px 16px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '16px',
                  minWidth: '80px',
                  textAlign: 'center'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => (
                  <option key={number} value={number}>{number}</option>
                ))}
              </select>
              <span style={{ marginLeft: '10px', fontSize: '15px' }}>search results</span>
            </div>
            
            <div className="labels-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>1</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>5</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>10</span>
            </div>
          </div>
        </div>

        <div className="setting-item">
          <h4>Safe Search</h4>
          <p>Filter out adult and explicit content from search results.</p>
          
          <Toggle
            checked={safeSearch}
            onChange={handleSafeSearchToggle}
            label={safeSearch ? 'Enabled' : 'Disabled'}
          />
        </div>

        <div className="setting-item">
          <h4>Trusted Sources</h4>
          <p>Prioritize authoritative sources in search results.</p>
          
          <Toggle
            checked={useTrustedSources}
            onChange={handleTrustedSourcesToggle}
            label={useTrustedSources ? 'Enabled' : 'Disabled'}
          />
        </div>
      </div>

      <div className="advanced-settings">
        <h4>Advanced Settings</h4>
        <p>Additional configuration options for web search.</p>
        
        <div className="advanced-description">
          <p>More configuration options will be available in future updates.</p>
        </div>
      </div>

      <div className="tools-list">
        <h4>Tools that will be available:</h4>
        <div className="tools-grid">
          {[
            'fetch',
            'web_search'
          ].map(tool => (
            <div key={tool} className="tool-item">
              <span className="tool-icon">⚙️</span> {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSearchConfig;