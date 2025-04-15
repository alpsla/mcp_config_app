import React, { useState, useEffect } from 'react';
import secureTokenStorage from '../../../../utils/secureTokenStorage';
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

/**
 * Enhanced HuggingFaceTokenSection with secure token storage and validation
 * Designed for use with Claude Desktop MCP integration
 */
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
  
  // New states for token saving and validation
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'none' | 'success' | 'error'>('none');
  
  // Check if running in desktop environment
  const isDesktop = secureTokenStorage.isElectronEnvironment();
  
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
  
  const validateTokenFormat = (token: string): boolean => {
    // Basic validation - HF tokens typically start with "hf_" and are longer than 8 chars
    if (token && !token.startsWith('hf_')) {
      setLocalError('Invalid token format. Hugging Face tokens typically start with "hf_".');
      return false;
    }
    
    if (token && token.length < 8) {
      setLocalError('Token seems too short. Please check your token.');
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
    
    // Reset success state when token changes
    if (saveSuccess) {
      setSaveSuccess(false);
      setValidationStatus('none');
      setValidationMessage(null);
    }
    
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
  
  // Save token securely and validate with API
  const handleSaveToken = async () => {
    // Validate token format first
    if (!validateTokenFormat(localToken)) {
      return;
    }
    
    // If token is empty, show error
    if (!localToken) {
      setLocalError('Please enter a token before saving.');
      return;
    }
    
    // Start saving process
    setIsSaving(true);
    setSaveSuccess(false);
    setValidationMessage(null);
    setValidationStatus('none');
    
    try {
      if (!isDesktop) {
        setValidationStatus('error');
        setValidationMessage('Token storage is only available in the desktop application.');
        setIsSaving(false);
        return;
      }
      
      // Validate token with HF API
      const validationResult = await secureTokenStorage.validateToken(localToken);
      
      if (validationResult.isValid) {
        // Token is valid, now save it securely
        const saved = await secureTokenStorage.storeToken(localToken);
        
        if (saved) {
          setSaveSuccess(true);
          setValidationStatus('success');
          setValidationMessage(`Token saved securely and validated with Hugging Face API. ${validationResult.username ? `Authenticated as ${validationResult.username}.` : ''}`);
          setLocalError(null);
        } else {
          setValidationStatus('error');
          setValidationMessage('Failed to save token securely. Please try again or contact support.');
        }
      } else {
        // Token validation failed
        setValidationStatus('error');
        setValidationMessage(validationResult.message || 'Token validation failed. Please check your token and try again.');
      }
    } catch (err) {
      console.error('Error saving/validating token:', err);
      setValidationStatus('error');
      setValidationMessage('An error occurred while processing your token. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Automatically expand the section if there's an error
  useEffect(() => {
    if ((localError || validationStatus === 'error') && !isExpanded) {
      setIsExpanded(true);
    }
  }, [localError, validationStatus, isExpanded]);

  // Display desktop-only message if not in desktop environment
  if (!isDesktop) {
    return (
      <div className="hf-token-section">
        <div className="token-header">
          <h3 className="token-title">
            <span className="token-icon">🔑</span>
            Hugging Face API Token
          </h3>
        </div>
        <div className="token-content">
          <div className="desktop-only-message">
            <p>
              Hugging Face API token integration with Claude is only available in the 
              <a href="https://www.anthropic.com/claude-desktop" target="_blank" rel="noopener noreferrer">
                Claude Desktop application
              </a>. 
              Please install Claude Desktop to use this feature.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`hf-token-section ${disabled ? 'disabled' : ''} hf-visible`}>
      <div className="token-header" onClick={toggleExpand}>
        <h3 className="token-title">
          <span className="token-icon">🔑</span>
          Hugging Face API Token
          {localError && <span className="token-error-indicator">⚠️</span>}
          {validationStatus === 'success' && <span className="token-success-indicator">✓</span>}
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
            Enter your Hugging Face API token to use with Claude Desktop via MCP integration.
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
                disabled={disabled || isSaving}
                title={localToken} // Show full token on hover
              />
              
              <button
                type="button"
                className="toggle-visibility-button"
                onClick={toggleShowToken}
                aria-label={showToken ? "Hide token" : "Show token"}
                disabled={disabled || isSaving}
              >
                <span className="eye-icon">👁️</span>
              </button>
              
              <button
                type="button"
                className="save-token-button"
                onClick={handleSaveToken}
                disabled={disabled || isSaving || !localToken}
                aria-label="Save token securely"
              >
                {isSaving ? 'Saving...' : 'Save Token Securely'}
              </button>
              
              {localError && (
                <div className="token-error-message" role="alert">
                  {localError}
                </div>
              )}
            </div>
          </div>
          
          {/* Validation result display */}
          {validationStatus !== 'none' && (
            <div className={`validation-result ${validationStatus}`}>
              <div className="validation-icon">
                {validationStatus === 'success' ? '✅' : '❌'}
              </div>
              <div className="validation-message">
                {validationMessage}
              </div>
            </div>
          )}
          
          {/* Token saved success details */}
          {saveSuccess && (
            <div className="token-saved-details">
              <h4>Token Saved Successfully</h4>
              <ul className="saved-summary">
                <li>✓ Validated with Hugging Face API</li>
                <li>✓ Stored securely in your system</li>
                <li>✓ Claude Desktop config updated</li>
                <li>✓ Ready for use with Claude Desktop MCP</li>
              </ul>
            </div>
          )}
          
          <div className="token-note">
            <strong>Note:</strong> This token will be securely stored in your system's credential store
            (Keychain on macOS or Credential Manager on Windows) and will be used by Claude Desktop
            for MCP integration with Hugging Face services.
          </div>
          
          {/* Claude Desktop integration note */}
          <div className="claude-integration-note">
            <p>
              After saving your token, restart Claude Desktop to use it with MCP integration.
              Your token will be automatically retrieved from secure storage when needed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HuggingFaceTokenSection;