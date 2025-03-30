import React from 'react';
import './Footer.css';

const Footer = ({ 
  appName = 'MCP Configuration Tool',
  platformLinks = [
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/documentation', label: 'Documentation' },
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
  onSignOut = () => {}
}) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-branding">
            <h3 className="footer-title">{appName}</h3>
            <p className="footer-description">
              Configure your AI assistant's capabilities with ease.
            </p>
          </div>
          
          <div className="footer-links-container">
            <div className="footer-link-group">
              <h4 className="footer-heading">PLATFORM</h4>
              <ul className="footer-links">
                {platformLinks.map((link, index) => (
                  <li key={`platform-${index}`}>
                    <a href={link.to}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-link-group">
              <h4 className="footer-heading">COMPANY</h4>
              <ul className="footer-links">
                {companyLinks.map((link, index) => (
                  <li key={`company-${index}`}>
                    <a href={link.to}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-link-group">
              <h4 className="footer-heading">LEGAL</h4>
              <ul className="footer-links">
                {legalLinks.map((link, index) => (
                  <li key={`legal-${index}`}>
                    <a href={link.to}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} CodeQual, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
