import React, { useState } from 'react';
import './HuggingFaceAPITokenSection.css';

interface HuggingFaceAPITokenSectionProps {
  onTokenChange: (token: string) => void;
  token: string;
  onGetToken?: () => void;
}

/**
 * Updated component for the Hugging Face API token section
 * with the duplicated security message removed
 */
const HuggingFaceAPITokenSection: React.FC<HuggingFaceAPITokenSectionProps> = ({
  onTokenChange,
  token,
  onGetToken
}) => {
  const [showToken, setShowToken] = useState(false);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTokenChange(e.target.value);
  };

  const handleToggleVisibility = () => {
    setShowToken(!showToken);
  };

  const handleGetTokenClick = () => {
    if (onGetToken) {
      onGetToken();
    } else {
      window.open('https://huggingface.co/settings/tokens', '_blank');
    }
  };

  return (
    <div className="api-token-section">
      <h3>Hugging Face API Token</h3>
      
      {/* Intro text - only describe what the token is for, not how it's stored */}
      <p className="token-description">
        To access premium models, you'll need a Hugging Face API token.
      </p>
      
      <div className="token-input-container">
        <input
          type={showToken ? 'text' : 'password'}
          value={token}
          onChange={handleTokenChange}
          placeholder="Enter your Hugging Face API token"
          className="token-input"
        />
        <button 
          onClick={handleToggleVisibility}
          className="token-visibility-toggle"
        >
          {showToken ? 'Hide' : 'Show'}
        </button>
      </div>
      
      <div className="token-actions">
        <button 
          onClick={handleGetTokenClick}
          className="get-token-link"
        >
          How to Get Token?
        </button>
      </div>
      
      {/* Security note is included only once, not duplicated */}
      <div className="security-note">
        <span className="lock-icon">🔒</span>
        <p>
          Your token will be stored securely as an environment variable on your local device only.
        </p>
      </div>
    </div>
  );
};

export default HuggingFaceAPITokenSection;
