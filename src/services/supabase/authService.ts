import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Provider } from '@supabase/supabase-js';
import { User, SubscriptionTier } from '../../types';
import { getVerificationEmailTemplate, getPasswordResetEmailTemplate, getMagicLinkEmailTemplate } from './emailTemplates';
import { safeOAuthSignIn } from '../../auth/providerTypes';

/**
 * Custom error for when Supabase is not properly configured
 */
class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('Supabase client not configured. Check your environment variables.');
    this.name = 'SupabaseNotConfiguredError';
  }
}

/**
 * Check if Supabase is configured before making any API calls
 */
const checkSupabaseConfig = () => {
  if (!isSupabaseConfigured()) {
    throw new SupabaseNotConfiguredError();
  }
};

/**
 * Send a password reset email (exported separately for direct import)
 */
export async function resetPassword(email: string) {
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getPasswordResetEmailTemplate();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      ...(emailTemplate && { emailTemplate })
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Password reset instructions sent to your email'
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message || 'An error occurred during password reset' };
  }
}

/**
 * Get the current user (exported separately for direct import)
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
      .single();
    
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
            .single();
            
          // Return user with the new profile data
          return {
            id: userData.user.id,
            email: userData.user.email || '',
            firstName: newProfileData?.first_name || firstName,
            lastName: newProfileData?.last_name || lastName,
            createdAt: new Date(userData.user.created_at || new Date()),
            subscriptionTier: newProfileData?.subscription_tier || SubscriptionTier.FREE
          };
        } else {
          console.error('Failed to create profile in getCurrentUser:', profileResult.error);
        }
      } catch (createError) {
        console.error('Failed to create missing profile:', createError);
      }
    }
    
    // Return user with merged profile data
    return {
      id: userData.user.id,
      email: userData.user.email || '',
      firstName: profileData?.first_name,
      lastName: profileData?.last_name,
      createdAt: new Date(userData.user.created_at || new Date()),
      subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Authentication service using Supabase
 */
