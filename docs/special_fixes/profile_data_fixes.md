# Profile Data Fixes

## Problem: Missing Profile Data

### Issue
When users registered and verified their email addresses, a profile record was created in the `profiles` table, but the email, first_name, and last_name fields were not being saved properly.

### Root Cause
1. The database table structure might have been missing these columns
2. The code was using `undefined` values which might not work well with the database
3. The profile creation code didn't have adequate error handling or fallbacks

## Solution 1: Improved Profile Creation Helper

### Implementation
Created a robust helper function to handle profile creation with better handling of optional fields:

```typescript
// Helper to create profile with only verified fields
const createUserProfile = async (
  userId: string,
  email: string = '',
  firstName: string = '',
  lastName: string = '',
  subscriptionTier: SubscriptionTier = SubscriptionTier.FREE
) => {
  try {
    // First, check if the profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      console.log('Profile already exists, checking if update needed');
      
      // If profile exists but is missing data, update it
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileData) {
        const needsUpdate = 
          (email && (!profileData.email || profileData.email === '')) ||
          (firstName && (!profileData.first_name || profileData.first_name === '')) ||
          (lastName && (!profileData.last_name || profileData.last_name === ''));
          
        if (needsUpdate) {
          console.log('Updating existing profile with missing data');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              email: email || profileData.email,
              first_name: firstName || profileData.first_name,
              last_name: lastName || profileData.last_name
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating profile:', updateError);
          } else {
            console.log('Profile updated successfully');
          }
        }
      }
      return;
    }

    // Create profile with all fields we'd like to include
    const profileData: Record<string, any> = {
      id: userId,
      subscription_tier: subscriptionTier,
      created_at: new Date().toISOString(),
    };
    
    // Add optional fields if available
    if (email) {
      profileData.email = email;
      console.log('Adding email to profile:', email);
    }
    
    if (firstName) {
      profileData.first_name = firstName; 
      console.log('Adding first_name to profile:', firstName);
    }
    
    if (lastName) {
      profileData.last_name = lastName;
      console.log('Adding last_name to profile:', lastName);
    }

    console.log('Creating profile with data:', profileData);
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profileData]);

    // Error handling and fallback mechanism
    if (profileError) {
      console.error('Error creating profile:', profileError);
      if (profileError.message && profileError.message.includes('column')) {
        console.warn('Column error detected, profile table may have different structure than expected');
        
        // Try with minimal data as fallback
        const minimalData = {
          id: userId,
          subscription_tier: subscriptionTier,
          created_at: new Date().toISOString()
        };
        
        const { error: retryError } = await supabase
          .from('profiles')
          .insert([minimalData]);
          
        if (retryError) {
          console.error('Still failed to create profile with minimal data:', retryError);
        } else {
          console.log('Profile created with minimal data');
        }
      }
    } else {
      console.log('Profile created successfully with all fields');
    }
  } catch (err) {
    console.error('Error in createUserProfile:', err);
  }
};
```

### Key Improvements
1. Added check for existing profiles to avoid duplicates
2. Added ability to update existing profiles with missing data
3. Used explicit string values instead of `undefined` for better database compatibility
4. Added extensive logging for troubleshooting
5. Implemented fallback mechanism if column errors occur
6. Added proper TypeScript typing with `Record<string, any>` for dynamic objects

## Solution 2: Database Schema Updates

Created SQL scripts to ensure the database has the correct schema:

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
```

## Solution 3: Diagnostic Tools

Added a `debugProfileTable` function to help diagnose table structure issues:

```typescript
/**
 * Debug helper to check profile table structure
 */
export const debugProfileTable = async () => {
  try {
    // First try to get a profile to see its structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying profiles table:', error);
    } else {
      console.log('Profile table structure sample:', data);
    }
    
    // Try to get column definitions
    try {
      const { data: tableInfo } = await supabase
        .rpc('get_table_info', { table_name: 'profiles' });
      console.log('Profiles table info:', tableInfo);
    } catch (err) {
      console.log('Could not get table info, might not have rpc access');
    }
  } catch (err) {
    console.error('Error debugging profile table:', err);
  }
};
```

## Testing Profile Data Fixes

To test the profile data fixes:

1. First, run the SQL scripts to ensure the table structure is correct
2. Register a new user with first name and last name
3. Verify the email address
4. Log in and check the user profile
5. Verify in the database that all fields are saved correctly

If issues persist, check the browser console for detailed error messages from the debugging tools.
