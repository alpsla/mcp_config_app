import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { UserConfigService } from '../services/userConfigService';
import './ConfigurationDashboard.css';
import { ConfigurationManager, MCPConfiguration } from '../services/configurationManager';

interface ConfigurationDashboardProps {
  onNewConfiguration: () => void;
  onEditConfiguration: (config: MCPConfiguration) => void;
}

const ConfigurationDashboard: React.FC<ConfigurationDashboardProps> = ({
  onNewConfiguration,
  onEditConfiguration
}) => {
  const { authState } = useAuth();
  const [configurations, setConfigurations] = useState<MCPConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load configurations on mount
  useEffect(() => {
    const loadConfigurations = async () => {
      if (!authState.user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const configs = await UserConfigService.getUserConfigurations(authState.user.id);
        
        // Convert to MCPConfiguration format
        const mappedConfigs = configs.map(config => ({
          ...ConfigurationManager.createConfiguration(authState.user?.id || 'anonymous'),
          id: config.id,
          name: config.name,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
          status: config.status,
          ...config.configData
        }));
        
        setConfigurations(mappedConfigs);
        setError(null);
      } catch (error) {
        console.error('Error loading configurations:', error);
        setError('Failed to load your configurations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadConfigurations();
  }, [authState.user]);

  // Handle delete configuration
  const handleDeleteConfiguration = async (configId: string) => {
    if (!authState.user) return;
    
    try {
      const success = await UserConfigService.deleteConfiguration(authState.user.id, configId);
      
      if (success) {
        // Remove from the list
        setConfigurations(configurations.filter(config => config.id !== configId));
      }
    } catch (error) {
      console.error('Error deleting configuration:', error);
      setError('Failed to delete configuration. Please try again.');
    }
  };

  // Handle duplicate configuration
  const handleDuplicateConfiguration = async (config: MCPConfiguration) => {
    if (!authState.user) return;
    
    try {
      // Create a new configuration based on the existing one
      const duplicatedConfig = {
        ...config,
        id: undefined,
        name: `${config.name} (Copy)`,
        createdAt: undefined,
        updatedAt: undefined
      };
      
      // Save the duplicated configuration
      const savedConfig = await ConfigurationManager.saveConfiguration(duplicatedConfig);
      
      // Add to the list
      setConfigurations([...configurations, savedConfig]);
    } catch (error) {
      console.error('Error duplicating configuration:', error);
      setError('Failed to duplicate configuration. Please try again.');
    }
  };

  // Render a single configuration card
  const renderConfigurationCard = (config: MCPConfiguration) => {
    // Get enabled services
    const enabledServices = Object.entries(config.services)
      .filter(([_, service]) => service.enabled && service.configured)
      .map(([id]) => id);
    
    // Get configured models
    const configuredModels = config.models.filter(model => model.configured);
    
    return (
      <div className="configuration-card" key={config.id}>
        <div className="configuration-header">
          <h3 className="configuration-name">{config.name}</h3>
          <span className={`status-badge ${config.status}`}>
            {config.status.charAt(0).toUpperCase() + config.status.slice(1)}
          </span>
        </div>
        
        <div className="configuration-details">
          <div className="configuration-services">
            <h4>Enabled Services</h4>
            {enabledServices.length > 0 ? (
              <ul className="service-list">
                {enabledServices.includes('fileSystem') && (
                  <li className="service-item">File System</li>
                )}
                {enabledServices.includes('webSearch') && (
                  <li className="service-item">Web Search</li>
                )}
                {enabledServices.includes('huggingFace') && (
                  <li className="service-item">Hugging Face</li>
                )}
              </ul>
            ) : (
              <p className="no-services">No services enabled</p>
            )}
          </div>
          
          {enabledServices.includes('huggingFace') && configuredModels.length > 0 && (
            <div className="configuration-models">
              <h4>Configured Models</h4>
              <ul className="model-list">
                {configuredModels.slice(0, 3).map(model => (
                  <li key={model.id} className="model-item">{model.name}</li>
                ))}
                {configuredModels.length > 3 && (
                  <li className="model-item more-models">
                    +{configuredModels.length - 3} more models
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div className="update-info">
          <span className="timestamp">
            Updated {new Date(config.updatedAt || '').toLocaleDateString()}
          </span>
        </div>
        
        <div className="configuration-actions">
          <button 
            className="edit-button"
            onClick={() => onEditConfiguration(config)}
          >
            Edit
          </button>
          
          <button 
            className="duplicate-button"
            onClick={() => handleDuplicateConfiguration(config)}
          >
            Duplicate
          </button>
          
          <button 
            className="delete-button"
            onClick={() => handleDeleteConfiguration(config.id || '')}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  // Render welcome message for new users
  const renderWelcomeMessage = () => {
    return (
      <div className="welcome-container">
        <h2>Welcome to the MCP Configuration Tool</h2>
        <p>
          This tool helps you configure Model Control Protocol (MCP) servers to extend
          Claude's capabilities with additional services and models.
        </p>
        
        <div className="getting-started">
          <h3>Getting Started</h3>
          <p>
            Create your first configuration to connect Claude with file access, web search,
            or Hugging Face models. Select one of the available plans to get started.
          </p>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your configurations...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // No configurations yet
  if (configurations.length === 0) {
    return renderWelcomeMessage();
  }

  // Render the dashboard with configurations
  return (
    <div className="configuration-dashboard">
      <div className="dashboard-header">
        <h2>Your Configurations</h2>
      </div>
      
      {error && (
        <div className="error-banner">
          {error}
          <button className="close-error" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="configurations-grid">
        {configurations.map(renderConfigurationCard)}
      </div>
    </div>
  );
};

export default ConfigurationDashboard;
