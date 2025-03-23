import React, { useState } from 'react';
import { RegisterCredentials } from '../types';
import { useAuth } from './AuthContext';
import './AuthForms.css';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onLoginClick }) => {
  const { register, authState } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    const credentials: RegisterCredentials = {
      email,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined
    };

    try {
      await register(credentials);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to register');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create Account</h2>
      <p className="auth-form-subtitle">Sign up to start configuring your Claude experience.</p>
      
      {(formError || authState.error) && (
        <div className="auth-form-error">
          {formError || authState.error}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password <span className="required">*</span></label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
          <small className="input-help">Password must be at least 8 characters long</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit"
            className="primary-button"
            disabled={authState.loading}
          >
            {authState.loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <button 
            className="text-button"
            onClick={onLoginClick}
            type="button"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
