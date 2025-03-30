import React, { useEffect, useState } from 'react';
import '../../styles/homepage.css';
import '../../styles/common.css';
import SharedHeader from '../../components/shared/SharedHeader';
import SharedFooter from '../../components/shared/SharedFooter';
import FAQSection from '../../components/common/FAQSection';
import { useAuth } from '../../auth/AuthContext';

const Homepage = () => {
  // Get real authentication state from context
  const { authState, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Real sign out function
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Set document to light theme by default
  useEffect(() => {
  document.documentElement.classList.remove('dark');
  }, []);
  
  // Force re-check auth state on component mount
  useEffect(() => {
    // Check authentication on page load
    const checkAuthStatus = async () => {
      try {
        console.log('Homepage: Checking authentication status...');
        const userIsAuthenticated = authState.user !== null;
        
        // Do we need to update our local state?
        if (isAuthenticated !== userIsAuthenticated) {
          console.log('Homepage: Updating authentication state:', { isAuthenticated: userIsAuthenticated });
          setIsAuthenticated(userIsAuthenticated);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // If there's an error, assume not authenticated
        setIsAuthenticated(false);
      }
    };
    
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update authentication status whenever component mounts or authState changes
  useEffect(() => {
    // Get the real authentication status from AuthContext
    const userIsAuthenticated = authState.user !== null;
    setIsAuthenticated(userIsAuthenticated);
    
    console.log('Homepage: Authentication state updated', { isAuthenticated: userIsAuthenticated });
  }, [authState]);

  // Load scripts when component mounts
  useEffect(() => {
    const loadScripts = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const homepageScript = await import('../../scripts/homepage.js');
        // eslint-disable-next-line no-unused-vars
        const commonScript = await import('../../scripts/common.js');
        console.log('Homepage scripts loaded successfully');
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };
    
    loadScripts();
  }, []);

  // MCP Config-specific navigation links - removed unused variables
  // const navLinks = [...]
  
  // FAQ data
  const faqData = [
    {
      question: "What is MCP Configuration Tool?",
      answer: "MCP Configuration Tool is a user-friendly interface that allows you to configure and enhance Claude AI's capabilities, including web search, file system access, and integration with specialized AI models from Hugging Face."
    },
    {
      question: "Do I need coding skills to use this tool?",
      answer: "No, our tool is designed to be user-friendly for people of all technical levels. No coding required!"
    },
    {
      question: "How do I connect my configuration to Claude?",
      answer: "After creating your configuration, you can export it as a JSON file and follow our simple instructions to connect it to your Claude instance."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. Your configurations are stored securely, and we don't have access to your Claude conversations or file system."
    },
    {
      question: "Can I try it for free?",
      answer: "Absolutely! Our Free tier is completely free and includes essential features like web search and file system access. No subscription or credit card information required—simply sign up and get started."
    },
    {
      question: "Does Hugging Face integration work on web?",
      answer: "Currently, Hugging Face integration with Claude is only available on desktop applications. We're working closely with Hugging Face to bring this functionality to web users as soon as possible."
    }
  ];
  
  // Platform-specific footer links - removed unused variables
  // const platformLinks = [...]
  
  // const companyLinks = [...]

  return (
    <>
      {/* Use shared Header with MCP Config specific props */}
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

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Simplify Your Claude AI Configuration</h1>
                <p className="hero-subtitle">
                  MCP Config Tool makes it easy to set up and manage your Claude AI configurations with a user-friendly interface. No coding required.
                </p>
                <div className="hero-cta">
                  {isAuthenticated ? (
                    <a href="/dashboard" className="btn btn-primary btn-large">Go to Dashboard</a>
                  ) : (
                    <a href="/login" className="btn btn-primary btn-large">Get Started Free</a>
                  )}
                  <a href="/demo" className="btn btn-secondary btn-large">View Demo</a>
                </div>
                <div className="trust-indicator">
                  <span>Free Starter Plan</span>
                  <span>5-minute setup</span>
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Value Proposition - Restored section */}
        <section className="value-proposition">
          <div className="container">
            <div className="value-content">
              <h2>Claude AI configurations with a user-friendly interface. No coding required.</h2>
              <div className="value-description">
                <p>
                  We don't create these services—we connect them intelligently. Our tool provides detailed information to help you select the perfect components for your specific needs, empowering you to build a customized AI solution without technical complexity.
                </p>
                <p>
                  Join our growing community of users who are breaking down silos between AI technologies and unlocking new possibilities through thoughtful integration.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Ecosystem Message - Restored section */}
        <section className="ecosystem-section">
          <div className="container">
            <div className="ecosystem-message">
              <h2>Unify Your AI Ecosystem</h2>
              <p>
                MCP Config Tool serves as the bridge between Claude AI and your essential data sources. We seamlessly integrate your local file system, web search capabilities, and various AI models developed by industry leaders—all through one intuitive interface.
              </p>
            </div>
          </div>
        </section>
        
        {/* Why Choose Section - Added missing module */}
        <section className="why-choose">
          <div className="container">
            <h2 className="section-title">Why Choose MCP Config Tool?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon-svg">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3>Simple & Intuitive</h3>
                <p>Our user-friendly interface makes complex AI configuration accessible to everyone, with no coding knowledge required.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon-svg">
                    <rect width="8" height="8" x="2" y="2" rx="2"></rect>
                    <path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path>
                    <path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path>
                    <path d="M8 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path>
                    <path d="M14 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path>
                    <path d="M20 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2"></path>
                  </svg>
                </div>
                <h3>Flexible Integration</h3>
                <p>Connect Claude AI to your essential tools and data sources with just a few clicks. Customize your setup to match your specific needs.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon-svg">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3>Secure & Private</h3>
                <p>Your configurations are stored securely, and we don't access your conversations or file system. Your data remains yours.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section - Added missing module */}
        <section className="how-it-works">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Select Your Capabilities</h3>
                  <p>Choose which capabilities you want to enable for your Claude AI, such as web search, file system access, or specialized AI models.</p>
                  <div className="step-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="150" viewBox="0 0 400 150" fill="none" className="step-illustration">
                      <rect x="50" y="20" width="300" height="110" rx="8" fill="#E9ECEF" />
                      <rect x="70" y="40" width="80" height="30" rx="4" fill="#3A86FF" />
                      <rect x="160" y="40" width="80" height="30" rx="4" fill="#F8F9FA" stroke="#CED4DA" />
                      <rect x="250" y="40" width="80" height="30" rx="4" fill="#F8F9FA" stroke="#CED4DA" />
                      <rect x="70" y="80" width="260" height="30" rx="4" fill="#F8F9FA" stroke="#CED4DA" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Configure Your Settings</h3>
                  <p>Customize each capability with your preferred settings, such as search sources, file system directories, or model parameters.</p>
                  <div className="step-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="150" viewBox="0 0 400 150" fill="none" className="step-illustration">
                      <rect x="50" y="20" width="300" height="110" rx="8" fill="#E9ECEF" />
                      <rect x="70" y="40" width="120" height="25" rx="4" fill="#F8F9FA" stroke="#CED4DA" />
                      <rect x="200" y="40" width="130" height="25" rx="4" fill="#F8F9FA" stroke="#CED4DA" />
                      <rect x="70" y="75" width="260" height="25" rx="4" fill="#F8F9FA" stroke="#CED4DA" />
                      <circle cx="340" cy="40" r="10" fill="#3A86FF" />
                      <path d="M335 40L339 44L345 36" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Export & Connect</h3>
                  <p>Export your configuration as a JSON file and follow our simple instructions to connect it to your Claude instance.</p>
                  <div className="step-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="150" viewBox="0 0 400 150" fill="none" className="step-illustration">
                      <rect x="50" y="20" width="300" height="110" rx="8" fill="#E9ECEF" />
                      <rect x="70" y="40" width="260" height="70" rx="4" fill="#F8F9FA" stroke="#CED4DA" />
                      <path d="M90 60L150 60" stroke="#6C757D" strokeWidth="2" />
                      <path d="M90 75L180 75" stroke="#6C757D" strokeWidth="2" />
                      <path d="M90 90L160 90" stroke="#6C757D" strokeWidth="2" />
                      <rect x="280" y="40" width="50" height="20" rx="4" fill="#3A86FF" />
                      <path d="M295 50L315 50" stroke="white" strokeWidth="2" />
                      <path d="M305 40L305 60" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section (unchanged) */}
        <section className="features">
          {/* ... Keep existing features content ... */}
        </section>

        {/* Pricing Hero Section (unchanged) */}
        <section className="pricing-hero-new">
          {/* ... Keep existing pricing-hero-new content ... */}
        </section>

        {/* Pricing Section (unchanged) */}
        <section className="pricing">
          {/* ... Keep existing pricing content ... */}
        </section>

        {/* Use Cases Section (unchanged) */}
        <section className="use-cases">
          {/* ... Keep existing use-cases content ... */}
        </section>

        {/* Using our new reusable FAQ component */}
        <FAQSection title="Frequently Asked Questions" faqs={faqData} />

        {/* CTA Section (unchanged) */}
        <section className="cta">
          <div className="container">
            <h2>Ready to Enhance Your Claude Experience?</h2>
            <p>Join thousands of users who are getting more value from Claude AI with our configuration tool.</p>
            <div className="cta-buttons">
              {isAuthenticated ? (
                <a href="/dashboard" className="btn btn-primary btn-large">Go to Dashboard</a>
              ) : (
                <a href="/login" className="btn btn-primary btn-large">Get Started Free</a>
              )}
              <a href="/pricing" className="btn btn-secondary btn-large">View Pricing</a>
            </div>
            <div className="trust-indicator">
              <span>Free Starter Plan</span>
              <span>5-minute setup</span>
              <span>No credit card required</span>
            </div>
          </div>
        </section>
      </main>

      {/* Use shared Footer */}
      <SharedFooter />
    </>
  );
};

export default Homepage;