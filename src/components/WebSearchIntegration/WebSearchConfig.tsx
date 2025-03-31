import React, { useState } from 'react';

interface WebSearchConfigProps {
  onConfigurationUpdate: (config: { 
    enabled: boolean; 
    results: number; 
    safeSearch: boolean;
    advancedOptions: Record<string, any>;
  }) => void;
  initialConfig?: { 
    enabled: boolean; 
    results: number; 
    safeSearch: boolean;
    advancedOptions: Record<string, any>;
  };
}

const WebSearchConfig: React.FC<WebSearchConfigProps> = ({
  onConfigurationUpdate,
  initialConfig = { 
    enabled: false, 
    results: 5, 
    safeSearch: true,
    advancedOptions: {}
  }
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(initialConfig.enabled);
  const [resultCount, setResultCount] = useState<number>(initialConfig.results);
  const [safeSearch, setSafeSearch] = useState<boolean>(initialConfig.safeSearch);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    notifyConfigChange(newState, resultCount, safeSearch);
  };

  const handleResultCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setResultCount(count);
    notifyConfigChange(isEnabled, count, safeSearch);
  };

  const handleSafeSearchToggle = () => {
    const newState = !safeSearch;
    setSafeSearch(newState);
    notifyConfigChange(isEnabled, resultCount, newState);
  };

  const notifyConfigChange = (
    enabled: boolean, 
    results: number, 
    safe: boolean
  ) => {
    onConfigurationUpdate({
      enabled,
      results,
      safeSearch: safe,
      advancedOptions: initialConfig.advancedOptions
    });
  };

  return (
    <div className="web-search-config">
      <div className="config-header">
        <h2>Web Search</h2>
        <div className="toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
            />
            <span className="toggle-slider"></span>
          </label>
          <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      {isEnabled && (
        <div className="search-options">
          <div className="option-group">
            <label htmlFor="resultCount">Number of Results:</label>
            <input
              id="resultCount"
              type="range"
              min="1"
              max="10"
              value={resultCount}
              onChange={handleResultCountChange}
            />
            <span className="range-value">{resultCount}</span>
            <div className="option-description">
              <p>Controls how many search results Claude will retrieve.</p>
              <p>Higher values provide more comprehensive information but may slow down responses.</p>
            </div>
          </div>

          <div className="option-group">
            <label htmlFor="safeSearch">Safe Search:</label>
            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  id="safeSearch"
                  type="checkbox"
                  checked={safeSearch}
                  onChange={handleSafeSearchToggle}
                />
                <span className="toggle-slider"></span>
              </label>
              <span>{safeSearch ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="option-description">
              <p>Filters out explicit content from search results.</p>
              <p>Recommended for all users.</p>
            </div>
          </div>

          <div className="advanced-settings">
            <button 
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
            
            {showAdvanced && (
              <div className="advanced-options">
                <p className="coming-soon">Advanced settings will be available in a future update.</p>
              </div>
            )}
          </div>

          <div className="platform-compatibility">
            <h4>Platform Compatibility</h4>
            <div className="platform-indicators">
              <div className="platform-indicator">
                <span className="platform-icon windows">🖥️</span>
                <span className="platform-name">Windows</span>
                <span className="compatibility-status">✓</span>
              </div>
              <div className="platform-indicator">
                <span className="platform-icon macos">🖥️</span>
                <span className="platform-name">macOS</span>
                <span className="compatibility-status">✓</span>
              </div>
              <div className="platform-indicator">
                <span className="platform-icon linux">🖥️</span>
                <span className="platform-name">Linux</span>
                <span className="compatibility-status">✓</span>
              </div>
            </div>
          </div>

          <div className="feature-description">
            <h4>About Web Search</h4>
            <p>Web Search enables Claude to search the internet for up-to-date information.</p>
            <p>This is particularly useful for:</p>
            <ul>
              <li>Recent events or news</li>
              <li>Current data and statistics</li>
              <li>Research on topics that evolve rapidly</li>
              <li>Information published after Claude's knowledge cutoff</li>
            </ul>
            <p className="usage-note">
              <strong>Note:</strong> Web search requests consume additional computing resources and may slightly increase response times.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSearchConfig;