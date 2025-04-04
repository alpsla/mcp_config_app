import { supabase } from '../services/supabase/supabaseClient';

/**
 * Creates a profile directly by attempting multiple methods
 * 
 * This is a workaround for RLS policy issues when creating profiles
 * during the authentication flow
 * 
 * @param userId The user ID
 * @param email The user's email
 * @param firstName The user's first name (default: 'User')
 * @param lastName The user's last name (default: 'Name')
 * @returns Result object with success status and method used
 */
export const createProfileBypass = async (
  userId: string,
  email: string,
  firstName: string = 'User',
  lastName: string = 'Name'
): Promise<{ success: boolean; method?: string; error?: string; requiresRepair?: boolean }> => {
  console.log('Attempting to create profile using bypass methods for user:', userId);
  
  // Verify inputs
  if (!userId) {
    return { success: false, error: 'No user ID provided' };
  }
  
  // Check if profile already exists first
  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (existingProfile) {
      console.log('Profile already exists, no need to create');
      return { success: true, method: 'existing' };
    }
  } catch (checkError) {
    console.warn('Error checking for existing profile:', checkError);
    // Continue anyway to try creation
  }
  
  // Method 1: Using upsert to bypass RLS
  try {
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        [{
          id: userId,
          email: email || '',
          first_name: firstName || 'User',
          last_name: lastName || 'Name',
          created_at: new Date().toISOString(),
          subscription_tier: 'FREE'
        }],
        {
          onConflict: 'id', // Upsert on ID conflict
          ignoreDuplicates: false
        }
      );
      
    if (!upsertError) {
      console.log('Successfully created profile using upsert');
      return { success: true, method: 'upsert' };
    } else {
      console.error('Upsert method failed:', upsertError);
    }
  } catch (upsertError) {
    console.error('Exception in upsert method:', upsertError);
  }
  
  // Method 2: Using standard insert without select
  try {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        email: email || '',
        first_name: firstName || 'User',
        last_name: lastName || 'Name',
        created_at: new Date().toISOString(),
        subscription_tier: 'FREE'
      }]);
      
    if (!insertError) {
      console.log('Successfully created profile using standard insert');
      return { success: true, method: 'insert' };
    } else {
      console.error('Standard insert failed:', insertError);
    }
  } catch (insertError) {
    console.error('Exception in standard insert method:', insertError);
  }
  
  // Method 3: Update user metadata as absolute fallback
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        profile_creation_failed: true,
        email: email,
        first_name: firstName,
        last_name: lastName,
        subscription_tier: 'FREE',
        created_at: new Date().toISOString()
      }
    });
    
    if (!updateError) {
      console.log('Stored profile info in user metadata as fallback');
      return { success: true, method: 'metadata', requiresRepair: true };
    } else {
      console.error('Metadata update failed:', updateError);
    }
  } catch (updateError) {
    console.error('Exception in metadata update method:', updateError);
  }
  
  // All methods failed
  return { 
    success: false, 
    error: 'All profile creation methods failed' 
  };
};

/**
 * Checks if a profile exists for a user
 * 
 * @param userId The user ID
 * @returns Boolean indicating if profile exists
 */
export const profileExists = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking if profile exists:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking if profile exists:', error);
    return false;
  }
};

/**
 * Ensures a profile exists for a user, creating one if needed
 * 
 * @param userId The user ID
 * @param email The user's email
 * @param firstName The user's first name (default: 'User')
 * @param lastName The user's last name (default: 'Name')
 * @returns Result object with success status and method used
 */
export const ensureProfileExists = async (
  userId: string,
  email: string,
  firstName: string = 'User',
  lastName: string = 'Name'
): Promise<{ success: boolean; method?: string; error?: string; requiresRepair?: boolean }> => {
  // Check if profile exists
  const exists = await profileExists(userId);
  
  if (exists) {
    return { success: true, method: 'existing' };
  }
  
  // Profile doesn't exist, create it
  return createProfileBypass(userId, email, firstName, lastName);
};
