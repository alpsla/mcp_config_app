import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User, SubscriptionTier } from '../../types';
import { getVerificationEmailTemplate, getPasswordResetEmailTemplate } from './emailTemplates';

/**
 * Get the application's public URL for redirects
 */
const getPublicUrl = (): string => {
  // Use the environment variable if available, otherwise fallback to window.location.origin
  return process.env.REACT_APP_PUBLIC_URL || window.location.origin;
};

/**
 * Debug helper to check profile table structure
 */
export const debugProfileTable = async () => {
  try {
    // First try to get a profile to see its structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying profiles table:', error);
    } else {
      console.log('Profile table structure sample:', data);
    }
    
    // Try to get column definitions
    try {
      const { data: tableInfo } = await supabase
        .rpc('get_table_info', { table_name: 'profiles' });
      console.log('Profiles table info:', tableInfo);
    } catch (err) {
      console.log('Could not get table info, might not have rpc access');
    }
  } catch (err) {
    console.error('Error debugging profile table:', err);
  }
};

// Helper function to transform Supabase user to our User type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id || '',
    email: supabaseUser.email || '',
    firstName: supabaseUser.user_metadata?.first_name || undefined,
    lastName: supabaseUser.user_metadata?.last_name || undefined,
    createdAt: new Date(supabaseUser.created_at || new Date()),
    subscriptionTier: SubscriptionTier.FREE
  };
};

// Helper to create profile with only verified fields
const createUserProfile = async (
  userId: string,
  email: string = '',
  firstName: string = '',
  lastName: string = '',
  subscriptionTier: SubscriptionTier = SubscriptionTier.FREE
) => {
  try {
    // First, check if the profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      console.log('Profile already exists, checking if update needed');
      
      // If profile exists but is missing data, update it
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileData) {
        const needsUpdate = 
          (email && (!profileData.email || profileData.email === '')) ||
          (firstName && (!profileData.first_name || profileData.first_name === '')) ||
          (lastName && (!profileData.last_name || profileData.last_name === ''));
          
        if (needsUpdate) {
          console.log('Updating existing profile with missing data');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              email: email || profileData.email,
              first_name: firstName || profileData.first_name,
              last_name: lastName || profileData.last_name
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating profile:', updateError);
          } else {
            console.log('Profile updated successfully');
          }
        }
      }
      return;
    }

    // Create profile with all fields we'd like to include
    const profileData: Record<string, any> = {
      id: userId,
      subscription_tier: subscriptionTier,
      created_at: new Date().toISOString(),
    };
    
    // Add optional fields if available
    if (email) {
      profileData.email = email;
      console.log('Adding email to profile:', email);
    }
    
    if (firstName) {
      profileData.first_name = firstName; 
      console.log('Adding first_name to profile:', firstName);
    }
    
    if (lastName) {
      profileData.last_name = lastName;
      console.log('Adding last_name to profile:', lastName);
    }

    console.log('Creating profile with data:', profileData);
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profileData]);

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Check for specific column errors in the error message
      if (profileError.message && profileError.message.includes('column')) {
        console.warn('Column error detected, profile table may have different structure than expected');
        
        // Try with minimal data as fallback
        const minimalData = {
          id: userId,
          subscription_tier: subscriptionTier,
          created_at: new Date().toISOString()
        };
        
        const { error: retryError } = await supabase
          .from('profiles')
          .insert([minimalData]);
          
        if (retryError) {
          console.error('Still failed to create profile with minimal data:', retryError);
        } else {
          console.log('Profile created with minimal data');
        }
      }
    } else {
      console.log('Profile created successfully with all fields');
    }
  } catch (err) {
    console.error('Error in createUserProfile:', err);
  }
};

