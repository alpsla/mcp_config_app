import React from 'react';
import '../components/configuration/MainConfigurationFlow.css';

const TestPremiumBadge = () => {
  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <h2>Premium Badge Test</h2>
      
      <div style={{ marginTop: '20px' }}>
        <div className="service-options">
          {/* Regular option */}
          <div className="service-option">
            <h3>Regular Option</h3>
            <p>This is a regular option with no badge</p>
          </div>
          
          {/* Premium option with badge */}
          <div className="service-option">
            <div className="mcp-paid-feature-badge">
              Premium
            </div>
            <h3>Hugging Face Models</h3>
            <p>This should show a Premium badge in the top-right corner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPremiumBadge;