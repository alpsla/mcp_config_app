import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the subscription tiers
export type SubscriptionTier = 'none' | 'basic' | 'complete';

interface SubscriptionContextType {
  subscription: SubscriptionTier;
  updateSubscription: (tier: SubscriptionTier) => void;
  isSubscribing: boolean;
  setIsSubscribing: (value: boolean) => void;
}

// Create the context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: 'none',
  updateSubscription: () => {},
  isSubscribing: false,
  setIsSubscribing: () => {},
});

// Create the provider component
export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionTier>('none');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Function to update the subscription tier
  const updateSubscription = (tier: SubscriptionTier) => {
    setSubscription(tier);
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        subscription, 
        updateSubscription, 
        isSubscribing, 
        setIsSubscribing 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook to use the subscription context
export const useSubscription = () => useContext(SubscriptionContext);
