import React from 'react';
import WebSearchConfig from '../../../components/configuration/WebSearchConfig';
import FileSystemConfig from '../../../components/configuration/FileSystemConfig';
import HuggingFaceConfig from '../../../components/configuration/HuggingFaceConfig';

const ConfigurationExportStep = ({
  services,
  activeService,
  selectService,
  getServiceStatus,
  getStatusClass,
  updateServiceConfig,
  saveServiceConfiguration,
  isServiceConfigValid,
  configName,
  setConfigName,
  validationStatus,
  deploymentStatus,
  onValidate,
  onCopyToClipboard,
  onDeploy,
  onBack
}) => {
  return (
    <div className="step-content configuration-export-step">
      <h2>Configure & Export</h2>
      <p className="step-description">
        Configure the details for each service and export your configuration.
      </p>
      
      <div className="configuration-layout">
        <div className="services-list">
          <h3>Enabled Services</h3>
          
          {services.filter(service => service.enabled).map(service => (
            <div 
              key={service.id}
              className={`service-card ${activeService === service.id ? 'selected' : ''} ${service.enabled ? 'enabled' : ''}`}
              onClick={() => selectService(service.id)}
            >
              <div className="card-header">
                <div className="service-info">
                  <h3>{service.name}</h3>
                  <span className={`status-badge ${getStatusClass(service)}`}>
                    {getServiceStatus(service)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="configuration-panel">
          {!activeService && (
            <div className="empty-state">
              <h3>Select a Service to Configure</h3>
              <p>Click on one of the services on the left to begin configuration.</p>
            </div>
          )}
          
          {activeService === 'webSearch' && (
            <div className="web-search-panel">
              <WebSearchConfig
                config={services.find(s => s.id === 'webSearch').config}
                updateConfig={(newConfig) => updateServiceConfig('webSearch', newConfig)}
              />
              
              <div className="action-buttons">
                <button 
                  className="btn-secondary" 
                  onClick={() => selectService(null)}
                >
                  Cancel
                </button>
                
                <button 
                  className={`btn-primary ${isServiceConfigValid('webSearch') ? '' : 'disabled'}`}
                  onClick={() => saveServiceConfiguration('webSearch')}
                  disabled={!isServiceConfigValid('webSearch')}
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
          
          {activeService === 'fileSystem' && (
            <div className="file-system-panel">
              <FileSystemConfig
                config={services.find(s => s.id === 'fileSystem').config}
                updateConfig={(newConfig) => updateServiceConfig('fileSystem', newConfig)}
              />
              
              <div className="action-buttons">
                <button 
                  className="btn-secondary" 
                  onClick={() => selectService(null)}
                >
                  Cancel
                </button>
                
                <button 
                  className={`btn-primary ${isServiceConfigValid('fileSystem') ? '' : 'disabled'}`}
                  onClick={() => saveServiceConfiguration('fileSystem')}
                  disabled={!isServiceConfigValid('fileSystem')}
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
          
          {activeService === 'huggingFace' && (
            <div className="huggingface-panel">
              <HuggingFaceConfig
                config={services.find(s => s.id === 'huggingFace').config}
                updateConfig={(newConfig) => updateServiceConfig('huggingFace', newConfig)}
              />
              
              <div className="action-buttons">
                <button 
                  className="btn-secondary" 
                  onClick={() => selectService(null)}
                >
                  Cancel
                </button>
                
                <button 
                  className={`btn-primary ${isServiceConfigValid('huggingFace') ? '' : 'disabled'}`}
                  onClick={() => saveServiceConfiguration('huggingFace')}
                  disabled={!isServiceConfigValid('huggingFace')}
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="export-section">
        <h3>Export Configuration</h3>
        
        <div className="configuration-name">
          <label htmlFor="configName">Configuration Name:</label>
          <input 
            type="text" 
            id="configName" 
            value={configName} 
            onChange={(e) => setConfigName(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="export-actions">
          <button 
            className="btn-secondary export-button"
            onClick={onValidate}
            disabled={!services.some(s => s.enabled && s.configured)}
          >
            {validationStatus.isValidating ? 'Validating...' : 'Validate Configuration'}
          </button>
          
          <button 
            className="btn-secondary export-button"
            onClick={onCopyToClipboard}
            disabled={!validationStatus.isValid}
          >
            Copy to Clipboard
          </button>
          
          <button 
            className="btn-primary export-button"
            onClick={onDeploy}
            disabled={!validationStatus.isValid || deploymentStatus.isDeploying || deploymentStatus.isDeployed}
          >
            {deploymentStatus.isDeploying ? 'Deploying...' : deploymentStatus.isDeployed ? 'Deployed!' : 'Deploy Configuration'}
          </button>
        </div>
        
        {validationStatus.errors.length > 0 && (
          <div className="validation-errors">
            <h4>Validation Errors</h4>
            <ul>
              {validationStatus.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {validationStatus.isValid && (
          <div className="validation-success">
            <h4>Validation Successful</h4>
            <p>Your configuration has been validated and is ready to deploy.</p>
          </div>
        )}
      </div>
      
      <div className="step-actions">
        <button 
          className="btn-secondary"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ConfigurationExportStep;