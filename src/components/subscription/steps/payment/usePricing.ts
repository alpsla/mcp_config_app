import { useEffect } from 'react';
import { SubscriptionTierSimple } from '../../../../types/enhanced-types';
import { formatPrice } from '../../../../config/pricing';
import { useSubscriptionContext } from '../../../../contexts/SubscriptionFlowContext';

export interface PricingInfo {
  safeTier: SubscriptionTierSimple;
  displayName: string;
  price: string;
  color: string;
  lightColor: string;
}

/**
 * Custom hook that handles pricing logic - IDENTICAL to WelcomeStep approach
 */
export const usePricing = (selectedTier: SubscriptionTierSimple): PricingInfo => {
  // Get context data exactly like WelcomeStep does
  const { tierDetails } = useSubscriptionContext();
  
  // Debug logging
  console.log('usePricing hook - selectedTier:', selectedTier);
  console.log('usePricing hook - tierDetails from context:', tierDetails);
  
  // Get a safe tier value - exactly like WelcomeStep
  const safeTier = selectedTier === 'complete' ? 'complete' : 'basic';
  console.log('usePricing hook - safeTier:', safeTier);
  
  // Hardcoded fallback prices to ensure they always appear - exactly like WelcomeStep
  const fallbackPrice = safeTier === 'complete' ? '$8.99' : '$4.99';
  
  // Use tierDetails if available, otherwise fall back to hardcoded values - exactly like WelcomeStep
  const displayName = tierDetails?.displayName || (safeTier === 'complete' ? 'Complete Plan' : 'Basic Plan');
  const price = tierDetails?.price ? formatPrice(tierDetails.price.monthly) : fallbackPrice;
  const color = tierDetails?.color || (safeTier === 'complete' ? '#673AB7' : '#4285F4');
  const lightColor = tierDetails?.lightColor || (safeTier === 'complete' ? '#F3E5F5' : '#E8F0FE');
  
  console.log('usePricing hook - final price:', price);
  console.log('usePricing hook - final displayName:', displayName);

  // Force debug output for tier info at render time using useEffect
  useEffect(() => {
    console.log('===== PRICING HOOK - RENDER CHECK =====');
    console.log('tierDetails from context:', tierDetails);
    console.log('selectedTier:', selectedTier);
    console.log('safeTier:', safeTier);
    console.log('displayName:', displayName);
    console.log('price:', price);
    console.log('=====================================');
  }, [selectedTier, tierDetails, displayName, price, safeTier]);

  return {
    safeTier,
    displayName,
    price,
    color,
    lightColor
  };
};

export default usePricing;