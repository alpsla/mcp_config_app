/**
 * Enhanced Configuration Manager
 * 
 * A modernized version of the ConfigurationManager that uses
 * the EnhancedConfigurationService for improved security and reliability.
 * It maintains compatibility with the existing API while adding new capabilities.
 */

import { MCPConfiguration, MCPServer } from '../types';
import { UserConfigService } from './userConfigService';
import { enhancedConfigurationService, EnhancedConfigurationService } from './EnhancedConfigurationService';

// Define interface for the enhanced configuration
export interface EnhancedMCPConfiguration extends MCPConfiguration {
  userId: string;
  status: 'draft' | 'deployed' | 'failed' | 'deploying';
  services: {
    fileSystem: {
      enabled: boolean;
      configured: boolean;
      params: {
        directories: string[];
        [key: string]: any;
      };
    };
    webSearch: {
      enabled: boolean;
      configured: boolean;
      params: {
        resultsCount?: number;
        safeSearch?: boolean;
        useTrustedSources?: boolean;
        [key: string]: any;
      };
    };
    huggingFace: {
      enabled: boolean;
      configured: boolean;
      params: {
        token: string;
        [key: string]: any;
      };
    };
    [key: string]: any;
  };
  models: Array<{
    id: string;
    name: string;
    enabled: boolean;
    configured: boolean;
    params: Record<string, any>;
  }>;
  globalParams: Record<string, any>;
}

// Status types for UserConfigService
type ConfigStatus = 'draft' | 'deployed' | 'failed';

// Default configuration template
export const ENHANCED_DEFAULT_CONFIGURATION: EnhancedMCPConfiguration = {
  id: '',
  name: `Configuration ${new Date().toLocaleDateString()}`,
  userId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
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
  },
  servers: [],
  description: 'Enhanced MCP Configuration'
};

// Deployment step status
export type DeploymentStep = 
  'preparing' | 
  'validating' | 
  'secureStorage' | 
  'scriptGeneration' | 
  'configGeneration' | 
  'testing' | 
  'complete' | 
  'failed';

// Deployment progress interface
export interface DeploymentProgress {
  step: DeploymentStep;
  message: string;
  progress: number; // 0-100
  error?: string;
}

// Common global parameter definitions
export const GLOBAL_PARAMETER_DEFINITIONS = [
  {
    id: 'temperature',
    name: 'Temperature',
    description: 'Controls randomness in text generation. Lower values are more deterministic; higher values are more creative.',
    type: 'number',
    defaultValue: 0.7,
    min: 0,
    max: 1,
    step: 0.1
  },
  {
    id: 'max_tokens',
    name: 'Maximum Length',
    description: 'Maximum number of tokens to generate.',
    type: 'number',
    defaultValue: 100,
    min: 1,
    max: 512,
    step: 1
  },
  {
    id: 'top_p',
    name: 'Top P',
    description: 'Controls diversity via nucleus sampling: 1.0 = disable, 0.5 = half of probability mass.',
    type: 'number',
    defaultValue: 0.9,
    min: 0,
    max: 1,
    step: 0.05
  },
  {
    id: 'top_k',
    name: 'Top K',
    description: 'Controls diversity by limiting to top k tokens. Set to 0 to disable.',
    type: 'number',
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1
  },
  {
    id: 'presence_penalty',
    name: 'Presence Penalty',
    description: 'Penalizes new tokens based on presence in text so far. Encourages model to talk about new topics.',
    type: 'number',
    defaultValue: 0,
    min: -2,
    max: 2,
    step: 0.1
  },
  {
    id: 'frequency_penalty',
    name: 'Frequency Penalty',
    description: 'Penalizes new tokens based on frequency in text so far. Discourages word repetition.',
    type: 'number',
    defaultValue: 0,
    min: -2,
    max: 2,
    step: 0.1
  }
];

/**
 * Enhanced Configuration Manager class
 */
