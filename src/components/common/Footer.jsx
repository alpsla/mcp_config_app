import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Footer.css';
import CodeQualLogo from './CodeQualLogo';

const Footer = ({
  appName = 'MCP Config',
  platformLinks = [
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/docs', label: 'Documentation' },
    { to: '/changelog', label: 'Changelog' }
  ],
  companyLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/blog', label: 'Blog' },
    { to: '/careers', label: 'Careers' },
    { to: '/contact', label: 'Contact' }
  ],
  legalLinks = [
    { to: '/terms', label: 'Terms of Service' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/security', label: 'Security' }
  ],
  isAuthenticated = false,
  className = '',
}) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`footer light-footer ${className}`}>
      <div className="container">
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Logo and description */}
          <div className="footer-column logo-column">
            <div className="footer-logo-container">
              <Link to={isAuthenticated ? "/dashboard" : "/"}>
                <div className="footer-logo-wrapper">
                  <CodeQualLogo className="footer-logo-svg" style={{ width: '28px', height: '28px' }} />
                </div>
              </Link>
              <div className="footer-brand">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="footer-company-name">
                  CodeQual
                </Link>
                {appName !== 'CodeQual' && (
                  <div className="footer-app-name">{appName}</div>
                )}
              </div>
            </div>
            <p className="footer-description">
              AI-powered tools to improve code quality and save development time.
            </p>
          </div>
          
          {/* Column 2: Platform Links */}
          <div className="footer-column">
            <h3 className="footer-heading">
              PLATFORM
            </h3>
            <ul className="footer-links">
              {platformLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Company Links */}
          <div className="footer-column">
            <h3 className="footer-heading">
              COMPANY
            </h3>
            <ul className="footer-links">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Legal Links */}
          <div className="footer-column">
            <h3 className="footer-heading">
              LEGAL
            </h3>
            <ul className="footer-links">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} CodeQual, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;