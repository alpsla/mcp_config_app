import { useState, useEffect } from 'react';
import { MCPConfiguration, MCPServer, MCPServerConfig } from '../types';
import ConfigurationService from '../services/configurationService';

/**
 * Custom hook for managing MCP configurations
 */
export const useConfiguration = (initialConfigId?: string) => {
  const [configurations, setConfigurations] = useState<MCPConfiguration[]>([]);
  const [activeConfig, setActiveConfig] = useState<MCPConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const configService = new ConfigurationService();

  // Load all configurations
  useEffect(() => {
    const loadConfigurations = () => {
      try {
        const configs = configService.getAllConfigurations();
        setConfigurations(configs);
        
        // Set active configuration
        if (initialConfigId) {
          const config = configs.find(c => c.id === initialConfigId);
          if (config) {
            setActiveConfig(config);
          }
        } else if (configs.length > 0) {
          setActiveConfig(configs[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading configurations:', err);
        setError('Failed to load configurations');
        setLoading(false);
      }
    };

    loadConfigurations();
  }, [initialConfigId]);

  // Create a new configuration
  const createConfiguration = (name: string, description: string) => {
    try {
      const newConfig = configService.createConfiguration(name, description);
      setConfigurations([...configurations, newConfig]);
      setActiveConfig(newConfig);
      return newConfig;
    } catch (err) {
      console.error('Error creating configuration:', err);
      setError('Failed to create configuration');
      throw err;
    }
  };

  // Update an existing configuration
  const updateConfiguration = (config: MCPConfiguration) => {
    try {
      const updatedConfig = configService.updateConfiguration(config);
      setConfigurations(
        configurations.map(c => (c.id === updatedConfig.id ? updatedConfig : c))
      );
      if (activeConfig && activeConfig.id === updatedConfig.id) {
        setActiveConfig(updatedConfig);
      }
      return updatedConfig;
    } catch (err) {
      console.error('Error updating configuration:', err);
      setError('Failed to update configuration');
      throw err;
    }
  };

  // Delete a configuration
  const deleteConfiguration = (configId: string) => {
    try {
      const success = configService.deleteConfiguration(configId);
      if (success) {
        const updatedConfigs = configurations.filter(c => c.id !== configId);
        setConfigurations(updatedConfigs);
        
        // Update active configuration if the deleted one was active
        if (activeConfig && activeConfig.id === configId) {
          setActiveConfig(updatedConfigs.length > 0 ? updatedConfigs[0] : null);
        }
      }
      return success;
    } catch (err) {
      console.error('Error deleting configuration:', err);
      setError('Failed to delete configuration');
      throw err;
    }
  };

  // Add a server to a configuration
  const addServerToConfiguration = (
    configId: string, 
    server: MCPServer,
    enabled: boolean = true
  ) => {
    try {
      const serverConfig: MCPServerConfig = {
        id: server.id, // Add the required id field
        serverId: server.id,
        args: server.defaultArgs ? [...server.defaultArgs] : [],
        tokenValue: server.requiresToken ? '' : undefined,
        enabled
      };
      
      const updatedConfig = configService.addServerToConfiguration(configId, serverConfig);
      setConfigurations(
        configurations.map(c => (c.id === updatedConfig.id ? updatedConfig : c))
      );
      if (activeConfig && activeConfig.id === updatedConfig.id) {
        setActiveConfig(updatedConfig);
      }
      return updatedConfig;
    } catch (err) {
      console.error('Error adding server to configuration:', err);
      setError('Failed to add server to configuration');
      throw err;
    }
  };

  // Remove a server from a configuration
  const removeServerFromConfiguration = (configId: string, serverId: string) => {
    try {
      const updatedConfig = configService.removeServerFromConfiguration(configId, serverId);
      setConfigurations(
        configurations.map(c => (c.id === updatedConfig.id ? updatedConfig : c))
      );
      if (activeConfig && activeConfig.id === updatedConfig.id) {
        setActiveConfig(updatedConfig);
      }
      return updatedConfig;
    } catch (err) {
      console.error('Error removing server from configuration:', err);
      setError('Failed to remove server from configuration');
      throw err;
    }
  };

  // Generate desktop config
  const generateDesktopConfig = (configId: string) => {
    try {
      return configService.generateDesktopConfig(configId);
    } catch (err) {
      console.error('Error generating desktop config:', err);
      setError('Failed to generate desktop config');
      throw err;
    }
  };

  // Save desktop config
  const saveDesktopConfig = (configId: string) => {
    try {
      return configService.saveDesktopConfig(configId);
    } catch (err) {
      console.error('Error saving desktop config:', err);
      setError('Failed to save desktop config');
      throw err;
    }
  };

  // Set active configuration
  const setActiveConfiguration = (configId: string) => {
    const config = configurations.find(c => c.id === configId);
    if (config) {
      setActiveConfig(config);
    } else {
      setError(`Configuration with ID ${configId} not found`);
    }
  };

  return {
    configurations,
    activeConfig,
    loading,
    error,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
    addServerToConfiguration,
    removeServerFromConfiguration,
    generateDesktopConfig,
    saveDesktopConfig,
    setActiveConfiguration
  };
};
