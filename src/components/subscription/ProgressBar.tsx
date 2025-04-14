import React from 'react';
// Import CSS using a more explicit method
import './ProgressBar.css';

interface ProgressBarProps {
  currentStep: number;
  steps: string[]; // Array of step names
}

/**
 * A dedicated React component for rendering the subscription progress bar
 * This component renders the steps with appropriate styling based on the current step
 * No DOM manipulation is performed - everything is handled through React's rendering
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps }) => {
  // Log the props to help with debugging
  React.useEffect(() => {
    console.log('ProgressBar rendered with:', { currentStep, steps });
  }, [currentStep, steps]);
  
  return (
    <div className="subscription-progress">
      {/* This creates the connecting line behind the steps */}
      <div className="progress-bar-line"></div>
      
      {/* Map through all steps and render them with appropriate styling */}
      {steps.map((stepName, index) => (
        <div 
          key={index}
          className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
        >
          <div className="step-number">
            {index < currentStep ? (
              // Checkmark for completed steps
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              // Number for current and future steps
              index + 1
            )}
          </div>
          <div className="step-name">{stepName}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;