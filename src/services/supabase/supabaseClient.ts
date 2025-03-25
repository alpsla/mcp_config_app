import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client with optional environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create a single instance of the Supabase client
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get the Supabase client instance.
 * This ensures we have only one instance throughout the application.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    // Check if the required environment variables are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        'Supabase URL or Anonymous Key is missing. Authentication and database features will not work correctly.'
      );
    }

    // Create a new client instance
    try {
      console.log('Creating Supabase client with URL:', supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'undefined');
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,      // Store the session in localStorage
          autoRefreshToken: true,    // Automatically refresh the token
          detectSessionInUrl: true,  // Detect OAuth sessions in the URL
          flowType: 'pkce',          // Use PKCE flow for more secure authentication
          storageKey: 'mcp-supabase-auth', // Custom storage key to avoid conflicts
        },
      });
      console.log('Supabase client created successfully');
      
      // Test authentication state
      supabaseInstance.auth.onAuthStateChange((event, session) => {
        console.log('Supabase auth state changed:', event, session ? 'Session exists' : 'No session');
      });
      
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      // Create a minimal client that won't crash the application
      supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
  }

  return supabaseInstance;
};

// Export the Supabase client for convenience
export const supabase = getSupabaseClient();

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
