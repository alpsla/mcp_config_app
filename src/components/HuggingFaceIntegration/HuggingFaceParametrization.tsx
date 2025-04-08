import React from 'react';
import TokenInput from './TokenInput';

interface HuggingFaceParametrizationProps {
  onTokenValidated: (token: string) => void;
}

/**
 * Component for managing Hugging Face API token
 * This version removes the duplicated message about token storage security
 */
const HuggingFaceParametrization: React.FC<HuggingFaceParametrizationProps> = ({
  onTokenValidated
}) => {
  return (
    <div className="huggingface-parametrization">
      <div className="token-container">
        <h3>Hugging Face API Token</h3>
        <p className="token-description">
          To access premium models, you'll need a Hugging Face API token.
          {/* Removed the duplicated message: "This token will be stored securely as an environment variable on your device only." */}
        </p>
        
        <TokenInput onTokenValidated={onTokenValidated} />
        
        {/* Security note is already included in the TokenInput component */}
      </div>
    </div>
  );
};

export default HuggingFaceParametrization;
