import React from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import './StepIndicator.css';

interface StepIndicatorProps {
  currentStep: string;
  tier: SubscriptionTierSimple;
}

interface StepConfig {
  name: string;
  label: string;
  number: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, tier }) => {
  // Define the steps in the subscription flow
  const steps: StepConfig[] = [
    { name: 'welcome', label: 'Welcome', number: 1 },
    { name: 'profile', label: 'Profile', number: 2 },
    { name: 'interests', label: 'Interests', number: 3 },
    { name: 'parameters', label: 'Parameters', number: 4 },
    { name: 'payment', label: 'Payment', number: 5 },
    { name: 'success', label: 'Success', number: 6 }
  ];
  
  // Get the color based on the tier
  const color = tier === 'complete' ? '#673AB7' : '#1976D2';
  
  return (
    <div className="step-indicator">
      <div className="step-indicators-container">
        {steps.map((step) => {
          const isActive = currentStep === step.name;
          
          // Determine if the step is before or after the current step
          const currentStepIndex = steps.findIndex(s => s.name === currentStep);
          const stepIndex = steps.findIndex(s => s.name === step.name);
          const isPast = stepIndex < currentStepIndex;
          
          return (
            <div key={step.name} className="step-item">
              <div 
                className={`step-circle ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                style={{ 
                  backgroundColor: isActive ? color : (isPast ? '#E0E0E0' : '#E0E0E0'),
                  color: isActive ? '#FFF' : (isPast ? '#666' : '#666')
                }}
              >
                {step.number}
              </div>
              <div 
                className={`step-label ${isActive ? 'active' : ''}`}
                style={{ 
                  color: isActive ? '#333' : '#666',
                  fontWeight: isActive ? 'bold' : 'normal'
                }}
              >
                {step.label}
              </div>
              
              {/* Show a connecting line between steps except for the last step */}
              {stepIndex < steps.length - 1 && (
                <div 
                  className="step-connector" 
                  style={{ 
                    backgroundColor: isPast ? '#E0E0E0' : '#E0E0E0'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;