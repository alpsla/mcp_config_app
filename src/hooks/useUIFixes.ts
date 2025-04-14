import { useEffect } from 'react';

/**
 * A lightweight hook that logs component lifecycle events
 * This hook doesn't directly manipulate the DOM
 */
const useUIFixes = () => {
  useEffect(() => {
    // Log component mount for debugging
    // This only logs once when component mounts
    console.log('Component mounted');
    
    // Clean up function runs when component unmounts
    return () => {
      console.log('Component unmounted');
    };
  }, []); // Empty dependency array means this only runs once on mount
};

export default useUIFixes;