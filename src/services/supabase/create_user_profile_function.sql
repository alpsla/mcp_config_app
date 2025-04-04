-- This function creates a user profile with administrative privileges
-- It bypasses RLS policies by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the DB owner
AS $$
DECLARE
  profile_record json;
BEGIN
  -- Insert the profile if it doesn't exist
  INSERT INTO public.profiles (id, email, first_name, last_name, created_at, subscription_tier)
  VALUES (
    user_id, 
    (SELECT email FROM auth.users WHERE id = user_id),
    'User',
    'Name',
    now(),
    'FREE'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Get and return the profile
  SELECT json_build_object(
    'id', id,
    'email', email,
    'first_name', first_name,
    'last_name', last_name,
    'subscription_tier', subscription_tier,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO profile_record
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN profile_record;
END;
$$;

-- Grant execution privileges to authenticated users and the service role
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated, service_role, anon;

-- Add service role policy to allow bypass of RLS
DROP POLICY IF EXISTS "Allow service role full access to profiles" ON public.profiles;
CREATE POLICY "Allow service role full access to profiles" 
ON public.profiles
FOR ALL
TO service_role
USING (true);

-- Add policy for anonymous access during profile creation
DROP POLICY IF EXISTS "Allow anonymous access for initial profile creation" ON public.profiles;
CREATE POLICY "Allow anonymous access for initial profile creation"
ON public.profiles
FOR ALL
TO anon
USING (true);
