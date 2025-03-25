import React from 'react';
import { AuthProvider as CustomAuthProvider } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <CustomAuthProvider>{children}</CustomAuthProvider>;
};
