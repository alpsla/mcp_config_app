import React, { useEffect } from 'react';
import '../../styles/pricing.css';
import '../../styles/common.css';

const Pricing = () => {
  useEffect(() => {
    // Import the script using dynamic import
    const loadScripts = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const pricingScript = await import('../../scripts/pricing.js');
        // eslint-disable-next-line no-unused-vars
        const commonScript = await import('../../scripts/common.js');
        
        // Log successful loading
        console.log('Scripts loaded successfully');
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };
    
    loadScripts();
    
    // Re-initialize FAQ accordion after component update
    setTimeout(() => {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
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
      });
      
      // Initialize the first FAQ item as open
      if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
      }
    }, 500); // Small delay to ensure DOM is ready
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
                <li><a href="/pricing" className="active">Pricing</a></li>
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
        <section className="pricing-hero">
          <div className="container">
            <h1>Simple, Transparent Pricing</h1>
            <p className="pricing-hero-subtitle">
              Beta pricing - Choose the plan that's right for you
            </p>
            <div className="beta-badge-large" style={{backgroundColor: "#e6f7ff", color: "#3A86FF", border: "2px solid #3A86FF"}}>
              <span style={{fontSize: "1.4rem", fontWeight: "700"}}>Beta Release Pricing</span>
              <p style={{color: "#1e40af", fontWeight: "500", fontSize: "1.1rem", marginTop: "8px"}}>Lock in these <strong>special rates</strong> for 12 months after full release!</p>
            </div>
          </div>
        </section>

        <section className="value-proposition">
          <div className="container">
            <h2 className="section-title">Why Choose MCP Config Tool?</h2>
            <div className="value-cards">
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h3>Boost Productivity</h3>
                <p>Configure Claude in minutes, not hours, with our intuitive interface designed for users of all technical levels.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔒</div>
                <h3>Secure & Private</h3>
                <p>Your configurations are stored securely, and we don't have access to your Claude conversations or file system.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>Unlock Potential</h3>
                <p>Enhance Claude's capabilities with web search, file access, and specialized AI models for domain-specific tasks.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-tiers">
          <div className="container">
            <h2 className="section-title">Choose Your Plan</h2>
            <div className="pricing-cards">
              <div className="pricing-card">
                <div className="pricing-card-header">
                  <h3>Free Forever</h3>
                  <div className="price">
                    <span className="price-amount">$0</span>
                    <span className="price-period">/mo</span>
                  </div>
                </div>
                <div className="pricing-card-features">
                  <ul>
                    <li><span className="check-icon">✓</span> 3 pre-configured model integrations</li>
                    <li><span className="check-icon">✓</span> Basic search functionality</li>
                    <li><span className="check-icon">✓</span> Community support</li>
                    <li><span className="check-icon">✓</span> Perfect for individual exploration</li>
                    <li><span className="x-icon">×</span> Advanced models and configurations</li>
                    <li><span className="x-icon">×</span> Priority support</li>
                  </ul>
                </div>
                <div className="pricing-card-cta">
                  <a href="/login" className="btn btn-primary">Get Started Free</a>
                </div>
              </div>
              
              <div className="pricing-card">
                <div className="pricing-card-header">
                  <h3>Basic</h3>
                  <div className="price">
                    <span className="price-amount">$2</span>
                    <span className="price-period">/mo</span>
                  </div>
                  <div className="beta-tag">Beta Price</div>
                </div>
                <div className="pricing-card-features">
                  <ul>
                    <li><span className="check-icon">✓</span> 6 model configurations</li>
                    <li><span className="check-icon">✓</span> Save up to 5 configuration profiles</li>
                    <li><span className="check-icon">✓</span> Email support</li>
                    <li><span className="check-icon">✓</span> Ideal for regular users</li>
                    <li><span className="x-icon">×</span> Advanced configuration options</li>
                    <li><span className="x-icon">×</span> Early access to new features</li>
                  </ul>
                </div>
                <div className="pricing-card-cta">
                  <a href="/login?plan=basic" className="btn btn-primary">Choose Basic</a>
                </div>
              </div>
              
              <div className="pricing-card popular">
                <div className="popular-badge">Most Popular</div>
                <div className="pricing-card-header">
                  <h3>Complete</h3>
                  <div className="price">
                    <span className="price-amount">$5</span>
                    <span className="price-period">/mo</span>
                  </div>
                  <div className="beta-tag">Beta Price</div>
                </div>
                <div className="pricing-card-features">
                  <ul>
                    <li><span className="check-icon">✓</span> All 10 model configurations</li>
                    <li><span className="check-icon">✓</span> Unlimited saved profiles</li>
                    <li><span className="check-icon">✓</span> Priority support</li>
                    <li><span className="check-icon">✓</span> Early access to new features</li>
                    <li><span className="check-icon">✓</span> Best for power users and developers</li>
                  </ul>
                </div>
                <div className="pricing-card-cta">
                  <a href="/login?plan=complete" className="btn btn-primary">Choose Complete</a>
                </div>
              </div>
            </div>
            
            <div className="hugging-face-notice">
              <div className="notice-icon">ℹ️</div>
              <p><strong>Important:</strong> Hugging Face integration is currently available only on desktop applications. Web integration is under development and will be available in a future update.</p>
            </div>
            
            <div className="early-adopter-callout">
              <h3>Special Beta Pricing</h3>
              <p>Lock in these discounted rates for 12 months after full release by signing up during our beta period. The Complete tier ($5/mo) is 30% less than the future Professional tier ($7/mo).</p>
            </div>
          </div>
        </section>

        <section className="comparison-table">
          <div className="container">
            <h2 className="section-title">Beta Phase Plan Comparison</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Free</th>
                    <th>Basic</th>
                    <th>Complete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    <td>$0/mo</td>
                    <td>$2/mo</td>
                    <td>$5/mo</td>
                  </tr>
                  <tr>
                    <td>Model Configurations</td>
                    <td>3</td>
                    <td>6</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>Saved Profiles</td>
                    <td>1</td>
                    <td>5</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td>Configuration Sharing</td>
                    <td>—</td>
                    <td>—</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Support</td>
                    <td>Community</td>
                    <td>Email</td>
                    <td>Priority</td>
                  </tr>
                  <tr>
                    <td>Early Access Features</td>
                    <td>—</td>
                    <td>—</td>
                    <td>✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="future-plans">
              <h3>Coming in Full Release</h3>
              <div className="future-tiers">
                <div className="future-tier">
                  <h4>Personal</h4>
                  <p className="future-price">$3<span>/month</span></p>
                  <p>or $29/year (20% savings)</p>
                  <ul>
                    <li>Access to 8 model configurations</li>
                    <li>Up to 10 saved configuration profiles</li>
                    <li>Educational discount available</li>
                  </ul>
                </div>
                <div className="future-tier">
                  <h4>Professional</h4>
                  <p className="future-price">$7<span>/month</span></p>
                  <p>or $67/year (20% savings)</p>
                  <ul>
                    <li>Unlimited model configurations</li>
                    <li>Unlimited saved configuration profiles</li>
                    <li>Full analytics dashboard</li>
                  </ul>
                </div>
                <div className="future-tier">
                  <h4>Team</h4>
                  <p className="future-price">$5<span>/user/month</span></p>
                  <p>(minimum 3 users)</p>
                  <ul>
                    <li>All Professional features</li>
                    <li>Role-based access controls</li>
                    <li>Volume discount: 10+ users get 15% off</li>
                  </ul>
                </div>
              </div>
              <div className="beta-benefit">
                <h4>Beta User Benefit</h4>
                <p>Sign up during beta and keep your current pricing for 12 months after full release!</p>
              </div>
            </div>
          </div>
        </section>

        <section className="use-cases">
          <div className="container">
            <h2 className="section-title">Who's Using MCP Config Tool?</h2>
            <div className="testimonial-cards">
              <div className="testimonial-card">
                <div className="testimonial-icon">
                  <img src="/images/icons/icon-developer.svg" alt="Developer Icon" />
                </div>
                <h3>Software Developers</h3>
                <p className="quote">"The MCP Config Tool has made it so much easier to integrate Claude into our development workflow."</p>
                <p className="author">Alex Chen, Lead Developer</p>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-icon">
                  <img src="/images/icons/icon-researcher.svg" alt="Researcher Icon" />
                </div>
                <h3>Academic Researchers</h3>
                <p className="quote">"Being able to connect specialized models to Claude has dramatically improved our research capabilities."</p>
                <p className="author">Dr. Sarah Johnson, University Research</p>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-icon">
                  <img src="/images/icons/icon-creator.svg" alt="Creator Icon" />
                </div>
                <h3>Content Creators</h3>
                <p className="quote">"Web search integration has made fact-checking and research so much more efficient."</p>
                <p className="author">Michael Torres, Content Strategist</p>
              </div>
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-accordion">
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>How does billing work?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>We bill monthly. You can upgrade, downgrade, or cancel your subscription at any time. Changes will be applied to your next billing cycle.</p>
                </div>
              </div>
              
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Do you offer refunds?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, simply contact our support team for a full refund.</p>
                </div>
              </div>
              
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Can I switch between plans?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.</p>
                </div>
              </div>
              
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Is there a free trial for paid plans?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>We don't offer free trials, but we do have a free Starter plan that you can use indefinitely, and a 14-day money-back guarantee on all paid plans.</p>
                </div>
              </div>
              
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>Do you offer discounts for annual billing?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Yes, we offer a 20% discount when you choose annual billing for any of our paid plans.</p>
                </div>
              </div>
              
              <div className="faq-item" onClick={(e) => e.currentTarget.classList.toggle('active')}>
                <div className="faq-question">
                  <h3>What payment methods do you accept?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal.</p>
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
            <h2>Ready to enhance your Claude experience?</h2>
            <p>Lock in beta pricing today and save up to 70% compared to our full release prices!</p>
            <div className="cta-buttons">
              <a href="/login" className="btn btn-primary btn-large">Start For Free</a>
              <a href="/contact" className="btn btn-secondary btn-large">Contact Sales</a>
            </div>
            <div className="beta-reminder">
              <p>Beta users keep their pricing for 12 months after full release</p>
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
      
      {/* Live Chat Button */}
      <div className="live-chat-button">
        <button className="chat-button">
          <span className="chat-icon">💬</span>
          <span className="chat-text">Chat with us</span>
        </button>
      </div>
    </>
  );
};

export default Pricing;