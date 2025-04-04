import { useState, useEffect } from 'react';
import { FileSystemConfig, WebSearchConfig, HuggingFaceConfig } from '../types';
import ConfigurationService, { loadLocalConfiguration, saveConfigurationLocally } from '../services/configurationService';
import { getUserForDevelopment } from '../lib/supabaseClient';

// Define the types directly in this file to avoid conflicts
interface MCPServerConfig {
  id: string;
  enabled: boolean;
  serverId?: string;
  args?: string[];
  tokenValue?: string;
  command?: string;
  [key: string]: any;
}

interface MCPConfiguration {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  servers: Record<string, MCPServerConfig>;
  isActive?: boolean;
  [key: string]: any;
}

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
    const loadConfigurations = async () => {
      try {
        setLoading(true);
        // Get current user or test user in development
        const user = await getUserForDevelopment();
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Get configurations from database
        const configs = await configService.getAllConfigurations(user.id);
        setConfigurations(configs);
        
        // Set active configuration
        if (initialConfigId) {
          const config = configs.find(c => c.id === initialConfigId);
          if (config) {
            setActiveConfig(config);
          }
        } else if (configs.length > 0) {
          setActiveConfig(configs[0]);
        } else {
          // Try to load from local storage if no configurations found
          const localConfig = loadLocalConfiguration();
          if (localConfig) {
            setActiveConfig(localConfig);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading configurations:', err);
        setError('Failed to load configurations');
        
        // Try to load from local storage
        try {
          const localConfig = loadLocalConfiguration();
          if (localConfig) {
            setActiveConfig(localConfig);
          }
        } catch (localErr) {
          console.error('Failed to load local configuration:', localErr);
        }
        
        setLoading(false);
      }
    };

    loadConfigurations();
  }, [initialConfigId]);

  // Create a new configuration
  const createConfiguration = async (name: string, description: string) => {
    try {
      const user = await getUserForDevelopment();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const newConfig = await configService.createConfiguration(name, description, user.id);
      setConfigurations([...configurations, newConfig]);
      setActiveConfig(newConfig);
      return newConfig;
    } catch (err) {
      console.error('Error creating configuration:', err);
      setError('Failed to create configuration');
      
      // Fallback to local creation
      try {
        const localConfig = configService.createLocalConfiguration(name, description);
        saveConfigurationLocally(localConfig);
        setConfigurations([...configurations, localConfig]);
        setActiveConfig(localConfig);
        return localConfig;
      } catch (localErr) {
        console.error('Failed to create local configuration:', localErr);
        throw localErr;
      }
    }
  };

  // Update an existing configuration
  const updateConfiguration = async (config: MCPConfiguration) => {
    try {
      // Save locally as backup
      saveConfigurationLocally(config);
      
      // Update in database if possible
      try {
        await configService.updateConfiguration(config);
      } catch (dbErr) {
        console.warn('Database update failed, using local update:', dbErr);
        // Continue with local update
      }
      
      // Update in state
      const updatedConfigs = configurations.map(c => 
        c.id === config.id ? config : c
      );
      setConfigurations(updatedConfigs);
      
      if (activeConfig && activeConfig.id === config.id) {
        setActiveConfig(config);
      }
      
      return config;
    } catch (err) {
      console.error('Error updating configuration:', err);
      setError('Failed to update configuration');
      throw err;
    }
  };

  // Delete a configuration
  const deleteConfiguration = async (configId: string) => {
    try {
      // Try to delete from database
      let success = false;
      try {
        success = await configService.deleteConfiguration(configId);
      } catch (dbErr) {
        console.warn('Database delete failed:', dbErr);
        // Continue with local deletion
        success = true;
      }
      
      if (success) {
        // Remove from local state
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
  const addServerToConfiguration = async (
    configId: string, 
    server: {
      id: string;
      name?: string;
      defaultArgs?: string[];
      requiresToken?: boolean;
    },
    enabled: boolean = true
  ) => {
    try {
      // Create server config
      const serverConfig: MCPServerConfig = {
        id: server.id, 
        serverId: server.id,
        args: server.defaultArgs ? [...server.defaultArgs] : [],
        tokenValue: server.requiresToken ? '' : undefined,
        enabled
      };
      
      // Find the configuration
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error(`Configuration with ID ${configId} not found`);
      }
      
      // Update the configuration
      const updatedConfig: MCPConfiguration = {
        ...config,
        servers: {
          ...config.servers,
          [server.id]: serverConfig
        }
      };
      
      // Save the updated configuration
      return await updateConfiguration(updatedConfig);
    } catch (err) {
      console.error('Error adding server to configuration:', err);
      setError('Failed to add server to configuration');
      throw err;
    }
  };

  // Remove a server from a configuration
  const removeServerFromConfiguration = async (configId: string, serverId: string) => {
    try {
      // Find the configuration
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error(`Configuration with ID ${configId} not found`);
      }
      
      // Create a copy of servers without the removed one
      const newServers: Record<string, MCPServerConfig> = {};
      
      // Only copy servers that don't match the serverId to remove
      if (config.servers) {
        Object.entries(config.servers).forEach(([key, value]) => {
          if (key !== serverId) {
            newServers[key] = value;
          }
        });
      }
      
      // Update the configuration with new servers list
      const updatedConfig: MCPConfiguration = {
        ...config,
        servers: newServers
      };
      
      // Save the updated configuration
      return await updateConfiguration(updatedConfig);
    } catch (err) {
      console.error('Error removing server from configuration:', err);
      setError('Failed to remove server from configuration');
      throw err;
    }
  };

  // Generate desktop config
  const generateDesktopConfig = (configId: string) => {
    try {
      // Find the configuration
      const config = configurations.find(c => c.id === configId);
      if (!config) {
        throw new Error(`Configuration with ID ${configId} not found`);
      }
      
      // Generate JSON for the MCP configuration
      const mcpConfig = {
        mcpServers: Object.entries(config.servers || {}).reduce((acc: Record<string, any>, [id, serverConfig]) => {
          if (serverConfig.enabled) {
            acc[id] = {
              command: serverConfig.command || `mcp-${id}`,
              args: serverConfig.args || []
            };
          }
          return acc;
        }, {})
      };
      
      return JSON.stringify(mcpConfig, null, 2);
    } catch (err) {
      console.error('Error generating desktop config:', err);
      setError('Failed to generate desktop config');
      throw err;
    }
  };

  // Save desktop config
  const saveDesktopConfig = async (configId: string) => {
    try {
      // Generate the config
      const configJson = generateDesktopConfig(configId);
      
      // Save locally regardless of whether we can save to the desktop
      localStorage.setItem('mcp_desktop_config', configJson);
      
      // Try to save to Claude directory if we're in desktop environment
      if (typeof window !== 'undefined' && 
          (window as any).electron && 
          (window as any).electron.writeFile) {
        
        const result = await (window as any).electron.writeFile({
          path: 'claude_desktop_config.json',
          content: configJson
        });
        
        return result.success;
      }
      
      // Return true since we saved to localStorage
      return true;
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