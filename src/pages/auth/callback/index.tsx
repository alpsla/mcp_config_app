import React from 'react';
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
  
  return <AuthCallback />;
};

export default AuthCallbackPage;
