export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: 'free' | 'standard' | 'premium';
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          subscription_tier?: 'free' | 'standard' | 'premium';
        };
        Update: {
          email?: string;
          first_name?: string;
          last_name?: string;
          updated_at?: string;
          subscription_tier?: 'free' | 'standard' | 'premium';
        };
      };
      configurations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          config_json: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          user_id: string;
          name: string;
          config_json: string;
        };
        Update: {
          name?: string;
          config_json?: string;
          updated_at?: string;
        };
      };
    };
  };
};