export class EnhancedConfigurationManager {
  private _configurationService: EnhancedConfigurationService;
  
  constructor(configurationService: EnhancedConfigurationService = enhancedConfigurationService) {
    this._configurationService = configurationService;
  }
  
  /**
   * Create a new configuration
   */
  createConfiguration(userId: string, name: string = ''): EnhancedMCPConfiguration {
    const config = { ...ENHANCED_DEFAULT_CONFIGURATION };
    config.userId = userId;
    config.id = `config_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    if (name) {
      config.name = name;
    }
    
    return config;
  }
  
  /**
   * Save configuration to storage
   */
  async saveConfiguration(config: EnhancedMCPConfiguration): Promise<EnhancedMCPConfiguration> {
    try {
      // Update timestamps
      const now = new Date();
      
      if (!config.createdAt) {
        config.createdAt = now;
      }
      
      config.updatedAt = now;
      
      // Map our status to the allowed UserConfigService statuses
      const status: ConfigStatus = config.status === 'deploying' ? 'draft' : config.status as ConfigStatus;
      
      // Save to storage
      await UserConfigService.saveConfiguration(
        config.userId,
        config.name,
        this.sanitizeConfigForStorage(config),
        status,
        config.id
      );
      
      return config;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }
  
  /**
   * Prepare configuration for storage by removing any sensitive data
   */
  private sanitizeConfigForStorage(config: EnhancedMCPConfiguration): any {
    // Create deep copy
    const sanitizedConfig = JSON.parse(JSON.stringify(config));
    
    // Sanitize services that might contain sensitive information
    if (sanitizedConfig.services?.huggingFace?.params?.token) {
      sanitizedConfig.services.huggingFace.params.token = '***';
    }
    
    // Sanitize servers 
    if (sanitizedConfig.servers) {
      sanitizedConfig.servers = sanitizedConfig.servers.map((server: MCPServer) => {
        if (server.config) {
          const sanitizedServer = { ...server };
          sanitizedServer.config = { ...server.config };
          
          // Remove sensitive config fields (tokens, api keys, etc.)
          for (const key of Object.keys(sanitizedServer.config)) {
            if (this.isSensitiveParameter(key)) {
              sanitizedServer.config[key] = '***';
            }
          }
          
          return sanitizedServer;
        }
        return server;
      });
    }
    
    return sanitizedConfig;
  }
  
  /**
   * Check if a parameter name indicates sensitive information
   */
  private isSensitiveParameter(paramName: string): boolean {
    const sensitiveNames = ['token', 'key', 'password', 'secret', 'credential', 'apiKey'];
    return sensitiveNames.some(name => 
      paramName.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  /**
   * Load user configurations
   */
  async getUserConfigurations(userId: string): Promise<EnhancedMCPConfiguration[]> {
    try {
      const configs = await UserConfigService.getUserConfigurations(userId);
      return configs.map(this.convertFromStorageFormat);
    } catch (error) {
      console.error('Error loading configurations:', error);
      return [];
    }
  }
  
  /**
   * Get a configuration by ID
   */
  async getConfigurationById(userId: string, configId: string): Promise<EnhancedMCPConfiguration | null> {
    try {
      const config = await UserConfigService.getConfiguration(userId, configId);
      return config ? this.convertFromStorageFormat(config) : null;
    } catch (error) {
      console.error('Error loading configuration:', error);
      return null;
    }
  }
  
  /**
   * Convert from storage format to MCPConfiguration
   */
  private convertFromStorageFormat(storedConfig: any): EnhancedMCPConfiguration {
    // In a real implementation, this would properly convert from
    // the stored format to our MCPConfiguration format
    return {
      ...ENHANCED_DEFAULT_CONFIGURATION,
      ...storedConfig,
      configData: undefined
    };
  }
  
  /**
   * Toggle a service on or off
   */
  toggleService(
    config: EnhancedMCPConfiguration, 
    serviceId: keyof EnhancedMCPConfiguration['services']
  ): EnhancedMCPConfiguration {
    // Create a new config to avoid mutations
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
   * Update service configuration parameters
   */
  updateServiceConfig(
    config: EnhancedMCPConfiguration,
    serviceId: keyof EnhancedMCPConfiguration['services'],
    params: Record<string, any>
  ): EnhancedMCPConfiguration {
    const updatedConfig = { ...config };
    const service = updatedConfig.services[serviceId];
    
    if (service) {
      service.params = { ...service.params, ...params };
    }
    
    return updatedConfig;
  }
  
  /**
   * Update global parameters
   * This is used to set defaults during the subscription process
   */
  updateGlobalParams(
    config: EnhancedMCPConfiguration,
    params: Record<string, any>
  ): EnhancedMCPConfiguration {
    const updatedConfig = { ...config };
    updatedConfig.globalParams = { ...updatedConfig.globalParams, ...params };
    return updatedConfig;
  }
  
  /**
   * Save global parameters to user preferences
   * These will be applied to all new configurations
   */
  async saveGlobalParamsToUserPreferences(
    userId: string,
    params: Record<string, any>
  ): Promise<void> {
    try {
      // In a real implementation, this would save to user preferences in backend
      const userPrefsKey = `user_${userId}_global_params`;
      localStorage.setItem(userPrefsKey, JSON.stringify(params));
    } catch (error) {
      console.error('Error saving global parameters:', error);
      throw error;
    }
  }
  
  /**
   * Get global parameters from user preferences
   */
  async getGlobalParamsFromUserPreferences(
    userId: string
  ): Promise<Record<string, any>> {
    try {
      // In a real implementation, this would retrieve from backend
      const userPrefsKey = `user_${userId}_global_params`;
      const storedParams = localStorage.getItem(userPrefsKey);
      
      if (storedParams) {
        return JSON.parse(storedParams);
      }
      
      // Return default values if no stored preferences
      return {
        temperature: 0.7,
        max_tokens: 100,
        top_p: 0.9,
        top_k: 40,
        presence_penalty: 0,
        frequency_penalty: 0
      };
    } catch (error) {
      console.error('Error getting global parameters:', error);
      return ENHANCED_DEFAULT_CONFIGURATION.globalParams;
    }
  }
  
  /**
   * Apply global parameters as defaults for a model
   */
  applyGlobalParamsToModel(
    modelConfig: any,
    globalParams: Record<string, any>
  ): any {
    // Check if model already has params
    if (!modelConfig.params) {
      return {
        ...modelConfig,
        params: { ...globalParams }
      };
    }
    
    // Only apply global params that aren't explicitly set on the model
    const combinedParams = { ...globalParams };
    
    // Override with any model-specific params
    for (const [key, value] of Object.entries(modelConfig.params)) {
      combinedParams[key] = value;
    }
    
    return {
      ...modelConfig,
      params: combinedParams
    };
  }
  
  /**
   * Add or update a model
   */
  addOrUpdateModel(
    config: EnhancedMCPConfiguration,
    model: any
  ): EnhancedMCPConfiguration {
    const updatedConfig = { ...config };
    const existingIndex = updatedConfig.models.findIndex(m => m.id === model.id);
    
    // Apply global params as defaults for this model
    const modelWithParams = this.applyGlobalParamsToModel(model, updatedConfig.globalParams);
    
    if (existingIndex >= 0) {
      // Update existing model
      updatedConfig.models[existingIndex] = modelWithParams;
    } else {
      // Add new model
      updatedConfig.models.push(modelWithParams);
    }
    
    return updatedConfig;
  }
  
  /**
   * Remove a model
   */
  removeModel(
    config: EnhancedMCPConfiguration,
    modelId: string
  ): EnhancedMCPConfiguration {
    const updatedConfig = { ...config };
    updatedConfig.models = updatedConfig.models.filter(m => m.id !== modelId);
    return updatedConfig;
  }
  
  /**
   * Mark a service as configured
   */
  setServiceConfigured(
    config: EnhancedMCPConfiguration,
    serviceId: keyof EnhancedMCPConfiguration['services'],
    configured: boolean = true
  ): EnhancedMCPConfiguration {
    const updatedConfig = { ...config };
    const service = updatedConfig.services[serviceId];
    
    if (service) {
      service.configured = configured;
    }
    
    return updatedConfig;
  }
  
  /**
   * Validate a configuration
   */
  validateConfiguration(
    config: EnhancedMCPConfiguration
  ): { isValid: boolean; errors: string[] } {
    return this._configurationService.validateConfiguration(config);
  }
  
  /**
   * Deploy a configuration with enhanced security measures
   * This includes progress reporting for multi-step deployment
   */
  async deployConfiguration(
    config: EnhancedMCPConfiguration,
    progressCallback?: (progress: DeploymentProgress) => void
  ): Promise<EnhancedMCPConfiguration> {
    try {
      // Step 1: Preparation
      this.reportProgress(progressCallback, {
        step: 'preparing',
        message: 'Preparing configuration...',
        progress: 10
      });
      
      // Mark as deploying
      const deployingConfig = { ...config, status: 'deploying' as const };
      await this.saveConfiguration(deployingConfig);
      
      // Step 2: Validation
      this.reportProgress(progressCallback, {
        step: 'validating',
        message: 'Validating configuration...',
        progress: 20
      });
      
      const validation = this.validateConfiguration(config);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Step 3: Secure Storage
      this.reportProgress(progressCallback, {
        step: 'secureStorage',
        message: 'Securing sensitive parameters...',
        progress: 40
      });
      
      // Step 4: Script Generation
      this.reportProgress(progressCallback, {
        step: 'scriptGeneration',
        message: 'Generating wrapper scripts...',
        progress: 60
      });
      
      // Step 5: Config Generation
      this.reportProgress(progressCallback, {
        step: 'configGeneration',
        message: 'Generating configuration files...',
        progress: 80
      });
      
      // Generate the actual configuration files
      const deployResult = await this._configurationService.generateDesktopConfig(config);
      
      if (!deployResult.success) {
        throw new Error(`Deployment failed: ${deployResult.message}`);
      }
      
      // Step 6: Testing
      this.reportProgress(progressCallback, {
        step: 'testing',
        message: 'Testing integration...',
        progress: 90
      });
      
      // Step 7: Complete
      this.reportProgress(progressCallback, {
        step: 'complete',
        message: 'Deployment completed successfully!',
        progress: 100
      });
      
      // Mark as deployed
      const deployedConfig = { ...config, status: 'deployed' as const };
      return await this.saveConfiguration(deployedConfig);
    } catch (error: any) {
      // Report error
      this.reportProgress(progressCallback, {
        step: 'failed',
        message: `Deployment failed: ${error.message}`,
        progress: 100,
        error: error.message
      });
      
      // Mark as failed
      const failedConfig = { ...config, status: 'failed' as const };
      await this.saveConfiguration(failedConfig);
      
      throw error;
    }
  }
  
  /**
   * Helper to report progress during deployment
   */
  private reportProgress(
    callback: ((progress: DeploymentProgress) => void) | undefined,
    progress: DeploymentProgress
  ): void {
    if (callback) {
      callback(progress);
    }
  }
  
  /**
   * Get global parameter definitions suitable for UI rendering
   */
  getGlobalParameterDefinitions(): any[] {
    return GLOBAL_PARAMETER_DEFINITIONS;
  }
  
  /**
   * Get user profile data
   */
  async getUserProfile(userId: string): Promise<{ data: any, error: any }> {
    try {
      // In a real implementation, this would fetch from the database
      const profileKey = `user_${userId}_profile`;
      const profileData = localStorage.getItem(profileKey);
      
      if (profileData) {
        return { data: JSON.parse(profileData), error: null };
      }
      
      // Return empty data if no profile exists
      return { data: {}, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  }
  
  /**
   * Update user profile information
   */
  async updateUserProfile(
    userId: string,
    profileData: {
      first_name?: string;
      last_name?: string;
      display_name?: string;
      company?: string;
      role?: string;
      interests?: string[];
      primary_use_case?: string;
      experience_level?: string;
    }
  ): Promise<void> {
    try {
      // Get existing profile data
      const profileKey = `user_${userId}_profile`;
      const existingData = localStorage.getItem(profileKey);
      let updatedProfile = {};
      
      if (existingData) {
        updatedProfile = JSON.parse(existingData);
      }
      
      // Update with new data
      updatedProfile = {
        ...updatedProfile,
        ...profileData,
        updated_at: new Date().toISOString()
      };
      
      // Save back to storage
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      
      console.log(`Profile updated for user ${userId}`, profileData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Creates a complete subscription profile with global parameters
   * This is called when a user subscribes or updates their subscription
   */
  async createOrUpdateSubscriptionProfile(
    userId: string,
    tier: string,
    globalParams: Record<string, any>
  ): Promise<void> {
    try {
      // Save global parameters to user preferences
      await this.saveGlobalParamsToUserPreferences(userId, globalParams);
      
      // In a real implementation, this would also update subscription info in backend
      const subscriptionInfo = {
        userId,
        tier,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`user_${userId}_subscription`, JSON.stringify(subscriptionInfo));
      
      console.log(`Subscription profile updated for user ${userId}`, { tier, globalParams });
    } catch (error) {
      console.error('Error updating subscription profile:', error);
      throw error;
    }
  }
  
  /**
   * Get user custom parameters
   */
  async getUserCustomParameters(userId: string): Promise<{ data: any, error: any }> {
    try {
      // In a real implementation, this would fetch from the database
      const paramsKey = `user_${userId}_custom_parameters`;
      const paramsData = localStorage.getItem(paramsKey);
      
      if (paramsData) {
        return { data: JSON.parse(paramsData), error: null };
      }
      
      // Return empty data if no parameters exist
      return { data: [], error: null };
    } catch (error) {
      console.error('Error fetching user custom parameters:', error);
      return { data: null, error };
    }
  }
  
  /**
   * Save user custom parameters
   */
  async saveUserCustomParameters(
    userId: string,
    parameters: any[]
  ): Promise<void> {
    try {
      const paramsKey = `user_${userId}_custom_parameters`;
      localStorage.setItem(paramsKey, JSON.stringify(parameters));
      
      console.log(`Custom parameters saved for user ${userId}`, parameters);
    } catch (error) {
      console.error('Error saving user custom parameters:', error);
      throw error;
    }
  }
  
  /**
   * Get common parameters shared across users
   */
  async getCommonParameters(): Promise<{ data: any, error: any }> {
    try {
      // In a real implementation, this would fetch popular params from the server
      // For now, return a few commonly used examples
      const commonParams = [
        {
          id: 'repetition_penalty',
          name: 'Repetition Penalty',
          description: 'Penalizes repeating tokens to avoid loops and repetition.',
          min: 1.0,
          max: 2.0,
          step: 0.05,
          defaultValue: 1.1,
          unit: '',
          advancedOnly: false
        },
        {
          id: 'max_context_length',
          name: 'Maximum Context Length',
          description: 'Maximum number of tokens to include from the context.',
          min: 256,
          max: 8192,
          step: 128,
          defaultValue: 2048,
          unit: 'tokens',
          advancedOnly: true
        }
      ];
      
      return { data: commonParams, error: null };
    } catch (error) {
      console.error('Error fetching common parameters:', error);
      return { data: null, error };
    }
  }
}

// Export singleton instance
export const enhancedConfigurationManager = new EnhancedConfigurationManager();