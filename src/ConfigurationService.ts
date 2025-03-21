import { MCPConfiguration, MCPServerConfig, MCPDesktopConfig } from './types';

// Sample data - in a real app, this would be stored in a database or local storage
const sampleConfigurations: MCPConfiguration[] = [
  {
    id: "default-config",
    name: "Default Configuration",
    description: "Basic configuration with essential services",
    servers: [
      {
        serverId: "web-search",
        args: ["--results=5", "--safe-search=true"],
        enabled: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class ConfigurationService {
  private configurations: MCPConfiguration[] = sampleConfigurations;

  constructor() {
    // In a real app, we would load data from local storage or a database
  }

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
      updatedAt: new Date().toISOString()
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

    // Create a deep copy of the configuration to avoid reference issues
    const updatedConfig = JSON.parse(JSON.stringify(config));

    // Check if server already exists in configuration
    const serverIndex = updatedConfig.servers.findIndex((s: MCPServerConfig) => s.serverId === serverConfig.serverId);
    
    if (serverIndex !== -1) {
      // Update existing server
      updatedConfig.servers[serverIndex] = serverConfig;
    } else {
      // Add new server
      updatedConfig.servers.push(serverConfig);
    }

    updatedConfig.updatedAt = new Date().toISOString();
    return this.updateConfiguration(updatedConfig);
  }

  removeServerFromConfiguration(configId: string, serverId: string): MCPConfiguration {
    const config = this.getConfigurationById(configId);
    
    if (!config) {
      throw new Error(`Configuration with ID ${configId} not found`);
    }

    config.servers = config.servers.filter(s => s.serverId !== serverId);
    return this.updateConfiguration(config);
  }

  generateDesktopConfig(configId: string): MCPDesktopConfig {
    const config = this.getConfigurationById(configId);
    
    if (!config) {
      throw new Error(`Configuration with ID ${configId} not found`);
    }

    const desktopConfig: MCPDesktopConfig = {};

    config.servers.forEach((serverConfig: MCPServerConfig) => {
      if (serverConfig.enabled) {
        desktopConfig[`mcp-${serverConfig.serverId}`] = {
          command: "npx",
          args: serverConfig.args
        };
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
