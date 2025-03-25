import React from 'react';
import MagicLinkLogin from '../../components/auth/MagicLinkLogin';

// Styles for the magic link page
const pageStyles = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  backgroundColor: '#f8f9fa'
};

const cardStyles = {
  maxWidth: '450px',
  width: '100%',
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
};

/**
 * Magic Link Login Page
 * 
 * A dedicated page for magic link authentication
 */
const MagicLinkPage: React.FC = () => {
  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Secure Login</h1>
        
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Login without a password using a secure link sent to your email
        </p>
        
        <MagicLinkLogin />
        
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <a href="/login" style={{ color: '#4F46E5', textDecoration: 'none' }}>
            Return to standard login
          </a>
        </div>
      </div>
    </div>
  );
};

export default MagicLinkPage;