// Types
export interface AuthResponse {
  user: User | null;
  session?: any;
  error?: string;
  requiresEmailConfirmation?: boolean;
  message?: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<AuthResponse> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // Check if the user already exists
    const { data: existingUserCheck, error: checkError } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-for-check-only'  // This won't log in but will tell us if the user exists
    });
    
    // If there's no "invalid credentials" error, the user exists
    if (checkError) {
      if (!checkError.message.includes('Invalid login credentials')) {
        // Some other error occurred
        throw checkError;
      }
      // Error just indicates invalid password, which is expected - user might exist
    } else if (existingUserCheck.user) {
      // User exists and unexpectedly logged in with dummy password (unlikely)
      console.log('User already exists with email:', email);
      return { user: null, error: 'This email is already registered. Please log in instead.' };
    }

    // Get custom template
    const customTemplate = getVerificationEmailTemplate();

    // Normal sign-up flow
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getPublicUrl()}/verify-email`,
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
          email: email
        },
        // Add custom email template if available
        ...(customTemplate ? { emailTemplate: customTemplate } : {})
      }
    });

    if (error) throw error;
    
    // Check if email confirmation is required
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      throw new Error('This email is already registered. Please log in instead.');
    }
    
    // Check if the user needs to confirm their email
    // In Supabase v2, email confirmation is required by default unless changed in dashboard
    // !data.session indicates email confirmation is needed
    if (data.user && !data.session) {
      console.log('Email confirmation required for:', email);
      return { 
        user: null, 
        requiresEmailConfirmation: true,
        message: 'Please check your email to confirm your account before logging in.' 
      };
    }

    // If we have a session, the user is confirmed (auto-confirm enabled in Supabase)
    if (data.session) {
        // Try to create a profile for the user
        await createUserProfile(
          data.user?.id || '',
          email,
          firstName || '',
          lastName || '',
          SubscriptionTier.FREE
        );

        // Create a default user profile
        const user: User = {
          id: data.user?.id || '',
          email: email,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          createdAt: new Date(),
          subscriptionTier: SubscriptionTier.FREE
        };

        return { user, session: data.session };
      }

    // Fallback case - shouldn't reach here in normal flow
    return { 
      user: null, 
      requiresEmailConfirmation: true,
      message: 'Account created. Please check your email to complete registration.' 
    };
  } catch (error: any) {
    console.error('Sign up error:', error.message);
    return { user: null, error: error.message };
  }
};

// Helper function to extract error information from Supabase errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const extractErrorInfo = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    console.log('Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error.message);
      // Check for specific error messages that indicate email verification issues
      if (error.message.includes('Email not confirmed') ||
          error.message.includes('not verified')) {
        
        console.log('User exists but email not confirmed:', email);
        return {
          user: null,
          error: 'Email not verified. Please check your inbox and confirm your email before logging in.',
          requiresEmailConfirmation: true
        };
      }
      throw error;
    }

    console.log('Sign in successful for:', email);
    
    // Get user profile data
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    // If profile doesn't exist, create it
    if (!userProfile) {
      console.log('Creating profile for user:', data.user?.id);
      await createUserProfile(
        data.user?.id || '',
        data.user?.email || '',
        '',
        '',
        SubscriptionTier.FREE
      );
    }

    // Create a user object that combines auth data and profile data
    const user: User = {
      id: data.user?.id || '',
      email: data.user?.email || '',
      firstName: userProfile?.first_name || undefined,
      lastName: userProfile?.last_name || undefined,
      createdAt: new Date(data.user?.created_at || new Date()),
      subscriptionTier: userProfile?.subscription_tier || SubscriptionTier.FREE
    };

    return { user, session: data.session };
  } catch (error: any) {
    console.error('Sign in error:', error.message);
    return { user: null, error: error.message };
  }
};

/**
 * Sign in with a social provider (Google, GitHub, etc.)
 */
export const signInWithSocialProvider = async (
  provider: 'google' | 'github' | 'facebook'
): Promise<void> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: getPublicUrl()
      }
    });

    if (error) throw error;
  } catch (error: any) {
    console.error(`Sign in with ${provider} error:`, error.message);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Sign out error:', error.message);
    throw error;
  }
};

/**
 * Get the current user session
 */
export const getCurrentSession = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return { session: null, user: null };
    }

    const { data } = await supabase.auth.getSession();
    return data;
  } catch (error: any) {
    console.error('Get session error:', error.message);
    return { session: null, user: null };
  }
};

/**
 * Get the current user data
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return null;
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    // Get user profile data from the profiles table
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    // Create a user object that combines auth data and profile data
    const user: User = {
      id: userData.user.id,
      email: userData.user.email || '',
      firstName: profileData?.first_name || undefined,
      lastName: profileData?.last_name || undefined,
      createdAt: new Date(userData.user.created_at || new Date()),
      subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
    };

    return user;
  } catch (error: any) {
    console.error('Get current user error:', error.message);
    return null;
  }
};

/**
 * Reset password with email
 */
export const resetPassword = async (email: string): Promise<{ error?: string, message?: string, success?: boolean }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    console.log('Attempting to send password reset to:', email);
    
    // Get custom template
    const customTemplate = getPasswordResetEmailTemplate();
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getPublicUrl()}/reset-password`,
      ...(customTemplate ? { emailTemplate: customTemplate } : {})
    });

    console.log('Password reset API response:', { data, error });
    
    // Special handling for rate limit errors
    if (error && error.message.includes('rate limit')) {
      return { 
        error: 'Too many requests. Please wait a few minutes before trying again.' 
      };
    }
    
    // Even if there's an error, we don't want to reveal if the account exists or not
    // So we'll always return a success message for security reasons
    if (error) {
      console.error('Password reset error, but not revealing to user:', error.message);
      // We still return success to not reveal account existence
      return { message: 'If an account exists with this email, password reset instructions have been sent.' };
    }
    
    console.log('Password reset email sent successfully to:', email);
    return { success: true, message: 'Password reset instructions have been sent to your email address. Please check your inbox including spam/junk folders.' };
  } catch (error: any) {
    console.error('Reset password error:', error.message);
    return { error: error.message };
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (email: string): Promise<{ error?: string, message?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    console.log('Attempting to resend verification email to:', email);
    
    // Get custom template
    const customTemplate = getVerificationEmailTemplate();
    
    // Use the resend method directly - much more reliable than trying to sign up again
    const { error } = await supabase.auth.resend({
      type: 'signup', // Type must be 'signup' for a new verification email
      email: email,
      options: {
        emailRedirectTo: `${getPublicUrl()}/verify-email`,
        captchaToken: undefined, // This can be used if you need CAPTCHA
        // Add custom email template if available
        ...(customTemplate ? { emailTemplate: customTemplate } : {})
      }
    });

    if (error) {
      // If it's a rate limit error, provide a more user-friendly message
      if (error.message.includes('rate limit')) {
        return { 
          error: 'Too many requests. Please wait a few minutes before trying again.' 
        };
      }
      
      throw error;
    }
    
    console.log('Verification email resent successfully to:', email);
    return { message: 'Verification email has been sent. Please check your inbox.' };
  } catch (error: any) {
    console.error('Resend verification email error:', error.message);
    return { error: error.message };
  }
};

