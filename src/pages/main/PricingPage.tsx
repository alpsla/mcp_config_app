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
              <li>Basic Configuration</li>
              <li>File System Integration</li>
              <li>Web Search Integration</li>
              <li>Community Support</li>
            </ul>
            <button className="plan-button current">
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
              <li>Hugging Face Integration</li>
              <li>Up to 3 AI Models</li>
              <li>Email Support</li>
            </ul>
            <button className="plan-button subscribe">
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
              <li>Unlimited AI Models</li>
              <li>Priority Support</li>
              <li>Advanced Configuration Options</li>
            </ul>
            <button className="plan-button subscribe-alt">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;