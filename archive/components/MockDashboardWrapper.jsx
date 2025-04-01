import React from 'react';
import MockDashboard from './MockDashboard';
import SharedHeader from '../../components/shared/SharedHeader';
import SharedFooter from '../../components/shared/SharedFooter';
import { useAuth } from '../../auth/AuthContext';

const MockDashboardWrapper = ({ history }) => {
  const { authState, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <>
      <SharedHeader 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/features', label: 'Features' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/documentation', label: 'Documentation' }
        ]}
        isAuthenticated={authState?.user !== null}
        onSignOut={handleSignOut}
        languageSelector={true}
      />
      
      <MockDashboard history={history} />
      
      <SharedFooter />
    </>
  );
};

export default MockDashboardWrapper;