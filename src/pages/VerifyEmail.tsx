import React, { useEffect, useState } from 'react';
import './VerifyEmail.css';
import { supabase } from '../services/supabase/supabaseClient';
import { debugProfileTable } from '../services/supabase/authService';

const VerifyEmail: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<
    'verifying' | 'success' | 'error'
  >('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the query parameters from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const error = queryParams.get('error');
        const errorCode = queryParams.get('error_code');
        const errorDescription = queryParams.get('error_description');
        const token = queryParams.get('token_hash');
        const type = queryParams.get('type');
        const hash = window.location.hash;
        
        console.log('URL parameters:', { 
          error, 
          errorCode, 
          errorDescription,
          token,
          type,
          hash: window.location.hash,
          search: window.location.search,
          pathname: window.location.pathname
        });
        
        // Check if there are error parameters in the URL
        if (error) {
          console.error('Error in verification link:', error, errorCode, errorDescription);
          setVerificationStatus('error');
          setErrorMessage(errorDescription || 'Invalid or expired verification link. Please request a new one.');
          return;
        }
        
        // If verification is successful, check and create profile if needed
        const createProfileIfNeeded = async () => {
          try {
            // Get user data
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user?.id) {
              console.error('Could not get authenticated user data');
              return;
            }

            console.log('Retrieved user data:', userData.user.id);

            // Check if profile exists
            const { data: existingProfile, error: profileError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', userData.user.id)
              .single();

            console.log('Profile check:', { existingProfile, profileError });

            // If profile doesn't exist, create it
            if (!existingProfile && userData.user.id) {
              console.log('Creating minimal profile for verified user');
              
              // Try creating with minimal fields first (most likely to succeed)
              const profileData: Record<string, any> = {
                id: userData.user.id,
                email: userData.user.email || '',
                subscription_tier: 'free',
                created_at: new Date().toISOString()
              };
              
              // Try to add name fields if available from user metadata
              if (userData.user.user_metadata?.first_name) {
                profileData.first_name = userData.user.user_metadata.first_name;
              }
              
              if (userData.user.user_metadata?.last_name) {
                profileData.last_name = userData.user.user_metadata.last_name;
              }
              
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([profileData]);

              if (insertError) {
                console.error('Error creating profile:', insertError);
                
                // If error mentions columns like email, try again with just the minimal data
                if (insertError.message && insertError.message.includes('column')) {
                  // Log the specific error to diagnose the issue
                  console.error('Column error details:', insertError.message);
                  
                  // Try again with only the absolutely essential fields
                  const minimalData: Record<string, any> = {
                    id: userData.user.id,
                    subscription_tier: 'free',
                    created_at: new Date().toISOString()
                  };
                  
                  // We might need to try without email if that's causing the issue
                  console.log('Retrying without optional fields...');
                  
                  const { error: retryError } = await supabase
                    .from('profiles')
                    .insert([minimalData]);
                    
                  if (retryError) {
                    console.error('Still failed to create profile with minimal data:', retryError);
                  } else {
                    console.log('Successfully created profile with minimal data');
                  }
                }
              } else {
                console.log('Profile created successfully');
              }
            }
          } catch (error) {
            console.error('Error in profile creation:', error);
          }
        };

        // Check both verification URL formats
        if (hash && (hash.includes('access_token') || hash.includes('confirmation') || hash.includes('token_hash'))) {
          setVerificationStatus('success');
          
          // Create profile if needed and ensure it's properly synced to the auth user
          await createProfileIfNeeded();
          
          // Add a small delay to allow profile creation to complete
          setTimeout(() => {
            // Debug the profile table structure
            debugProfileTable().then(() => {
              // Redirect to login instead of home
              setVerificationStatus('success');
              
              // Give some time for the user to see the success message
              setTimeout(() => {
                // Direct to login page with success parameter
                window.location.href = '/?verified=true'; 
              }, 3000);
            });
          }, 1000);
          return;
        }
        
        // Also check for token in search params for modern Supabase auth
        if (token && type === 'signup') {
          setVerificationStatus('success');
          
          // Create profile if needed and ensure it's properly synced to the auth user
          await createProfileIfNeeded();
          
          // Add a small delay to allow profile creation to complete
          setTimeout(() => {
            // Debug the profile table structure
            debugProfileTable().then(() => {
              // Redirect to login instead of home
              setVerificationStatus('success');
              
              // Give some time for the user to see the success message
              setTimeout(() => {
                // Direct to login page with success parameter
                window.location.href = '/?verified=true'; 
              }, 3000);
            });
          }, 1000);
          return;
        }

        // If we reach this point, there's no valid verification token in the URL
        setVerificationStatus('error');
        setErrorMessage('Invalid or expired verification link. Please request a new one from the login page.');
      } catch (error: any) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'An error occurred during email verification.');
      }
    };

    handleEmailConfirmation();
  }, []);
  

  const handleReturnToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Email Verification</h1>

        {verificationStatus === 'verifying' && (
          <div className="verification-status">
            <p>Verifying your email address...</p>
            <div className="loading-spinner"></div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="verification-status success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Your email has been verified successfully!</p>
            <p>You will be redirected to the login page shortly.</p>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="verification-status error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p>Verification Failed</p>
            <p>{errorMessage}</p>
            <button className="auth-button" onClick={handleReturnToLogin}>
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;