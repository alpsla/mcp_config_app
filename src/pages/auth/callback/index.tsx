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
  }, []);
  
  return <AuthCallback />;
};

export default AuthCallbackPage;
