import React, { useEffect, useRef } from 'react';
import '../../styles/homepage.css';
import '../../styles/common.css';

const Homepage = () => {
  const faqInitializedRef = useRef(false);

  // Function to toggle FAQ items
  const toggleFAQ = (e) => {
    const item = e.currentTarget;
    item.classList.toggle('active');
    
    // Close other items
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
  };

  // Load the homepage script when component mounts
  useEffect(() => {
    // Initialize FAQ accordion
    const initFAQ = () => {
      if (faqInitializedRef.current) return; // Prevent multiple initializations
      
      const faqItems = document.querySelectorAll('.faq-item');
      if (!faqItems || faqItems.length === 0) return; // No items found yet
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
          // Remove any existing listeners to prevent duplicates
          const newQuestion = question.cloneNode(true);
          question.parentNode.replaceChild(newQuestion, question);
          
          newQuestion.addEventListener('click', () => {
            // Toggle active class on the clicked item
            item.classList.toggle('active');
            
            // Close other items
            faqItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
              }
            });
          });
        }
      });
      
      // Initialize the first FAQ item as open
      if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
      }
      
      faqInitializedRef.current = true;
    };

    // Import scripts asynchronously
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
      
      // Initialize FAQ after scripts load or fail
      initFAQ();
    };
    
    loadScripts();
    
    // Set a series of timeouts to ensure FAQ is initialized
    const timeouts = [100, 500, 1000, 2000].map(time => {
      return setTimeout(initFAQ, time);
    });
    
  // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/images/logos/logo.svg" alt="MCP Configuration Tool Logo" />
              <span>MCP Config</span>
            </div>
            <nav className="main-nav">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/#features">Features</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/docs">Documentation</a></li>
              </ul>
            </nav>
            <div className="auth-buttons">
              <a href="/login" className="btn btn-secondary">Log In</a>
              <a href="/login" className="btn btn-primary">Sign Up Free</a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Simplify Your Claude AI Configuration</h1>
                <p className="hero-subtitle">
                  MCP Config Tool makes it easy to set up and manage your Claude AI configurations with a user-friendly interface. No coding required.
                </p>
                <div className="hero-cta">
                  <a href="/login" className="btn btn-primary btn-large">Get Started Free</a>
                  <a href="/demo" className="btn btn-secondary btn-large">View Demo</a>
                </div>
                <div className="trust-indicator">
                  <span>Free Starter Plan</span>
                  <span>5-minute setup</span>
                  <span>No credit card required</span>
                </div>
              </div>
              <div className="ecosystem-message">
                <h2>Unify Your AI Ecosystem</h2>
                <p>
                  MCP Config Tool serves as the bridge between Claude AI and your essential data sources. We seamlessly integrate your local file system, web search capabilities, and various AI models developed by industry leaders—all through one intuitive interface.
                </p>
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

        <section className="benefits">
          <div className="container">
            <h2 className="section-title">Why Choose MCP Config Tool?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#3A86FF" />
                    <rect x="25" y="30" width="50" height="40" rx="5" fill="white" />
                    <circle cx="50" cy="75" r="5" fill="white" />
                    <path d="M33,42 h15" stroke="#3A86FF" stroke-width="3" stroke-linecap="round" />
                    <path d="M33,50 h34" stroke="#3A86FF" stroke-width="3" stroke-linecap="round" />
                    <path d="M33,58 h34" stroke="#3A86FF" stroke-width="3" stroke-linecap="round" />
                    <circle cx="62" cy="42" r="6" fill="#3A86FF" />
                    <path d="M62,39 v6" stroke="white" stroke-width="2" stroke-linecap="round" />
                    <path d="M59,42 h6" stroke="white" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>
                <h3>Easy to Use</h3>
                <p>Intuitive interface designed for users of all technical levels. Configure Claude without writing a single line of code.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#3A86FF" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="white" stroke-width="4" />
                    <path d="M50,30 L50,50 L65,55" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <h3>Save Time</h3>
                <p>Configure Claude AI in minutes instead of hours. Our streamlined process gets you up and running quickly.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#3A86FF" />
                    <path d="M30,60 L50,30 L70,60" stroke="white" stroke-width="4" fill="none" />
                    <path d="M40,45 L60,45" stroke="white" stroke-width="4" />
                    <path d="M35,52 L65,52" stroke="white" stroke-width="4" />
                    <path d="M30,60 L70,60" stroke="white" stroke-width="4" />
                  </svg>
                </div>
                <h3>Enhance Capabilities</h3>
                <p>Unlock Claude's full potential with optimized configurations. Get more value from your AI assistant.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Choose Your Configuration</h3>
                  <p>Select between a Basic setup with Web Search and File System access, or an Advanced setup with additional AI models from Hugging Face.</p>
                  <img src="/images/illustrations/step1-illustration.svg" alt="Step 1: Choose Your Configuration" />
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Customize Your Tools</h3>
                  <p>With Advanced setup, select from our curated collection of 10 specialized AI models based on your subscription tier.</p>
                  <img src="/images/illustrations/step2-illustration.svg" alt="Step 2: Customize Your Tools" />
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Export & Enhance Claude</h3>
                  <p>Export your configuration and connect it to Claude to start using your enhanced capabilities immediately.</p>
                  <img src="/images/illustrations/step3-illustration.svg" alt="Step 3: Export & Enhance Claude" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Configuration Options</h2>
            <div className="configuration-options">
              <div className="option-card basic">
                <div className="option-header">
                  <h3>Basic Configuration</h3>
                  <div className="option-badge free">Free</div>
                </div>
                <p>The essential tools to enhance your Claude AI experience.</p>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <img src="/images/icons/icon-web-search.svg" alt="Web Search Icon" />
                    </div>
                    <h4>Web Search</h4>
                    <p>Enable Claude to search the web for up-to-date information, enhancing responses with real-time data.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <img src="/images/icons/icon-file-system.svg" alt="File System Icon" />
                    </div>
                    <h4>File System Access</h4>
                    <p>Allow Claude to read and write files on your system, making document analysis and creation seamless.</p>
                  </div>
                </div>
              </div>
              
              <div className="option-divider">
                <span>and</span>
              </div>
              
              <div className="option-card premium">
                <div className="option-header">
                  <h3>Advanced AI Models</h3>
                  <div className="option-badge premium">Premium</div>
                </div>
                <p>Includes <strong>Basic Configuration</strong> plus specialized AI models from Hugging Face.</p>
                <div className="feature-card hugging-face">
                  <div className="feature-icon">
                    <img src="/images/icons/icon-hugging-face.svg" alt="Hugging Face Icon" />
                  </div>
                  <h4>Hugging Face Integration</h4>
                  <p>Connect Claude to specialized Hugging Face models for enhanced capabilities and domain-specific tasks.</p>
                  <div className="plan-options">
                    <div className="plan-option">
                      <span className="plan-name">Basic Plan:</span>
                      <span className="plan-detail">3 models</span>
                    </div>
                    <div className="plan-option">
                      <span className="plan-name">Complete Plan:</span>
                      <span className="plan-detail">10 models</span>
                    </div>
                  </div>
                  <div className="desktop-only-badge">Desktop Only</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-hero-new">
          <div className="container">
            <div className="pricing-hero-content">
              <h1>Simple, Transparent Pricing</h1>
              <p className="pricing-tagline">Beta pricing - Choose the plan that's right for you</p>
              
              <div className="pricing-card">
                <div className="pricing-card-header">
                  <div className="pricing-card-icon">🚀</div>
                  <h2>Beta Release Pricing</h2>
                </div>
                <div className="pricing-card-body">
                  <div className="pricing-message">
                    Lock in these <strong>special rates</strong> for 12 months after full release!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing">
          <div className="container">
            <div className="pricing-tiers">
              <div className="tier-card">
                <div className="tier-header">
                  <h3 className="tier-name">Free</h3>
                  <div className="tier-price">
                    <span className="price-amount">$0</span>
                    <span className="price-period">/month</span>
                  </div>
                </div>
                <div className="tier-features">
                  <ul>
                    <li><span className="feature-check">✓</span> <strong>Basic Configuration</strong></li>
                    <li><span className="feature-check">✓</span> Web Search functionality</li>
                    <li><span className="feature-check">✓</span> File System access</li>
                    <li><span className="feature-check">✓</span> Community support</li>
                  </ul>
                </div>
                <div className="tier-action">
                  <a href="/login" className="btn btn-primary">Get Started</a>
                </div>
              </div>
              <div className="tier-card">
                <div className="tier-header">
                  <h3 className="tier-name">Basic</h3>
                  <div className="tier-price">
                    <span className="price-amount">$2</span>
                    <span className="price-period">/month</span>
                  </div>
                </div>
                <div className="tier-features">
                  <ul>
                    <li><span className="feature-check">✓</span> <strong>Basic Configuration</strong></li>
                    <li><span className="feature-check">✓</span> <strong>+ 3 Hugging Face Models</strong></li>
                    <li><span className="feature-check">✓</span> Saved configuration profiles (up to 5)</li>
                    <li><span className="feature-check">✓</span> Email support</li>
                  </ul>
                </div>
                <div className="tier-action">
                  <a href="/login?plan=basic" className="btn btn-primary">Choose Basic</a>
                </div>
              </div>
              <div className="tier-card popular">
                <div className="popular-badge">Most Popular</div>
                <div className="tier-header">
                  <h3 className="tier-name">Complete</h3>
                  <div className="tier-price">
                    <span className="price-amount">$5</span>
                    <span className="price-period">/month</span>
                  </div>
                </div>
                <div className="tier-features">
                  <ul>
                    <li><span className="feature-check">✓</span> <strong>Basic Configuration</strong></li>
                    <li><span className="feature-check">✓</span> <strong>+ 10 Hugging Face Models</strong></li>
                    <li><span className="feature-check">✓</span> Unlimited saved configurations</li>
                    <li><span className="feature-check">✓</span> Priority support</li>
                    <li><span className="feature-check">✓</span> Early access to new models</li>
                  </ul>
                </div>
                <div className="tier-action">
                  <a href="/login?plan=complete" className="btn btn-primary">Choose Complete</a>
                </div>
              </div>
            </div>
            
            <div className="desktop-notice">
              <div className="notice-icon">ℹ️</div>
              <p><strong>Important:</strong> Hugging Face integration is currently available only on desktop applications. Web support coming soon!</p>
            </div>
            
            <div className="coming-soon">
              <h3>Coming in Full Release</h3>
              <p>New pricing tiers with annual discounts: Personal ($3/mo), Professional ($7/mo), and Team ($5/user/mo)</p>
              <p>Beta users will keep their current pricing for 12 months after our full release.</p>
            </div>
          </div>
        </section>

        <section className="use-cases">
          <div className="container">
            <h2 className="section-title">Who Uses MCP Config Tool?</h2>
            <div className="use-cases-grid">
              <div className="use-case-card">
                <div className="use-case-icon developer">
                  <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#3A86FF" />
                    <path d="M35,45 L25,50 L35,55" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M65,45 L75,50 L65,55" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M45,65 L55,35" stroke="white" stroke-width="4" stroke-linecap="round" />
                  </svg>
                </div>
                <div className="use-case-content">
                  <h3>Developers</h3>
                  <p>Integrate Claude AI into your applications with custom configurations tailored to your specific development needs.</p>
                  <ul className="use-case-features">
                    <li>Connect to local development environments</li>
                    <li>Add AI capabilities to your applications</li>
                    <li>Customize response handling</li>
                  </ul>
                </div>
              </div>
              <div className="use-case-card">
                <div className="use-case-icon researcher">
                  <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#8338EC" />
                    <circle cx="40" cy="40" r="12" fill="none" stroke="white" stroke-width="4" />
                    <path d="M48,48 L65,65" stroke="white" stroke-width="4" stroke-linecap="round" />
                    <path d="M30,70 L70,70" stroke="white" stroke-width="4" stroke-linecap="round" />
                    <path d="M40,60 L40,70" stroke="white" stroke-width="4" stroke-linecap="round" />
                    <path d="M60,60 L60,70" stroke="white" stroke-width="4" stroke-linecap="round" />
                  </svg>
                </div>
                <div className="use-case-content">
                  <h3>Researchers</h3>
                  <p>Configure Claude for data analysis and research assistance, with specialized tools for academic and scientific work.</p>
                  <ul className="use-case-features">
                    <li>Access specialized research models</li>
                    <li>Process large datasets efficiently</li>
                    <li>Create custom research workflows</li>
                  </ul>
                </div>
              </div>
              <div className="use-case-card">
                <div className="use-case-icon creator">
                  <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#FF006E" />
                    <rect x="30" y="35" width="40" height="30" rx="2" fill="white" />
                    <circle cx="50" cy="50" r="5" fill="#FF006E" />
                    <path d="M35,70 L65,70" stroke="white" stroke-width="4" stroke-linecap="round" />
                    <path d="M50,65 L50,75" stroke="white" stroke-width="4" stroke-linecap="round" />
                    <path d="M30,40 L30,60" stroke="white" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2" />
                    <path d="M70,40 L70,60" stroke="white" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2" />
                  </svg>
                </div>
                <div className="use-case-content">
                  <h3>Content Creators</h3>
                  <p>Set up Claude to assist with content creation and editing across multiple media formats, with web search capabilities for research and fact-checking.</p>
                  <ul className="use-case-features">
                    <li>Generate blog posts and marketing content</li>
                    <li>Enhance audio and video editing workflows</li>
                    <li>Create optimized prompts for image generation</li>
                    <li>Verify facts in real-time</li>
                    <li>Streamline content production pipelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

      <section className="faq">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-accordion">
              {/* Using onClick handlers directly on each item */}
              <div className="faq-item active" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>What is MCP Configuration Tool?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>MCP Configuration Tool is a user-friendly interface that allows you to configure and enhance Claude AI's capabilities, including web search, file system access, and integration with specialized AI models from Hugging Face.</p>
                </div>
              </div>
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Do I need coding skills to use this tool?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>No, our tool is designed to be user-friendly for people of all technical levels. No coding required!</p>
                </div>
              </div>
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>How do I connect my configuration to Claude?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>After creating your configuration, you can export it as a JSON file and follow our simple instructions to connect it to your Claude instance.</p>
                </div>
              </div>
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Is my data secure?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Yes, we take data security seriously. Your configurations are stored securely, and we don't have access to your Claude conversations or file system.</p>
                </div>
              </div>
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Can I try it for free?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Absolutely! Our Free tier is completely free and includes essential features like web search and file system access. No subscription or credit card information required—simply sign up and get started.</p>
                </div>
              </div>
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Does Hugging Face integration work on web?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Currently, Hugging Face integration with Claude is only available on desktop applications. We're working closely with Hugging Face to bring this functionality to web users as soon as possible.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to Enhance Your Claude Experience?</h2>
            <p>Join thousands of users who are getting more value from Claude AI with our configuration tool.</p>
            <div className="cta-buttons">
              <a href="/login" className="btn btn-primary btn-large">Get Started Free</a>
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

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/images/logos/logo.svg" alt="MCP Configuration Tool Logo" />
              <span>MCP Config</span>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="/#features">Features</a></li>
                  <li><a href="/pricing">Pricing</a></li>
                  <li><a href="/docs">Documentation</a></li>
                  <li><a href="/changelog">Changelog</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/careers">Careers</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="/help">Help Center</a></li>
                  <li><a href="/community">Community</a></li>
                  <li><a href="/tutorials">Tutorials</a></li>
                  <li><a href="/api">API</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                  <li><a href="/cookies">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 MCP Configuration Tool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Homepage;