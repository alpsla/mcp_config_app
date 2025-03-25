import React from 'react';
import { WebSearchConfig as WebSearchConfigType } from '../../../types';
import './ServerConfigs.css';

interface WebSearchConfigProps {
  config: WebSearchConfigType;
  onChange: (config: WebSearchConfigType) => void;
}

export const WebSearchConfig: React.FC<WebSearchConfigProps> = ({ 
  config, 
  onChange 
}) => {
  const handleToggleEnabled = () => {
    onChange({
      ...config,
      enabled: !config.enabled
    });
  };

  const handleResultCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...config,
      resultCount: parseInt(e.target.value, 10)
    });
  };

  const handleSafeSearchToggle = () => {
    onChange({
      ...config,
      safeSearch: !config.safeSearch
    });
  };

  return (
    <div className="server-config-container">
      <div className="server-config-header">
        <h2 className="server-config-title">Web Search Configuration</h2>
        <p className="server-config-description">
          Configure web search integration settings to enhance Claude's capabilities.
        </p>
      </div>

      <div className="form-checkbox">
        <input 
          type="checkbox"
          id="web-search-enabled"
          checked={config.enabled}
          onChange={handleToggleEnabled}
        />
        <label htmlFor="web-search-enabled">Enable Web Search</label>
      </div>

      {config.enabled && (
        <>
          <div className="form-group">
            <label htmlFor="result-count">Maximum Results</label>
            <select 
              id="result-count"
              className="form-control"
              value={config.resultCount}
              onChange={handleResultCountChange}
            >
              <option value="3">3 results</option>
              <option value="5">5 results</option>
              <option value="10">10 results</option>
              <option value="15">15 results</option>
            </select>
            <div className="help-text">
              The maximum number of search results to return per query.
            </div>
          </div>

          <div className="form-checkbox">
            <input 
              type="checkbox"
              id="safe-search"
              checked={config.safeSearch}
              onChange={handleSafeSearchToggle}
            />
            <label htmlFor="safe-search">Enable Safe Search</label>
            <div className="help-text">
              Filter out potentially explicit or inappropriate content from search results.
            </div>
          </div>

          <div className="platform-compatibility">
            <span className="platform-compatibility-icon">ℹ️</span>
            <span>Web Search is compatible with both desktop and web environments.</span>
          </div>
        </>
      )}
    </div>
  );
};
