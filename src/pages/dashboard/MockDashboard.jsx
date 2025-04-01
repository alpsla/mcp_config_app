import React from 'react';
import { useAuth } from '../../auth/AuthContext';

const MockDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { getUserSubscriptionTier } = useAuth();
  
  return (
    <div className="mock-dashboard">
      <h1>Mock Dashboard</h1>
      <p>This is a placeholder component for testing purposes.</p>
    </div>
  );
};

export default MockDashboard;