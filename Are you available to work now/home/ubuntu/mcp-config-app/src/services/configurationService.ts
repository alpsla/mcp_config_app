import { MCPConfiguration, MCPServerConfig, MCPDesktopConfig } from '../types';
import fs from 'fs';
import path from 'path';
import os from 'os';
import MCPServerService from './mcpServerService';

class ConfigurationService {
  private configsPath: string;
  private configs: MCPConfiguration[] = [];
  private serverService: MCPServerService;
  
  constructor(
    configsPath: string = path.join(__dirname, '../../data/user-configs.json'),
    serverService: MCPServerService = new MCPServerService()
  ) {
    this.configsPath = configsPath;
    this.serverService = serverService;
    this.loadConfigurations();
  }

  private loadConfigurations(): void {
    try {
      if (fs.existsSync(this.configsPath)) {
        const data = fs.readFileSync(this.configsPath, 'utf8');
        this.configs = JSON.parse(data);
      } else {
        this.configs = [];
        this.saveConfigurations();
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      this.configs = [];
    }
  }

  private saveConfigurations(): void {
    try {
      fs.writeFileSync(this.configsPath, JSON.stringify(this.configs, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving configurations:', error);
    }
  }

  getAllConfigurations(): MCPConfiguration[] {
    return [...this.configs];
  }

  getConfigurationById(id: string): MCPConfiguration | undefined {
    return this.configs.find(config => config.id === id);
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

    this.configs.push(newConfig);
    this.saveConfigurations();
    return newConfig;
  }

  updateConfiguration(config: MCPConfiguration): MCPConfiguration {
    const index = this.configs.findIndex(c => c.id === config.id);
    if (index === -1) {
      throw new Error(`Configuration with ID ${config.id} not found`);
    }

    config.updatedAt = new Date().toISOString();
    this.configs[index] = config;
    this.saveConfigurations();
    return config;
  }

  deleteConfiguration(id: string): boolean {
    const initialLength = this.configs.length;
    this.configs = this.configs.filter(config => config.id !== id);
    
    if (this.configs.length !== initialLength) {
      this.saveConfigurations();
      return true;
    }
    
    return false;
  }

  addServerToConfiguration(configId: string, serverConfig: MCPServerConfig): MCPConfiguration {
    const config = this.getConfigurationById(configId);
    if (!config) {
      throw new Error(`Configuration with ID ${configId} not found`);
    }

    // Check if server already exists in configuration
    const existingIndex = config.servers.findIndex(s => s.serverId === serverConfig.serverId);
    if (existingIndex !== -1) {
      // Update existing server config
      config.servers[existingIndex] = serverConfig;
    } else {
      // Add new server config
      config.servers.push(serverConfig);
    }

    return this.updateConfiguration(config);
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

    const desktopConfig: MCPDesktopConfig = {
      mcpServers: {}
    };

    // Only include enabled servers
    const enabledServers = config.servers.filter(s => s.enabled);

    for (const serverConfig of enabledServers) {
      const server = this.serverService.getServerById(serverConfig.serverId);
      if (!server) {
        console.warn(`Server with ID ${serverConfig.serverId} not found, skipping`);
        continue;
      }

      // Process args to replace token placeholders
      const processedArgs = serverConfig.args.map(arg => {
        if (server.requiresToken && serverConfig.tokenValue && arg.includes('{token}')) {
          return arg.replace('{token}', serverConfig.tokenValue);
        }
        return arg;
      });

      desktopConfig.mcpServers[server.id] = {
        command: server.command,
        args: processedArgs
      };
    }

    return desktopConfig;
  }

  saveDesktopConfig(configId: string, targetPath?: string): string {
    const desktopConfig = this.generateDesktopConfig(configId);
    
    // Default path is user's home directory
    const configPath = targetPath || path.join(os.homedir(), 'claude_desktop_config.json');
    
    try {
      fs.writeFileSync(configPath, JSON.stringify(desktopConfig, null, 2), 'utf8');
      return configPath;
    } catch (error) {
      console.error('Error saving desktop config:', error);
      throw new Error(`Failed to save desktop config: ${error}`);
    }
  }
}

export default ConfigurationService;
