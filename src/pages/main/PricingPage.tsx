import React from 'react';
import './MainPages.css';

const PricingPage: React.FC = () => {
  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Subscription Plans</h1>
        <p>Choose the plan that fits your needs</p>
      </div>
      
      <div className="pricing-cards">
        <div className="pricing-card">
          <div className="card-header">
            <h3>Free</h3>
          </div>
          <div className="card-body">
            <h2 className="card-price">$0<small>/month</small></h2>
            <ul className="features-list">
              <li>File System Access</li>
              <li>Web Search Integration</li>
              <li style={{ opacity: 0 }}>&nbsp;</li>
              <li style={{ opacity: 0 }}>&nbsp;</li>
            </ul>
            <button 
              className="plan-button current" 
              onClick={() => {
                window.location.hash = '/configuration';
              }}
            >
              Current Plan
            </button>
          </div>
        </div>
        
        <div className="pricing-card featured">
          <div className="card-header">
            <h3>Basic</h3>
          </div>
          <div className="card-body">
            <h2 className="card-price">$2<small>/month</small></h2>
            <ul className="features-list">
              <li>Everything in Free</li>
              <li>3 Hugging Face model integrations</li>
              <li>Save up to 3 configurations</li>
              <li>Basic email support</li>
            </ul>
            <button 
              className="plan-button subscribe"
              onClick={() => {
                const confirmed = window.confirm(`You're about to subscribe to the Basic plan for $2/month. Proceed to subscription page?`);
                if (confirmed) {
                  window.location.hash = '/subscribe?plan=basic';
                }
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
        
        <div className="pricing-card">
          <div className="card-header">
            <h3>Complete</h3>
          </div>
          <div className="card-body">
            <h2 className="card-price">$5<small>/month</small></h2>
            <ul className="features-list">
              <li>Everything in Basic</li>
              <li>Up to 10 Hugging Face model integrations</li>
              <li>Unlimited saved configurations</li>
              <li>Configuration export/import</li>
            </ul>
            <button 
              className="plan-button subscribe-alt"
              onClick={() => {
                const confirmed = window.confirm(`You're about to subscribe to the Complete plan for $5/month. Proceed to subscription page?`);
                if (confirmed) {
                  window.location.hash = '/subscribe?plan=complete';
                }
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;