import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { RegisterCredentials } from '../types';
import './AuthForms.css';

interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const { register, authState } = useAuth();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
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
    if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
      setFormError('Email and password are required');
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (credentials.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }

    try {
      await register(credentials);
    } catch (err: any) {
      setFormError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Sign Up</h2>
      <p className="auth-form-subtitle">Create an account to use MCP Configuration Tool</p>
      
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
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
              value={credentials.firstName}
              onChange={handleChange}
              disabled={authState.loading}
              placeholder="First Name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              value={credentials.lastName}
              onChange={handleChange}
              disabled={authState.loading}
              placeholder="Last Name"
            />
          </div>
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
          <small className="help-text">At least 8 characters</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={credentials.confirmPassword}
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
          {authState.loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <button 
            className="link-button" 
            onClick={onSwitchToLogin}
            disabled={authState.loading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
