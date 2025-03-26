import React from 'react';
import './ServerButtons.css';

/**
 * Simple server selection buttons that match the provided screenshot
 * This component focuses on just the buttons to ensure consistent styling
 */
const ServerButtons = ({ selectedServer, onServerSelect }) => {
  const servers = [
    {
      id: 'websearch',
      name: 'Web Search',
      badge: null
    },
    {
      id: 'filesystem',
      name: 'File System',
      badge: 'Desktop Only'
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      badge: 'Premium',
      isPremium: true
    }
  ];

  return (
    <div className="server-buttons-container">
      <h3 className="server-selection-title">SERVER SELECTION - TEST</h3>
      
      {servers.map((server) => (
        <button
          key={server.id}
          className={`server-button ${selectedServer === server.id ? 'selected' : ''}`}
          onClick={() => onServerSelect(server.id)}
        >
          <span className="button-text">{server.name}</span>
          {server.badge && (
            <span className={`badge-text ${server.isPremium ? 'premium-badge' : ''}`}>
              {server.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ServerButtons;
