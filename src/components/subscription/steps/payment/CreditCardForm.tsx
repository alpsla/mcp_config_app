import React from 'react';

interface CreditCardFormProps {
  paymentData: {
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
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  countries: Array<{ code: string; name: string }>;
}

/**
 * Credit card form component
 */
const CreditCardForm: React.FC<CreditCardFormProps> = ({
  paymentData,
  errors,
  handleInputChange,
  countries
}) => {
  return (
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
  );
};

export default CreditCardForm;