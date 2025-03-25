// Create this as a new file in your project
// For example: src/services/auth/emergencyLogin.ts

import { supabase } from '../../../services/supabase/supabaseClient';

/**
 * Emergency login function that bypasses the normal flow
 * IMPORTANT: This should only be used for debugging and removed afterward
 */
export async function emergencyLogin(userId: string) {
  try {
    // Since direct session creation might not be supported in this version,
    // we'll use a different approach to get user data
    
    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Error getting profile in emergency login:', profileError);
      return { success: false, error: 'Profile fetch error: ' + profileError.message };
    }
    
    // For security reasons, note that we can't actually create a session directly in client-side code
    // This function should only be used for debugging to fetch user data
    console.warn('Emergency login: session creation not supported in client-side code');
    
    return {
      success: true,
      message: 'User data retrieved, but session creation requires server-side code',
      user: {
        id: userId,
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        createdAt: new Date(profileData.created_at || new Date()),
        subscriptionTier: profileData.subscription_tier || 'FREE'
      }
    };
  } catch (error: any) {
    console.error('Critical error in emergency login:', error);
    return { success: false, error: error.message };
  }
}