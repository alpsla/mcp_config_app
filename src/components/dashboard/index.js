// Export dashboard components
import Dashboard from './Dashboard';
import WelcomeBanner from './WelcomeBanner';
import ServiceCard from './ServiceCard';
import PricingTier from './PricingTier';
// Import the existing ModelCard to prevent conflicts with our new version
import OriginalModelCard from './ModelCard';
import OurModelCard from './ModelCard.jsx';
import ExampleShowcase from './ExampleShowcase';
import TestimonialCard from './TestimonialCard';
import EmptyState from './EmptyState';
import ComingSoon from './ComingSoon';
import ReturningUserDashboard from './ReturningUserDashboard';

// Create a smart dashboard component that decides which dashboard to show
const SmartDashboard = (props) => {
  // Get user from local storage or cookie to determine if they're returning
  const user = localStorage.getItem('user');
  const hasConfigurations = localStorage.getItem('hasConfigurations') === 'true';
  
  // Show returning user dashboard if the user has configurations
  if (user && hasConfigurations) {
    return <ReturningUserDashboard {...props} />;
  }
  
  // Otherwise, show the regular dashboard
  return <Dashboard {...props} />;
};

// Export the smart dashboard as default
export default SmartDashboard;

  // Export individual components
export {
  Dashboard as FullDashboard,
  ReturningUserDashboard,
  WelcomeBanner,
  ServiceCard,
  PricingTier,
  OriginalModelCard as ModelCard,
  OurModelCard as ReturningUserModelCard,
  ExampleShowcase,
  TestimonialCard,
  EmptyState,
  ComingSoon
};
