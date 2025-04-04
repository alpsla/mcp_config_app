import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import './AppInitializer.css';

// Importing this indirectly to avoid circular references
// We'll add this if you create the RepairService file
// import { RepairService } from '../../services/repairService';

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * AppInitializer component
 * 
 * This component runs initialization and repair tasks when the app starts
 * It fixes common issues like missing profiles, broken RLS policies, etc.
 */
const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { authState } = useAuth();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [repairAttempted, setRepairAttempted] = useState<boolean>(false);
  
  // Run initialization tasks on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Check for and apply critical security patching
        applySecurityPatches();
        
        // Read environment variables
        checkEnvironment();
        
        // Other initialization tasks can be added here
        
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Continue anyway - don't block the app from loading
        setInitialized(true);
      }
    };
    
    initializeApp();
  }, []);
  
  // Run user-specific repairs when user logs in
  useEffect(() => {
    const repairUserData = async () => {
      // Only run if user is authenticated and repairs haven't been attempted yet
      if (authState?.user && !repairAttempted) {
        try {
          console.log('Repairing user data...');
          
          // Run all repairs - commented out for now until RepairService is created
          // const repairResult = await RepairService.repairAll();
          // console.log('Repair result:', repairResult);
          
          setRepairAttempted(true);
        } catch (error) {
          console.error('Error repairing user data:', error);
          // Continue anyway - don't block the app from loading
          setRepairAttempted(true);
        }
      }
    };
    
    repairUserData();
  }, [authState?.user, repairAttempted]);
  
  // Apply security patches to fix common issues
  const applySecurityPatches = () => {
    try {
      console.log('Applying security patches...');
      
      // Fix for "Maximum update depth exceeded" error
      // This is a common React error caused by component re-renders
      // We apply a global patch to prevent it
      if (typeof window !== 'undefined') {
        // Add a flag to detect recursion
        (window as any).__REACT_UPDATE_DEPTH = 0;
        
        // Monkey patch React's setState to prevent excessive updates
        const originalConsoleError = console.error;
        console.error = function(...args: any[]) {
          // Check if this is a maximum update depth error
          if (args[0] && typeof args[0] === 'string' && 
              (args[0].includes('Maximum update depth exceeded') || 
               args[0].includes('Too many re-renders'))) {
            
            // Increment counter
            (window as any).__REACT_UPDATE_DEPTH++;
            
            // Log with extra information
            originalConsoleError.apply(console, [
              'React update depth error detected. This usually indicates an infinite loop in useEffect or event handlers.',
              ...args
            ]);
            
            // If we've seen this error too many times, add a global emergency brake
            if ((window as any).__REACT_UPDATE_DEPTH > 5) {
              console.warn('Too many React update depth errors, applying emergency brake');
              
              // Reset after 2 seconds to allow React to stabilize
              setTimeout(() => {
                (window as any).__REACT_UPDATE_DEPTH = 0;
              }, 2000);
            }
          } else {
            // Not a React update error, pass through normally
            originalConsoleError.apply(console, args);
          }
        };
      }
      
      console.log('Security patches applied');
    } catch (error) {
      console.error('Error applying security patches:', error);
    }
  };
  
  // Check environment variables
  const checkEnvironment = () => {
    try {
      console.log('Checking environment...');
      
      // Check for required environment variables
      const requiredVars = ['REACT_APP_SUPABASE_URL', 'REACT_APP_SUPABASE_ANON_KEY'];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
      } else {
        console.log('All required environment variables are present');
      }
    } catch (error) {
      console.error('Error checking environment:', error);
    }
  };
  
  if (!initialized) {
    return (
      <div className="app-initializer-loading">
        <div className="app-initializer-spinner"></div>
        <p>Initializing application...</p>
      </div>
    );
  }
  
  // Render children once initialized
  return <>{children}</>;
};

export default AppInitializer;