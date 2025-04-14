import React, { useState, useEffect } from 'react';
import '../SubscriptionFlow.css';
import './ProfileStep.css';

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

/**
 * ProfileStep Component
 * 
 * A clean React component for the profile step of the subscription flow.
 * This component handles user profile data collection in a standard React way.
 */
const ProfileStep: React.FC<ProfileStepProps> = ({
  initialData,
  onNext,
  onBack
}) => {
  // Safely initialize data with defaults
  const [profileData, setProfileData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    displayName: initialData?.displayName || '',
    company: initialData?.company || '',
    role: initialData?.role || ''
  });
  
  // Log when component renders
  useEffect(() => {
    console.log('ProfileStep rendered');
  }, []);
  
  // Update from props if they change
  useEffect(() => {
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

  // Validate on blur to provide immediate feedback
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'firstName' && !value.trim()) {
      setErrors(prev => ({
        ...prev,
        firstName: 'First name is required'
      }));
    } else if (name === 'lastName' && !value.trim()) {
      setErrors(prev => ({
        ...prev,
        lastName: 'Last name is required'
      }));
    }
  };

  // Handle next button click
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate the form
    const isValid = validateForm();
    
    // Add visual feedback by scrolling to the first error if validation fails
    if (!isValid) {
      // Find the first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          // Scroll to the error field with a small offset
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Focus the error field
          errorElement.focus();
        }
      }
      return; // Prevent proceeding to next step
    }
    
    // Proceed to next step if validation passes
    onNext(profileData);
  };
  
  return (
    <div className="subscription-step">
      <h2>Your Profile Information</h2>
      <p className="step-description">
        Tell us a bit about yourself to help us personalize your experience and provide better support.
      </p>

      <form 
        className="subscription-form" 
        onSubmit={(e) => { 
          e.preventDefault(); 
          handleNext(e as any); 
        }}
      >
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
              onBlur={handleBlur}
              className={errors.firstName ? 'error' : ''}
              placeholder="Your first name"
              autoComplete="given-name"
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
              onBlur={handleBlur}
              className={errors.lastName ? 'error' : ''}
              placeholder="Your last name"
              autoComplete="family-name"
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
            autoComplete="nickname"
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
              autoComplete="organization"
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
              autoComplete="organization-title"
            />
          </div>
        </div>
      </form>
      
      <div className="privacy-notice">
        <div className="privacy-icon">🔒</div>
        <div className="privacy-text">
          Your privacy is important to us. The information you provide is secured and only used to enhance your experience. We never share your personal information with third parties without your consent.
        </div>
      </div>
      
      {/* Validation summary - only shown when there are errors */}
      {Object.keys(errors).length > 0 && (
        <div className="validation-summary">
          <div className="validation-icon">⚠️</div>
          <div className="validation-text">
            Please correct the highlighted fields before proceeding.
          </div>
        </div>
      )}
      
      <div className="step-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileStep;