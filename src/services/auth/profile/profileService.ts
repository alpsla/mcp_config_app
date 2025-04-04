import { supabase, checkSupabaseConfig } from '../core/authClient';
import { User, SubscriptionTier, ProfileResult } from '../types/authTypes';

/**
 * Verify and ensure user profile exists
 * This function can be called to check if a user's profile exists and create it if needed
 */
export async function verifyAndEnsureProfile(
  userId: string, 
  email: string, 
  firstName?: string, 
  lastName?: string
): Promise<ProfileResult> {
  checkSupabaseConfig();
  
  try {
    console.log('Verifying and ensuring profile exists for user:', userId);
    
    if (!userId) {
      console.error('No user ID provided to verifyAndEnsureProfile');
      return { success: false, error: 'No user ID provided' };
    }
    
    // Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (!profileData || (profileError && profileError.code === 'PGSQL_ERROR_NO_ROWS')) {
      console.log(`Profile doesn't exist for user ${userId}, creating it now...`);
      
      // Profile doesn't exist, create it with a multi-strategy approach
      // Strategy 1: Try direct insert
      try {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: email || '',
            first_name: firstName || 'User',
            last_name: lastName || 'Name',
            created_at: new Date().toISOString(),
            subscription_tier: SubscriptionTier.FREE
          }]);
          
        if (!insertError) {
          console.log('Profile created successfully with direct insert');
          return { success: true, message: 'Profile created successfully', action: 'created' };
        } else {
          console.warn('Direct insert failed, trying upsert strategy');
          console.warn('Insert error:', insertError.message);
        }
      } catch (insertError) {
        console.warn('Exception during direct insert attempt:', insertError);
      }
      
      // Strategy 2: Try upsert approach
      try {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([{
            id: userId,
            email: email || '',
            first_name: firstName || 'User',
            last_name: lastName || 'Name',
            created_at: new Date().toISOString(),
            subscription_tier: SubscriptionTier.FREE
          }]);
          
        if (!upsertError) {
          console.log('Profile created successfully with upsert');
          return { success: true, message: 'Profile created successfully', action: 'created' };
        } else {
          console.warn('Upsert failed, trying RPC function');
          console.warn('Upsert error:', upsertError.message);
        }
      } catch (upsertError) {
        console.warn('Exception during upsert attempt:', upsertError);
      }
      
      // Strategy 3: Try the RPC function that bypasses RLS
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          'create_user_profile',
          { user_id: userId }
        );
        
        if (!rpcError && rpcResult) {
          console.log('Profile created successfully with RPC function');
          return { success: true, message: 'Profile created successfully', action: 'created' };
        } else {
          console.error('RPC function failed, all profile creation strategies exhausted');
          console.error('RPC error:', rpcError?.message);
          return { 
            success: false, 
            error: rpcError?.message || 'All profile creation strategies failed' 
          };
        }
      } catch (rpcError) {
        console.error('Exception during RPC function attempt:', rpcError);
        return { 
          success: false, 
          error: 'All profile creation strategies failed with exceptions' 
        };
      }
    } else if (profileError) {
      console.error('Error checking profile in verifyAndEnsureProfile:', profileError);
      return { success: false, error: profileError.message };
    }
    
    // Profile already exists, check if it needs to be updated
    const updateData: any = {};
    let needsUpdate = false;
    
    // Add missing fields if any
    if (!profileData.email && email) {
      updateData.email = email;
      needsUpdate = true;
    }
    
    if (!profileData.first_name && firstName) {
      updateData.first_name = firstName;
      needsUpdate = true;
    } else if (!profileData.first_name) {
      updateData.first_name = 'User';
      needsUpdate = true;
    }
    
    if (!profileData.last_name && lastName) {
      updateData.last_name = lastName;
      needsUpdate = true;
    } else if (!profileData.last_name) {
      updateData.last_name = 'Name';
      needsUpdate = true;
    }
    
    if (!profileData.subscription_tier) {
      updateData.subscription_tier = SubscriptionTier.FREE;
      needsUpdate = true;
    }
    
    // Update if needed
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating profile in verifyAndEnsureProfile:', updateError);
        return { success: false, error: updateError.message };
      }
      
      console.log(`Profile updated with missing fields for user ${userId}`);
      return { success: true, message: 'Profile updated successfully', action: 'updated' };
    }
    
    return { success: true, message: 'Profile verified and exists', action: 'verified' };
  } catch (error: any) {
    console.error('Error in verifyAndEnsureProfile:', error);
    return { success: false, error: error.message || 'An error occurred verifying profile' };
  }
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(authUser: any): Promise<User | null> {
  if (!authUser) return null;
  
  try {
    console.log('Getting user profile for:', authUser.id);
    
    // Get additional profile data from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();
    
    if (profileError && profileError.code !== 'PGSQL_ERROR_NO_ROWS') {
      console.error('Error fetching user profile:', profileError);
    }
    
    // If no profile exists, create one
    if (!profileData) {
      try {
        // Extract metadata for names
        const metadata = authUser.user_metadata || {};
        const email = authUser.email || '';
        const firstName = metadata.first_name || metadata.given_name || 'User';
        const lastName = metadata.last_name || metadata.family_name || 'Name';
        
        console.log('Profile not found, creating one for user:', authUser.id);
        
        // Use the dedicated function to ensure profile exists
        const profileResult = await verifyAndEnsureProfile(
          authUser.id,
          email,
          firstName,
          lastName
        );
        
        if (profileResult.success) {
          console.log(`Profile ${profileResult.action} in getUserProfile for user:`, authUser.id);
          
          // Get the newly created profile
          const { data: newProfileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();
            
          // Return user with the new profile data
          const user: any = {
            id: authUser.id,
            email: email,
            app_metadata: {},
            user_metadata: {
              firstName: newProfileData?.first_name || firstName,
              lastName: newProfileData?.last_name || lastName,
              subscriptionTier: newProfileData?.subscription_tier || SubscriptionTier.FREE
            },
            aud: 'authenticated',
            created_at: authUser.created_at || new Date().toISOString()
          };
          
          return user as User;
        } else {
          console.error('Failed to create profile in getUserProfile:', profileResult.error);
        }
      } catch (createError) {
        console.error('Failed to create missing profile in getUserProfile:', createError);
      }
    }
    
    // Return merged user data (auth + profile)
    const user: any = {
      id: authUser.id,
      email: authUser.email || '',
      app_metadata: {},
      user_metadata: {
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
      },
      aud: 'authenticated',
      created_at: authUser.created_at || new Date().toISOString()
    };
    
    return user as User;
  } catch (error) {
    console.error('Error getting user profile:', error);
    
    // Return basic user data as fallback
    const metadata = authUser.user_metadata || {};
    
    const user: any = {
      id: authUser.id || '',
      email: authUser.email || '',
      app_metadata: {},
      user_metadata: {
        firstName: metadata.first_name || metadata.given_name,
        lastName: metadata.last_name || metadata.family_name,
        subscriptionTier: SubscriptionTier.FREE
      },
      aud: 'authenticated',
      created_at: authUser.created_at || new Date().toISOString()
    };
    
    return user as User;
  }
}

/**
 * Update user's profile data
 */
export async function updateProfile(userId: string, profileData: any) {
  checkSupabaseConfig();
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    if (error) {
      console.error('Update profile error:', error.message);
      return { success: false, error: error.message };
    }
    
    return {
      success: true,
      message: 'Profile updated successfully'
    };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred while updating profile' 
    };
  }
}

/**
 * Update a user's subscription tier
 */
export async function updateSubscriptionTier(userId: string, tier: SubscriptionTier) {
  checkSupabaseConfig();
  
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user for subscription update:', userError.message);
      return { success: false, error: userError.message };
    }
    
    if (!userData.user) {
      return { success: false, error: 'User not found' };
    }
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ subscription_tier: tier })
      .eq('id', userId);
    
    if (profileError) {
      console.error('Error updating subscription tier:', profileError.message);
      return { success: false, error: profileError.message };
    }
    
    // Get updated profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // Return updated user
    return {
      success: true,
      user: {
        id: userData.user.id,
        email: userData.user.email || '',
        app_metadata: {},
        user_metadata: {
          subscriptionTier: profileData?.subscription_tier || SubscriptionTier.FREE
        },
        aud: 'authenticated',
        created_at: userData.user.created_at || new Date().toISOString()
      } as User
    };
  } catch (error: any) {
    console.error('Update subscription error:', error);
    return { 
      success: false, 
      error: error.message || 'An error occurred while updating subscription' 
    };
  }
}
