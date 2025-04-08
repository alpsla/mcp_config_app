import React from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import '../SubscriptionFlow.css';
import './buttons.css';

interface SuccessStepProps {
  selectedTier: SubscriptionTierSimple;
  onComplete: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  selectedTier,
  onComplete
}) => {
  const tierName = selectedTier === 'basic' ? 'Basic' : 'Complete';

  return (
    <div className="subscription-step success-step" style={{ backgroundColor: '#fff', color: '#333' }}>
      <div className="success-icon">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="#4CAF50"
            stroke="#4CAF50"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.75 12L10.58 14.83L16.25 9.17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2>Subscription Activated!</h2>
      <p className="success-message">
        Your {tierName} Plan has been successfully activated. You now have access to all the premium features and models included in your subscription.
      </p>

      <div className="subscription-details">
        <h3>Plan Details</h3>
        <div className="detail-item">
          <span className="detail-label">Plan:</span>
          <span className="detail-value">{tierName}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Price:</span>
          <span className="detail-value">{selectedTier === 'basic' ? '$2/month' : '$5/month'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status:</span>
          <span className="detail-value active">Active</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Next Billing Date:</span>
          <span className="detail-value">
            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="next-steps">
        <h3>Next Steps</h3>
        <ul className="steps-list">
          <li className="step-item">
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="step-content">
              <h4>Create Your First Configuration</h4>
              <p>Start by creating your first AI configuration with your preferred models and settings.</p>
            </div>
          </li>
          <li className="step-item">
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
              </svg>
            </div>
            <div className="step-content">
              <h4>Explore Available Models</h4>
              <p>Browse through {selectedTier === 'basic' ? '3' : 'all'} premium models that you can now integrate with your AI assistant.</p>
            </div>
          </li>
          <li className="step-item">
            <div className="step-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className="step-content">
              <h4>Check Documentation</h4>
              <p>Review our documentation to learn how to get the most out of your subscription.</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="subscription-help">
        <p>
          If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@mcpconfig.com">support@mcpconfig.com</a>.
        </p>
      </div>

      <div className="navigation-buttons">
        <button
          type="button"
          className="button-continue"
          style={{
            backgroundColor: selectedTier === 'complete' ? '#673AB7' : '#4285F4',
            margin: '0 auto'
          }}
          onClick={onComplete}
        >
          Start Configuring
        </button>
      </div>
    </div>
  );
};

export default SuccessStep;
