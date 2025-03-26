import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthErrorHandler } from '../authErrorHandler';

/**
 * A safe wrapper around useNavigate that handles Router context errors
 * and provides fallback navigation methods
 * 
 * @returns An object with safe navigation functions
 */
export const useSafeNavigation = () => {
  // Always call useNavigate unconditionally at the top level to follow React Hooks rules
  // If it throws, we'll catch it in the try/catch below, but the hook is still called
  const navigate = useNavigate();
  
  const [isRouterAvailable, setIsRouterAvailable] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Check if navigation is available on mount
  useEffect(() => {
    try {
      // At this point, if useNavigate threw, we won't reach here
      // If we do reach here, we know navigate is available
      setIsRouterAvailable(true);
      setError(null);
    } catch (err: any) {
      console.error('Router initialization error:', err);
      setIsRouterAvailable(false);
      setError(err);
      
      // Use our error handler to diagnose and handle the issue
      AuthErrorHandler.diagnoseError(err);
    }
  }, []);
  
  /**
   * Navigate to a route safely, with fallback to window.location
   * 
   * @param to Route to navigate to (e.g., '/login')
   * @param options Optional navigation options
   */
  const navigateSafely = (to: string, options?: { replace?: boolean }) => {
    try {
      if (isRouterAvailable) {
        navigate(to, options);
      } else {
        // Fallback if navigate isn't available
        if (options?.replace) {
          window.location.replace(to);
        } else {
          window.location.href = to;
        }
      }
    } catch (err: any) {
      console.error('Navigation error:', err);
      // Force redirect using window.location as fallback
      window.location.href = to;
    }
  };
  
  /**
   * Navigate back safely
   */
  const goBack = () => {
    try {
      if (isRouterAvailable) {
        navigate(-1);
      } else {
        // Fallback if navigate isn't available
        window.history.back();
      }
    } catch (err: any) {
      console.error('Navigation back error:', err);
      // Force redirect using window.history as fallback
      window.history.back();
    }
  };
  
  return {
    navigateSafely,
    goBack,
    isRouterAvailable,
    error
  };
};

export default useSafeNavigation;
