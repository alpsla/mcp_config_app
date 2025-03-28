import React, { useState } from 'react';
import './Dashboard.css';
import './dashboard-footer.css';
import Header from '../common/Header';
import WelcomeBanner from './WelcomeBanner';
import ServiceCard from './ServiceCard';
import PricingTier from './PricingTier';
import ModelCard from './ModelCard';
import ExampleShowcase from './ExampleShowcase';
import TestimonialCard from './TestimonialCard';
import EmptyState from './EmptyState';
import ComingSoon from './ComingSoon';

// Import assets
import santaBeachImage from '../../assets/images/Santa.webp';
import holidayBeachMusic from '../../assets/audio/tropical-christma.wav';
import abstractVideo from '../../assets/videos/abstract.mp4';

const Dashboard = () => {
  // Log that the dashboard is loaded
  console.log('Dashboard loaded successfully');
  // State for active example in the showcase
  const [activeExample, setActiveExample] = useState('santa-beach');
  
  // State for configurations (currently empty)
  const [configurations] = useState([]);
  
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
  
  // Premium models data
  const premiumModels = [
    {
      id: 'flux1-dev',
      name: 'Flux.1-dev-infer',
      category: 'Image Generation',
      description: 'Create stunning images from text descriptions',
      premium: true
    },
    {
      id: 'whisper-large',
      name: 'Whisper-large-v3-turbo',
      category: 'Audio Transcription',
      description: 'Transcribe audio to text with high accuracy',
      premium: true
    },
    {
      id: 'qwen2-72b',
      name: 'Qwen2-72B-Instruct',
      category: 'Language Model',
      description: 'Advanced language model for complex tasks',
      premium: true
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

  const handleExampleClick = (id) => {
    setActiveExample(id);
  };
  
  return (
    <div className="dashboard-container">
      <Header 
        appName="MCP Configuration Tool" 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/docs', label: 'Documentation' }
        ]}
        isAuthenticated={true}
        onSignOut={() => {
          console.log('Sign out clicked');
          window.location.href = '/';
        }}
      />
      
      <div className="header-actions">
        <a 
          href="/"
          className="direct-sign-out"
          onClick={(e) => {
            e.preventDefault();
            // Force redirect to home page
            document.location.replace('/');
          }}
        >
          Sign Out
        </a>
      </div>
      
      <main className="dashboard">
        <div className="dashboard-content">
          <WelcomeBanner 
            title="Welcome to the MCP Configuration Tool" 
            subtitle="Configure your AI assistant's capabilities"
            badgeText="Beta Release"
          />
          
          {/* Available Services Section */}
          <section className="services-section">
            <h2 className="section-title">Available Services</h2>
            <div className="services-grid">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
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
          
          {/* Premium Models Section */}
          <section className="models-section">
            <h2 className="section-title">Premium Models</h2>
            <div className="models-grid">
              {premiumModels.map(model => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          </section>
          
          {/* Your Configurations Section */}
          <section className="configurations-section">
            <h2 className="section-title">Your Configurations</h2>
            {configurations.length === 0 ? (
              <EmptyState 
                message="You haven't created any configurations yet"
                buttonText="Create New Configuration"
                onButtonClick={() => console.log('Create new configuration')}
              />
            ) : (
              <div className="configurations-grid">
                {/* Configuration cards would go here */}
              </div>
            )}
          </section>
          
          {/* Example Showcase Section */}
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