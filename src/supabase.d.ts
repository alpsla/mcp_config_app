// Extend @supabase/supabase-js types to allow string as Provider
import '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  interface SupabaseAuthClient {
    signInWithOAuth(options: {
      provider: string;
      options?: {
        redirectTo?: string;
        scopes?: string;
        [key: string]: any;
      };
    }): Promise<any>;
  }
}