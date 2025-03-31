import React, { useState, useEffect } from 'react';
import { HuggingFaceService } from '../../services/huggingFaceService';

interface TokenInputProps {
  onTokenValidated: (token: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenValidated }) => {
  const [token, setToken] = useState<string>('');
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    username?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    // Check for existing token
    const checkSavedToken = async () => {
      const existingToken = await HuggingFaceService.getToken();
      if (existingToken) {
        setSavedToken(existingToken);
        // Validate the existing token
        validateToken(existingToken);
      }
    };
    
    checkSavedToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    // Reset validation state when token changes
    setValidationResult(null);
  };

  const validateToken = async (tokenToValidate: string) => {
    setIsValidating(true);
    
    try {
      const result = await HuggingFaceService.validateToken(tokenToValidate);
      setValidationResult(result);
      
      if (result.isValid) {
        await HuggingFaceService.storeToken(tokenToValidate);
        setSavedToken(tokenToValidate);
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

  const handleValidate = () => {
    if (token) {
      validateToken(token);
    }
  };

  const handleRemoveToken = async () => {
    await HuggingFaceService.removeToken();
    setSavedToken(null);
    setToken('');
    setValidationResult(null);
  };

  return (
    <div className="token-input">
      <h3>Hugging Face API Token</h3>
      
      {savedToken && validationResult?.isValid ? (
        <div className="token-status valid">
          <div className="status-header">
            <span className="status-icon">✓</span>
            <span className="status-text">Valid token configured</span>
          </div>
          
          {validationResult.username && (
            <div className="username">
              Username: {validationResult.username}
            </div>
          )}
          
          <button 
            className="remove-token-button"
            onClick={handleRemoveToken}
          >
            Remove Token
          </button>
        </div>
      ) : (
        <>
          <div className="token-field">
            <input
              type="password"
              value={token}
              onChange={handleTokenChange}
              placeholder="Enter your Hugging Face API token"
              className={
                validationResult 
                  ? validationResult.isValid 
                    ? 'valid' 
                    : 'invalid' 
                  : ''
              }
            />
            <button 
              onClick={handleValidate}
              disabled={!token || isValidating}
              className="validate-button"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </button>
          </div>
          
          {validationResult && (
            <div className={`validation-result ${validationResult.isValid ? 'valid' : 'invalid'}`}>
              {validationResult.isValid ? (
                <span>Token valid! Username: {validationResult.username}</span>
              ) : (
                <span>Invalid token: {validationResult.error}</span>
              )}
            </div>
          )}
          
          <div className="token-instructions">
            <h4>How to get a Hugging Face API token:</h4>
            <ol>
              <li>Go to <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">Hugging Face Token Settings</a></li>
              <li>Sign in to your Hugging Face account (or create one)</li>
              <li>Click on "New token"</li>
              <li>Enter a name for your token (e.g., "Claude Integration")</li>
              <li>Set the role to "Read"</li>
              <li>Click "Generate a token"</li>
              <li>Copy the token and paste it here</li>
            </ol>
          </div>
          
          <div className="security-note">
            <h4>Security Note</h4>
            <p>Your token will be stored securely in your system's credential manager. It is never transmitted to our servers.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TokenInput;
