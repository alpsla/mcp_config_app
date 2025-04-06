import React, { useEffect } from 'react';

/**
 * Redirect component that sends users from /configure to /configuration
 */
const Configure = () => {
  useEffect(() => {
    // Immediately redirect to the /configuration route
    console.log('Redirecting from /configure to /configuration');
    window.location.hash = '/configuration';
  }, []);

  // Display a loading/redirect message in case there's any delay
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Redirecting to configuration page...</h2>
      <p>If you are not redirected automatically, <a href="#/configuration">click here</a>.</p>
    </div>
  );
};

export default Configure;