import React, { useState, useEffect } from 'react';
import '../SubscriptionFlow.css';
import './buttons.css';
import './InterestsStepEnhanced.css';

interface InterestsStepProps {
  initialData: {
    interests: string[];
    primaryUseCase: string;
    experienceLevel: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const InterestsStepEnhanced: React.FC<InterestsStepProps> = ({
  initialData,
  onNext,
  onBack
}) => {
  const [interestsData, setInterestsData] = useState({
    interests: initialData.interests || [],
    primaryUseCase: initialData.primaryUseCase || '',
    experienceLevel: initialData.experienceLevel || 'intermediate',
    otherInterest: '' // Add field for "Other" interest text input
  });
  
  // Add error state
  const [error, setError] = useState<string>('');

  // One-time debugging log on mount
  useEffect(() => {
    console.log('InterestsStepEnhanced mounted');
    return () => {
      console.log('InterestsStepEnhanced unmounted');
    };
  }, []);

  // Available interests categories with icons
  const availableInterests = [
    { id: 'text-generation', label: 'Text Generation', icon: '📝' },
    { id: 'image-generation', label: 'Image Generation', icon: '🖼️' },
    { id: 'audio-transcription', label: 'Audio Transcription', icon: '🎤' },
    { id: 'code-assistance', label: 'Coding Assistance', icon: '💻' },
    { id: 'data-analysis', label: 'Data Analysis', icon: '📊' },
    { id: 'content-summarization', label: 'Content Summarization', icon: '📋' },
    { id: 'document-qa', label: 'Document Q&A', icon: '📄' },
    { id: 'semantic-search', label: 'Semantic Search', icon: '🔍' },
    { id: 'video-generation', label: 'Video Generation', icon: '🎬' },
    { id: 'other', label: 'Other', icon: '✨' }
  ];

  // Use cases with icons
  const useCases = [
    { id: 'personal-assistant', label: 'Personal Assistant', icon: '🤖' },
    { id: 'content-creation', label: 'Content Creation', icon: '✏️' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'software-development', label: 'Software Development', icon: '⚙️' },
    { id: 'education', label: 'Education & Learning', icon: '📚' },
    { id: 'business', label: 'Business & Professional', icon: '💼' },
    { id: 'creative', label: 'Creative Projects', icon: '🎨' }
  ];

  // Experience levels with icons
  const experienceLevels = [
    { 
      id: 'beginner', 
      label: 'Beginner', 
      description: 'New to AI assistants and tools',
      icon: '🌱'
    },
    { 
      id: 'intermediate', 
      label: 'Intermediate', 
      description: 'Familiar with basic AI concepts',
      icon: '🌿'
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      description: 'Experienced with AI systems & models',
      icon: '🌳'
    }
  ];

  // Handle checkbox change for interests
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setInterestsData(prev => ({
        ...prev,
        interests: [...prev.interests, value]
      }));
    } else {
      setInterestsData(prev => ({
        ...prev,
        interests: prev.interests.filter(interest => interest !== value)
      }));
    }
    
    // Clear error when selections change
    if (error) {
      setError('');
    }
  };
  
  // Handle input change for "Other" interest text field
  const handleOtherInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsData(prev => ({
      ...prev,
      otherInterest: e.target.value
    }));
    
