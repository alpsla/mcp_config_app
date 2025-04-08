import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import SharedHeader from '../shared/SharedHeader';
import SharedFooter from '../shared/SharedFooter';
import ConfigurationCard from './ConfigurationCard';
import ModelCard from './ModelCard.jsx';
import { getTierById, formatPrice } from '../../config/pricing'; // Only import what's used
import './Dashboard.css';
import './ReturnUserDashboard.css';
import './ComingSoonSection.css';

// Mock data for development - would be fetched from API in production
const MOCK_USER = {
  id: 'user-123',
  name: 'Test User',
  tier: 'basic', // Changed to match pricing config tiers
  lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
};

const MOCK_CONFIGURATIONS = [
  { 
    id: 1, 
    name: "Web + FileSystem Config", 
    lastModified: "2 days ago", 
    lastUsed: "Yesterday",
    type: "complete", // Changed to match pricing config tiers
    status: "Valid",
    services: {
      webSearch: true,
      fileSystem: true,
      huggingFace: true
    },
    models: [
      "DALL-E 3", "GPT-4o", "Llama 3", "Stable Audio"
    ]
  },
  { 
    id: 2, 
    name: "Basic Web Search", 
    lastModified: "1 week ago", 
    lastUsed: "3 days ago",
    type: "basic", // Changed to match pricing config tiers
    status: "Valid", 
    services: {
      webSearch: true,
      fileSystem: false,
      huggingFace: false
    },
    models: []
  },
  { 
    id: 3, 
    name: "Content Generation", 
    lastModified: "2 weeks ago", 
    lastUsed: "1 week ago",
    type: "basic", // Changed to match pricing config tiers
    status: "Invalid", 
    services: {
      webSearch: true,
      fileSystem: true,
      huggingFace: true
    },
    models: [
      "DALL-E 3", "GPT-4o", "Llama 3"
    ]
  },
];

const MOCK_NEW_MODELS = [
  { 
    id: 1, 
    name: "DALL-E 3", 
    type: "Image Generation", 
    tier: "complete", // Changed to match pricing config tiers
    isNew: true, 
    isFree: false,
    description: "Latest version of OpenAI's image generation model with enhanced photorealism and prompt following.",
    usageCount: 24863,
    rating: 4.8,
    version: "3.0.1",
    releaseDate: "Feb 12, 2025",
    previousVersions: ["3.0.0", "2.5.2", "2.0.0"]
  },
  { 
    id: 2, 
    name: "GPT-4o", 
    type: "Text Generation", 
    tier: "basic", // Changed to match pricing config tiers
    isNew: true, 
    isFree: false,
    description: "OpenAI's multimodal model capable of reasoning across text, vision, and audio inputs.",
    usageCount: 56782,
    rating: 4.9,
    version: "1.2.0",
    releaseDate: "Jan 25, 2025",
    previousVersions: ["1.1.0", "1.0.0"]
  },
  { 
    id: 3, 
    name: "Stable Audio 3", 
    type: "Audio Generation", 
    tier: "complete", // Changed to match pricing config tiers
    isNew: true, 
    isFree: true,
    description: "High-fidelity audio generation model capable of creating realistic sounds, music, and voice.",
    usageCount: 12458,
    rating: 4.6,
    version: "3.1.2",
    releaseDate: "Mar 5, 2025",
    previousVersions: ["3.0.0", "2.2.1", "2.0.0", "1.0.0"]
  },
];

