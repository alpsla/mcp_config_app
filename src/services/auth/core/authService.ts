import { supabase, checkSupabaseConfig } from './authClient';
import { User, SubscriptionTier } from '../types/authTypes';
import { verifyAndEnsureProfile, getUserProfile } from '../profile/profileService';

/**
 * Get the current user (main function used throughout the app)
 */
export async function getCurrentUser(): Promise<User | null> {
  checkSupabaseConfig();
  
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Get current user error:', userError.message);
      return null;
    }
    
    if (!userData.user) {
      return null;
    }
    
    // Get additional profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .maybeSingle();
    
    if (profileError && profileError.code !== 'PGSQL_ERROR_NO_ROWS') {
      console.error('Error fetching user profile:', profileError);
    }
    
    // If profile doesn't exist, create it
    if (!profileData) {
      try {
        // Extract metadata for names
        const metadata = userData.user.user_metadata || {};
        const email = userData.user.email || '';
        const firstName = metadata.first_name || metadata.given_name || 'User';
        const lastName = metadata.last_name || metadata.family_name || 'Name';
        
        // Use the dedicated function to ensure profile exists
        const profileResult = await verifyAndEnsureProfile(
          userData.user.id,
          email,
          firstName,
          lastName
        );
        
        if (profileResult.success) {
          console.log(`Profile ${profileResult.action} for user:`, userData.user.id);
          
          // Get the new profile data
          const { data: newProfileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.user.id)
            .maybeSingle();
            
          // Return user with the new profile data
          const user: any = {
            id: userData.user.id,
            email: userData.user.email || '',
            app_metadata: {},
            user_metadata: {
              firstName: newProfileData?.first_name || firstName,
              lastName: newProfileData?.last_name || lastName,
              subscriptionTier: newProfileData?.subscription_tier || SubscriptionTier.FREE
            },
            aud: 'authenticated',
            created_at: userData.user.created_at || new Date().toISOString()
          };
      
          return user as User;
        } else {
          console.error('Failed to create profile in getCurrentUser:', profileResult.error);
        }
      } catch (createError) {
        console.error('Failed to create missing profile:', createError);
      }
    }
    
    // Return user with merged profile data
    const user: any = {
      id: userData.user.id,
      email: userData.user.email || '',
      app_metadata: {},
      user_metadata: {
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
      },
      aud: 'authenticated',
      created_at: userData.user.created_at || new Date().toISOString()
    };
    
    return user as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  checkSupabaseConfig();
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, session: data.session };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error getting session' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  checkSupabaseConfig();
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message || 'An error occurred during sign out' };
  }
}

/**
 * The main authentication service that combines all auth modules
 * This is the main export that should be used by the app
 */
const authService = {
  /**
   * Check the authentication state by validating the current session
   */
  async getSession() {
    checkSupabaseConfig();
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        return null;
      }
      
      if (!data.session) {
        return null;
      }
      
      return await getUserProfile(data.session.user);
    } catch (error) {
      console.error('Session check error:', error);
      return null;
    }
  },
  
  /**
   * Convert a Supabase user to our app's User model
   */
  mapSupabaseUser(supabaseUser: any): User | null {
    if (!supabaseUser) return null;
    
    const metadata = supabaseUser.user_metadata || {};
    
    const user: any = {
      id: supabaseUser.id || '',
      email: supabaseUser.email || '',
      app_metadata: {},
      user_metadata: {
        firstName: metadata.first_name || metadata.given_name,
        lastName: metadata.last_name || metadata.family_name,
        subscriptionTier: SubscriptionTier.FREE
      },
      aud: 'authenticated',
      created_at: supabaseUser.created_at || new Date().toISOString(),
    };
    
    return user as User;
  },
  
  /**
   * Sign in a user with email and password
   */
  async signIn(email: string, password: string) {
    checkSupabaseConfig();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        return { success: false, error: error.message };
      }
      
      const user = await getUserProfile(data.user);
      
      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'An error occurred during sign in' };
    }
  },
  
  // Re-export all functions for convenience
  getCurrentUser,
  getCurrentSession,
  signOut,
  
  // Re-export the Supabase client for direct access when needed
  supabase,
};

export default authService;
