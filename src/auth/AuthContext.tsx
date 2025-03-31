import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Database } from '../supabase-types';
import authService from '../services/supabase/authService';

// Create Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

interface AuthContextType {
  authState: {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error?: string;
    isAuthenticated?: boolean;
    requiresEmailConfirmation?: boolean;
    confirmationMessage?: string;
  };
  signIn: (options: { email?: string; provider?: string }) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  socialLogin: (provider: 'google' | 'github') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  robustLogin: (email: string, password: string) => Promise<void>;
  resendVerification: (email: string) => Promise<{message: string}>;
  clearError: () => void;
  updateSubscriptionTier: (tier: string) => Promise<void>;
  getUserSubscriptionTier: () => string;
  supabase: SupabaseClient<Database>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    session: Session | null;
    loading: boolean;
    error?: string;
    isAuthenticated?: boolean;
    requiresEmailConfirmation?: boolean;
    confirmationMessage?: string;
  }>({
    user: null,
    session: null,
    loading: true,
  });

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth state');
      try {
        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          throw error;
        }
        
        if (data.session) {
          console.log('Session found during initialization');
          try {
            // Get full user profile
            const user = await authService.getUserProfile(data.session.user);
            
            if (user) {
              setAuthState({
                user: user,
                session: data.session,
                loading: false,
                isAuthenticated: true,
                error: undefined
              });
              
              // If we're on the home page, redirect to dashboard
              if (window.location.hash === '#/' || window.location.hash === '') {
                console.log('User authenticated, redirecting to dashboard');
                window.location.hash = '/dashboard';
              }
            } else {
              console.error('User profile not found during initialization');
              setAuthState({
                user: null,
                session: null,
                loading: false,
                isAuthenticated: false,
                error: 'Failed to load user profile'
              });
            }
          } catch (profileError) {
            console.error('Error getting user profile during initialization:', profileError);
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAuthenticated: false,
              error: 'Error loading user profile'
            });
          }
        } else {
          console.log('No session found during initialization');
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            error: undefined
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false,
          error: undefined
        });
      }
    };
    
    initAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        if (session) {
          // User is authenticated
          try {
            // Get user profile if session exists
            const user = await authService.getUserProfile(session.user);
            
            setAuthState({
              user,
              session,
              loading: false,
              isAuthenticated: true,
              error: undefined
            });
            
            // Redirect to dashboard if not already there
            if (!window.location.hash.includes('/dashboard')) {
              console.log('User authenticated, redirecting to dashboard');
              setTimeout(() => {
                window.location.hash = '/dashboard';
              }, 300);
            }
          } catch (error) {
            console.error('Error processing authenticated user:', error);
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAuthenticated: false,
              error: 'Error processing authentication'
            });
          }
        } else {
          // User is not authenticated
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            error: undefined
          });
        }
      }
    );
    
    // Clean up listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email (magic link) or OAuth provider
  // Social login function
  const socialLogin = async (provider: 'google' | 'github') => {
    try {
      console.log(`Initiating ${provider} sign in...`);
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'google' ? 'email profile' : undefined
        }
      });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setAuthState(prev => ({
        ...prev,
        error: `Error signing in with ${provider}: ${(error as Error).message}`
      }));
    }
  };

  // Password login
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      setAuthState({
        user: data.user,
        session: data.session,
        loading: false,
        isAuthenticated: !!data.user
      });
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: (error as Error).message
      }));
    }
  };

  // More robust login function with additional error handling
  const robustLogin = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      setAuthState({
        user: data.user,
        session: data.session,
        loading: false,
        isAuthenticated: !!data.user
      });
    } catch (error) {
      console.error('Robust login error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: (error as Error).message
      }));
    }
  };

  // Resend verification email
  const resendVerification = async (email: string): Promise<{message: string}> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        confirmationMessage: 'Verification email resent. Please check your inbox.'
      }));
      
      return { message: 'Verification email resent. Please check your inbox.' };
    } catch (error) {
      console.error('Error resending verification:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: (error as Error).message
      }));
      throw error;
    }
  };

  // Clear error state
  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: undefined
    }));
  };

  // Update user's subscription tier
  const updateSubscriptionTier = async (tier: string) => {
    try {
      if (!authState.user) throw new Error('User not authenticated');
      
      // In a real app, this would update the user's record in the database
      console.log(`Updating subscription tier to: ${tier}`);
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          subscriptionTier: tier as any
        } : null
      }));
    } catch (error) {
      console.error('Error updating subscription tier:', error);
    }
  };
  
  // Get user's subscription tier (defaults to FREE if not set)
  const getUserSubscriptionTier = () => {
    return authState.user?.user_metadata?.subscriptionTier || 'FREE';
  };

  // Original signIn function kept for compatibility
  const signIn = async (options: { email?: string; provider?: string }) => {
    try {
      if (options.email && !options.provider) {
        // Sign in with magic link
        return await supabase.auth.signInWithOtp({
          email: options.email,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
      } else if (options.provider) {
        // Sign in with OAuth provider
        return await supabase.auth.signInWithOAuth({
          provider: options.provider as any,
          options: {
            redirectTo: window.location.origin
          }
        });
      } else {
        throw new Error('Invalid sign in options');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle OAuth callbacks
  const handleAuthCallback = async () => {
    console.log('Auth callback handler initiated');
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error.message);
        return;
      }
      
      if (data.session?.user) {
        console.log('Session found in callback, redirecting to dashboard');
        // Force a redirect to the dashboard
        window.location.hash = '/dashboard';
      } else {
        console.warn('No session found in callback');
      }
    } catch (error) {
      console.error('Error in auth callback handler:', error);
    }
  };

  // Check if we're in a callback URL and handle it
  useEffect(() => {
    if (window.location.pathname.includes('/auth/callback')) {
      console.log('Auth callback URL detected');
      handleAuthCallback();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        signOut,
        socialLogin,
        login,
        robustLogin,
        resendVerification,
        clearError,
        updateSubscriptionTier,
        getUserSubscriptionTier,
        supabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
