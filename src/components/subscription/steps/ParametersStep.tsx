import React, { useState, useEffect } from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import '../SubscriptionFlow.css';
import './buttons.css';
import './ParametersStep.css'; // Added new CSS file for parameter-specific styles
import ParameterSlider from './parameters/ParameterSlider';
import ParameterVisualization from './parameters/ParameterVisualization';
import CustomParameterSection from './parameters/custom/CustomParameterSection';
import { useAuth } from '../../../auth/AuthContext';
import { parameterService, CustomParameter } from '../../../services/parameterService';

interface ParametersStepProps {
  selectedTier: SubscriptionTierSimple;
  initialData: {
    useDefaultParameters: boolean;
    temperature: number;
    maxLength: number;
    topP: number;
    topK: number;
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
  const { authState } = useAuth();
  const [useDefaults, setUseDefaults] = useState<boolean>(initialData.useDefaultParameters);
  const [parameters, setParameters] = useState({
    temperature: initialData.temperature || 0.7,
    maxLength: initialData.maxLength || 512,
    topP: initialData.topP || 0.9,
    topK: initialData.topK || 40
  });
  
  const [customParameters, setCustomParameters] = useState<CustomParameter[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingParams, setIsLoadingParams] = useState(true);
  
  const [huggingFaceToken, setHuggingFaceToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  
  // Show/hide advanced options
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Load user's custom parameters
  useEffect(() => {
    const loadCustomParameters = async () => {
      if (authState?.user?.id) {
        try {
          setIsLoadingParams(true);
          const params = await parameterService.getUserParameters(authState.user.id);
          setCustomParameters(params);
        } catch (error) {
          console.error('Error loading custom parameters:', error);
          // Show error message if needed
        } finally {
          setIsLoadingParams(false);
        }
      }
    };
    
    loadCustomParameters();
  }, [authState?.user?.id]);
  
  // Handle adding a custom parameter
  const handleAddCustomParameter = async (parameter: CustomParameter) => {
    if (authState?.user?.id) {
      try {
        await parameterService.saveParameter(authState.user.id, parameter);
        setCustomParameters(prev => [...prev, parameter]);
      } catch (error) {
        console.error('Error saving custom parameter:', error);
        // Show error message if needed
      }
    }
  };
  
  // Handle removing a custom parameter
  const handleRemoveCustomParameter = async (parameterId: string) => {
    if (authState?.user?.id) {
      try {
        await parameterService.removeParameter(authState.user.id, parameterId);
        setCustomParameters(prev => prev.filter(p => p.id !== parameterId));
      } catch (error) {
        console.error('Error removing custom parameter:', error);
        // Show error message if needed
      }
    }
  };

  // Parameter definitions
  const parameterDefinitions = [
    {
      id: 'temperature',
      name: 'Temperature',
      description: 'Controls randomness in text generation. Lower values are more deterministic; higher values are more creative.',
      min: 0.1,
      max: 1.0,
      step: 0.1,
      defaultValue: 0.7,
      unit: '',
      advancedOnly: false
    },
    {
      id: 'maxLength',
      name: 'Maximum Length',
      description: 'Maximum number of tokens to generate.',
      min: 10,
      max: 512,
      step: 10,
      defaultValue: 512,
      unit: 'tokens',
      advancedOnly: false
    },
    {
      id: 'topP',
      name: 'Top P',
      description: 'Controls diversity via nucleus sampling. Lower values focus on more likely tokens; higher values consider a broader range.',
      min: 0.1,
      max: 1.0,
      step: 0.1,
      defaultValue: 0.9,
      unit: '',
      advancedOnly: true
    },
    {
      id: 'topK',
      name: 'Top K',
      description: 'Limits choices to the K most likely tokens. 0 means no limit.',
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 40,
      unit: '',
      advancedOnly: true
    }
  ];

  // Handle toggle change for using defaults
  const handleUseDefaultsChange = () => {
    const newUseDefaults = !useDefaults;
    setUseDefaults(newUseDefaults);
    
    if (newUseDefaults) {
      // Reset to default values
      setParameters({
        temperature: 0.7,
        maxLength: 512,
        topP: 0.9,
        topK: 40
      });
    }
  };

  // Handle parameter change
  const handleParameterChange = (
    paramId: string, 
    value: number
  ) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  // Handle token input change
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHuggingFaceToken(e.target.value);
  };

  // Handle token visibility toggle
  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  // Handle next button click
  const handleNext = () => {
    onNext({
      useDefaultParameters: useDefaults,
      huggingFaceToken,
      customParameters,
      ...parameters
    });
  };

  return (
    <div className="subscription-step parameters-step">

      <div className="parameters-header">
        <div className="param-icon">⚙️</div>
        <h2>Configure Default AI Parameters</h2>
        <p className="step-description">
          These settings will apply to all models unless you override them specifically.
          {selectedTier === 'complete' && ' As a Complete subscriber, you have access to advanced parameters.'}
        </p>
      </div>

      <div className="use-defaults-container">
        <div className="use-defaults-toggle-wrapper">
          <div className="toggle-description">
            <h3 className="toggle-title">Use Recommended Settings</h3>
            <p className="toggle-subtitle">We've configured optimal parameters for most use cases.</p>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={useDefaults}
              onChange={handleUseDefaultsChange}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className={`parameters-container ${useDefaults ? 'disabled' : ''}`}>
        <h3 className="section-header">Basic Parameters</h3>
        {parameterDefinitions.filter(param => !param.advancedOnly).map(param => (
          <div key={param.id} className="parameter-card">
            <div className="parameter-header">
              <h3>{param.name}</h3>
              <div className="parameter-current-value">
                {param.name === 'Temperature' ? parameters[param.id as keyof typeof parameters].toFixed(1) : parameters[param.id as keyof typeof parameters]}
                {param.unit && <span className="parameter-unit">{param.unit}</span>}
              </div>
            </div>
            
            <ParameterSlider
              parameter={param}
              value={parameters[param.id as keyof typeof parameters] as number}
              onChange={(value) => handleParameterChange(param.id, value)}
              disabled={useDefaults}
            />
            
            <div className="parameter-description-wrapper">
              <p className="parameter-description">{param.description}</p>
              <div className="parameter-range-labels">
                {param.id === 'temperature' && (
                  <>
                    <span>More deterministic</span>
                    <span>More creative</span>
                  </>
                )}
                {param.id === 'maxLength' && (
                  <>
                    <span>Shorter responses</span>
                    <span>Longer responses</span>
                  </>
                )}
              </div>
            </div>
            
            <ParameterVisualization
              parameterId={param.id}
              value={parameters[param.id as keyof typeof parameters] as number}
            />
          </div>
        ))}

        {/* Hugging Face Token Section */}
        <div className="hf-token-section">
          <h3 className="section-header">Hugging Face API Token</h3>
          <div className="token-card">
            <div className="token-input-wrapper">
              <div className="token-input-container">
                <input
                  type={showToken ? "text" : "password"}
                  value={huggingFaceToken}
                  onChange={handleTokenChange}
                  placeholder="Enter your Hugging Face API token"
                  className="token-input"
                  disabled={useDefaults}
                />
                <button 
                  type="button"
                  className="toggle-visibility-btn" 
                  onClick={toggleTokenVisibility}
                  disabled={useDefaults}
                >
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
              <a 
                href="https://huggingface.co/settings/tokens/new?tokenType=fineGrained" 
                target="_blank" 
                rel="noopener noreferrer"
                className="get-token-link"
              >
                Get a token
              </a>
            </div>
            
            <div className="security-message">
              <span className="security-icon">🔒</span>
              <p>Your token is stored securely on your local device and never transmitted to our servers.</p>
            </div>
            
            <div className="token-steps">
              <h4>To get a token:</h4>
              <ol>
                <li>Visit the <a href="https://huggingface.co/settings/tokens/new" target="_blank" rel="noopener noreferrer">Hugging Face Token page</a></li>
                <li>Sign in (or create a free account)</li>
                <li>Enter "MCP Configuration" as the token name</li>
                <li>Set the role to "Read"</li>
                <li>Copy and paste the token into the field above</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Advanced Parameters Section */}
        <div className="advanced-parameters-section">
          <h3 
            className="section-header expandable-header" 
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            Advanced Parameters 
            <span className="expand-icon">{showAdvancedOptions ? '▼' : '▶'}</span>
          </h3>
          
          {showAdvancedOptions && (
            <div className="advanced-parameters">
              {parameterDefinitions.filter(param => param.advancedOnly).map(param => (
                <div key={param.id} className="parameter-card">
                  <div className="parameter-header">
                    <h3>
                      {param.name}
                      {selectedTier === 'complete' && (
                        <span className="premium-badge">Premium</span>
                      )}
                    </h3>
                    <div className="parameter-current-value">
                      {parameters[param.id as keyof typeof parameters]}
                      {param.unit && <span className="parameter-unit">{param.unit}</span>}
                    </div>
                  </div>
                  
                  <ParameterSlider
                    parameter={param}
                    value={parameters[param.id as keyof typeof parameters] as number}
                    onChange={(value) => handleParameterChange(param.id, value)}
                    disabled={useDefaults || selectedTier !== 'complete'}
                  />
                  
                  <p className="parameter-description">{param.description}</p>
                  
                  <ParameterVisualization
                    parameterId={param.id}
                    value={parameters[param.id as keyof typeof parameters] as number}
                  />
                </div>
              ))}

              {/* Custom Parameters Section */}
              <CustomParameterSection
                onParameterAdded={handleAddCustomParameter}
                onParameterRemoved={handleRemoveCustomParameter}
                customParameters={customParameters}
                disabled={useDefaults}
              />
            </div>
          )}
        </div>

        <div className="parameters-explainer">
          <h3>Understanding These Parameters</h3>
          <p>
            Parameters control how AI models generate text and respond to your prompts.
            You can adjust them now or change them later in your settings.
          </p>

          <div className="parameter-examples">
            <div className="example-card">
              <h4>Temperature Example</h4>
              <div className="example-content">
                <p><strong>Low (0.2):</strong> The sky is blue and the sun is shining.</p>
                <p><strong>High (0.9):</strong> The sky is a brilliant azure canvas, with the sun casting golden rays across the landscape.</p>
              </div>
            </div>
            
            <div className="example-card">
              <h4>Max Length Example</h4>
              <div className="example-content">
                <p><strong>Low (50 tokens):</strong> Brief, concise responses focused on key information.</p>
                <p><strong>High (512 tokens):</strong> Detailed responses with thorough explanations and multiple examples.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          type="button"
          className="button-cancel"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="button-continue"
          onClick={handleNext}
          style={{
            backgroundColor: selectedTier === 'complete' ? '#673AB7' : '#4285F4'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ParametersStep;