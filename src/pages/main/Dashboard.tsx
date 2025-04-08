import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import ComingSoonSection from '../../components/dashboard/ComingSoon';
import ReturningUserDashboard from '../../components/dashboard/ReturningUserDashboard';
import ConfigurationService from '../../services/configurationService';
import pricing from '../../config/pricing'; // Import pricing configuration
import './Dashboard.css';

/**
 * Main dashboard component that serves as the landing page after authentication
 */
const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const user = authState.user;
  const [hasConfigurations, setHasConfigurations] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Media player states
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  
  // Function to handle audio playback
  const toggleAudioPlayback = () => {
    const audio = document.getElementById('demoAudio') as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setAudioPlaying(true);
      } else {
        audio.pause();
        setAudioPlaying(false);
      }
    }
  };
  
  // Function to handle video playback
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setVideoPlaying(false);
      }
    }
  };
  
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
    window.location.hash = '#/configure';
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
                        <img 
                          src="/assets/images/flux-santa-beach.jpg" 
                          alt="Santa on a beach with sea creatures" 
                          className="demo-image" 
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                            e.currentTarget.style.display = 'none';
                          }} 
                        />
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
                        <audio 
                          src="/assets/audio/musicgen-tropical-christmas.wav" 
                          id="demoAudio" 
                          style={{display: 'none'}}
                          onError={(e) => {
                            console.error('Audio failed to load:', e);
                          }}
                          onEnded={() => setAudioPlaying(false)}
                        ></audio>
                        <div className="audio-player-controls">
                          <span 
                            className={`play-button ${audioPlaying ? 'playing' : ''}`}
                            onClick={toggleAudioPlayback}
                          >
                            {audioPlaying ? '⏸️' : '▶️'}
                          </span>
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
                        <div className="video-container" style={{ position: 'relative' }}>
                          <video 
                            src="/assets/videos/videogen-abstract-visualization.mp4" 
                            id="demoVideo"
                            style={{maxWidth: '100%', borderRadius: '8px', display: 'block'}}
                            onError={(e) => {
                              console.error('Video failed to load:', e);
                              const controls = document.querySelector('.video-player-controls') as HTMLElement;
                              if (controls) controls.style.display = 'flex';
                              e.currentTarget.style.display = 'none';
                            }}
                            onEnded={() => setVideoPlaying(false)}
                            ref={videoRef}
                          ></video>
                          
                          {/* Custom play/pause button overlay */}
                          <div 
                            className="video-play-overlay"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              opacity: videoPlaying ? '0' : '1',
                              transition: 'opacity 0.3s ease',
                              pointerEvents: videoPlaying ? 'none' : 'auto',
                            }}
                            onClick={toggleVideoPlayback}
                          >
                            <span 
                              className="play-button video-play-button"
                              style={{ fontSize: '36px' }}
                            >
                              {videoPlaying ? '⏸️' : '▶️'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="video-player-controls" style={{display: 'none'}}>
                          <span 
                            className={`play-button ${videoPlaying ? 'playing' : ''}`}
                            onClick={toggleVideoPlayback}
                          >
                            {videoPlaying ? '⏸️' : '▶️'}
                          </span>
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
                    <div className="service-icon file-system-icon" style={{ fontSize: '40px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(78, 93, 222, 0.1)' }}>📂</div>
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
                    <div className="service-icon web-search-icon" style={{ fontSize: '40px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(78, 93, 222, 0.1)' }}>🔍</div>
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
                    <div className="service-icon huggingface-icon" style={{ fontSize: '40px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(78, 93, 222, 0.1)' }}>🤗</div>
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
              
              {/* Tier Comparison Section using pricing config */}
              <section className="dashboard-section tier-comparison-section">
                <h2 className="section-title">Choose Your Perfect Tier</h2>
                <p className="section-description">Select the plan that best fits your needs</p>
                
                <div className="pricing-tiers">
                  {/* Use pricing configuration for tier cards */}
                  {pricing.tiers.map((tier) => (
                    <div key={tier.id} className={`pricing-tier ${tier.id}-tier`} style={{ 
                      borderColor: tier.lightColor,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      margin: '10px' 
                    }}>
                      <div className="tier-header" style={{ 
                        backgroundColor: tier.lightColor,
                        padding: '15px',
                        textAlign: 'center' 
                      }}>
                        <h3 style={{ 
                          margin: '0',
                          color: tier.color,
                          fontWeight: 600
                        }}>{tier.displayName}</h3>
                        <div className="tier-price" style={{ 
                          fontSize: '24px',
                          fontWeight: 'bold',
                          marginTop: '5px' 
                        }}>{tier.price.monthly === 0 ? 'Free' : `$${tier.price.monthly}`}</div>
                        <div className="tier-period" style={{ 
                          fontSize: '14px',
                          color: '#666' 
                        }}>{tier.price.monthly === 0 ? 'forever' : 'per month'}</div>
                      </div>
                      {tier.popular && (
                        <div className="tier-badge" style={{ 
                          position: 'absolute',
                          top: '0',
                          right: '15px',
                          backgroundColor: tier.color,
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '0 0 5px 5px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>{tier.badge}</div>
                      )}
                      
                      <ul className="tier-features" style={{ 
                        listStyle: 'none',
                        padding: '15px',
                        margin: '0',
                        flexGrow: 1 
                      }}>
                        {/* Display features that are included for this tier */}
                        {tier.features
                          .filter(feature => feature.included)
                          .map((feature, index) => (
                            <li key={feature.id} style={{ 
                              margin: '10px 0',
                              position: 'relative',
                              paddingLeft: '20px',
                              fontSize: '14px'
                            }}>
                              <span style={{ 
                                position: 'absolute',
                                left: '0',
                                color: tier.color
                              }}>✓</span>
                              {feature.name}
                              {feature.limits && feature.limits.length > 0 && (
                                <span className="feature-limit" style={{ 
                                  fontWeight: 'bold'
                                }}>
                                  {` (${feature.limits[0].value} ${feature.limits[0].unit})`}
                                </span>
                              )}
                            </li>
                          ))
                          .slice(0, 4) // Limit to 4 features for consistent layout
                        }
                        
                        {/* Add placeholder items to maintain consistent card height */}
                        {Array.from({ length: Math.max(0, 4 - tier.features.filter(f => f.included).length) }).map((_, i) => (
                          <li key={`empty-${i}`} style={{ opacity: 0, margin: '10px 0' }}>&nbsp;</li>
                        ))}
                      </ul>
                      
                      {tier.id === 'none' ? (
                        <button 
                          className="tier-button current-tier" 
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#f0f0f0',
                            color: '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            margin: '15px',
                            textAlign: 'center'
                          }}
                          onClick={() => { window.location.hash = '#/configure'; }}
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button 
                          className={`tier-button upgrade-button`}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: tier.color,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            margin: '15px',
                            textAlign: 'center'
                          }}
                          onClick={() => {
                            // Use the correct URL format with query parameters
                            window.location.hash = `#/subscribe?plan=${tier.id}`;
                          }}
                        >
                          Upgrade
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="early-adopter-callout" style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '15px',
                  margin: '20px 0',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div className="callout-icon" style={{ fontSize: '24px', marginRight: '15px' }}>🎁</div>
                  <div className="callout-text">
                    <strong>Beta User? Lock In These Prices!</strong>
                    <p style={{ margin: '5px 0 0 0' }}>Sign up now and keep these rates for a full year after our official launch.</p>
                  </div>
                </div>
              </section>
              
              {/* Get Started Section */}
              <section className="dashboard-section get-started-section">
                <h2 className="section-title">Ready to Get Started?</h2>
                <p className="section-description">Create your first configuration and unlock Claude's full potential</p>
                
                <div className="cta-container">
                  <button 
                    className="primary-cta" 
                    style={{
                      padding: '12px 25px',
                      backgroundColor: '#4285F4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                    onClick={handleConfigureClick}
                  >
                    Create Your First Configuration
                  </button>
                  <button 
                    className="secondary-cta" 
                    style={{
                      padding: '12px 25px',
                      backgroundColor: '#f0f0f0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open('#/documentation', '_self')}
                  >
                    Learn More
                  </button>
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