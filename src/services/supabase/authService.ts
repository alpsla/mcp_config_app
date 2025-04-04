/**
 * This file is a bridge from the old monolithic authentication service
 * to the new modular authentication system. It re-exports functions
 * from the new system to maintain backward compatibility.
 * 
 * For new code, please import directly from @/services/auth instead.
 */

import {
  authService as newAuthService,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentUser,
  getUserProfile,
  verifyAndEnsureProfile,
  resetPassword,
  updatePassword,
  sendMagicLink,
  resendVerificationEmail,
  supabase,
  User,
  SubscriptionTier
} from '../auth';

// Import directAccessLogin from email module
import { directAccessLogin as directAccessLoginFunc } from '../auth/email/emailAuthService';

// Export directAccessLogin for backward compatibility
export const directAccessLogin = directAccessLoginFunc;

/**
 * The main authentication service object for backward compatibility
 */
const authService = {
  // Re-export methods from the new auth service
  getSession: newAuthService.getSession,
  mapSupabaseUser: newAuthService.mapSupabaseUser,
  signIn: newAuthService.signIn,
  
  /**
   * Get user profile
   */
  getUserProfile: getUserProfile,
  
  /**
   * Handle OAuth callback
   */
  handleOAuthCallback: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error.message);
        return { success: false, error: error.message };
      }
      
      if (!data.session) {
        console.warn('No session found in callback');
        return { success: false, error: 'No session found' };
      }
      
      // Try to get the user profile
      const user = await getUserProfile(data.session.user);
      
      if (!user) {
        console.error('Failed to get user after profile creation attempt');
        return { success: false, error: 'Failed to retrieve user profile' };
      }
      
      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error('Auth callback error:', error);
      return { success: false, error: error.message || 'An error occurred during callback' };
    }
  },
  
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
    return await signUpWithEmail(email, password, firstName, lastName);
  },
  
  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await signOut();
  },
  
  /**
   * Reset password
   */
  resetPassword,
  
  /**
   * Get current user
   */
  getCurrentUser,
  
  /**
   * Update profile
   */
  updateProfile: async (userId: string, profileData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
      
      if (error) {
        console.error('Update profile error:', error.message);
        return { success: false, error: error.message };
      }
      
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message || 'An error occurred while updating profile' };
    }
  },
  
  /**
   * Update subscription tier
   */
  updateSubscriptionTier: async (userId: string, tier: SubscriptionTier) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user for subscription update:', userError.message);
        return { success: false, error: userError.message };
      }
      
      if (!userData.user) {
        return { success: false, error: 'User not found' };
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', userId);
      
      if (profileError) {
        console.error('Error updating subscription tier:', profileError.message);
        return { success: false, error: profileError.message };
      }
      
      // Get updated profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      // Return updated user
      return {
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email || '',
          app_metadata: {},
          user_metadata: {
            subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
          },
          aud: 'authenticated',
          created_at: userData.user.created_at || new Date().toISOString()
        } as User
      };
    } catch (error: any) {
      console.error('Update subscription error:', error);
      return { success: false, error: error.message || 'An error occurred while updating subscription' };
    }
  },
  
  // Verify and ensure profile
  verifyAndEnsureProfile,
  
  // Direct access login
  directAccessLogin
};

// Export a default for the old import style
export default authService;

// Named exports for those who want specific functions
export {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentUser,
  getUserProfile,
  resetPassword,
  updatePassword,
  sendMagicLink,
  resendVerificationEmail,
  verifyAndEnsureProfile
};
