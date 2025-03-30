import React from 'react';
import './WelcomeBanner.css';

const WelcomeBanner = ({ title, subtitle, badgeText }) => {
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <h1 className="welcome-title">{title}</h1>
        {badgeText && <div className="badge-container"><span className="beta-badge">{badgeText}</span></div>}
        {subtitle && <p className="welcome-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default WelcomeBanner;