import React, { useEffect } from 'react';
import '../../styles/homepage.css';
import '../../styles/common.css';

const Homepage = () => {
  // Load the homepage script when component mounts
  useEffect(() => {
    // Import scripts asynchronously
    const loadScripts = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const homepageScript = await import('../../scripts/homepage.js');
        // eslint-disable-next-line no-unused-vars
        const commonScript = await import('../../scripts/common.js');
        console.log('Homepage scripts loaded successfully');
        
        // Initialize FAQ accordion
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
          const question = item.querySelector('.faq-question');
          if (question) {
            question.addEventListener('click', () => {
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
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };
    
    loadScripts();
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
              <div className="hero-image">
                <img src="/images/illustrations/hero-illustration.svg" alt="MCP Configuration Tool Interface" />
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
                  <img src="/images/icons/icon-simplicity.svg" alt="Simplicity Icon" />
                </div>
                <h3>Easy to Use</h3>
                <p>Intuitive interface designed for users of all technical levels. Configure Claude without writing a single line of code.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <img src="/images/icons/icon-time.svg" alt="Time Icon" />
                </div>
                <h3>Save Time</h3>
                <p>Configure Claude AI in minutes instead of hours. Our streamlined process gets you up and running quickly.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <img src="/images/icons/icon-enhance.svg" alt="Enhance Icon" />
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
                  <h3>Choose Your Tools</h3>
                  <p>Select which capabilities you want to enable for Claude, such as web search, file system access, or Hugging Face models.</p>
                  <img src="/images/illustrations/step1-illustration.svg" alt="Step 1: Choose Your Tools" />
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Configure Settings</h3>
                  <p>Customize the settings for each tool to match your specific needs and preferences.</p>
                  <img src="/images/illustrations/step2-illustration.svg" alt="Step 2: Configure Settings" />
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Enhance Claude</h3>
                  <p>Export your configuration and connect it to Claude to start using the enhanced capabilities.</p>
                  <img src="/images/illustrations/step3-illustration.svg" alt="Step 3: Enhance Claude" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/images/icons/icon-web-search.svg" alt="Web Search Icon" />
                </div>
                <h3>Web Search</h3>
                <p>Enable Claude to search the web for up-to-date information, enhancing responses with real-time data.</p>
                <span className="feature-badge free">Free</span>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/images/icons/icon-file-system.svg" alt="File System Icon" />
                </div>
                <h3>File System Access</h3>
                <p>Allow Claude to read and write files on your system, making document analysis and creation seamless.</p>
                <span className="feature-badge free">Free</span>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/images/icons/icon-hugging-face.svg" alt="Hugging Face Icon" />
                </div>
                <h3>Hugging Face Integration</h3>
                <p>Connect Claude to specialized Hugging Face models for enhanced capabilities and domain-specific tasks.</p>
                <div className="feature-badges">
                  <span className="feature-badge premium">Premium</span>
                  <span className="feature-badge desktop-only">Desktop Only</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing">
          <div className="container">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="pricing-subtitle">Beta pricing - Lock in these rates for 12 months after full release!</p>
            
            <div className="beta-badge">
              <span>Beta Pricing</span>
            </div>
            
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
                    <li><span className="feature-check">✓</span> Access to 3 pre-configured model integrations</li>
                    <li><span className="feature-check">✓</span> Basic search functionality</li>
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
                    <li><span className="feature-check">✓</span> Access to 6 model configurations</li>
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
                    <li><span className="feature-check">✓</span> Access to all 10 model configurations</li>
                    <li><span className="feature-check">✓</span> Unlimited saved configuration profiles</li>
                    <li><span className="feature-check">✓</span> Priority support</li>
                    <li><span className="feature-check">✓</span> Early access to new features</li>
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
                <div className="use-case-icon">
                  <img src="/images/icons/icon-developer.svg" alt="Developer Icon" />
                </div>
                <h3>Developers</h3>
                <p>Integrate Claude AI into your applications with custom configurations tailored to your specific development needs.</p>
              </div>
              <div className="use-case-card">
                <div className="use-case-icon">
                  <img src="/images/icons/icon-researcher.svg" alt="Researcher Icon" />
                </div>
                <h3>Researchers</h3>
                <p>Configure Claude for data analysis and research assistance, with specialized tools for academic and scientific work.</p>
              </div>
              <div className="use-case-card">
                <div className="use-case-icon">
                  <img src="/images/icons/icon-creator.svg" alt="Creator Icon" />
                </div>
                <h3>Content Creators</h3>
                <p>Set up Claude to assist with content creation and editing, with web search capabilities for fact-checking and research.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-accordion">
              <div className="faq-item">
                <div className="faq-question">
                  <h3>What is MCP Configuration Tool?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>MCP Configuration Tool is a user-friendly interface that allows you to configure and enhance Claude AI's capabilities, including web search, file system access, and integration with specialized AI models from Hugging Face.</p>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <h3>Do I need coding skills to use this tool?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>No, our tool is designed to be user-friendly for people of all technical levels. No coding required!</p>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <h3>How do I connect my configuration to Claude?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>After creating your configuration, you can export it as a JSON file and follow our simple instructions to connect it to your Claude instance.</p>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <h3>Is my data secure?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Yes, we take data security seriously. Your configurations are stored securely, and we don't have access to your Claude conversations or file system.</p>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <h3>Can I try it for free?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Absolutely! Our Free tier is completely free and includes essential features like web search and file system access.</p>
                </div>
              </div>
              <div className="faq-item">
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