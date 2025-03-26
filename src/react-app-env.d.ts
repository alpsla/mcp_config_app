/// <reference types="react-scripts" />

// Augment Provider type in Supabase
import '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface SupabaseAuthClientOptions {
    auth: {
      signInWithOAuth(params: { provider: any; options?: any }): Promise<any>;
    }
  }
}
