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

  const [currentPath, setCurrentPath] = useState(normalizePath(window.location.hash.substring(1)) || defaultRoute);

  // Listen for hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      const path = normalizePath(window.location.hash.substring(1)) || defaultRoute;
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
    
    // Special case for /configure redirect
    if (currentPath === '/configure') {
      console.log('Detected /configure path, redirecting to /configuration');
      window.location.hash = '/configuration';
      return <div>Redirecting to configuration page...</div>;
    }
    
    // Check for exact match
    const exactMatch = routes.find(route => route.path === currentPath);
    if (exactMatch) {
      console.log('Found exact match:', exactMatch.path);
      return React.createElement(exactMatch.component, { path: currentPath });
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
            return React.createElement(route.component, { path: currentPath, params });
          }
        }
      }
    }
    
    // No match, use default route
    const defaultComponent = routes.find(route => route.path === defaultRoute);
    return defaultComponent 
      ? React.createElement(defaultComponent.component, { path: currentPath }) 
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