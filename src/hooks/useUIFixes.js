import { useEffect } from 'react';
import { applyUIFixes } from '../utils/ui-fixes';

/**
 * Custom hook to apply UI fixes
 * This will run the UI fix functions after the component mounts
 * and after any DOM updates
 */
const useUIFixes = () => {
  useEffect(() => {
    // Initial application of fixes
    applyUIFixes();
    
    // Set up observer for DOM changes
    const observer = new MutationObserver((mutations) => {
      // Re-apply fixes when DOM changes
      applyUIFixes();
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Create an interval to periodically check and fix issues
    // This helps with race conditions and async rendering
    const interval = setInterval(() => {
      applyUIFixes();
    }, 500); // Check every 500ms
    
    // Clean up
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
};

export default useUIFixes;
