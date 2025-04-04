import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../supabase-types';

// Initialize Supabase client with optional environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Debug environment variables
console.log('Environment variables check:',
  'REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? '✓ Set' : '✗ Missing',
  'REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'
);

// Create a single instance of the Supabase client - IMPORTANT: Use window to ensure it's a global singleton
declare global {
  interface Window {
    supabaseClientInstance?: SupabaseClient<Database>;
  }
}

/**
 * Get the Supabase client instance.
 * This ensures we have only one instance throughout the application.
 */
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (window.supabaseClientInstance) {
    return window.supabaseClientInstance;
  }

  console.log('Initializing Supabase client - first time');
  // Check if the required environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase URL or Anonymous Key is missing. Authentication and database features will not work correctly.'
    );
  }

  // Create a new client instance
  try {
    console.log('Creating Supabase client with URL:', supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'undefined');
    window.supabaseClientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,      // Store the session in localStorage
        autoRefreshToken: true,    // Automatically refresh the token
        detectSessionInUrl: true,  // Detect OAuth sessions in the URL
        flowType: 'pkce',          // Use PKCE flow for more secure authentication
        storageKey: 'mcp-supabase-auth', // Custom storage key to avoid conflicts
      },
    });
    console.log('Supabase client created successfully');
    
    // Return the newly created instance
    return window.supabaseClientInstance;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Create a minimal client that won't crash the application
    window.supabaseClientInstance = createClient('https://placeholder.supabase.co', 'placeholder-key');
    return window.supabaseClientInstance;
  }
};

// Export the Supabase client for convenience
export const supabase = getSupabaseClient();

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

/**
 * Custom error for when Supabase is not properly configured
 */
export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('Supabase client not configured. Check your environment variables.');
    this.name = 'SupabaseNotConfiguredError';
  }
}

/**
 * Check if Supabase is configured before making any API calls
 */
export const checkSupabaseConfig = () => {
  if (!isSupabaseConfigured()) {
    throw new SupabaseNotConfiguredError();
  }
};
