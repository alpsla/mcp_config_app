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
  const handleSignOut = async (e) => {
    e.preventDefault();
    console.log('Sign Out clicked in SharedHeader');
    
    try {
      // First call the provided onSignOut function if it exists
      if (onSignOut) {
        await onSignOut();
      }
      
      // Then clear local storage as a fallback
      localStorage.clear();
      sessionStorage.clear();
      
      // Navigate to home page
      window.location.hash = '/';
      
      // Force reload if needed
      // window.location.reload();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <header className="shared-header">
      <div className="shared-header-container">
        <a href="#/" className="shared-header-logo">
          <CodeQualLogo className="shared-header-logo-img" />
          <div className="shared-header-branding">
            <h1 className="shared-header-app-name">CodeQual</h1>
            <p className="shared-header-tagline">MCP Config</p>
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
            <>
              <a href="#/new-configuration" className="shared-header-new-config-btn">
                New Configuration
              </a>
              <button className="shared-header-sign-out" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <a href="#/signin" className="shared-header-sign-in">
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;