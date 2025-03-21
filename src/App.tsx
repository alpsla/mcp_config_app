import React, { useState, useEffect } from 'react';
import './App.css';
import MCPServerService from './services/mcpServerService';
import ConfigurationService from './services/configurationService';
import { MCPServer, MCPConfiguration, SearchFilters } from './types';
import ConfigurationList from './components/ConfigurationList';
import ConfigurationWizard from './components/ConfigurationWizard';

const App: React.FC = () => {
  // Services
  const serverService = new MCPServerService();
  const configService = new ConfigurationService();

  // State
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [filteredServers, setFilteredServers] = useState<MCPServer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [configurations, setConfigurations] = useState<MCPConfiguration[]>([]);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'configurations'
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    // Load servers
    const allServers = serverService.getAllServers();
    setServers(allServers);
    setFilteredServers(allServers);
    
    // Load categories
    const allCategories = serverService.getCategories();
    setCategories(allCategories);
    
    // Load configurations
    const allConfigurations = configService.getAllConfigurations();
    setConfigurations(allConfigurations);
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: SearchFilters) => {
    const results = serverService.searchServers(filters);
    setFilteredServers(results);
  };

  // Show message with auto-dismiss
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };
  
  // Handle creating a new configuration
  const handleCreateConfiguration = () => {
    setShowWizard(true);
  };
  
  // Handle selecting a configuration
  const handleSelectConfiguration = (configId: string) => {
    setSelectedConfigId(configId);
  };
  
  // Handle deleting a configuration
  const handleDeleteConfiguration = (configId: string) => {
    const deleted = configService.deleteConfiguration(configId);
    if (deleted) {
      setConfigurations(configService.getAllConfigurations());
      showMessage('Configuration deleted successfully', 'success');
    } else {
      showMessage('Failed to delete configuration', 'error');
    }
  };
  
  // Handle saving a configuration from the wizard
  const handleSaveConfiguration = (config: MCPConfiguration) => {
    try {
      let savedConfig: MCPConfiguration;
      
      // Check if this is a new configuration or an existing one
      const existingConfig = configService.getConfigurationById(config.id);
      
      if (existingConfig) {
        // Update existing configuration
        savedConfig = configService.updateConfiguration(config);
      } else {
        // Create new configuration
        savedConfig = configService.createConfiguration(config.name, config.description);
        
        // Add servers to the new configuration
        config.servers.forEach(serverConfig => {
          configService.addServerToConfiguration(savedConfig.id, serverConfig);
        });
        
        // Get the updated configuration with all servers
        savedConfig = configService.getConfigurationById(savedConfig.id) as MCPConfiguration;
      }
      
      setConfigurations(configService.getAllConfigurations());
      setShowWizard(false);
      showMessage('Configuration saved successfully', 'success');
    } catch (error) {
      console.error('Error saving configuration:', error);
      showMessage('Failed to save configuration', 'error');
    }
  };
  
  // Handle canceling the wizard
  const handleCancelWizard = () => {
    setShowWizard(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>MCP Configuration Tool</h1>
        <div className="tabs">
          <button 
            className={activeTab === 'search' ? 'active' : ''}
            onClick={() => setActiveTab('search')}
          >
            Search MCP Servers
          </button>
          <button 
            className={activeTab === 'configurations' ? 'active' : ''}
            onClick={() => setActiveTab('configurations')}
          >
            My Configurations
          </button>
        </div>
      </header>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <main className="app-content">
        {activeTab === 'search' ? (
          <div className="search-view">
            <h2>Search Filters</h2>
            <div className="filter-controls">
              <input 
                type="text" 
                placeholder="Search by name or description"
                onChange={(e) => handleFilterChange({ query: e.target.value })}
              />
              
              <div className="categories-section">
                <h3>Categories:</h3>
                <div className="categories-list">
                  {categories.map(category => (
                    <label key={category} className="category-checkbox">
                      <input type="checkbox" />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <h2>Available MCP Servers ({filteredServers.length})</h2>
            <div className="server-cards">
              {filteredServers.map(server => (
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
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="configurations-view">
            <div className="configurations-container">
              {showWizard ? (
                <ConfigurationWizard 
                  servers={servers}
                  onSaveConfiguration={handleSaveConfiguration}
                  onCancel={handleCancelWizard}
                  initialConfig={undefined}
                />
              ) : (
                <ConfigurationList
                  configurations={configurations}
                  onSelectConfiguration={handleSelectConfiguration}
                  onDeleteConfiguration={handleDeleteConfiguration}
                  onCreateConfiguration={handleCreateConfiguration}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>MCP Configuration Tool for Claude Sonnet Desktop</p>
      </footer>
    </div>
  );
};

export default App;
