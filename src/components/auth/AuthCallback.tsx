import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabase/supabaseClient';
import { repairUserProfile } from '../../utils/profileRepair';
import { SubscriptionTier } from '../../types';

/**
 * Authentication Callback Handler Component
 * 
 * This component handles callbacks from:
 * - Email verification links
 * - Magic link authentication
 * - OAuth providers (Google, GitHub, etc.)
 * 
 * It ensures that user profiles are created before redirecting to the app.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<string>('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // First get the current session
        console.log('AuthCallback: Getting session...');
        const { data, error: sessionError } = await supabase.auth.getSession();
        console.log('AuthCallback: Session response:', data);

        if (sessionError) {
          console.error('AuthCallback: Session error:', sessionError);
          throw new Error(sessionError.message);
        }

        if (!data.session) {
          console.error('AuthCallback: No session found in response');
          console.log('AuthCallback: URL parameters:', window.location.search);
          
          // Try to extract the access token from URL if present
          const urlParams = new URLSearchParams(window.location.search);
          const accessToken = urlParams.get('access_token');
          
          if (accessToken) {
            console.log('AuthCallback: Found access_token in URL, trying to set session manually');
            try {
              // Try to set the session manually
              const { data: tokenData, error: tokenError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: urlParams.get('refresh_token') || '',
              });
              
              if (tokenError) {
                console.error('AuthCallback: Failed to set session manually:', tokenError);
                throw new Error(`Session not found and manual session creation failed: ${tokenError.message}`);
              }
              
              if (tokenData.session) {
                console.log('AuthCallback: Successfully created session manually');
                data.session = tokenData.session;
              } else {
                throw new Error('Session not found and manual session creation returned empty session');
              }
            } catch (tokenErr) {
              console.error('AuthCallback: Error in manual session handling:', tokenErr);
              throw new Error('Session not found and manual session creation failed');
            }
          } else {
            throw new Error('No session found. Authentication may have failed. No access token in URL.');
          }
        }

        // Get user details from the session
        const { user } = data.session;
        
        if (!user || !user.id) {
          throw new Error('Invalid user data in session');
        }

        // Extract user information
        const userId = user.id;
        const email = user.email || '';
        const metadata = user.user_metadata || {};
        let firstName = metadata.first_name || metadata.given_name || 'User';
        let lastName = metadata.last_name || metadata.family_name || 'Name';
        
        // Check if we have stored first/last name from sign up
        const storedFirstName = localStorage.getItem('pendingUserFirstName');
        const storedLastName = localStorage.getItem('pendingUserLastName');
        
        if (storedFirstName) {
          firstName = storedFirstName;
          localStorage.removeItem('pendingUserFirstName');
        }
        
        if (storedLastName) {
          lastName = storedLastName;
          localStorage.removeItem('pendingUserLastName');
        }

        setStatus('Verifying user profile...');

        // Ensure user profile exists - critical for successful authentication
        try {
          // First check if profile exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name')
            .eq('id', userId)
            .maybeSingle();
          
          // If profile doesn't exist, create it
          if (!existingProfile) {
            setStatus('Creating user profile...');
            console.log('AuthCallback: Creating new profile for user:', userId);
            console.log('AuthCallback: Profile data to save:', {
              email,
              firstName,
              lastName
            });
            
            // Try multiple times to create the profile (sometimes the first attempt fails)
            let profileCreated = false;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (!profileCreated && attempts < maxAttempts) {
              attempts++;
              try {
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
                  console.error(`AuthCallback: Error creating profile (attempt ${attempts}):`, createError);
                  // Wait briefly before next attempt
                  await new Promise((resolve) => setTimeout(resolve, 500));
                } else {
                  console.log(`AuthCallback: Successfully created profile on attempt ${attempts}`);
                  profileCreated = true;
                }
              } catch (err) {
                console.error(`AuthCallback: Exception in profile creation (attempt ${attempts}):`, err);
                // Wait briefly before next attempt
                await new Promise((resolve) => setTimeout(resolve, 500));
              }
            }
            
            if (!profileCreated) {
              console.warn('AuthCallback: Failed to create profile after multiple attempts');
              // Try using our profile repair utility as a fallback
              try {
                console.log('AuthCallback: Using profile repair utility as fallback...');
                const repairResult = await repairUserProfile(userId, email, firstName, lastName);
                console.log('AuthCallback: Profile repair result:', repairResult);
                
                if (repairResult.success) {
                  console.log('AuthCallback: Profile created using repair utility');
                } else {
                  console.error('AuthCallback: Profile repair also failed:', repairResult.error);
                }
              } catch (repairError) {
                console.error('AuthCallback: Error using profile repair:', repairError);
              }
            }
          } else {
            console.log('Profile already exists for user', userId);
            
            // Check if profile fields need to be updated
            let needsUpdate = false;
            const updateData: any = {};
            
            if (!existingProfile.email || existingProfile.email !== email) {
              updateData.email = email;
              needsUpdate = true;
            }
            
            if (!existingProfile.first_name) {
              updateData.first_name = firstName;
              needsUpdate = true;
            }
            
            if (!existingProfile.last_name) {
              updateData.last_name = lastName;
              needsUpdate = true;
            }
            
            // Update profile if needed
            if (needsUpdate) {
              setStatus('Updating user profile...');
              const { error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId);
                
              if (updateError) {
                console.error('Error updating profile during callback:', updateError);
              } else {
                console.log('Successfully updated profile during callback');
              }
            }
          }
        } catch (profileError) {
          console.error('Error handling profile in callback:', profileError);
          // Continue anyway - we'll try to redirect to the app
        }

        // Redirect to the app
        setStatus('Authentication successful! Redirecting...');
        
        // Redirect to home page or the page user was trying to access
        const redirectTo = sessionStorage.getItem('redirectAfterAuth') || '/';
        setTimeout(() => {
          navigate(redirectTo);
        }, 1000);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setStatus('Authentication failed');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2>Authentication {error ? 'Failed' : 'Processing'}</h2>
      
      <div style={{
        marginTop: '20px',
        padding: '15px 20px',
        borderRadius: '4px',
        backgroundColor: error ? '#FEE2E2' : '#E0F2FE',
        color: error ? '#B91C1C' : '#0369A1'
      }}>
        {status}
      </div>
      
      {error && (
        <div style={{
          marginTop: '20px',
          color: '#B91C1C'
        }}>
          <p>{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;