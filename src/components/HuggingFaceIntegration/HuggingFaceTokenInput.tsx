import React, { useState, useEffect } from 'react';
import { HuggingFaceService } from '../../services/huggingFaceService';
import './HuggingFaceTokenInput.css';

interface HuggingFaceTokenInputProps {
  onTokenValidated: (token: string) => void;
}

const HuggingFaceTokenInput: React.FC<HuggingFaceTokenInputProps> = ({ onTokenValidated }) => {
  const [token, setToken] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    username?: string;
    error?: string;
  } | null>(null);

  const validateToken = async (tokenToValidate: string) => {
    if (!tokenToValidate) return;
    
    setIsValidating(true);
    try {
      const result = await HuggingFaceService.validateToken(tokenToValidate);
      setValidationResult(result);
      
      if (result.isValid) {
        await HuggingFaceService.storeToken(tokenToValidate);
        onTokenValidated(tokenToValidate);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: 'An error occurred during validation'
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    // Check for existing token
    const checkSavedToken = async () => {
      try {
        const existingToken = await HuggingFaceService.getToken();
        if (existingToken) {
          setToken(existingToken);
          validateToken(existingToken);
        }
      } catch (error) {
        console.error('Failed to retrieve saved token:', error);
      }
    };
    
    checkSavedToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    setValidationResult(null);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  
  const openTokenPage = () => {
    window.open('https://huggingface.co/settings/tokens/new?tokenType=fineGrained', '_blank');
  };

  return (
    <div className="huggingface-token-container">
      <h3 className="token-header">Hugging Face API Token</h3>
      
      <p className="token-description">
        To access premium models, you'll need a Hugging Face API token. Click the "Need Help?" button for a step-by-step guide, or use the direct link to get your token.
      </p>
      
      <div className="token-input-row">
        <input
          type="password"
          value={token}
          onChange={handleTokenChange}
          placeholder="Enter your Hugging Face API token"
          className="token-input"
        />
        
        <div className="token-action-buttons">
          <button 
            type="button"
            className="help-button"
            onClick={toggleInstructions}
          >
            Need Help?
          </button>
          
          <button 
            type="button"
            className="get-token-button"
            onClick={openTokenPage}
          >
            Get Token Now
          </button>
        </div>
      </div>
      
      <div className="security-note">
        <span className="lock-icon">🔒</span>
        <span className="security-text">Your token is stored securely and never leaves your device.</span>
      </div>
      
      {validationResult && (
        <div className={`validation-result ${validationResult.isValid ? 'valid' : 'invalid'}`}>
          {validationResult.isValid 
            ? `Token valid! Username: ${validationResult.username}` 
            : `Invalid token: ${validationResult.error}`
          }
        </div>
      )}
      
      {showInstructions && (
        <div className="instructions-panel">
          <div className="instructions-header">
            <h4>How to Get a Hugging Face Token</h4>
            <button 
              type="button"
              className="close-button"
              onClick={toggleInstructions}
            >
              ×
            </button>
          </div>
          
          <div className="instruction-steps">
            <ol>
              <li>Go to <a href="https://huggingface.co/settings/tokens/new?tokenType=fineGrained" target="_blank" rel="noopener noreferrer">Hugging Face Token Creation</a></li>
              <li>Sign in to your account (or create one)</li>
              <li>Enter a token name (e.g., "MCP Integration")</li>
              <li>Select "Read" role</li>
              <li>Click "Generate a token"</li>
              <li>Copy and paste the token into the input field above</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default HuggingFaceTokenInput;
