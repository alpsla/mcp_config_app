import { supabase } from '../supabase/supabaseClient';
import { User, convertSupabaseUser } from '../../types';

/**
 * Enhanced authentication service with improved error handling
 * and prevention measures for profile/auth mismatches
 */
export const enhancedAuthService = {
  /**
   * Enhanced sign up function that ensures profile creation
   */
  async signUp(email: string, password: string): Promise<{ 
    success: boolean; 
    error?: string; 
    warning?: string;
    user?: User;
  }> {
    try {
      // Attempt to sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) {
        console.error("Sign up failed:", authError.message);
        return { 
          success: false, 
          error: authError.message 
        };
      }
      
      // If auth signup successful but no user returned, something went wrong
      if (!authData || !authData.user) {
        console.error("Auth succeeded but no user returned");
        return { 
          success: false, 
          error: "Sign up succeeded but user data not returned" 
        };
      }
      
      // Immediately create the user profile to prevent mismatches
      try {
        const newProfile = {
          id: authData.user.id,
          email: authData.user.email,
          first_name: '',
          last_name: '',
          created_at: new Date().toISOString(),
          subscription_tier: 'FREE'
        };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([newProfile]);
        
        if (profileError) {
          console.error("Profile creation failed:", profileError.message);
          // Rather than rolling back, we'll mark this and handle it in the recovery process
          // This way the user can still log in, and the profile will be created on login
          return { 
            success: true, 
            warning: "Auth created but profile creation failed: " + profileError.message,
            user: convertSupabaseUser(authData.user)
          };
        }
      } catch (profileError: any) {
        console.error("Profile creation exception:", profileError);
        return { 
          success: true, 
          warning: "Auth created but profile creation threw an exception",
          user: convertSupabaseUser(authData.user)
        };
      }
      
      return { 
        success: true, 
        user: convertSupabaseUser(authData.user)
      };
    } catch (error: any) {
      console.error("Sign up process exception:", error.message);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      };
    }
  },
  
  /**
   * Enhanced sign in function that ensures profile exists
   */
  async signIn(email: string, password: string): Promise<{
    success: boolean;
    error?: string;
    warning?: string;
    requiresVerification?: boolean;
    email?: string;
    user?: User;
  }> {
    try {
      // Attempt to sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        console.error("Sign in failed:", authError.message);
        
        // Special handling for common auth errors
        if (authError.message.includes("Email not confirmed") || 
            authError.message.includes("verification") ||
            authError.message.includes("not allowed")) {
          return { 
            success: false, 
            error: authError.message,
            requiresVerification: true,
            email: email
          };
        }
        
        return { 
          success: false, 
          error: authError.message 
        };
      }
      
      // If sign in succeeded but no user returned
      if (!authData || !authData.user) {
        return { 
          success: false, 
          error: "Sign in succeeded but user data not returned" 
        };
      }
      
      // Check if profile exists and create if missing
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();
        
        // If profile not found, create one on the fly
        if (!profile) {
          console.log("Profile missing during sign in, creating it now");
          
          const newProfile = {
            id: authData.user.id,
            email: authData.user.email,
            first_name: '',
            last_name: '',
            created_at: new Date().toISOString(),
            subscription_tier: 'FREE'
          };
          
          const { error: createError } = await supabase
            .from('profiles')
            .insert([newProfile]);
          
          if (createError) {
            console.error("Failed to create missing profile on sign in:", createError.message);
            return { 
              success: true, 
              warning: "Logged in but failed to create missing profile",
              user: convertSupabaseUser(authData.user)
            };
          }
          
          console.log("Created missing profile during sign in for:", email);
        } else if (profileError) {
          console.error("Error checking for profile:", profileError.message);
          return { 
            success: true, 
            warning: "Logged in but error checking profile",
            user: convertSupabaseUser(authData.user)
          };
        }
        
        // Update last login timestamp
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', authData.user.id);
        
        // Convert user to our app's type with known profile
        const user = convertSupabaseUser(authData.user);
        if (profile) {
          user.subscriptionTier = profile.subscription_tier || 'FREE';
        }
        
        return { 
          success: true, 
          user: user
        };
      } catch (profileError: any) {
        console.error("Profile check/create exception:", profileError);
        return { 
          success: true, 
          warning: "Logged in but profile check threw an exception",
          user: convertSupabaseUser(authData.user)
        };
      }
    } catch (error: any) {
      console.error("Sign in process exception:", error.message);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      };
    }
  },

  /**
   * Password reset request function
   */
  async requestPasswordReset(email: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        console.error("Password reset request failed:", error.message);
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      return {
        success: true,
        message: "Password reset instructions sent to your email"
      };
    } catch (error: any) {
      console.error("Password reset process exception:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      };
    }
  }
};