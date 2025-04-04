import React, { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate, useLocation } from 'react-router-dom';
import { SubscriptionTierSimple, mapTierToSimpleType } from '../../types/enhanced-types';
import { SubscriptionTier } from '../../types';

/**
 * This component acts as a connector between your existing dashboard tier selection
 * and the new subscription flow with enhanced parameters.
 * 
 * It converts tier formats and ensures proper data flow between components.
 */
interface TierSelectionConnectorProps {
  onTierSelected: (tier: SubscriptionTierSimple) => void;
  initialTier?: SubscriptionTier | string;
}

const TierSelectionConnector: React.FC<TierSelectionConnectorProps> = ({
  onTierSelected,
  initialTier
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const location = useLocation();
  const [processedTier, setProcessedTier] = useState<boolean>(false);
  
  // Process tier information from URL parameters or props
  useEffect(() => {
    if (processedTier) return;
    
    // Check URL parameters first
    const params = new URLSearchParams(location.search);
    const tierParam = params.get('tier');
    
    if (tierParam) {
      // Convert from URL parameter (could be 'basic', 'complete', etc.)
      const simpleTier = mapTierToSimpleType(tierParam);
      onTierSelected(simpleTier);
      setProcessedTier(true);
    } else if (initialTier) {
      // Use the prop if no URL parameter
      const simpleTier = mapTierToSimpleType(initialTier);
      onTierSelected(simpleTier);
      setProcessedTier(true);
    }
  }, [location.search, initialTier, onTierSelected, processedTier]);
  
  // This component doesn't render anything visible
  return null;
};

export default TierSelectionConnector;