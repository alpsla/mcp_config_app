import React from 'react';
import '../../../styles/homepage.css';
import '../../../styles/common.css';

const Homepage = () => {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/assets/logos/logo.svg" alt="MCP Configuration Tool Logo" />
              <span>MCP Config</span>
            </div>
            <nav className="main-nav">
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Documentation</a></li>
              </ul>
            </nav>
            <div className="cta-buttons">
              <a href="#" className="btn btn-secondary">Log In</a>
              <a href="#" className="btn btn-primary">Sign Up Free</a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Simplify Your Claude AI Configuration</h1>
                <p className="hero-description">
                  MCP Config Tool makes it easy to set up and manage your Claude AI configurations with a user-friendly interface. No coding required.
                </p>
                <div className="hero-cta">
                  <a href="#" className="btn btn-primary btn-large">Get Started Free</a>
                  <a href="#" className="btn btn-secondary btn-large">View Demo</a>
                </div>
              </div>
              <div className="hero-image">
                <img src="/assets/illustrations/hero-illustration.svg" alt="MCP Configuration Tool Interface" />
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Why Choose MCP Config Tool?</h2>
              <p>Our platform offers everything you need to get the most out of Claude AI</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/assets/icons/icon-simplicity.svg" alt="Simplicity Icon" />
                </div>
                <h3>Easy to Use</h3>
                <p>Intuitive interface designed for users of all technical levels</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/assets/icons/icon-time.svg" alt="Time Icon" />
                </div>
                <h3>Save Time</h3>
                <p>Configure Claude AI in minutes instead of hours</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/assets/icons/icon-enhance.svg" alt="Enhance Icon" />
                </div>
                <h3>Enhance Capabilities</h3>
                <p>Unlock Claude's full potential with optimized configurations</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/assets/icons/icon-web-search.svg" alt="Web Search Icon" />
                </div>
                <h3>Web Search</h3>
                <p>Enable Claude to search the web for up-to-date information</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/assets/icons/icon-file-system.svg" alt="File System Icon" />
                </div>
                <h3>File System Access</h3>
                <p>Allow Claude to read and write files on your system</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <img src="/assets/icons/icon-hugging-face.svg" alt="Hugging Face Icon" />
                </div>
                <h3>Hugging Face Integration</h3>
                <p>Connect Claude to Hugging Face models for enhanced capabilities</p>
              </div>
            </div>
          </div>
        </section>

        <section className="user-types-section">
          <div className="container">
            <div className="section-header">
              <h2>Who Uses MCP Config Tool?</h2>
              <p>Our tool is designed for everyone who wants to get more from Claude AI</p>
            </div>
            <div className="user-types-grid">
              <div className="user-type-card">
                <div className="user-type-icon">
                  <img src="/assets/icons/icon-developer.svg" alt="Developer Icon" />
                </div>
                <h3>Developers</h3>
                <p>Integrate Claude AI into your applications with custom configurations</p>
              </div>
              <div className="user-type-card">
                <div className="user-type-icon">
                  <img src="/assets/icons/icon-researcher.svg" alt="Researcher Icon" />
                </div>
                <h3>Researchers</h3>
                <p>Configure Claude for data analysis and research assistance</p>
              </div>
              <div className="user-type-card">
                <div className="user-type-icon">
                  <img src="/assets/icons/icon-creator.svg" alt="Creator Icon" />
                </div>
                <h3>Content Creators</h3>
                <p>Set up Claude to assist with content creation and editing</p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Get started with MCP Config Tool in three simple steps</p>
            </div>
            <div className="steps-container">
              <div className="step">
                <div className="step-image">
                  <img src="/assets/illustrations/step1-illustration.svg" alt="Step 1: Create Account" />
                </div>
                <div className="step-content">
                  <div className="step-number">1</div>
                  <h3>Create Your Account</h3>
                  <p>Sign up for a free account to get started with MCP Config Tool</p>
                </div>
              </div>
              <div className="step">
                <div className="step-image">
                  <img src="/assets/illustrations/step2-illustration.svg" alt="Step 2: Configure" />
                </div>
                <div className="step-content">
                  <div className="step-number">2</div>
                  <h3>Configure Your Settings</h3>
                  <p>Use our intuitive interface to set up your Claude AI configuration</p>
                </div>
              </div>
              <div className="step">
                <div className="step-image">
                  <img src="/assets/illustrations/step3-illustration.svg" alt="Step 3: Connect" />
                </div>
                <div className="step-content">
                  <div className="step-number">3</div>
                  <h3>Connect and Use</h3>
                  <p>Connect your configuration to Claude and start using enhanced capabilities</p>
                </div>
              </div>
            </div>
            <div className="cta-container">
              <a href="#" className="btn btn-primary btn-large">Get Started Now</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/assets/logos/logo.svg" alt="MCP Configuration Tool Logo" />
              <span>MCP Config</span>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#">Features</a></li>
                  <li><a href="#">Pricing</a></li>
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">Changelog</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Community</a></li>
                  <li><a href="#">Tutorials</a></li>
                  <li><a href="#">API</a></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Cookie Policy</a></li>
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
