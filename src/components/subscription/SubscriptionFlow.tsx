import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { enhancedConfigurationManager } from '../../services/EnhancedConfigurationManager';
import { SubscriptionTierSimple, mapSimpleTypeToTier } from '../../types/enhanced-types';
import { useSubscriptionContext, SubscriptionFlowProvider } from '../../contexts/SubscriptionFlowContext';

// Import step components
import WelcomeStep from './steps/WelcomeStep';
import ProfileStep from './steps/ProfileStep';
import InterestsStepEnhanced from './steps/InterestsStepEnhanced';
import PaymentStep from './steps/PaymentStep';
import ParametersStep from './steps/ParametersStep';
import SuccessStep from './steps/SuccessStep';

// Import styles
import './SubscriptionFlow.css';

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in subscription flow:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface SubscriptionFlowProps {
  onComplete?: () => void;
  onCancel?: () => void;
  initialTier?: SubscriptionTierSimple;
}

// Fallback component for error state
const SubscriptionError = ({ onCancel }: { onCancel?: () => void }) => {
  return (
    <div className="subscription-error">
      <h2>Something went wrong</h2>
      <p>We're sorry, but there was an error loading the subscription flow.</p>
      <button 
        className="secondary-button"
        onClick={() => {
          // Navigate back to dashboard if onCancel not provided
          if (onCancel) {
            onCancel();
          } else {
            window.location.hash = '#/dashboard';
          }
        }}
      >
        Return to Dashboard
      </button>
    </div>
  );
};

// Loading state component
const SubscriptionLoading = () => {
  return (
    <div className="subscription-loading">
      <div className="loading-spinner"></div>
      <p>Loading subscription options...</p>
    </div>
  );
};

// This is the wrapper component that provides the context
const SubscriptionFlowWithProvider: React.FC<SubscriptionFlowProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('SubscriptionFlow initialTier:', props.initialTier);
  // Ensure initialTier is a valid value
  console.log('Received initialTier:', props.initialTier);
  const safeInitialTier: SubscriptionTierSimple = 
    props.initialTier && ['none', 'basic', 'complete'].includes(props.initialTier as string) 
      ? props.initialTier as SubscriptionTierSimple 
      : 'basic';
  
  // Simulate loading to ensure context is fully initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <SubscriptionLoading />;
  }
      
  return (
    <ErrorBoundary fallback={<SubscriptionError onCancel={props.onCancel} />}>
      <SubscriptionFlowProvider initialTier={safeInitialTier}>
        <SubscriptionFlowContent {...props} />
      </SubscriptionFlowProvider>
    </ErrorBoundary>
  );
};

