import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Subscription tier levels
 */
export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  COMPLETE = 'COMPLETE',
  PRO = 'PRO'
}

/**
 * Custom user interface extending Supabase user
 */
export interface User extends SupabaseUser {
  app_metadata: any;
  user_metadata: {
    firstName?: string;
    lastName?: string;
    subscriptionTier?: SubscriptionTier;
    [key: string]: any;
  };
}

/**
 * Auth response interface
 */
export interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
  user?: User | null;
  session?: any;
  requiresEmailConfirmation?: boolean;
  confirmEmail?: boolean;
  action?: string;
}

/**
 * Profile result interface
 */
export interface ProfileResult {
  success: boolean;
  error?: string;
  message?: string;
  action?: 'created' | 'updated' | 'verified';
}

/**
 * Session result interface
 */
export interface SessionResult {
  success: boolean;
  error?: string;
  session?: any;
}

/**
 * OAuth sign-in result interface
 */
export interface OAuthSignInResult {
  success: boolean;
  error?: string;
  url?: string;
}