/**
 * Send a magic link email for passwordless login
 */
export const sendMagicLink = async (email: string): Promise<{ error?: string, message?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    console.log('Attempting to send magic link to:', email);
    
    // Use the signInWithOtp method to send a magic link
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getPublicUrl()}`,
      }
    });

    console.log('Magic link API response:', { data, error });
    
    // Special handling for rate limit errors
    if (error && error.message.includes('rate limit')) {
      return { 
        error: 'Too many requests. Please wait a few minutes before trying again.' 
      };
    }
    
    // Even if there's an error, we don't want to reveal if the account exists or not
    // So we'll always return a success message for security reasons
    if (error) {
      console.error('Magic link error, but not revealing to user:', error.message);
      // We still return success to not reveal account existence
      return { message: 'If an account exists with this email, a login link will be sent.' };
    }
    
    console.log('Magic link sent successfully to:', email);
    return { message: 'Login link has been sent. Please check your email.' };
  } catch (error: any) {
    console.error('Magic link error:', error.message);
    return { error: error.message };
  }
};

/**
 * Update password
 */
export const updatePassword = async (password: string): Promise<{ error?: string }> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    console.log('Attempting to update password');
    
    // Check for the reset code in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetCode = urlParams.get('code');
    
    // If we have a reset code, we need to verify it first
    if (resetCode) {
      console.log('Using reset code to update password');
      
      try {
        // Use the updateUser API with the code
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase.auth.updateUser({ 
          password: password 
        });
        
        if (error) {
          throw error;
        }
        
        console.log('Password updated successfully with reset code');
        return {};
      } catch (resetCodeError: any) {
        console.error('Error using reset code:', resetCodeError);
        throw resetCodeError;
      }
    }
    
    // If no reset code, use the standard update method
    // which requires an active session
    console.log('Using session to update password');
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Current session data:', sessionData);
    
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    console.log('Password update API response:', { data, error });
    
    if (error) {
      console.error('Update password error from API:', error);
      throw error;
    }
    
    console.log('Password updated successfully');
    return {};
  } catch (error: any) {
    console.error('Update password error:', error.message);
    return { error: error.message };
  }
};
