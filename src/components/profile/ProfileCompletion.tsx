import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../services/supabase/supabaseClient';
import '../auth/AuthStatus.css';
import '../auth/AuthContainer.css';

/**
 * ProfileCompletion Component
 * 
 * Shown when a user's profile is missing required information (first and last name)
 * Forces users to complete their profile before accessing the application
 */
const ProfileCompletion: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Pre-fill with any existing data
  useEffect(() => {
    if (authState.user) {
      // Set from authState if available
      setFirstName(authState.user.firstName || '');
      setLastName(authState.user.lastName || '');
      
      // Also try to get directly from database for most current data
      const fetchProfileData = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', authState.user?.id || '')
            .single();
            
          if (error) throw error;
          
          if (data) {
            if (data.first_name) setFirstName(data.first_name);
            if (data.last_name) setLastName(data.last_name);
          }
        } catch (err) {
          console.error('Error fetching profile data:', err);
        }
      };
      
      fetchProfileData();
    }
  }, [authState.user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      setError('Please provide both first and last name.');
      return;
    }
    
    if (!authState.user) {
      setError('Not authenticated. Please log in again.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Updating profile with names:', { firstName, lastName });
      
      // Update the profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Update also in local storage if your app uses it
      localStorage.setItem('userFirstName', firstName);
      localStorage.setItem('userLastName', lastName);
      
      setSuccess(true);
      
      // Redirect after a brief delay to show success
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred updating your profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">MCP Configuration Tool</h1>
        <h2 className="auth-subtitle">Complete Your Profile</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="auth-verification-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Profile updated successfully! Redirecting...</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name <span className="required">*</span></label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name <span className="required">*</span></label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
                disabled={loading}
                required
              />
            </div>
            
            <div className="auth-help-text">
              <p>
                Please provide your name to complete your profile setup.
                This information helps us personalize your experience.
              </p>
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileCompletion;