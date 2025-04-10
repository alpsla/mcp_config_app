import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import './styles/ProgressBar.css'; // Import specific CSS for fixing profile page issues
import MCPServerService from './services/mcpServerService';
import ConfigurationService from './services/configurationService';
import { MCPServer, MCPConfiguration } from './types';
import RouteHandler from './utils/RouteHandler';
// Import subscription components
import InterestsStepEnhanced from './components/subscription/steps/InterestsStepEnhanced';

// Import page components
import HomePage from './pages/main/HomePage';
import Homepage from './pages/homepage/Homepage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/main/Dashboard';
import PricingPage from './pages/main/PricingPage';
import DocumentationPage from './pages/main/DocumentationPage';
import ConfigurationPage from './pages/configuration/ConfigurationPage';
import MainConfigurationFlow from './components/configuration/MainConfigurationFlow';
import { useAuth } from './auth/AuthContext';

// Import shared header and footer components
import SharedHeader from './components/shared/SharedHeader';
import SharedFooter from './components/shared/SharedFooter';
import AuthCallbackPage from './pages/auth/callback';

// Import test and configuration components
import TestHuggingFaceRender from './components/TestHuggingFaceRender';
import Configure from './pages/configuration/Configure';

// Simplified Subscription Components
// Add interface for queryParams
interface QueryParams {
  tier?: string;
  [key: string]: string | undefined;
}

