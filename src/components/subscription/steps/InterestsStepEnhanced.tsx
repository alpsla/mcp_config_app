import React, { useState } from 'react';
import '../SubscriptionFlow.css';
import './buttons.css';

// Define theme colors for Interests step
const THEME = {
  primary: '#673AB7', // Purple for interests theme
  secondary: '#F3E5F5', // Light purple
  accent: '#9C27B0',
  text: '#333333',
  border: '#D1C4E9',
  cardBg: '#F9F5FD',
  selectedBg: '#EDE7F6',
  selectedBorder: '#673AB7'
};

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

  // Add "Other" to the interests list
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
  };
  
  // Handle input change for "Other" interest text field
  const handleOtherInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestsData(prev => ({
      ...prev,
      otherInterest: e.target.value
    }));
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

  // Handle next button click - include otherInterest in the data passed to parent
  const handleNext = () => {
    // Create a copy of the data without the otherInterest field
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

  // Custom styling for inputs
  const customStyles = {
    container: {
      backgroundColor: THEME.secondary,
      borderRadius: '12px',
      padding: '40px 30px 30px',
      borderLeft: `3px solid ${THEME.primary}`, // Thinner border for a more subtle look
      boxShadow: `0 0 20px rgba(103, 58, 183, 0.08)`, // Subtle shadow with the theme color
      margin: '20px auto',
      maxWidth: '900px',
      boxSizing: 'border-box' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      textAlign: 'center' as const,
      marginBottom: '30px'
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      backgroundColor: THEME.primary,
      color: 'white',
      fontSize: '36px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '3px solid white'
    },
    title: {
      margin: '0 0 10px 0',
      fontSize: '28px',
      fontWeight: 600,
      color: THEME.primary
    },
    description: {
      maxWidth: '500px',
      fontSize: '16px',
      lineHeight: 1.5,
      color: '#555',
      margin: '0'
    },
    formContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '25px',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)'
    },
    sectionTitle: {
      color: THEME.primary,
      marginBottom: '10px',
      fontSize: '18px',
      fontWeight: 500
    },
    sectionHint: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '20px'
    },
    interestsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: '12px',
      marginBottom: '30px'
    },
    interestCheckbox: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 15px',
      backgroundColor: 'white',
      border: `1px solid ${THEME.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    interestSelected: {
      backgroundColor: THEME.selectedBg,
      borderColor: THEME.selectedBorder,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',  // Lift the card slightly when selected
      fontWeight: 500                 // Make text slightly bolder
    },
    checkboxIcon: {
      marginRight: '10px',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px'
    },
    useCasesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
      gap: '12px',
      marginBottom: '30px'
    },
    useCaseCard: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 15px',
      backgroundColor: 'white',
      border: `1px solid ${THEME.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    useCaseSelected: {
      backgroundColor: THEME.selectedBg,
      borderColor: THEME.selectedBorder,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',  // Lift the card slightly when selected
      fontWeight: 500                 // Make text slightly bolder
    },
    radioIcon: {
      marginRight: '10px',
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px'
    },
    experienceLevelsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    },
    experienceLevelCard: {
      padding: '20px',
      backgroundColor: 'white',
      border: `1px solid ${THEME.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column' as const
    },
    experienceLevelSelected: {
      backgroundColor: THEME.selectedBg,
      borderColor: THEME.selectedBorder,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',  // Lift the card slightly when selected
    },
    levelHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px'
    },
    levelIcon: {
      marginRight: '10px',
      fontSize: '20px'
    },
    levelName: {
      fontWeight: 600,
      fontSize: '16px',
      color: THEME.text
    },
    levelDescription: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px'
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #eee',
      width: '100%',
      marginBottom: '20px'
    },
    // Using the existing button styles instead of custom ones
    buttonBack: undefined,
    buttonNext: undefined
  };

  return (
    <div style={customStyles.container}>
      {/* Header Section */}
      <div style={customStyles.headerContainer}>
        <div style={customStyles.iconContainer}>
          <span role="img" aria-label="interests" style={{ lineHeight: 1 }}>🔍</span>
        </div>
        <h2 style={customStyles.title}>Interests & Use Cases</h2>
        <p style={customStyles.description}>
          Help us understand how you plan to use AI so we can provide better recommendations
        </p>
      </div>

      {/* Content Section */}
      <div style={customStyles.formContainer}>
        {/* Interests Section */}
        <div>
          <h3 style={customStyles.sectionTitle}>What AI capabilities are you interested in?</h3>
          <p style={customStyles.sectionHint}>Select all that apply</p>
          
          <div style={customStyles.interestsGrid}>
            {availableInterests.map(interest => {
              const isSelected = interestsData.interests.includes(interest.id);
              return (
                <label 
                  key={interest.id} 
                  htmlFor={`interest-${interest.id}`}
                  style={{
                    ...customStyles.interestCheckbox,
                    ...(isSelected ? customStyles.interestSelected : {})
                  }}
                >
                  <span style={customStyles.checkboxIcon}>{interest.icon}</span>
                  <input
                    type="checkbox"
                    id={`interest-${interest.id}`}
                    value={interest.id}
                    checked={isSelected}
                    onChange={handleInterestChange}
                    style={{ display: 'none' }}
                  />
                  {interest.label}
                </label>
              );
            })}
          </div>
          
          {/* Additional input field if "Other" is selected */}
          {interestsData.interests.includes('other') && (
            <div style={{ marginTop: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Tell us about your other interest"
                value={interestsData.otherInterest}
                onChange={handleOtherInterestChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: `1px solid ${THEME.border}`,
                  fontSize: '15px'
                }}
              />
            </div>
          )}
        </div>

        {/* Use Cases Section */}
        <div>
          <h3 style={customStyles.sectionTitle}>What's your primary use case?</h3>
          <p style={customStyles.sectionHint}>Select your main purpose for using this tool</p>
          
          <div style={customStyles.useCasesGrid}>
            {useCases.map(useCase => {
              const isSelected = interestsData.primaryUseCase === useCase.id;
              return (
                <label 
                  key={useCase.id} 
                  htmlFor={`use-case-${useCase.id}`}
                  style={{
                    ...customStyles.useCaseCard,
                    ...(isSelected ? customStyles.useCaseSelected : {})
                  }}
                >
                  <span style={customStyles.radioIcon}>{useCase.icon}</span>
                  <input
                    type="radio"
                    id={`use-case-${useCase.id}`}
                    name="primaryUseCase"
                    value={useCase.id}
                    checked={isSelected}
                    onChange={handleUseCaseChange}
                    style={{ display: 'none' }}
                  />
                  {useCase.label}
                </label>
              );
            })}
          </div>
        </div>

        {/* Experience Level Section */}
        <div>
          <h3 style={customStyles.sectionTitle}>What's your experience level with AI tools?</h3>
          
          <div style={customStyles.experienceLevelsGrid}>
            {experienceLevels.map(level => {
              const isSelected = interestsData.experienceLevel === level.id;
              return (
                <label 
                  key={level.id}
                  htmlFor={`exp-${level.id}`}
                  style={{
                    ...customStyles.experienceLevelCard,
                    ...(isSelected ? customStyles.experienceLevelSelected : {})
                  }}
                >
                  <div style={customStyles.levelHeader}>
                    <span style={customStyles.levelIcon}>{level.icon}</span>
                    <div style={customStyles.levelName}>{level.label}</div>
                  </div>
                  <input
                    type="radio"
                    id={`exp-${level.id}`}
                    name="experienceLevel"
                    value={level.id}
                    checked={isSelected}
                    onChange={handleExperienceLevelChange}
                    style={{ display: 'none' }}
                  />
                  <div style={customStyles.levelDescription}>{level.description}</div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons - Using updated button styles from buttons.css */}
      <div className="navigation-buttons">
        <button
          type="button"
          className="button-cancel"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="button-continue"
          onClick={handleNext}
          style={{
            backgroundColor: THEME.primary
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InterestsStepEnhanced;