import React, { useState } from 'react';
import './SubscriptionModal.css';

interface SubscriptionModalProps {
  currentTier: 'none' | 'basic' | 'complete';
  onSubscribe: (tier: 'basic' | 'complete') => void;
  onCancel: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  currentTier,
  onSubscribe,
  onCancel
}) => {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'complete'>(
    currentTier === 'none' ? 'basic' : 'complete'
  );
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle subscription submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.nameOnCard) {
      setError('Please fill in all payment details');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // In a real implementation, this would call a payment API
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the onSubscribe callback with the selected tier
      onSubscribe(selectedTier);
    } catch (error) {
      setError('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="subscription-modal-overlay">
      <div className="subscription-modal">
        <div className="modal-header">
          <h2>Subscribe to Hugging Face Integration</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="tier-selector">
            <div 
              className={`tier-option ${selectedTier === 'basic' ? 'selected' : ''}`}
              onClick={() => setSelectedTier('basic')}
            >
              <div className="tier-header">
                <h3>Basic Tier</h3>
                <span className="tier-price">$2/month</span>
              </div>
              <ul className="tier-features">
                <li>Access to all 10 Hugging Face models</li>
                <li>Select up to 3 models</li>
                <li>Regular updates</li>
              </ul>
              <div className="tier-select">
                <input 
                  type="radio" 
                  id="basic-tier" 
                  name="tier" 
                  checked={selectedTier === 'basic'} 
                  onChange={() => setSelectedTier('basic')} 
                />
                <label htmlFor="basic-tier">Select Basic Tier</label>
              </div>
            </div>
            
            <div 
              className={`tier-option ${selectedTier === 'complete' ? 'selected' : ''}`}
              onClick={() => setSelectedTier('complete')}
            >
              <div className="tier-badge">Most Popular</div>
              <div className="tier-header">
                <h3>Complete Tier</h3>
                <span className="tier-price">$5/month</span>
              </div>
              <ul className="tier-features">
                <li>Access to all 10 Hugging Face models</li>
                <li>Select up to 10 models</li>
                <li>Priority updates for new models</li>
                <li>Early access to beta features</li>
              </ul>
              <div className="tier-select">
                <input 
                  type="radio" 
                  id="complete-tier" 
                  name="tier" 
                  checked={selectedTier === 'complete'} 
                  onChange={() => setSelectedTier('complete')} 
                />
                <label htmlFor="complete-tier">Select Complete Tier</label>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="payment-form">
            <h3>Payment Information</h3>
            
            <div className="payment-methods">
              <div 
                className={`payment-method ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('credit-card')}
              >
                <input 
                  type="radio" 
                  id="credit-card" 
                  name="payment-method" 
                  checked={paymentMethod === 'credit-card'} 
                  onChange={() => setPaymentMethod('credit-card')} 
                />
                <label htmlFor="credit-card">Credit Card</label>
              </div>
              
              <div 
                className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <input 
                  type="radio" 
                  id="paypal" 
                  name="payment-method" 
                  checked={paymentMethod === 'paypal'} 
                  onChange={() => setPaymentMethod('paypal')} 
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
            </div>
            
            {paymentMethod === 'credit-card' && (
              <div className="card-details">
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input 
                    type="text" 
                    id="card-number" 
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input 
                      type="text" 
                      id="expiry" 
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input 
                      type="text" 
                      id="cvv" 
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="name-on-card">Name on Card</label>
                  <input 
                    type="text" 
                    id="name-on-card" 
                    placeholder="John Doe"
                    value={paymentDetails.nameOnCard}
                    onChange={(e) => setPaymentDetails({...paymentDetails, nameOnCard: e.target.value})}
                  />
                </div>
              </div>
            )}
            
            {paymentMethod === 'paypal' && (
              <div className="paypal-info">
                <p>You will be redirected to PayPal to complete your payment after clicking "Subscribe".</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="subscribe-button"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Subscribe to ${selectedTier === 'basic' ? 'Basic' : 'Complete'} Tier`}
              </button>
            </div>
          </form>
          
          <div className="subscription-details">
            <h4>Subscription Details</h4>
            <p>
              Your subscription will start immediately and will be billed monthly.
              You can cancel or change your subscription at any time from your account settings.
            </p>
            <p className="subscription-security">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Your payment information is securely encrypted and never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
