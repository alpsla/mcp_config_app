import React from 'react';
import './SubscriptionConfirmModal.css';
import { TierPricing } from '../../../config/pricing';

interface SubscriptionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedPlan: TierPricing | null;
  processing?: boolean;
}

/**
 * Modal to confirm subscription with auto-renewal terms
 */
const SubscriptionConfirmModal: React.FC<SubscriptionConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedPlan,
  processing = false
}) => {
  // If modal is not open or no plan is selected, don't render
  if (!isOpen || !selectedPlan) return null;

  // Format price for display
  const formattedPrice = `$${selectedPlan.price.monthly.toFixed(2)}`;

  return (
    <div className="subscription-modal-overlay">
      <div className="subscription-modal-container">
        <div 
          className="subscription-modal-header"
          style={{ backgroundColor: selectedPlan.lightColor, color: selectedPlan.color }}
        >
          <h3>Confirm Your Subscription</h3>
          <button onClick={onClose} className="subscription-modal-close-button">×</button>
        </div>
        
        <div className="subscription-modal-body">
          <p className="subscription-plan-summary">
            You are subscribing to the <strong>{selectedPlan.displayName}</strong> plan at <strong>{formattedPrice}/month</strong>.
          </p>
          
          <div className="subscription-terms-agreement">
            <p className="subscription-agreement-text">
              I agree my subscription will auto-renew each month at {formattedPrice} unless I cancel. 
              Taxes may apply; prices subject to change. Cancel any time through your profile 
              settings prior to any renewal to avoid future charges. Cancellation is effective 
              at the end of your current billing period. No refund or credits for partial billing periods.
            </p>
          </div>
        </div>
        
        <div className="subscription-modal-footer">
          <button 
            onClick={onClose} 
            className="subscription-cancel-button"
            disabled={processing}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="subscription-confirm-button"
            style={{ backgroundColor: selectedPlan.color }}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Agree & Subscribe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfirmModal;