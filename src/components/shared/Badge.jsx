import React from 'react';

// This is a modified Badge component that completely removes Desktop Only and Premium badges
const Badge = ({ type, children }) => {
  // Don't render anything for Desktop Only and Premium badges
  if (type === 'desktop' || type === 'premium') {
    return null;
  }
  
  // Render other badge types normally
  return (
    <span className={`badge badge-${type}`}>
      {children}
    </span>
  );
};

export default Badge;