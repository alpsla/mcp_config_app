import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionTier } from '../types';
import { supabase } from '../services/supabase/supabaseClient';

// Define the user type
interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  };
}

// Define the auth state
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated?: boolean;
  requiresEmailConfirmation?: boolean;
  confirmationMessage?: string;
  session?: any;
}

// Define the context value
interface AuthContextValue {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserSubscriptionTier: () => SubscriptionTier;
  updateSubscriptionTier: (tier: SubscriptionTier) => void;
  socialLogin?: (provider: string) => Promise<void>;
  robustLogin?: (email: string, password: string) => Promise<void>;
  resendVerification?: (email: string) => Promise<{message: string}>;
  clearError?: () => void;
  signOut?: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper function to generate a UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    requiresEmailConfirmation: false,
    confirmationMessage: null
  });

  // Subscription tier (in real implementation, this would come from the user's profile)
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // In a real implementation, check for an existing session
        const sessionUser = localStorage.getItem('user');
        
        if (sessionUser) {
          const user = JSON.parse(sessionUser);
          setAuthState({
            user,
            loading: false,
            error: null,
            isAuthenticated: true,
            requiresEmailConfirmation: false,
            confirmationMessage: null
          });
          
          // Get subscription tier from user profile or local storage
          const storedTier = localStorage.getItem('subscriptionTier') as SubscriptionTier;
          if (storedTier) {
            setSubscriptionTier(storedTier);
          }
        } else {
          // Try to get session from Supabase directly
          console.log('No user in localStorage, checking Supabase session');
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            console.log('Found Supabase session, updating auth state');
            const supabaseUser = sessionData.session.user;
            const user: User = {
              id: supabaseUser.id,
              email: supabaseUser.email || 'unknown@email.com',
              name: supabaseUser.user_metadata?.name || 'User',
              user_metadata: supabaseUser.user_metadata
            };
            
            // Store user in local storage
            localStorage.setItem('user', JSON.stringify(user));
            
            setAuthState({
              user,
              loading: false,
              error: null,
              isAuthenticated: true,
              requiresEmailConfirmation: false,
              confirmationMessage: null
            });
          } else {
            setAuthState({
              user: null,
              loading: false,
              error: null,
              isAuthenticated: false,
              requiresEmailConfirmation: false,
              confirmationMessage: null
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          loading: false,
          error: 'Failed to initialize authentication',
          isAuthenticated: false,
          requiresEmailConfirmation: false,
          confirmationMessage: null
        });
      }
    };

    initAuth();
    
    // Also set up an auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        if (event === 'SIGNED_IN') {
          if (session?.user) {
            const supabaseUser = session.user;
            const user: User = {
              id: supabaseUser.id,
              email: supabaseUser.email || 'unknown@email.com',
              name: supabaseUser.user_metadata?.name || 'User',
              user_metadata: supabaseUser.user_metadata
            };
            
            // Store user in local storage
            localStorage.setItem('user', JSON.stringify(user));
            
            setAuthState({
              user,
              loading: false,
              error: null,
              isAuthenticated: true,
              requiresEmailConfirmation: false,
              confirmationMessage: null
            });
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('user');
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            requiresEmailConfirmation: false,
            confirmationMessage: null
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setAuthState({
        ...authState,
        loading: true,
        error: null
      });
      
      // In a real implementation, call authentication API
      // For now, mock a successful login with proper UUID
      const user: User = {
        id: generateUUID(),
        email,
        name: 'Demo User'
      };
      
      // Store user in local storage (in real implementation, use secure methods)
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: 'Failed to login',
        isAuthenticated: false
      });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // In a real implementation, call logout API
      // For now, just clear local storage
      localStorage.removeItem('user');
      
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        requiresEmailConfirmation: false,
        confirmationMessage: null
      });
    } catch (error) {
      setAuthState({
        ...authState,
        error: 'Failed to logout'
      });
    }
  };

  // Get subscription tier
  const getUserSubscriptionTier = (): SubscriptionTier => {
    return subscriptionTier;
  };

  // Update subscription tier
  const updateSubscriptionTier = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    localStorage.setItem('subscriptionTier', tier);
  };

  // Social login function
  const socialLogin = async (provider: string) => {
    try {
      setAuthState({
        ...authState,
        loading: true,
        error: null
      });
      
      // In a real implementation, call social auth API
      console.log(`Social login with ${provider} requested`);
      
      // Mock a successful login with proper UUID format
      const user: User = {
        id: generateUUID(), // Use UUID instead of simple "2" string
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: 'Failed to login with social provider'
      });
    }
  };

  // Robust login function
  const robustLogin = async (email: string, password: string) => {
    try {
      // Just use the regular login for now
      await login(email, password);
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: 'Robust login failed'
      });
    }
  };

  // Resend verification email
  const resendVerification = async (email: string): Promise<{message: string}> => {
    try {
      setAuthState({
        ...authState,
        loading: true,
        error: null
      });
      
      // In a real implementation, call resend verification API
      console.log(`Resending verification email to ${email}`);
      
      setAuthState({
        ...authState,
        loading: false,
        confirmationMessage: 'Verification email sent. Please check your inbox.'
      });
      
      // Return success message
      return { message: 'Verification email sent. Please check your inbox.' };
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: 'Failed to resend verification email'
      });
      throw new Error('Failed to resend verification email');
    }
  };

  // Clear error
  const clearError = () => {
    setAuthState({
      ...authState,
      error: null
    });
  };

  // Alias for logout for compatibility
  const signOut = logout;

  // Context value
  const value: AuthContextValue = {
    authState,
    login,
    logout,
    getUserSubscriptionTier,
    updateSubscriptionTier,
    socialLogin,
    robustLogin,
    resendVerification,
    clearError,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
