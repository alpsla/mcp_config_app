import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/Header.css';
import CodeQualLogo from './CodeQualLogo';

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
  
  return (
    <header className={`header ${className}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo (left) */}
          <div className="logo-container">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="logo-link">
              <div className="logo-wrapper">
                <CodeQualLogo className="logo-svg" />
              </div>
              <div className="logo-text">
                <span className="company-name">CodeQual</span>
                {appName !== 'CodeQual' && (
                  <span className="app-name">{appName}</span>
                )}
              </div>
            </Link>
          </div>
          
          {/* Navigation (center) */}
          <nav className="main-nav">
            <ul>
              {navLinks.map((link, index) => (
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
                  onClick={() => {
                    console.log('Sign Out clicked from header');
                    document.location.replace('/');
                  }}
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
              {navLinks.map((link, index) => (
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
                    onClick={() => {
                      setMobileMenuOpen(false);
                      console.log('Mobile Sign Out clicked');
                      document.location.replace('/');
                    }}
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