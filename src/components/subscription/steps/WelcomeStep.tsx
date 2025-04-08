import React, { useEffect, useRef } from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import { useSubscriptionContext } from '../../../contexts/SubscriptionFlowContext';
import { formatPrice } from '../../../config/pricing';
import '../SubscriptionFlow.css';
import '../welcomeStep.css';

// Most simplified welcome step possible
const WelcomeStep: React.FC<{
  selectedTier: SubscriptionTierSimple;
  onNext: () => void;
  onCancel: () => void;
}> = (props) => {
  // Get context data & console.log for debugging
  const { tierDetails } = useSubscriptionContext();
  console.log('WelcomeStep tierDetails:', tierDetails);
  
  // Get a safe tier value
  const safeTier = props.selectedTier === 'complete' ? 'complete' : 'basic';
  console.log('WelcomeStep safeTier:', safeTier);
  
  // Hardcoded fallback prices to ensure they always appear
  const fallbackPrice = safeTier === 'complete' ? '$8.99' : '$4.99';
  
  // Use tierDetails if available, otherwise fall back to hardcoded values
  const displayName = tierDetails?.displayName || (safeTier === 'complete' ? 'Complete Plan' : 'Basic Plan');
  const price = tierDetails?.price ? formatPrice(tierDetails.price.monthly) : fallbackPrice;
  const color = tierDetails?.color || (safeTier === 'complete' ? '#673AB7' : '#4285F4');
  
  console.log('WelcomeStep using price:', price);
  
  // Create a ref for the header section
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Use effect to focus on header when component mounts
  useEffect(() => {
    // Immediately scroll to top to prevent focus on footer
    window.scrollTo(0, 0);
    
    // Use multiple attempts to ensure it works across different browsers/conditions
    const attemptFocus = (attempt = 1) => {
      if (attempt > 5) return; // Give up after 5 attempts
      
      // Try to force focus
      if (headerRef.current) {
        try {
          // Set focus-related attributes
          headerRef.current.setAttribute('tabindex', '-1');
          headerRef.current.style.outline = 'none';
          
          // Force scroll to top again
          window.scrollTo(0, 0);
          
          // Focus the element
          headerRef.current.focus();
          
          console.log(`Focus attempt ${attempt} successful`);
          
          // Return focus to document body after a moment
          // This prevents persistent focus ring while keeping scroll position
          setTimeout(() => {
            document.body.focus();
          }, 100);
        } catch (e) {
          console.error(`Focus attempt ${attempt} failed:`, e);
          // Try again with increasing delay
          setTimeout(() => attemptFocus(attempt + 1), attempt * 100);
        }
      }
    };
    
    // Start immediately and also set a backup attempt
    attemptFocus();
    
    // Also try again after a short delay as backup
    const timerBackup = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    
    return () => clearTimeout(timerBackup);
  }, []);

  return (
    <div className="subscription-step" style={{ paddingTop: '20px' }}>
      {/* Enhanced Header Section */}
      <div 
        ref={headerRef} 
        tabIndex={-1} 
        id="subscription-header"
        style={{
          backgroundColor: color,
          padding: '30px 20px',
          borderRadius: '8px',
          color: 'white',
          marginTop: '0',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          outline: 'none', // Remove focus outline
          scrollMarginTop: '20px' // Add scroll margin for better scrollIntoView behavior
        }}
      >
        <h1 style={{
          fontSize: '28px', 
          marginBottom: '15px',
          fontWeight: '700'
        }}>
          Welcome to Your {displayName}
        </h1>
        
        <div style={{
          fontSize: '36px', 
          fontWeight: 'bold',
          margin: '15px 0'
        }}>
          {props.selectedTier === 'complete' ? '$8.99' : '$4.99'}<span style={{fontSize: '16px'}}>/month</span>
        </div>
        
        <p style={{fontSize: '16px', opacity: '0.9'}}>
          You're about to unlock the full potential of your AI assistant
        </p>
        
        <div style={{marginTop: '20px'}}>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            Beta Special Pricing
          </span>
        </div>
      </div>
      
      <div style={{
        margin: '30px 0',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        <h3>Your {displayName} Includes:</h3>
        <ul style={{listStyle: 'none', padding: '0'}}>
          <li style={{margin: '10px 0', paddingLeft: '25px', position: 'relative'}}>
            <span style={{position: 'absolute', left: '0', color: color}}>✓</span> 
            File System Access
          </li>
          <li style={{margin: '10px 0', paddingLeft: '25px', position: 'relative'}}>
            <span style={{position: 'absolute', left: '0', color: color}}>✓</span> 
            Web Search Integration
          </li>
          <li style={{margin: '10px 0', paddingLeft: '25px', position: 'relative'}}>
            <span style={{position: 'absolute', left: '0', color: color}}>✓</span> 
            {safeTier === 'basic' ? 'Up to 3 models' : 'Unlimited models'}
          </li>
          <li style={{margin: '10px 0', paddingLeft: '25px', position: 'relative'}}>
            <span style={{position: 'absolute', left: '0', color: color}}>✓</span> 
            Parameter Customization
          </li>
        </ul>
      </div>

      <div className="step-actions">
        <button 
          className="secondary-button"
          onClick={props.onCancel}
        >
          Cancel
        </button>
        
        <button 
          className="primary-button"
          onClick={props.onNext}
          style={{ backgroundColor: color }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;