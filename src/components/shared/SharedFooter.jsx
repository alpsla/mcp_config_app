import React from 'react';
import './SharedFooter.css';
import CodeQualLogo from '../common/CodeQualLogo';

const SharedFooter = () => {
  return (
    <footer className="shared-footer">
      <div className="shared-footer-content">
        <div className="shared-footer-main">
          <div className="shared-footer-branding">
            <div className="shared-footer-branding-header">
              <CodeQualLogo className="shared-footer-logo-img" />
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
                <li><a href="/features">Features</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/documentation">Documentation</a></li>
                <li><a href="/changelog">Changelog</a></li>
              </ul>
            </div>
            
            <div className="shared-footer-section">
              <h3 className="shared-footer-section-title">COMPANY</h3>
              <ul className="shared-footer-links">
                <li><a href="/about">About Us</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="shared-footer-section">
              <h3 className="shared-footer-section-title">LEGAL</h3>
              <ul className="shared-footer-links">
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/security">Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="shared-footer-bottom">
          <p className="shared-footer-copyright">
            © {new Date().getFullYear()} CodeQual, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SharedFooter;
