import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, SubscriptionTier } from '../types';
import authService from '../services/auth/authService';

// Create a context with a default undefined value
const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (user: Partial<User>) => Promise<User>;
  updateSubscriptionTier: (userId: string, tier: SubscriptionTier) => Promise<User>;
} | undefined>(undefined);

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component to wrap the app with
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  // Check for user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setAuthState({ user, loading: false });
      } catch (error) {
        console.error('Error checking user:', error);
        setAuthState({ user: null, loading: false, error: 'Failed to get user' });
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<User> => {
    setAuthState({ ...authState, loading: true });
    try {
      const user = await authService.login(credentials);
      setAuthState({ user, loading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState({ user: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setAuthState({ ...authState, loading: true });
    try {
      const user = await authService.register(credentials);
      setAuthState({ user, loading: false });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState({ user: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setAuthState({ ...authState, loading: true });
    try {
      await authService.logout();
      setAuthState({ user: null, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState({ ...authState, loading: false, error: errorMessage });
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (user: Partial<User>): Promise<User> => {
    setAuthState({ ...authState, loading: true });
    try {
      const updatedUser = await authService.updateProfile(user);
      setAuthState({ 
        user: { ...authState.user, ...updatedUser } as User, 
        loading: false 
      });
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState({ ...authState, loading: false, error: errorMessage });
      throw error;
    }
  };

  // Update subscription tier function
  const updateSubscriptionTier = async (userId: string, tier: SubscriptionTier): Promise<User> => {
    setAuthState({ ...authState, loading: true });
    try {
      const updatedUser = await authService.updateSubscriptionTier(userId, tier);
      setAuthState({ 
        user: { ...authState.user, subscriptionTier: tier } as User, 
        loading: false 
      });
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setAuthState({ ...authState, loading: false, error: errorMessage });
      throw error;
    }
  };

  const value = {
    authState,
    login,
    register,
    logout,
    updateProfile,
    updateSubscriptionTier
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
