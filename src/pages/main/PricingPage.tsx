import React, { useState } from 'react';
import './MainPages.css';
// Import the necessary pricing functions and types
import pricing, { getDarkerColor, getTierById, TierPricing } from '../../config/pricing';
import SubscriptionConfirmModal from '../../components/subscription/modals/SubscriptionConfirmModal';

const PricingPage: React.FC = () => {
  // State for billing period toggle
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // State for focused plan
  const [focusedPlan, setFocusedPlan] = useState<string>('complete');
  
  // States for button hover effects
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // State for FAQ open/closed status
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);
  
  // Subscription modal states
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<TierPricing | null>(null);
  const [isProcessingSubscription, setIsProcessingSubscription] = useState<boolean>(false);
  
  // FAQ data
  const faqItems = [
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be effective immediately."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription from your account settings page. Access is available until the end of your billing period."
    },
    {
      question: "Is there a free trial?",
      answer: "The Free plan is available indefinitely. You can upgrade to a paid plan whenever you need additional features."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards and PayPal for subscription payments."
    },
    {
      question: "What happens when the beta period ends?",
      answer: "As a beta user, you'll keep these special rates for a full year after our official launch, even if prices increase for new users. Your feedback during the beta phase is invaluable to us."
    }
  ];
  
  // Handle subscription modal
  const openSubscriptionModal = (tierId: 'basic' | 'complete') => {
    setSelectedTier(getTierById(tierId));
    setIsSubscriptionModalOpen(true);
    console.log('PricingPage - openSubscriptionModal for tier:', tierId);
  };
  
  const closeSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
  };
  
  const handleSubscribe = async () => {
    if (!selectedTier) return;
    
    setIsProcessingSubscription(true);
    console.log('PricingPage - handleSubscribe for tier:', selectedTier.id);
    
    try {
      // Simulate API call for subscription
      setTimeout(() => {
        // This would be replaced with your actual subscription API call
        console.log('PricingPage - navigating to subscribe with plan:', selectedTier.id, 'and billing:', billingPeriod);
        window.location.hash = `#/subscribe?plan=${selectedTier.id}&billing=${billingPeriod}`;
        setIsProcessingSubscription(false);
        setIsSubscriptionModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Subscription error:', error);
      setIsProcessingSubscription(false);
    }
  };
  
  // Toggle FAQ item
  const toggleFaqItem = (index: number) => {
    setOpenFaqItem(openFaqItem === index ? null : index);
  };
  
  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Subscription Plans</h1>
        <p>Choose the plan that fits your needs</p>
        
        {/* Updated beta banner with more spacing */}
        <div className="beta-banner">
          <div className="beta-badge">BETA</div>
          <p>These are special beta prices. Early adopters will keep these rates for 1 year after launch.</p>
        </div>
        
        {/* Clean minimalist toggle matching the example image */}
        <div className="clean-toggle-container">
          <div className="toggle-option-wrapper">
            <span 
              className={`toggle-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </span>
            
            <label className="clean-switch">
              <input 
                type="checkbox" 
                checked={billingPeriod === 'yearly'} 
                onChange={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              />
              <span className="clean-slider"></span>
            </label>
            
            <span 
              className={`toggle-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
            </span>
          </div>
          
          <div className="save-badge">
            Save up to 17%
          </div>
        </div>
      </div>
      
      <div className="pricing-cards">
        {pricing.tiers.map(tier => {
          // Calculate displayed price based on billing period
          const displayPrice = billingPeriod === 'monthly' 
            ? tier.price.monthly 
            : (tier.price.yearly ? tier.price.yearly / 12 : tier.price.monthly);
          
          // Check if this is the focused plan
          const isFocused = focusedPlan === tier.id;
          
          // Get feature list for this tier
          const includedFeatures = tier.features.filter(feature => feature.included);
          
          return (
            <div 
              key={tier.id} 
              className={`pricing-card ${isFocused ? 'focused' : ''}`}
              onClick={() => setFocusedPlan(tier.id)}
            >
              <div className="card-header" style={{ backgroundColor: tier.color }}>
                <h3>{tier.displayName}</h3>
                {tier.badge && <div className="plan-badge">{tier.badge}</div>}
              </div>
              <div className="card-body">
                <h2 className="card-price">
                  {displayPrice === 0 ? '' : `$${displayPrice.toFixed(2)}`}
                  {displayPrice > 0 && (
                    <small>
                      /month {billingPeriod === 'yearly' && '(billed annually)'}
                    </small>
                  )}
                </h2>
                <ul className="features-list">
                  {includedFeatures.map((feature, index) => (
                    <li key={feature.id}>
                      {feature.name}
                      {feature.limits && feature.limits.length > 0 && (
                        <span className="feature-limit">
                          {` (${feature.limits[0].value} ${feature.limits[0].unit})`}
                        </span>
                      )}
                    </li>
                  ))}
                  {/* Add placeholder items to maintain consistent card height */}
                  {Array.from({ length: Math.max(0, 4 - includedFeatures.length) }).map((_, i) => (
                    <li key={`empty-${i}`} style={{ opacity: 0 }}>&nbsp;</li>
                  ))}
                </ul>
                {tier.id === 'none' ? (
                  <button 
                    className="plan-button subscribe" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card focus
                      window.location.hash = '/configuration';
                    }}
                    onMouseEnter={() => setHoveredButton(tier.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{ 
                      backgroundColor: hoveredButton === tier.id ? getDarkerColor(tier.color) : tier.color,
                      transition: 'background-color 0.3s ease, transform 0.3s ease',
                      transform: hoveredButton === tier.id ? 'translateY(-2px)' : 'none' 
                    }}
                  >
                    <span>Continue with Free Plan</span>
                  </button>
                ) : (
                  <button 
                    className={`plan-button subscribe ${tier.id === 'complete' ? 'subscribe-alt' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card focus
                      if (tier.id === 'basic' || tier.id === 'complete') {
                        openSubscriptionModal(tier.id);
                      }
                    }}
                    onMouseEnter={() => setHoveredButton(tier.id)}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{ 
                      backgroundColor: hoveredButton === tier.id ? getDarkerColor(tier.color) : tier.color,
                      transition: 'background-color 0.3s ease, transform 0.3s ease',
                      transform: hoveredButton === tier.id ? 'translateY(-2px)' : 'none' 
                    }}
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Feature comparison table */}
      <div className="feature-comparison">
        <h2>Feature Comparison</h2>
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                {pricing.tiers.map(tier => (
                  <th key={tier.id}>{tier.displayName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Collect all unique features */}
              {Array.from(new Set(pricing.tiers.flatMap(tier => 
                tier.features.map(f => f.id)
              ))).map(featureId => {
                // Get feature name from the first tier that has it
                const featureName = pricing.tiers
                  .find(t => t.features.some(f => f.id === featureId))
                  ?.features.find(f => f.id === featureId)?.name || 'Unknown Feature';
                
                return (
                  <tr key={featureId}>
                    <td>{featureName}</td>
                    {pricing.tiers.map(tier => {
                      const feature = tier.features.find(f => f.id === featureId);
                      return (
                        <td key={`${tier.id}-${featureId}`}>
                          {feature?.included ? (
                            <>
                              ✓ 
                              {feature.limits && feature.limits.length > 0 && (
                                <span className="limit-text">
                                  {` (${feature.limits[0].value} ${feature.limits[0].unit})`}
                                </span>
                              )}
                            </>
                          ) : '–'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FAQ Section with collapsible items */}
      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-accordion">
          {faqItems.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openFaqItem === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFaqItem(index)}
              >
                <h3>{faq.question}</h3>
                <span className="faq-toggle">{openFaqItem === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Confirmation Modal */}
      <SubscriptionConfirmModal
        isOpen={isSubscriptionModalOpen}
        onClose={closeSubscriptionModal}
        onConfirm={handleSubscribe}
        selectedPlan={selectedTier}
        processing={isProcessingSubscription}
      />
    </div>
  );
};

export default PricingPage;