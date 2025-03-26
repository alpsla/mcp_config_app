import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { SubscriptionTier } from '../../types';
import './ServerPanel.css';

interface ServerPanelProps {
  selectedServer: string | null;
  onServerSelect: (server: string) => void;
}

export const ServerPanel: React.FC<ServerPanelProps> = ({ 
  selectedServer, 
  onServerSelect 
}) => {
  const { authState } = useAuth();
  const user = authState.user;
  const userTier = user?.subscriptionTier || SubscriptionTier.FREE;

  const isHuggingFaceEnabled = userTier !== SubscriptionTier.FREE;
  
  const servers = [
    {
      id: 'websearch',
      name: 'Web Search',
      description: 'Configure web search integration',
      icon: (
        <svg className="server-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      enabled: true,
      tier: SubscriptionTier.FREE
    },
    {
      id: 'filesystem',
      name: 'File System',
      description: 'Configure file system access',
      icon: (
        <svg className="server-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7C21 8.10457 20.1046 9 19 9H5C3.89543 9 3 8.10457 3 7V5Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 13C3 11.8954 3.89543 11 5 11H19C20.1046 11 21 11.8954 21 13V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V13Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      enabled: true,
      tier: SubscriptionTier.FREE,
      badge: 'Desktop Only'
    },
    {
      id: 'huggingface',
      name: 'Hugging Face Models',
      description: 'Configure Hugging Face models',
      icon: (
        <svg className="server-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 11C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      enabled: isHuggingFaceEnabled,
      tier: SubscriptionTier.STARTER
    }
  ];

  const getTierBadge = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.STARTER:
        return 'Starter+';
      case SubscriptionTier.STANDARD:
        return 'Standard+';
      case SubscriptionTier.COMPLETE:
        return 'Complete';
      default:
        return '';
    }
  };

  return (
    <div className="server-panel">
      <div className="server-panel-header">
        <h2 className="server-panel-title">Server Selection - DIRECT EDIT</h2>
        <p className="server-panel-subtitle">Configure your integration services</p>
      </div>
      
      <div className="server-list">
        {servers.map((server) => (
          <div 
            key={server.id}
            className={`server-item ${selectedServer === server.id ? 'selected' : ''} ${!server.enabled ? 'disabled' : ''}`}
            onClick={() => server.enabled && onServerSelect(server.id)}
            data-server-id={server.id}
          >
            <div className="server-item-icon">
              {server.icon}
            </div>
            <div className="server-item-content">
              <div className="server-item-header" style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                gap: '3px'
              }}>
                <h3 className="server-item-name" style={{ 
                  fontSize: '1rem',
                  fontWeight: 'normal',
                  display: 'inline'
                }}>{server.name}</h3>
                {server.tier !== SubscriptionTier.FREE && (
                  <div className="server-tier-badge">
                    {getTierBadge(server.tier)}
                  </div>
                )}
                {server.badge && (
                  <div className="server-badge" style={{ 
                    display: 'inline', 
                    fontSize: '1rem', /* Force same size as main text */
                    fontWeight: 'normal',
                    marginLeft: '3px',
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    color: server.id === 'huggingface' ? '#e35b88' : '#666'
                  }}>
                    {server.badge}
                  </div>
                )}
              </div>
              <p className="server-item-description">{server.description}</p>
            </div>
            {!server.enabled && (
              <div className="server-item-upgrade">
                Upgrade to {getTierBadge(server.tier)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="server-panel-footer">
        <div className="current-subscription">
          <div className="subscription-label">Current Plan:</div>
          <div className={`subscription-value tier-${userTier}`}>
            {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
};
