import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import ConfigureButton from '../../components/dashboard/ConfigureButton';
import ComingSoonSection from '../../components/dashboard/ComingSoon';
import ReturningUserDashboard from '../../components/dashboard/ReturningUserDashboard';
import EmptyState from '../../components/dashboard/EmptyState';
import { useSafeNavigation } from '../../utils/navigation';

/**
 * Main dashboard component that serves as the landing page after authentication
 */
const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const user = authState.user;
  const { navigateSafely } = useSafeNavigation();
  const isReturningUser = !!user; // For this example, any logged in user is considered "returning"

  // Get user's first name or email prefix for personalization
  const getUserName = (): string => {
    if (user?.user_metadata?.firstName) {
      return user.user_metadata.firstName;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  }

  const handleConfigureClick = () => {
    navigateSafely('/configure');
  };

  const handleEmptyStateButtonClick = (configType: string) => {
    navigateSafely('/configure');
  };

  return (
    <div className="dashboard-container">
      {/* Welcome banner with user name if available */}
      <WelcomeBanner 
        title={`Welcome, ${getUserName()}!`}
        subtitle="Configure Claude's capabilities with MCP servers"
        badgeText="BETA"
      />
      
      {isReturningUser ? (
        /* Dashboard for returning users with their configurations */
        <ReturningUserDashboard />
      ) : (
        /* New user experience */
        <div className="new-user-dashboard">
          <EmptyState 
            message="Get started by creating your first configuration"
            buttonText="Configure New MCP Server"
            onButtonClick={handleEmptyStateButtonClick}
          />
          <ConfigureButton onClick={handleConfigureClick} />
        </div>
      )}
      
      {/* Coming soon section for future features */}
      <ComingSoonSection />
    </div>
  );
};

export default Dashboard;
