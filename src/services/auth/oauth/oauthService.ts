import { Provider } from '@supabase/supabase-js';
import { supabase, checkSupabaseConfig } from '../core/authClient';
import { verifyAndEnsureProfile } from '../profile/profileService';
import { getUserProfile } from '../profile/profileService';

/**
 * Safe OAuth sign-in function with type checking
 */
export async function safeOAuthSignIn(providerString: string, redirectTo: string) {
  // Convert string to Provider type with type safety
  const provider = convertToProvider(providerString);
  
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      scopes: provider === 'google' ? 'email profile' : undefined
    }
  });
}

/**
 * Convert a string to a valid Provider type
 */
export function convertToProvider(providerString: string): Provider {
  const validProviders: Provider[] = [
    'google', 
    'github', 
    'facebook', 
    'twitter', 
    'apple',
    'azure', 
    'bitbucket', 
    'discord', 
    'gitlab', 
    'linkedin', 
    'notion', 
    'slack', 
    'spotify', 
    'workos', 
    'zoom'
  ];
  
  const provider = providerString.toLowerCase() as Provider;
  
  if (!validProviders.includes(provider)) {
    throw new Error(`Invalid provider: ${providerString}`);
  }
  
  return provider;
}

/**
 * Sign in with a social provider
 */
export async function signInWithSocialProvider(provider: string) {
  checkSupabaseConfig();
  
  try {
    // Use our type-safe OAuth sign-in function
    const { data, error } = await safeOAuthSignIn(
      provider,
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
 * Handle OAuth callback and get user data
 */
export async function handleOAuthCallback() {
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
    
    // CRITICAL: Always try to create or update the profile
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
        const profileResult = await verifyAndEnsureProfile(
          userId,
          email,
          firstName,
          lastName
        );
        
        if (!profileResult.success) {
          console.error('Error creating profile in callback:', profileResult.error);
          // Continue anyway - user might still be able to log in
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
}
