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
    if (typeof getTierById === 'function') {
      return getTierById(tierId);
    }
    return getDefaultTierDetails(tierId);
  } catch (error) {
    console.error('Error importing pricing configuration:', error);
    return getDefaultTierDetails(tierId);
  }
};

// Fallback function in case the real implementation is not available
const getDefaultTierDetails = (tierId: string) => {
  if (tierId === 'complete') {
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
  }
  return defaultTierDetails;
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
  topK: 40
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
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierSimple>(initialTier);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get tier details from the pricing configuration - with error handling
  const tierDetails = selectedTier ? safeGetTierById(selectedTier) : null;
  
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
        setSelectedTier,
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
