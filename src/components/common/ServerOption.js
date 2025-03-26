import React from 'react';

/**
 * A simple button component that displays a consistent server option
 * with proper font sizing for badges
 */
const ServerOption = ({ 
  name,
  badge,
  isSelected = false,
  badgeColor = '#666',
  onClick
}) => {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 16px',
    borderRadius: '24px',
    border: '1px solid #e0e0e0',
    backgroundColor: isSelected ? '#4285f4' : 'white',
    color: isSelected ? 'white' : '#333',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'normal',
    width: '100%',
    maxWidth: '220px',
    margin: '0 0 8px 0',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const badgeStyle = {
    marginLeft: '4px',
    color: isSelected ? 'white' : badgeColor,
    fontSize: '14px',
    fontWeight: 'normal'
  };

  return (
    <button 
      style={buttonStyle} 
      onClick={onClick}
      type="button"
    >
      <span>{name}</span>
      {badge && <span style={badgeStyle}>{badge}</span>}
    </button>
  );
};

export default ServerOption;
