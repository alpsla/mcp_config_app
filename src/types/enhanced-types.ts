/**
 * Enhanced Types for the MCP Configuration Tool
 */

import { SubscriptionTier } from '../types';

// Enhanced subscription types
export type SubscriptionTierSimple = 'none' | 'basic' | 'complete';

// Helper function to convert from SubscriptionTier enum to simple string representation
export function mapTierToSimpleType(tier: SubscriptionTier | string | undefined): SubscriptionTierSimple {
  if (!tier) return 'none';
  
  switch(tier) {
    case SubscriptionTier.FREE:
      return 'none';
    case SubscriptionTier.STARTER:
    case SubscriptionTier.STANDARD:
    case 'BASIC':
    case 'basic':
      return 'basic';
    case SubscriptionTier.COMPLETE:
    case 'COMPLETE':
    case 'complete':
      return 'complete';
    default:
      return 'none';
  }
}

// Helper function to convert from simple string representation to SubscriptionTier enum
export function mapSimpleTypeToTier(simpleTier: SubscriptionTierSimple): SubscriptionTier {
  switch(simpleTier) {
    case 'none':
      return SubscriptionTier.FREE;
    case 'basic':
      return SubscriptionTier.STARTER;
    case 'complete':
      return SubscriptionTier.COMPLETE;
    default:
      return SubscriptionTier.FREE;
  }
}

// Enhanced parameter types
export interface GlobalParameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}
