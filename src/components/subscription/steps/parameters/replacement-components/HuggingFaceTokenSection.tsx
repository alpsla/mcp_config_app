import React, { useState } from 'react';
import './HuggingFaceTokenSection.css';

interface HuggingFaceTokenSectionProps {
  initialToken: string;
  onChange: (token: string) => void;
}

/**
 * HuggingFaceTokenSection component for entering Hugging Face API token
 * 
 * This version fixes styling issues with the header and improves accessibility.
 */
const HuggingFaceTokenSection: React.FC<HuggingFaceTokenSectionProps> = ({
  initialToken,
  onChange
}) => {
  const [token, setToken] = useState(initialToken);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    onChange(newToken);
  };
  
  const tokenInputId = "hf-token-input";
  
  return (
    <div className="hf-token-section">
      {/* Fixed header styling */}
      <h3 className="hf-token-heading">Hugging Face API Token</h3>
      
      <div className="hf-token-content">
        <p>
          Connect your Hugging Face account to access additional models and features.
          <button 
            className="toggle-instructions-btn"
            onClick={() => setShowInstructions(!showInstructions)}
            type="button"
          >
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </button>
        </p>
        
        {showInstructions && (
          <div className="token-instructions">
            <p>Follow these steps to get your Hugging Face API token:</p>
            <ol>
              <li>Go to <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">Hugging Face Token Settings</a></li>
              <li>Login to your account or create a new one</li>
              <li>Click on "New token"</li>
              <li>Enter a name for your token (e.g., "Config App")</li>
              <li>Select "Read" role</li>
              <li>Click "Generate a token"</li>
              <li>Copy the token and paste it below</li>
            </ol>
          </div>
        )}
        
        <div className="token-input-container">
          <label htmlFor={tokenInputId} className="visually-hidden">Hugging Face API Token</label>
          <input
            id={tokenInputId}
            type="text"
            className="token-input"
            placeholder="Enter your Hugging Face API token"
            value={token}
            onChange={handleChange}
            aria-describedby="token-security-note"
          />
        </div>
        
        <div className="token-security-note" id="token-security-note">
          <span className="security-icon" aria-hidden="true">🔒</span>
          <span className="security-text">
            Your token is stored securely and used only for authorized API requests.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HuggingFaceTokenSection;