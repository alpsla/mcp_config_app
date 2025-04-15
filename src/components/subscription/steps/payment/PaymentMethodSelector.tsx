import React from 'react';
import './PaymentMethodSelector.css'; // We'll create this file next

export type PaymentMethodType = 'credit-card' | 'paypal';

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
}

/**
 * Enhanced component for selecting payment method (credit card or PayPal)
 * Provides a balanced, horizontal layout for payment options
 */
const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethod, 
  onMethodChange 
}) => {
  return (
    <div className="payment-method-selector">
      <h3>Payment Method</h3>
      <div className="payment-methods">
        <div 
          className={`payment-method-option ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
          onClick={() => onMethodChange('credit-card')}
        >
          <input
            type="radio"
            id="method-card"
            name="paymentMethod"
            checked={paymentMethod === 'credit-card'}
            onChange={() => onMethodChange('credit-card')}
          />
          <label htmlFor="method-card">
            <div className="method-icon card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <div className="method-name">Credit Card</div>
          </label>
        </div>
        
        <div 
          className={`payment-method-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
          onClick={() => onMethodChange('paypal')}
        >
          <input
            type="radio"
            id="method-paypal"
            name="paymentMethod"
            checked={paymentMethod === 'paypal'}
            onChange={() => onMethodChange('paypal')}
          />
          <label htmlFor="method-paypal">
            <div className="method-icon paypal-icon">
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
  );
};

export default PaymentMethodSelector;