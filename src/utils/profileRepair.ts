/**
 * Profile Repair Utility
 * 
 * This utility can be used to repair existing profiles that may be missing
 * essential fields like email, first_name, and last_name.
 */

import { supabase } from '../services/supabase/supabaseClient';
import { SubscriptionTier } from '../types';

/**
 * Verify that the profiles table exists and has the correct structure
 * This should be run on app initialization
 */
export async function verifyProfilesTable() {
  console.log('ProfileRepair: Verifying profiles table exists...');
  
  try {
    // Check if profiles table exists by doing a simple query
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('ProfileRepair: Error checking profiles table:', error);
      return { success: false, error: error.message };
    }
    
    console.log('ProfileRepair: Profiles table exists');
    return { success: true };
  } catch (error: any) {
    console.error('ProfileRepair: Error verifying profiles table:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Repair a user profile by ensuring all required fields exist
 * @param userId The user ID to repair
 * @param email The email to set if missing
 * @param firstName The first name to set if missing
 * @param lastName The last name to set if missing
 */
export async function repairUserProfile(
  userId: string,
  email: string,
  firstName: string = 'User',
  lastName: string = 'Name'
) {
  console.log(`ProfileRepair: Attempting to repair profile for user ${userId}...`);
  
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (checkError) {
      console.error('ProfileRepair: Error checking profile:', checkError);
      
      if (checkError.code === 'PGSQL_ERROR_NO_ROWS') {
        // No profile found, create one
        console.log('ProfileRepair: No profile found, creating a new one...');
        
        // Try multiple times to create the profile
        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 3;
        let lastError = null;
        
        while (!profileCreated && attempts < maxAttempts) {
          attempts++;
          try {
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: userId,
                  email: email,
                  first_name: firstName,
                  last_name: lastName,
                  created_at: new Date().toISOString(),
                  subscription_tier: SubscriptionTier.FREE
                }
              ]);
            
            if (createError) {
              console.error(`ProfileRepair: Error creating profile (attempt ${attempts}):`, createError);
              lastError = createError;
              // Wait briefly before next attempt
              // eslint-disable-next-line no-loop-func
              await new Promise(resolve => setTimeout(resolve, 500 * attempts));
            } else {
              console.log(`ProfileRepair: Successfully created profile on attempt ${attempts}`);
              profileCreated = true;
              return { success: true, action: 'created' };
            }
          } catch (err) {
            console.error(`ProfileRepair: Exception creating profile (attempt ${attempts}):`, err);
            lastError = err;
            // Wait briefly before next attempt
            // eslint-disable-next-line no-loop-func
            await new Promise(resolve => setTimeout(resolve, 500 * attempts));
          }
        }
        
        return { 
          success: false, 
          error: lastError?.message || 'Failed to create profile after multiple attempts',
          attempts
        };
      }
      
      return { success: false, error: checkError.message };
    }
    
    if (!existingProfile) {
      console.log('ProfileRepair: No profile found, creating a new one...');
      
      // Create profile
      const { error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          email: email,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString(),
          subscription_tier: SubscriptionTier.FREE
        }]);
      
      if (createError) {
        console.error('ProfileRepair: Error creating profile:', createError);
        return { success: false, error: createError.message };
      }
      
      return { success: true, action: 'created' };
    }
    
    // Check which fields need to be updated
    const updates: any = {};
    let needsUpdate = false;
    
    if (!existingProfile.email) {
      updates.email = email;
      needsUpdate = true;
    }
    
    if (!existingProfile.first_name) {
      updates.first_name = firstName;
      needsUpdate = true;
    }
    
    if (!existingProfile.last_name) {
      updates.last_name = lastName;
      needsUpdate = true;
    }
    
    if (!existingProfile.subscription_tier) {
      updates.subscription_tier = SubscriptionTier.FREE;
      needsUpdate = true;
    }
    
    // Update profile if needed
    if (needsUpdate) {
      console.log('ProfileRepair: Updating profile with missing fields:', updates);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (updateError) {
        console.error('ProfileRepair: Error updating profile:', updateError);
        return { success: false, error: updateError.message };
      }
      
      return { 
        success: true, 
        action: 'updated',
        updatedFields: Object.keys(updates)
      };
    }
    
    console.log('ProfileRepair: Profile is complete, no updates needed');
    return { success: true, action: 'no_change_needed' };
  } catch (error: any) {
    console.error('ProfileRepair: Error repairing profile:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Run this function after user login to ensure their profile is complete
 * Designed to be called from main app component or dashboard
 */
export async function checkAndRepairCurrentUserProfile() {
  try {
    console.log('ProfileRepair: Checking current user profile...');
    
    // Get current user
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error('ProfileRepair: Cannot repair profile - no user logged in:', error);
      return { success: false, error: error?.message || 'No user logged in' };
    }
    
    const userId = data.user.id;
    const email = data.user.email || '';
    
    // Get user metadata for names
    const metadata = data.user.user_metadata || {};
    const firstName = metadata.first_name || metadata.given_name || 'User';
    const lastName = metadata.last_name || metadata.family_name || 'Name';
    
    console.log('ProfileRepair: Found user:', { userId, email, firstName, lastName });
    
    // Run the repair
    return await repairUserProfile(userId, email, firstName, lastName);
  } catch (error: any) {
    console.error('ProfileRepair: Error in profile check and repair:', error);
    return { success: false, error: error.message };
  }
}
