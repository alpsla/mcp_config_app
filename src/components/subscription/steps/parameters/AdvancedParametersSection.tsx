import React from 'react';
import ParameterSlider from './ParameterSlider';

interface AdvancedParametersSectionProps {
  topP: number;
  topK: number;
  onTopPChange: (value: number) => void;
  onTopKChange: (value: number) => void;
  disabled?: boolean;
}

const AdvancedParametersSection: React.FC<AdvancedParametersSectionProps> = ({
  topP,
  topK,
  onTopPChange,
  onTopKChange,
  disabled = false
}) => {
  return (
    <div style={{ opacity: disabled ? 0.7 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <h3>Advanced Parameters</h3>
      <div>
        <ParameterSlider
          label="Top P"
          value={topP}
          onChange={onTopPChange}
          min={0.1}
          max={1}
          step={0.05}
          leftLabel="More focused"
          rightLabel="More diverse"
          description="Controls diversity. Lower values focus on high probability options."
          disabled={disabled}
        />
        
        <ParameterSlider
          label="Top K"
          value={topK}
          onChange={onTopKChange}
          min={1}
          max={100}
          step={1}
          leftLabel="More precise"
          rightLabel="More creative"
          description="Limits vocabulary choices to top K options."
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AdvancedParametersSection;