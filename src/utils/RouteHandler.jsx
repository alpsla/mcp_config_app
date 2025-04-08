import React, { useState, useEffect } from 'react';

/**
 * A simple client-side routing handler for the MCP Configuration Tool
 * This allows navigation between pages without requiring react-router-dom
 */
const RouteHandler = ({ routes, defaultRoute = '/' }) => {
  // Handle paths with or without leading slash
  const normalizePath = (path) => {
    // Remove the leading slash if it exists
    if (path.startsWith('/')) {
      return path;
    }
    return '/' + path;
  };

  const [currentPath, setCurrentPath] = useState(() => {
    // Extract just the path part without query parameters
    const hashPath = window.location.hash.substring(1).split('?')[0] || defaultRoute;
    return normalizePath(hashPath);
  });

  // Listen for hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      // Extract just the path part without query parameters
      const hashPath = window.location.hash.substring(1).split('?')[0] || defaultRoute;
      const path = normalizePath(hashPath);
      console.log('Hash changed to:', path);
      setCurrentPath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initialize hash if not set
    if (!window.location.hash) {
      window.location.hash = defaultRoute;
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [defaultRoute]);
  
  // Find the component to render based on the current path
  const renderRoute = () => {
    // Debug route matching
    console.log('Current path:', currentPath);
    console.log('Available routes:', routes.map(r => r.path));
    
    // When a route changes, always scroll to top
    window.scrollTo(0, 0);
    
    // Parse query parameters
    const queryString = window.location.hash.includes('?') ? 
      window.location.hash.substring(window.location.hash.indexOf('?') + 1) : '';
    
    // Convert query string to object
    const queryParams = {};
    new URLSearchParams(queryString).forEach((value, key) => {
      queryParams[key] = value;
    });
    
    console.log('Query parameters:', queryParams);
    
    // For subscription routes, add a special flag for all steps
    const isSubscriptionRoute = currentPath.startsWith('/subscribe');
    if (isSubscriptionRoute) {
      // Set a flag to handle focus on component mount
      sessionStorage.setItem('reset_scroll', 'true');
    }
    
    // Special case for /configure redirect
    if (currentPath === '/configure') {
      console.log('Detected /configure path, redirecting to /configuration');
      window.location.hash = '/configuration';
      return <div>Redirecting to configuration page...</div>;
    }
    
    // Special case for subscription routes 
    if (currentPath.startsWith('/subscribe/')) {
      console.log('Detected subscription path:', currentPath);
      
      // Find explicit matching routes first
      const exactRoute = routes.find(route => route.path === currentPath);
      if (exactRoute) {
        console.log('Found exact match route for:', currentPath);
        return React.createElement(exactRoute.component, { 
          path: currentPath, 
          queryParams
        });
      }
      
      // Get the step parameter
      const pathParts = currentPath.split('/');
      const step = pathParts.length > 2 ? pathParts[2] : null;
      console.log('Subscription path parts:', pathParts, 'step:', step);
      
      // For specific subscription steps, check if we have a route
      if (step && ['profile', 'interests', 'parameters', 'payment', 'success'].includes(step)) {
        const stepRoute = routes.find(route => route.path === `/subscribe/${step}`);
        if (stepRoute) {
          console.log(`Found step route for: /subscribe/${step}`);
          return React.createElement(stepRoute.component, { 
            path: currentPath, 
            queryParams,
            // Pass tier from query params if available
            initialTier: queryParams.tier || 'basic'
          });
        }
      }
      
      // If we reach here, redirect to the subscription welcome 
      console.log('Unknown subscription step, redirecting to welcome page');
      window.location.hash = queryParams.tier 
        ? `/subscribe?tier=${queryParams.tier}` 
        : '/subscribe';
      
      return (
        <div style={{
          padding: '2rem', 
          textAlign: 'center',
          margin: '2rem auto',
          maxWidth: '600px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>Redirecting to Subscription Page</h2>
          <p>Please wait while we take you to the beginning of the subscription flow...</p>
          <div style={{
            width: '40px',
            height: '40px',
            margin: '20px auto',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }
    
    // Check for exact match
    const exactMatch = routes.find(route => route.path === currentPath);
    if (exactMatch) {
      console.log('Found exact match:', exactMatch.path);
      return React.createElement(exactMatch.component, { 
        path: currentPath,
        queryParams, // Pass query parameters to the component
        initialTier: queryParams.plan // Special case for subscription flow
      });
    }
    
    // Check for pattern match (e.g., "/details/:id")
    for (const route of routes) {
      if (route.path.includes(':')) {
        const pathParts = route.path.split('/');
        const currentParts = currentPath.split('/');
        
        if (pathParts.length === currentParts.length) {
          const params = {};
          let isMatch = true;
          
          for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i].startsWith(':')) {
              const paramName = pathParts[i].substring(1);
              params[paramName] = currentParts[i];
            } else if (pathParts[i] !== currentParts[i]) {
              isMatch = false;
              break;
            }
          }
          
          if (isMatch) {
            return React.createElement(route.component, { 
              path: currentPath, 
              params, 
              queryParams,
              initialTier: queryParams.plan // Special case for subscription flow
            });
          }
        }
      }
    }
    
    // No match, use default route
    const defaultComponent = routes.find(route => route.path === defaultRoute);
    return defaultComponent 
      ? React.createElement(defaultComponent.component, { 
          path: currentPath, 
          queryParams,
          initialTier: queryParams.plan // Special case for subscription flow 
        }) 
      : <div>Page not found</div>;
  };

  return renderRoute();
};

/**
 * Simple navigation helper to use with RouteHandler
 * @param {string} path The path to navigate to
 */
export const navigate = (path) => {
  window.location.hash = path;
};

export default RouteHandler;