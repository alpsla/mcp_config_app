import React from 'react';

/**
 * Security info component
 */
const SecurityNote: React.FC = () => {
  return (
    <div className="security-note">
      <div className="security-icon">🔒</div>
      <p>
        Your payment information is securely encrypted and processed. We don't store your full card details.
        Your subscription will be processed immediately and can be canceled anytime.
      </p>
    </div>
  );
};

export default SecurityNote;