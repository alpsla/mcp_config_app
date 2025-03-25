/**
 * Magic Link Authentication
 * Provides a reliable way to authenticate users with email magic links
 * This bypasses password authentication and ensures profiles are created
 */

import { supabase } from '../supabase/supabaseClient';
import { SubscriptionTier } from '../../types';

/**
 * Send a magic link for authentication
 * @param email The email to send the magic link to
 * @returns Promise with success or error message
 */
export async function sendMagicLink(email: string) {
  try {
    // Validate and sanitize email
    const sanitizedEmail = email.trim();
    
    if (!sanitizedEmail) {
      return { success: false, error: 'Please provide a valid email address' };
    }
    
    // Log for debugging
    console.log('MagicLinkAuth: Sending magic link to:', sanitizedEmail);
    console.log('MagicLinkAuth: Redirect URL:', `${window.location.origin}/auth/callback`);
    
    // Send the magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: sanitizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true
      }
    });
    
    if (error) {
      console.error('MagicLinkAuth: Error sending magic link:', error);
      return { success: false, error: error.message };
    }
    
    // Success
    console.log('MagicLinkAuth: Magic link sent successfully');
    return {
      success: true,
      message: 'Magic link sent successfully. Please check your email inbox.'
    };
  } catch (error: any) {
    console.error('MagicLinkAuth: Unexpected error:', error);
    return { success: false, error: error.message || 'Failed to send magic link' };
  }
}

/**
 * Create or update a user profile
 * @param userId The user ID to create/update a profile for
 * @param email The email address for the profile
 * @param firstName Optional first name
 * @param lastName Optional last name
 * @returns Promise with success or error message
 */
export async function ensureUserProfile(
  userId: string,
  email: string,
  firstName: string = 'User',
  lastName: string = 'Name'
) {
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking user profile:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // If profile exists, check if it needs updating
    if (existingProfile) {
      const updates: any = {};
      let needsUpdate = false;
      
      // Check which fields need updating
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
      
      // Update if needed
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          return { success: false, error: updateError.message };
        }
        
        return { success: true, action: 'updated' };
      }
      
      return { success: true, action: 'verified' };
    }
    
    // Profile doesn't exist, create it
    const { error: createError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
        subscription_tier: SubscriptionTier.FREE
      }]);
    
    if (createError) {
      console.error('Error creating profile:', createError);
      return { success: false, error: createError.message };
    }
    
    return { success: true, action: 'created' };
  } catch (error: any) {
    console.error('Error ensuring user profile:', error);
    return { success: false, error: error.message || 'Failed to ensure user profile' };
  }
}