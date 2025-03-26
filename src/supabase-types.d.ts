// Import the necessary modules
import '@supabase/supabase-js';

// Add Provider type extension
declare module '@supabase/supabase-js' {
  namespace Provider {
    type Provider = 'google' | 'github' | 'facebook' | 'twitter' | 'apple' | 'azure' | 'discord' | 'gitlab' | 'bitbucket' | 'linkedin' | 'notion' | 'slack' | 'spotify' | 'twitch' | 'workos' | 'zoom' | string;
  }

  interface SupabaseAuthClient {
    signInWithOAuth(options: {
      provider: Provider.Provider;
      options?: {
        redirectTo?: string;
        scopes?: string;
        [key: string]: any;
      };
    }): Promise<any>;
  }
}