    // Clear error when typing in other field
    if (error) {
      setError('');
    }
  };

  // Handle radio button change for primary use case
  const handleUseCaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsData(prev => ({
      ...prev,
      primaryUseCase: e.target.value
    }));
    
    // Clear error when use case changes
    if (error) {
      setError('');
    }
  };

  // Handle radio button change for experience level
  const handleExperienceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsData(prev => ({
      ...prev,
      experienceLevel: e.target.value
    }));
  };

  // Validate the form
  const validateForm = () => {
    // Check if at least one interest is selected
    if (interestsData.interests.length === 0) {
      setError('Please select at least one interest');
      return false;
    }
    
    // Check if "Other" is selected but no text is provided
    if (interestsData.interests.includes('other') && !interestsData.otherInterest.trim()) {
      setError('Please specify your other interest');
      return false;
    }
    
    // Check if primary use case is selected
    if (!interestsData.primaryUseCase) {
      setError('Please select a primary use case');
      return false;
    }
    
    // Clear any previous errors
    setError('');
    return true;
  };

  // Handle next button click - include otherInterest in the data passed to parent
  const handleNext = () => {
    // Validate the form first
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    
    // Create a copy of the data without the otherInterest field if not needed
    const { otherInterest, ...dataToSubmit } = interestsData;
    
    // If 'other' is selected and they provided text, add it to the submission
    const dataWithOther = {
      ...dataToSubmit,
      // Include otherInterest only if it's relevant
      ...(interestsData.interests.includes('other') && interestsData.otherInterest
        ? { otherInterest: interestsData.otherInterest }
        : {})
    };
    
    onNext(dataWithOther);
  };

  return (
    <div className="subscription-step interests-step" style={{ backgroundColor: '#fff', color: '#333' }}>
      <h2>Interests & Use Cases</h2>
      <p className="step-description">
        Help us understand how you plan to use AI so we can provide better recommendations
      </p>

      {/* Display error message if validation fails */}
      {error && (
        <div className="error-message" style={{
          color: '#D32F2F',
          backgroundColor: '#FEECEB',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      <div className="interests-form">
        <div className="form-section">
          <h3>What AI capabilities are you interested in?</h3>
          <p className="section-hint">Select all that apply</p>
          
          <div className="interests-grid">
            {availableInterests.map(interest => (
              <div key={interest.id} className={`interest-checkbox ${interestsData.interests.includes(interest.id) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  id={`interest-${interest.id}`}
                  value={interest.id}
                  checked={interestsData.interests.includes(interest.id)}
                  onChange={handleInterestChange}
                />
                <label htmlFor={`interest-${interest.id}`}>
                  <span className="interest-icon">{interest.icon}</span> {interest.label}
                </label>
              </div>
            ))}
          </div>
          
          {/* Additional input field when "Other" is selected */}
          {interestsData.interests.includes('other') && (
            <div className="other-interest-container">
              <input
                type="text"
                id="other-interest-input"
                placeholder="Tell us about your other interest"
                value={interestsData.otherInterest}
                onChange={handleOtherInterestChange}
                className="other-interest-input"
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>What's your primary use case?</h3>
          <p className="section-hint">Select your main purpose for using this tool</p>
          
          <div className="use-cases-grid">
            {useCases.map(useCase => (
              <div key={useCase.id} className={`use-case-radio ${interestsData.primaryUseCase === useCase.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id={`use-case-${useCase.id}`}
                  name="primaryUseCase"
                  value={useCase.id}
                  checked={interestsData.primaryUseCase === useCase.id}
                  onChange={handleUseCaseChange}
                />
                <label htmlFor={`use-case-${useCase.id}`}>
                  <span className="usecase-icon">{useCase.icon}</span> {useCase.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>What's your experience level with AI tools?</h3>
          
          <div className="experience-levels">
            {experienceLevels.map(level => (
              <div key={level.id} className={`experience-level-card ${interestsData.experienceLevel === level.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id={`exp-${level.id}`}
                  name="experienceLevel"
                  value={level.id}
                  checked={interestsData.experienceLevel === level.id}
                  onChange={handleExperienceLevelChange}
                />
                <label htmlFor={`exp-${level.id}`}>
                  <div className="level-header">
                    <span className="level-icon">{level.icon}</span>
                    <div className="level-name">{level.label}</div>
                  </div>
                  <div className="level-description">{level.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="navigation-buttons" style={{
        display: 'flex', 
        justifyContent: 'space-between',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <button
          type="button"
          className="button-cancel"
          onClick={onBack}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Back
        </button>
        <button
          type="button"
          className="button-continue"
          onClick={handleNext}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InterestsStepEnhanced;