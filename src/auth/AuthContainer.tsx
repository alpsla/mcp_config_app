import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';
import './AuthContainer.css';

export const AuthContainer: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-logo">MCP Configuration Tool</div>
        <div className="auth-beta-tag">Beta</div>
      </div>
      
      <div className="auth-content">
        {authMode === 'login' ? (
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        ) : (
          <RegistrationForm onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
      
      <div className="auth-footer">
        <p>&copy; {new Date().getFullYear()} MCP Configuration Tool</p>
      </div>
    </div>
  );
};
