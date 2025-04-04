/**
 * Configuration Manager Service
 * 
 * Handles all configuration-related operations including creation, storage,
 * validation, and deployment of MCP server configurations.
 */

import { UserConfigService } from './userConfigService';

// Define types for configuration objects
export interface ServiceConfig {
  enabled: boolean;
  configured: boolean;
  params: Record<string, any>;
}

export interface ModelConfig {
  id: string;
  name: string;
  enabled: boolean;
  configured: boolean;
  params: Record<string, any>;
}

export interface MCPConfiguration {
  id?: string;
  name: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'draft' | 'deployed' | 'failed';
  services: {
    fileSystem: ServiceConfig;
    webSearch: ServiceConfig;
    huggingFace: ServiceConfig;
  };
  models: ModelConfig[];
  globalParams: Record<string, any>;
  tempDirectoryInput?: string;
}

// Default configuration template
export const DEFAULT_CONFIGURATION: MCPConfiguration = {
  name: `Configuration ${new Date().toLocaleDateString()}`,
  userId: '',
  status: 'draft',
  services: {
    fileSystem: {
      enabled: false,
      configured: false,
      params: {
        directories: []
      }
    },
    webSearch: {
      enabled: false,
      configured: false,
      params: {
        resultsCount: 5,
        safeSearch: true,
        useTrustedSources: false
      }
    },
    huggingFace: {
      enabled: false,
      configured: false,
      params: {
        token: ''
      }
    }
  },
  models: [],
  globalParams: {
    temperature: 0.7,
    max_tokens: 100,
    top_p: 0.9
  }
};

// Configuration Manager class that handles all configuration operations
class ConfigurationManagerService {
  /**
   * Create a new configuration
   */
  createConfiguration(userId: string, name: string = ''): MCPConfiguration {
    const config = { ...DEFAULT_CONFIGURATION };
    config.userId = userId;
    
    if (name) {
      config.name = name;
    }
    
    return config;
  }
  
