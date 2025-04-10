import React, { useState } from 'react';
import ParameterInputField from './ParameterInputField';

interface HuggingFaceTokenSectionProps {
  initialToken?: string;
  onChange: (token: string) => void;
  disabled?: boolean;
}

const HuggingFaceTokenSection: React.FC<HuggingFaceTokenSectionProps> = ({
  initialToken = '',
  onChange,
  disabled = false
}) => {
  const [token, setToken] = useState(initialToken);
  
  // Handle token change
  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    onChange(newToken);
  };
  
  return (
    <div className="huggingface-token-section" style={{ 
      marginTop: '30px', 
      marginBottom: '20px', 
      backgroundColor: '#F0F7FF', 
      padding: '20px', 
      borderRadius: '10px', 
      border: '1px solid #BBDEFB',
      opacity: disabled ? 0.7 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      <h3 style={{ marginTop: 0, color: '#1565C0' }}>
        Hugging Face API Token
      </h3>
      
      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
        To access premium models, you'll need a Hugging Face API token.
      </p>
      
      <div className="token-input-container">
        <ParameterInputField
          value={token}
          onChange={handleTokenChange}
          placeholder="Enter your Hugging Face API token"
          isPassword={true}
          testId="hf-token-input"
          disabled={disabled}
        />
      </div>
      
      <div style={{
        backgroundColor: '#E8F5E9',
        padding: '10px 15px',
        borderRadius: '4px',
        marginTop: '10px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ color: '#2E7D32', marginRight: '10px', fontSize: '18px' }}>🔒</span>
        <span style={{ fontSize: '14px' }}>Your token is stored securely on your local device and never transmitted to our servers.</span>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>
          To get a token:
        </h4>
        <ol style={{ marginLeft: '20px', paddingLeft: 0 }}>
          <li style={{ marginBottom: '8px' }}>Visit the Hugging Face Token page: <br/>
            <a 
              href="https://huggingface.co/settings/tokens/new?tokenType=fineGrained" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1976D2', textDecoration: 'none' }}
            >
              https://huggingface.co/settings/tokens/new
            </a>
          </li>
          <li style={{ marginBottom: '8px' }}>Sign in (or create a free account)</li>
          <li style={{ marginBottom: '8px' }}>Enter "MCP Configuration" as the token name</li>
          <li style={{ marginBottom: '8px' }}>Set the role to "Read"</li>
          <li>Copy and paste the token in the field above</li>
        </ol>
      </div>
    </div>
  );
};

export default HuggingFaceTokenSection;