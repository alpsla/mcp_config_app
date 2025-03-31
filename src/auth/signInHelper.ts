import { supabase } from '../services/supabase/supabaseClient';

// This helper function will handle the signInWithOAuth in a way that bypasses TypeScript typing issues
export const signInWithOAuthHelper = async (provider: string, redirectTo: string) => {
  // @ts-ignore - Ignoring type checking for provider parameter
  return await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${redirectTo}#/dashboard`
    }
  });
};