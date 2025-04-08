import React, { useState } from 'react';
import './SubscriptionModal.css';
import '../subscription/steps/buttons.css';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (tier: 'basic' | 'complete') => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe
}) => {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'complete'>('basic');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate API call with a delay
    setTimeout(() => {
      onSubscribe(selectedTier);
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="subscription-modal-overlay">
      <div className="subscription-modal">
        <div className="modal-header">
          <h2>Subscribe to Enable Hugging Face Models</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-content">
          <p className="modal-description">
            Choose a subscription tier to access specialized AI models that extend Claude's capabilities.
          </p>
          
          <div className="tier-options">
            {/* Basic Tier Card */}
            <div 
              className={`tier-card ${selectedTier === 'basic' ? 'selected' : ''}`}
              onClick={() => setSelectedTier('basic')}
            >
              <div className="tier-header">
                <h3>Basic Tier</h3>
                <div className="tier-price">
                  <span className="price">$2</span>/month
                </div>
              </div>
              <ul className="tier-features">
                <li>Select up to 3 Hugging Face models</li>
                <li>Access to all 10 available models</li>
                <li>Basic parameter customization</li>
              </ul>
              <button 
                className={`tier-select-button ${selectedTier === 'basic' ? 'selected' : ''}`}
              >
                {selectedTier === 'basic' ? 'Selected' : 'Select'}
              </button>
            </div>

            {/* Complete Tier Card */}
            <div 
              className={`tier-card ${selectedTier === 'complete' ? 'selected' : ''}`}
              onClick={() => setSelectedTier('complete')}
            >
              <div className="best-value-badge">BEST VALUE</div>
              <div className="tier-header">
                <h3>Complete Tier</h3>
                <div className="tier-price">
                  <span className="price">$5</span>/month
                </div>
              </div>
              <ul className="tier-features">
                <li>Select all 10 Hugging Face models</li>
                <li>Advanced parameter customization</li>
                <li>Priority access to new models</li>
                <li>Early access to upcoming marketplace</li>
              </ul>
              <button 
                className={`tier-select-button ${selectedTier === 'complete' ? 'selected' : ''}`}
              >
                {selectedTier === 'complete' ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="step-actions">
          <div className="modal-note">
            You can change or cancel your subscription at any time.
          </div>
          <div className="button-container">
            <button 
              className="secondary-button" 
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button 
              className={`primary-button ${selectedTier}`}
              onClick={handleSubscribe}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;