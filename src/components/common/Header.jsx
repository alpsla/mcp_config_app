import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/components/Header.css';
import CodeQualLogo from './CodeQualLogo';
import { signOut } from '../../services/supabase/authService';

// Temporary icon components until lucide-react is installed
// Dark mode icons removed as requested

const Globe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const Menu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const X = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const LogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Header = ({ 
  appName = 'MCP Config',
  navLinks = [],
  isAuthenticated = false,
  onSignOut = () => {},
  className = '',
}) => {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if the current path is the dashboard
  const isDashboard = location.pathname === '/dashboard';
  
  // Add home link to navLinks if we're on the dashboard
  const enhancedNavLinks = isDashboard ? [
    { to: '/', label: 'Home' },
    ...navLinks.filter(link => link.to !== '/'),
  ] : navLinks;
  
  // Handle sign out with proper auth flow
  const handleSignOut = async (e) => {
    // Store the original button element and text if coming from a button click
    let originalButton = null;
    let originalText = '';
    
    if (e) {
      e.preventDefault();
      // If we have an event object, store button reference
      originalButton = e.currentTarget;
      if (originalButton) {
        originalText = originalButton.textContent || 'Sign Out';
        originalButton.disabled = true;
        originalButton.textContent = 'Signing out...';
      }
    }
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    console.log('Sign Out clicked from header');
    
    try {
      // Clear auth tokens from local storage
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Call the proper sign out function
      const result = await signOut();
      console.log('Sign out result:', result);
      
      // Call the parent component's onSignOut callback if it exists
      if (onSignOut && typeof onSignOut === 'function') {
        try {
          await onSignOut();
          console.log('onSignOut callback executed successfully');
        } catch (callbackError) {
          console.error('Error in onSignOut callback:', callbackError);
        }
      }
      
      // Force reload the page to ensure all auth state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      
      // Reset button if there was an error
      if (originalButton) {
        originalButton.disabled = false;
        originalButton.textContent = originalText;
      }
      
      // Still try to redirect
      window.location.href = '/';
    }
  };
  
  // Navigate to home page
  const goToHomePage = (e) => {
    e.preventDefault();
    navigate('/');
  };
  
  return (
    <header className={`header ${className}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo (left) */}
          <div className="logo-container">
            <div className="logo-link" onClick={goToHomePage} style={{ cursor: 'pointer' }}>
              <div className="logo-wrapper">
                <CodeQualLogo className="logo-svg" />
              </div>
              <div className="logo-text">
                <span className="company-name">CodeQual</span>
                {appName !== 'CodeQual' && (
                  <span className="app-name">{appName}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Spacer to push everything to the sides */}
          <div className="flex-spacer"></div>
          
          {/* Navigation (center) */}
          <nav className="main-nav">
            <ul>
              {/* Filter out Home link if we're on Dashboard */}
              {enhancedNavLinks
                .map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className={location.pathname === link.to ? 'active' : ''}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Spacer to push everything to the sides */}
          <div className="flex-spacer"></div>
          
          {/* UI Controls (right) */}
          <div className="controls">
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Language Selector */}
            <div className="language-selector">
              <button
                className="language-button"
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                aria-label="Change language"
              >
                <Globe />
                <span className="language-text">EN</span>
                <ChevronDown />
              </button>
              
              {languageMenuOpen && (
                <div className="language-menu">
                  <div className="language-menu-options" role="menu" aria-orientation="vertical">
                    <button
                      className="language-option"
                      role="menuitem"
                      onClick={() => setLanguageMenuOpen(false)}
                    >
                      <span>English</span>
                      <span>✓</span>
                    </button>
                    <button
                      className="language-option"
                      role="menuitem"
                      onClick={() => setLanguageMenuOpen(false)}
                    >
                      <span>Español</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Theme Toggle removed as requested */}
            
            {/* Auth Buttons or User Profile */}
            {isAuthenticated ? (
              <div className="auth-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary">Log In</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only shown when mobileMenuOpen is true */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="container">
            <ul>
              {enhancedNavLinks
                .map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className={location.pathname === link.to ? 'active' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {isAuthenticated && (
                <li className="sign-out-item">
                  <button
                    className="sign-out-button"
                    onClick={handleSignOut}
                  >
                    <LogOut />
                    Sign Out
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;