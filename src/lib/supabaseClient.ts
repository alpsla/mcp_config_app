import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables or defaults
// In production, these would come from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Add some helper functions for database access
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

// Add fallback for testing/development
export const getLocalUser = () => {
  // Use a test user ID for development
  return {
    id: 'test-user-id',
    email: 'test@example.com',
  };
};

// For development use - returns test user if not in production
export const getUserForDevelopment = async () => {
  if (process.env.NODE_ENV === 'production') {
    return await getCurrentUser();
  }
  // No 'else' needed here, prevents unreachable code warning
  return getLocalUser();
};