const ReturningUserDashboard = () => {
  // Get the auth state from context
  const { authState, signOut } = useAuth();
  const isAuthenticated = authState && authState.user !== null;
  
  const [compactView, setCompactView] = useState(false);
  const [expandedConfig, setExpandedConfig] = useState(null);
  const [feedback, setFeedback] = useState({ visible: false, configId: null });
  const [validationState, setValidationState] = useState({
    visible: false,
    configId: null,
    inProgress: false,
    result: null
  });
  
  // User data state - would be fetched from an API in a real app
  const [user] = useState(MOCK_USER);
  const [configurations] = useState(MOCK_CONFIGURATIONS);
  const [newModels] = useState(MOCK_NEW_MODELS);
  
  // Get tier details from pricing configuration
  const userTierInfo = getTierById(user.tier);
  
  // Get the complete tier for upgrade section
  const completeTier = getTierById('complete');
  
  // Function to handle sign out - simplified for the mock
  const handleSignOut = async () => {
    try {
      // Call the auth context's signOut function
      await signOut();
      // Navigate to home page
      window.location.hash = '#/';
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.hash = '#/';
    }
  };
  
  // Toggle configuration details
  const toggleConfigDetails = (configId) => {
    if (expandedConfig === configId) {
      setExpandedConfig(null);
    } else {
      setExpandedConfig(configId);
    }
  };
  
  // Open feedback form for a configuration
  const handleFeedback = (configId) => {
    setFeedback({
      visible: true,
      configId
    });
  };
  
  // Submit feedback
  const submitFeedback = (configId, rating, comment) => {
    // In a real app, this would send data to an API
    console.log(`Feedback for config ${configId}: ${rating}/5 - ${comment}`);
    
    // Close the feedback form
    setFeedback({ visible: false, configId: null });
    
    // Show success message
    alert('Thank you for your feedback!');
  };
  
  // Validate a configuration
  const handleValidateConfig = (configId) => {
    // Start validation process
    setValidationState({
      visible: true,
      configId,
      inProgress: true,
      result: null
    });
    
    // In a real app, this would be an API call
    // For the mock, we'll simulate a network delay
    setTimeout(() => {
      const config = configurations.find(c => c.id === configId);
      const mockResult = {
        success: config.status === 'Valid',
        components: {
          webSearch: config.services.webSearch ? { 
            isValid: true,
            status: 'Valid', 
            message: 'Web search is properly configured.' 
          } : null,
          fileSystem: config.services.fileSystem ? { 
            isValid: config.status === 'Valid',
            status: config.status === 'Valid' ? 'Valid' : 'Invalid',
            message: config.status === 'Valid' ? 'File system access is properly configured.' : 'Directory not accessible. Please check permissions.'
          } : null,
          huggingFace: config.services.huggingFace ? {
            isValid: true,
            status: 'Valid',
            message: 'Hugging Face integration is properly configured.',
            tokenValid: true,
            modelsAccessible: config.models.length > 0
          } : null,
        },
        claudeIntegration: {
          isValid: config.status === 'Valid',
          status: config.status === 'Valid' ? 'Valid' : 'Invalid',
          message: config.status === 'Valid' ? 'Configuration will work with Claude.' : 'Configuration needs fixes before it will work with Claude.'
        }
      };
      
      setValidationState({
        visible: true,
        configId,
        inProgress: false,
        result: mockResult
      });
    }, 1500);
  };
  
  // Handle fix issues button
  const handleFixIssues = (configId) => {
    // In a real app, this would navigate to a fix wizard
    alert(`This would open a guided fix flow for configuration ${configId}`);
    
    // Close the validation panel
    setValidationState({
      visible: false,
      configId: null,
      inProgress: false,
      result: null
    });
    
    // Navigate to edit page (mock)
    window.location.hash = `#/configurations/${configId}/edit`;
  };
  
  // Handle use configuration button
  const handleUseConfiguration = (configId) => {
    // In a real app, this would export or deploy the configuration
    alert(`This would deploy configuration ${configId} to your system`);
    
    // Close the validation panel
    setValidationState({
      visible: false,
      configId: null,
      inProgress: false,
      result: null
    });
  };
  
  // Close validation panel
  const closeValidation = () => {
    setValidationState({
      visible: false,
      configId: null,
      inProgress: false,
      result: null
    });
  };
  
  // Add model to configuration
  const handleAddModelToConfiguration = (modelId) => {
    // In a real app, this would show a modal to select which configuration to add to
    alert(`This would show a dialog to add model ${modelId} to a configuration`);
  };
  
  return (
    <div className="dashboard-container">
      <SharedHeader 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/features', label: 'Features' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/documentation', label: 'Documentation' }
        ]}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut} // Pass the correct sign-out function here
        languageSelector={true}
      />
      
      <main className="dashboard returning-user-dashboard">
        <div className="dashboard-header">
          <div className="container">
            <div className="view-toggle">
              <button 
                className={`toggle-button ${!compactView ? 'active' : ''}`}
                onClick={() => setCompactView(false)}
              >
                Default View
              </button>
              <button 
                className={`toggle-button ${compactView ? 'active' : ''}`}
                onClick={() => setCompactView(true)}
              >
                Compact View
              </button>
            </div>
            
            <div className="user-info">
              <span className="user-tier" style={{ backgroundColor: userTierInfo.color }}>
                {userTierInfo.displayName}
              </span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content container">
          {/* Your Configurations Section */}
          <section className="configurations-section">
            <div className="section-header">
              <h2 className="section-title">Your Configurations</h2>
              <button 
                className="create-config-button"
                onClick={() => window.location.hash = '#/configuration'}
              >
                + New Configuration
              </button>
            </div>
            
            <div className={`configurations-list ${compactView ? 'compact-view' : ''}`}>
              {configurations.map((config) => (
                <ConfigurationCard
                  key={config.id}
                  config={config}
                  expandedConfig={expandedConfig}
                  validationState={validationState}
                  feedback={feedback}
                  onToggleDetails={toggleConfigDetails}
                  onValidate={handleValidateConfig}
                  onFeedback={handleFeedback}
                  onFixIssues={handleFixIssues}
                  onUseConfiguration={handleUseConfiguration}
                  onCloseValidation={closeValidation}
                  onSubmitFeedback={submitFeedback}
                  onCloseFeedback={() => setFeedback({ visible: false, configId: null })}
                />
              ))}
            </div>
          </section>
          
          {/* New Models Section */}
          <section className="new-models-section">
            <h2 className="section-title">New Models Available</h2>
            
            <div className={`models-list ${compactView ? 'compact-view' : ''}`}>
              {newModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  userTier={user.tier}
                  onAddToConfiguration={handleAddModelToConfiguration}
                />
              ))}
            </div>
          </section>
          
          {/* Upgrade Card - only shown if not on highest tier */}
          {user.tier !== 'complete' && (
            <section className="upgrade-card" style={{ borderColor: completeTier.lightColor }}>
              <h3 className="upgrade-title" style={{ color: completeTier.color }}>Upgrade your tier</h3>
              <p className="upgrade-description">
                You're currently on the {userTierInfo.displayName} tier. Upgrade to {completeTier.displayName} to unlock all models and advanced features.
              </p>
              <div className="upgrade-features">
                {completeTier.features
                  .filter(feature => feature.included && !userTierInfo.features.some(f => f.id === feature.id && f.included))
                  .slice(0, 3)
                  .map((feature, index) => (
                    <div key={feature.id} className="upgrade-feature">
                      <span className="feature-check">✓</span>
                      <span className="feature-name">
                        {feature.name}
                        {feature.limits && feature.limits.length > 0 && (
                          <span className="feature-limit">
                            {` (${feature.limits[0].value} ${feature.limits[0].unit})`}
                          </span>
                        )}
                      </span>
                    </div>
                  ))
                }
              </div>
              <button 
                className="upgrade-button"
                style={{ backgroundColor: completeTier.color }}
                onClick={() => {
                  // In a real app, this would open a subscription management page
                  const priceFormatted = formatPrice(completeTier.price.monthly);
                  const confirmUpgrade = window.confirm(`Upgrade to ${completeTier.displayName} plan for ${priceFormatted}/month?`);
                  if (confirmUpgrade) {
                    // Mock subscription update
                    setTimeout(() => {
                      alert(`Your subscription has been upgraded to ${completeTier.displayName}! Now you can access all models.`);
                      // Create a hard reset navigation sequence:
                      // 1. Force the reset scroll flag in sessionStorage
                      sessionStorage.setItem('force_scroll_reset', 'true');
                      // 2. Force window to reset scroll position 
                      window.scrollTo(0, 0);
                      // 3. Use the location href for a clean navigation
                      window.location.href = '#/subscribe';
                    }, 500);
                  }
                }}
              >
                View Upgrade Options
              </button>
            </section>
          )}
          
          {/* Coming Soon Section - always visible */}
          <section className="coming-soon-section">
            <h2 className="section-title">Coming Soon</h2>
            <div className="coming-soon-features">
              <div className="coming-soon-feature">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Enhanced Analytics</h3>
                <p className="feature-description">
                  Detailed performance metrics and usage statistics for your configurations.
                </p>
              </div>
              <div className="coming-soon-feature">
                <div className="feature-icon">🛒</div>
                <h3 className="feature-title">Model Marketplace</h3>
                <p className="feature-description">
                  Discover, compare, and use a wide range of AI models from various providers.
                </p>
              </div>
              <div className="coming-soon-feature">
                <div className="feature-icon">👥</div>
                <h3 className="feature-title">Team Collaboration</h3>
                <p className="feature-description">
                  Share configurations with team members and collaborate on projects.
                </p>
              </div>
              <div className="coming-soon-feature">
                <div className="feature-icon">🔄</div>
                <h3 className="feature-title">Version Control</h3>
                <p className="feature-description">
                  Track changes and revert to previous versions of your configurations.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <SharedFooter />
    </div>
  );
};

export default ReturningUserDashboard;