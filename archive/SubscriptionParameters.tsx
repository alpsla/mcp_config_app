import React, { useState } from 'react';
import { SubscriptionTierSimple } from '../src/types/enhanced-types';
import './SubscriptionFlow.css';
import '../subscription/steps/ParametersStep.css';

// Import components if available
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ParameterSlider from '../src/components/subscription/steps/parameters/ParameterSlider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HuggingFaceTokenSection from '../src/components/subscription/steps/parameters/HuggingFaceTokenSection';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AdvancedParametersSection from '../src/components/subscription/steps/parameters/AdvancedParametersSection';
import NavigationButtons from '../src/components/subscription/steps/parameters/NavigationButtons';

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

/**
 * SubscriptionParameters Component
 * This component implements the parameters page
 */
const SubscriptionParameters: React.FC = () => {
  // Get tier from URL parameters
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '');
  const planParam = searchParams.get('plan') || 'basic';
  const tier = (planParam === 'complete' || planParam === 'basic') ? planParam as SubscriptionTierSimple : 'basic';
  
  // Default values based on tier
  const tierDefaults = getTierDefaults(tier);
  
  // State for parameters - use tierDefaults if available, otherwise default values
  const [temperature, setTemperature] = useState(tierDefaults.temperature);
  const [maxLength, setMaxLength] = useState(tierDefaults.maxLength);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topP, setTopP] = useState(tierDefaults.topP);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [topK, setTopK] = useState(tierDefaults.topK);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [useDefaults, setUseDefaults] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hfToken, setHfToken] = useState('');
  
  // Color for UI elements based on selected tier
  const color = tier === 'complete' ? '#673AB7' : '#1976D2';
  
  // Navigate to back
  const handleBack = () => {
    window.location.hash = '#/subscribe/interests';
  };
  
  // Navigate to next step
  const handleNext = () => {
    window.location.hash = '#/subscribe/payment';
  };

  // Reset parameters to tier defaults
  const handleResetToDefaults = () => {
    setTemperature(tierDefaults.temperature);
    setMaxLength(tierDefaults.maxLength);
    setTopP(tierDefaults.topP);
    setTopK(tierDefaults.topK);
  };
  
  // Try to use existing components first, then fallback to local implementations
  const hasImportedComponents = 
    typeof ParameterSlider !== 'undefined' && 
    typeof NavigationButtons !== 'undefined';
  
  return (
    <div className="parameters-container">
      {/* Header Section */}
      <div className="parameters-header">
        <div className="parameters-icon-container">
          <div className="parameters-icon">⚙️</div>
        </div>
        <h2 className="parameters-title">Model Parameters</h2>
        <p className="parameters-description">
          Customize how AI models respond to your requests by adjusting these parameters.
        </p>
      </div>
      
      <div className="parameters-content">
        {/* Information Message - Replacing the toggle with information */}
        <div className="parameters-info-message">
          <p>
            We've provided recommended parameter values based on typical user configurations. 
            You can adjust these values as needed for your specific use case. 
            Your settings will be saved as your default parameters when you click Next.
          </p>
          <button 
            type="button" 
            className="reset-defaults-button" 
            onClick={handleResetToDefaults}
          >
            Reset to Recommended Values
          </button>
        </div>
        
        {/* Parameter Sliders - Use imported components if available */}
        {hasImportedComponents ? (
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
        ) : (
          // Fallback implementation for parameters
          <div className="parameter-sliders">
            {/* Temperature fallback */}
            <div style={{
              marginBottom: '40px',
              backgroundColor: '#FAFAFA',
              padding: '20px',
              borderRadius: '10px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <label style={{fontWeight: 'bold', color: '#333'}}>
                  Temperature: {temperature.toFixed(2)}
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <button 
                    onClick={() => setTemperature(Math.max(0, temperature - 0.1))}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px'
                    }}
                  >-</button>
                  <input 
                    type="number" 
                    value={temperature} 
                    min={0} 
                    max={2} 
                    step={0.1}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}
                  />
                  <button 
                    onClick={() => setTemperature(Math.min(2, temperature + 0.1))}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '10px'
                    }}
                  >+</button>
                </div>
              </div>
              <input 
                type="range" 
                min={0} 
                max={2} 
                step={0.1} 
                value={temperature} 
                onChange={e => setTemperature(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '5px',
                  outline: 'none',
                  appearance: 'none',
                  backgroundColor: '#ddd',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                fontSize: '14px',
                color: '#666'
              }}>
                <span>More deterministic</span>
                <span>More creative</span>
              </div>
              <div style={{
                backgroundColor: '#f1f8ff',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#666',
                marginTop: '15px'
              }}>
                Controls the randomness of outputs. Lower values make results more focused and deterministic.
              </div>
            </div>
            
            {/* Max Length fallback */}
            <div style={{
              marginBottom: '40px',
              backgroundColor: '#FAFAFA',
              padding: '20px',
              borderRadius: '10px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <label style={{fontWeight: 'bold', color: '#333'}}>
                  Max Length: {maxLength}
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <button 
                    onClick={() => setMaxLength(Math.max(256, maxLength - 256))}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px'
                    }}
                  >-</button>
                  <input 
                    type="number" 
                    value={maxLength} 
                    min={256} 
                    max={4096} 
                    step={256}
                    onChange={e => setMaxLength(parseInt(e.target.value))}
                    style={{
                      width: '80px',
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}
                  />
                  <button 
                    onClick={() => setMaxLength(Math.min(4096, maxLength + 256))}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '10px'
                    }}
                  >+</button>
                </div>
              </div>
              <input 
                type="range" 
                min={256} 
                max={4096} 
                step={256} 
                value={maxLength} 
                onChange={e => setMaxLength(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '5px',
                  outline: 'none',
                  appearance: 'none',
                  backgroundColor: '#ddd',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                fontSize: '14px',
                color: '#666'
              }}>
                <span>Shorter responses</span>
                <span>Longer responses</span>
              </div>
              <div style={{
                backgroundColor: '#f1f8ff',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#666',
                marginTop: '15px'
              }}>
                The maximum number of tokens that can be generated. Higher values allow for more detailed responses.
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons - use imported component if available */}
        {typeof NavigationButtons !== 'undefined' ? (
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            nextColor={color}
            disabled={false}
          />
        ) : (
          <div className="navigation-buttons">
            <button
              onClick={handleBack}
              style={{
                padding: '12px 24px',
                backgroundColor: '#fff',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: '12px 28px',
                backgroundColor: color,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionParameters;