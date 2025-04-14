import React, { useState, useEffect } from 'react';
import './HuggingFaceTokenSection.css';

interface HuggingFaceTokenSectionProps {
  token?: string;
  initialToken?: string;
  onTokenChange?: (token: string) => void;
  onChange?: (token: string) => void;
  disabled?: boolean;
  error?: string | null;
  initialExpanded?: boolean;
}

const HuggingFaceTokenSection: React.FC<HuggingFaceTokenSectionProps> = ({
  token,
  initialToken,
  onTokenChange,
  onChange,
  disabled = false,
  error = null,
  initialExpanded = false
}) => {
  // Support both naming conventions for token
  const tokenValue = token || initialToken || '';
  const handleChange = onTokenChange || onChange || (() => {});
  
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showToken, setShowToken] = useState(false);
  const [localToken, setLocalToken] = useState(tokenValue);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalToken(tokenValue);
  }, [tokenValue]);
  
  // Update local error from props
  useEffect(() => {
    setLocalError(error);
  }, [error]);
  
  // Update expanded state if prop changes after initial render
  useEffect(() => {
    if (initialExpanded !== undefined) {
      setIsExpanded(initialExpanded);
    }
  }, [initialExpanded]);
  
  const toggleExpand = () => {
    if (disabled) return; // Don't toggle if disabled
    setIsExpanded(!isExpanded);
  };
  
  const toggleShowToken = (e: React.MouseEvent) => {
    if (disabled) return; // Don't toggle if disabled
    e.stopPropagation(); // Prevent event propagation to parent elements
    setShowToken(!showToken);
  };
  
  const validateToken = (token: string): boolean => {
    // Basic validation - HF tokens typically start with "hf_" and are longer than 8 chars
    if (token && !token.startsWith('hf_') && token.length > 0) {
      setLocalError('Hugging Face token is required. Please enter a valid token.');
      return false;
    }
    
    // Clear error if valid or empty
    setLocalError(null);
    return true;
  };
  
  // Handle token change with real-time validation
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Don't update if disabled
    const newValue = e.target.value;
    setLocalToken(newValue);
    
    // Different validation messages for different cases
    if (newValue.length > 0 && !newValue.startsWith('hf_')) {
      // Only validate format if there's actual input
      setLocalError('Tokens typically start with "hf_"');
    } else {
      // Clear error if valid or empty
      setLocalError(null); 
    }
    
    handleChange(newValue);
  };
  
  // Automatically expand the section if there's an error
  useEffect(() => {
    if (localError && !isExpanded) {
      setIsExpanded(true);
    }
  }, [localError, isExpanded]);
  
  return (
    <div className={`hf-token-section ${disabled ? 'disabled' : ''} hf-visible`}>
      <div className="token-header" onClick={toggleExpand}>
        <h3 className="token-title">
          <span className="token-icon">🔑</span>
          Hugging Face API Token
          {localError && <span className="token-error-indicator">⚠️</span>}
        </h3>
        <button 
          type="button" 
          className="expand-button"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse token section" : "Expand token section"}
          disabled={disabled}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="token-content">
          <p className="token-description">
            Enter your Hugging Face API token to use with your subscription.
            You can find or create your token in your{' '}
            <a 
              href="https://huggingface.co/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hf-link"
              tabIndex={disabled ? -1 : 0} // Disable tabbing when disabled
            >
              Hugging Face account settings
            </a>.
          </p>
          
          <div className="token-input-container">
            <div className="input-wrapper">
              <input
                type={showToken ? "text" : "password"}
                id="hf-token-input"
                className={`token-input ${localError ? 'error' : ''}`}
                value={localToken}
                onChange={handleTokenChange}
                placeholder="Enter your Hugging Face API token"
                aria-label="Hugging Face API token"
                disabled={disabled}
                title={localToken} // Show full token on hover
              />
              
              <button
                type="button"
                className="toggle-visibility-button"
                onClick={toggleShowToken}
                aria-label={showToken ? "Hide token" : "Show token"}
                disabled={disabled}
              >
                <span className="eye-icon">👁️</span>
              </button>
              
              {localError && (
                <div className="token-error-message" role="alert">
                  {localError}
                </div>
              )}
            </div>
          </div>
          
          <div className="token-note">
            Your token will be securely stored on your device and <strong>never</strong> transmitted or stored on our servers as plain text. It will only be used for API requests when needed.
          </div>
        </div>
      )}
    </div>
  );
};

export default HuggingFaceTokenSection;