/**
 * User Configuration Service
 * 
 * Handles storage and retrieval of user configurations from the database or local storage.
 * In a production environment, this would interact with a backend API.
 */

// Define interfaces for the configuration data
interface StoredConfiguration {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  configData: any;
  status: 'draft' | 'deployed' | 'failed';
}

/**
 * UserConfigService class handles the storage and retrieval of configurations
 */
class UserConfigServiceClass {
  /**
   * Save a configuration to storage
   */
  async saveConfiguration(
    userId: string,
    name: string,
    configData: any,
    status: 'draft' | 'deployed' | 'failed' = 'draft',
    id?: string
  ): Promise<StoredConfiguration> {
    try {
      // Get existing configurations
      const configs = this.getConfigurationsFromStorage(userId);
      
      const now = new Date().toISOString();
      const configId = id || `config_${now}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if configuration already exists
      const existingConfigIndex = configs.findIndex(config => config.id === configId);
      
      const updatedConfig: StoredConfiguration = {
        id: configId,
        userId,
        name,
        createdAt: existingConfigIndex >= 0 ? configs[existingConfigIndex].createdAt : now,
        updatedAt: now,
        configData,
        status
      };
      
      // Update or add the configuration
      if (existingConfigIndex >= 0) {
        configs[existingConfigIndex] = updatedConfig;
      } else {
        configs.push(updatedConfig);
      }
      
      // Save to storage
      this.saveConfigurationsToStorage(userId, configs);
      
      return updatedConfig;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }
  
  /**
   * Get a configuration by ID
   */
  async getConfiguration(userId: string, configId: string): Promise<StoredConfiguration | null> {
    try {
      const configs = this.getConfigurationsFromStorage(userId);
      const config = configs.find(config => config.id === configId);
      
      return config || null;
    } catch (error) {
      console.error('Error getting configuration:', error);
      return null;
    }
  }
  
  /**
   * Get all configurations for a user
   */
  async getUserConfigurations(userId: string): Promise<StoredConfiguration[]> {
    try {
      return this.getConfigurationsFromStorage(userId);
    } catch (error) {
      console.error('Error getting user configurations:', error);
      return [];
    }
  }
  
  /**
   * Delete a configuration
   */
  async deleteConfiguration(userId: string, configId: string): Promise<boolean> {
    try {
      const configs = this.getConfigurationsFromStorage(userId);
      const filteredConfigs = configs.filter(config => config.id !== configId);
      
      if (filteredConfigs.length === configs.length) {
        // No configuration was removed
        return false;
      }
      
      // Save updated configurations
      this.saveConfigurationsToStorage(userId, filteredConfigs);
      
      return true;
    } catch (error) {
      console.error('Error deleting configuration:', error);
      return false;
    }
  }
  
  /**
   * Get configurations from local storage
   * In a production environment, this would be an API call
   */
  private getConfigurationsFromStorage(userId: string): StoredConfiguration[] {
    const storedConfigs = localStorage.getItem(`userConfigs_${userId}`);
    
    if (!storedConfigs) {
      return [];
    }
    
    try {
      return JSON.parse(storedConfigs);
    } catch (error) {
      console.error('Error parsing stored configurations:', error);
      return [];
    }
  }
  
  /**
   * Save configurations to local storage
   * In a production environment, this would be an API call
   */
  private saveConfigurationsToStorage(userId: string, configs: StoredConfiguration[]): void {
    localStorage.setItem(`userConfigs_${userId}`, JSON.stringify(configs));
  }
}

// Create a singleton instance
export const UserConfigService = new UserConfigServiceClass();