const authService = {
  /**
   * Check the authentication state by validating the current session
   * @returns {Promise<User | null>} The current user or null if not authenticated
   */
  async getSession(): Promise<User | null> {
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
      
      return await this.getUserProfile(data.session.user);
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
    
    return {
      id: supabaseUser.id || '',
      email: supabaseUser.email || '',
      firstName: metadata.first_name || metadata.given_name,
      lastName: metadata.last_name || metadata.family_name,
      createdAt: new Date(supabaseUser.created_at || new Date()),
      subscriptionTier: SubscriptionTier.FREE
    };
  },
  
  /**
   * Get user profile data and merge with auth data
   */
  async getUserProfile(authUser: any): Promise<User | null> {
    if (!authUser) return null;
    
    try {
      // Get additional profile data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (profileError && profileError.code !== 'PGSQL_ERROR_NO_ROWS') {
        console.error('Error fetching user profile:', profileError);
      }
      
      // If no profile exists, create one
      if (!profileData) {
        try {
          // Extract metadata for names
          const metadata = authUser.user_metadata || {};
          const email = authUser.email || '';
          const firstName = metadata.first_name || metadata.given_name || 'User';
          const lastName = metadata.last_name || metadata.family_name || 'Name';
          
          // Use the dedicated function to ensure profile exists
          const profileResult = await verifyAndEnsureProfile(
            authUser.id,
            email,
            firstName,
            lastName
          );
          
          if (profileResult.success) {
            console.log(`Profile ${profileResult.action} in getUserProfile for user:`, authUser.id);
            
            // Get the newly created profile
            const { data: newProfileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();
              
            // Return user with the new profile data
            return {
              id: authUser.id,
              email: email,
              firstName: newProfileData?.first_name || firstName,
              lastName: newProfileData?.last_name || lastName,
              createdAt: new Date(authUser.created_at || new Date()),
              subscriptionTier: newProfileData?.subscription_tier || SubscriptionTier.FREE
            };
          } else {
            console.error('Failed to create profile in getUserProfile:', profileResult.error);
          }
        } catch (createError) {
          console.error('Failed to create missing profile in getUserProfile:', createError);
        }
      }
      
      // Return merged user data (auth + profile)
      return {
        id: authUser.id,
        email: authUser.email || '',
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        createdAt: new Date(authUser.created_at || new Date()),
        subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return this.mapSupabaseUser(authUser);
    }
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
      
      const user = await this.getUserProfile(data.user);
      
      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'An error occurred during sign in' };
    }
  },
  
  /**
   * Sign in with a third-party provider (Google, GitHub, etc.)
   */
  async signInWithProvider(provider: Provider) {
    checkSupabaseConfig();
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Include additional scopes to request user profile data
          scopes: provider === 'google' ? 'email profile' : undefined
        }
      });
      
      if (error) {
        console.error(`Sign in with ${provider} error:`, error.message);
        return { success: false, error: error.message };
      }
      
      return {
        success: true,
        url: data.url
      };
    } catch (error: any) {
      console.error(`Sign in with ${provider} error:`, error);
      return { success: false, error: error.message || `An error occurred during ${provider} sign in` };
    }
  },
  
  /**
  * Handle OAuth callback and get user data
  * This is also used for email verification callbacks and magic links
  */
  async handleOAuthCallback() {
  checkSupabaseConfig();
  
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
  
  // CRITICAL CHANGE: Always try to create or update the profile
  // This ensures that even if profile creation failed during signup,
  // it will be created here
  try {
  const userId = data.session.user.id;
  const email = data.session.user.email || '';
  
  if (!userId || !email) {
      console.error('Invalid user data in callback - missing ID or email');
    return { success: false, error: 'Invalid user data in callback' };
    }
    
    // Get user metadata for names
    const metadata = data.session.user.user_metadata || {};
  const firstName = metadata.first_name || metadata.given_name || 'User';
  const lastName = metadata.last_name || metadata.family_name || 'Name';
  
  // First, check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
  .maybeSingle();
  
  if (!existingProfile) {
  // Profile doesn't exist, create it directly
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
      id: userId,
        email: email,
      first_name: firstName,
        last_name: lastName,
          created_at: new Date().toISOString(),
        subscription_tier: SubscriptionTier.FREE
        });
        
      if (insertError) {
        console.error('Error creating profile in callback:', insertError);
        // We'll continue anyway - user might still be able to log in
      } else {
      console.log('Successfully created profile for user:', userId);
    }
  } else {
  console.log('Profile already exists for user:', userId);
  }
  } catch (profileError) {
    console.error('Error handling profile in callback:', profileError);
    // Continue anyway, as the user might still be able to log in
  }
  
  // Try to get the user profile
    const user = await this.getUserProfile(data.session.user);
  
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
   * Sign up a new user with email and password
   */
  async signUp(email: string, password: string, firstName?: string, lastName?: string) {
    checkSupabaseConfig();
    
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        return { success: false, error: error.message };
      }
      
      // Create profile entry in our database
      if (data.user) {
        // Use our centralized profile verification function
        const profileResult = await verifyAndEnsureProfile(
          data.user.id,
          email,
          firstName || 'User',
          lastName || 'Name'
        );
        
        if (!profileResult.success) {
          console.error('Error ensuring profile in signUp:', profileResult.error);
          // Continue anyway - profile will be created on first login
        } else {
          console.log(`Profile ${profileResult.action} during signUp:`, data.user.id);
        }
      }
      
      return {
        success: true,
        user: {
          id: data.user?.id || '',
          email: email,
          firstName: firstName,
          lastName: lastName,
          createdAt: new Date(),
          subscriptionTier: SubscriptionTier.FREE
        },
        confirmEmail: true
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'An error occurred during sign up' };
    }
  },
  
  /**
   * Sign out the current user
   */
  async signOut() {
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
  },
  
  // Method still in the service object for backward compatibility
  resetPassword,
  
  /**
   * Update the user's password
   */
  async updatePassword(password: string) {
    checkSupabaseConfig();
    
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        console.error('Update password error:', error.message);
        return { success: false, error: error.message };
      }
      
      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { success: false, error: error.message || 'An error occurred while updating password' };
    }
  },
  
  // Method still in the service object for backward compatibility
  getCurrentUser,
  
  /**
   * Update the user's profile
   */
  async updateProfile(userId: string, profileData: any) {
    checkSupabaseConfig();
    
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
   * Update a user's subscription tier
   */
  async updateSubscriptionTier(userId: string, tier: SubscriptionTier) {
    checkSupabaseConfig();
    
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
        .single();
      
      // Return updated user
      return {
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email || '',
          createdAt: new Date(userData.user.created_at || new Date()),
          subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
        }
      };
    } catch (error: any) {
      console.error('Update subscription error:', error);
      return { success: false, error: error.message || 'An error occurred while updating subscription' };
    }
  }
};

