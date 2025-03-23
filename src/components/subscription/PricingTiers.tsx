import React, { useState } from 'react';
import { subscriptionPlans, processPayment, getSubscriptionPlan } from '../../services/subscriptionService';
import { useAuth } from '../../auth/AuthContext';
import './PricingTiers.css';

export const PricingTiers: React.FC = () => {
  const { authState, updateSubscriptionTier } = useAuth();
  const user = authState.user;
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !user) return;

    setProcessing(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Get plan details
      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      if (!plan) {
        throw new Error('Selected plan not found');
      }
      
      // Process payment
      const result = await processPayment(user.id, selectedPlan);
      
      // Update user's subscription tier
      if (result.success) {
        await updateSubscriptionTier(user.id, plan.tier);
        setSuccessMessage(result.message);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="pricing-container">
        <div className="alert alert-error">
          You must be logged in to view pricing information.
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h2 className="pricing-title">Choose Your Plan</h2>
        <p className="pricing-subtitle">Select the tier that best fits your needs</p>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="alert alert-error">{errorMessage}</div>
      )}

      <div className="pricing-tiers">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id}
            className={`pricing-tier ${selectedPlan === plan.id ? 'selected' : ''} ${user.subscriptionTier === plan.tier ? 'current' : ''}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {user.subscriptionTier === plan.tier && (
              <div className="current-plan-badge">Current Plan</div>
            )}
            <div className="tier-header">
              <h3 className="tier-name">{plan.name}</h3>
              <div className="tier-price">
                ${plan.price}
                <span className="price-period">/month</span>
              </div>
            </div>
            <div className="tier-models">
              {plan.modelCount > 0 ? `${plan.modelCount} Models` : 'No Models'}
            </div>
            <ul className="tier-features">
              {plan.features.map((feature, index) => (
                <li key={index} className="tier-feature">
                  <svg className="feature-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className="btn btn-outline tier-select-btn"
              disabled={user.subscriptionTier === plan.tier || processing}
            >
              {user.subscriptionTier === plan.tier ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && selectedPlan !== user.subscriptionTier && (
        <div className="pricing-action">
          <button 
            className="btn btn-primary"
            onClick={handleSubscribe}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Subscribe Now'}
          </button>
        </div>
      )}
    </div>
  );
};
