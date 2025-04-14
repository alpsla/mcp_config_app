import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MCPConfiguration } from '../types';

// Import page components
import HomePage from '../pages/main/HomePage';
import Homepage from '../pages/homepage/Homepage';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/main/Dashboard';
import PricingPage from '../pages/main/PricingPage';
import DocumentationPage from '../pages/main/DocumentationPage';
import ConfigurationPage from '../pages/configuration/ConfigurationPage';
import MainConfigurationFlow from '../components/configuration/MainConfigurationFlow';
import AuthCallbackPage from '../pages/auth/callback';
import TestHuggingFaceRender from '../components/TestHuggingFaceRender';
import Configure from '../pages/configuration/Configure';

// Import subscription components
import SubscriptionWelcome from '../components/subscription/pages/SubscriptionWelcome';
import SubscriptionProfile from '../components/subscription/pages/SubscriptionProfile';
import InterestsStep from '../components/subscription/steps/InterestsStepEnhanced';
import PaymentStep from '../components/subscription/steps/PaymentStep';
import ProgressBar from '../components/subscription/pages/ProgressBar';
import SubscriptionParametersRedirect from '../components/subscription/pages/SubscriptionParametersRedirect';
import SubscriptionSuccess from '../components/subscription/pages/SubscriptionSuccess';

// Create a wrapper component for the InterestsStepEnhanced to be used in the routes
const SubscriptionInterestsPage: React.FC = () => {
  // Color scheme
  const color = '#4285F4'; // Blue accent color
  const lightColor = '#EBF3FF';
  
  // Handle navigation
  const handleNext = (data: any) => {
    console.log('Interests data to be stored:', data);
    window.location.hash = '#/subscribe/parameters';
  };
  
  const handleBack = () => {
    window.location.hash = '#/subscribe/profile';
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px', 
      margin: '30px auto',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${lightColor}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '8px',
        background: `linear-gradient(to right, ${color}, ${color}cc)`
      }}></div>
      
      {/* Progress Bar */}
      <ProgressBar currentStep={3} />
      
      <InterestsStep
        initialData={{
          interests: [],
          primaryUseCase: '',
          experienceLevel: 'intermediate'
        }}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

// Create a wrapper component for PaymentStep
const SubscriptionPaymentPage: React.FC = () => {
  // Color scheme
  const color = '#673AB7'; // Purple accent color
  const lightColor = '#EDE7F6';
  
  // Get tier from URL parameters
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(hash.includes('?') ? hash.substring(hash.indexOf('?') + 1) : '');
  const planParam = searchParams.get('plan') || 'basic';
  const tier = (planParam === 'complete' || planParam === 'basic') ? planParam : 'basic';
  
  // Handle navigation
  const handleNext = (data: any) => {
    console.log('Payment data to be stored:', data);
    window.location.hash = '#/subscribe/success';
  };
  
  const handleBack = () => {
    window.location.hash = '#/subscribe/parameters';
  };
  
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px', 
      margin: '30px auto',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      border: `1px solid ${lightColor}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '8px',
        background: `linear-gradient(to right, ${color}, ${color}cc)`
      }}></div>
      
      {/* Progress Bar */}
      <ProgressBar currentStep={5} />
      
      <PaymentStep
        selectedTier={tier}
        initialData={{
          cardNumber: '',
          cardExpiry: '',
          cardCvc: '',
          billingName: '',
          billingAddress: '',
          billingCity: '',
          billingState: '',
          billingZip: '',
          billingCountry: ''
        }}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export interface RouteDefinition {
  path: string;
  component: React.ComponentType<any>;
}

export const getRoutes = (isAuthenticated: boolean, hasConfigurations: boolean): RouteDefinition[] => {
  return [
    // Home page - different based on authentication
    { 
      path: '/', 
      component: isAuthenticated ? HomePage : Homepage 
    },
    { path: '/login', component: LoginPage },
    { path: '/signin', component: LoginPage },
    
    // Subscription routes using our simplified components
    { path: '/subscribe', component: SubscriptionWelcome },
    { path: '/subscribe/profile', component: SubscriptionProfile },
    { path: '/subscribe/interests', component: SubscriptionInterestsPage },
    { path: '/subscribe/parameters', component: SubscriptionParametersRedirect }, // Use the redirect component
    { path: '/subscribe/payment', component: SubscriptionPaymentPage },
    { path: '/subscribe/success', component: SubscriptionSuccess },
    
    // Dashboard - different based on configuration history
    { 
      path: '/dashboard', 
      component: hasConfigurations 
        ? DashboardPage // Dashboard for users with configurations
        : DashboardPage // Config management dashboard
    },
    { 
      path: '/dashboard/intro', 
      component: DashboardPage // Introductory dashboard
    },
    { path: '/pricing', component: PricingPage },
    { path: '/documentation', component: DocumentationPage },
    
    // Use either legacy configuration or new enhanced flow
    { 
      path: '/configuration', 
      component: MainConfigurationFlow // New enhanced flow 
    },
    { 
      path: '/configuration/:id', 
      component: MainConfigurationFlow 
    },
    
    // Keep legacy configuration page route for backward compatibility
    { 
      path: '/legacy-configuration', 
      component: ConfigurationPage 
    },
    { 
      path: '/legacy-configuration/:id', 
      component: ConfigurationPage 
    },
    
    // Auth callback route for magic links and OAuth
    {
      path: '/auth/callback',
      component: AuthCallbackPage
    },
    
    // Test routes
    {
      path: '/test-huggingface',
      component: TestHuggingFaceRender
    },
    
    // Redirect from old route to new route
    {
      path: '/configure',
      component: Configure
    },
  ];
};

// Navigation links for header
export const getNavLinks = () => {
  return [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/documentation', label: 'Documentation' }
  ];
};