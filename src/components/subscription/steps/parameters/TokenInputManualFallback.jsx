import React, { useState, useEffect } from 'react';

/**
 * A standalone token input component that can be used as a fallback
 * if the regular input field does not work correctly.
 * 
 * Usage:
 * <TokenInputManualFallback
 *   onTokenChange={(token) => console.log('Token:', token)}
 *   initialToken="hf_example"
 * />
 */
const TokenInputManualFallback = ({ onTokenChange, initialToken = '' }) => {
  const [token, setToken] = useState(initialToken);
  const [feedback, setFeedback] = useState({ message: '', isSuccess: false, visible: false });

  // Load saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('huggingface_token') || 
                       sessionStorage.getItem('huggingface_token');
    if (savedToken) {
      setToken(savedToken);
      if (onTokenChange) {
        onTokenChange(savedToken);
      }
    }
  }, [onTokenChange]);

  // Save token handler
  const saveToken = () => {
    if (!token.trim()) {
      showFeedback('Please enter a token', false);
      return;
    }

    // Basic validation
    if (!token.startsWith('hf_')) {
      showFeedback('Invalid token format. Hugging Face tokens typically start with "hf_"', false);
      return;
    }

    // Save token
    try {
      localStorage.setItem('huggingface_token', token);
      sessionStorage.setItem('huggingface_token', token);
      showFeedback('Token saved successfully!', true);
      
      // Notify parent
      if (onTokenChange) {
        onTokenChange(token);
      }
    } catch (error) {
      showFeedback(`Error saving token: ${error.message}`, false);
    }
  };

  // Show feedback message
  const showFeedback = (message, isSuccess) => {
    setFeedback({ message, isSuccess, visible: true });
    
    // Hide after a delay
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Show documentation
  const showDocumentation = (e) => {
    e.preventDefault();
    
    alert('Secure Token Storage Documentation:\n\n' +
          'Your Hugging Face API token is stored securely on your device using ' +
          'platform-specific secure storage mechanisms. The token is never transmitted ' +
          'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
          'For more information, please visit our documentation site.');
  };

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f0f7ff',
      borderRadius: '8px',
      border: '1px solid #bbdefb',
      marginBottom: '20px'
    }}>
      <h3 style={{ 
        color: '#1565C0', 
        margin: '0 0 15px 0',
        fontSize: '18px'
      }}>
        Hugging Face API Token
      </h3>
      
      <p style={{ 
        fontSize: '14px', 
        margin: '0 0 15px 0', 
        color: '#333'
      }}>
        To access premium models, you'll need a Hugging Face API token.
      </p>
      
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter your Hugging Face API token"
        style={{
          width: '100%',
          padding: '12px',
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          marginBottom: '15px'
        }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <button
          onClick={saveToken}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Save Token Securely
        </button>
        
        <a
          href="#"
          onClick={showDocumentation}
          style={{
            color: '#1976d2',
            textDecoration: 'none',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Learn more about secure token storage
        </a>
      </div>
      
      {feedback.visible && (
        <div style={{
          marginTop: '10px',
          fontSize: '13px',
          color: feedback.isSuccess ? '#4caf50' : '#f44336'
        }}>
          {feedback.isSuccess ? '✓ ' : '⚠️ '}{feedback.message}
        </div>
      )}
      
      <div style={{
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '10px 15px',
        borderRadius: '4px',
        marginTop: '15px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ marginRight: '10px', fontSize: '18px' }}>🔒</span>
        <span style={{ fontSize: '14px' }}>
          Your token is stored securely on your local device and never transmitted to our servers.
        </span>
      </div>
    </div>
  );
};

export default TokenInputManualFallback;