/**
 * Send a magic link for passwordless login
 */
export async function sendMagicLink(email: string) {
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getMagicLinkEmailTemplate();
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        ...(emailTemplate && { emailTemplate })
      }
    });
    
    if (error) {
      console.error('Magic link error:', error.message);
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Magic link sent to your email'
    };
  } catch (error: any) {
    console.error('Magic link error:', error);
    return { success: false, error: error.message || 'An error occurred sending magic link' };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
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
    
    // Check if this is the first login after email confirmation
    const isFirstLoginAfterConfirmation = data.user && data.user.email_confirmed_at && 
      data.user.last_sign_in_at && 
      // If confirmation time and first login are close (within 5 minutes)
      (new Date(data.user.email_confirmed_at).getTime() - new Date(data.user.last_sign_in_at).getTime() < 300000);
    
    if (isFirstLoginAfterConfirmation) {
      console.log('First login after email confirmation detected, ensuring profile exists...');
    }
    
    // Always try to create a profile for this user if needed
    // This is crucial for users who just confirmed their email
    try {
      const metadata = data.user?.user_metadata || {};
      const firstName = metadata.first_name || metadata.given_name || 'User';
      const lastName = metadata.last_name || metadata.family_name || 'Name';
      
      // Force profile check/creation
      const profileResult = await verifyAndEnsureProfile(
        data.user?.id || '',
        email,
        firstName,
        lastName
      );
      
      if (profileResult.success) {
        console.log(`Profile ${profileResult.action} during signin:`, data.user?.id);
      } else {
        console.error('Error ensuring profile exists during signin:', profileResult.error);
      }
    } catch (profileError) {
      console.error('Critical error handling profile during signin:', profileError);
    }
    
    // Get user profile - this should now exist
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('Failed to get user after profile creation - critical error');
      return { 
        success: false, 
        error: 'Failed to retrieve user profile after login. Please contact support.' 
      };
    }
    
    return {
      success: true,
      user,
      session: data.session,
      requiresEmailConfirmation: false
    };
  } catch (error: any) {
    // Check for verification error in the message
    const isVerificationError = 
      error.message?.toLowerCase().includes('email') && 
      error.message?.toLowerCase().includes('verify');
    
    return { 
      success: false, 
      error: error.message || 'An error occurred during sign in',
      requiresEmailConfirmation: isVerificationError
    };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, firstName?: string, lastName?: string) {
  checkSupabaseConfig();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Create profile in database
    if (data.user) {
      // Use our centralized profile verification
      const profileResult = await verifyAndEnsureProfile(
        data.user.id, 
        email, 
        firstName || 'User', 
        lastName || 'Name'
      );
      
      if (!profileResult.success) {
        console.error('Error creating profile during signup:', profileResult.error);
        // Continue with the sign-up flow despite profile creation error
        // The profile will be auto-created on first login
      } else {
        console.log(`Profile ${profileResult.action} for new user:`, data.user.id);
      }
    }
    
    return {
      success: true,
      user: data.user ? {
        id: data.user.id,
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        createdAt: new Date(),
        subscriptionTier: SubscriptionTier.FREE
      } : null,
      session: data.session,
      requiresEmailConfirmation: true,
      message: 'Please check your email to confirm your account before logging in.'
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message || 'An error occurred during sign up' };
  }
}


/**
 * Sign in with a social provider
 */
export async function signInWithSocialProvider(provider: string) {
  checkSupabaseConfig();
  
  try {
    // Use our type-safe OAuth sign-in function
    const { data, error } = await safeOAuthSignIn(
      provider,  // The safeOAuthSignIn function handles the type conversion internally
      `${window.location.origin}/auth/callback`
    );
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, url: data.url };
  } catch (error: any) {
    return { success: false, error: error.message || `Error signing in with ${provider}` };
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
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getVerificationEmailTemplate();
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        ...(emailTemplate && { emailTemplate })
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Verification email has been resent. Please check your inbox.'
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error resending verification email' };
  }
}

/**
 * Verify and ensure user profile exists
 * This function can be called to check if a user's profile exists and create it if needed
 */
