import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import ReturningUserDashboard from './components/dashboard/ReturningUserDashboard';
// Import but don't use ConfigurationManager directly to avoid warning
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ConfigurationManager from './components/ConfigurationManager';
import Homepage from './pages/homepage/Homepage';
import SimpleConfigWrapper from './pages/configuration/SimpleConfigWrapper';
import RouteHandler, { navigate } from './utils/RouteHandler';
import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase-types';
import { UserConfigService } from './services/userConfigService';
import { useAuth } from './auth/AuthContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ConfigureButton from './components/dashboard/ConfigureButton';

// Create Supabase client
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

interface DashboardProps {
  path?: string;
  params?: Record<string, string>;
}


interface NavLink {
  to: string;
  label: string;
}

interface SharedHeaderProps {
  navLinks: NavLink[];
  isAuthenticated: boolean;
  languageSelector: boolean;
  onSignOut?: () => void;
}

// Header component for use within Dashboard
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SharedHeader: React.FC<SharedHeaderProps> = ({ navLinks, isAuthenticated, languageSelector }) => {
  return (
    <header className="shared-header">
      <div className="shared-header-container">
        <a href={isAuthenticated ? '#/dashboard' : '#/'} className="shared-header-logo">
          <img src="/logo.svg" alt="Logo" className="shared-header-logo-img" />
          <div className="shared-header-branding">
            <h1 className="shared-header-app-name">MCP Config</h1>
            <p className="shared-header-tagline">Configuration Tool</p>
          </div>
        </a>
        
        <nav className="shared-header-nav">
          <ul className="shared-header-nav-list">
            {navLinks.map((link, index) => (
              <li key={index} className="shared-header-nav-item">
                <a href={`#${link.to}`} className="shared-header-nav-link">{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="shared-header-actions">
          {languageSelector && (
            <div className="shared-header-language">
              <span className="shared-header-language-label">EN</span>
              <svg className="shared-header-language-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          )}
          
          {isAuthenticated ? (
            <a href="#/signout" className="shared-header-sign-out">
              Sign Out
            </a>
          ) : (
            <a href="#/signin" className="shared-header-sign-in" onClick={(e) => {
              e.preventDefault();
              console.log('Sign In link clicked');
              navigate('/signin');
            }}>
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

// Footer component for use within Dashboard
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SharedFooter: React.FC = () => (
  <footer className="shared-footer">
    <div className="shared-footer-content">
      <div className="shared-footer-main">
        <div className="shared-footer-branding">
          <div className="shared-footer-branding-header">
            <img src="/logo.svg" alt="Logo" className="shared-footer-logo-img" />
            <h2 className="shared-footer-title">MCP Config</h2>
          </div>
          <p className="shared-footer-description">
            Configure your AI assistant's capabilities with ease.
          </p>
        </div>
        
        <div className="shared-footer-sections">
          <div className="shared-footer-section">
            <h3 className="shared-footer-section-title">PLATFORM</h3>
            <ul className="shared-footer-links">
              <li><a href="#/features">Features</a></li>
              <li><a href="#/pricing">Pricing</a></li>
              <li><a href="#/documentation">Documentation</a></li>
              <li><a href="#/changelog">Changelog</a></li>
            </ul>
          </div>
          
          <div className="shared-footer-section">
            <h3 className="shared-footer-section-title">COMPANY</h3>
            <ul className="shared-footer-links">
              <li><a href="#/about">About Us</a></li>
              <li><a href="#/blog">Blog</a></li>
              <li><a href="#/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="shared-footer-section">
            <h3 className="shared-footer-section-title">LEGAL</h3>
            <ul className="shared-footer-links">
              <li><a href="#/terms">Terms of Service</a></li>
              <li><a href="#/privacy">Privacy Policy</a></li>
              <li><a href="#/security">Security</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="shared-footer-bottom">
        <p className="shared-footer-copyright">
          © {new Date().getFullYear()} MCP Config. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

// Dashboard wrapper component - selects appropriate dashboard based on user state
const DashboardPage: React.FC<DashboardProps> = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasConfigurations, setHasConfigurations] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authState?.user) {
      console.log('DashboardPage: User not authenticated, redirecting to signin');
      navigate('/signin');
      return;
    }
    
    // Load user configurations
    const loadConfigurations = async () => {
      if (authState?.user?.id) {
        try {
          const userConfigs = await UserConfigService.getUserConfigurations(authState.user.id);
          setHasConfigurations(userConfigs.length > 0);
          console.log('User has configurations:', userConfigs.length > 0);
          setLoading(false);
        } catch (error) {
          console.error('Error loading configurations:', error);
          setLoading(false);
        }
      } else {
        // No user, no need to load configurations
        setLoading(false);
      }
    };

    loadConfigurations();
  }, [authState]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Choose the appropriate dashboard based on whether user has configurations
  return hasConfigurations ? <ReturningUserDashboard /> : <Dashboard />;
};

interface ConfigureWrapperProps {
  path?: string;
  params?: Record<string, string>;
}

// Configure a wrapper around the Configuration page to handle navigation
// ConfigureWrapper component no longer needs handleSaveConfiguration
const ConfigureWrapper: React.FC<ConfigureWrapperProps> = () => {
  const { authState } = useAuth();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authState?.user) {
      console.log('ConfigureWrapper: User not authenticated, redirecting to signin');
      navigate('/signin');
      return;
    }
  }, [authState]);
  
  return (
    <SimpleConfigWrapper />
  );
};

// Simple wrapper for the Login page
const SignInPage = () => {
  console.log('Rendering Login page');
  return <LoginPage />;
};

const App: React.FC = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we have a user
    const isLoading = authState?.loading === true;
    setLoading(isLoading);
    
    // Remove the automatic redirection to signin
    // Let the user land on the homepage first
    console.log('Auth state updated:', authState);
  }, [authState]);
  
  // Define routes
  const routes = [
    { path: '/', component: Homepage },
    { path: '/dashboard', component: DashboardPage },
    { path: '/configure', component: ConfigureWrapper },
    { path: '/login', component: SignInPage },
    { path: '/signin', component: SignInPage },
    // Fallback to Homepage for any other route
    { path: '*', component: Homepage }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <RouteHandler routes={routes} defaultRoute="/" />
    </div>
  );
};

export default App;