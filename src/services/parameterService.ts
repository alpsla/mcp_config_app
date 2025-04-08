import { enhancedConfigurationManager } from './EnhancedConfigurationManager';

// Define the custom parameter interface
export interface CustomParameter {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  advancedOnly: boolean;
}

const CUSTOM_PARAMETERS_KEY = 'mcp_custom_parameters';

/**
 * Service to manage custom parameters
 */
class ParameterService {
  /**
   * Get all custom parameters for a user
   * @param userId The user ID
   */
  async getUserParameters(userId: string): Promise<CustomParameter[]> {
    try {
      // First try to get from configuration manager (server-side)
      const { data } = await enhancedConfigurationManager.getUserCustomParameters(userId);
      
      if (data && Array.isArray(data)) {
        // Also save to local storage for offline access
        localStorage.setItem(CUSTOM_PARAMETERS_KEY, JSON.stringify(data));
        return data;
      }
      
      // If server request fails, try local storage
      const localData = localStorage.getItem(CUSTOM_PARAMETERS_KEY);
      if (localData) {
        return JSON.parse(localData);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching user parameters:', error);
      
      // Fall back to local storage
      const localData = localStorage.getItem(CUSTOM_PARAMETERS_KEY);
      if (localData) {
        return JSON.parse(localData);
      }
      
      return [];
    }
  }
  
  /**
   * Save a custom parameter for a user
   * @param userId The user ID
   * @param parameter The parameter to save
   */
  async saveParameter(userId: string, parameter: CustomParameter): Promise<void> {
    try {
      // Get existing parameters first
      const existingParameters = await this.getUserParameters(userId);
      
      // Check if parameter with same ID exists
      const existingIndex = existingParameters.findIndex(p => p.id === parameter.id);
      
      if (existingIndex >= 0) {
        // Update existing parameter
        existingParameters[existingIndex] = parameter;
      } else {
        // Add new parameter
        existingParameters.push(parameter);
      }
      
      // Save to local storage
      localStorage.setItem(CUSTOM_PARAMETERS_KEY, JSON.stringify(existingParameters));
      
      // Save to server
      await enhancedConfigurationManager.saveUserCustomParameters(userId, existingParameters);
    } catch (error) {
      console.error('Error saving parameter:', error);
      
      // Still save to local storage as backup
      const existingParameters = await this.getUserParameters(userId);
      const updatedParameters = existingParameters.filter(p => p.id !== parameter.id).concat(parameter);
      localStorage.setItem(CUSTOM_PARAMETERS_KEY, JSON.stringify(updatedParameters));
    }
  }
  
  /**
   * Remove a custom parameter for a user
   * @param userId The user ID
   * @param parameterId The ID of the parameter to remove
   */
  async removeParameter(userId: string, parameterId: string): Promise<void> {
    try {
      // Get existing parameters
      const existingParameters = await this.getUserParameters(userId);
      
      // Filter out the parameter to remove
      const updatedParameters = existingParameters.filter(p => p.id !== parameterId);
      
      // Save to local storage
      localStorage.setItem(CUSTOM_PARAMETERS_KEY, JSON.stringify(updatedParameters));
      
      // Save to server
      await enhancedConfigurationManager.saveUserCustomParameters(userId, updatedParameters);
    } catch (error) {
      console.error('Error removing parameter:', error);
      
      // Still update local storage as backup
      const existingParameters = await this.getUserParameters(userId);
      const updatedParameters = existingParameters.filter(p => p.id !== parameterId);
      localStorage.setItem(CUSTOM_PARAMETERS_KEY, JSON.stringify(updatedParameters));
    }
  }
  
  /**
   * Save all custom parameters for a user
   * @param userId The user ID
   * @param parameters The parameters to save
   */
  async saveAllParameters(userId: string, parameters: CustomParameter[]): Promise<void> {
    try {
      // Save to local storage
      localStorage.setItem(CUSTOM_PARAMETERS_KEY, JSON.stringify(parameters));
      
      // Save to server
      await enhancedConfigurationManager.saveUserCustomParameters(userId, parameters);
    } catch (error) {
      console.error('Error saving all parameters:', error);
      
      // Still save to local storage as backup
      localStorage.setItem(CUSTOM_PARAMETERS_KEY, JSON.stringify(parameters));
    }
  }
  
  /**
   * Get a common parameter that has been used across configurations
   * This allows detection of common parameters that should be suggested to the user
   */
  async getCommonParameters(): Promise<CustomParameter[]> {
    try {
      // Get common parameters from server
      const { data } = await enhancedConfigurationManager.getCommonParameters();
      
      if (data && Array.isArray(data)) {
        return data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching common parameters:', error);
      return [];
    }
  }
}

export const parameterService = new ParameterService();