export async function verifyAndEnsureProfile(userId: string, email: string, firstName?: string, lastName?: string) {
  checkSupabaseConfig();
  
  try {
    if (!userId) {
      console.error('No user ID provided to verifyAndEnsureProfile');
      return { success: false, error: 'No user ID provided' };
    }
    
    // Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (!profileData || (profileError && profileError.code === 'PGSQL_ERROR_NO_ROWS')) {
      console.log(`Profile doesn't exist for user ${userId}, creating it now...`);
      
      // Profile doesn't exist, create it with retry logic
      let createAttempts = 0;
      const maxAttempts = 3;
      let lastError = null;
      
      while (createAttempts < maxAttempts) {
        try {
          createAttempts++;
          const currentAttempt = createAttempts; // Capture current attempt count in a local variable
          
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              email: email || '',
              first_name: firstName || 'User',
              last_name: lastName || 'Name',
              created_at: new Date().toISOString(),
              subscription_tier: SubscriptionTier.FREE
            }]);
            
          if (!createError) {
            // Profile created successfully
            console.log(`Profile created for user ${userId} after ${currentAttempt} attempt(s)`);
            return { success: true, message: 'Profile created successfully', action: 'created' };
          }
          
          lastError = createError;
          console.warn(`Profile creation attempt ${currentAttempt} failed:`, createError.message);
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 500 * currentAttempt));
        } catch (err) {
          lastError = err;
          console.warn(`Exception during profile creation attempt ${createAttempts}:`, err);
        }
      }
      
      // If we got here, all attempts failed
      console.error(`Failed to create profile after ${maxAttempts} attempts:`, lastError);
      return { success: false, error: lastError?.message || 'Failed to create profile after multiple attempts' };
    } else if (profileError) {
      console.error('Error checking profile in verifyAndEnsureProfile:', profileError);
      return { success: false, error: profileError.message };
    }
    
    // Profile already exists, check if it needs to be updated
    const updateData: any = {};
    let needsUpdate = false;
    
    // Add missing fields if any
    if (!profileData.email && email) {
      updateData.email = email;
      needsUpdate = true;
    }
    
    if (!profileData.first_name && firstName) {
      updateData.first_name = firstName;
      needsUpdate = true;
    } else if (!profileData.first_name) {
      updateData.first_name = 'User';
      needsUpdate = true;
    }
    
    if (!profileData.last_name && lastName) {
      updateData.last_name = lastName;
      needsUpdate = true;
    } else if (!profileData.last_name) {
      updateData.last_name = 'Name';
      needsUpdate = true;
    }
    
    if (!profileData.subscription_tier) {
      updateData.subscription_tier = SubscriptionTier.FREE;
      needsUpdate = true;
    }
    
    // Update if needed
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating profile in verifyAndEnsureProfile:', updateError);
        return { success: false, error: updateError.message };
      }
      
      console.log(`Profile updated with missing fields for user ${userId}`);
      return { success: true, message: 'Profile updated successfully', action: 'updated' };
    }
    
    return { success: true, message: 'Profile verified and exists', action: 'verified' };
  } catch (error: any) {
    console.error('Error in verifyAndEnsureProfile:', error);
    return { success: false, error: error.message || 'An error occurred verifying profile' };
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
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error signing out' };
  }
}

/**
 * Direct access authentication - bypasses normal login flow
 * Uses a magic link to authenticate the user
 */
export async function directAccessLogin(email: string) {
  checkSupabaseConfig();
  
  try {
    // Get email template if available
    const emailTemplate = getMagicLinkEmailTemplate();
    
    // Step 1: Send a magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        ...(emailTemplate && { emailTemplate })
      }
    });
    
    if (error) {
      console.error('Direct access login error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Step 2: Ensure profile exists (will be used when the user clicks the link)
    try {
      // Find the user by email from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .maybeSingle();
      
      // If profile doesn't exist, we'll handle it when the user clicks the link
      // through our enhanced callback handler
      if (!profileData || !profileData.id) {
        console.log('No profile found for email:', email, 'Will create during callback.');
      }
    } catch (profileError) {
      // Ignore profile lookup errors - we'll handle it when the user clicks the link
      console.warn('Profile lookup warning:', profileError);
    }
    
    return {
      success: true,
      message: 'Access link sent to your email. Please check your inbox and click the link to log in.'
    };
  } catch (error: any) {
    console.error('Direct access login error:', error);
    return { success: false, error: error.message || 'An error occurred during direct access login' };
  }
}

export default authService;