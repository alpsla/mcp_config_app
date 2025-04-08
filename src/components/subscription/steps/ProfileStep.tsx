import React, { useState, useEffect } from 'react';
import '../SubscriptionFlow.css';

interface ProfileStepProps {
  initialData: {
    firstName: string;
    lastName: string;
    displayName: string;
    company: string;
    role: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({
  initialData,
  onNext,
  onBack
}) => {
  // Safely initialize data with defaults and console log for debugging
  const [profileData, setProfileData] = useState(() => {
    console.log('ProfileStep initializing with data:', initialData);
    return {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      displayName: initialData?.displayName || '',
      company: initialData?.company || '',
      role: initialData?.role || ''
    };
  });
  
  // Log when initialData changes
  useEffect(() => {
    console.log('ProfileStep initialData changed:', initialData);
    if (initialData) {
      setProfileData({
        firstName: initialData.firstName || profileData.firstName,
        lastName: initialData.lastName || profileData.lastName,
        displayName: initialData.displayName || profileData.displayName,
        company: initialData.company || profileData.company,
        role: initialData.role || profileData.role
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(profileData);
    }
  };
  
  // Fix profile step navigation - ensure buttons are displayed
  useEffect(() => {
    // Force buttons to be visible
    const fixButtons = () => {
      console.log('ProfileStep: Ensuring button visibility');
      
      // Get the button container by class or by ID
      let actionContainer = document.querySelector('.step-actions') || 
                           document.getElementById('profile-buttons-container');
      
      // If not found, the component might not be fully rendered yet
      if (!actionContainer) {
        console.log('ProfileStep: Button container not found, will retry');
        return; // Will retry on next timer
      }
      
      console.log('ProfileStep: Found button container, applying fixes');
      
      // Add class and force visibility with high specificity styles
      actionContainer.classList.add('profile-fixed-buttons');
      actionContainer.setAttribute('style', 
        'display: flex !important; ' + 
        'visibility: visible !important; ' + 
        'opacity: 1 !important; ' + 
        'position: relative !important; ' + 
        'z-index: 9999 !important; ' +
        'width: 100% !important; ' +
        'justify-content: space-between !important; ' + 
        'padding-top: 20px !important; ' + 
        'margin-top: 30px !important; ' + 
        'border-top: 1px solid #e0e0e0 !important;'
      );
      
      // Fix the buttons too - extra specificity
      const buttons = actionContainer.querySelectorAll('button');
      if (buttons.length === 0) {
        console.log('ProfileStep: No buttons found in container');
      } else {
        console.log('ProfileStep: Fixing', buttons.length, 'buttons');
        buttons.forEach((button, index) => {
          // Add IDs if missing
          if (index === 0 && !button.id) button.id = 'profile-back-button';
          if (index === 1 && !button.id) button.id = 'profile-next-button';
          
          // Apply styles with high specificity
          button.setAttribute('style',
            'display: inline-block !important; ' +
            'visibility: visible !important; ' +
            'opacity: 1 !important; ' +
            'position: relative !important; ' +
            'z-index: 9999 !important; ' +
            'min-width: 150px !important; ' +
            'padding: 12px 24px !important; ' +
            'border-radius: 4px !important; ' +
            'cursor: pointer !important; ' +
            'font-weight: 600 !important; ' +
            'font-size: 16px !important; ' +
            `background-color: ${index === 0 ? '#f2f2f2' : '#4285F4'} !important; ` +
            `color: ${index === 0 ? '#333' : 'white'} !important; ` +
            `border: ${index === 0 ? '1px solid #ddd' : 'none'} !important; ` +
            `${index === 1 ? 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;' : ''}`
          );
        });
      }
    };
    
    // Apply multiple times to ensure visibility
    fixButtons();
    const timer1 = setTimeout(fixButtons, 100);
    const timer2 = setTimeout(fixButtons, 500);
    const timer3 = setTimeout(fixButtons, 1000);
    const timer4 = setTimeout(fixButtons, 2000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Add a special function to ensure progress bar shows correctly
  useEffect(() => {
    // This will check for and fix missing progress bar steps
    const ensureProgressSteps = () => {
      console.log('ProfileStep: Checking progress steps...');
      
      // Find the progress bar
      const progressBar = document.querySelector('.subscription-progress');
      if (!progressBar) {
        console.log('ProfileStep: No progress bar found yet');
        return; // Will retry on next timer
      }
      
      // Check how many steps are visible
      const steps = progressBar.querySelectorAll('.progress-step');
      console.log(`ProfileStep: Found ${steps.length} progress steps`);
      
      // If we don't have all 6 steps, we need to fix it
      if (steps.length < 6) {
        console.log('ProfileStep: Missing steps, need to fix the progress bar');
        
        // The required step names in order
        const requiredSteps = ['Welcome', 'Profile', 'Interests', 'Parameters', 'Payment', 'Success'];
        
        // Clear and recreate all steps
        progressBar.innerHTML = '';
        
        // Create line underneath steps
        const progressLine = document.createElement('div');
        progressLine.style.position = 'absolute';
        progressLine.style.top = '16px';
        progressLine.style.left = '0';
        progressLine.style.right = '0';
        progressLine.style.height = '2px';
        progressLine.style.backgroundColor = '#e0e0e0';
        progressLine.style.zIndex = '1';
        progressBar.appendChild(progressLine);
        
        // Create each step
        requiredSteps.forEach((stepName, index) => {
          // Determine step state (Welcome completed, Profile active)
          const isCompleted = index < 1;
          const isActive = index === 1;
          
          // Create step div
          const stepDiv = document.createElement('div');
          stepDiv.className = `progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
          stepDiv.style.display = 'flex';
          stepDiv.style.flexDirection = 'column';
          stepDiv.style.alignItems = 'center';
          stepDiv.style.position = 'relative';
          stepDiv.style.zIndex = '2';
          stepDiv.style.flex = '1';
          stepDiv.style.minWidth = '80px';
          stepDiv.style.marginBottom = '10px';
          stepDiv.style.visibility = 'visible';
          stepDiv.style.opacity = '1';
          
          // Create step number circle
          const numberDiv = document.createElement('div');
          numberDiv.className = 'step-number';
          numberDiv.style.width = '32px';
          numberDiv.style.height = '32px';
          numberDiv.style.borderRadius = '50%';
          numberDiv.style.display = 'flex';
          numberDiv.style.alignItems = 'center';
          numberDiv.style.justifyContent = 'center';
          numberDiv.style.marginBottom = '0.5rem';
          numberDiv.style.fontWeight = '600';
          numberDiv.style.border = '2px solid #fff';
          numberDiv.style.visibility = 'visible';
          numberDiv.style.opacity = '1';
          
          if (isActive) {
            numberDiv.style.backgroundColor = '#4285f4';
            numberDiv.style.color = 'white';
            numberDiv.textContent = (index + 1).toString();
          } else if (isCompleted) {
            numberDiv.style.backgroundColor = '#34a853';
            numberDiv.style.color = 'white';
            numberDiv.innerHTML = '✓';
          } else {
            numberDiv.style.backgroundColor = '#e0e0e0';
            numberDiv.style.color = '#757575';
            numberDiv.textContent = (index + 1).toString();
          }
          
          // Create step name
          const nameDiv = document.createElement('div');
          nameDiv.className = 'step-name';
          nameDiv.textContent = stepName;
          nameDiv.style.fontSize = '0.85rem';
          nameDiv.style.color = isActive ? '#4285f4' : (isCompleted ? '#34a853' : '#757575');
          nameDiv.style.textAlign = 'center';
          nameDiv.style.visibility = 'visible';
          nameDiv.style.opacity = '1';
          nameDiv.style.display = 'block';
          nameDiv.style.fontWeight = isActive ? '600' : 'normal';
          
          // Add to step div
          stepDiv.appendChild(numberDiv);
          stepDiv.appendChild(nameDiv);
          
          // Add to progress bar
          progressBar.appendChild(stepDiv);
        });
        
        console.log('ProfileStep: Fixed progress bar with all steps');
      }
    };
    
    // Run immediately and set up timers to check again after DOM updates
    ensureProgressSteps();
    const timer1 = setTimeout(ensureProgressSteps, 100);
    const timer2 = setTimeout(ensureProgressSteps, 500);
    const timer3 = setTimeout(ensureProgressSteps, 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  
  return (
    <div className="subscription-step">
      <h2>Profile Information</h2>
      <p className="step-description">
        Tell us a bit about yourself to personalize your experience
      </p>

      <form className="subscription-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? 'error' : ''}
              placeholder="Your first name"
            />
            {errors.firstName && (
              <div className="error-message">{errors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? 'error' : ''}
              placeholder="Your last name"
            />
            {errors.lastName && (
              <div className="error-message">{errors.lastName}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="displayName">
            Display Name (Optional)
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profileData.displayName}
            onChange={handleInputChange}
            placeholder="How you'd like to be addressed in the app"
          />
          <div className="helper-text">
            This is how we'll address you in the application
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">
              Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={profileData.company}
              onChange={handleInputChange}
              placeholder="Your company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Role (Optional)
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={profileData.role}
              onChange={handleInputChange}
              placeholder="Your role or position"
            />
          </div>
        </div>
      </form>
      
      <div 
        id="profile-buttons-container"
        className="step-actions button-container navigation-buttons"
        style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0',
          width: '100%',
          position: 'relative',
          zIndex: 1000,
          visibility: 'visible',
          opacity: 1
        }}
      >
        <button 
          id="profile-back-button"
          type="button"
          className="secondary-button button-cancel"
          style={{
            padding: '12px 24px',
            backgroundColor: '#f2f2f2',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            minWidth: '150px',
            fontSize: '16px',
            display: 'inline-block',
            visibility: 'visible',
            opacity: 1,
            position: 'relative',
            zIndex: 1001
          }}
          onClick={onBack}
        >
          Back
        </button>
        
        <button 
          id="profile-next-button"
          type="button"
          className="primary-button basic button-continue"
          style={{
            padding: '12px 24px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            minWidth: '150px',
            fontSize: '16px',
            display: 'inline-block',
            visibility: 'visible',
            opacity: 1,
            position: 'relative',
            zIndex: 1001
          }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileStep;
