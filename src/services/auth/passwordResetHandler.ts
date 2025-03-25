import { supabase } from '../supabase/supabaseClient';

/**
 * Direct password reset implementation using Supabase's API
 */
export const resetPasswordWithToken = async (
  password: string, 
  token: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Attempting direct password reset with token');

    if (!token) {
      console.error('No reset token provided');
      return { 
        success: false, 
        error: 'No reset token provided. Please use a valid password reset link.' 
      };
    }

    // Set token in local storage - this is how Supabase's direct reset works
    // The token needs to be in local storage with a specific key
    localStorage.setItem('supabase.auth.token', JSON.stringify({ 
      access_token: token,
      refresh_token: '' 
    }));

    // Now update the password
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: error.message || 'Unable to reset password. Please request a new reset link.' 
      };
    }

    // Clear the token after successful password reset
    localStorage.removeItem('supabase.auth.token');

    console.log('Password reset successful');
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    };
  }
};

export const extractResetToken = (): string | null => {
 try {
   // First check for code parameter
    const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

if (code) {
  console.log('Reset code found in URL:', code.substring(0, 8) + '...');
  return code;
}

// Check query parameters for token
const token = urlParams.get('token');
if (token) {
console.log('Token found in URL query params:', token.substring(0, 8) + '...');
return token;
}

// Check hash parameters as fallback
const hash = window.location.hash;
if (hash) {
// Try to extract token from hash
const tokenMatch = hash.match(/token=([^&]*)/); 
if (tokenMatch && tokenMatch[1]) {
  console.log('Token found in URL hash:', tokenMatch[1].substring(0, 8) + '...');
return tokenMatch[1];
}

  // Try access_token
  const accessTokenMatch = hash.match(/access_token=([^&]*)/); 
  if (accessTokenMatch && accessTokenMatch[1]) {
      console.log('Access token found in URL hash');
    return accessTokenMatch[1];
  }
    
      const typeMatch = hash.match(/type=([^&]*)/); 
      if (typeMatch && typeMatch[1] === 'recovery') {
        // There's a recovery token, but we couldn't extract it
        console.log('Recovery token detected but couldn\'t extract token');
      }
    }
    
    console.warn('No reset token found in URL');
    return null;
  } catch (err) {
    console.error('Error extracting reset token:', err);
    return null;
  }
};
