import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { LoginCredentials } from '../types';
import './AuthForms.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, authState } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      await login(credentials);
    } catch (err: any) {
      setFormError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Sign In</h2>
      <p className="auth-form-subtitle">Sign in to access your MCP Configuration Tool</p>
      
      {(authState.error || formError) && (
        <div className="auth-error-message">{formError || authState.error}</div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={credentials.email}
            onChange={handleChange}
            disabled={authState.loading}
            placeholder="your.email@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            disabled={authState.loading}
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={authState.loading}
        >
          {authState.loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="auth-form-footer">
        <p>
          Don't have an account?{' '}
          <button 
            className="link-button" 
            onClick={onSwitchToRegister}
            disabled={authState.loading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};
