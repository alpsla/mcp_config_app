import React, { useState } from 'react';
import RecommendedSettingsToggle from './parameters/RecommendedSettingsToggle';
import ParameterSlider from './parameters/ParameterSlider';
import HuggingFaceTokenSection from './parameters/HuggingFaceTokenSection';
import AdvancedParametersSection from './parameters/AdvancedParametersSection';
import PresetSaver from './parameters/PresetSaver';
import NavigationButtons from './parameters/NavigationButtons';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import '../SubscriptionFlow.css';

interface ParametersStepProps {
  selectedTier: SubscriptionTierSimple;
  initialData: {
    useDefaultParameters?: boolean;
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
  // State for parameters
  const [useDefaultParameters, setUseDefaultParameters] = useState(
    initialData.useDefaultParameters !== undefined ? initialData.useDefaultParameters : true
  );
  const [temperature, setTemperature] = useState(initialData.temperature || 0.7);
  const [maxLength, setMaxLength] = useState(initialData.maxLength || 512);
  const [topP, setTopP] = useState(initialData.topP || 0.95);
  const [topK, setTopK] = useState(initialData.topK || 50);
  const [hfToken, setHfToken] = useState(initialData.hfToken || '');
  
  // Color for UI elements based on selected tier
  const color = selectedTier === 'complete' ? '#673AB7' : '#1976D2';
  
  // Handle form submission
  const handleNext = () => {
    onNext({
      useDefaultParameters,
      temperature,
      maxLength,
      topP,
      topK,
      hfToken
    });
  };
  
  // Handle preset saving
  const handleSavePreset = (name: string) => {
    console.log('Saving preset:', name, {
      temperature,
      maxLength,
      topP,
      topK
    });
    // Here you would integrate with your storage solution
    alert(`Preset "${name}" has been saved.`);
  };
  
  return (
    <div className="subscription-step" style={{ paddingTop: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#E3F2FD',
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          margin: '0 auto 20px'
        }}>⚙️</div>
        <h2 style={{
          fontSize: '28px', 
          margin: '0 0 10px 0',
          color: '#333',
          fontWeight: 600
        }}>
          Model Parameters
        </h2>
        <p style={{ margin: '0 auto', color: '#666', fontSize: '16px', maxWidth: '600px' }}>
          Customize how AI models respond to your requests by adjusting these parameters.
        </p>
      </div>
      
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        {/* Recommended Settings Toggle */}
        <RecommendedSettingsToggle 
          enabled={useDefaultParameters}
          onChange={setUseDefaultParameters}
        />
        
        {/* Parameter Sliders */}
        <div style={{ opacity: useDefaultParameters ? 0.7 : 1, pointerEvents: useDefaultParameters ? 'none' : 'auto' }}>
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
            disabled={useDefaultParameters}
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
            disabled={useDefaultParameters}
          />
        </div>
        
        {/* Hugging Face API Token Section */}
        <HuggingFaceTokenSection
          initialToken={hfToken}
          onChange={setHfToken}
        />
        
        {/* Advanced Parameters Section */}
        <AdvancedParametersSection
          topP={topP}
          topK={topK}
          onTopPChange={setTopP}
          onTopKChange={setTopK}
          disabled={useDefaultParameters}
        />
        
        {/* Preset Saver */}
        <PresetSaver
          onSave={handleSavePreset}
          disabled={useDefaultParameters}
        />
      </div>
      
      {/* Navigation Buttons */}
      <NavigationButtons
        onBack={onBack}
        onNext={handleNext}
        nextColor={color}
      />
    </div>
  );
};

export default ParametersStep;