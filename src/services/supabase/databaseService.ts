import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MCPConfiguration, MCPServerConfig, SubscriptionTier } from '../../types';

interface DatabaseItem {
  id: string;
  name: string;
  description?: string;
  servers: any[];
  created_at: string;
  updated_at: string;
  user_id: string;
  [key: string]: any;
}

/**
 * Save a configuration to the database
 */
export const saveConfiguration = async (
  config: MCPConfiguration,
  userId: string
): Promise<{ data: MCPConfiguration | null; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // Convert dates to ISO strings for database storage
    const configForStorage = {
      ...config,
      user_id: userId,
      created_at: typeof config.createdAt === 'object' ? config.createdAt.toISOString() : config.createdAt,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('configurations')
      .upsert(configForStorage)
      .select()
      .single();

    if (error) throw error;

    // Convert back to our app's data structure
    const savedConfig: MCPConfiguration = {
      id: data.id,
      name: data.name,
      description: data.description,
      servers: data.servers,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: savedConfig };
  } catch (error: any) {
    console.error('Save configuration error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get all configurations for a user
 */
export const getUserConfigurations = async (
  userId: string
): Promise<{ data: MCPConfiguration[]; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Convert from database structure to app structure
    const configs: MCPConfiguration[] = data.map((item: DatabaseItem) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      servers: item.servers,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));

    return { data: configs };
  } catch (error: any) {
    console.error('Get user configurations error:', error.message);
    return { data: [], error: error.message };
  }
};

/**
 * Get a single configuration by ID
 */
export const getConfigurationById = async (
  configId: string
): Promise<{ data: MCPConfiguration | null; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .eq('id', configId)
      .single();

    if (error) throw error;

    // Convert from database structure to app structure
    const config: MCPConfiguration = {
      id: data.id,
      name: data.name,
      description: data.description,
      servers: data.servers,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    return { data: config };
  } catch (error: any) {
    console.error('Get configuration by ID error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Delete a configuration
 */
export const deleteConfiguration = async (
  configId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('configurations')
      .delete()
      .eq('id', configId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Delete configuration error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Update user subscription tier
 */
export const updateSubscriptionTier = async (
  userId: string,
  tier: SubscriptionTier
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: tier })
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Update subscription tier error:', error.message);
    return { success: false, error: error.message };
  }
};
