import React, { useState, useEffect } from 'react';
import '../SubscriptionFlow.css';

// Add a direct fix for the progress bar steps
const fixProgressBarOnce = () => {
  console.log('ProfileStep: Running progress bar fix');
  
  // Find the progress bar  
  const progressBar = document.querySelector('.subscription-progress');
  if (!progressBar) return;
  
  // Check if we already have all steps
  const steps = progressBar.querySelectorAll('.progress-step');
  const stepNames = Array.from(steps).map(step => {
    const nameEl = step.querySelector('.step-name');
    return nameEl ? nameEl.textContent : null;
  }).filter(Boolean);
  
  // Only fix if we're missing the Interests or Parameters steps
  if (stepNames.includes('Interests') && stepNames.includes('Parameters')) {
    console.log('ProfileStep: No fix needed - all steps present');
    return;
  }
  
  console.log('ProfileStep: Missing steps, rebuilding progress bar');
  
  // Define all required steps
  const requiredSteps = [
    { name: 'Welcome', completed: true, active: false },
    { name: 'Profile', completed: false, active: true },
    { name: 'Interests', completed: false, active: false },
    { name: 'Parameters', completed: false, active: false },
    { name: 'Payment', completed: false, active: false },
    { name: 'Success', completed: false, active: false }
  ];
  
  // Clear the progress bar
  progressBar.innerHTML = '';
  
  // Create the connecting line
  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.top = '16px';
  line.style.left = '0';
  line.style.right = '0';
  line.style.height = '2px';
  line.style.backgroundColor = '#e0e0e0';
  line.style.zIndex = '1';
  progressBar.appendChild(line);
  
  // Create all steps
  requiredSteps.forEach((step, index) => {
    // Create step element
    const stepDiv = document.createElement('div');
    stepDiv.className = `progress-step ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`;
    stepDiv.style.display = 'flex';
    stepDiv.style.flexDirection = 'column';
    stepDiv.style.alignItems = 'center';
    stepDiv.style.position = 'relative';
    stepDiv.style.zIndex = '2';
    stepDiv.style.flex = '1';
    stepDiv.style.minWidth = '80px';
    stepDiv.style.marginBottom = '10px';
    
    // Create number element
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
    
    if (step.completed) {
      numberDiv.innerHTML = '✓';
      numberDiv.style.backgroundColor = '#34a853';
      numberDiv.style.color = 'white';
    } else if (step.active) {
      numberDiv.textContent = (index + 1).toString();
      numberDiv.style.backgroundColor = '#4285f4';
      numberDiv.style.color = 'white';
    } else {
      numberDiv.textContent = (index + 1).toString();
      numberDiv.style.backgroundColor = '#e0e0e0';
      numberDiv.style.color = '#757575';
    }
    
    // Create name element
    const nameDiv = document.createElement('div');
    nameDiv.className = 'step-name';
    nameDiv.textContent = step.name;
    nameDiv.style.fontSize = '0.85rem';
    nameDiv.style.textAlign = 'center';
    
    if (step.active) {
      nameDiv.style.color = '#4285f4';
      nameDiv.style.fontWeight = '600';
    } else if (step.completed) {
      nameDiv.style.color = '#34a853';
    } else {
      nameDiv.style.color = '#757575';
    }
    
    // Add elements to step
    stepDiv.appendChild(numberDiv);
    stepDiv.appendChild(nameDiv);
    
    // Add step to progress bar
    progressBar.appendChild(stepDiv);
  });
  
  console.log('ProfileStep: Progress bar rebuilt with all steps');
};

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
      setProfileData(prevData => ({
        ...prevData,
        firstName: initialData.firstName || prevData.firstName,
        lastName: initialData.lastName || prevData.lastName,
        displayName: initialData.displayName || prevData.displayName,
        company: initialData.company || prevData.company,
        role: initialData.role || prevData.role
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  
  // Run the progress bar fix after the component mounts
  useEffect(() => {
    // Wait for rendering to complete
    setTimeout(() => {
      fixProgressBarOnce();
    }, 100);
  }, []);


  // Add code to execute when the component mounts
  useEffect(() => {
    // Set up a MutationObserver to watch for changes to the DOM
    const observer = new MutationObserver((mutations) => {
      // On any DOM change, check if we need to fix the progress bar
      ensureProgressSteps();
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the fix function immediately
    ensureProgressSteps();

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []);

  // Function to ensure the progress bar has all required steps
  const ensureProgressSteps = () => {
    // Find the progress bar
    const progressBar = document.querySelector('.subscription-progress');
    if (!progressBar) {
      console.log('Progress bar not found');
      return;
    }

    // Required steps in the correct order
    const requiredSteps = ['Welcome', 'Profile', 'Interests', 'Parameters', 'Payment', 'Success'];
    
    // Replace all steps
    progressBar.innerHTML = '';

    // Add the progress line
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.top = '16px';
    line.style.left = '0';
    line.style.right = '0';
    line.style.height = '2px';
    line.style.backgroundColor = '#e0e0e0';
    line.style.zIndex = '1';
    progressBar.appendChild(line);

    // Create all steps
    requiredSteps.forEach((stepName, index) => {
      const isCompleted = index < 1; // Welcome is completed
      const isActive = index === 1;  // Profile is active

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

      // Step number
      const numberDiv = document.createElement('div');
      numberDiv.className = 'step-number';
      if (isCompleted) {
        numberDiv.innerHTML = '✓';
        numberDiv.style.backgroundColor = '#34a853';
        numberDiv.style.color = 'white';
      } else if (isActive) {
        numberDiv.textContent = (index + 1).toString();
        numberDiv.style.backgroundColor = '#4285f4';
        numberDiv.style.color = 'white';
      } else {
        numberDiv.textContent = (index + 1).toString();
        numberDiv.style.backgroundColor = '#e0e0e0';
        numberDiv.style.color = '#757575';
      }

      numberDiv.style.width = '32px';
      numberDiv.style.height = '32px';
      numberDiv.style.borderRadius = '50%';
      numberDiv.style.display = 'flex';
      numberDiv.style.alignItems = 'center';
      numberDiv.style.justifyContent = 'center';
      numberDiv.style.marginBottom = '0.5rem';
      numberDiv.style.fontWeight = '600';
      numberDiv.style.border = '2px solid #fff';

      // Step name
      const nameDiv = document.createElement('div');
      nameDiv.className = 'step-name';
      nameDiv.textContent = stepName;
      if (isActive) {
        nameDiv.style.color = '#4285f4';
        nameDiv.style.fontWeight = '600';
      } else if (isCompleted) {
        nameDiv.style.color = '#34a853';
      } else {
        nameDiv.style.color = '#757575';
      }
      nameDiv.style.fontSize = '0.85rem';
      nameDiv.style.textAlign = 'center';

      // Add to step
      stepDiv.appendChild(numberDiv);
      stepDiv.appendChild(nameDiv);

      // Add to progress bar
      progressBar.appendChild(stepDiv);
    });

    console.log('Progress bar updated with all steps');
  };
  
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
