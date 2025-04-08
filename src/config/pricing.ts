// Centralized pricing and tier configuration
// This file contains all pricing-related information for the application

export interface TierFeature {
  id: string;
  name: string;
  included: boolean;
  limits?: {
    name: string;
    value: number | string;
    unit?: string;
  }[];
}

export interface TierPricing {
  id: 'none' | 'basic' | 'complete';
  name: string;
  displayName: string;
  description: string;
  price: {
    monthly: number;  // Price in USD
    yearly?: number;  // Optional yearly price (if discounted)
  };
  features: TierFeature[];
  popular?: boolean;
  badge?: string;
  color: string;
  lightColor: string;
}

// Main pricing configuration
const pricing: {
  tiers: TierPricing[];
  currency: string;
  currencySymbol: string;
} = {
  currency: 'USD',
  currencySymbol: '$',
  tiers: [
    {
      id: 'none',
      name: 'Free',
      displayName: 'Free',
      description: 'Basic access to configuration tools',
      price: {
        monthly: 0
      },
      features: [
        {
          id: 'file-system',
          name: 'File System Access',
          included: true
        },
        {
          id: 'web-search',
          name: 'Web Search',
          included: true
        },
        {
          id: 'parameter-presets',
          name: 'Parameter Presets',
          included: true
        },
        {
          id: 'huggingface',
          name: 'Hugging Face Integration',
          included: false
        },
        {
          id: 'configurations',
          name: 'Saved Configurations',
          included: true,
          limits: [
            {
              name: 'max',
              value: 1,
              unit: 'configuration'
            }
          ]
        },
        {
          id: 'support',
          name: 'Support',
          included: true
        }
      ],
      color: '#4F4F4F',
      lightColor: '#F0F0F0'
    },
    {
      id: 'basic',
      name: 'Basic',
      displayName: 'Basic Plan',
      description: 'Essential features for individual users',
      price: {
        monthly: 4.99,
        yearly: 49.99 // ~17% discount
      },
      features: [
        {
          id: 'file-system',
          name: 'File System Access',
          included: true
        },
        {
          id: 'web-search',
          name: 'Web Search',
          included: true
        },
        {
          id: 'parameter-presets',
          name: 'Parameter Presets',
          included: true
        },
        {
          id: 'huggingface',
          name: 'Hugging Face Integration',
          included: true,
          limits: [
            {
              name: 'models',
              value: 3,
              unit: 'models'
            }
          ]
        },
        {
          id: 'configurations',
          name: 'Saved Configurations',
          included: true,
          limits: [
            {
              name: 'max',
              value: 3,
              unit: 'configurations'
            }
          ]
        },
        {
          id: 'support',
          name: 'Support',
          included: true
        }
      ],
      color: '#4285F4',
      lightColor: '#E8F0FE'
    },
    {
      id: 'complete',
      name: 'Complete',
      displayName: 'Complete Plan',
      description: 'Advanced features for power users',
      price: {
        monthly: 8.99,
        yearly: 89.99 // ~17% discount
      },
      popular: true,
      badge: 'Most Popular',
      features: [
        {
          id: 'file-system',
          name: 'File System Access',
          included: true
        },
        {
          id: 'web-search',
          name: 'Web Search',
          included: true
        },
        {
          id: 'parameter-presets',
          name: 'Parameter Presets',
          included: true
        },
        {
          id: 'huggingface',
          name: 'Hugging Face Integration',
          included: true,
          limits: [
            {
              name: 'models',
              value: 'Unlimited',
              unit: 'models'
            }
          ]
        },
        {
          id: 'configurations',
          name: 'Saved Configurations',
          included: true,
          limits: [
            {
              name: 'max',
              value: 'Unlimited',
              unit: 'configurations'
            }
          ]
        },
        {
          id: 'support',
          name: 'Support',
          included: true
        },
        {
          id: 'export',
          name: 'Configuration Export/Import',
          included: true
        }
      ],
      color: '#673AB7',
      lightColor: '#F3E5F5'
    }
  ]
};

// Helper functions

/**
 * Get a specific tier by ID
 */
export const getTierById = (tierId: 'none' | 'basic' | 'complete'): TierPricing => {
  const tier = pricing.tiers.find(t => t.id === tierId);
  if (!tier) {
    throw new Error(`Tier with ID ${tierId} not found`);
  }
  return tier;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return `${pricing.currencySymbol}${price.toFixed(2)}`;
};

/**
 * Get monthly price for a tier
 */
export const getMonthlyPrice = (tierId: 'none' | 'basic' | 'complete'): string => {
  const tier = getTierById(tierId);
  return formatPrice(tier.price.monthly);
};

/**
 * Get yearly price for a tier
 */
export const getYearlyPrice = (tierId: 'none' | 'basic' | 'complete'): string => {
  const tier = getTierById(tierId);
  return formatPrice(tier.price.yearly || tier.price.monthly * 12);
};

/**
 * Get savings amount when paying yearly
 */
export const getYearlySavings = (tierId: 'none' | 'basic' | 'complete'): number => {
  const tier = getTierById(tierId);
  if (!tier.price.yearly) return 0;
  
  const monthlyTotal = tier.price.monthly * 12;
  return monthlyTotal - tier.price.yearly;
};

/**
 * Check if a feature is included in a tier
 */
export const hasFeature = (tierId: 'none' | 'basic' | 'complete', featureId: string): boolean => {
  const tier = getTierById(tierId);
  const feature = tier.features.find(f => f.id === featureId);
  return feature?.included || false;
};

/**
 * Get feature limit for a tier
 */
export const getFeatureLimit = (tierId: 'none' | 'basic' | 'complete', featureId: string): number | string | undefined => {
  const tier = getTierById(tierId);
  const feature = tier.features.find(f => f.id === featureId);
  if (!feature || !feature.limits || feature.limits.length === 0) return undefined;
  
  return feature.limits[0].value;
};

/**
 * Generate a darker version of a color for hover effects
 */
export const getDarkerColor = (hexColor: string): string => {
  // Remove the # if present
  let hex = hexColor.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Make darker by reducing each component by 15%
  r = Math.floor(r * 0.85);
  g = Math.floor(g * 0.85);
  b = Math.floor(b * 0.85);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export default pricing;