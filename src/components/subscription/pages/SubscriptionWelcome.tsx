import React, { useEffect } from 'react';
import { SubscriptionTierSimple } from '../../../types/enhanced-types';

// Add interface for queryParams
interface QueryParams {
  tier?: string;
  [key: string]: string | undefined;
}

interface SubscriptionWelcomeProps {
  initialTier?: SubscriptionTierSimple;
  queryParams?: QueryParams;
}

const SubscriptionWelcome: React.FC<SubscriptionWelcomeProps> = ({ 
  initialTier = 'basic', 
  queryParams = {} as QueryParams 
}) => {
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', // Increased from 400px to 500px
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

export default SubscriptionWelcome;