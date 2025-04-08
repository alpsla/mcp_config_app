import React from 'react';
import './TierSelector.css';

/**
 * TierSelector component for the Dashboard
 * Replaces the old tier selection with direct navigation to the enhanced subscription flow
 */
const TierSelector = () => {
  // Direct navigation to subscription flow with tier info
  const handleSelectPlan = (tier) => {
    if (tier === 'free') {
      // For free tier, go directly to configuration
      localStorage.setItem('user_subscription_tier', 'none');
      window.location.hash = '/configuration';
    } else {
      // For paid tiers, navigate to subscription
      // Avoid using query parameters to prevent focus issues
      window.scrollTo(0, 0); // Reset scroll position
      window.location.href = '#/subscribe';
    }
  };

  return (
    <div className="subscription-wizard">
      <h3>Start Building Your Configuration</h3>
      
      <div className="wizard-steps">
        <div className="wizard-step active">
          <div className="step-number">1</div>
          <h4>Choose a Plan</h4>
        </div>
        <div className="wizard-connector"></div>
        <div className="wizard-step inactive">
          <div className="step-number">2</div>
          <h4>Select Models</h4>
        </div>
        <div className="wizard-connector"></div>
        <div className="wizard-step inactive">
          <div className="step-number">3</div>
          <h4>Configure &amp; Export</h4>
        </div>
      </div>
      
      <div className="plan-selection">
        <div className="plan-card free">
          <div className="plan-header">
            <h4>Free Plan</h4>
            <span className="price">$0</span>
          </div>
          <ul className="plan-features">
            <li>1 Free model (File System Access)</li>
            <li>1 Free model (Web Search Integration)</li>
            <li className="feature-not-included">No Hugging Face models</li>
          </ul>
          <button 
            className="plan-button" 
            onClick={() => handleSelectPlan('free')}
          >
            Select Free Plan
          </button>
        </div>
        
        <div className="plan-card basic">
          <div className="plan-header">
            <h4>Basic Plan</h4>
            <span className="price">$2<span className="month">/month</span></span>
          </div>
          <ul className="plan-features">
            <li>1 Free model (File System Access)</li>
            <li>1 Free model (Web Search Integration)</li>
            <li>3 Hugging Face models</li>
          </ul>
          <button 
            className="plan-button" 
            onClick={() => handleSelectPlan('basic')}
          >
            Select Basic Plan
          </button>
        </div>
        
        <div className="plan-card premium">
          <div className="recommended-badge">RECOMMENDED</div>
          <div className="plan-header">
            <h4>Complete Plan</h4>
            <span className="price">$5<span className="month">/month</span></span>
          </div>
          <ul className="plan-features">
            <li>1 Free model (File System Access)</li>
            <li>1 Free model (Web Search Integration)</li>
            <li>10 Hugging Face models</li>
            <li>Priority Support</li>
          </ul>
          <button 
            className="plan-button" 
            onClick={() => handleSelectPlan('complete')}
          >
            Select Complete Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierSelector;
