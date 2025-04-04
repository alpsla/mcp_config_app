import React from 'react';

const TestComponent = () => {
  return (
    <div style={{
      backgroundColor: 'red',
      color: 'white',
      padding: '20px',
      margin: '20px',
      borderRadius: '10px',
      fontWeight: 'bold',
      fontSize: '24px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      This is a test component to verify code updates are working!
      {new Date().toLocaleTimeString()}
    </div>
  );
};

export default TestComponent;