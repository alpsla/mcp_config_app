import React from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';
import ParametersStep from '../steps/ParametersStep';
import ProgressBar from './ProgressBar';

const SubscriptionParametersRedirect: React.FC = () => {
  // Color scheme
  const color = '#1976D2'; // Blue accent color
  const lightColor = '#E3F2FD';
  
  // Get tier from URL parameters
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '');
  const planParam = searchParams.get('plan') || 'basic';
  const tier = (planParam === 'complete' || planParam === 'basic') ? planParam as SubscriptionTierSimple : 'basic';
  
  // Handle navigation
  const handleNext = (data: any) => {
    console.log('Parameters data to be stored:', data);
    window.location.hash = '#/subscribe/payment';
  };
  
  const handleBack = () => {
    window.location.hash = '#/subscribe/interests';
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px', 
      margin: '30px auto',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${lightColor}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '8px',
        background: `linear-gradient(to right, ${color}, ${color}cc)`
      }}></div>
      
      {/* Progress Bar */}
      <ProgressBar currentStep={4} />
      
      <ParametersStep
        selectedTier={tier}
        initialData={{
          temperature: undefined,
          maxLength: undefined,
          topP: undefined,
          topK: undefined,
          hfToken: undefined
        }}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default SubscriptionParametersRedirect;