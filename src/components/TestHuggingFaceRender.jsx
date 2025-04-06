import React, { useState } from 'react';

const TestHuggingFaceRender = () => {
  const [userSubscriptionTier, setUserSubscriptionTier] = useState('none');
  
  const toggleSubscription = () => {
    setUserSubscriptionTier(userSubscriptionTier === 'none' ? 'basic' : 'none');
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Hugging Face Configuration Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Current subscription tier:</strong> {userSubscriptionTier === 'none' ? 'Free' : 'Basic (Paid)'}
        <button 
          onClick={toggleSubscription}
          style={{ 
            marginLeft: '20px', 
            padding: '8px 16px', 
            backgroundColor: '#6750A4', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Toggle Subscription
        </button>
      </div>
      
      <h2>Service Selection</h2>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        marginTop: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #E1E1E1',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        }}>
          <h3>File System</h3>
          <p>Allow Claude to access files on your computer</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #E1E1E1',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        }}>
          <h3>Web Search</h3>
          <p>Enable Claude to search the web for information</p>
        </div>
        
        {userSubscriptionTier !== 'none' ? (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E1E1E1',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
          }}>
            <h3>Hugging Face Models</h3>
            <p>Extend Claude with specialized AI models</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#fafafa',
            border: '1px solid #E1E1E1',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
          }}>
            <h3>Hugging Face Models <span style={{ color: '#6750A4', fontWeight: 'bold' }}>(Premium)</span></h3>
            <p>Subscribe to a paid plan to access specialized AI models</p>
            <div style={{ 
              marginTop: '12px', 
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#6750A4',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Unlock with Subscription
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHuggingFaceRender;