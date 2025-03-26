import React from 'react';
import { SubscriptionTier } from '../../types';
import { subscriptionPlans, getSubscriptionPlan } from '../../services/subscriptionService';
import { useAuth } from '../../auth/AuthContext';
import './PricingTiers.css';

interface PricingTiersProps {
  onSelectTier: (tier: SubscriptionTier) => void;
}

const PricingTiers: React.FC<PricingTiersProps> = ({ onSelectTier }) => {
  const { authState } = useAuth();
  
  // Get all tiers from the subscription plans
  const tiers = subscriptionPlans.map(plan => plan.tier);

  const isCurrentTier = (tier: SubscriptionTier): boolean => {
    return authState.user?.subscriptionTier === tier;
  };

  const isUpgradeTier = (tier: SubscriptionTier): boolean => {
    if (!authState.user) return false;
    
    const tierValues = {
      [SubscriptionTier.FREE]: 0,
      [SubscriptionTier.STARTER]: 1,
      [SubscriptionTier.STANDARD]: 2,
      [SubscriptionTier.COMPLETE]: 3
    };
    
    return tierValues[tier] > tierValues[authState.user.subscriptionTier];
  };

  const getTierTitle = (tier: SubscriptionTier): string => {
    switch (tier) {
      case SubscriptionTier.FREE:
        return 'Free';
      case SubscriptionTier.STARTER:
      case SubscriptionTier.STANDARD: // For backward compatibility
        return 'Basic';
      case SubscriptionTier.COMPLETE:
        return 'Complete';
      default:
        return 'Unknown';
    }
  };

  const getButtonText = (tier: SubscriptionTier): string => {
    if (isCurrentTier(tier)) {
      return 'Current Plan';
    } else if (isUpgradeTier(tier)) {
      return 'Upgrade Plan';
    } else {
      return 'Select Plan';
    }
  };

  const getPriceForTier = (tier: SubscriptionTier): number => {
    const plan = getSubscriptionPlan(tier);
    return plan.price;
  };

  const getFeaturesForTier = (tier: SubscriptionTier): string[] => {
    const plan = getSubscriptionPlan(tier);
    return plan.features;
  };

  return (
    <div className="pricing-tiers">
      <h2 className="pricing-title">Choose Your Plan</h2>
      <p className="pricing-subtitle">
        Select the plan that best fits your needs. All plans are one-time payments during our beta period.
      </p>
      
      <div className="tier-cards">
        {tiers.map(tier => (
          <div 
            key={tier} 
            className={`tier-card ${isCurrentTier(tier) ? 'current-tier' : ''}`}
          >
            <div className="tier-header">
              <h3 className="tier-name">{getTierTitle(tier)}</h3>
              <div className="tier-price">
                ${getPriceForTier(tier)}
                {getPriceForTier(tier) > 0 && (
                  <span className="price-period">one-time</span>
                )}
              </div>
            </div>
            
            <div className="tier-features">
              <ul>
                {getFeaturesForTier(tier).map((feature, index) => (
                  <li key={index}>
                    <span className="feature-check">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="tier-action">
              <button 
                className={`tier-button ${isCurrentTier(tier) ? 'current' : ''}`}
                onClick={() => onSelectTier(tier)}
                disabled={isCurrentTier(tier)}
              >
                {getButtonText(tier)}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pricing-note">
        <p>
          <strong>Note:</strong> During the beta period, all payments are one-time.
          After the full release, these will convert to monthly subscription plans.
        </p>
      </div>
    </div>
  );
};

export default PricingTiers;
