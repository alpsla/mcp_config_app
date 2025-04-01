import React, { useState } from 'react';
import './MockDashboard.css';
import { useAuth } from '../../auth/AuthContext';

const MockDashboard = ({ history }) => {
  const { getUserSubscriptionTier } = useAuth();
  const [dashboardType, setDashboardType] = useState('new'); // 'new' or 'returning'
  const [hasSavedConfig, setHasSavedConfig] = useState(false);
  
  // Function to navigate to configuration page
  const navigateToMCPStudio = () => {
    window.location.hash = '/configure';
  };

  // Render the new user dashboard
  const renderNewUserDashboard = () => {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome to Claude MCP Configuration</h1>
          <p className="subtitle">Get started by setting up your first MCP configuration</p>
        </div>
        
        <div className="setup-flow">
          <div className="setup-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Choose a Plan</h3>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Select Models</h3>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Configure & Export</h3>
              </div>
            </div>
          </div>
          
          <p className="flow-description">
            Start building your configuration by selecting which plan works best for you.
          </p>
        </div>
        
        <div className="plans-container">
          <div className="plan-card">
            <div className="plan-header">
              <h3>Free Plan</h3>
              <div className="price">$0</div>
            </div>
            <ul className="features">
              <li>
                <span className="feature-check">✓</span>
                1 Free model (File System Access)
              </li>
              <li>
                <span className="feature-check">✓</span>
                1 Free model (Web Search Integration)
              </li>
              <li>
                <span className="feature-cross">✗</span>
                No Hugging Face models
              </li>
            </ul>
            <button className="plan-select-button" onClick={navigateToMCPStudio}>
              Select Free Plan
            </button>
          </div>
          
          <div className="plan-card">
            <div className="plan-header">
              <h3>Basic Plan</h3>
              <div className="price">$2<span className="price-period">/month</span></div>
            </div>
            <ul className="features">
              <li>
                <span className="feature-check">✓</span>
                1 Free model (File System Access)
              </li>
              <li>
                <span className="feature-check">✓</span>
                1 Free model (Web Search Integration)
              </li>
              <li>
                <span className="feature-check">✓</span>
                3 Hugging Face models
              </li>
            </ul>
            <button className="plan-select-button" onClick={navigateToMCPStudio}>
              Select Basic Plan
            </button>
          </div>
          
          <div className="plan-card recommended">
            <div className="recommended-tag">RECOMMENDED</div>
            <div className="plan-header">
              <h3>Complete Plan</h3>
              <div className="price">$5<span className="price-period">/month</span></div>
            </div>
            <ul className="features">
              <li>
                <span className="feature-check">✓</span>
                1 Free model (File System Access)
              </li>
              <li>
                <span className="feature-check">✓</span>
                1 Free model (Web Search Integration)
              </li>
              <li>
                <span className="feature-check">✓</span>
                10 Hugging Face models
              </li>
              <li>
                <span className="feature-check">✓</span>
                Priority Support
              </li>
            </ul>
            <button className="plan-select-button" onClick={navigateToMCPStudio}>
              Select Complete Plan
            </button>
          </div>
        </div>
        
        <div className="demo-section">
          <h2>Try out Hugging Face models with Claude</h2>
          <div className="demo-cards">
            <div className="demo-card">
              <div className="demo-image" style={{ backgroundColor: '#e2f5ff' }}>
                <span className="demo-icon">🎨</span>
              </div>
              <h3>Image Generation</h3>
              <p>Generate high-quality images from text descriptions</p>
              <button className="demo-button" onClick={navigateToMCPStudio}>Try Now</button>
            </div>
            
            <div className="demo-card">
              <div className="demo-image" style={{ backgroundColor: '#f0e6ff' }}>
                <span className="demo-icon">🎤</span>
              </div>
              <h3>Audio Transcription</h3>
              <p>Convert speech to text with high accuracy</p>
              <button className="demo-button" onClick={navigateToMCPStudio}>Try Now</button>
            </div>
            
            <div className="demo-card">
              <div className="demo-image" style={{ backgroundColor: '#e6fff0' }}>
                <span className="demo-icon">🤖</span>
              </div>
              <h3>Specialized Models</h3>
              <p>Extend Claude with domain-specific models</p>
              <button className="demo-button" onClick={navigateToMCPStudio}>Try Now</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the returning user dashboard
  const renderReturningUserDashboard = () => {
    return (
      <div className="dashboard-container returning">
        <div className="dashboard-header">
          <h1>Your MCP Configurations</h1>
          <button className="new-config-button" onClick={navigateToMCPStudio}>
            Create New Configuration
          </button>
        </div>
        
        <div className="configurations-section">
          {hasSavedConfig ? (
            <>
              <div className="configs-grid">
                <div className="config-card active">
                  <div className="config-header">
                    <h3>My Default Config</h3>
                    <span className="active-badge">Active</span>
                  </div>
                  <div className="config-details">
                    <div className="config-services">
                      <span className="service-tag">Web Search</span>
                      <span className="service-tag">File System</span>
                    </div>
                    <p className="config-date">Created: March 30, 2025</p>
                  </div>
                  <div className="config-actions">
                    <button className="config-edit" onClick={navigateToMCPStudio}>Edit</button>
                    <button className="config-view">View JSON</button>
                  </div>
                </div>
                
                <div className="config-card">
                  <div className="config-header">
                    <h3>Image Generator</h3>
                  </div>
                  <div className="config-details">
                    <div className="config-services">
                      <span className="service-tag">Web Search</span>
                      <span className="service-tag">Hugging Face</span>
                    </div>
                    <p className="config-date">Created: March 28, 2025</p>
                  </div>
                  <div className="config-actions">
                    <button className="config-edit" onClick={navigateToMCPStudio}>Edit</button>
                    <button className="config-activate">Activate</button>
                  </div>
                </div>
                
                <div className="config-card">
                  <div className="config-header">
                    <h3>Code Assistant</h3>
                  </div>
                  <div className="config-details">
                    <div className="config-services">
                      <span className="service-tag">File System</span>
                      <span className="service-tag">Hugging Face</span>
                    </div>
                    <p className="config-date">Created: March 25, 2025</p>
                  </div>
                  <div className="config-actions">
                    <button className="config-edit" onClick={navigateToMCPStudio}>Edit</button>
                    <button className="config-activate">Activate</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-configs">
              <h2>No configurations yet</h2>
              <p>Create your first MCP configuration to enhance Claude's capabilities.</p>
              <button className="create-config-button" onClick={() => setHasSavedConfig(true)}>
                Create Configurations (Demo)
              </button>
            </div>
          )}
        </div>
        
        <div className="subscription-info">
          <h2>Your Subscription</h2>
          <div className="subscription-details">
            <div className="current-plan">
              <h3>Basic Plan</h3>
              <p>$2/month</p>
            </div>
            <div className="plan-features">
              <p>You have used 2 of 3 available Hugging Face models.</p>
              <button className="upgrade-button" onClick={navigateToMCPStudio}>
                Upgrade to Complete Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mock-dashboard-page">
      <div className="dashboard-selector">
        <div>Switch Dashboard Type:</div>
        <div className="selector-buttons">
          <button 
            className={dashboardType === 'new' ? 'active' : ''}
            onClick={() => setDashboardType('new')}
          >
            New User
          </button>
          <button 
            className={dashboardType === 'returning' ? 'active' : ''}
            onClick={() => setDashboardType('returning')}
          >
            Returning User
          </button>
        </div>
      </div>
      
      {dashboardType === 'new' ? renderNewUserDashboard() : renderReturningUserDashboard()}
    </div>
  );
};

export default MockDashboard;