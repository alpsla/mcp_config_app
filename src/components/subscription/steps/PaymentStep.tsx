import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import '../SubscriptionFlow.css';
import './PaymentStep.css';

// Import sub-components
import OrderSummary from './payment/OrderSummary';
import PaymentMethodSelector from './payment/PaymentMethodSelector';
import CreditCardForm from './payment/CreditCardForm';
import PaypalForm from './payment/PaypalForm';
import SecurityNote from './payment/SecurityNote';
import usePricing from './payment/usePricing';
import { PaymentMethodType } from './payment/PaymentMethodSelector';

interface PaymentStepProps {
  selectedTier: SubscriptionTierSimple;
  initialData: {
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    billingName: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    billingCountry: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

/**
 * Payment step of the subscription flow
 * Uses the exact same approach as WelcomeStep for pricing
 */
const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedTier,
  initialData,
  onNext,
  onBack
}) => {
  // DEBUGGING
  console.log('==========================================');
  console.log('PAYMENT STEP - COMPONENT INITIALIZATION');
  console.log('selectedTier:', selectedTier);
  console.log('Full URL:', window.location.href);
  console.log('Hash part:', window.location.hash);
  console.log('==========================================');

  // Get pricing information from custom hook
  // This uses useSubscriptionContext internally just like WelcomeStep
  const pricingInfo = usePricing(selectedTier);

  // Payment data state
  const [paymentData, setPaymentData] = useState({
    cardNumber: initialData.cardNumber || '',
    cardExpiry: initialData.cardExpiry || '',
    cardCvc: initialData.cardCvc || '',
    billingName: initialData.billingName || '',
    billingAddress: initialData.billingAddress || '',
    billingCity: initialData.billingCity || '',
    billingState: initialData.billingState || '',
    billingZip: initialData.billingZip || '',
    billingCountry: initialData.billingCountry || 'US'
  });

  // Form errors and payment method
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit-card');

  // Use a ref to check for tier changes
  const prevTierRef = useRef(selectedTier);
  useEffect(() => {
    if (prevTierRef.current !== selectedTier) {
      console.log('TIER CHANGED from', prevTierRef.current, 'to', selectedTier);
      prevTierRef.current = selectedTier;
    }
  }, [selectedTier]);
  
  // Available countries
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' }
  ];

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format credit card number with spaces
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '') // Remove existing spaces
        .replace(/(\d{4})/g, '$1 ') // Add space after every 4 digits
        .trim(); // Remove trailing space
      
      setPaymentData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } 
    // Format expiry date with slash
    else if (name === 'cardExpiry') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length >= 2) {
        formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
      }
      
      setPaymentData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethodType) => {
    setPaymentMethod(method);
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    if (paymentMethod === 'paypal') {
      // PayPal doesn't require validation here
      return true;
    }
    
    const newErrors: Record<string, string> = {};
    
    // Card number validation
    const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cleanedCardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Expiry validation
    if (!paymentData.cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.cardExpiry)) {
      newErrors.cardExpiry = 'Use format MM/YY';
    } else {
      const [month, year] = paymentData.cardExpiry.split('/');
      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);
      const currentYear = new Date().getFullYear() % 100; // Get last two digits of year
      const currentMonth = new Date().getMonth() + 1; // January is 0
      
      if (expMonth < 1 || expMonth > 12) {
        newErrors.cardExpiry = 'Invalid month';
      } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.cardExpiry = 'Card expired';
      }
    }
    
    // CVC validation
    if (!paymentData.cardCvc) {
      newErrors.cardCvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(paymentData.cardCvc)) {
      newErrors.cardCvc = 'CVC must be 3-4 digits';
    }
    
    // Billing details validation
    if (!paymentData.billingName) {
      newErrors.billingName = 'Name is required';
    }
    
    if (!paymentData.billingAddress) {
      newErrors.billingAddress = 'Address is required';
    }
    
    if (!paymentData.billingCity) {
      newErrors.billingCity = 'City is required';
    }
    
    if (!paymentData.billingZip) {
      newErrors.billingZip = 'ZIP/Postal code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = () => {
    if (validateForm()) {
      onNext({
        ...paymentData,
        paymentMethod
      });
    }
  };

  // Add debug to window for testing
  useEffect(() => {
    // @ts-ignore
    window.DEBUG_PAYMENT_STEP = {
      selectedTier,
      pricingInfo
    };
    console.log('Global debug variable set: window.DEBUG_PAYMENT_STEP');
  }, [selectedTier, pricingInfo]);

  // Force showing debug info when running in development
  const showDebug = process.env.NODE_ENV === 'development';

  return (
    <div className="subscription-step payment-step" style={{ backgroundColor: '#fff', color: '#333' }}>
      <h2>Payment Information</h2>
      <p className="step-description">
        Set up your payment method for your {pricingInfo.displayName} subscription
      </p>
      
      {/* Order Summary Component */}
      <OrderSummary pricingInfo={pricingInfo} />

      {/* Payment Method Selector Component */}
      <PaymentMethodSelector 
        paymentMethod={paymentMethod} 
        onMethodChange={handlePaymentMethodChange} 
      />

      {/* Conditional Form Display - Credit Card or PayPal */}
      {paymentMethod === 'credit-card' ? (
        <CreditCardForm 
          paymentData={paymentData}
          errors={errors}
          handleInputChange={handleInputChange}
          countries={countries}
        />
      ) : (
        <PaypalForm />
      )}

      {/* Security Information Component */}
      <SecurityNote />

      {/* Action Buttons */}
      <div className="step-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="primary-button"
          style={{ backgroundColor: pricingInfo.color }}
          onClick={handleNext}
        >
          {paymentMethod === 'paypal' ? 'Continue to PayPal' : 'Next'}
        </button>
      </div>
      
      {/* DEBUG INFO */}
      <div style={{ 
        margin: '20px 0', 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
        fontFamily: 'monospace',
        display: showDebug ? 'block' : 'none'
      }}>
        <h4>Debug Info:</h4>
        <p>Selected Tier: <strong>{selectedTier}</strong></p>
        <p>Safe Tier: <strong>{pricingInfo.safeTier}</strong></p>
        <p>Display Name: <strong>{pricingInfo.displayName}</strong></p>
        <p>Price: <strong>{pricingInfo.price}</strong></p>
        <p>URL Hash: <strong>{window.location.hash}</strong></p>
      </div>
    </div>
  );
};

export default PaymentStep;