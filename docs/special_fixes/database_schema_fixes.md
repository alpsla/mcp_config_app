# Database Schema Fixes

## Problem: Missing Database Columns

### Issue
The user profile data (email, first name, last name) was not being properly saved because the corresponding columns may not exist in the profiles table.

### Root Cause
The profiles table either did not exist or was missing the required columns for storing user profile data.

## Solution: SQL Scripts for Database Updates

Created SQL scripts to ensure the database schema is correct and contains all necessary columns.

### Script 1: Create Profiles Table

This script creates the profiles table if it doesn't exist, with all required columns and proper constraints:

```sql
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
```

### Script 2: Add Missing Columns

This script checks for and adds the email, first_name, and last_name columns if they don't exist:

```sql
-- Check if columns exist, if not add them
DO $$ 
BEGIN
  -- Check and add email column if needed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='email') THEN
    ALTER TABLE profiles ADD COLUMN email VARCHAR(255);
  END IF;

  -- Check and add first_name column if needed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='first_name') THEN
    ALTER TABLE profiles ADD COLUMN first_name VARCHAR(100);
  END IF;

  -- Check and add last_name column if needed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='last_name') THEN
    ALTER TABLE profiles ADD COLUMN last_name VARCHAR(100);
  END IF;
END $$;

-- Update existing profiles with email data from auth.users
UPDATE profiles p
SET email = a.email
FROM auth.users a
WHERE p.id = a.id 
AND (p.email IS NULL OR p.email = '');

-- Log the columns for verification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
```

## Implementation Instructions

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Run the scripts in this order:
   a. First run `create_profiles_table.sql` to ensure the profiles table exists
   b. Then run `add_profile_columns.sql` to add or update needed columns

## Alternative: Simple Query

If you prefer a simpler approach, you can run this basic query directly:

```sql
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Update existing profiles with email data from auth.users
UPDATE profiles p
SET email = a.email
FROM auth.users a
WHERE p.id = a.id 
AND (p.email IS NULL OR p.email = '');
```

## Troubleshooting Profile Fields

If profile fields are still not saving correctly:

1. Check that the columns exist in the `profiles` table:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'profiles';
   ```

2. If you see no results, the profiles table might not exist. Run the script to create it.

3. Verify the RLS (Row Level Security) policies are not preventing insertions.

4. Check for data in profiles table:
   ```sql
   SELECT * FROM profiles LIMIT 10;
   ```

5. Check the browser console for any errors during profile creation
