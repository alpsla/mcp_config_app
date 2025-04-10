import React from 'react';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextColor?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextColor = '#1976D2'
}) => {
  return (
    <div style={{
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      maxWidth: '650px',
      margin: '30px auto 0'
    }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          padding: '12px 24px',
          backgroundColor: '#fff',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
      >
        Back
      </button>
      
      <button
        type="button"
        onClick={onNext}
        style={{
          padding: '12px 28px',
          backgroundColor: nextColor,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = nextColor === '#1976D2' ? '#1565C0' : nextColor;
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = nextColor;
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}
      >
        Next
      </button>
    </div>
  );
};

export default NavigationButtons;