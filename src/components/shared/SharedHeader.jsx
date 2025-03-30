import React from 'react';
import './SharedHeader.css';
import CodeQualLogo from '../common/CodeQualLogo';

const SharedHeader = ({
  navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/documentation', label: 'Documentation' }
  ],
  isAuthenticated = false,
  onSignOut = null,
  languageSelector = true
}) => {

  // Force a complete sign-out and page reload
  const handleSignOut = () => {
    // Clear any tokens from storage (this is the key part)
    localStorage.clear();
    sessionStorage.clear();
    
    // Force a page reload to the home page
    window.location.href = '/';
    
    // Return false to prevent default form submission
    return false;
  };

  return (
    <header className="shared-header">
      <div className="shared-header-container">
        <a href={isAuthenticated ? '/dashboard' : '/'} className="shared-header-logo">
          <CodeQualLogo className="shared-header-logo-img" />
          <div className="shared-header-branding">
            <h1 className="shared-header-app-name">CodeQual</h1>
            <p className="shared-header-tagline">MCP Config</p>
          </div>
        </a>
        
        <nav className="shared-header-nav">
          <ul className="shared-header-nav-list">
            {isAuthenticated ? 
              // Authenticated user sees Dashboard first
              navLinks.filter(link => link.to !== '/').map((link, index) => (
                <li key={index} className="shared-header-nav-item">
                  <a href={link.to} className="shared-header-nav-link">{link.label}</a>
                </li>
              ))
              : 
              // Non-authenticated user sees Home first
              navLinks.map((link, index) => (
                <li key={index} className="shared-header-nav-item">
                  <a href={link.to} className="shared-header-nav-link">{link.label}</a>
                </li>
              ))
            }
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
            <form onSubmit={handleSignOut} action="/" method="get">
              <button type="submit" className="shared-header-sign-out">
                Sign Out
              </button>
            </form>
          ) : (
            <a href="/login" className="shared-header-sign-in">
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;
