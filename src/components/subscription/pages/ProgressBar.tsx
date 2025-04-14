import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

/**
 * A simple progress bar component for the subscription flow
 * Shows all 6 steps: Welcome, Profile, Interests, Parameters, Payment, Success
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  // Step configuration
  const steps = [
    { name: 'Welcome', step: 1 },
    { name: 'Profile', step: 2 },
    { name: 'Interests', step: 3 },
    { name: 'Parameters', step: 4 },
    { name: 'Payment', step: 5 },
    { name: 'Success', step: 6 }
  ];
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {steps.map((step, index) => {
          const isActive = currentStep === step.step;
          const isCompleted = currentStep > step.step;
          
          return (
            <React.Fragment key={step.step}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#34A853' : (isCompleted ? '#34A853' : '#E0E0E0'),
                color: isActive || isCompleted ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                marginRight: '10px'
              }}>
                {isCompleted ? (
                  // Checkmark for completed steps
                  <span>✓</span>
                ) : (
                  // Step number
                  step.step
                )}
              </div>
              <div style={{
                color: isActive ? '#333' : '#666',
                fontSize: '14px',
                fontWeight: isActive ? 'bold' : 'normal',
                marginRight: index < steps.length - 1 ? '20px' : '0'
              }}>
                {step.name}
              </div>
              
              {/* Add a separator between steps */}
              {index < steps.length - 1 && (
                <div style={{
                  width: '20px',
                  height: '1px',
                  backgroundColor: '#E0E0E0',
                  margin: '0 10px'
                }}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;