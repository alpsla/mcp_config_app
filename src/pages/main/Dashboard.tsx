import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import ConfigureButton from '../../components/dashboard/ConfigureButton';
import ComingSoonSection from '../../components/dashboard/ComingSoon';
import ReturningUserDashboard from '../../components/dashboard/ReturningUserDashboard';
import EmptyState from '../../components/dashboard/EmptyState';
import { useSafeNavigation } from '../../utils/navigation';
import ConfigurationService from '../../services/configurationService';
import './Dashboard.css';

/**
 * Main dashboard component that serves as the landing page after authentication
 */
const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const user = authState.user;
  const { navigateSafely } = useSafeNavigation();
  const [hasConfigurations, setHasConfigurations] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if the current route is the intro dashboard
  const isIntroDashboard = window.location.hash.includes('/dashboard/intro');

  // Load user configurations
  useEffect(() => {
    const loadConfigurations = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const configService = new ConfigurationService();
          const configs = await configService.getAllConfigurations(user.id);
          setHasConfigurations(configs && configs.length > 0);
        } catch (error) {
          console.error('Error loading configurations:', error);
          setHasConfigurations(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setHasConfigurations(false);
        setIsLoading(false);
      }
    };
    
    loadConfigurations();
  }, [user?.id]);

  // Get user's first name or email prefix for personalization
  const getUserName = (): string => {
    if (user?.user_metadata?.firstName) {
      return user.user_metadata.firstName;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  }

  const handleConfigureClick = () => {
    navigateSafely('/configure');
  };

  const handleEmptyStateButtonClick = (configType: string) => {
    navigateSafely('/configure');
  };

  return (
    <div className="dashboard-container">
      {isLoading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Welcome banner with user name if available */}
          <WelcomeBanner 
            title={`Welcome, ${getUserName()}!`}
            subtitle="Configure Claude's capabilities with MCP servers"
            badgeText="BETA"
          />
          
          {/* Show different dashboard based on configurations and route */}
          {(!isIntroDashboard && hasConfigurations) ? (
            /* Dashboard for users with existing configurations */
            <ReturningUserDashboard />
          ) : (
            /* Introductory dashboard for new users */
            <div className="intro-dashboard">
              {/* Models Demo Examples */}
              <section className="dashboard-section models-demo-section">
                <h2 className="section-title">Experience AI Capabilities</h2>
                <p className="section-description">Explore what's possible with specialized AI models integrated with Claude</p>
                
                <div className="models-demo-grid">
                  <div className="model-demo-card">
                    <div className="model-demo-icon image-icon">🖼️</div>
                    <h3>Create Images from Text</h3>
                    <p>Generate detailed images by simply describing what you want to see</p>
                    <div className="model-demo-example">
                      <div className="example-prompt">"Santa Claus on the beach giving Christmas gifts to sea creatures"</div>
                      <div className="example-result model-image-placeholder">
                        <img src="/assets/flux-santa-beach.jpg" alt="AI generated image of Santa on a beach with sea creatures" className="demo-image" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                      <div className="model-tag">Model: Flux.1</div>
                    </div>
                  </div>
                  
                  <div className="model-demo-card">
                    <div className="model-demo-icon audio-icon">🔊</div>
                    <h3>Generate Audio from Text</h3>
                    <p>Convert text into natural-sounding speech or create custom sound effects</p>
                    <div className="model-demo-example">
                      <div className="example-prompt">"Create upbeat holiday music with a tropical beach vibe"</div>
                      <div className="example-result audio-player-placeholder">
                        <div className="audio-player-controls">
                          <span className="play-button">▶️</span>
                          <div className="audio-timeline"></div>
                          <span className="audio-duration">00:30</span>
                        </div>
                      </div>
                      <div className="model-tag">Model: MusicGen</div>
                    </div>
                  </div>
                  
                  <div className="model-demo-card">
                    <div className="model-demo-icon video-icon">🎬</div>
                    <h3>Create Video from Text</h3>
                    <p>Transform your descriptions into animated video clips</p>
                    <div className="model-demo-example">
                      <div className="example-prompt">"Create an abstract visualization with dynamic patterns and vibrant colors"</div>
                      <div className="example-result video-player-placeholder">
                        <div className="video-player-controls">
                          <span className="play-button">▶️</span>
                        </div>
                      </div>
                      <div className="model-tag">Model: VideoGen</div>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* User Feedback Section */}
              <section className="dashboard-section user-feedback-section">
                <h2 className="section-title">User Feedback</h2>
                <p className="section-description">See what other users are saying about their experience</p>
                
                <div className="testimonials-grid">
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="user-avatar">JS</div>
                      <div className="user-info">
                        <h4>John S.</h4>
                        <div className="user-role">Data Scientist</div>
                      </div>
                      <div className="testimonial-rating">★★★★★</div>
                    </div>
                    <p className="testimonial-text">"Connecting Claude to my custom large language model revolutionized my workflow. I can now get specialized analyses that weren't possible before."</p>
                    <div className="testimonial-model">Using: <span className="model-tag">Qwen2-72B-Instruct</span></div>
                  </div>
                  
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="user-avatar">AK</div>
                      <div className="user-info">
                        <h4>Ava K.</h4>
                        <div className="user-role">UX Designer</div>
                      </div>
                      <div className="testimonial-rating">★★★★☆</div>
                    </div>
                    <p className="testimonial-text">"The integration with Stable Diffusion XL has been a game-changer for my design process. I can quickly visualize concepts directly within my Claude workspace."</p>
                    <div className="testimonial-model">Using: <span className="model-tag">Stable Diffusion XL</span></div>
                  </div>
                  
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="user-avatar">MR</div>
                      <div className="user-info">
                        <h4>Michael R.</h4>
                        <div className="user-role">Content Creator</div>
                      </div>
                      <div className="testimonial-rating">★★★★★</div>
                    </div>
                    <p className="testimonial-text">"Being able to transcribe audio files with Whisper and then analyze the content with Claude streamlined my podcast production workflow."</p>
                    <div className="testimonial-model">Using: <span className="model-tag">Whisper V3</span></div>
                  </div>
                </div>
              </section>
              
              {/* Available Services Section */}
              <section className="dashboard-section available-services-section">
                <h2 className="section-title">Available Services</h2>
                <p className="section-description">Enhance Claude with these powerful integrations</p>
                
                <div className="services-grid">
                  <div className="service-card">
                    <div className="service-icon file-system-icon">📂</div>
                    <h3>File System Access</h3>
                    <p>Allow Claude to read files from your computer securely</p>
                    <ul className="service-features">
                      <li>Access local documents</li>
                      <li>Analyze spreadsheets</li>
                      <li>Process code repositories</li>
                    </ul>
                    <div className="service-availability">Available on: <span className="platform-tag">Desktop</span></div>
                  </div>
                  
                  <div className="service-card">
                    <div className="service-icon web-search-icon">🔍</div>
                    <h3>Web Search</h3>
                    <p>Enable Claude to search the web for up-to-date information</p>
                    <ul className="service-features">
                      <li>Current events</li>
                      <li>Research data</li>
                      <li>Latest developments</li>
                    </ul>
                    <div className="service-availability">Available on: <span className="platform-tag">All Platforms</span></div>
                  </div>
                  
                  <div className="service-card">
                    <div className="service-icon huggingface-icon">🤗</div>
                    <h3>Hugging Face Models</h3>
                    <p>Extend Claude with specialized AI models for specific tasks</p>
                    <ul className="service-features">
                      <li>Image generation</li>
                      <li>Speech recognition</li>
                      <li>Custom language models</li>
                    </ul>
                    <div className="service-availability">Available on: <span className="platform-tag">Desktop</span></div>
                  </div>
                </div>
              </section>
              
              {/* Tier Comparison Section */}
              <section className="dashboard-section tier-comparison-section">
                <h2 className="section-title">Choose Your Perfect Tier</h2>
                <p className="section-description">Select the plan that best fits your needs</p>
                
                <div className="pricing-tiers">
                  <div className="pricing-tier free-tier">
                    <div className="tier-header">
                      <h3>Free Forever</h3>
                      <div className="tier-price">$0</div>
                      <div className="tier-period">forever</div>
                    </div>
                    <ul className="tier-features">
                      <li>3 pre-configured model integrations</li>
                      <li>Basic search functionality</li>
                      <li>Community support</li>
                      <li>Perfect for individual exploration</li>
                    </ul>
                    <button className="tier-button current-tier">Current Plan</button>
                  </div>
                  
                  <div className="pricing-tier basic-tier">
                    <div className="tier-header">
                      <h3>Basic</h3>
                      <div className="tier-price">$2</div>
                      <div className="tier-period">per month</div>
                    </div>
                    <div className="tier-badge">Popular</div>
                    <ul className="tier-features">
                      <li>6 model configurations</li>
                      <li>Save up to 5 configuration profiles</li>
                      <li>Email support</li>
                      <li>Ideal for regular users</li>
                    </ul>
                    <button className="tier-button upgrade-button">Upgrade</button>
                  </div>
                  
                  <div className="pricing-tier complete-tier">
                    <div className="tier-header">
                      <h3>Complete</h3>
                      <div className="tier-price">$5</div>
                      <div className="tier-period">per month</div>
                    </div>
                    <ul className="tier-features">
                      <li>All 10 model configurations</li>
                      <li>Unlimited saved profiles</li>
                      <li>Priority support</li>
                      <li>Early access to new features</li>
                      <li>Best for power users and developers</li>
                    </ul>
                    <button className="tier-button upgrade-button">Upgrade</button>
                  </div>
                </div>
                
                <div className="early-adopter-callout">
                  <div className="callout-icon">🎁</div>
                  <div className="callout-text">
                    <strong>Beta User? Lock In These Prices!</strong>
                    <p>Sign up now and keep these rates for a full year after our official launch.</p>
                  </div>
                </div>
              </section>
              
              {/* Get Started Section */}
              <section className="dashboard-section get-started-section">
                <h2 className="section-title">Ready to Get Started?</h2>
                <p className="section-description">Create your first configuration and unlock Claude's full potential</p>
                
                <div className="cta-container">
                  <button className="primary-cta" onClick={handleConfigureClick}>Create Your First Configuration</button>
                  <button className="secondary-cta" onClick={() => window.open('/documentation', '_blank')}>Learn More</button>
                </div>
              </section>
            </div>
          )}
          
          {/* Coming soon section for future features */}
          <ComingSoonSection />
        </>
      )}
    </div>
  );
};

export default Dashboard;
