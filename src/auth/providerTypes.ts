// Create a safe version of social login for our app
import { supabase } from '../services/supabase/supabaseClient';

// Create a set of strongly typed provider functions to avoid type errors
export const signInWithGoogle = async (redirectUrl: string) => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl }
  });
};

export const signInWithGithub = async (redirectUrl: string) => {
  return await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: redirectUrl }
  });
};

export const signInWithFacebook = async (redirectUrl: string) => {
  return await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: redirectUrl }
  });
};

// Generic function for type casting
export const safeOAuthSignIn = async (provider: string, redirectUrl: string) => {
  switch (provider.toLowerCase()) {
    case 'google':
      return signInWithGoogle(redirectUrl);
    case 'github':
      return signInWithGithub(redirectUrl);
    case 'facebook':
      return signInWithFacebook(redirectUrl);
    default:
      // For unsupported providers, fallback to any type casting
      const params: any = {
        provider,
        options: { redirectTo: redirectUrl }
      };
      return await supabase.auth.signInWithOAuth(params);
  }
};