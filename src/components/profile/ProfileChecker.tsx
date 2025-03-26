import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../services/supabase/supabaseClient';

/**
 * ProfileChecker Component
 * 
 * This component runs a check on user's profile after authentication
 * If the profile is incomplete (missing names), it redirects to a completion page
 */
const ProfileChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      // Only check if user is authenticated
      if (!authState.user || !authState.user.id) {
        setIsChecking(false);
        return;
      }

      try {
        // Direct database check for the most current profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', authState.user.id)
          .single();

        if (error) {
          console.error('Error checking profile completeness:', error);
          setIsChecking(false);
          return;
        }

        // Check if profile data is missing first or last name
        if (!profileData || !profileData.first_name || !profileData.last_name) {
          console.log('Profile is incomplete, redirecting to completion page');
          navigate('/complete-profile');
          return;
        }

        // Profile is complete, continue
        setIsChecking(false);
      } catch (err) {
        console.error('Error in profile check:', err);
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [authState.user, navigate]);

  // Show nothing while checking to prevent flicker
  if (isChecking) {
    return null;
  }

  // Render children once check is complete
  return <>{children}</>;
};

export default ProfileChecker;