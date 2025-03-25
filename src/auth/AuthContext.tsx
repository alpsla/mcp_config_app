import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getCurrentSession, 
  signInWithEmail, 
  signUpWithEmail, 
  signOut,
  signInWithSocialProvider,
  resendVerificationEmail
} from '../services/supabase/authService';
import { robustLogin as robustLoginService, forceResendVerification } from '../services/auth/emailAuthFix';
import { User, SubscriptionTier } from '../types';

// Define the shape of our auth state
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  session: any | null;
  requiresEmailConfirmation: boolean;
  confirmationMessage: string | null;
}

// Define the shape of our auth context
interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>; // Alias for signup
  socialLogin: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  updateSubscriptionTier: (tier: SubscriptionTier) => Promise<void>;
  clearError: () => void;
  resendVerification: (email: string) => Promise<{ success: boolean, message: string }>;
  robustLogin: (email: string, password: string) => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  authState: {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    session: null,
    requiresEmailConfirmation: false,
    confirmationMessage: null
  },
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  register: async () => {}, // Alias for signup
  socialLogin: async () => {},
  updateSubscriptionTier: async () => {},
  clearError: () => {},
  resendVerification: async () => ({ success: false, message: '' }),
  robustLogin: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    session: null,
    requiresEmailConfirmation: false,
    confirmationMessage: null
  });

  // Clear any error message
  const clearError = () => {
    setAuthState(prevState => ({
      ...prevState,
      error: null
    }));
  };

  // Function to login with enhanced error handling
  const login = async (email: string, password: string) => {
    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null,
      requiresEmailConfirmation: false,
      confirmationMessage: null
    }));

    try {
      // First try the more robust login implementation
      const robustResponse = await robustLoginService(email, password);
      
      if (robustResponse.success) {
        // Get user profile data
        const userData = await getCurrentUser();
        
        setAuthState({
          user: userData,
          loading: false,
          error: null,
          isAuthenticated: true,
          session: robustResponse.session,
          requiresEmailConfirmation: false,
          confirmationMessage: null
        });
        return;
      }
      
      // If robust login failed, fall back to standard login flow
      const response = await signInWithEmail(email, password);
      
      if (response.error) {
        // Check if this is an email verification issue
        if (response.requiresEmailConfirmation || robustResponse.requiresEmailConfirmation) {
          setAuthState(prevState => ({
            ...prevState,
            loading: false,
            error: null,
            requiresEmailConfirmation: true,
            confirmationMessage: 'Your email is not yet verified. Please check your inbox for the verification email.'
          }));
          return;
        }
        throw new Error(response.error || robustResponse.error || 'Login failed');
      }

      setAuthState({
        user: response.user,
        loading: false,
        error: null,
        isAuthenticated: !!response.user,
        session: response.session,
        requiresEmailConfirmation: false,
        confirmationMessage: null
      });
    } catch (error: any) {
      // Check if the error message indicates an email verification issue
      if (error.message.includes('Email not confirmed') || 
          error.message.includes('not verified') || 
          error.message.toLowerCase().includes('verify')) {
        setAuthState(prevState => ({
          ...prevState,
          loading: false,
          error: null,
          requiresEmailConfirmation: true,
          confirmationMessage: 'Your email is not yet verified. Please check your inbox for the verification email.'
        }));
        return;
      }
      
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message,
        requiresEmailConfirmation: false,
        confirmationMessage: null
      }));
    }
  };

  // Function to attempt a more robust login with diagnostic and recovery
  const robustLogin = async (email: string, password: string) => {
    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null,
      requiresEmailConfirmation: false,
      confirmationMessage: null
    }));

    try {
      // Use the enhanced login function from emailAuthFix
      const response = await robustLoginService(email, password);
      
      if (response.success) {
        // Get user profile to ensure complete data
        const user = await getCurrentUser();
        
        setAuthState({
          user: user,
          loading: false,
          error: null,
          isAuthenticated: true,
          session: response.session,
          requiresEmailConfirmation: false,
          confirmationMessage: null
        });
        return;
      }
      
      // Handle specific errors
      if (response.requiresEmailConfirmation) {
        setAuthState(prevState => ({
          ...prevState,
          loading: false,
          error: null,
          requiresEmailConfirmation: true,
          confirmationMessage: 'Email verification required. Please check your inbox or click to resend the verification email.'
        }));
        return;
      }
      
      // General error case
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: response.error || 'Login failed',
        isAuthenticated: false
      }));
    } catch (error: any) {
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message || 'An unexpected error occurred during login',
        isAuthenticated: false
      }));
    }
  };

  // Function to signup
  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null,
      requiresEmailConfirmation: false,
      confirmationMessage: null
    }));

    try {
      const response = await signUpWithEmail(email, password, firstName, lastName);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.requiresEmailConfirmation) {
        setAuthState(prevState => ({
          ...prevState,
          loading: false,
          error: null,
          requiresEmailConfirmation: true,
          confirmationMessage: response.message || 'Please check your email to confirm your account before logging in.'
        }));
        return;
      }

      setAuthState({
        user: response.user,
        loading: false,
        error: null,
        isAuthenticated: !!response.user,
        session: response.session,
        requiresEmailConfirmation: false,
        confirmationMessage: null
      });
    } catch (error: any) {
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message
      }));
    }
  };

  // Alias for signup (for components using register instead of signup)
  const register = (email: string, password: string, firstName?: string, lastName?: string) => signup(email, password, firstName, lastName);

  // Function to handle social login
  const socialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null
    }));

    try {
      await signInWithSocialProvider(provider);
      // Note: The actual auth state update will happen in the useEffect below
      // when the session changes after the OAuth redirect
    } catch (error: any) {
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message
      }));
    }
  };

  // Function to logout
  const logout = async () => {
    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null
    }));

    try {
      await signOut();
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        session: null,
        requiresEmailConfirmation: false,
        confirmationMessage: null
      });
    } catch (error: any) {
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message
      }));
    }
  };

  // Function to update subscription tier
  const updateSubscriptionTier = async (tier: SubscriptionTier) => {
    if (!authState.user) {
      setAuthState(prevState => ({
        ...prevState,
        error: 'User must be logged in to update subscription'
      }));
      return;
    }

    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null
    }));

    try {
      // This is a placeholder - you'll need to implement the actual update
      // in the databaseService
      // const result = await updateUserSubscription(authState.user.id, tier);
      
      // For now, just update the local state
      if (authState.user) {
        const updatedUser = {
          ...authState.user,
          subscriptionTier: tier
        };

        setAuthState(prevState => ({
          ...prevState,
          user: updatedUser,
          loading: false
        }));
      }
    } catch (error: any) {
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message
      }));
    }
  };

  // Function to resend verification email with robust fallback
  const resendVerification = async (email: string): Promise<{ success: boolean, message: string }> => {
    setAuthState(prevState => ({
      ...prevState,
      loading: true,
      error: null
    }));

    try {
      // First try the enhanced version which has multiple fallbacks
      const robustResult = await forceResendVerification(email);
      
      if (robustResult.success) {
        setAuthState(prevState => ({
          ...prevState,
          loading: false,
          error: null,
          confirmationMessage: robustResult.message || 'Verification email has been resent. Please check your inbox.'
        }));
        
        return robustResult;
      }
      
      // If the enhanced version fails, try the standard method
      const result = await resendVerificationEmail(email);
      
      if (result.error) {
        setAuthState(prevState => ({
          ...prevState,
          loading: false,
          error: result.error || null
        }));
        return { success: false, message: result.error };
      }

      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: null,
        confirmationMessage: result.message || 'Verification email has been resent. Please check your inbox.'
      }));
      
      return { 
        success: true, 
        message: result.message || 'Verification email has been resent. Please check your inbox.' 
      };
    } catch (error: any) {
      setAuthState(prevState => ({
        ...prevState,
        loading: false,
        error: error.message
      }));
      return { success: false, message: error.message };
    }
  };

  // Effect to initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const sessionData = await getCurrentSession();
        
        // If we have a session, get the user
        if (sessionData.session) {
          const user = await getCurrentUser();
          
          setAuthState({
            user,
            loading: false,
            error: null,
            isAuthenticated: !!user,
            session: sessionData.session,
            requiresEmailConfirmation: false,
            confirmationMessage: null
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            session: null,
            requiresEmailConfirmation: false,
            confirmationMessage: null
          });
        }
      } catch (error: any) {
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
          isAuthenticated: false,
          session: null,
          requiresEmailConfirmation: false,
          confirmationMessage: null
        });
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        signup,
        register,
        socialLogin,
        updateSubscriptionTier,
        clearError,
        resendVerification,
        robustLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
