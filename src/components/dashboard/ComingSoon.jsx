import React from 'react';
import './ComingSoon.css';

const ComingSoon = () => {
  const upcomingFeatures = [
    {
      title: 'Enhanced Model Marketplace',
      description: 'Browse and select from hundreds of AI models across different categories',
      icon: 'shopping_cart',
      emoji: '🛒'
    },
    {
      title: 'Advanced Analytics',
      description: 'Track usage, performance metrics, and optimization opportunities',
      icon: 'insights',
      emoji: '📊'
    },
    {
      title: 'Team Collaboration',
      description: 'Share configurations and collaborate with your team',
      icon: 'group',
      emoji: '👥'
    }
  ];
  
  return (
    <section className="coming-soon-section">
      <h2 className="section-title">Coming Soon</h2>
      <p className="section-description">
        We're working on exciting new features for the MCP Configuration Tool. Here's what's coming in our next update:
      </p>
      
      <div className="features-grid">
        {upcomingFeatures.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              {feature.emoji}
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="upgrade-prompt">
        <p>Unlock premium features by <a href="/subscription" className="upgrade-link">upgrading your account</a>.</p>
      </div>
    </section>
  );
};

export default ComingSoon;