import React, { useState, useEffect } from 'react';
import { ConfigWizard } from '../config/ConfigWizard';
import { PricingTiers } from '../subscription/PricingTiers';
import { checkAndRepairCurrentUserProfile } from '../../utils/profileRepair';
import { supabase } from '../../services/supabase/supabaseClient';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  
  // Run profile repair when dashboard mounts
  useEffect(() => {
    const repairProfile = async () => {
      try {
        console.log('Dashboard: Running profile repair check...');
        const result = await checkAndRepairCurrentUserProfile();
        console.log('Dashboard: Profile repair result:', result);
        
        // If repair didn't succeed, attempt manually
        if (!result.success || result.action === 'no_change_needed') {
          console.log('Dashboard: Profile repair didn\'t make changes, trying manual check...');
          
          // Get current authenticated user
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            const userId = data.user.id;
            const email = data.user.email || '';
            
            // Check if profile exists
            console.log('Dashboard: Checking if profile exists for', userId);
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id, email, first_name, last_name')
              .eq('id', userId)
              .maybeSingle();
            
            if (!existingProfile) {
              console.log('Dashboard: No profile found, creating one...');
              
              // Create profile if it doesn't exist
              const { error: createError } = await supabase
                .from('profiles')
                .insert([{
                  id: userId,
                  email: email,
                  first_name: 'User',
                  last_name: 'Name',
                  created_at: new Date().toISOString(),
                  subscription_tier: 'FREE'
                }]);
              
              if (createError) {
                console.error('Dashboard: Error creating profile:', createError);
              } else {
                console.log('Dashboard: Profile created successfully');
                // Force a reload to refresh user data
                window.location.reload();
              }
            } else {
              console.log('Dashboard: Profile exists:', existingProfile);
              
              // Check if profile needs updating
              let needsUpdate = false;
              const updateData: any = {};
              
              if (!existingProfile.email && email) {
                updateData.email = email;
                needsUpdate = true;
              }
              
              if (!existingProfile.first_name) {
                updateData.first_name = 'User';
                needsUpdate = true;
              }
              
              if (!existingProfile.last_name) {
                updateData.last_name = 'Name';
                needsUpdate = true;
              }
              
              if (needsUpdate) {
                console.log('Dashboard: Updating profile with data:', updateData);
                
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update(updateData)
                  .eq('id', userId);
                  
                if (updateError) {
                  console.error('Dashboard: Error updating profile:', updateError);
                } else {
                  console.log('Dashboard: Profile updated successfully');
                  // Force a reload to refresh user data
                  window.location.reload();
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Dashboard: Error during profile repair:', error);
      }
    };
    
    repairProfile();
  }, []);
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">MCP Configuration Tool</h1>
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'configuration' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuration')}
          >
            Configuration
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing
          </button>
          <div className="dashboard-tab coming-soon">
            Analytics <span className="badge">Coming Soon</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'configuration' && <ConfigWizard />}
        {activeTab === 'pricing' && <PricingTiers />}
      </div>
    </div>
  );
};