  /**
   * Save configuration to database
   */
  async saveConfiguration(config: MCPConfiguration): Promise<MCPConfiguration> {
    try {
      // Update timestamps
      const now = new Date().toISOString();
      
      if (!config.createdAt) {
        config.createdAt = now;
      }
      
      config.updatedAt = now;
      
      // Save to database
      await UserConfigService.saveConfiguration(
        config.userId,
        config.name,
        this.generateExportConfig(config)
      );
      
      return config;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }
  
  /**
   * Load user configurations
   */
  async getUserConfigurations(userId: string): Promise<MCPConfiguration[]> {
    try {
      const configs = await UserConfigService.getUserConfigurations(userId);
      return configs.map(this.convertFromStorageFormat);
    } catch (error) {
      console.error('Error loading configurations:', error);
      return [];
    }
  }
  
  /**
   * Convert from storage format to our internal format
   */
  private convertFromStorageFormat(storedConfig: any): MCPConfiguration {
    // This is a placeholder - in real implementation, you would
    // convert from the stored format to the MCPConfiguration format
    return {
      ...DEFAULT_CONFIGURATION,
      ...storedConfig
    };
  }
  
  /**
   * Toggle a service on or off
   */
  toggleService(config: MCPConfiguration, serviceId: keyof MCPConfiguration['services']): MCPConfiguration {
    const updatedConfig = { ...config };
    const service = updatedConfig.services[serviceId];
    
    if (service) {
      service.enabled = !service.enabled;
      
      // If turning off, also mark as not configured
      if (!service.enabled) {
        service.configured = false;
      }
    }
    
    return updatedConfig;
  }
  
  /**
   * Update service configuration
   */
  updateServiceConfig(
    config: MCPConfiguration, 
    serviceId: keyof MCPConfiguration['services'], 
    params: Record<string, any>
  ): MCPConfiguration {
    const updatedConfig = { ...config };
    const service = updatedConfig.services[serviceId];
    
    if (service) {
      service.params = { ...service.params, ...params };
    }
    
    return updatedConfig;
  }
  
  /**
   * Mark a service as configured
   */
  setServiceConfigured(
    config: MCPConfiguration, 
    serviceId: keyof MCPConfiguration['services'], 
    configured: boolean = true
  ): MCPConfiguration {
    const updatedConfig = { ...config };
    const service = updatedConfig.services[serviceId];
    
    if (service) {
      service.configured = configured;
    }
    
    return updatedConfig;
  }
  
  /**
   * Add or update a model
   */
  addOrUpdateModel(config: MCPConfiguration, model: ModelConfig): MCPConfiguration {
    const updatedConfig = { ...config };
    const existingIndex = updatedConfig.models.findIndex(m => m.id === model.id);
    
    if (existingIndex >= 0) {
      // Update existing model
      updatedConfig.models[existingIndex] = { ...model };
    } else {
      // Add new model
      updatedConfig.models.push({ ...model });
    }
    
    return updatedConfig;
  }
  
  /**
   * Remove a model
   */
  removeModel(config: MCPConfiguration, modelId: string): MCPConfiguration {
    const updatedConfig = { ...config };
    updatedConfig.models = updatedConfig.models.filter(m => m.id !== modelId);
    return updatedConfig;
  }
  
  /**
   * Update global parameters
   */
  updateGlobalParams(config: MCPConfiguration, params: Record<string, any>): MCPConfiguration {
    const updatedConfig = { ...config };
    updatedConfig.globalParams = { ...updatedConfig.globalParams, ...params };
    return updatedConfig;
  }
  
  /**
   * Generate export configuration in Claude MCP format
   */
  generateExportConfig(config: MCPConfiguration): any {
    // Create the mcpServers object with enabled services
    const mcpServers: Record<string, any> = {};
    
    // Add File System configuration if enabled and configured
    if (config.services.fileSystem.enabled && config.services.fileSystem.configured) {
      mcpServers.fileSystem = {
        command: "npx",
        args: [
          "@anthropic-ai/mcp-filesystem",
          ...(config.services.fileSystem.params.directories && 
            config.services.fileSystem.params.directories.length > 0
            ? ["--directory", config.services.fileSystem.params.directories[0]]
            : [])
        ]
      };
    }
    
    // Add Web Search configuration if enabled and configured
    if (config.services.webSearch.enabled && config.services.webSearch.configured) {
      mcpServers.webSearch = {
        command: "npx",
        args: [
          "@anthropic-ai/mcp-web-search",
          "--results-count", String(config.services.webSearch.params.resultsCount || 5),
          "--safe-search", config.services.webSearch.params.safeSearch ? "true" : "false"
        ]
      };
    }
    
    // Add Hugging Face configuration if enabled, configured, and has models
    if (config.services.huggingFace.enabled && 
        config.services.huggingFace.configured && 
        config.models.some(m => m.enabled && m.configured)) {
      
      // Get the first configured model for initial setup
      const configuredModels = config.models.filter(m => m.enabled && m.configured);
      
      if (configuredModels.length > 0) {
        // Create a huggingFace server for each configured model
        configuredModels.forEach((model, index) => {
          const serverId = index === 0 ? 'huggingFace' : `huggingFace_${model.id}`;
          
          mcpServers[serverId] = {
            command: "npx",
            args: [
              "@anthropic-ai/mcp-huggingface",
              "--model", model.id,
              "--token", "ENV:HF_TOKEN", // Use environment variable for token
              // Add any non-sensitive model-specific parameters
              ...Object.entries(model.params)
                .filter(([key]) => !['token'].includes(key)) // Filter out sensitive params
                .flatMap(([key, value]) => [`--${key}`, String(value)])
            ]
          };
        });
      }
    }
    
    // Return the final configuration
    return {
      mcpServers
    };
  }
  
  /**
   * Validate configuration
   */
  validateConfiguration(config: MCPConfiguration): { isValid: boolean, errors: string[] } {
    const errors: string[] = [];
    
    // Check if any services are enabled
    const hasEnabledServices = Object.values(config.services).some(service => service.enabled);
    if (!hasEnabledServices) {
      errors.push('At least one service must be enabled.');
    }
    
    // Check if all enabled services are configured
    Object.entries(config.services).forEach(([serviceId, service]) => {
      if (service.enabled && !service.configured) {
        errors.push(`${serviceId} service is enabled but not configured.`);
      }
    });
    
    // Check Hugging Face specific validation
    if (config.services.huggingFace.enabled) {
      // Validate token
      if (!config.services.huggingFace.params.token) {
        errors.push('Hugging Face API token is required.');
      }
      
      // Check if any models are enabled and configured
      const hasConfiguredModels = config.models.some(model => model.enabled && model.configured);
      if (!hasConfiguredModels) {
        errors.push('At least one Hugging Face model must be enabled and configured.');
      }
    }
    
    // Check File System specific validation
    if (config.services.fileSystem.enabled) {
      const directories = config.services.fileSystem.params.directories || [];
      if (directories.length === 0) {
        errors.push('At least one directory must be added for File System service.');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Deploy configuration
   */
  async deployConfiguration(config: MCPConfiguration): Promise<MCPConfiguration> {
    try {
      // Validate configuration first
      const validation = this.validateConfiguration(config);
      if (!validation.isValid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Mark as deployed
      const deployedConfig = { ...config, status: 'deployed' as const };
      
      // Save the deployed configuration
      return await this.saveConfiguration(deployedConfig);
    } catch (error) {
      console.error('Deployment failed:', error);
      
      // Mark as failed
      const failedConfig = { ...config, status: 'failed' as const };
      
      // Still save to preserve the status change
      await this.saveConfiguration(failedConfig);
      
      throw error;
    }
  }
}

// Create and export a singleton instance
export const ConfigurationManager = new ConfigurationManagerService();
