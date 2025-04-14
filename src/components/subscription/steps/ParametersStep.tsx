import React, { useState, useEffect } from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import secureTokenStorage from '../../../utils/secureTokenStorage';
import '../SubscriptionFlow.css';
import './ParametersStep.css';
import './parameters/fix-main-sliders.css'; // Import targeted fix for main sliders
import useUIFixes from '../../../hooks/useUIFixes';

// Import components
import ParameterSlider from './parameters/ParameterSlider';
import HuggingFaceTokenSection from './parameters/HuggingFaceTokenSection';
import AdvancedParametersSection from './parameters/AdvancedParametersSection';
import NavigationButtons from './parameters/NavigationButtons';

// Parameter defaults based on tier
const getTierDefaults = (tier: SubscriptionTierSimple) => {
  if (tier === 'complete') {
    return {
      temperature: 0.8,
      maxLength: 1024,
      topP: 0.95,
      topK: 60
    };
  }
  
  // Basic tier defaults
  return {
    temperature: 0.7,
    maxLength: 512, 
    topP: 0.9,
    topK: 50
  };
};

interface ParametersStepProps {
  selectedTier: SubscriptionTierSimple;
  initialData: {
    temperature?: number;
    maxLength?: number;
    topP?: number;
    topK?: number;
    hfToken?: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const ParametersStep: React.FC<ParametersStepProps> = ({
  selectedTier,
  initialData,
  onNext,
  onBack
}) => {
  // State for tracking if form has been interacted with
  const [formTouched, setFormTouched] = useState(false);
  
  // Default values based on tier
  const tierDefaults = getTierDefaults(selectedTier);
  
  // State for parameters - use initialData if available, otherwise use tier defaults
  const [temperature, setTemperature] = useState(
    initialData.temperature || tierDefaults.temperature
  );
  
  const [maxLength, setMaxLength] = useState(
    initialData.maxLength || tierDefaults.maxLength
  );
  
  const [topP, setTopP] = useState(
    initialData.topP || tierDefaults.topP
  );
  
  const [topK, setTopK] = useState(
    initialData.topK || tierDefaults.topK
  );
  
  const [hfToken, setHfToken] = useState(initialData.hfToken || '');
  
  // Validation states
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hfTokenError, setHfTokenError] = useState<string | null>(null);
  
  // Color for UI elements based on selected tier
  const color = selectedTier === 'complete' ? '#673AB7' : '#1976D2';
  
  // Apply UI fixes
  useUIFixes();
  
  // Handle token changes
  const handleTokenChange = (newToken: string) => {
    setHfToken(newToken);
    setFormTouched(true);
    
    // Only validate if form has been touched
    if (newToken === '') {
      // Only show error if form has been touched and submitted
      if (formTouched) {
        setHfTokenError('Hugging Face token is required. Please enter a valid token.');
      }
    } else if (newToken && newToken.length > 0) {
      validateHfTokenFormat(newToken);
    }
  };
  
  // Validate Hugging Face token format
  const validateHfTokenFormat = (token: string): boolean => {
    // Simple validation - HF tokens typically start with "hf_" and are longer than 8 chars
    if (token && !token.startsWith('hf_') && token.length > 0) {
      setHfTokenError("Tokens typically start with 'hf_'");
      return false;
    }
    setHfTokenError(null);
    return true;
  };
  
  // Check if token is empty
  const validateTokenPresence = (token: string): boolean => {
    if (!token || token.trim().length === 0) {
      setHfTokenError('Hugging Face token is required. Please enter a valid token.');
      return false;
    }
    return true;
  };
  
  // Handle form submission with validation
  const handleNext = async () => {
    // Mark form as touched when user tries to submit
    setFormTouched(true);
    
    // Reset validation states
    setValidationError(null);
    setIsValidating(true);
    
    try {
      // Check if HF token is empty
      if (!hfToken || hfToken.trim().length === 0) {
        // Use specific error message for empty token
        validateTokenPresence(hfToken);
        setIsValidating(false);
        
        // Focus on the HF token input
        const hfTokenInput = document.getElementById('hf-token-input');
        if (hfTokenInput) {
          hfTokenInput.focus();
          // Scroll to the input if needed
          hfTokenInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return; // Prevent navigation if token is empty
      }
      
      // Validate Hugging Face token
      if (!validateHfTokenFormat(hfToken)) {
        setIsValidating(false);
        
        // Focus on the HF token input for format validation errors too
        const hfTokenInput = document.getElementById('hf-token-input');
        if (hfTokenInput) {
          hfTokenInput.focus();
          hfTokenInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return; // Stop if token format is invalid
      }
      
      // Store token securely in the local device storage
      const tokenSaved = await secureTokenStorage.storeToken(hfToken);
      if (!tokenSaved) {
        setValidationError('Failed to securely store your token. Please try again.');
        setIsValidating(false);
        return;
      }
      
      // If validation passes, proceed to next step
      // We pass the actual token for UI purposes, but it's stored securely on the device
      onNext({
        temperature,
        maxLength,
        topP,
        topK,
        hfToken
      });
    } catch (error) {
      setValidationError('An unexpected error occurred.');
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <div className="parameters-container">
      {/* Header Section - Improved with settings icon before title */}
      <div className="parameters-header">
        <h2 className="parameters-title">
          <span className="settings-icon">⚙️</span> Model Parameters
        </h2>
        <p className="parameters-description">
          Customize how AI models respond to your requests by adjusting these parameters.
        </p>
      </div>
      
      <div className="parameters-content">
        {/* Validation Error Message */}
        {validationError && (
          <div className="validation-error" role="alert">
            <span className="error-icon">⚠️</span>
            {validationError}
          </div>
        )}
        
        {/* Information Message - without the Reset button */}
        <div className="parameters-info-message" style={{
          backgroundColor: '#F0F7FF',
          padding: '15px 20px',
          borderRadius: '8px',
          marginBottom: '25px',
          border: '1px solid #BBDEFB'
        }}>
          <p style={{margin: '0'}}>
            We've provided recommended parameter values based on typical user configurations. 
            You can adjust these values as needed for your specific use case. 
            Your settings will be saved as your default parameters when you click Next.
          </p>
        </div>
        
        {/* Parameter Sliders */}
        <div className="parameter-sliders">
          <ParameterSlider
            label="Temperature"
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={2}
            step={0.1}
            leftLabel="More deterministic"
            rightLabel="More creative"
            description="Controls the randomness of outputs. Lower values make results more focused and deterministic."
          />
          
          <ParameterSlider
            label="Max Length"
            value={maxLength}
            onChange={setMaxLength}
            min={256}
            max={4096}
            step={256}
            leftLabel="Shorter responses"
            rightLabel="Longer responses" 
            description="The maximum number of tokens that can be generated. Higher values allow for more detailed responses."
            unit=" tokens"
          />
        </div>
        
        {/* Hugging Face API Token Section - Ensure always visible */}
        <HuggingFaceTokenSection
          token={hfToken}
          onTokenChange={handleTokenChange}
          error={hfTokenError}
          initialExpanded={true}
        />
        
        {/* Advanced Parameters Section */}
        <AdvancedParametersSection
          topP={topP}
          topK={topK}
          onTopPChange={setTopP}
          onTopKChange={setTopK}
          repetitionPenalty={1.1}
          encoderRepetitionPenalty={1.0}
          noRepeatNgramSize={0}
          typicalP={1.0}
          numBeams={1}
          onRepetitionPenaltyChange={(value) => console.log('Rep penalty changed:', value)}
          onEncoderRepetitionPenaltyChange={(value) => console.log('Encoder penalty changed:', value)}
          onNoRepeatNgramSizeChange={(value) => console.log('No repeat ngram changed:', value)}
          onTypicalPChange={(value) => console.log('Typical P changed:', value)}
          onNumBeamsChange={(value) => console.log('Num beams changed:', value)}
          initialExpanded={true}
        />
        
        {/* Navigation Buttons */}
        <NavigationButtons
          onBack={onBack}
          onNext={handleNext}
          nextColor={color}
          disabled={isValidating}
        />
      </div>
    </div>
  );
};

export default ParametersStep;