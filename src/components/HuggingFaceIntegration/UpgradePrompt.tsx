import React from 'react';
import './UpgradePrompt.css';
import '../subscription/steps/buttons.css';

interface UpgradePromptProps {
  currentTier: 'basic' | 'complete' | 'none';
  targetTier: 'basic' | 'complete';
  benefit: string;
  onClose: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  currentTier,
  targetTier,
  benefit,
  onClose
}) => {
  const handleUpgrade = () => {
    // Here you would implement the upgrade logic
    // For now, we'll just close the modal
    onClose();
    
    // In a real implementation, you might navigate to a subscription page or show another dialog
    console.log(`Upgrading from ${currentTier} to ${targetTier}`);
  };

  return (
    <div className="upgrade-prompt-overlay">
      <div className="upgrade-prompt">
        <div className="prompt-header">
          <h3>You've reached your {currentTier} tier limit</h3>
        </div>
        <div className="prompt-content">
          <p>
            Your current plan allows selection of up to 3 models. Upgrade to the {targetTier} tier to access {benefit}.
          </p>
          <div className="tier-comparison">
            <div className="tier-feature">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Access to all 10 Hugging Face models</span>
            </div>
            <div className="tier-feature">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Advanced parameter customization</span>
            </div>
            <div className="tier-feature">
              <span className="feature-icon">✓</span>
              <span className="feature-text">Early access to upcoming marketplace features</span>
            </div>
          </div>
        </div>
        <div className="step-actions">
          <div className="button-container">
            <button 
              className="secondary-button"
              onClick={onClose}
            >
              Maybe Later
            </button>
            <button 
              className={`primary-button ${targetTier}`}
              onClick={handleUpgrade}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;