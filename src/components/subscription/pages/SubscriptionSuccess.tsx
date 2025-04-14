import React from 'react';
import ProgressBar from './ProgressBar';

const SubscriptionSuccess: React.FC = () => {
  // Use green as the accent color for this step
  const color = '#34A853';
  const lightColor = '#E8F5E9';
  
  return (
    <div style={{
      padding: '40px', 
      maxWidth: '1200px', // Increased from 900px to 1200px
      margin: '30px auto',
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${lightColor}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '8px',
        background: `linear-gradient(to right, ${color}, ${color}cc)`
      }}></div>
      
      {/* Step indicator - Using our ProgressBar component */}
      <ProgressBar currentStep={6} />
      
      {/* Success message */}
      <div style={{
        textAlign: 'center',
        padding: '20px 0 40px'
      }}>
        <div style={{
          fontSize: '80px',
          margin: '0 auto 20px'
        }}>
          🎉
        </div>
        
        <h2 style={{
          fontSize: '32px',
          margin: '0 0 15px',
          color: color,
          fontWeight: 600
        }}>
          Subscription Activated!
        </h2>
        
        <p style={{
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto 30px',
          color: '#555',
          lineHeight: 1.5
        }}>
          Thank you for subscribing to the Complete Plan. Your account has been successfully upgraded and all features are now available.
        </p>
        
        <div style={{
          padding: '15px 25px',
          backgroundColor: lightColor,
          display: 'inline-block',
          borderRadius: '8px',
          fontWeight: 'bold',
          color: color,
          marginBottom: '40px'
        }}>
          Your subscription is now active
        </div>
      </div>
      
      {/* Benefits */}
      <div style={{
        maxWidth: '1000px', // Increased from 750px to 1000px
        margin: '0 auto 40px',
        padding: '30px',
        backgroundColor: '#FAFAFA',
        borderRadius: '10px',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{
          margin: '0 0 20px',
          color: '#333',
          fontSize: '22px',
          fontWeight: '600'
        }}>
          What's included in your subscription
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', // Increased from 330px to 400px
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              color: color,
              fontSize: '24px',
              marginTop: '2px'
            }}>✓</div>
            <div>
              <div style={{fontWeight: '500', marginBottom: '4px'}}>
                Unlimited Hugging Face Models
              </div>
              <div style={{fontSize: '14px', color: '#666'}}>
                Access to all available AI models
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              color: color,
              fontSize: '24px',
              marginTop: '2px'
            }}>✓</div>
            <div>
              <div style={{fontWeight: '500', marginBottom: '4px'}}>
                Custom Model Parameters
              </div>
              <div style={{fontSize: '14px', color: '#666'}}>
                Full control over all model settings
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              color: color,
              fontSize: '24px',
              marginTop: '2px'
            }}>✓</div>
            <div>
              <div style={{fontWeight: '500', marginBottom: '4px'}}>
                File System Access
              </div>
              <div style={{fontSize: '14px', color: '#666'}}>
                Connect directly to your local files
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              color: color,
              fontSize: '24px',
              marginTop: '2px'
            }}>✓</div>
            <div>
              <div style={{fontWeight: '500', marginBottom: '4px'}}>
                Web Search Integration
              </div>
              <div style={{fontSize: '14px', color: '#666'}}>
                Retrieve information from the web
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              color: color,
              fontSize: '24px',
              marginTop: '2px'
            }}>✓</div>
            <div>
              <div style={{fontWeight: '500', marginBottom: '4px'}}>
                Priority Support
              </div>
              <div style={{fontSize: '14px', color: '#666'}}>
                Fast responses to your questions
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{
              color: color,
              fontSize: '24px',
              marginTop: '2px'
            }}>✓</div>
            <div>
              <div style={{fontWeight: '500', marginBottom: '4px'}}>
                Configuration Export
              </div>
              <div style={{fontSize: '14px', color: '#666'}}>
                Export and share your configurations
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Next steps */}
      <div style={{
        maxWidth: '1000px', // Increased from 750px to 1000px
        margin: '0 auto 40px',
      }}>
        <h3 style={{
          margin: '0 0 15px',
          color: '#333',
          fontSize: '20px'
        }}>
          Next Steps
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #eee',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#E8F5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontWeight: 'bold'
            }}>1</div>
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                Visit Your Dashboard
              </div>
              <div style={{fontSize: '15px', color: '#666'}}>
                Go to your personalized dashboard to see all available models and configurations
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #eee',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#E8F5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontWeight: 'bold'
            }}>2</div>
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                Create Your First Configuration
              </div>
              <div style={{fontSize: '15px', color: '#666'}}>
                Set up a new AI configuration with your preferred models and parameters
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #eee',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#E8F5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontWeight: 'bold'
            }}>3</div>
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                Explore Advanced Features
              </div>
              <div style={{fontSize: '15px', color: '#666'}}>
                Discover all the premium features available with your Complete Plan subscription
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Go to Dashboard Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0'
      }}>
        <button
          onClick={() => window.location.hash = '#/dashboard'}
          style={{
            padding: '16px 40px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(52, 168, 83, 0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2E7D32';
            e.currentTarget.style.boxShadow = '0 6px 14px rgba(52, 168, 83, 0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 168, 83, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;