import { MCPConfiguration, MCPServerConfig, MCPDesktopConfig } from '../types';

// Sample data - in a real app, this would be stored in a database or local storage
const sampleConfigurations: MCPConfiguration[] = [
  {
    id: "default-config",
    name: "Default Configuration",
    description: "Basic configuration with essential services",
    servers: [
      {
        id: "web-search",
        name: "Web Search",
        url: "https://api.example.com/search",
        type: "web-search",
        enabled: true,
        defaultArgs: ["--results=5", "--safe-search=true"]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class ConfigurationService {
  private configurations: MCPConfiguration[] = sampleConfigurations;

  getAllConfigurations(): MCPConfiguration[] {
    return this.configurations;
  }

  getConfigurationById(id: string): MCPConfiguration | undefined {
    return this.configurations.find(config => config.id === id);
  }

  createConfiguration(name: string, description: string): MCPConfiguration {
    const newConfig: MCPConfiguration = {
      id: Date.now().toString(),
      name,
      description,
      servers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.configurations.push(newConfig);
    return newConfig;
  }

  updateConfiguration(config: MCPConfiguration): MCPConfiguration {
    const index = this.configurations.findIndex(c => c.id === config.id);
    
    if (index === -1) {
      throw new Error(`Configuration with ID ${config.id} not found`);
    }

    const updatedConfig = {
      ...config,
      updatedAt: new Date()
    };

    this.configurations[index] = updatedConfig;
    return updatedConfig;
  }

  deleteConfiguration(id: string): boolean {
    const initialLength = this.configurations.length;
    this.configurations = this.configurations.filter(config => config.id !== id);
    return this.configurations.length < initialLength;
  }

  addServerToConfiguration(configId: string, serverConfig: MCPServerConfig): MCPConfiguration {
    const config = this.getConfigurationById(configId);
    
    if (!config) {
      throw new Error(`Configuration with ID ${configId} not found`);
    }

    // Check if server already exists in configuration
    const serverIndex = config.servers.findIndex(s => s.id === serverConfig.id || s.id === serverConfig.serverId);
    
    if (serverIndex !== -1) {
      // Update existing server with proper fields
      const updatedServer = {
        ...config.servers[serverIndex],
        ...serverConfig,
        id: serverConfig.id || serverConfig.serverId || config.servers[serverIndex].id
      };
      config.servers[serverIndex] = updatedServer;
    } else {
      // Add new server with proper fields
      const newServer = {
        ...serverConfig,
        id: serverConfig.id || serverConfig.serverId || Date.now().toString(),
        name: serverConfig.name || `Server ${config.servers.length + 1}`,
        url: serverConfig.url || "",
        type: serverConfig.type || "custom"
      };
      config.servers.push(newServer);
    }

    return this.updateConfiguration(config);
  }

  removeServerFromConfiguration(configId: string, serverId: string): MCPConfiguration {
    const config = this.getConfigurationById(configId);
    
    if (!config) {
      throw new Error(`Configuration with ID ${configId} not found`);
    }

    config.servers = config.servers.filter(s => s.id !== serverId);
    return this.updateConfiguration(config);
  }

  generateDesktopConfig(configId: string): MCPDesktopConfig {
    const config = this.getConfigurationById(configId);
    
    if (!config) {
      throw new Error(`Configuration with ID ${configId} not found`);
    }

    const desktopConfig: MCPDesktopConfig = {
      configId: configId,
      servers: [],
      format: 'json'
    };

    config.servers.forEach(serverConfig => {
      if (serverConfig.enabled) {
        desktopConfig.servers.push({
          id: serverConfig.id,
          enabled: serverConfig.enabled,
          args: serverConfig.defaultArgs || [],
          tokenValue: serverConfig.requiresToken ? '' : undefined
        });
      }
    });

    return desktopConfig;
  }

  saveDesktopConfig(configId: string): string {
    const desktopConfig = this.generateDesktopConfig(configId);
    
    // In a real app, this would save to a file
    console.log('Saving desktop config:', JSON.stringify(desktopConfig, null, 2));
    
    // Return mock file path
    return '/Users/username/.claude/config.json';
  }
}

export default ConfigurationService;
