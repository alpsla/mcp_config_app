import React, { useState, useEffect } from 'react';
import MagicLinkLogin from '../../components/auth/MagicLinkLogin';
import { useAuth } from '../../auth/AuthContext';
import './LoginPage.css';
import ConfigurationService from '../../services/configurationService';

const LoginPage: React.FC = () => {
  const { socialLogin, signOut, authState } = useAuth();
  const isAuthenticated = authState?.user !== null;
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const [redirectAttempts, setRedirectAttempts] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState<boolean>(false);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home after sign out
      window.location.hash = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Enhanced social login with sign-in state tracking
  const handleSocialLogin = (provider: string) => {
    setSigningIn(true);
    // Pre-cache dashboard to speed up transition
    prefetchDashboard();
    socialLogin(provider);
  };

  // Pre-fetch dashboard assets to make transition smoother
  const prefetchDashboard = () => {
    // Create a hidden iframe to pre-load dashboard route
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `${window.location.origin}${window.location.pathname}#/dashboard/intro`;
    document.body.appendChild(iframe);
    
    // Remove after loading
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  };

  // Immediate redirection function
  const immediateRedirect = (targetPath: string) => {
    // First set fading out to trigger CSS transition
    setFadingOut(true);
    
    // Store the intended dashboard path in sessionStorage
    sessionStorage.setItem('dashboard_redirect', targetPath);
    
    // Wait for fade animation, then redirect
    setTimeout(() => {
      window.location.hash = targetPath;
    }, 300); // Match this with the CSS transition time
  };

  // Redirect already authenticated users away from the login page
  useEffect(() => {
    if (isAuthenticated && !signingIn && !redirecting) {
      // Set redirecting state to prevent multiple redirections
      setRedirecting(true);
      setRedirectAttempts(1);
      
      // Check if the user has any configurations
      const checkConfigurations = async () => {
        try {
          if (authState?.user?.id) {
            // Store auth state in sessionStorage to avoid losing it during redirect
            sessionStorage.setItem('auth_state', JSON.stringify({
              userId: authState.user.id,
              email: authState.user.email,
            }));
            
            const configService = new ConfigurationService();
            const configs = await configService.getAllConfigurations(authState.user.id);
            const hasConfigs = configs && configs.length > 0;
            
            // Start transition fade out
            setFadingOut(true);
            
            // Use immediate redirect to appropriate dashboard
            const targetPath = hasConfigs ? '/dashboard' : '/dashboard/intro';
            console.log(`User authenticated, redirecting to ${targetPath}`);
            
            // Use the immediate redirect function
            immediateRedirect(targetPath);
          } else {
            // Fallback if no user ID
            immediateRedirect('/dashboard/intro');
          }
        } catch (error) {
          console.error('Error checking configurations:', error);
          // Fallback to intro dashboard on error
          immediateRedirect('/dashboard/intro');
        }
      };
      
      // Execute the check immediately
      checkConfigurations();
    } else if (isAuthenticated && signingIn) {
      // If user is now authenticated but was in signing in state, 
      // immediately transition to dashboard without spinner
      console.log('Authentication successful, starting immediate redirect');
      setSigningIn(false);
      setRedirecting(true);
      setRedirectAttempts(1);
      setFadingOut(true);
      
      // Skip configurations check and go straight to dashboard
      immediateRedirect('/dashboard/intro');
    }
  }, [isAuthenticated, signingIn, authState?.user?.id, redirecting]);
  
  // Add a faster fallback for redirection
  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout>;
    
    if (redirecting && isAuthenticated) {
      redirectTimer = setTimeout(() => {
        // Much shorter fallback time (1 second instead of 3)
        console.log(`Quick fallback redirect initiated`);
        
        // Force navigation to dashboard
        window.location.href = `${window.location.origin}${window.location.pathname}#/dashboard/intro`;
        
        // If still on login page after another second, force reload
        setTimeout(() => {
          if (window.location.hash.includes('/signin')) {
            window.location.reload();
          }
        }, 1000);
      }, 1000); 
    }
    
    return () => {
      clearTimeout(redirectTimer);
    };
  }, [redirecting, isAuthenticated]);
  
  // Check for redirect parameter on page load
  useEffect(() => {
    const dashboardRedirect = sessionStorage.getItem('dashboard_redirect');
    if (dashboardRedirect) {
      sessionStorage.removeItem('dashboard_redirect');
      window.location.hash = dashboardRedirect;
    }
  }, []);
  
  return (
    <div className={`login-page-container ${fadingOut ? 'fading-out' : ''}`}>
      {/* Only show login form if not authenticated or not redirecting */}
      {(!isAuthenticated || (redirecting && !fadingOut)) && (
        <div className="login-card">
          <h1 className="login-title">MCP Configuration Tool</h1>
          <h2 className="login-subtitle">Sign In</h2>
          <p className="login-description">Sign in with your preferred method to access the MCP Configuration Tool.</p>
          
          <MagicLinkLogin 
            className="login-form"
            onSuccess={() => {
              console.log('Magic link sent successfully');
              setSigningIn(true);
              prefetchDashboard(); // Pre-cache dashboard
            }}
            onError={(error) => {
              console.error('Error sending magic link:', error);
              setSigningIn(false);
            }}
          />
          
          <div className="login-divider">
            <span>OR</span>
          </div>
          
          <div className="social-login-buttons">
            <button
              type="button"
              className="social-button google"
              onClick={() => handleSocialLogin('google')}
              disabled={signingIn || redirecting}
            >
              {signingIn ? (
                <span className="loading-spinner"></span>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
              )}
              <span>{signingIn ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
            
            <button
              type="button"
              className="social-button github"
              onClick={() => handleSocialLogin('github')}
              disabled={signingIn || redirecting}
            >
              {signingIn ? (
                <span className="loading-spinner"></span>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
              )}
              <span>{signingIn ? 'Signing in...' : 'Continue with GitHub'}</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Minimal, quick transition message instead of spinner */}
      {isAuthenticated && redirecting && fadingOut && (
        <div className="minimal-redirect">
          <div className="minimal-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;