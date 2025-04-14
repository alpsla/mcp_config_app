import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SubscriptionTierSimple } from '../types/enhanced-types';

// Create a safe implementation of getTierById if pricing.ts isn't loading correctly
const defaultTierDetails = {
  id: 'basic',
  name: 'Basic',
  displayName: 'Basic Plan',
  description: 'Essential features for individual users',
  price: {
    monthly: 4.99,
    yearly: 49.99
  },
  features: [],
  color: '#4285F4',
  lightColor: '#E8F0FE'
};

// Safe getTierById implementation
const safeGetTierById = (tierId: string) => {
  try {
    // Try to import the real implementation
    const { getTierById } = require('../config/pricing');
    console.log('Using actual pricing config for tier:', tierId);
    if (typeof getTierById === 'function') {
      const tierInfo = getTierById(tierId);
      console.log('Resolved tier info for', tierId, tierInfo);
      return tierInfo;
    }
    console.log('Falling back to default tier info for', tierId);
    return getDefaultTierDetails(tierId);
  } catch (error) {
    console.error('Error importing pricing configuration:', error);
    console.log('Falling back to default tier info (after error) for', tierId);
    return getDefaultTierDetails(tierId);
  }
};

// Fallback function in case the real implementation is not available
const getDefaultTierDetails = (tierId: string) => {
  console.log('Getting default tier details for:', tierId);
  
  if (tierId === 'complete') {
    console.log('Returning Complete tier default details');
    return {
      ...defaultTierDetails,
      id: 'complete',
      name: 'Complete',
      displayName: 'Complete Plan',
      description: 'Advanced features for power users',
      price: {
        monthly: 8.99,
        yearly: 89.99
      },
      color: '#673AB7',
      lightColor: '#F3E5F5'
    };
  } else if (tierId === 'basic') {
    console.log('Returning Basic tier default details');
    return {
      ...defaultTierDetails,
      id: 'basic',
      name: 'Basic',
      displayName: 'Basic Plan',
      description: 'Essential features for individual users',
      price: {
        monthly: 4.99,
        yearly: 49.99
      },
      color: '#4285F4',
      lightColor: '#E8F0FE'
    };
  }
  console.log('Returning Free tier default details');
  return {
    ...defaultTierDetails,
    id: 'none',
    name: 'Free',
    displayName: 'Free Plan',
    description: 'Basic access for everybody',
    price: {
      monthly: 0,
      yearly: 0
    },
    color: '#4F4F4F',
    lightColor: '#F0F0F0'
  };
};

interface SubscriptionFlowContextData {
  selectedTier: SubscriptionTierSimple;
  setSelectedTier: (tier: SubscriptionTierSimple) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  tierDetails: ReturnType<typeof safeGetTierById> | null;
  formData: {
    // Profile data
    firstName: string;
    lastName: string;
    displayName: string;
    company: string;
    role: string;
    // Interests data
    interests: string[];
    primaryUseCase: string;
    experienceLevel: string;
    // Payment data
    paymentMethod: 'credit-card' | 'paypal';
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    billingName: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    billingCountry: string;
    // Parameters
    useDefaultParameters: boolean;
    temperature: number;
    maxLength: number;
    topP: number;
    topK: number;
    hfToken: string; // Token itself for UI purposes only
    hfTokenProvided?: boolean; // Flag indicating if token is provided
  };
  updateFormData: (data: Partial<SubscriptionFlowContextData['formData']>) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const initialFormData = {
  // Profile data
  firstName: '',
  lastName: '',
  displayName: '',
  company: '',
  role: '',
  // Interests data
  interests: [] as string[],
  primaryUseCase: '',
  experienceLevel: 'intermediate',
  // Payment data
  paymentMethod: 'credit-card' as const,
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  billingName: '',
  billingAddress: '',
  billingCity: '',
  billingState: '',
  billingZip: '',
  billingCountry: 'US',
  // Parameters
  useDefaultParameters: true,
  temperature: 0.7,
  maxLength: 100,
  topP: 0.9,
  topK: 40,
  hfToken: '', // Initialize hfToken
  hfTokenProvided: false // Initialize hfTokenProvided
};

// Create the context
const SubscriptionFlowContext = createContext<SubscriptionFlowContextData>({
  selectedTier: 'basic',
  setSelectedTier: () => {},
  currentStep: 0,
  setCurrentStep: () => {},
  tierDetails: null,
  formData: initialFormData,
  updateFormData: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  error: null,
  setError: () => {}
});

// Create the provider component
export const SubscriptionFlowProvider: React.FC<{ 
  children: ReactNode, 
  initialTier?: SubscriptionTierSimple 
}> = ({ 
  children, 
  initialTier = 'basic' 
}) => {
  console.log('SubscriptionFlowProvider initialTier:', initialTier); // Debug log
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierSimple>(initialTier);
  
  // Debug logging for tier changes
  const setSelectedTierWithLogging = (newTier: SubscriptionTierSimple) => {
    console.log('===== CONTEXT: TIER BEING CHANGED =====');
    console.log('Current tier:', selectedTier);
    console.log('New tier:', newTier);
    console.log('Call stack:', new Error().stack);
    console.log('=====================================');
    setSelectedTier(newTier);
  };
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get tier details from the pricing configuration - with error handling
  const tierDetails = selectedTier ? safeGetTierById(selectedTier) : null;
  console.log('SubscriptionFlowProvider tierDetails:', tierDetails); // Debug log
  
  // Function to update form data
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  return (
    <SubscriptionFlowContext.Provider
      value={{
        selectedTier,
        setSelectedTier: setSelectedTierWithLogging,
        currentStep,
        setCurrentStep,
        tierDetails,
        formData,
        updateFormData,
        isProcessing,
        setIsProcessing,
        error,
        setError
      }}
    >
      {children}
    </SubscriptionFlowContext.Provider>
  );
};

// Custom hook to use the subscription flow context
export const useSubscriptionContext = () => useContext(SubscriptionFlowContext);
