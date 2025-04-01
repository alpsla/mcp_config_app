import React, { useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import MCPStudioPage from './MCPStudioPage';

const SimpleConfigWrapper = () => {
  const { authState } = useAuth();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authState?.user) {
      console.log('SimpleConfigWrapper: User not authenticated, redirecting to signin');
      window.location.hash = '/signin';
      return;
    }
  }, [authState]);
  
  const handleSaveConfiguration = (config) => {
    console.log('Saving configuration:', config);
    // Here you would normally save the configuration to your backend
    // Then navigate back to the dashboard
    window.location.hash = '/dashboard';
  };
  
  const navigate = (path) => {
    window.location.hash = path;
  };
  
  return (
    <MCPStudioPage 
      history={{ push: navigate }}
      onSaveConfiguration={handleSaveConfiguration}
    />
  );
};

export default SimpleConfigWrapper;