const SubscriptionWelcome = ({ initialTier = 'basic', queryParams = {} as QueryParams }) => {
  // Get tier from query params if available, with type safety
  const tier = (queryParams.tier as string) || initialTier;
  const tierName = tier === 'complete' ? 'Complete' : 'Basic';
  const price = tier === 'complete' ? '$8.99' : '$4.99';
  const color = tier === 'complete' ? '#673AB7' : '#4285F4';
  const lightColor = tier === 'complete' ? '#F3E5F5' : '#E8F0FE';
  
  // Force scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Features list with icons
  const features = [
    {
      icon: '🔍',
      text: 'File System Access',
      description: 'Access files directly from your local system'
    },
    {
      icon: '🌐',
      text: 'Web Search Integration',
      description: 'Connect and search across the web for information'
    },
    {
      icon: '🤖',
      text: tier === 'basic' ? 'Up to 3 HuggingFace models' : 'Unlimited HuggingFace models',
      description: tier === 'basic' 
        ? 'Access to a limited selection of popular models' 
        : 'Unrestricted access to all available AI models'
    },
    {
      icon: tier === 'complete' ? '⭐' : '✉️',
      text: tier === 'complete' ? 'Priority Support' : 'Standard Support',
      description: tier === 'complete' 
        ? 'Get faster responses and dedicated assistance'
        : 'Email support for standard inquiries'
    }
  ];
  
  return (
    <div style={{
      padding: '40px', 
      maxWidth: '900px', 
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
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '20px'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px', 
            margin: '0 0 8px 0',
            color: '#333',
            fontWeight: 600
          }}>
            {tierName} Plan
          </h2>
          <p style={{margin: '0', color: '#666', fontSize: '16px'}}>
            Enhanced AI capabilities for your workflow
          </p>
        </div>
        
        <div style={{
          backgroundColor: lightColor,
          padding: '12px 20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{color: color, fontWeight: 'bold', fontSize: '24px'}}>{price}</div>
          <div style={{fontSize: '14px', color: '#666'}}>per month</div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: tier === 'complete' ? '#faf5ff' : '#f0f7ff',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '30px',
        position: 'relative',
        paddingLeft: '80px'
      }}>
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '40px'
        }}>
          {tier === 'complete' ? '✨' : '🚀'}
        </div>
        <h3 style={{margin: '0 0 10px 0', color: color}}>Welcome to Your {tierName} Plan</h3>
        <p style={{margin: '0', lineHeight: '1.6', color: '#444'}}>
          You're about to unlock enhanced AI capabilities for your projects.
          Set up your profile and payment details to get started.
        </p>
      </div>
      
      {/* Features */}
      <h3 style={{
        fontSize: '18px',
        color: '#444',
        marginBottom: '20px',
        fontWeight: 500
      }}>
        Your plan includes:
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            display: 'flex',
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: lightColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              marginRight: '16px'
            }}>
              {feature.icon}
            </div>
            <div>
              <div style={{fontWeight: 'bold', marginBottom: '4px'}}>{feature.text}</div>
              <div style={{fontSize: '14px', color: '#666'}}>{feature.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Action buttons */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={() => window.location.hash = '#/dashboard'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          Cancel
        </button>
        <button
          onClick={() => window.location.hash = '#/subscribe/profile'}
          style={{
            padding: '12px 28px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = tier === 'complete' ? '#5E35B1' : '#1A73E8';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const SubscriptionInterests = () => {
  // Initial data for the interests component
  const initialData = {
    interests: [],
    primaryUseCase: '',
    experienceLevel: 'intermediate'
  };
  
  const handleNext = (data: any) => {
    console.log('Interests data submitted:', data);
    // Navigate to parameters step
    window.location.hash = '#/subscribe/parameters';
  };
  
  const handleBack = () => {
    window.location.hash = '#/subscribe/profile';
  };
  
  return (
    <InterestsStepEnhanced 
      initialData={initialData}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
};

const SubscriptionProfile = () => {
  // Use green as the accent color for this step
  const color = '#34A853';
  const lightColor = '#E8F5E9';
  
  // State for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  
  return (
    <div style={{
      padding: '40px', 
      maxWidth: '900px', 
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
      
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>1</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Welcome</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>2</div>
          <div style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '20px'
          }}>Profile</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>3</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Payment</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>4</div>
          <div style={{
            color: '#666',
            fontSize: '14px'
          }}>Success</div>
        </div>
      </div>
      
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: lightColor,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          margin: '0 auto 20px'
        }}>👤</div>
        <h2 style={{
          fontSize: '28px', 
          margin: '0 0 10px 0',
          color: '#333',
          fontWeight: 600
        }}>
          Your Profile Information
        </h2>
        <p style={{margin: '0 auto', color: '#666', fontSize: '16px', maxWidth: '600px'}}>
          Tell us a bit about yourself to help us personalize your experience and provide better support.
        </p>
      </div>
      
      {/* Form */}
      <div style={{
        maxWidth: '650px',
        margin: '0 auto 40px',
        backgroundColor: '#FAFAFA',
        padding: '30px',
        borderRadius: '10px'
      }}>
        <form style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{display: 'flex', gap: '20px'}}>
            <div style={{flex: 1}}>
              <label style={{
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                color: '#444'
              }}>
                First Name <span style={{color: '#D32F2F'}}>*</span>
              </label>
              <input 
                type="text" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                style={{
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fff'
                }} 
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
            </div>
            <div style={{flex: 1}}>
              <label style={{
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                color: '#444'
              }}>
                Last Name <span style={{color: '#D32F2F'}}>*</span>
              </label>
              <input 
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Enter your last name"
                style={{
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fff'
                }} 
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
            </div>
          </div>
          
          <div>
            <label style={{
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 500,
              color: '#444'
            }}>
              Company (Optional)
            </label>
            <input 
              type="text" 
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Your company or organization"
              style={{
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                backgroundColor: '#fff'
              }} 
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
            <div style={{fontSize: '14px', color: '#666', marginTop: '8px'}}>
              We'll use this to personalize your experience with company-specific features.
            </div>
          </div>
          
          <div>
            <label style={{
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 500,
              color: '#444'
            }}>
              Role (Optional)
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{
                width: '100%', 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                backgroundColor: '#fff'
              }}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            >
              <option value="">Select your role</option>
              <option value="developer">Developer</option>
              <option value="data_scientist">Data Scientist</option>
              <option value="researcher">Researcher</option>
              <option value="student">Student</option>
              <option value="manager">Manager</option>
              <option value="other">Other</option>
            </select>
          </div>
        </form>
      </div>
      
      {/* Privacy notice */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        maxWidth: '650px',
        margin: '0 auto 30px',
        padding: '15px',
        backgroundColor: '#F1F8E9',
        borderRadius: '8px',
        border: '1px solid #C5E1A5'
      }}>
        <div style={{
          color: '#689F38',
          fontSize: '20px'
        }}>🔒</div>
        <div>
          <div style={{fontWeight: '500', color: '#558B2F', marginBottom: '4px'}}>
            Your privacy is important to us
          </div>
          <div style={{fontSize: '14px', color: '#666', lineHeight: '1.5'}}>
            The information you provide is secured and only used to enhance your experience.
            We never share your personal information with third parties without your consent.
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '650px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => window.location.hash = '#/subscribe'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          Back
        </button>
        <button
          onClick={() => window.location.hash = '#/subscribe/interests'}
          style={{
            padding: '12px 28px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2E7D32';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const SubscriptionParameters = () => {
  // Use blue as the accent color for this step
  const color = '#1976D2';
  const lightColor = '#E3F2FD';
  
  // State for parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxLength, setMaxLength] = useState(512); // Changed from 2048 to 512
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(50);
  const [useDefaults, setUseDefaults] = useState(true);
  const [hfToken, setHfToken] = useState('');
  
  return (
    <div style={{
      padding: '40px', 
      maxWidth: '900px', 
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
      
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>1</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Welcome</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>2</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Profile</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>3</div>
          <div style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '20px'
          }}>Parameters</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>4</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Payment</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>5</div>
          <div style={{
            color: '#666',
            fontSize: '14px'
          }}>Success</div>
        </div>
      </div>
      
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: lightColor,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          margin: '0 auto 20px'
        }}>⚙️</div>
        <h2 style={{
          fontSize: '28px', 
          margin: '0 0 10px 0',
          color: '#333',
          fontWeight: 600
        }}>
          Model Parameters
        </h2>
        <p style={{margin: '0 auto', color: '#666', fontSize: '16px', maxWidth: '600px'}}>
          Customize how AI models respond to your requests by adjusting these parameters.
        </p>
      </div>
      
      {/* Use defaults toggle */}
      <div style={{
        maxWidth: '650px',
        margin: '0 auto 20px',
        padding: '20px',
        backgroundColor: lightColor,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{fontWeight: 'bold', color: '#333', marginBottom: '4px'}}>
            Use Recommended Settings
          </div>
          <div style={{color: '#666', fontSize: '14px'}}>
            We've configured optimal parameters for most use cases.
          </div>
        </div>
        <label className="switch" style={{
          position: 'relative',
          display: 'inline-block',
          width: '60px',
          height: '34px',
          marginLeft: '20px'
        }}>
          <input 
            type="checkbox" 
            checked={useDefaults}
            onChange={() => setUseDefaults(!useDefaults)}
            style={{
              opacity: 0,
              width: 0,
              height: 0
            }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: useDefaults ? color : '#ccc',
            transition: '.4s',
            borderRadius: '34px'
          }}>
            <span style={{
              position: 'absolute',
              content: '""',
              height: '26px',
              width: '26px',
              left: useDefaults ? 'calc(100% - 30px)' : '4px',
              bottom: '4px',
              backgroundColor: 'white',
              transition: '.4s',
              borderRadius: '50%'
            }}></span>
          </span>
        </label>
      </div>
      
      {/* Parameters */}
      <div style={{
        maxWidth: '650px',
        margin: '0 auto 40px',
        opacity: useDefaults ? 0.7 : 1,
        pointerEvents: useDefaults ? 'none' : 'auto',
      }}>
        {/* Temperature slider */}
        <div style={{
          marginBottom: '40px',
          backgroundColor: '#FAFAFA',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <label style={{fontWeight: 'bold', color: '#333'}}>
              Temperature: {temperature.toFixed(2)}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <button 
                onClick={() => setTemperature(Math.max(0, temperature - 0.1))}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}
              >-</button>
              <input 
                type="number" 
                value={temperature} 
                min={0} 
                max={2} 
                step={0.1}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                style={{
                  width: '60px',
                  padding: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}
              />
              <button 
                onClick={() => setTemperature(Math.min(2, temperature + 0.1))}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '10px'
                }}
              >+</button>
            </div>
          </div>
          <input 
            type="range" 
            min={0} 
            max={2} 
            step={0.1} 
            value={temperature} 
            onChange={e => setTemperature(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '5px',
              outline: 'none',
              appearance: 'none',
              backgroundColor: '#ddd',
              background: `linear-gradient(to right, ${color} 0%, ${color} ${temperature*50}%, #ddd ${temperature*50}%, #ddd 100%)`,
              cursor: 'pointer'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>More deterministic</span>
            <span>More creative</span>
          </div>
          <div style={{
            backgroundColor: '#f1f8ff',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#666',
            marginTop: '15px'
          }}>
            Controls the randomness of outputs. Lower values make results more focused and deterministic.
          </div>
        </div>
        
        {/* Max Length slider */}
        <div style={{
          marginBottom: '40px',
          backgroundColor: '#FAFAFA',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <label style={{fontWeight: 'bold', color: '#333'}}>
              Max Length: {maxLength}
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <button 
                onClick={() => setMaxLength(Math.max(256, maxLength - 256))}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px'
                }}
              >-</button>
              <input 
                type="number" 
                value={maxLength} 
                min={256} 
                max={4096} 
                step={256}
                onChange={e => setMaxLength(parseInt(e.target.value))}
                style={{
                  width: '80px',
                  padding: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}
              />
              <button 
                onClick={() => setMaxLength(Math.min(4096, maxLength + 256))}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '10px'
                }}
              >+</button>
            </div>
          </div>
          <input 
            type="range" 
            min={256} 
            max={4096} 
            step={256} 
            value={maxLength} 
            onChange={e => setMaxLength(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '5px',
              outline: 'none',
              appearance: 'none',
              backgroundColor: '#ddd',
              background: `linear-gradient(to right, ${color} 0%, ${color} ${(maxLength-256)/(4096-256)*100}%, #ddd ${(maxLength-256)/(4096-256)*100}%, #ddd 100%)`,
              cursor: 'pointer'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>Shorter responses</span>
            <span>Longer responses</span>
          </div>
          <div style={{
            backgroundColor: '#f1f8ff',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#666',
            marginTop: '15px'
          }}>
            The maximum number of tokens that can be generated. Higher values allow for more detailed responses.
          </div>
        </div>
        
        {/* Hugging Face API Token Section */}
        <div style={{
          marginTop: '30px',
          marginBottom: '20px',
          backgroundColor: '#F0F7FF',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #BBDEFB'
        }}>
          <h3 style={{marginTop: 0, color: '#1565C0'}}>
            Hugging Face API Token
          </h3>
          
          <p style={{fontSize: '14px', lineHeight: '1.6', color: '#333'}}>
            To access premium models, you'll need a Hugging Face API token.
          </p>
          
          <div>
            <input
              type="text"
              value={hfToken}
              onChange={e => setHfToken(e.target.value)}
              placeholder="Enter your Hugging Face API token"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px',
                marginBottom: '10px'
              }}
            />
            
            <div style={{
              backgroundColor: '#E8F5E9',
              padding: '10px 15px',
              borderRadius: '4px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{color: '#2E7D32', marginRight: '10px', fontSize: '18px'}}>🔒</span>
              <span style={{fontSize: '14px'}}>Your token is stored securely on your local device and never transmitted to our servers.</span>
            </div>
            
            <p style={{marginBottom: '20px'}}>
              To get a token:
            </p>
            <ol style={{marginBottom: '20px'}}>
              <li style={{marginBottom: '8px'}}>Visit the Hugging Face Token page: <br/>
                <a href="https://huggingface.co/settings/tokens/new?tokenType=fineGrained">https://huggingface.co/settings/tokens/new</a>
              </li>
              <li style={{marginBottom: '8px'}}>Sign in (or create a free account)</li>
              <li style={{marginBottom: '8px'}}>Enter "MCP Configuration" as the token name</li>
              <li style={{marginBottom: '8px'}}>Set the role to "Read"</li>
              <li>Copy and paste the token in the field above</li>
            </ol>
          </div>
          
          {/* Security message already included above */}
        </div>

        {/* Advanced Parameters Section - Simplified */}
        <div>
          <h3>Advanced Parameters</h3>
          <div>
            {/* Top P */}
            <div>
              <label>
                Top P: {topP.toFixed(2)}
                <input 
                  type="range" 
                  min={0.1} 
                  max={1} 
                  step={0.05} 
                  value={topP} 
                  onChange={e => setTopP(parseFloat(e.target.value))}
                />
              </label>
              <p>Controls diversity. Lower values focus on high probability options.</p>
            </div>
            
            {/* Top K */}
            <div>
              <label>
                Top K: {topK}
                <input 
                  type="range" 
                  min={1} 
                  max={100} 
                  step={1} 
                  value={topK} 
                  onChange={e => setTopK(parseInt(e.target.value))}
                />
              </label>
              <p>Limits vocabulary choices to top K options.</p>
            </div>
          </div>
          
          {/* Save as preset option */}
          <div>
            <h4>Save Parameters as Preset</h4>
            <p>Save these parameters for future use to avoid repetitive setup.</p>
            <form>
              <label>
                <input type="checkbox" name="enablePreset" />
                Enable preset saving
              </label>
              <br/><br/>
              <input type="text" name="presetName" placeholder="Preset name" />
              <button type="button">Save</button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '650px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => window.location.hash = '#/subscribe/profile'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          Back
        </button>
        <button
          onClick={() => window.location.hash = '#/subscribe/payment'}
          style={{
            padding: '12px 28px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1565C0';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const SubscriptionPayment = () => {
  // Use purple as the accent color for this step
  const color = '#673AB7';
  const lightColor = '#EDE7F6';
  
  // Get tier from URL parameters
  const [tier, setTier] = useState('basic'); // Default to basic
  
  useEffect(() => {
    // Parse the URL to get the tier parameter
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '');
    const planParam = searchParams.get('plan');
    if (planParam && ['basic', 'complete'].includes(planParam)) {
      console.log('Setting tier from URL parameter:', planParam);
      setTier(planParam);
    }
  }, []);
  
  // Determine plan display name and price based on tier
  // These values are used in UI elements below
  const tierDisplayInfo = {
    name: tier === 'basic' ? 'Basic Plan' : 'Complete Plan',
    price: tier === 'basic' ? '$4.99' : '$8.99'
  };
  
  // State for form fields
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  
  return (
    <div style={{
      padding: '40px', 
      maxWidth: '900px', 
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
      
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>1</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Welcome</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>2</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Profile</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>3</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Parameters</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>4</div>
          <div style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '20px'
          }}>Payment</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>5</div>
          <div style={{
            color: '#666',
            fontSize: '14px'
          }}>Success</div>
        </div>
      </div>
      
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: lightColor,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          margin: '0 auto 20px'
        }}>💳</div>
        <h2 style={{
          fontSize: '28px', 
          margin: '0 0 10px 0',
          color: '#333',
          fontWeight: 600
        }}>
          Payment Information
        </h2>
        <p style={{margin: '0 auto', color: '#666', fontSize: '16px', maxWidth: '600px'}}>
          Secure subscription payment for your selected plan. All payments are protected with TLS encryption.
        </p>
      </div>
      
      {/* Order summary */}
      <div style={{
        maxWidth: '650px',
        margin: '0 auto 30px',
        padding: '20px',
        backgroundColor: lightColor,
        borderRadius: '10px'
      }}>
        <div style={{fontWeight: 'bold', color: '#333', marginBottom: '12px', fontSize: '18px'}}>
          Order Summary
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          padding: '10px 0',
          borderBottom: '1px solid #E1D9F0'
        }}>
          <div style={{fontWeight: '500'}}>{tierDisplayInfo.name} (Monthly)</div>
          <div style={{fontWeight: 'bold'}}>{tierDisplayInfo.price}</div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 0',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          <div>Total (billed monthly)</div>
          <div>{tierDisplayInfo.price}/month</div>
        </div>
      </div>
      
      {/* Payment form */}
      <div style={{
        maxWidth: '650px',
        margin: '0 auto 40px',
      }}>
        {/* Payment methods */}
        <div style={{
          marginBottom: '25px',
        }}>
          <label style={{
            display: 'block', 
            marginBottom: '12px', 
            fontWeight: 500,
            color: '#444',
            fontSize: '16px'
          }}>
            Payment Method
          </label>
          
          <div style={{
            display: 'flex',
            gap: '15px'
          }}>
            <div 
              onClick={() => setPaymentMethod('credit')}
              style={{
                flex: 1,
                padding: '15px',
                borderRadius: '8px',
                border: `2px solid ${paymentMethod === 'credit' ? color : '#ddd'}`,
                backgroundColor: paymentMethod === 'credit' ? lightColor : '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${paymentMethod === 'credit' ? color : '#ddd'}`,
                marginRight: '12px',
                position: 'relative'
              }}>
                {paymentMethod === 'credit' && (
                  <div style={{
                    position: 'absolute',
                    width: '12px',
                    height: '12px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}></div>
                )}
              </div>
              <div>Credit Card</div>
            </div>
            
            <div 
              onClick={() => setPaymentMethod('paypal')}
              style={{
                flex: 1,
                padding: '15px',
                borderRadius: '8px',
                border: `2px solid ${paymentMethod === 'paypal' ? color : '#ddd'}`,
                backgroundColor: paymentMethod === 'paypal' ? lightColor : '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${paymentMethod === 'paypal' ? color : '#ddd'}`,
                marginRight: '12px',
                position: 'relative'
              }}>
                {paymentMethod === 'paypal' && (
                  <div style={{
                    position: 'absolute',
                    width: '12px',
                    height: '12px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}></div>
                )}
              </div>
              <div>PayPal</div>
            </div>
          </div>
        </div>
        
        {/* Credit card form */}
        {paymentMethod === 'credit' && (
          <div style={{
            backgroundColor: '#FAFAFA',
            padding: '25px',
            borderRadius: '10px'
          }}>
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                color: '#444'
              }}>
                Card Number
              </label>
              <input 
                type="text" 
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                placeholder="**** **** **** ****"
                style={{
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fff'
                }} 
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{flex: 1}}>
                <label style={{
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 500,
                  color: '#444'
                }}>
                  Expiry Date
                </label>
                <input 
                  type="text" 
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  style={{
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fff'
                  }} 
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>
              
              <div style={{flex: 1}}>
                <label style={{
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 500,
                  color: '#444'
                }}>
                  CVC
                </label>
                <input 
                  type="text" 
                  value={cvc}
                  onChange={e => setCvc(e.target.value)}
                  placeholder="***"
                  style={{
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fff'
                  }} 
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </div>
            
            <div>
              <label style={{
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                color: '#444'
              }}>
                Cardholder Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name on card"
                style={{
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fff'
                }} 
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
            </div>
          </div>
        )}
        
        {/* PayPal option */}
        {paymentMethod === 'paypal' && (
          <div style={{
            backgroundColor: '#FAFAFA',
            padding: '25px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '15px'
            }}>
              Pay with PayPal
            </div>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Click the button below to complete your payment with PayPal.
            </p>
            <div style={{
              backgroundColor: '#0070BA',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              display: 'inline-block',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Pay with PayPal
            </div>
          </div>
        )}
        
        {/* Security notice */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#F5F5F5',
          borderRadius: '6px'
        }}>
          <div style={{
            marginRight: '12px',
            color: '#555',
            fontSize: '18px'
          }}>🔒</div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.4'
          }}>
            Your payment information is securely processed. We use industry-standard encryption to protect your data.
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '650px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => window.location.hash = '#/subscribe/parameters'}
          style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          Back
        </button>
        <button
          onClick={() => window.location.hash = '#/subscribe/success'}
          style={{
            padding: '12px 28px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#5E35B1';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
};

const SubscriptionSuccess = () => {
  // Use green as the accent color for this step
  const color = '#34A853';
  const lightColor = '#E8F5E9';
  
  return (
    <div style={{
      padding: '40px', 
      maxWidth: '900px', 
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
      
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>1</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Welcome</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>2</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Profile</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>3</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Parameters</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>4</div>
          <div style={{
            color: '#666',
            fontSize: '14px',
            marginRight: '20px'
          }}>Payment</div>
          
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>5</div>
          <div style={{
            color: '#333',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>Success</div>
        </div>
      </div>
      
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
        maxWidth: '750px',
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
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
        maxWidth: '750px',
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

const App: React.FC = () => {
  const { authState, signOut } = useAuth();
  const isAuthenticated = authState?.user !== null;

  // Services
  const serverService = useMemo(() => new MCPServerService(), []);
  const configService = useMemo(() => new ConfigurationService(), []);

  // State
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [servers, setServers] = useState<MCPServer[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filteredServers, setFilteredServers] = useState<MCPServer[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [categories, setCategories] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [configurations, setConfigurations] = useState<MCPConfiguration[]>([]);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [hasConfigurations, setHasConfigurations] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    // Load servers
    const allServers = serverService.getAllServers();
    setServers(allServers);
    setFilteredServers(allServers);
    
    // Load categories
    const allCategories = serverService.getCategories();
    setCategories(allCategories);
    
    // Load configurations
    if (authState?.user?.id) {
      const loadConfigurations = async () => {
        try {
          const allConfigurations = await configService.getAllConfigurations(authState.user.id);
          setConfigurations(allConfigurations);
          setHasConfigurations(allConfigurations.length > 0);
        } catch (error) {
          console.error('Failed to load configurations:', error);
          // Fallback to empty array
          setConfigurations([]);
          setHasConfigurations(false);
        }
      };
      
      loadConfigurations();
    } else {
      // If user is not authenticated, use local configurations
      const localConfigs = configService.getLocalConfigurations();
      setConfigurations(localConfigs);
      setHasConfigurations(localConfigs.length > 0);
    }
  }, [authState?.user?.id, configService, serverService]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      
      // Navigate to home page after sign out
      window.location.hash = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      showMessage('Failed to sign out. Please try again.', 'error');
    }
  };

  // Define routes, conditionally rendering based on auth and configuration state
  const routes = [
    // Home page - different based on authentication
    { 
      path: '/', 
      component: isAuthenticated ? HomePage : Homepage 
    },
    { path: '/login', component: LoginPage },
    { path: '/signin', component: LoginPage },
    // Subscription routes using our simplified components
    { path: '/subscribe', component: SubscriptionWelcome },
    { path: '/subscribe/profile', component: SubscriptionProfile },
    { path: '/subscribe/interests', component: SubscriptionInterests },
    { path: '/subscribe/parameters', component: SubscriptionParameters },
    { path: '/subscribe/payment', component: SubscriptionPayment },
    { path: '/subscribe/success', component: SubscriptionSuccess },
    // Dashboard - different based on configuration history
    { 
      path: '/dashboard', 
      component: hasConfigurations 
        ? DashboardPage // Dashboard for users with configurations
        : DashboardPage // Config management dashboard
    },
    { 
      path: '/dashboard/intro', 
      component: DashboardPage // Introductory dashboard
    },
    { path: '/pricing', component: PricingPage },
    { path: '/documentation', component: DocumentationPage },
    // Use either legacy configuration or new enhanced flow
    { 
      path: '/configuration', 
      component: MainConfigurationFlow // New enhanced flow 
    },
    { 
      path: '/configuration/:id', 
      component: MainConfigurationFlow 
    },
    // Keep legacy configuration page route for backward compatibility
    { 
      path: '/legacy-configuration', 
      component: ConfigurationPage 
    },
    { 
      path: '/legacy-configuration/:id', 
      component: ConfigurationPage 
    },
    // Auth callback route for magic links and OAuth
    {
      path: '/auth/callback',
      component: AuthCallbackPage
    },
    // Test routes
    {
      path: '/test-huggingface',
      component: TestHuggingFaceRender
    },
    // Redirect from old route to new route
    {
      path: '/configure',
      component: Configure
    },
  ];

  // Show message with auto-dismiss
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // We no longer need this since we're using RouteHandler
  // const currentPath = window.location.hash.substring(1).split('?')[0] || '/';
  
  // Create the navigation links array for the header
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/documentation', label: 'Documentation' }
  ];

  return (
    <div className="app">
      {/* Use the SharedHeader component for all pages */}
      <SharedHeader 
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        languageSelector={true}
      />

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <main className="app-content">
        <RouteHandler routes={routes} defaultRoute="/" />
      </main>

      {/* Use the SharedFooter component for all pages */}
      <SharedFooter />
    </div>
  );
};

export default App;