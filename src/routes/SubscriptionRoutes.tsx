import React from 'react';
import { SubscriptionTierSimple } from '../types/enhanced-types';
import SubscriptionFlow from '../components/subscription/SubscriptionFlow';
import SubscriptionParameters from '../components/subscription/pages/SubscriptionParameters';

// Helper function to get tier from URL
const getTierFromURL = (): SubscriptionTierSimple => {
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '');
  const tierParam = searchParams.get('tier') || searchParams.get('plan');
  
  if (tierParam === 'complete') {
    return 'complete';
  }
  
  return 'basic';
};

export const parametersRoute = {
  path: '/subscribe/parameters',
  component: SubscriptionParameters
};

export const subscriptionRoutes = [
  {
    path: '/subscribe',
    component: ({ queryParams = {} }: { queryParams?: { tier?: string } }) => {
      const tierValue = queryParams?.tier || 'basic';
      const tier = (tierValue === 'basic' || tierValue === 'complete') ? tierValue as SubscriptionTierSimple : 'basic';
      
      return (
        <SubscriptionFlow
          initialTier={tier}
          onComplete={() => {}}
          onCancel={() => window.location.hash = '#/dashboard'}
        />
      );
    }
  },
  {
    path: '/subscribe/profile',
    component: () => (
      <SubscriptionFlow
        initialTier={getTierFromURL()}
        onComplete={() => {}}
        onCancel={() => window.location.hash = '#/dashboard'}
      />
    )
  },
  {
    path: '/subscribe/interests',
    component: () => (
      <SubscriptionFlow
        initialTier={getTierFromURL()}
        onComplete={() => {}}
        onCancel={() => window.location.hash = '#/dashboard'}
      />
    )
  },
  {
    path: '/subscribe/parameters',
    component: SubscriptionParameters
  },
  {
    path: '/subscribe/payment',
    component: () => (
      <SubscriptionFlow
        initialTier={getTierFromURL()}
        onComplete={() => {}}
        onCancel={() => window.location.hash = '#/dashboard'}
      />
    )
  },
  {
    path: '/subscribe/success',
    component: () => (
      <SubscriptionFlow
        initialTier={getTierFromURL()}
        onComplete={() => window.location.hash = '#/dashboard'}
        onCancel={() => window.location.hash = '#/dashboard'}
      />
    )
  }
];

export default subscriptionRoutes;