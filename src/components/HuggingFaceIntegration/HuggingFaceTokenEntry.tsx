import React, { useState } from 'react';
import './HuggingFaceTokenEntry.css';

interface HuggingFaceTokenEntryProps {
  onTokenValidated: (token: string) => void;
  onTokenChanged: (token: string) => void;
  token: string;
}

/**
 * A simplified token input component that matches the UI in the screenshot
 * but removes the duplicated security message
 */
const HuggingFaceTokenEntry: React.FC<HuggingFaceTokenEntryProps> = ({
  onTokenValidated,
  onTokenChanged,
  token
}) => {
  const [showToken, setShowToken] = useState(false);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTokenChanged(e.target.value);
  };

  const toggleShowToken = () => {
    setShowToken(!showToken);
  };

  const handleGetTokenHelp = () => {
    window.open('https://huggingface.co/settings/tokens', '_blank');
  };

  return (
    <div className="huggingface-token-entry">
      <h3>Hugging Face API Token</h3>
      
      {/* Intro text - removed duplicate message about token storage security */}
      <p className="intro-text">
        To access premium models, you'll need a Hugging Face API token.
      </p>
      
      {/* Token input field */}
      <div className="token-input-row">
        <input
          type={showToken ? 'text' : 'password'}
          value={token}
          onChange={handleTokenChange}
          placeholder="Enter your Hugging Face API token"
          className="token-input"
        />
        <button 
          onClick={toggleShowToken}
          className="visibility-toggle"
        >
          {showToken ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {/* Help link */}
      <div className="help-link">
        <button 
          onClick={handleGetTokenHelp}
          className="token-help-button"
        >
          How to Get Token?
        </button>
      </div>
      
      {/* Security note - this remains as it has detailed information */}
      <div className="security-note">
        <span className="lock-icon">🔒</span>
        <p>
          Your token will be stored securely as an environment variable on your local device only.
        </p>
      </div>
    </div>
  );
};

export default HuggingFaceTokenEntry;
