import React from 'react';
import '../ParametersStep.css';

interface ParameterVisualizationProps {
  parameterId: string;
  value: number;
}

const ParameterVisualization: React.FC<ParameterVisualizationProps> = ({
  parameterId,
  value
}) => {
  // Different visualizations based on parameter type
  const renderVisualization = () => {
    switch (parameterId) {
      case 'temperature':
        return renderTemperatureVisualization(value);
      case 'maxLength':
        return renderMaxLengthVisualization(value);
      case 'topP':
        return renderTopPVisualization(value);
      case 'topK':
        return renderTopKVisualization(value);
      default:
        return renderGenericVisualization(value);
    }
  };

  // Temperature visualization (creativity vs deterministic)
  const renderTemperatureVisualization = (temp: number) => {
    const normalizedValue = temp / 1.0; // Assuming max is 1.0
    return (
      <div className="visualization-content">
        <div className="viz-bar">
          <div 
            className="viz-indicator" 
            style={{ left: `${normalizedValue * 100}%` }}
          ></div>
        </div>
        <div className="text-sample">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="text-line" 
              style={{ 
                width: `${30 + (i * 10) + (normalizedValue * 40)}%`,
                opacity: 0.7 + (i * 0.1)
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  // Max Length visualization (more tokens vs fewer)
  const renderMaxLengthVisualization = (length: number) => {
    const normalizedValue = length / 512; // Assuming max is 512
    return (
      <div className="visualization-content">
        <div className="viz-bar">
          <div 
            className="viz-indicator" 
            style={{ left: `${normalizedValue * 100}%` }}
          ></div>
        </div>
        <div className="token-boxes">
          {[...Array(Math.min(20, Math.round(normalizedValue * 20)))].map((_, i) => (
            <div 
              key={i} 
              className="token-box" 
              style={{ 
                backgroundColor: `rgba(66, 133, 244, ${0.8 - (i * 0.03)})`,
                transform: `scale(${1 - (i * 0.03)})` 
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  // Top P visualization (nucleus sampling)
  const renderTopPVisualization = (p: number) => {
    const normalizedValue = p; // Already normalized (0-1)
    return (
      <div className="visualization-content">
        <div className="viz-bar">
          <div 
            className="viz-indicator" 
            style={{ left: `${normalizedValue * 100}%` }}
          ></div>
        </div>
        <div className="word-cloud">
          {[...Array(4)].map((_, i) => (
            <span 
              key={i} 
              className="common-word" 
              style={{ 
                fontSize: `${14 - (i * 1)}px`,
                opacity: normalizedValue > 0.5 ? 1 : 0.5 + (normalizedValue * 0.5),
                backgroundColor: `rgba(66, 133, 244, ${0.2 - (i * 0.05)})`,
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              Common {i+1}
            </span>
          ))}
          {[...Array(4)].map((_, i) => (
            <span 
              key={i} 
              className="rare-word" 
              style={{ 
                fontSize: `${11 - (i * 0.5)}px`,
                opacity: normalizedValue > 0.7 ? 0.8 - (i * 0.1) : 0.3 * normalizedValue,
                backgroundColor: `rgba(219, 68, 55, ${0.15 - (i * 0.03)})`,
                padding: '4px 6px',
                borderRadius: '4px',
              }}
            >
              Rare {i+1}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Top K visualization (limit vocabulary)
  const renderTopKVisualization = (k: number) => {
    const normalizedValue = k / 100; // Assuming max is 100
    return (
      <div className="visualization-content">
        <div className="viz-bar">
          <div 
            className="viz-indicator" 
            style={{ left: `${normalizedValue * 100}%` }}
          ></div>
        </div>
        <div className="token-boxes" style={{ justifyContent: 'center' }}>
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="token-box" 
              style={{ 
                backgroundColor: i < normalizedValue * 10 
                  ? `rgba(66, 133, 244, ${0.8 - (i * 0.07)})` 
                  : '#e0e0e0',
                transform: `scale(${1 - (i * 0.05)})`,
                opacity: i < normalizedValue * 10 ? 1 : 0.5
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  // Generic visualization for custom parameters
  const renderGenericVisualization = (genericValue: number) => {
    // Normalize to 0-1 range assuming value is between 0-100
    const normalizedValue = genericValue / 100;
    return (
      <div className="visualization-content">
        <div className="viz-bar">
          <div 
            className="viz-indicator" 
            style={{ left: `${normalizedValue * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="parameter-visualization">
      <div className="viz-label">Visual Effect:</div>
      {renderVisualization()}
    </div>
  );
};

export default ParameterVisualization;
