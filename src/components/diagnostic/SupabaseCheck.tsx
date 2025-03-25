import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../services/supabase/supabaseClient';

export const SupabaseCheck: React.FC = () => {
  const [status, setStatus] = useState<{
    configured: boolean;
    urlSet: boolean;
    keySet: boolean;
    connectionTest: 'untested' | 'success' | 'failed';
    error: string | null;
  }>({
    configured: false,
    urlSet: false,
    keySet: false,
    connectionTest: 'untested',
    error: null
  });

  useEffect(() => {
    const checkConfiguration = async () => {
      // Check if Supabase URL and key are set
      const urlSet = Boolean(process.env.REACT_APP_SUPABASE_URL);
      const keySet = Boolean(process.env.REACT_APP_SUPABASE_ANON_KEY);
      const configured = isSupabaseConfigured();

      // Test the connection
      let connectionTest: 'untested' | 'success' | 'failed' = 'untested';
      let error = null;

      try {
        if (configured) {
          // Simple test query to check connection
          const { error: testError } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(0);
          
          if (testError) {
            connectionTest = 'failed';
            error = testError.message;
          } else {
            connectionTest = 'success';
          }
        }
      } catch (err: any) {
        connectionTest = 'failed';
        error = err.message;
      }

      setStatus({
        configured,
        urlSet,
        keySet,
        connectionTest,
        error
      });
    };

    checkConfiguration();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', margin: '20px', maxWidth: '600px' }}>
      <h2 style={{ marginTop: 0 }}>Supabase Configuration Check</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Supabase URL Set:</strong> {status.urlSet ? '✅ Yes' : '❌ No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Supabase Anon Key Set:</strong> {status.keySet ? '✅ Yes' : '❌ No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Supabase Configured:</strong> {status.configured ? '✅ Yes' : '❌ No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Connection Test:</strong> {
          status.connectionTest === 'untested' ? '⏳ Untested' :
          status.connectionTest === 'success' ? '✅ Success' :
          '❌ Failed'
        }
      </div>
      
      {status.error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff0f0', borderRadius: '4px', color: '#d32f2f' }}>
          <strong>Error:</strong> {status.error}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>If there are any issues:</p>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Check that you've created a <code>.env</code> file with your Supabase credentials</li>
          <li>Verify that the environment variables are correctly named <code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code></li>
          <li>Confirm that you've restarted the development server after adding the environment variables</li>
          <li>Make sure your Supabase project is active and the API is available</li>
        </ol>
      </div>
    </div>
  );
};
