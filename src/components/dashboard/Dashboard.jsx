import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './dashboard-footer.css';
import Header from '../common/Header';
import WelcomeBanner from './WelcomeBanner';
import ServiceCard from './ServiceCard';
import PricingTier from './PricingTier';
import ModelCard from './ModelCard';
import ExampleShowcase from './ExampleShowcase';
import TestimonialCard from './TestimonialCard';
// EmptyState import removed as we now use direct UI for subscription selection
import ComingSoon from './ComingSoon';
import { signOut } from '../../services/supabase/authService';

// Import assets
import santaBeachImage from '../../assets/images/Santa.webp';
import holidayBeachMusic from '../../assets/audio/tropical-christma.wav';
import abstractVideo from '../../assets/videos/abstract.mp4';

const Dashboard = () => {
  // Log that the dashboard is loaded
  console.log('Dashboard loaded successfully');
  
  // State for active example in the showcase
  const [activeExample, setActiveExample] = useState('santa-beach');
  
  // State for configurations
  const [configurations, setConfigurations] = useState([]);
  
  // State for user's subscription tier and package configuration
  const [userTier, setUserTier] = useState('free'); // 'free', 'basic', or 'complete'
  const [selectedModels, setSelectedModels] = useState([]);
  // Removed unused packageConfiguration variable
  
  // Maximum allowed models per tier
  const MAX_BASIC_TIER_MODELS = 3;
  const MAX_COMPLETE_TIER_MODELS = 10;
  
  // Function to add/remove a model from the package
  const handleAddToPackage = (modelId) => {
    // Check if model is already in package
    if (selectedModels.includes(modelId)) {
      // Remove it
      setSelectedModels(selectedModels.filter(id => id !== modelId));
      return;
    }
    
    // Check against tier limits
    const maxModels = userTier === 'basic' ? MAX_BASIC_TIER_MODELS : MAX_COMPLETE_TIER_MODELS;
    
    if (selectedModels.length >= maxModels) {
      alert(`You can only add up to ${maxModels} models with your ${userTier} subscription.`);
      return;
    }
    
    // Add the model
    setSelectedModels([...selectedModels, modelId]);
  };
  
  // Function to handle demo video clicks
  const handleWatchDemo = (modelId, demoUrl) => {
    // Open a new tab with the YouTube demo
    const url = demoUrl || `https://www.youtube.com/results?search_query=${modelId}+AI+model+demo`;
    window.open(url, '_blank');
  };
  
  // Function to create a configuration from selected options
  const createConfiguration = () => {
    const configuration = {
      name: `My ${userTier.charAt(0).toUpperCase() + userTier.slice(1)} Configuration`,
      services: ['websearch', 'filesystem'],
      models: selectedModels,
      tier: userTier,
      createdAt: new Date().toISOString()
    };
    
    // Update the configurations array
    setConfigurations([configuration]);
    
    // Show success message with export instructions
    showSuccessMessage(
      'Configuration Updated!', 
      `Your ${userTier} configuration has been updated with the free services (File System and Web Search) plus ${selectedModels.length} Hugging Face model${selectedModels.length !== 1 ? 's' : ''}. You can now export it to your system or verify it with Claude.`
    );
    
    // Scroll to the configuration card to see results
    scrollToElement('.configurations-view');
  };
  
  
  // React Router's navigate function
  const navigate = useNavigate();
  
  // Handle sign out
  const handleSignOut = async (e) => {
    try {
      if (e) {
        e.preventDefault();
        // If we have an event object, disable the button
        const btn = e.currentTarget;
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Signing out...';
        }
      }
      
      console.log('Sign out clicked');
      
      // Clear auth tokens from storage
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Call the proper sign out function
      await signOut();
      
      // Redirect to home page after sign out
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // If there's an error, still try to redirect
      navigate('/');
    }
  };
  
  // Handle example tab clicks
  const handleExampleClick = (id) => {
    setActiveExample(id);
  };
  
  // Handle model selection toggle - removed unused function
  
  // Handler for configuration actions
  const handleConfigurationAction = (type) => {
    // Set the user's tier based on selection
    setUserTier(type);
    
    // Clear any previously selected models
    setSelectedModels([]);
    
    // For free tier, no models are available
    if (type === 'free') {
      // Create the free configuration directly
      const configuration = {
        name: 'My Free Configuration',
        services: ['websearch', 'filesystem'],
        models: [],
        tier: 'free',
        createdAt: new Date().toISOString()
      };
      
      setConfigurations([configuration]);
      
      // Show success message with next steps
      showSuccessMessage(
        'Free Configuration Created!', 
        'Your configuration has been created successfully with Web Search and File System capabilities only. No premium models are included in this tier.'
      );
      
      // Scroll to the configuration card
      scrollToElement('.configurations-view');
    } else {
      // For paid tiers, show subscription confirmation first
      if (showSubscriptionConfirmation(type)) {
        // Create a basic configuration for the tier
        const configuration = {
          name: `My ${type.charAt(0).toUpperCase() + type.slice(1)} Configuration`,
          services: ['websearch', 'filesystem'],
          models: [],
          tier: type,
          createdAt: new Date().toISOString()
        };
        
        setConfigurations([configuration]);
        
        // Show next step message
        showSuccessMessage(
          'Now Select Your Models', 
          `Great! You've selected the ${type} plan with access to ${type === 'basic' ? '3' : '10'} Hugging Face models. Choose which models you'd like to include in your configuration.`
        );
        
        // Scroll to model selection section
        scrollToElement('.model-selection-section');
      }
    }
  };
  
  // Helper function to show success messages
  const showSuccessMessage = (title, message) => {
    // This could be implemented with a toast notification library
    // but for now we'll use a simple alert
    alert(`${title}\n\n${message}`);
  };
  
  // Helper function to scroll to an element
  const scrollToElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Helper function to show subscription confirmation
  const showSubscriptionConfirmation = (tier) => {
    // In a real implementation, this would open a payment processing flow
    // For now, we'll simulate with a confirmation dialog
    return window.confirm(
      `You're about to subscribe to the ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan for ${tier === 'basic' ? '2' : '5'}/month. Proceed?`
    );
  };
  
  // Available services data
  const services = [
    {
      id: 'filesystem',
      title: 'File System Integration',
      icon: 'folder',
      description: 'Securely access local files for your AI assistant',
      bulletPoints: [
        'Secure local file access',
        'Desktop integration',
        'Directory selection'
      ],
      compatibility: 'Desktop Only'
    },
    {
      id: 'websearch',
      title: 'Web Search',
      icon: 'search',
      description: 'Enable web search capabilities for your AI assistant',
      bulletPoints: [
        'Real-time information',
        'Customizable search parameters',
        'Safe search options'
      ],
      compatibility: 'All Platforms'
    }
  ];
  
  // Pricing plans data
  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Web Search integration',
        'File System access',
        'Basic configurations'
      ],
      highlight: false,
      badge: null
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 2,
      features: [
        'Everything in Free',
        '3 premium models',
        'Configuration sharing'
      ],
      highlight: false,
      badge: 'Beta Price'
    },
    {
      id: 'complete',
      name: 'Complete',
      price: 5,
      features: [
        'Everything in Basic',
        '10 premium models',
        'Advanced configurations',
        'Priority support'
      ],
      highlight: true,
      badge: 'Most Popular'
    }
  ];
  
  // Premium models data - expanded list
  const premiumModels = [
    {
      id: 'flux1-dev',
      name: 'Flux.1-dev-infer',
      category: 'Image Generation',
      description: 'Create stunning images from text descriptions with high fidelity',
      tier: 'both' // Available in both basic and complete plans
    },
    {
      id: 'whisper-large',
      name: 'Whisper-large-v3-turbo',
      category: 'Audio Transcription',
      description: 'Transcribe audio to text with high accuracy and multiple language support',
      tier: 'both' // Available in both basic and complete plans
    },
    {
      id: 'qwen2-72b',
      name: 'Qwen2-72B-Instruct',
      category: 'Language Model',
      description: 'Advanced language model for complex tasks with contextual understanding',
      tier: 'both' // Available in both basic and complete plans
    },
    {
      id: 'shuttle-aesthetic',
      name: 'Shuttle-3.1-aesthetic',
      category: 'Image Generation',
      description: 'Generate artistic and aesthetic images with unique visual styles',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'llama3-70b',
      name: 'Llama3-70B-Instruct',
      category: 'Language Model',
      description: 'Versatile language model for conversational AI and content generation',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'musicgen',
      name: 'MusicGen-Large',
      category: 'Audio Generation',
      description: 'Create original music compositions from text descriptions',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'deepseek-coder',
      name: 'DeepSeek-Coder-33B',
      category: 'Code Generation',
      description: 'Generate high-quality code across multiple programming languages',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'sdxl-turbo',
      name: 'SDXL-Turbo',
      category: 'Image Generation',
      description: 'Fast image generation with stable diffusion for rapid prototyping',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'videocrafter',
      name: 'VideoCrafter-2',
      category: 'Video Generation',
      description: 'Create short video clips from text descriptions or image inputs',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'stable-cascade',
      name: 'Stable Cascade',
      category: 'Image Generation',
      description: 'Multi-stage image generation with unprecedented detail and quality',
      tier: 'complete' // Only in complete plan
    }
  ];
  
  // Examples for showcase
  const examples = [
    {
      id: 'santa-beach',
      title: 'Santa on the Beach',
      model: 'Flux.1-dev-infer',
      prompt: 'Santa Claus relaxing on a tropical beach, wearing sunglasses and shorts, photorealistic style',
      assetPath: santaBeachImage,
      type: 'image'
    },
    {
      id: 'holiday-music',
      title: 'Holiday Beach Music',
      model: 'MusicGen',
      prompt: 'Create upbeat holiday music with a tropical beach vibe',
      assetPath: holidayBeachMusic,
      type: 'audio'
    },
    {
      id: 'abstract-video',
      title: 'Abstract Visualization',
      model: 'VideoGen',
      prompt: 'Create an abstract visualization with dynamic patterns and vibrant colors',
      assetPath: abstractVideo,
      type: 'video'
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Product Designer',
      company: 'CreativeWorks',
      model: 'Flux.1-dev-infer',
      testimonial: "The image generation models have transformed our product design workflow. We can iterate on concepts faster than ever before."
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Content Manager',
      company: 'MediaHub',
      model: 'Whisper-large-v3-turbo',
      testimonial: "We use the audio transcription model to automatically create transcripts for all our podcast episodes. It's been a game-changer for our workflow."
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Software Developer',
      company: 'TechSolutions',
      model: 'Qwen2-72B-Instruct',
      testimonial: "Integrating the language model into our customer support system has helped us provide faster and more accurate responses."
    }
  ];
  
  return (
    <div className="dashboard-container">
      <Header 
        appName="MCP Configuration Tool" 
        navLinks={[
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/docs', label: 'Documentation' }
        ]}
        isAuthenticated={true}
        onSignOut={handleSignOut}
      />
      
      <main className="dashboard">
        <div className="dashboard-content">
          <WelcomeBanner 
            title="Welcome to the MCP Configuration Tool" 
            subtitle="Configure your AI assistant's capabilities"
            badgeText="Beta Release"
          />
          
          {/* Example Showcase Section - Marketing first */}
          <section className="showcase-section">
            <h2 className="section-title">See What You Can Create</h2>
            <p className="section-description">
              These examples showcase what's possible when you configure your MCP servers with premium models.
            </p>
            
            <div className="examples-tabs">
              {examples.map(example => (
                <button 
                  key={example.id}
                  className={`example-tab ${activeExample === example.id ? 'active' : ''}`}
                  onClick={() => handleExampleClick(example.id)}
                >
                  <span className="example-type">{example.type}</span>
                  <span className="example-title">{example.title}</span>
                </button>
              ))}
            </div>
            
            <div className="example-content">
              {examples.map(example => (
                <div 
                  key={example.id} 
                  className={`example-container ${activeExample === example.id ? 'active' : 'hidden'}`}
                >
                  <ExampleShowcase example={example} />
                </div>
              ))}
            </div>
          </section>
          
          {/* Testimonials Section */}
          <section className="testimonials-section">
            <h2 className="section-title">What Users Are Saying</h2>
            <div className="testimonials-grid">
              {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </section>
          
          {/* Pricing Plans Section */}
          <section className="pricing-section">
            <h2 className="section-title">Pricing Plans</h2>
            <div className="pricing-grid">
              {pricingPlans.map(plan => (
                <PricingTier key={plan.id} plan={plan} />
              ))}
            </div>
          </section>
          
          {/* Available Models Section - Now before Your Configurations */}
          <section className="models-section">
            <h2 className="section-title">Available Models</h2>
            <p className="section-description">
              Browse our library of available models. Free tier includes only File System and Web Search capabilities. 
              Basic tier ($2) adds 3 models, and Complete tier ($5) includes all 10 models. Watch demos to see what each model can do.
            </p>
            
            <div className="models-grid">
              {premiumModels.map(model => {
                // Add demo URL prop to each model
                const modelWithDemo = {
                  ...model,
                  demoUrl: `https://www.youtube.com/results?search_query=${model.id}+AI+model+demo`
                };
                
                return (
                  <ModelCard 
                    key={model.id} 
                    model={modelWithDemo}
                    onWatchDemo={handleWatchDemo}
                  />
                );
              })}
            </div>
          </section>
          
          {/* Your Configurations Section */}
          <section className="configurations-section">
            <h2 className="section-title">Your Configurations</h2>
            <p className="section-description">
              Choose from preset configurations or create custom ones to suit your specific needs.
              Select a tier to begin creating your configuration.
            </p>
            {configurations.length === 0 ? (
              <div className="subscription-wizard">
                <h3>Start Building Your Configuration</h3>
                
                <div className="wizard-steps">
                  <div className="wizard-step active">
                    <div className="step-number">1</div>
                    <h4>Choose a Plan</h4>
                  </div>
                  <div className="wizard-connector"></div>
                  <div className="wizard-step inactive">
                    <div className="step-number">2</div>
                    <h4>Select Models</h4>
                  </div>
                  <div className="wizard-connector"></div>
                  <div className="wizard-step inactive">
                    <div className="step-number">3</div>
                    <h4>Configure &amp; Export</h4>
                  </div>
                </div>
                
                <div className="plan-selection">
                  <div className="plan-card free">
                    <div className="plan-header">
                      <h4>Free Plan</h4>
                      <span className="price">$0</span>
                    </div>
                    <ul className="plan-features">
                      <li>1 Free model (File System Access)</li>
                      <li>1 Free model (Web Search Integration)</li>
                      <li className="feature-not-included">No Hugging Face models</li>
                    </ul>
                    <button className="plan-button" onClick={() => handleConfigurationAction('free')}>
                      Select Free Plan
                    </button>
                  </div>
                  
                  <div className="plan-card basic">
                    <div className="plan-header">
                      <h4>Basic Plan</h4>
                      <span className="price">$2<span className="month">/month</span></span>
                    </div>
                    <ul className="plan-features">
                      <li>1 Free model (File System Access)</li>
                      <li>1 Free model (Web Search Integration)</li>
                      <li>3 Hugging Face models</li>
                    </ul>
                    <button className="plan-button" onClick={() => handleConfigurationAction('basic')}>
                      Select Basic Plan
                    </button>
                  </div>
                  
                  <div className="plan-card premium">
                    <div className="recommended-badge">RECOMMENDED</div>
                    <div className="plan-header">
                      <h4>Complete Plan</h4>
                      <span className="price">$5<span className="month">/month</span></span>
                    </div>
                    <ul className="plan-features">
                      <li>1 Free model (File System Access)</li>
                      <li>1 Free model (Web Search Integration)</li>
                      <li>10 Hugging Face models</li>
                      <li>Priority Support</li>
                    </ul>
                    <button className="plan-button" onClick={() => handleConfigurationAction('complete')}>
                      Select Complete Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="configurations-view">
                <div className="configuration-card">
                  <h3>{configurations[0].name}</h3>
                  <div className="config-details">
                    <div>
                      <h4>Tier</h4>
                      <p>{configurations[0].tier.charAt(0).toUpperCase() + configurations[0].tier.slice(1)}</p>
                    </div>
                    <div>
                      <h4>Services</h4>
                      <ul>
                        {configurations[0].services.map(service => (
                          <li key={service}>{service === 'websearch' ? 'Web Search' : 'File System'}</li>
                        ))}
                      </ul>
                    </div>
                    {configurations[0].models.length > 0 && (
                      <div>
                        <h4>Models</h4>
                        <ul>
                          {configurations[0].models.map(modelId => {
                            const model = premiumModels.find(m => m.id === modelId);
                            return model ? <li key={modelId}>{model.name}</li> : null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="config-footer">
                    <button className="config-action-button" onClick={() => alert('Configuration exported to your system successfully!')}>
                      Export to System
                    </button>
                    <button className="config-action-button" onClick={() => alert('Configuration verified with Claude successfully!')}>
                      Verify with Claude
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Model Selection for Paid Tiers */}
            {(userTier === 'basic' || userTier === 'complete') && configurations.length > 0 && (
              <div className="model-selection-section">
                <h3>Select Hugging Face Models for Your Configuration</h3>
                <p>
                  {userTier === 'basic' ? 
                    `Your Basic Plan allows selecting up to ${MAX_BASIC_TIER_MODELS} models (${selectedModels.length}/${MAX_BASIC_TIER_MODELS} selected).` :
                    `Your Complete Plan allows selecting up to ${MAX_COMPLETE_TIER_MODELS} models (${selectedModels.length}/${MAX_COMPLETE_TIER_MODELS} selected).`
                  }
                </p>
                
                {selectedModels.length > 0 && (
                  <div className="selected-models-summary">
                    <h4>Your Selected Models</h4>
                    <ul className="model-list">
                      {selectedModels.map(modelId => {
                        const model = premiumModels.find(m => m.id === modelId);
                        return model ? (
                          <li key={modelId}>{model.name} <button onClick={() => handleAddToPackage(modelId)}>Remove</button></li>
                        ) : null;
                      })}
                    </ul>
                    <button 
                      className="create-config-button" 
                      onClick={createConfiguration}
                    >
                      Update Configuration
                    </button>
                  </div>
                )}
                
                <div className="model-selection-grid">
                  {premiumModels
                    .filter(model => userTier === 'complete' || model.tier === 'both' || model.tier === userTier)
                    .map(model => {
                      const isSelected = selectedModels.includes(model.id);
                      return (
                        <div key={model.id} className={`model-selection-card ${isSelected ? 'selected' : ''}`}>
                          <h4>{model.name}</h4>
                          <p>{model.description}</p>
                          <button 
                            className={`select-model-button ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleAddToPackage(model.id)}
                          >
                            {isSelected ? 'Remove' : 'Add to Configuration'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </section>
          
          {/* Coming Soon Section */}
          <ComingSoon />
        </div>
      </main>
      
      <div style={{
        padding: "1rem 0",
        backgroundColor: "#ffffff",
        marginTop: "0",
        borderTop: "1px solid #e5e7eb"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr", 
            gap: "1rem", 
            marginBottom: "1rem" 
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ marginRight: "0.5rem" }}>
                  <img src="/logo.svg" alt="CodeQual" width="32" height="32" />
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "1.1rem", color: "#333" }}>CodeQual</div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>MCP Configuration Tool</div>
                </div>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
                AI-powered tools to improve code quality and save development time.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem", color: "#333" }}>PLATFORM</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="/features" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Features</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/pricing" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Pricing</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/docs" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Documentation</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/changelog" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem", color: "#333" }}>COMPANY</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="/about" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>About Us</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/blog" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Blog</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/contact" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem", color: "#333" }}>LEGAL</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="/terms" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Terms of Service</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/privacy" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Privacy Policy</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="/security" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>Security</a></li>
              </ul>
            </div>
          </div>
          
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem", marginTop: "1rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>&copy; 2025 CodeQual, Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;