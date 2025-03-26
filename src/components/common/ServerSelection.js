import React, { useState } from 'react';
import ServerOption from './ServerOption';

/**
 * A complete server selection component that matches the screenshot
 */
const ServerSelection = ({ onSelect }) => {
  const [selectedServer, setSelectedServer] = useState(null);
  
  const servers = [
    { id: 'websearch', name: 'Web Search', badge: null },
    { id: 'filesystem', name: 'File System', badge: 'Desktop Only' },
    { id: 'huggingface', name: 'Hugging Face', badge: 'Premium', badgeColor: '#e35b88' }
  ];
  
  const handleSelect = (id) => {
    setSelectedServer(id);
    if (onSelect) onSelect(id);
  };
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    width: '100%',
    maxWidth: '250px'
  };
  
  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333'
  };
  
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Server Selection</h3>
      
      {servers.map(server => (
        <ServerOption
          key={server.id}
          name={server.name}
          badge={server.badge}
          badgeColor={server.badgeColor}
          isSelected={selectedServer === server.id}
          onClick={() => handleSelect(server.id)}
        />
      ))}
    </div>
  );
};

export default ServerSelection;
