import React from 'react';
import ProgressBar from './ProgressBar';
import ProfileStep from '../steps/ProfileStep';

const SubscriptionProfile: React.FC = () => {
  // Use green as the accent color for this step
  const color = '#34A853';
  const lightColor = '#E8F5E9';
  
  // Handle navigation and data passing
  const handleNext = (data: any) => {
    // Store data if needed before navigation
    console.log('Profile data to be stored:', data);
    
    // Navigate to the next step
    window.location.hash = '#/subscribe/interests';
  };
  
  const handleBack = () => {
    window.location.hash = '#/subscribe';
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
      <ProgressBar currentStep={2} />
      
      {/* Use the ProfileStep component */}
      <ProfileStep
        initialData={{
          firstName: '',
          lastName: '',
          displayName: '',
          company: '',
          role: ''
        }}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default SubscriptionProfile;