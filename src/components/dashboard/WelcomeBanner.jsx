import React from 'react';
import './WelcomeBanner.css';

const WelcomeBanner = ({ title, subtitle, badgeText }) => {
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1 className="welcome-title">{title}</h1>
          {badgeText && <span className="beta-badge">{badgeText}</span>}
        </div>
        {subtitle && <p className="welcome-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default WelcomeBanner;