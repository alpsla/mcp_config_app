import { supabase } from '../../supabase/supabaseClient';

/**
 * Service to fix authentication issues related to verification status
 * and missing user profiles
 */
export const authRecoveryService = {
  /**
   * Check and fix user verification status in Supabase Auth
   * @param {string} email - User's email address
   * @returns {Promise<any>} User object if found
   */
  async checkAndFixVerification(email: string): Promise<any> {
    try {
      // Use admin API to get users and filter by email
      // Note: This requires Supabase service role key for admin operations
      const { data: { users } = { users: [] }, error: adminError } = await supabase.auth.admin.listUsers();
      
      if (adminError) {
        console.error("Error fetching users:", adminError.message);
        throw adminError;
      }
      
      // Find the user with the matching email
      const user = (users as any[]).find(u => u.email === email);
      
      if (!user) {
        console.error("User not found with email:", email);
        return null;
      }
      
      // If user exists but email is not confirmed
      if (user && !user.email_confirmed_at) {
        console.log("User found but not verified, attempting to fix...");
        
        // Force verify the email using admin API
        const { error } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            email_verified: true
          }
        });
        
        if (error) {
          console.error("Error updating verification status:", error.message);
          throw error;
        }
        
        console.log("User email verification status updated successfully");
      } else {
        console.log("User already verified:", email);
      }
      
      return user;
    } catch (error: any) {
      console.error("Failed to check/fix verification status:", error.message);
      throw error;
    }
  },

  /**
   * Create missing user profile in database
   * @param {Object} user - User object from Supabase Auth
   * @returns {Promise<boolean>} Success status
   */
  async createUserProfile(user: any): Promise<boolean> {
    try {
      if (!user || !user.email) {
        throw new Error("Invalid user object provided");
      }
      
      // Check if profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      // Handle expected "no rows" error differently than other errors
      if (profileError && profileError.code !== 'PGSQL_ERROR_NO_ROWS') {
        console.error("Error checking for existing profile:", profileError);
        throw profileError;
      }
      
      // Only create a new profile if one doesn't exist
      if (!existingProfile) {
        console.log("No profile found, creating new profile for user:", user.email);
        
        const newProfile = {
          id: user.id,
          email: user.email,
          first_name: '',
          last_name: '',
          created_at: new Date().toISOString(),
          subscription_tier: 'FREE'
        };
        
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);
        
        if (insertError) {
          console.error("Error creating user profile:", insertError.message);
          throw insertError;
        }
        
        console.log("User profile created successfully");
        return true;
      } else {
        console.log("Profile already exists for user:", user.email);
        return true;
      }
    } catch (error: any) {
      console.error("Failed to create/check user profile:", error.message);
      throw error;
    }
  },

  /**
   * Integrated function to fix all authentication issues
   * @param {string} email - User's email address
   * @returns {Promise<{success: boolean, message: string}>} Result object with success status and message
   */
  async fixAuthenticationIssues(email: string): Promise<{success: boolean, message: string}> {
    try {
      if (!email) {
        return { 
          success: false, 
          message: "Email is required" 
        };
      }
      
      // Step 1: Fix verification status
      const user = await this.checkAndFixVerification(email);
      
      if (!user) {
        return { 
          success: false, 
          message: "User not found in authentication system" 
        };
      }
      
      // Step 2: Create missing profile if needed
      await this.createUserProfile(user);
      
      return { 
        success: true, 
        message: "Authentication issues fixed successfully. User can now log in." 
      };
    } catch (error: any) {
      console.error("Failed to fix authentication issues:", error.message);
      return { 
        success: false, 
        message: `Failed to fix authentication: ${error.message}` 
      };
    }
  }
};