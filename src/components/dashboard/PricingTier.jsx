import React from 'react';
import './PricingTier.css';

const PricingTier = ({ plan }) => {
  return (
    <div className={`pricing-tier ${plan.highlight ? 'highlighted' : ''}`}>
      {plan.badge && <span className="plan-badge">{plan.badge}</span>}
      {plan.highlight && <span className="popular-badge">Most Popular</span>}
      
      <div className="plan-header">
        <h3 className="plan-name">{plan.name}</h3>
        <div className="plan-price">
          <span className="currency">$</span>
          <span className="amount">{plan.price}</span>
          <span className="period">/mo</span>
        </div>
      </div>
      
      <ul className="plan-features">
        {plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      
      <button className={`plan-button ${plan.highlight ? 'highlighted-button' : ''}`}>
        {plan.price === 0 ? 'Get Started' : 'Subscribe'}
      </button>
    </div>
  );
};

export default PricingTier;