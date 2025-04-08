import React from 'react';
import './MainPages.css';
import pricing from '../../config/pricing'; // Import pricing configuration

const HomePage: React.FC = () => {
  // Get basic tier info for homepage marketing
  const basicTier = pricing.tiers.find(tier => tier.id === 'basic');
  
  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>MCP Configuration Tool</h1>
        <p>
          Configure Claude's Model Control Protocol servers to enhance your AI experience
        </p>
        <a href="#/dashboard" className="cta-button">
          Get Started
        </a>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>File System</h3>
          <p>
            Connect Claude to your local files and directories securely
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Web Search</h3>
          <p>
            Enable Claude to search the web for up-to-date information
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Hugging Face</h3>
          <p>
            Extend Claude with powerful AI models from Hugging Face
            {basicTier && <span className="tier-note"> (starting at ${basicTier.price.monthly}/month)</span>}
          </p>
        </div>
      </div>
      
      {/* New pricing highlight section */}
      <div className="pricing-highlight" style={{
        margin: '50px auto',
        maxWidth: '1200px',
        padding: '0 20px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>Plans for Everyone</h2>
        
        <div className="pricing-overview" style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {pricing.tiers.map(tier => (
            <div key={tier.id} className={`pricing-overview-card ${tier.id}`} style={{
              flex: '1',
              minWidth: '250px',
              maxWidth: '350px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              border: `1px solid ${tier.lightColor}`
            }}
            onClick={() => window.location.hash = `#/pricing?plan=${tier.id}`}
            >
              <div style={{
                backgroundColor: tier.lightColor,
                padding: '20px',
                textAlign: 'center'
              }}>
                <h3 style={{
                  margin: '0',
                  color: tier.color,
                  fontSize: '22px'
                }}>{tier.displayName}</h3>
                
                <div style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  color: '#333'
                }}>
                  {tier.price.monthly === 0 ? 'Free' : `$${tier.price.monthly}`}
                  {tier.price.monthly > 0 && <span style={{ fontSize: '16px', color: '#666' }}>/month</span>}
                </div>
              </div>
              
              <div style={{
                padding: '20px'
              }}>
                <div style={{
                  color: '#555',
                  marginBottom: '15px'
                }}>
                  {tier.features.filter(f => f.included).length} features included
                </div>
                
                <a href={`#/pricing?plan=${tier.id}`} style={{
                  display: 'inline-block',
                  color: tier.color,
                  fontWeight: 'bold',
                  textDecoration: 'none'
                }}>
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;