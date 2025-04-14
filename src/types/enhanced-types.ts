// Enhanced types for MCP Configuration App

/**
 * Simplified subscription tier type
 */
export type SubscriptionTierSimple = 'basic' | 'complete' | 'none';

/**
 * Subscription step type
 */
export type SubscriptionStep = 
  | 'welcome'
  | 'profile'
  | 'interests'
  | 'parameters'
  | 'payment'
  | 'success';

/**
 * Utility function to map simple tier type to full tier type
 */
export const mapSimpleTypeToTier = (simpleType: SubscriptionTierSimple): string => {
  switch (simpleType) {
    case 'basic':
      return 'Basic';
    case 'complete':
      return 'Complete';
    case 'none':
    default:
      return 'None';
  }
};

/**
 * Utility function to map full tier type to simple tier type
 */
export const mapTierToSimpleType = (tier: string): SubscriptionTierSimple => {
  switch (tier?.toLowerCase()) {
    case 'basic':
      return 'basic';
    case 'complete':
      return 'complete';
    default:
      return 'none';
  }
};

/**
 * Global parameter type
 */
export interface GlobalParameter {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean';
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  description: string;
}

/**
 * User profile data type
 */
export interface UserProfileData {
  firstName: string;
  lastName: string;
  company?: string;
  role?: string;
  email?: string;
}

/**
 * Interest data type
 */
export interface InterestData {
  interests: string[];
  primaryUseCase: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Parameter data type
 */
export interface ParameterData {
  temperature: number;
  maxLength: number;
  topP: number;
  topK: number;
  hfToken?: string;
}

/**
 * Payment data type
 */
export interface PaymentData {
  method: 'credit' | 'paypal';
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
  name?: string;
}

/**
 * Full subscription data type
 */
export interface SubscriptionData {
  tier: SubscriptionTierSimple;
  profile: UserProfileData;
  interests: InterestData;
  parameters: ParameterData;
  payment: PaymentData;
}