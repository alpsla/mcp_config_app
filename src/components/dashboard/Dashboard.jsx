import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Dashboard.css';
import SharedHeader from '../shared/SharedHeader';
import WelcomeBanner from './WelcomeBanner';
import ModelCard from './ModelCard';
import ExampleShowcase from './ExampleShowcase';
import TestimonialCard from './TestimonialCard';
import TierSelector from './TierSelector';
import ComingSoon from './ComingSoon';
import SharedFooter from '../shared/SharedFooter';

// Force refresh asset paths to avoid caching issues
const forceRefresh = '?v=' + new Date().getTime();

const Dashboard = () => {
  // Get the auth state from context
  const { authState, signOut: authSignOut } = useAuth();
  const isAuthenticated = authState && authState.user !== null;
  
  // State for active example in the showcase
  const [activeExample, setActiveExample] = useState('santa-beach');
  
  // State for configurations
  const [configurations, setConfigurations] = useState([]);
  
  // State for user's subscription tier and package configuration
  const [userTier, setUserTier] = useState('free'); // 'free', 'basic', or 'complete'
  const [selectedModels, setSelectedModels] = useState([]);
  
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
      
      // Call the auth context's signOut function
      await authSignOut();
      
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
  
  // Updated Premium models data with the new list
  const premiumModels = [
    {
      id: 'gpt-neo-2-7b',
      name: 'EleutherAI/gpt-neo-2.7B',
      category: 'Text Generation',
      description: 'Versatile text generation model for creative writing and document drafting',
      tier: 'both' // Available in both basic and complete plans
    },
    {
      id: 'whisper-v3',
      name: 'Whisper-large-v3-turbo',
      category: 'Audio Transcription',
      description: 'Powerful audio transcription with superior accuracy',
      tier: 'both' // Available in both basic and complete plans
    },
    {
      id: 'stable-diffusion-2',
      name: 'stabilityai/stable-diffusion-2',
      category: 'Image Generation',
      description: 'State-of-the-art image generation with high quality outputs',
      tier: 'both' // Available in both basic and complete plans
    },
    {
      id: 'qwen2-72b',
      name: 'Qwen2-72B-Instruct',
      category: 'Language Model',
      description: 'Large language model complementary to Claude',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'all-minilm-l6-v2',
      name: 'sentence-transformers/all-MiniLM-L6-v2',
      category: 'Semantic Search',
      description: 'Lightweight embedding model for semantic search and clustering',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'bart-large-cnn',
      name: 'facebook/bart-large-cnn',
      category: 'Content Summarization',
      description: 'Specialized model for condensing long documents into concise summaries',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'instruct-pix2pix',
      name: 'CompVis/instruct-pix2pix',
      category: 'Image Editing',
      description: 'Edit images based on text instructions',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'layoutlmv3-base',
      name: 'microsoft/layoutlmv3-base',
      category: 'Document Understanding',
      description: 'Extract structured data from scanned documents and forms',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'roberta-squad2',
      name: 'deepset/roberta-base-squad2',
      category: 'Question Answering',
      description: 'Question-answering model for precise information extraction',
      tier: 'complete' // Only in complete plan
    },
    {
      id: 'text-to-video-ms',
      name: 'ali-vilab/text-to-video-ms-1.7b',
      category: 'Video Generation',
      description: 'Generate videos from text descriptions with control over motion',
      tier: 'complete' // Only in complete plan
    }
  ];
  
  // Examples for showcase
  const examples = [
    {
      id: 'santa-beach',
      title: 'Santa on the Beach',
      model: 'Flux.1',
      prompt: 'Santa Claus on the beach giving Christmas gifts to sea creatures',
      assetPath: '/demo-assets/images/flux-santa-beach.jpg' + forceRefresh,
      type: 'image'
    },
    {
      id: 'holiday-music',
      title: 'Holiday Beach Music',
      model: 'MusicGen',
      prompt: 'Create upbeat holiday music with a tropical beach vibe',
      assetPath: '/demo-assets/audio/tropical-christma.wav' + forceRefresh,
      type: 'audio'
    },
    {
      id: 'abstract-video',
      title: 'Abstract Visualization',
      model: 'VideoGen',
      prompt: 'Create an abstract visualization with dynamic patterns and vibrant colors',
      assetPath: '/demo-assets/videos/abstract.mp4' + forceRefresh,
      type: 'video'
    }
  ];
  
  // Asset verification function for debugging
  const verifyAssets = () => {
    examples.forEach(example => {
      console.log(`Verifying asset: ${example.assetPath}`);
      fetch(example.assetPath)
        .then(response => {
          console.log(`Asset ${example.assetPath} status: ${response.status} ${response.ok ? 'OK' : 'NOT FOUND'}`);
        })
        .catch(error => {
          console.error(`Error fetching ${example.assetPath}:`, error);
        });
    });
    
    // Also check if the directory structure is correct
    fetch('/demo-assets/')
      .then(response => {
        console.log(`Demo-assets directory status: ${response.status} ${response.ok ? 'OK' : 'NOT FOUND'}`);
      })
      .catch(error => {
        console.error('Error fetching demo-assets directory:', error);
      });
  };
  
  // Automatically verify assets on load
  useEffect(() => {
    verifyAssets();
  }, []);
  
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
      <SharedHeader 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/features', label: 'Features' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/documentation', label: 'Documentation' }
        ]}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        languageSelector={true}
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
              <TierSelector />
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
      
      <SharedFooter />
    </div>
  );
};

export default Dashboard;
