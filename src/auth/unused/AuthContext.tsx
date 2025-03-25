import React, { createContext, useContext } from 'react';
import { LoginCredentials, RegisterCredentials } from '../types';

// Define auth state interface
export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  requiresEmailConfirmation?: boolean;
  confirmationMessage?: string | null;
}

// Define auth context interface
interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  authState: {
    user: null,
    loading: false,
    error: null
  },
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

// Export the useAuth hook
export const useAuth = () => useContext(AuthContext);

// Auth provider component (mock for unused components)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This is a stub provider for the unused components
  // The actual implementation is in the parent directory
  return (
    <AuthContext.Provider
      value={{
        authState: {
          user: null,
          loading: false,
          error: null
        },
        login: async () => {},
        register: async () => {},
        logout: async () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
