import React from 'react';
import '../../../styles/pricing.css';
import '../../../styles/common.css';

const Pricing = () => {
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
                <li><a href="#" className="active">Pricing</a></li>
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
        <section className="pricing-hero-section">
          <div className="container">
            <div className="pricing-hero-content">
              <h1>Simple, Transparent Pricing</h1>
              <p className="pricing-hero-description">
                Choose the plan that's right for you and start configuring Claude AI today.
              </p>
              <div className="pricing-toggle">
                <span className="pricing-toggle-option active">Monthly</span>
                <label className="switch">
                  <input type="checkbox" id="billing-toggle" />
                  <span className="slider round"></span>
                </label>
                <span className="pricing-toggle-option">Annual <span className="discount-badge">Save 20%</span></span>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-tiers-section">
          <div className="container">
            <div className="pricing-tiers">
              {/* Free Tier */}
              <div className="pricing-tier">
                <div className="tier-header">
                  <h2 className="tier-name">Free</h2>
                  <p className="tier-description">For individuals just getting started</p>
                  <div className="tier-price">
                    <span className="price">$0</span>
                    <span className="period">/month</span>
                  </div>
                  <a href="#" className="btn btn-secondary btn-full-width">Get Started</a>
                </div>
                <div className="tier-features">
                  <h3>Features</h3>
                  <ul>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">3 configurations</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Basic web search capability</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Limited file system access</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Community support</span>
                    </li>
                    <li className="feature-disabled">
                      <span className="feature-x">×</span>
                      <span className="feature-text">Hugging Face integration</span>
                    </li>
                    <li className="feature-disabled">
                      <span className="feature-x">×</span>
                      <span className="feature-text">Configuration templates</span>
                    </li>
                    <li className="feature-disabled">
                      <span className="feature-x">×</span>
                      <span className="feature-text">Priority support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="pricing-tier featured">
                <div className="tier-badge">Most Popular</div>
                <div className="tier-header">
                  <h2 className="tier-name">Pro</h2>
                  <p className="tier-description">For professionals and small teams</p>
                  <div className="tier-price">
                    <span className="price">$19</span>
                    <span className="period">/month</span>
                  </div>
                  <a href="#" className="btn btn-primary btn-full-width">Get Started</a>
                </div>
                <div className="tier-features">
                  <h3>Everything in Free, plus:</h3>
                  <ul>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Unlimited configurations</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Advanced web search capability</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Full file system access</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Hugging Face integration</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">10 configuration templates</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Email support</span>
                    </li>
                    <li className="feature-disabled">
                      <span className="feature-x">×</span>
                      <span className="feature-text">Team collaboration</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enterprise Tier */}
              <div className="pricing-tier">
                <div className="tier-header">
                  <h2 className="tier-name">Enterprise</h2>
                  <p className="tier-description">For organizations with advanced needs</p>
                  <div className="tier-price">
                    <span className="price">$49</span>
                    <span className="period">/month</span>
                  </div>
                  <a href="#" className="btn btn-secondary btn-full-width">Contact Sales</a>
                </div>
                <div className="tier-features">
                  <h3>Everything in Pro, plus:</h3>
                  <ul>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Team collaboration</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Custom configuration templates</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Advanced analytics</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">API access</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">SSO integration</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Priority support</span>
                    </li>
                    <li>
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Dedicated account manager</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>How does billing work?</h3>
                <p>You'll be billed monthly or annually depending on your chosen billing cycle. You can change your plan or cancel at any time.</p>
              </div>
              <div className="faq-item">
                <h3>Can I upgrade or downgrade my plan?</h3>
                <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="faq-item">
                <h3>Is there a free trial?</h3>
                <p>Yes, you can try the Pro plan for 14 days before deciding if it's right for you. No credit card required.</p>
              </div>
              <div className="faq-item">
                <h3>What payment methods do you accept?</h3>
                <p>We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
              </div>
              <div className="faq-item">
                <h3>Do you offer refunds?</h3>
                <p>We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
              </div>
              <div className="faq-item">
                <h3>Do you offer discounts for non-profits or education?</h3>
                <p>Yes, we offer special pricing for non-profit organizations and educational institutions. Contact our sales team for details.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to get started?</h2>
              <p>Join thousands of users who are already using MCP Config Tool to enhance their Claude AI experience.</p>
              <div className="cta-buttons">
                <a href="#" className="btn btn-primary btn-large">Sign Up Free</a>
                <a href="#" className="btn btn-secondary btn-large">Contact Sales</a>
              </div>
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

export default Pricing;
