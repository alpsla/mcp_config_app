import React, { useState } from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import '../SubscriptionFlow.css';
// Import pricing configuration
import { getTierById, formatPrice } from '../../../config/pricing';

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

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedTier,
  initialData,
  onNext,
  onBack
}) => {
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal'>('credit-card');

  // Get tier details from centralized pricing configuration
  const tierInfo = getTierById(selectedTier);
  
  // Available countries
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' }
    // Add more countries as needed
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
  const handlePaymentMethodChange = (method: 'credit-card' | 'paypal') => {
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

  return (
    <div className="subscription-step payment-step" style={{ backgroundColor: '#fff', color: '#333' }}>
      <h2>Payment Information</h2>
      <p className="step-description">
        Set up your payment method for your {tierInfo.displayName} subscription
      </p>

      <div className="payment-summary">
        <h3>Subscription Summary</h3>
        <div className="payment-details">
          <div className="payment-row">
            <span className="payment-label">Plan:</span>
            <span className="payment-value">{tierInfo.displayName}</span>
          </div>
          <div className="payment-row">
            <span className="payment-label">Price:</span>
            <span className="payment-value">{formatPrice(tierInfo.price.monthly)}/month</span>
          </div>
          <div className="payment-row">
            <span className="payment-label">Billed:</span>
            <span className="payment-value">Monthly</span>
          </div>
          {tierInfo.price.yearly && (
            <div className="payment-row savings">
              <span className="payment-label">Yearly option:</span>
              <span className="payment-value">{formatPrice(tierInfo.price.yearly/12)}/month (billed annually)</span>
            </div>
          )}
        </div>
      </div>

      <div className="payment-method-selector">
        <h3>Payment Method</h3>
        <div className="payment-methods">
          <div 
            className={`payment-method-option ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodChange('credit-card')}
          >
            <input
              type="radio"
              id="method-card"
              name="paymentMethod"
              checked={paymentMethod === 'credit-card'}
              onChange={() => handlePaymentMethodChange('credit-card')}
            />
            <label htmlFor="method-card">
              <div className="method-icon">💳</div>
              <div className="method-name">Credit Card</div>
            </label>
          </div>
          
          <div 
            className={`payment-method-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodChange('paypal')}
          >
            <input
              type="radio"
              id="method-paypal"
              name="paymentMethod"
              checked={paymentMethod === 'paypal'}
              onChange={() => handlePaymentMethodChange('paypal')}
            />
            <label htmlFor="method-paypal">
              <div className="method-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0070BA">
                  <path d="M20.067 8.478c.492.926.777 2.01.777 3.213 0 3.454-2.942 6.25-6.563 6.25h-1.25c-.42 0-.763.342-.763.762 0 .075.01.15.03.221l.54 2.436c.17.675.675 1.152 1.367 1.152h2.268c.32 0 .558.317.558.67 0 .352-.238.67-.558.67h-2.268c-1.292 0-2.4-.817-2.712-2.026l-.54-2.436a1.742 1.742 0 01-.063-.443c0-1.025.83-1.855 1.854-1.855h1.249c2.825 0 5.127-2.156 5.127-4.806 0-.891-.226-1.726-.623-2.458-.193-.204-.193-.51-.16-.72.032-.115.102-.19.208-.253.219-.089.409-.115.522-.063h.008v.014z" />
                  <path d="M6.786 19.119l.565 2.501c.168.742.825 1.29 1.596 1.29h2.214c.39 0 .66.382.66.762s-.27.763-.66.763H8.947c-1.516 0-2.848-1.01-3.2-2.436L5.18 19.498a1.824 1.824 0 01-.05-.417c0-.956.777-1.722 1.723-1.722h2.214c2.84 0 5.127-2.156 5.127-4.806 0-2.413-1.893-4.442-4.45-4.747a1.712 1.712 0 01-.191-.032h-5.67a.808.808 0 00-.801.618L.52 20.253c-.102.408.204.791.618.791h4.568a.918.918 0 00.894-.626.883.883 0 00.187-1.299zM9.97 9.842c1.666.178 2.98 1.537 2.98 3.175 0 1.778-1.516 3.213-3.405 3.213H7.346c-.088 0-.176.008-.264.025a.79.79 0 00-.224.076L7.32 14.59c.168-1.01 1.048-1.727 2.086-1.727h1.222c.39 0 .66-.382.66-.763s-.27-.762-.66-.762H9.407c-.957 0-1.774-.524-2.175-1.283a1.943 1.943 0 01-.207-.8c.01-.05.01-.102.02-.153h2.926z" />
                </svg>
              </div>
              <div className="method-name">PayPal</div>
            </label>
          </div>
        </div>
      </div>

      {paymentMethod === 'credit-card' ? (
        <div className="payment-form credit-card-form">
          <div className="form-section">
            <h3>Card Details</h3>
            
            <div className="form-group">
              <label htmlFor="cardNumber">
                Card Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                className={errors.cardNumber ? 'error' : ''}
                maxLength={19} // 16 digits + 3 spaces
              />
              {errors.cardNumber && (
                <div className="error-message">{errors.cardNumber}</div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardExpiry">
                  Expiry Date <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={paymentData.cardExpiry}
                  onChange={handleInputChange}
                  className={errors.cardExpiry ? 'error' : ''}
                  maxLength={5} // MM/YY
                />
                {errors.cardExpiry && (
                  <div className="error-message">{errors.cardExpiry}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="cardCvc">
                  CVC <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="cardCvc"
                  name="cardCvc"
                  placeholder="123"
                  value={paymentData.cardCvc}
                  onChange={handleInputChange}
                  className={errors.cardCvc ? 'error' : ''}
                  maxLength={4}
                />
                {errors.cardCvc && (
                  <div className="error-message">{errors.cardCvc}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Billing Address</h3>
            
            <div className="form-group">
              <label htmlFor="billingName">
                Name on Card <span className="required">*</span>
              </label>
              <input
                type="text"
                id="billingName"
                name="billingName"
                placeholder="John Doe"
                value={paymentData.billingName}
                onChange={handleInputChange}
                className={errors.billingName ? 'error' : ''}
              />
              {errors.billingName && (
                <div className="error-message">{errors.billingName}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="billingAddress">
                Address <span className="required">*</span>
              </label>
              <input
                type="text"
                id="billingAddress"
                name="billingAddress"
                placeholder="123 Main St, Apt 4B"
                value={paymentData.billingAddress}
                onChange={handleInputChange}
                className={errors.billingAddress ? 'error' : ''}
              />
              {errors.billingAddress && (
                <div className="error-message">{errors.billingAddress}</div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingCity">
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="billingCity"
                  name="billingCity"
                  placeholder="New York"
                  value={paymentData.billingCity}
                  onChange={handleInputChange}
                  className={errors.billingCity ? 'error' : ''}
                />
                {errors.billingCity && (
                  <div className="error-message">{errors.billingCity}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="billingState">
                  State/Province <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="billingState"
                  name="billingState"
                  placeholder="NY"
                  value={paymentData.billingState}
                  onChange={handleInputChange}
                  className={errors.billingState ? 'error' : ''}
                />
                {errors.billingState && (
                  <div className="error-message">{errors.billingState}</div>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingZip">
                  ZIP/Postal Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="billingZip"
                  name="billingZip"
                  placeholder="10001"
                  value={paymentData.billingZip}
                  onChange={handleInputChange}
                  className={errors.billingZip ? 'error' : ''}
                />
                {errors.billingZip && (
                  <div className="error-message">{errors.billingZip}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="billingCountry">
                  Country <span className="required">*</span>
                </label>
                <select
                  id="billingCountry"
                  name="billingCountry"
                  value={paymentData.billingCountry}
                  onChange={handleInputChange}
                  className={errors.billingCountry ? 'error' : ''}
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.billingCountry && (
                  <div className="error-message">{errors.billingCountry}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="payment-form paypal-form">
          <div className="paypal-info">
            <p className="paypal-message">
              You'll be redirected to PayPal to complete your payment securely.
              After completing the payment, you'll be returned to finish setting up your subscription.
            </p>
            <div className="paypal-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30" fill="#0070BA">
                <path d="M36.5,7.1h-7c-0.5,0-0.9,0.4-1,0.9l-2.8,18c-0.1,0.4,0.2,0.7,0.6,0.7h3.5c0.5,0,0.9-0.4,1-0.9l0.8-4.9 c0.1-0.5,0.5-0.9,1-0.9h2.2c4.8,0,7.5-2.3,8.2-6.8c0.3-2-0.1-3.5-1-4.6C41,7.7,39.1,7.1,36.5,7.1z M37.2,13.6 c-0.4,2.6-2.4,2.6-4.3,2.6h-1.1l0.8-4.8c0-0.3,0.3-0.5,0.6-0.5h0.5c1.3,0,2.5,0,3.2,0.7C37.2,12,37.3,12.7,37.2,13.6z"/>
                <path d="M58.3,13.5h-3.5c-0.3,0-0.6,0.2-0.6,0.5l-0.2,1l-0.2-0.4c-0.8-1.1-2.4-1.5-4.1-1.5c-3.8,0-7.1,2.9-7.7,7 c-0.3,2,0.1,4,1.2,5.3c1,1.2,2.4,1.7,4.1,1.7c2.9,0,4.5-1.9,4.5-1.9l-0.1,0.9c-0.1,0.4,0.2,0.7,0.6,0.7h3.2c0.5,0,0.9-0.4,1-0.9 l1.9-11.9C58.9,13.8,58.7,13.5,58.3,13.5z M53,20.2c-0.3,2-2,3.3-4,3.3c-1,0-1.9-0.3-2.4-0.9c-0.5-0.6-0.7-1.5-0.6-2.4 c0.3-1.9,2-3.3,3.9-3.3c1,0,1.8,0.3,2.3,0.9C52.9,18.3,53.1,19.2,53,20.2z"/>
                <path d="M76.1,13.5h-3.5c-0.3,0-0.6,0.1-0.8,0.4l-4.5,6.6l-1.9-6.3c-0.1-0.4-0.5-0.7-0.9-0.7h-3.4c-0.4,0-0.7,0.4-0.6,0.8l3.6,10.5 l-3.3,4.7c-0.3,0.4,0,0.9,0.4,0.9h3.5c0.3,0,0.6-0.1,0.8-0.4l10.7-15.4C76.7,14,76.5,13.5,76.1,13.5z"/>
                <path d="M85.4,7.1h-7c-0.5,0-0.9,0.4-1,0.9l-2.8,18c-0.1,0.4,0.2,0.7,0.6,0.7h3.6c0.4,0,0.7-0.3,0.8-0.7l0.8-5 c0.1-0.5,0.5-0.9,1-0.9h2.2c4.8,0,7.5-2.3,8.2-6.8c0.3-2-0.1-3.5-1-4.6C89.9,7.7,88,7.1,85.4,7.1z M86.1,13.6 c-0.4,2.6-2.4,2.6-4.3,2.6h-1.1l0.8-4.8c0-0.3,0.3-0.5,0.6-0.5h0.5c1.3,0,2.5,0,3.2,0.7C86.1,12,86.3,12.7,86.1,13.6z"/>
                <path d="M107.2,13.5h-3.5c-0.3,0-0.6,0.2-0.6,0.5l-0.2,1l-0.2-0.4c-0.8-1.1-2.4-1.5-4.1-1.5c-3.8,0-7.1,2.9-7.7,7 c-0.3,2,0.1,4,1.2,5.3c1,1.2,2.4,1.7,4.1,1.7c2.9,0,4.5-1.9,4.5-1.9l-0.1,0.9c-0.1,0.4,0.2,0.7,0.6,0.7h3.2c0.5,0,0.9-0.4,1-0.9 l1.9-11.9C107.8,13.8,107.6,13.5,107.2,13.5z M101.9,20.2c-0.3,2-2,3.3-4,3.3c-1,0-1.9-0.3-2.4-0.9c-0.5-0.6-0.7-1.5-0.6-2.4 c0.3-1.9,2-3.3,3.9-3.3c1,0,1.8,0.3,2.3,0.9C101.8,18.3,102,19.2,101.9,20.2z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="security-note">
        <div className="security-icon">🔒</div>
        <p>
          Your payment information is securely encrypted and processed. We don't store your full card details.
          Your subscription will be processed immediately and can be canceled anytime.
        </p>
      </div>

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
          style={{ backgroundColor: tierInfo.color }}
          onClick={handleNext}
        >
          {paymentMethod === 'paypal' ? 'Continue to PayPal' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;