import React, { useState, useEffect } from 'react';
import { HuggingFaceService } from '../../services/huggingFaceService';
import './TokenInput.css';

interface TokenInputProps {
  onTokenValidated: (token: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenValidated }) => {
  const [token, setToken] = useState<string>('');
  const [savedToken, setSavedToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [showTokenHelp, setShowTokenHelp] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    username?: string;
    error?: string;
  } | null>(null);

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

  const handleNeedHelp = () => {
    setShowTokenHelp(true);
  };

  const getTokenNow = () => {
    window.open('https://huggingface.co/settings/tokens/new?tokenType=fineGrained', '_blank');
  };

  const toggleTokenHelp = () => {
    setShowTokenHelp(!showTokenHelp);
  };

  const handleRemoveToken = async () => {
    await HuggingFaceService.removeToken();
    setSavedToken(null);
    setToken('');
    setValidationResult(null);
  };

  return (
    <div className="token-container">
      <h3 className="token-header">Hugging Face API Token</h3>
      
      {!savedToken && (
        <p className="token-description">
          To access premium models, you'll need a Hugging Face API token.
        </p>
      )}
      
      {savedToken && validationResult?.isValid ? (
        // Already configured token view
        <div className="token-status-success">
          <div className="status-header">
            <span className="status-icon">✓</span>
            <span className="status-text">Valid token configured</span>
          </div>
          
          {validationResult.username && (
            <div className="username-display">
              Username: {validationResult.username}
            </div>
          )}
          
          <div className="token-usage-info">
            <h4>Token Usage Information</h4>
            <p>Your Hugging Face API token has been securely stored and is ready to use.</p>
            
            <div>
              <h5>Using your token with MCP tools:</h5>
              <ul className="usage-list">
                <li>
                  <strong>Environment Variable:</strong> Your token is available as the environment variable <code>HUGGINGFACETOKEN</code>
                </li>
                <li>
                  <strong>Configuration Directory:</strong> Environment variable scripts have been created in your MCP configuration directory
                </li>
                <li>
                  <strong>Automatic Integration:</strong> The MCP command-line tools will automatically use your token
                </li>
              </ul>
              
              <p className="example-usage">
                <strong>Example usage in command line:</strong><br/>
                <code>npx @llmindset/mcp-huggingface --model="facebook/bart-large-cnn" --task="summarization"</code>
              </p>
            </div>
          </div>
          
          <button 
            className="remove-token-button"
            onClick={handleRemoveToken}
          >
            Remove Token
          </button>
        </div>
      ) : (
        // Token input view
        <>
          <div className="token-input-row">
            <input
              type="password"
              value={token}
              onChange={handleTokenChange}
              placeholder="Enter your Hugging Face API token"
              className="token-input"
            />
            <div className="token-actions">
              <button 
                className="need-help-button"
                onClick={handleNeedHelp}
                style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  fontWeight: 'bold'
                }}
              >
                Need Help?
              </button>
            </div>
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
          
          {/* Security notice - simplified */}
          <div className="security-notice">
            <span className="lock-icon">🔒</span>
            <span>Your token is stored securely and never leaves your device.</span>
          </div>
          
          {/* Instructions panel - displays when showTokenHelp is true */}
          {showTokenHelp && (
            <div className="instructions-panel">
              <div className="instructions-header">
                <h4>How to Get a Hugging Face API Token</h4>
                <button
                  onClick={toggleTokenHelp}
                  className="close-button"
                >
                  ×
                </button>
              </div>
              
              <div className="quick-guide">
                <div className="guide-heading">Quick Guide:</div>
                <ol>
                  <li>Create your token: <a 
                    href="https://huggingface.co/settings/tokens/new?tokenType=fineGrained" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="prominent-link"
                  >Get Token Now</a></li>
                  <li>Sign in to your account (or create one if needed)</li>
                  <li>Enter a token name like <code>MCP Integration</code></li>
                  <li>Select <strong>Read</strong> role</li>
                  <li>Click <span className="button-reference">Generate a token</span></li>
                  <li>Copy and paste the token into the input field above</li>
                </ol>
              </div>
              
              <div className="info-boxes">
                <div className="info-box what-is">
                  <h5>What is a Hugging Face token?</h5>
                  <p>
                    A Hugging Face API token allows you to access models and datasets from the Hugging Face Hub. It's like a secure key that identifies you when making API requests.
                  </p>
                </div>
                
                <div className="info-box important-note">
                  <h5>Important</h5>
                  <p>
                    Make sure to copy the entire token. Tokens typically look like <code>hf_abcdef123456...</code>
                  </p>
                </div>
              </div>
              
              {/* Remove duplicate button */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TokenInput;