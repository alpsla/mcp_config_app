import React from 'react';
import { MCPServer, MCPConfiguration } from '../types';

interface ServerListProps {
  servers: MCPServer[];
  configurations: MCPConfiguration[];
  onAddToConfig: (serverId: string, configId: string) => void;
  onCreateConfig: (name: string, callback: (configId: string) => void) => void;
}

const ServerList: React.FC<ServerListProps> = ({ 
  servers, 
  configurations, 
  onAddToConfig, 
  onCreateConfig 
}) => {
  if (servers.length === 0) {
    return (
      <div className="server-list-empty">
        <p>No servers match your search criteria.</p>
      </div>
    );
  }

  const handleAddToConfig = (server: MCPServer, configId: string) => {
    if (configId === 'new') {
      const configName = prompt('Enter a name for the new configuration:');
      if (configName) {
        onCreateConfig(configName, (newConfigId) => {
          onAddToConfig(server.id, newConfigId);
        });
      }
    } else {
      onAddToConfig(server.id, configId);
    }
  };

  return (
    <div className="server-list">
      <h2>Available MCP Servers ({servers.length})</h2>
      <div className="server-cards">
        {servers.map(server => (
          <div key={server.id} className="server-card">
            <div className="server-header">
              <h3>{server.name}</h3>
              <div className="server-rating">
                Rating: {server.rating.toFixed(1)}
              </div>
            </div>
            <p className="server-description">{server.description}</p>
            <div className="server-categories">
              {server.categories.map(category => (
                <span key={category} className="category-tag">{category}</span>
              ))}
            </div>
            <div className="server-details">
              <p>Downloads: {server.downloads}</p>
              <p>Version: {server.version}</p>
              <p>Author: {server.author}</p>
              {server.requiresToken && (
                <p className="token-required">Requires Token: {server.tokenName}</p>
              )}
            </div>
            <div className="server-actions">
              <select 
                onChange={(e) => handleAddToConfig(server, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Add to Configuration</option>
                {configurations.map(config => (
                  <option key={config.id} value={config.id}>
                    {config.name}
                  </option>
                ))}
                <option value="new">+ Create New Configuration</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerList;
