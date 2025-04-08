import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import TierSelectionConnector from '../dashboard/TierSelectionConnector';
import SubscriptionFlow from '../subscription/SubscriptionFlow';
import EnhancedHuggingFaceConfig from '../HuggingFaceIntegration/EnhancedHuggingFaceConfig';
import { enhancedConfigurationManager } from '../../services/EnhancedConfigurationManager';
import { SubscriptionTierSimple, mapTierToSimpleType } from '../../types/enhanced-types';
import './MainConfigurationFlow.css';

/**
 * Main Configuration Flow that integrates:
 * - Existing dashboard tier selection
 * - Subscription flow with parameter configuration
 * - Enhanced service configuration (HuggingFace, etc.)
 */
const MainConfigurationFlow: React.FC = () => {
  const { authState, getUserSubscriptionTier } = useAuth();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { configId } = useParams<{ configId?: string }>();
  
  const [showSubscriptionFlow, setShowSubscriptionFlow] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierSimple>('none');
  const [configurationStep, setConfigurationStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [userSubscriptionTier, setUserSubscriptionTier] = useState<SubscriptionTierSimple>('none');
  const [showTierSelectionModal, setShowTierSelectionModal] = useState<boolean>(false);
  
  // Get the user's subscription tier
  useEffect(() => {
    if (getUserSubscriptionTier) {
      const tier = getUserSubscriptionTier();
      const mappedTier = mapTierToSimpleType(tier);
      console.log('User subscription tier:', tier, 'Mapped tier:', mappedTier);
      
      // For diagnostic purposes
      console.log('Auth state:', authState);
      console.log('User metadata:', authState?.user?.user_metadata);
      console.log('Subscription from metadata:', authState?.user?.user_metadata?.subscriptionTier);
      
      setUserSubscriptionTier(mappedTier);
      
      // Enforce logging after state update
      setTimeout(() => {
        console.log('Updated userSubscriptionTier state:', mappedTier);
        console.log('Is premium feature locked?', mappedTier === 'none' ? 'YES - show Premium badge' : 'NO - user has paid plan');
      }, 0);
    }
  }, [getUserSubscriptionTier, authState]);
  
  // Handle tier selection from dashboard or URL
  const handleTierSelected = (tier: SubscriptionTierSimple) => {
    setSelectedTier(tier);
    
    // Check if user needs to go through subscription flow
    const needsSubscription = tier !== 'none' && !authState.user?.user_metadata?.subscriptionTier;
    setShowSubscriptionFlow(needsSubscription);
  };
  
  // Load existing configuration if editing
  useEffect(() => {
    const loadConfig = async () => {
      if (configId && authState?.user?.id) {
        try {
          setIsLoading(true);
          const config = await enhancedConfigurationManager.getConfigurationById(
            authState.user.id,
            configId
          );
          
          if (config) {
            setCurrentConfig(config);
          }
        } catch (error) {
          console.error('Error loading configuration:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, [configId, authState?.user?.id]);
  
  // Handle subscription completion
  const handleSubscriptionComplete = () => {
    setShowSubscriptionFlow(false);
    
    // Update the user's subscription tier
    if (getUserSubscriptionTier) {
      const tier = getUserSubscriptionTier();
      setUserSubscriptionTier(mapTierToSimpleType(tier));
    }
    
    // If the user subscribed for Hugging Face, send them directly to that config
    if (configurationStep === 0) {
      setConfigurationStep(3);
    }
  };
  
  // Handle configuration update
  const handleConfigurationUpdate = (serviceId: string, config: any) => {
    // Update the current configuration
    // This would need to be expanded based on the service type
    setCurrentConfig(prev => ({
      ...prev,
      [serviceId]: config
    }));
  };
  
  // Render loading state
  if (isLoading) {
    return <div className="loading-state">Loading configuration...</div>;
  }
  
  // Render tier selection modal if needed
  if (showTierSelectionModal) {
    return (
      <div className="tier-selection-modal">
        <div className="modal-overlay" onClick={() => setShowTierSelectionModal(false)}></div>
        <div className="modal-content">
          <h2>Choose Your Subscription Plan</h2>
          <p>Select a plan to unlock Hugging Face Models integration:</p>
          
          <div className="tier-options">
            <div className="tier-option">
              <div className="tier-option-content">
                <h3>Basic Plan</h3>
                <div className="tier-price">$2/month</div>
                <ul>
                  <li>Access to File System</li>
                  <li>Access to Web Search</li>
                  <li>Access to 3 Hugging Face models</li>
                </ul>
              </div>
              <div className="tier-button-container">
                <button 
                  className="tier-button"
                  onClick={() => {
                    setSelectedTier('basic');
                    setShowTierSelectionModal(false);
                    setShowSubscriptionFlow(true);
                  }}
                >
                  Select Basic Plan
                </button>
              </div>
            </div>
            
            <div className="tier-option recommended">
              <div className="recommended-badge">Recommended</div>
              <div className="tier-option-content">
                <h3>Complete Plan</h3>
                <div className="tier-price">$5/month</div>
                <ul>
                  <li>Access to File System</li>
                  <li>Access to Web Search</li>
                  <li>Access to ALL Hugging Face models</li>
                  <li>Priority Support</li>
                </ul>
              </div>
              <div className="tier-button-container">
                <button 
                  className="tier-button"
                  onClick={() => {
                    setSelectedTier('complete');
                    setShowTierSelectionModal(false);
                    setShowSubscriptionFlow(true);
                  }}
                >
                  Select Complete Plan
                </button>
              </div>
            </div>
          </div>
          
          <button 
            className="cancel-button"
            onClick={() => setShowTierSelectionModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  
  // Render subscription flow if needed
  if (showSubscriptionFlow) {
    return (
      <SubscriptionFlow
        onComplete={handleSubscriptionComplete}
        onCancel={() => {
          setShowSubscriptionFlow(false);
          setSelectedTier('none');
        }}
        initialTier={selectedTier !== 'none' ? selectedTier : undefined}
      />
    );
  }
  
  // Determine what to render based on configuration step
  const renderConfigurationStep = () => {
    switch (configurationStep) {
      case 0:
        // Service selection step
        return (
          <div className="service-selection">
            <h2>Select Services to Configure</h2>
            <p>Choose which services you want to enable for Claude:</p>
            
            <div className="service-options">
              <div 
                className="service-option" 
                onClick={() => setConfigurationStep(1)}
              >
                <h3>File System</h3>
                <p>Allow Claude to access files on your computer</p>
              </div>
              
              <div 
                className="service-option"
                onClick={() => setConfigurationStep(2)}
              >
                <h3>Web Search</h3>
                <p>Enable Claude to search the web for information</p>
              </div>
              
              {/* Super-simplified Hugging Face option logic */}
              <div 
                className={`service-option ${userSubscriptionTier === 'none' ? 'locked-option' : ''}`}
                onClick={() => {
                  console.log('HuggingFace option clicked, userSubscriptionTier:', userSubscriptionTier);
                  if (userSubscriptionTier === 'none') {
                    // Free user - show tier selection modal
                    console.log('Free user clicked HuggingFace, showing tier selection modal');
                    setShowTierSelectionModal(true);
                  } else {
                    // Paid user - proceed to Hugging Face config
                    console.log('Paid user clicked HuggingFace, proceeding to config step');
                    setConfigurationStep(3);
                  }
                }}
              >
                <h3>
                  Hugging Face Models 
                  {userSubscriptionTier === 'none' && (
                    <span style={{ color: '#6750A4', fontWeight: 'bold', marginLeft: '5px' }}>
                      (Premium)
                    </span>
                  )}
                </h3>
                
                <p>
                  {userSubscriptionTier === 'none' 
                    ? 'Subscribe to a paid plan to access specialized AI models' 
                    : 'Extend Claude with specialized AI models'}
                </p>
                
                {userSubscriptionTier === 'none' && (
                  <div 
                    style={{ 
                      marginTop: '12px', 
                      display: 'inline-block',
                      padding: '6px 12px',
                      backgroundColor: '#6750A4',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent click handler again
                      setShowTierSelectionModal(true);
                    }}
                  >
                    Unlock with Subscription
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 1:
        // File System configuration
        return (
          <div className="file-system-config">
            <h2>File System Configuration</h2>
            {/* Your existing File System configuration component would go here */}
            <button onClick={() => setConfigurationStep(0)}>Back</button>
          </div>
        );
        
      case 2:
        // Web Search configuration
        return (
          <div className="web-search-config">
            <h2>Web Search Configuration</h2>
            {/* Your existing Web Search configuration component would go here */}
            <button onClick={() => setConfigurationStep(0)}>Back</button>
          </div>
        );
        
      case 3:
        // Hugging Face configuration with our enhanced component
        return (
          <div className="hugging-face-config">
            <h2>Hugging Face Models</h2>
            <EnhancedHuggingFaceConfig
              onConfigurationUpdate={(config) => 
                handleConfigurationUpdate('huggingFace', config)
              }
              initialConfig={currentConfig?.huggingFace}
            />
            <button onClick={() => setConfigurationStep(0)}>Back</button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="main-configuration-flow">
      {/* Connect to existing dashboard tier selection */}
      <TierSelectionConnector
        onTierSelected={handleTierSelected}
        initialTier={location.state?.tier}
      />
      
      {/* Configuration steps */}
      {renderConfigurationStep()}
    </div>
  );
};

export default MainConfigurationFlow;