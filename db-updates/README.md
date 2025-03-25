# Database Updates

This folder contains SQL scripts to update the database schema when needed.

## How to Apply These Updates

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Run the scripts in the following order:

   a. First run `create_profiles_table.sql` to ensure the profiles table exists
   b. Then run `add_profile_columns.sql` to add or update needed columns

## Manual SQL Query

If you prefer, you can also run this basic query to add the email column directly:

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

## Troubleshooting Profile Fields Not Saving

If profile fields are still not saving correctly:

1. Check that the columns exist in the `profiles` table:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'profiles';
   ```

2. If you see no results, the profiles table might not exist. Run the script to create it:
   ```sql
   -- See create_profiles_table.sql for the full script
   ```

3. Verify the RLS (Row Level Security) policies are not preventing insertions.

4. Check for data in profiles table:
   ```sql
   SELECT * FROM profiles LIMIT 10;
   ```
