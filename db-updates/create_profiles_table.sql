-- First, let's check if the profiles table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    -- Create the profiles table
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email VARCHAR(255),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      subscription_tier VARCHAR(20) DEFAULT 'free',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add comment to table
    COMMENT ON TABLE profiles IS 'User profile information connected to the auth.users table';

    -- Create indices for common lookups
    CREATE INDEX idx_profiles_email ON profiles(email);
    CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);

    -- Add RLS (Row Level Security) policies
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Policy for users to view their own data
    CREATE POLICY profiles_select_policy ON profiles
      FOR SELECT
      USING (auth.uid() = id);

    -- Policy for users to update their own data
    CREATE POLICY profiles_update_policy ON profiles
      FOR UPDATE
      USING (auth.uid() = id);

    -- Admin can see all profiles (you can adjust this as needed)
    CREATE POLICY profiles_admin_select_policy ON profiles
      FOR SELECT
      USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));
  END IF;
END $$;
