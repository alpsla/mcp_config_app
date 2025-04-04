import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import GlobalParameterConfig from './GlobalParameterConfig';
import { enhancedConfigurationManager } from '../../services/EnhancedConfigurationManager';
import { SubscriptionTierSimple, mapSimpleTypeToTier } from '../../types/enhanced-types';
import './SubscriptionFlow.css';

interface SubscriptionFlowProps {
  onComplete: () => void;
  onCancel?: () => void;
  initialTier?: SubscriptionTierSimple;
}

/**
 * Component for the entire subscription flow, including:
 * 1. Tier selection
 * 2. Global parameter configuration
 * 3. Subscription confirmation
 */
const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({
  onComplete,
  onCancel,
  initialTier
}) => {
  const { authState, updateSubscriptionTier } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(initialTier ? 1 : 0);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierSimple>(initialTier || 'basic');
  const [globalParams, setGlobalParams] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle tier selection
  const handleTierSelect = (tier: SubscriptionTierSimple) => {
    setSelectedTier(tier);
    setCurrentStep(1);
  };

  // Handle parameter configuration completion
  const handleParametersComplete = (params: Record<string, any>) => {
    setGlobalParams(params);
    setCurrentStep(2);
  };

  // Handle subscription confirmation
  const handleConfirmSubscription = async () => {
    if (!authState?.user?.id) {
      setError('You must be logged in to subscribe');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Save subscription and parameters
      await enhancedConfigurationManager.createOrUpdateSubscriptionProfile(
        authState.user.id,
        selectedTier,
        globalParams
      );

      // Update auth context with new tier
      if (updateSubscriptionTier) {
        // Convert simple tier type to SubscriptionTier enum
        const subscriptionTier = mapSimpleTypeToTier(selectedTier);
        updateSubscriptionTier(subscriptionTier);
      }

      // Complete the flow
      onComplete();
    } catch (error: any) {
      console.error('Subscription error:', error);
      setError(error.message || 'Failed to process subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render tier selection step
  const renderTierSelection = () => (
    <div className="subscription-tier-selection">
      <h2>Choose Your Subscription</h2>
      <p className="step-description">
        Select a subscription tier to access Hugging Face models and AI enhancements.
      </p>

      <div className="tier-options">
        <div 
          className={`tier-option ${selectedTier === 'basic' ? 'selected' : ''}`}
          onClick={() => handleTierSelect('basic')}
        >
          <div className="tier-header">
            <h3>Basic</h3>
            <div className="tier-price">$2/month</div>
          </div>
          <ul className="tier-features">
            <li>Up to 3 Hugging Face models</li>
            <li>Basic parameter customization</li>
            <li>Standard integration support</li>
          </ul>
          <button className="tier-select-button">
            Select Basic
          </button>
        </div>

        <div 
          className={`tier-option ${selectedTier === 'complete' ? 'selected' : ''} premium`}
          onClick={() => handleTierSelect('complete')}
        >
          <div className="tier-badge">Recommended</div>
          <div className="tier-header">
            <h3>Complete</h3>
            <div className="tier-price">$5/month</div>
          </div>
          <ul className="tier-features">
            <li>Unlimited Hugging Face models</li>
            <li>Advanced parameter customization</li>
            <li>Priority integration support</li>
            <li>Early access to new features</li>
          </ul>
          <button className="tier-select-button premium">
            Select Complete
          </button>
        </div>
      </div>

      {onCancel && (
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );

  // Render global parameter configuration step
  const renderParameterConfig = () => (
    <GlobalParameterConfig
      tier={selectedTier}
      onComplete={handleParametersComplete}
      onCancel={() => setCurrentStep(0)}
    />
  );

  // Render subscription confirmation step
  const renderConfirmation = () => (
    <div className="subscription-confirmation">
      <h2>Confirm Your Subscription</h2>
      
      <div className="subscription-summary">
        <div className="summary-item">
          <span className="summary-label">Selected Plan:</span>
          <span className="summary-value">{selectedTier === 'basic' ? 'Basic' : 'Complete'} Subscription</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Price:</span>
          <span className="summary-value">{selectedTier === 'basic' ? '$2' : '$5'} per month</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Features:</span>
          <ul className="summary-features">
            {selectedTier === 'basic' ? (
              <>
                <li>Up to 3 Hugging Face models</li>
                <li>Basic parameter customization</li>
                <li>Standard integration support</li>
              </>
            ) : (
              <>
                <li>Unlimited Hugging Face models</li>
                <li>Advanced parameter customization</li>
                <li>Priority integration support</li>
                <li>Early access to new features</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="parameter-summary">
          <h3>Your Parameter Settings</h3>
          <div className="parameter-summary-items">
            {Object.entries(globalParams).map(([key, value]) => (
              <div key={key} className="parameter-summary-item">
                <span className="parameter-name">
                  {key === 'temperature' ? 'Temperature' : 
                   key === 'max_tokens' ? 'Maximum Length' :
                   key === 'top_p' ? 'Top P' :
                   key === 'top_k' ? 'Top K' :
                   key === 'presence_penalty' ? 'Presence Penalty' :
                   key === 'frequency_penalty' ? 'Frequency Penalty' :
                   key}
                </span>
                <span className="parameter-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="confirmation-actions">
        <button 
          className="back-button" 
          onClick={() => setCurrentStep(1)}
          disabled={isProcessing}
        >
          Back to Parameters
        </button>
        <button 
          className="confirm-button" 
          onClick={handleConfirmSubscription}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Confirm Subscription'}
        </button>
      </div>
      
      <div className="terms-info">
        <p>
          By confirming, you agree to the subscription terms. You can cancel anytime
          through your account settings.
        </p>
        <p>
          Your subscription will be activated immediately, providing access to all
          included features.
        </p>
      </div>
    </div>
  );

  // Render progress indicator
  const renderProgress = () => (
    <div className="subscription-progress">
      <div className={`progress-step ${currentStep >= 0 ? 'active' : ''} ${currentStep > 0 ? 'completed' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-name">Choose Plan</div>
      </div>
      <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-name">Set Parameters</div>
      </div>
      <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-name">Confirm</div>
      </div>
    </div>
  );

  return (
    <div className="subscription-flow">
      {renderProgress()}
      
      <div className="subscription-flow-content">
        {currentStep === 0 && renderTierSelection()}
        {currentStep === 1 && renderParameterConfig()}
        {currentStep === 2 && renderConfirmation()}
      </div>
    </div>
  );
};

export default SubscriptionFlow;
