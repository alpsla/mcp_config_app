import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase-types';

// Create Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export class UserConfigService {
  /**
   * Check if a user has saved configurations
   * @param userId The user ID to check
   * @returns Promise<boolean> indicating if the user has configurations
   */
  static async hasConfigurations(userId: string): Promise<boolean> {
    try {
      // Query the configurations table to check if the user has any configs
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error, count } = await supabase
        .from('configurations')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      return !!count && count > 0;
    } catch (error) {
      console.error('Error checking user configurations:', error);
      return false;
    }
  }
  
  /**
   * Get all configurations for a user
   * @param userId The user ID
   * @returns Promise with the user's configurations
   */
  static async getUserConfigurations(userId: string) {
    try {
      const { data, error } = await supabase
        .from('configurations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error getting user configurations:', error);
      return [];
    }
  }
  
  /**
   * Save a configuration for a user
   * @param userId The user ID
   * @param configName The name of the configuration
   * @param configData The configuration data to save
   * @returns Promise with the saved configuration
   */
  static async saveConfiguration(userId: string, configName: string, configData: any) {
    try {
      const { data, error } = await supabase
        .from('configurations')
        .insert([
          { 
            user_id: userId, 
            name: configName, 
            data: configData 
          }
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing configuration
   * @param configId The configuration ID to update
   * @param configName The new name for the configuration
   * @param configData The new configuration data
   * @returns Promise with the updated configuration
   */
  static async updateConfiguration(configId: string, configName: string, configData: any) {
    try {
      const { data, error } = await supabase
        .from('configurations')
        .update({ 
          name: configName, 
          data: configData,
          updated_at: new Date().toISOString()
        })
        .eq('id', configId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  }
  
  /**
   * Delete a configuration
   * @param configId The configuration ID to delete
   * @returns Promise indicating success
   */
  static async deleteConfiguration(configId: string) {
    try {
      const { error } = await supabase
        .from('configurations')
        .delete()
        .eq('id', configId);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting configuration:', error);
      throw error;
    }
  }
}