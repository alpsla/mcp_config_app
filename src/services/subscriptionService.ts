import { SubscriptionPlan, SubscriptionTier } from '../types';

// API endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const SUBSCRIPTION_ENDPOINTS = {
  UPDATE: `${API_BASE_URL}/subscription/update`,
  PROCESS_PAYMENT: `${API_BASE_URL}/subscription/payment`,
};

// Define subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: SubscriptionTier.FREE,
    price: 0,
    modelCount: 0,
    features: [
      'Web Search Integration',
      'Basic File System Access',
      'Community Support'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    tier: SubscriptionTier.STARTER,
    price: 5,
    modelCount: 3,
    features: [
      'Web Search Integration',
      'File System Access',
      'Hugging Face (3 models)',
      'Email Support'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    tier: SubscriptionTier.STANDARD,
    price: 10,
    modelCount: 6,
    features: [
      'Web Search Integration',
      'Advanced File System Access',
      'Hugging Face (6 models)',
      'Priority Email Support'
    ]
  },
  {
    id: 'complete',
    name: 'Complete',
    tier: SubscriptionTier.COMPLETE,
    price: 15,
    modelCount: 10,
    features: [
      'Web Search Integration',
      'Advanced File System Access',
      'Hugging Face (All models)',
      'Priority Email Support',
      'Custom Configuration Options'
    ]
  }
];

// Helper function for API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    // During development/testing, return mock success
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
      console.log(`Mock API call to ${url}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
    }

    // Get auth token if available
    const token = localStorage.getItem('auth_token');
    
    // Create a fresh headers object
    let headersObj: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // If options contains headers, add them
    if (options.headers) {
      try {
        // Convert the headers to a plain object
        const existingHeaders = options.headers as Record<string, string>;
        Object.keys(existingHeaders).forEach(key => {
          headersObj[key] = existingHeaders[key];
        });
      } catch (e) {
        console.warn('Could not process existing headers');
      }
    }
    
    // Add auth token if available
    if (token) {
      headersObj['Authorization'] = `Bearer ${token}`;
    }
    
    // Create options for fetch with our custom headers
    const fetchOptions = {
      ...options,
      // Bypass type checking by creating a fresh object
      headers: headersObj
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API request error (${url}):`, error.message);
    
    // If in development mode, still return mock success on error
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
      return { success: true };
    }
    
    throw error;
  }
};

export const getSubscriptionPlan = (tier: SubscriptionTier): SubscriptionPlan => {
  return subscriptionPlans.find(plan => plan.tier === tier) || subscriptionPlans[0];
};

export const processPayment = async (userId: string, planId: string) => {
  try {
    const plan = subscriptionPlans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    // Process payment through the API
    const result = await apiRequest(SUBSCRIPTION_ENDPOINTS.PROCESS_PAYMENT, {
      method: 'POST',
      body: JSON.stringify({ userId, planId }),
    });
    
    return {
      success: result.success,
      message: `Successfully subscribed to ${plan.name} plan`
    };
  } catch (error: any) {
    console.error('Payment processing error:', error.message);
    throw new Error(`Payment failed: ${error.message}`);
  }
};