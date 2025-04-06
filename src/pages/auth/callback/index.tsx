import React, { useEffect } from 'react';
import AuthCallback from '../../../components/auth/AuthCallback';

/**
 * Auth Callback Page
 * 
 * This page is used as the target for external authentication callbacks:
 * - Magic link authentications
 * - OAuth providers (Google, GitHub)
 * - Email verifications
 */
const AuthCallbackPage: React.FC = () => {
  console.log('AuthCallbackPage: Rendering callback page');
  console.log('AuthCallbackPage: URL', window.location.href);
  
  // Close any opener windows if this was opened in a new tab
  useEffect(() => {
    // Check if this page was opened from another page
    if (window.opener) {
      // Transfer the URL to the opener and close this tab
      try {
        window.opener.location.href = window.location.href;
        window.close();
        return;
      } catch (e) {
        console.error('Could not redirect opener:', e);
        // Continue with normal flow if redirect fails
      }
    }
    
    // Extract and handle access_token from URL if present
    // This is needed because we're using hash-based routing and some auth providers might not handle it correctly
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const searchParams = new URLSearchParams(url.search);
    
    // Check if we have tokens in URL search params that need to be moved to the hash
    const accessToken = searchParams.get('access_token');
    
    if (accessToken && !hashParams.has('access_token')) {
      console.log('AuthCallbackPage: Found access_token in URL search params, handling it');
      // We have tokens in the wrong place - manually handle them
      // This happens with some providers when hash routing is used
      try {
        // Move tokens from search params to hash
        const newHash = '#/auth/callback';
        window.location.hash = newHash;
        console.log('AuthCallbackPage: Moved token parameters to hash');
      } catch (err) {
        console.error('AuthCallbackPage: Error handling token in URL:', err);
      }
    }
  }, []);
  
  return <AuthCallback />;
};

export default AuthCallbackPage;
