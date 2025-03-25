import React, { useState, useEffect } from 'react';
import { MCPConfiguration } from '../types';
// Tooltip removed

interface ConfigurationListProps {
  configurations: MCPConfiguration[];
  onSelectConfiguration: (configId: string) => void;
  onDeleteConfiguration: (configId: string) => void;
  onCreateConfiguration: () => void;
}

const ConfigurationList: React.FC<ConfigurationListProps> = ({
  configurations,
  onSelectConfiguration,
  onDeleteConfiguration,
  onCreateConfiguration
}) => {
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);

  // Select the first configuration by default if available
  useEffect(() => {
    if (configurations.length > 0 && !selectedConfigId) {
      setSelectedConfigId(configurations[0].id);
      onSelectConfiguration(configurations[0].id);
    }
  }, [configurations, selectedConfigId, onSelectConfiguration]);

  const handleSelect = (configId: string) => {
    setSelectedConfigId(configId);
    onSelectConfiguration(configId);
  };

  const handleDelete = (e: React.MouseEvent, configId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      onDeleteConfiguration(configId);
      if (selectedConfigId === configId) {
        setSelectedConfigId(null);
      }
    }
  };

  return (
    <div className="configuration-list">
      <div className="list-header">
        <h2>My Configurations</h2>
        <button 
          className="create-config-btn" 
          onClick={onCreateConfiguration}
        >
          Create New
        </button>
      </div>

      {configurations.length === 0 ? (
        <div className="empty-list">
          <p>You don't have any configurations yet.</p>
          <p>Create a new configuration to get started.</p>
        </div>
      ) : (
        <ul className="config-items">
          {configurations.map(config => (
            <li 
              key={config.id} 
              className={`config-item ${selectedConfigId === config.id ? 'selected' : ''}`}
              onClick={() => handleSelect(config.id)}
            >
              <div className="config-item-content">
                <h3>{config.name}</h3>
                <p className="config-description">
                  {config.description || 'No description'}
                </p>
                <div className="config-meta">
                  <span>{config.servers.length} servers</span>
                  <span>Updated: {new Date(config.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={(e) => handleDelete(e, config.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConfigurationList;
