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

-- Update existing profiles that may be missing email values
UPDATE profiles p
SET email = a.email
FROM auth.users a
WHERE p.id = a.id 
AND (p.email IS NULL OR p.email = '');

-- Log the columns for verification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