// This is the main component that uses the context
const SubscriptionFlowContent: React.FC<SubscriptionFlowProps> = ({
  onComplete,
  onCancel,
  initialTier
}) => {
  // Remove React Router hooks
  const { authState, updateSubscriptionTier } = useAuth();
  const { 
    selectedTier, 
    currentStep, 
    setCurrentStep, 
    formData, 
    updateFormData, 
    isProcessing, 
    setIsProcessing, 
    error, 
    setError 
  } = useSubscriptionContext();
  
  // Add body class for styling override
  useEffect(() => {
    document.body.classList.add('subscription-flow-active');
    
    return () => {
      document.body.classList.remove('subscription-flow-active');
    };
  }, []);
  
  // State to track if profile data has been loaded
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Fetch user data on load, with improved error handling and dependencies
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        if (!authState?.user?.id) {
          console.log('No user ID found. Redirecting to login...');
          // Redirect to login if not authenticated
          try {
            // Use hash navigation instead of React Router
            window.location.hash = '#/login';
          } catch (error) {
            console.error('Navigation error:', error);
          }
          return;
        }
      
        try {
          // Load user profile if available
          const { data: profileData } = await enhancedConfigurationManager.getUserProfile(authState.user.id);
          
          if (profileData && isMounted) {
            console.log('Loaded user profile:', profileData);
            updateFormData({
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              displayName: profileData.display_name || '',
              company: profileData.company || '',
              role: profileData.role || '',
              interests: Array.isArray(profileData.interests) ? profileData.interests : [],
              primaryUseCase: profileData.primary_use_case || '',
              experienceLevel: profileData.experience_level || 'intermediate'
            });
            
            // Mark as loaded
            setProfileLoaded(true);
          } else {
            console.log('No profile data found or component unmounted');
            if (isMounted) {
              setProfileLoaded(true); // Still mark as loaded to allow progression
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Mark as loaded even on error to allow progression
          if (isMounted) {
            setProfileLoaded(true);
          }
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        // Mark as loaded even on error to allow progression
        if (isMounted) {
          setProfileLoaded(true);
        }
      }
    };
    
    fetchUserData();
    
    // Cleanup function to prevent memory leaks and state updates on unmounted component
    return () => {
      isMounted = false;
    };
  // Only depend on authState.user.id and updateFormData
  }, [authState?.user?.id, updateFormData]);
  
  // Handle step data updates from step components
  const handleStepDataUpdate = (stepData: Partial<typeof formData>) => {
    updateFormData(stepData);
    
    // Move to next step
    setCurrentStep(currentStep + 1);
  };
  
  // Handle back button
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onCancel) {
      onCancel();
    } else {
      window.location.hash = '#/dashboard';
    }
  };
  
  // Handle cancel - improved to ensure proper navigation
  const handleCancel = () => {
    console.log('Cancel subscription flow');
    // First try the callback provided by parent
    if (onCancel) {
      console.log('Using provided onCancel handler');
      onCancel();
    } else {
      // Fall back to direct navigation
      console.log('Falling back to direct navigation');
      try {
        window.location.hash = '#/dashboard';
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };
  
  // Handle completion
  const handleComplete = async () => {
    if (!authState?.user?.id) {
      setError('Authentication required');
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // 1. Save subscription profile
      await enhancedConfigurationManager.createOrUpdateSubscriptionProfile(
        authState.user.id,
        selectedTier,
        {
          temperature: formData.temperature,
          max_tokens: formData.maxLength,
          top_p: formData.topP,
          top_k: formData.topK
        }
      );
      
      // 2. Save user profile with all form data
      await enhancedConfigurationManager.updateUserProfile(
        authState.user.id,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          display_name: formData.displayName,
          company: formData.company,
          role: formData.role,
          interests: formData.interests,
          primary_use_case: formData.primaryUseCase,
          experience_level: formData.experienceLevel
        }
      );
      
      // 3. Update auth context subscription tier
      if (updateSubscriptionTier) {
        // Convert simple tier type to SubscriptionTier enum
        const subscriptionTier = mapSimpleTypeToTier(selectedTier);
        updateSubscriptionTier(subscriptionTier);
      }
      
      // 4. Mark as complete and show success step
      setCurrentStep(5); // Move to success step
      
    } catch (error) {
      console.error('Error processing subscription:', error);
      setError('Failed to process your subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle final completion
  const handleFinishFlow = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Stay on the success page instead of navigating away
      console.log('Subscription flow completed');
    }
  };
  
  // Render current step with error handling
  const renderCurrentStep = () => {
    try {
      switch (currentStep) {
        case 0: // Welcome
          return (
            <ErrorBoundary fallback={<div className="step-error">Error loading welcome step</div>}>
              <WelcomeStep 
                selectedTier={selectedTier}
                onNext={() => setCurrentStep(1)}
                onCancel={handleCancel}
              />
            </ErrorBoundary>
          );
        
        case 1: // Profile
          return (
            <ErrorBoundary fallback={<div className="step-error">Error loading profile step</div>}>
              <ProfileStep 
                initialData={{
                  firstName: formData.firstName || '',
                  lastName: formData.lastName || '',
                  displayName: formData.displayName || '',
                  company: formData.company || '',
                  role: formData.role || ''
                }}
                onNext={handleStepDataUpdate}
                onBack={handleBack}
              />
            </ErrorBoundary>
          );
        
        case 2: // Interests
          return (
            <ErrorBoundary fallback={<div className="step-error">Error loading interests step</div>}>
              <InterestsStepEnhanced 
                initialData={{
                  interests: Array.isArray(formData.interests) ? formData.interests : [],
                  primaryUseCase: formData.primaryUseCase || '',
                  experienceLevel: formData.experienceLevel || 'intermediate'
                }}
                onNext={handleStepDataUpdate}
                onBack={handleBack}
              />
            </ErrorBoundary>
          );
        
        case 3: // Payment
          return (
            <ErrorBoundary fallback={<div className="step-error">Error loading payment step</div>}>
              <PaymentStep 
                selectedTier={selectedTier}
                initialData={{
                  cardNumber: formData.cardNumber || '',
                  cardExpiry: formData.cardExpiry || '',
                  cardCvc: formData.cardCvc || '',
                  billingName: formData.billingName || '',
                  billingAddress: formData.billingAddress || '',
                  billingCity: formData.billingCity || '',
                  billingState: formData.billingState || '',
                  billingZip: formData.billingZip || '',
                  billingCountry: formData.billingCountry || 'US'
                }}
                onNext={handleStepDataUpdate}
                onBack={handleBack}
              />
            </ErrorBoundary>
          );
        
        case 4: // Parameters
          return (
            <ErrorBoundary fallback={<div className="step-error">Error loading parameters step</div>}>
              <ParametersStep 
                selectedTier={selectedTier}
                initialData={{
                  useDefaultParameters: formData.useDefaultParameters !== undefined ? formData.useDefaultParameters : true,
                  temperature: formData.temperature !== undefined ? formData.temperature : 0.7,
                  maxLength: formData.maxLength !== undefined ? formData.maxLength : 100,
                  topP: formData.topP !== undefined ? formData.topP : 0.9,
                  topK: formData.topK !== undefined ? formData.topK : 40
                }}
                onNext={handleComplete}
                onBack={handleBack}
              />
            </ErrorBoundary>
          );
        
        case 5: // Success
          return (
            <ErrorBoundary fallback={<div className="step-error">Error loading success step</div>}>
              <SuccessStep 
                selectedTier={selectedTier}
                onComplete={handleFinishFlow}
              />
            </ErrorBoundary>
          );
        
        default:
          // Default to welcome step if currentStep is invalid
          setCurrentStep(0);
          return (
            <ErrorBoundary fallback={<div className="step-error">Error loading welcome step</div>}>
              <WelcomeStep 
                selectedTier={selectedTier}
                onNext={() => setCurrentStep(1)}
                onCancel={handleCancel}
              />
            </ErrorBoundary>
          );
      }
    } catch (error) {
      console.error("Error rendering step:", error);
      return (
        <div className="step-error">
          <h3>Something went wrong</h3>
          <p>We encountered an error loading this step. Please try again or go back to the previous step.</p>
          <button 
            onClick={handleBack}
            className="secondary-button"
          >
            Go Back
          </button>
        </div>
      );
    }
  };
  
  // Define simple steps for the UI
  const displayStepTitles = [
    'Welcome',
    'Profile',
    'Interests',
    'Parameters',
    'Payment',
    'Success'
  ];
  
  // Add a useEffect hook to handle scrolling on component mount or update
  useEffect(() => {
    // Check if we need to reset scroll position
    if (sessionStorage.getItem('reset_scroll') === 'true' || 
        sessionStorage.getItem('force_scroll_reset') === 'true') {
      // Force scroll to top after render
      window.scrollTo(0, 0);
      // Clear all scroll flags
      sessionStorage.removeItem('reset_scroll');
      sessionStorage.removeItem('force_scroll_reset');
      
      // Add extra handlers for the force flag
      if (sessionStorage.getItem('force_scroll_reset') === 'true') {
        // Create a more aggressive scroll reset with multiple attempts
        const attempts = 5;
        for (let i = 0; i < attempts; i++) {
          setTimeout(() => window.scrollTo(0, 0), i * 100);
        }
      }
    }
  }, [currentStep]); // Re-run on step change
  
  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add an event listener to intercept any scroll attempts 
    // while the component is first rendering
    const preventScroll = (e: Event) => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('scroll', preventScroll, { once: true });
    
    return () => {
      window.removeEventListener('scroll', preventScroll);
    };
  }, []);
  
  return (
    <div className="subscription-flow-container" style={{ backgroundColor: '#fff', color: '#333' }}>
      {/* Invisible anchor for auto-focus */}
      <div 
        className="scroll-anchor" 
        tabIndex={-1}
        ref={(el) => {
          if (el) {
            // Focus this element when it's rendered, forcing scroll to top
            setTimeout(() => {
              window.scrollTo(0, 0);
              el.focus();
            }, 0);
          }
        }}
      />
      
      {/* Progress Steps */}
      <div className="subscription-progress">
        {displayStepTitles.map((title, index) => {
          // Map the current step to the display steps
          let displayStepIndex = currentStep;
          
          return (
            <div 
              key={index}
              className={`progress-step ${index === displayStepIndex ? 'active' : ''} ${index < displayStepIndex ? 'completed' : ''}`}
            >
              <div className="step-number">
                {index < displayStepIndex ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="step-name">{title}</div>
            </div>
          );
        })}
      </div>
      
      {/* Content Area */}
      <div className="subscription-content">
        {error && (
          <div className="error-notification">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
            <button 
              className="error-close"
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        )}
        
        {isProcessing ? (
          <div className="processing-overlay">
            <div className="processing-spinner"></div>
            <div className="processing-message">Processing your subscription...</div>
          </div>
        ) : (
          renderCurrentStep()
        )}
      </div>
    </div>
  );
};

// Export the wrapper component
export default SubscriptionFlowWithProvider;