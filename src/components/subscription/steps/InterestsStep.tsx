import React, { useState } from 'react';
import '../SubscriptionFlow.css';
import './buttons.css';

interface InterestsStepProps {
  initialData: {
    interests: string[];
    primaryUseCase: string;
    experienceLevel: string;
  };
  onNext: (data: any) => void;
  onBack: () => void;
}

const InterestsStep: React.FC<InterestsStepProps> = ({
  initialData,
  onNext,
  onBack
}) => {
  const [interestsData, setInterestsData] = useState({
    interests: initialData.interests || [],
    primaryUseCase: initialData.primaryUseCase || '',
    experienceLevel: initialData.experienceLevel || 'intermediate'
  });

  // Available interests categories
  const availableInterests = [
    { id: 'text-generation', label: 'Text Generation' },
    { id: 'image-generation', label: 'Image Generation' },
    { id: 'audio-transcription', label: 'Audio Transcription' },
    { id: 'code-assistance', label: 'Coding Assistance' },
    { id: 'data-analysis', label: 'Data Analysis' },
    { id: 'content-summarization', label: 'Content Summarization' },
    { id: 'document-qa', label: 'Document Q&A' },
    { id: 'semantic-search', label: 'Semantic Search' },
    { id: 'video-generation', label: 'Video Generation' }
  ];

  // Use cases
  const useCases = [
    { id: 'personal-assistant', label: 'Personal Assistant' },
    { id: 'content-creation', label: 'Content Creation' },
    { id: 'research', label: 'Research' },
    { id: 'software-development', label: 'Software Development' },
    { id: 'education', label: 'Education & Learning' },
    { id: 'business', label: 'Business & Professional' },
    { id: 'creative', label: 'Creative Projects' }
  ];

  // Experience levels
  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', description: 'New to AI assistants and tools' },
    { id: 'intermediate', label: 'Intermediate', description: 'Familiar with basic AI concepts' },
    { id: 'advanced', label: 'Advanced', description: 'Experienced with AI systems & models' }
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
  };

  // Handle radio button change for primary use case
  const handleUseCaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsData(prev => ({
      ...prev,
      primaryUseCase: e.target.value
    }));
  };

  // Handle radio button change for experience level
  const handleExperienceLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsData(prev => ({
      ...prev,
      experienceLevel: e.target.value
    }));
  };

  // Handle next button click
  const handleNext = () => {
    onNext(interestsData);
  };

  return (
    <div className="subscription-step interests-step" style={{ backgroundColor: '#fff', color: '#333' }}>
      <h2>Interests & Use Cases</h2>
      <p className="step-description">
        Help us understand how you plan to use the tool so we can provide better recommendations
      </p>

      <div className="interests-form">
        <div className="form-section">
          <h3>What AI capabilities are you interested in?</h3>
          <p className="section-hint">Select all that apply</p>
          
          <div className="interests-grid">
            {availableInterests.map(interest => (
              <div key={interest.id} className="interest-checkbox">
                <input
                  type="checkbox"
                  id={`interest-${interest.id}`}
                  value={interest.id}
                  checked={interestsData.interests.includes(interest.id)}
                  onChange={handleInterestChange}
                />
                <label htmlFor={`interest-${interest.id}`}>
                  {interest.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>What's your primary use case?</h3>
          <p className="section-hint">Select your main purpose for using this tool</p>
          
          <div className="use-cases-grid">
            {useCases.map(useCase => (
              <div key={useCase.id} className="use-case-radio">
                <input
                  type="radio"
                  id={`use-case-${useCase.id}`}
                  name="primaryUseCase"
                  value={useCase.id}
                  checked={interestsData.primaryUseCase === useCase.id}
                  onChange={handleUseCaseChange}
                />
                <label htmlFor={`use-case-${useCase.id}`}>
                  {useCase.label}
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
                  <div className="level-name">{level.label}</div>
                  <div className="level-description">{level.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="step-actions">
        <div className="button-container">
          <button
            type="button"
            className="secondary-button"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="button"
            className="primary-button basic"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestsStep;
