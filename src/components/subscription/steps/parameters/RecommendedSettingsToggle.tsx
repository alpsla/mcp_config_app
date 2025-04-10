import React from 'react';

interface RecommendedSettingsToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const RecommendedSettingsToggle: React.FC<RecommendedSettingsToggleProps> = ({
  enabled,
  onChange
}) => {
  return (
    <div style={{
      maxWidth: '650px',
      margin: '0 auto 20px',
      padding: '20px',
      backgroundColor: '#E3F2FD',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
          Use Recommended Settings
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>
          We've configured optimal parameters for most use cases.
        </div>
      </div>
      <label className="switch" style={{
        position: 'relative',
        display: 'inline-block',
        width: '60px',
        height: '34px',
        marginLeft: '20px'
      }}>
        <input 
          type="checkbox" 
          checked={enabled}
          onChange={() => onChange(!enabled)}
          style={{
            opacity: 0,
            width: 0,
            height: 0
          }}
        />
        <span style={{
          position: 'absolute',
          cursor: 'pointer',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: enabled ? '#1976D2' : '#ccc',
          transition: '.4s',
          borderRadius: '34px'
        }}>
          <span style={{
            position: 'absolute',
            content: '""',
            height: '26px',
            width: '26px',
            left: enabled ? 'calc(100% - 30px)' : '4px',
            bottom: '4px',
            backgroundColor: 'white',
            transition: '.4s',
            borderRadius: '50%'
          }}></span>
        </span>
      </label>
    </div>
  );
};

export default RecommendedSettingsToggle;