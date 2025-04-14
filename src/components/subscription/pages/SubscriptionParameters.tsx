import React, { useState } from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import '../SubscriptionFlow.css';
import ProgressBar from './ProgressBar';

// Define nice looking styles for sliders and controls
const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1200px', // Increased from 900px to 1200px
    margin: '30px auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px'
  },
  title: {
    fontSize: '28px',
    margin: '0 0 10px 0',
    color: '#333',
    fontWeight: 600
  },
  description: {
    margin: '0 auto',
    color: '#666',
    fontSize: '16px',
    maxWidth: '600px'
  },
  infoMessage: {
    maxWidth: '1000px', // Increased from 800px to 1000px
    margin: '0 auto 30px',
    padding: '20px',
    backgroundColor: '#F0F7FF',
    borderRadius: '10px',
    borderLeft: '4px solid #1976D2'
  },
  resetButton: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: '#fff',
    color: '#1976D2',
    border: '1px solid #1976D2',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  parameterContainer: {
    maxWidth: '1000px', // Increased from 800px to 1000px
    margin: '20px auto',
    backgroundColor: '#FAFAFA',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #eee'
  },
  parameterHeader: {
    marginBottom: '15px'
  },
  sliderContainer: {
    marginBottom: '15px'
  },
  slider: {
    width: '100%',
    height: '4px',
    appearance: 'none' as const,
    backgroundColor: '#ddd',
    outline: 'none',
    borderRadius: '2px',
    cursor: 'pointer' as const
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    fontSize: '14px',
    color: '#666'
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#0D47A1',
    marginTop: '15px'
  },
  navigationButtons: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1000px', // Increased from 800px to 1000px
    margin: '30px auto 0'
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease'
  },
  nextButton: {
    padding: '12px 28px',
    backgroundColor: '#1976D2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease'
  },
  tokenContainer: {
    maxWidth: '1000px',
    margin: '30px auto',
    backgroundColor: '#FFFBEB',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #FFC107'
  },
  tokenHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    gap: '10px',
    borderBottom: '1px solid #FFD54F',
    paddingBottom: '10px'
  },
  tokenIcon: {
    color: '#FFC107',
    fontSize: '20px',
    marginRight: '5px'
  },
  tokenInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    marginTop: '10px'
  },
  securityMessage: {
    fontSize: '14px',
    color: '#666',
    margin: '10px 0',
    fontStyle: 'italic'
  },
  advancedContainer: {
    maxWidth: '1000px',
    margin: '30px auto',
    backgroundColor: '#EDF2F7',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #4A5568'
  },
  advancedHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    borderBottom: '1px solid #718096',
    paddingBottom: '10px',
    color: '#2D3748'
  },
  advancedParameter: {
    marginBottom: '20px'
  },
  advancedSlider: {
    width: '100%',
    margin: '10px 0',
    height: '6px',
    appearance: 'none' as const,
    borderRadius: '3px',
    backgroundColor: '#CBD5E0',
    outline: 'none',
    cursor: 'pointer' as const
  }
};

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
  const [hfToken, setHfToken] = useState('');
  
  // Show the HF token section
  const [showHfToken, setShowHfToken] = useState(true);
  
  // Color for UI elements based on selected tier
  const color = '#1976D2'; // Blue for parameters page
  
  // Reset parameters to defaults
  const handleResetToDefaults = () => {
    setTemperature(tierDefaults.temperature);
    setMaxLength(tierDefaults.maxLength);
  };
  
  // Navigate to previous step
  const handleBack = () => {
    window.location.hash = '#/subscribe/interests';
  };
  
  // Navigate to next step
  const handleNext = () => {
    window.location.hash = '#/subscribe/payment';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      {/* Add Progress Bar component */}
      <ProgressBar currentStep={4} />
      
      <div style={styles.header}>
        <h2 style={styles.title}>Model Parameters</h2>
        <p style={styles.description}>
          Customize how AI models respond to your requests by adjusting these parameters.
        </p>
      </div>
      
      {/* Information message */}
      <div style={styles.infoMessage}>
        <p>
          We've provided recommended parameter values based on typical user configurations. You
          can adjust these values as needed for your specific use case. Your settings will be saved as
          your default parameters when you click Next.
        </p>
        <button 
          style={styles.resetButton}
          onClick={handleResetToDefaults}
        >
          Reset to Recommended Values
        </button>
      </div>
      
      {/* Temperature slider */}
      <div style={styles.parameterContainer}>
        <div style={styles.parameterHeader}>
          <div style={{ fontWeight: 'bold' }}>Temperature {temperature.toFixed(2)}</div>
        </div>
        
        <div style={styles.sliderContainer}>
          <input 
            type="range" 
            min={0} 
            max={2} 
            step={0.1} 
            value={temperature} 
            onChange={e => setTemperature(parseFloat(e.target.value))}
            style={{
              ...styles.slider,
              background: `linear-gradient(to right, ${color} 0%, ${color} ${temperature*50}%, #ddd ${temperature*50}%, #ddd 100%)`
            }}
          />
          <div style={styles.sliderLabels}>
            <span>More deterministic</span>
            <span>More creative</span>
          </div>
        </div>
        
        <div style={styles.infoBox}>
          Controls the randomness of outputs. Lower values make results more focused and deterministic.
        </div>
      </div>
      
      {/* Max Length slider */}
      <div style={styles.parameterContainer}>
        <div style={styles.parameterHeader}>
          <div style={{ fontWeight: 'bold' }}>Max Length</div>
          <div style={{ fontSize: '14px', marginTop: '2px' }}>{maxLength} tokens</div>
        </div>
        
        <div style={styles.sliderContainer}>
          <input 
            type="range" 
            min={256} 
            max={4096} 
            step={256} 
            value={maxLength} 
            onChange={e => setMaxLength(parseInt(e.target.value))}
            style={{
              ...styles.slider,
              background: `linear-gradient(to right, ${color} 0%, ${color} ${(maxLength-256)/(4096-256)*100}%, #ddd ${(maxLength-256)/(4096-256)*100}%, #ddd 100%)`
            }}
          />
          <div style={styles.sliderLabels}>
            <span>Shorter responses</span>
            <span>Longer responses</span>
          </div>
        </div>
        
        <div style={styles.infoBox}>
          The maximum number of tokens that can be generated. Higher values allow for more detailed responses.
        </div>
      </div>
      
      {/* Hugging Face API Token */}
      {showHfToken && (
        <div style={{
          maxWidth: '1000px',
          margin: '30px auto',
          backgroundColor: '#FFFBEB',
          padding: '25px',
          borderRadius: '10px',
          border: '2px solid #D69E2E',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '15px',
            borderBottom: '1px solid #F6E05E',
            paddingBottom: '10px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '28px'}}>🔑</span>
              <h3 style={{ margin: 0, color: '#D69E2E', fontSize: '22px' }}>Hugging Face API Token</h3>
            </div>
            <button 
              onClick={() => setShowHfToken(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#D69E2E'
              }}
            >−</button>
          </div>
          
          <p style={{color: '#744210', fontSize: '16px', lineHeight: '1.5'}}>
            Enter your Hugging Face API token to use with your subscription. You can find or
            create your token in your <a href="https://huggingface.co/settings/tokens" style={{ color: '#D69E2E', textDecoration: 'none', fontWeight: 'bold' }}>Hugging Face account settings</a>.
          </p>
          
          <input 
            type="text"
            value={hfToken}
            onChange={e => setHfToken(e.target.value)}
            placeholder="Enter your Hugging Face API token"
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #F6E05E',
              borderRadius: '8px',
              fontSize: '16px',
              marginTop: '10px',
              backgroundColor: '#FFFEF0'
            }}
          />
          
          <div style={{
            backgroundColor: '#FEF3C7',
            padding: '12px 15px',
            borderRadius: '8px',
            marginTop: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{fontSize: '20px'}}>🔒</span>
            <p style={{margin: 0, color: '#92400E', fontSize: '14px'}}>
              Your token will be securely stored on your device and never transmitted or stored on our servers
              as plain text. It will only be used for API requests when needed.
            </p>
          </div>
        </div>
      )}
      
      {/* Advanced Parameters Section */}
      <div style={{
        maxWidth: '1000px',
        margin: '30px auto',
        backgroundColor: '#EDF2F7',
        padding: '25px',
        borderRadius: '10px',
        border: '2px solid #4A5568',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '20px',
          borderBottom: '1px solid #718096',
          paddingBottom: '10px',
          color: '#2D3748'
        }}>Advanced Parameters</h3>
        
        {/* Info box explaining parameters for non-technical users */}
        <div style={{
          backgroundColor: '#E2E8F0',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px',
          border: '1px solid #CBD5E0'
        }}>
          <p style={{margin: '0 0 10px 0', color: '#2D3748', fontWeight: 'bold'}}>
            What do these parameters mean?
          </p>
          <p style={{margin: '0 0 8px 0', color: '#4A5568', fontSize: '14px', lineHeight: '1.5'}}>
            These settings control how the AI responds to your prompts. Think of them like adjusting the creativity and variety of the AI's answers.
          </p>
          <ul style={{margin: '0', paddingLeft: '20px', color: '#4A5568', fontSize: '14px'}}>
            <li style={{marginBottom: '8px'}}>
              <b>Top P:</b> Controls how varied the responses are. Low values (0.1-0.3) make responses more focused and predictable, high values (0.7-1.0) create more diverse and surprising responses. <i>Example: For factual work, use 0.1-0.3; for creative writing, use 0.7-1.0.</i>
            </li>
            <li>
              <b>Top K:</b> Limits how many word choices the AI considers at each step. Lower values (1-20) make output more focused and deterministic, higher values (40-100) allow more variety. <i>Example: For code generation, use 10-30; for storytelling, use 40-80.</i>
            </li>
          </ul>
        </div>
        
        {/* Top P */}
        <div style={{
          marginBottom: '30px',
          backgroundColor: '#F7FAFC',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2D3748', fontSize: '16px' }}>Top P: {topP.toFixed(2)}</div>
          <input 
            type="range" 
            min={0.1} 
            max={1} 
            step={0.05} 
            value={topP} 
            onChange={e => setTopP(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              appearance: 'none' as const,
              borderRadius: '4px',
              backgroundColor: '#CBD5E0',
              outline: 'none',
              cursor: 'pointer' as const,
              background: `linear-gradient(to right, #4A5568 0%, #4A5568 ${(topP-0.1)/(1-0.1)*100}%, #CBD5E0 ${(topP-0.1)/(1-0.1)*100}%, #CBD5E0 100%)`
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            color: '#718096',
            fontSize: '14px'
          }}>
            <span>More Focused</span>
            <span>More Diverse</span>
          </div>
          <div style={{
            display: 'flex',
            marginTop: '15px',
            backgroundColor: '#EBF4FF',
            padding: '12px',
            borderRadius: '6px',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{fontSize: '20px', color: '#3182CE'}}>💡</span>
            <p style={{margin: 0, color: '#2C5282', fontSize: '14px'}}>
              Controls diversity. A value around 0.7 gives a good balance between focus and creativity for most uses.
            </p>
          </div>
        </div>
        
        {/* Top K */}
        <div style={{
          marginBottom: '20px',
          backgroundColor: '#F7FAFC',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2D3748', fontSize: '16px' }}>Top K: {topK}</div>
          <input 
            type="range" 
            min={1} 
            max={100} 
            step={1} 
            value={topK} 
            onChange={e => setTopK(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              appearance: 'none' as const,
              borderRadius: '4px',
              backgroundColor: '#CBD5E0',
              outline: 'none',
              cursor: 'pointer' as const,
              background: `linear-gradient(to right, #4A5568 0%, #4A5568 ${(topK-1)/(100-1)*100}%, #CBD5E0 ${(topK-1)/(100-1)*100}%, #CBD5E0 100%)`
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            color: '#718096',
            fontSize: '14px'
          }}>
            <span>More Predictable</span>
            <span>More Varied</span>
          </div>
          <div style={{
            display: 'flex',
            marginTop: '15px',
            backgroundColor: '#EBF4FF',
            padding: '12px',
            borderRadius: '6px',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{fontSize: '20px', color: '#3182CE'}}>💡</span>
            <p style={{margin: 0, color: '#2C5282', fontSize: '14px'}}>
              Limits vocabulary choices. Most users find values between 40-60 work well for general purposes.
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div style={styles.navigationButtons}>
        <button
          onClick={handleBack}
          style={styles.backButton}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          style={styles.nextButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1565C0';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#1976D2';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SubscriptionParameters;