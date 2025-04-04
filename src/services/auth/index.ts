// Re-export all auth modules for convenient imports

// Core authentication
export { default as authService } from './core/authService';
export { getCurrentUser, getCurrentSession, signOut } from './core/authService';
export { supabase, checkSupabaseConfig } from './core/authClient';

// Profile management
export { 
  verifyAndEnsureProfile, 
  getUserProfile, 
  updateProfile, 
  updateSubscriptionTier 
} from './profile/profileService';

// Email authentication
export { 
  sendMagicLink, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword, 
  updatePassword, 
  resendVerificationEmail, 
  directAccessLogin 
} from './email/emailAuthService';

// OAuth authentication
export { 
  signInWithSocialProvider, 
  handleOAuthCallback, 
  safeOAuthSignIn 
} from './oauth/oauthService';

// Types
export { SubscriptionTier } from './types/authTypes';
export type { 
  User, 
  AuthResponse, 
  ProfileResult, 
  SessionResult, 
  OAuthSignInResult 
} from './types/authTypes';
