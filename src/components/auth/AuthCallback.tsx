import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase/supabaseClient';
import { repairUserProfile } from '../../utils/profileRepair';
import { ensureProfileExists } from '../../utils/createProfileBypass';

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
  const [status, setStatus] = useState<string>('Processing authentication...');
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

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
          // Use our new bypass utility to ensure profile exists
          setStatus('Creating user profile...');
          console.log('AuthCallback: Ensuring profile exists for user:', userId);
          
          const profileResult = await ensureProfileExists(userId, email, firstName, lastName);
          console.log('AuthCallback: Profile creation result:', profileResult);
          
          if (profileResult.success) {
            console.log(`AuthCallback: Profile ${profileResult.method === 'existing' ? 'already exists' : 'created successfully'} using ${profileResult.method} method`);
          } else {
            console.error('AuthCallback: Failed to create profile:', profileResult.error);
            
            // Try legacy repair method as last resort
            console.log('AuthCallback: Trying legacy repair method as last resort...');
            const repairResult = await repairUserProfile(userId, email, firstName, lastName);
            
            if (!repairResult.success) {
              console.error('AuthCallback: All profile creation methods failed');
              
              // Absolute fallback: Store profile info in user metadata
              try {
                console.log('AuthCallback: Using metadata fallback for profile info');
                await supabase.auth.updateUser({
                  data: {
                    profile_creation_failed: true,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    subscription_tier: 'FREE',
                    created_at: new Date().toISOString()
                  }
                });
              } catch (metadataError) {
                console.error('AuthCallback: Even metadata fallback failed:', metadataError);
              }
            }
          }
          
          // Check if profile exists one more time to be sure
          const { data: finalCheck } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .maybeSingle();
            
          if (finalCheck) {
            console.log('AuthCallback: Final check confirms profile exists');
          } else {
            console.warn('AuthCallback: Final check shows profile still missing');
          }
        } catch (profileError) {
          console.error('AuthCallback: Error handling profile:', profileError);
          // Continue anyway - we'll try to redirect to the app
        }

        // Redirect to the app
        setStatus('Authentication successful! Redirecting...');
        
        // Redirect to dashboard instead of home page
        const redirectTo = '/dashboard';
        console.log('Redirecting to dashboard...');
        setTimeout(() => {
          window.location.hash = redirectTo;
        }, 1000);
      } catch (err: any) {
        console.error('Auth callback error:', err);
        
        // Check for specific error types based on URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');
        
        if (errorCode === 'otp_expired') {
          setErrorType('expired_link');
          setErrorDetails('Your magic link has expired. For security reasons, magic links expire after 24 hours or once they have been used.');
        } else if (errorCode === 'access_denied') {
          setErrorType('access_denied');
          setErrorDetails(errorDescription || 'Access was denied. The link may be invalid or your session has expired.');
        } else {
          setErrorType('authentication_failed');
          setErrorDetails(err.message || 'Authentication failed. Please try again.');
        }
        
        setStatus('Authentication failed');
        
        // No longer auto-redirect on error - user will use the buttons
        // Keep only the successful redirect
      }
    };

    handleCallback();
  }, []); // No dependencies needed

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          color: '#333',
          fontSize: '24px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          {errorType ? 'Authentication Failed' : 'Processing Authentication'}
        </h1>

        {errorType ? (
          <div>
            <div style={{
              backgroundColor: '#6750A4',
              color: 'white',
              borderRadius: '4px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '18px'
            }}>
              Verify Email Address
            </div>

            <div style={{
              marginTop: '20px',
              marginBottom: '20px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>

            <p style={{
              color: '#333',
              fontSize: '16px',
              lineHeight: '1.5',
              marginBottom: '20px'
            }}>
              {errorDetails}
            </p>

            <div style={{
              marginTop: '30px'
            }}>
              <button 
                onClick={() => {
                  // Replace the current page instead of opening a new one
                  window.location.href = '#/login';
                }} 
                style={{
                  backgroundColor: '#6750A4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 16px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Try Again
              </button>
              
              <div style={{ marginTop: '16px' }}>
                <button 
                  onClick={() => window.location.href = '#/login'} 
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6750A4',
                    border: '1px solid #6750A4',
                    borderRadius: '4px',
                    padding: '10px 16px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Send New Magic Link
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              marginTop: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                border: '4px solid rgba(0, 0, 0, 0.1)',
                borderTopColor: '#6750A4',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            </div>
            
            <p style={{
              color: '#333',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;