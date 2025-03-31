import React from 'react';
import '../../pages/configuration/SubscriptionModal.css';

/**
 * Modal dialog for subscribing to premium tiers
 */
const SubscriptionModal = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;
  
  return (
    <div className="subscription-modal-overlay">
      <div className="subscription-modal">
        <div className="subscription-modal-header">
          <h2>Premium Feature - Subscription Required</h2>
          <button 
            className="subscription-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        <div className="subscription-modal-body">
          <p>Hugging Face Models integration is a premium feature available to subscribers.</p>
          
          <div className="subscription-tiers">
            <div className="subscription-tier">
              <h3>Basic Tier</h3>
              <p className="tier-price">$2/month</p>
              <ul>
                <li>Access to Web Search integration</li>
                <li>Access to File System integration</li>
                <li>Select up to 3 Hugging Face models</li>
              </ul>
              <button 
                className="subscribe-button"
                onClick={() => onSubscribe('basic')}
              >
                Subscribe to Basic
              </button>
            </div>
            
            <div className="subscription-tier tier-recommended">
              <div className="tier-badge">Recommended</div>
              <h3>Complete Tier</h3>
              <p className="tier-price">$5/month</p>
              <ul>
                <li>Access to Web Search integration</li>
                <li>Access to File System integration</li>
                <li>Select up to 10 Hugging Face models</li>
                <li>Priority support</li>
              </ul>
              <button 
                className="subscribe-button"
                onClick={() => onSubscribe('complete')}
              >
                Subscribe to Complete
              </button>
            </div>
          </div>
        </div>
        
        <div className="subscription-modal-footer">
          <button 
            className="subscription-modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
