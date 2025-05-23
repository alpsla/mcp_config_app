import React, { useState } from 'react';
import { MCPConfiguration, MCPServer, MCPServerConfig } from '../types';

interface ConfigurationWizardProps {
  servers: MCPServer[];
  onSaveConfiguration: (config: MCPConfiguration) => void;
  onCancel: () => void;
  initialConfig?: MCPConfiguration;
}

const ConfigurationWizard: React.FC<ConfigurationWizardProps> = ({
  servers,
  onSaveConfiguration,
  onCancel,
  initialConfig
}) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<MCPConfiguration>(
    initialConfig || {
      id: Date.now().toString(),
      name: '',
      description: '',
      servers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig({ ...config, description: e.target.value });
  };

  const handleAddServer = (server: MCPServer) => {
    // Check if server is already in the configuration
    if (config.servers.some(s => s.id === server.id)) {
      return;
    }

    const serverConfig: MCPServerConfig = {
      serverId: server.id,
      args: server.defaultArgs ? [...server.defaultArgs] : [],
      tokenValue: server.requiresToken ? '' : undefined,
      enabled: true
    };

    setConfig({
      ...config,
      servers: [...config.servers, serverConfig as unknown as MCPServer],
      updatedAt: new Date()
    });
  };

  const handleRemoveServer = (serverId: string) => {
    setConfig({
      ...config,
      servers: config.servers.filter(s => s.id !== serverId),
      updatedAt: new Date()
    });
  };

  const handleTokenChange = (serverId: string, tokenValue: string) => {
    setConfig({
      ...config,
      servers: config.servers.map(s => 
        s.id === serverId ? { ...s, tokenValue } : s
      ),
      updatedAt: new Date()
    });
  };

  const handleToggleServer = (serverId: string, enabled: boolean) => {
    setConfig({
      ...config,
      servers: config.servers.map(s => 
        s.id === serverId ? { ...s, enabled } : s
      ),
      updatedAt: new Date()
    });
  };

  const handleSave = () => {
    onSaveConfiguration({
      ...config,
      updatedAt: new Date()
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep1 = () => (
    <div className="wizard-step">
      <h2>Step 1: Basic Information</h2>
      <div className="form-group">
        <label htmlFor="config-name">Configuration Name:</label>
        <input
          id="config-name"
          type="text"
          value={config.name}
          onChange={handleNameChange}
          placeholder="Enter a name for your configuration"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="config-description">Description:</label>
        <textarea
          id="config-description"
          value={config.description}
          onChange={handleDescriptionChange}
          placeholder="Describe what this configuration is for"
          rows={3}
        />
      </div>
      <div className="wizard-buttons">
        <button onClick={onCancel}>Cancel</button>
        <button 
          onClick={nextStep} 
          disabled={!config.name}
          className={!config.name ? 'disabled' : ''}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    // Filter out servers that are already in the configuration
    const availableServers = servers.filter(
      server => !config.servers.some(s => s.id === server.id)
    );

    return (
      <div className="wizard-step">
        <h2>Step 2: Select MCP Servers</h2>
        <div className="selected-servers">
          <h3>Selected Servers:</h3>
          {config.servers.length === 0 ? (
            <p>No servers selected yet. Add servers from the list below.</p>
          ) : (
            <ul className="selected-server-list">
              {config.servers.map(serverConfig => {
                const server = servers.find(s => s.id === serverConfig.id);
                return server ? (
                  <li key={server.id} className="selected-server-item">
                    <div className="selected-server-info">
                      <span className="server-name">{server.name}</span>
                      <button 
                        className="remove-server-btn"
                        onClick={() => handleRemoveServer(server.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ) : null;
              })}
            </ul>
          )}
        </div>
        
        <div className="available-servers">
          <h3>Available Servers:</h3>
          {availableServers.length === 0 ? (
            <p>All available servers have been added to your configuration.</p>
          ) : (
            <ul className="available-server-list">
              {availableServers.map(server => (
                <li key={server.id} className="available-server-item">
                  <div className="available-server-info">
                    <span className="server-name">{server.name}</span>
                    <span className="server-description">{server.description}</span>
                  </div>
                  <button 
                    className="add-server-btn"
                    onClick={() => handleAddServer(server)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="wizard-buttons">
          <button onClick={prevStep}>Previous</button>
          <button 
            onClick={nextStep} 
            disabled={config.servers.length === 0}
            className={config.servers.length === 0 ? 'disabled' : ''}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="wizard-step">
      <h2>Step 3: Configure Servers</h2>
      {config.servers.length === 0 ? (
        <p>No servers to configure. Please go back and add servers.</p>
      ) : (
        <div className="server-configurations">
          {config.servers.map(serverConfig => {
            const server = servers.find(s => s.id === serverConfig.id);
            if (!server) return null;
            
            return (
              <div key={server.id} className="server-config-item">
                <div className="server-config-header">
                  <h3>{server.name}</h3>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={serverConfig.enabled}
                      onChange={(e) => handleToggleServer(server.id, e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                {server.requiresToken && (
                  <div className="token-config">
                    <label htmlFor={`token-${server.id}`}>{server.tokenName}:</label>
                    <input 
                      id={`token-${server.id}`}
                      type="text"
                      value={serverConfig.tokenValue || ''}
                      onChange={(e) => handleTokenChange(server.id, e.target.value)}
                      placeholder={`Enter your ${server.tokenName}`}
                    />
                    {server.tokenDescription && (
                      <p className="token-description">{server.tokenDescription}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      <div className="wizard-buttons">
        <button onClick={prevStep}>Previous</button>
        <button onClick={nextStep}>Next</button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="wizard-step">
      <h2>Step 4: Review & Save</h2>
      <div className="config-summary">
        <h3>Configuration Summary</h3>
        <div className="summary-item">
          <span className="summary-label">Name:</span>
          <span className="summary-value">{config.name}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Description:</span>
          <span className="summary-value">{config.description || 'No description provided'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Servers:</span>
          <span className="summary-value">{config.servers.length} servers configured</span>
        </div>
        
        <div className="server-summary">
          <h4>Configured Servers:</h4>
          <ul className="server-summary-list">
            {config.servers.map(serverConfig => {
              const server = servers.find(s => s.id === serverConfig.id);
              if (!server) return null;
              
              return (
                <li key={server.id} className="server-summary-item">
                  <span className="server-name">{server.name}</span>
                  <span className="server-status">
                    {serverConfig.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {server.requiresToken && (
                    <span className="token-status">
                      {serverConfig.tokenValue ? 'Token provided' : 'Missing token'}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      <div className="wizard-buttons">
        <button onClick={prevStep}>Previous</button>
        <button 
          onClick={handleSave}
          className="save-btn"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );

  return (
    <div className="configuration-wizard">
      <div className="wizard-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Basic Info</div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Select Servers</div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Configure</div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. Review</div>
      </div>
      
      <div className="wizard-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default ConfigurationWizard;
