import React, { useState } from 'react';
import { ConfigWizard } from '../config/ConfigWizard';
import { PricingTiers } from '../subscription/PricingTiers';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">MCP Configuration Tool</h1>
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'configuration' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuration')}
          >
            Configuration
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing
          </button>
          <div className="dashboard-tab coming-soon">
            Analytics <span className="badge">Coming Soon</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'configuration' && <ConfigWizard />}
        {activeTab === 'pricing' && <PricingTiers />}
      </div>
    </div>
  );
};
