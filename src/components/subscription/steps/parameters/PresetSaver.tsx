import React, { useState } from 'react';

interface PresetSaverProps {
  onSave: (name: string) => void;
  disabled?: boolean;
}

const PresetSaver: React.FC<PresetSaverProps> = ({
  onSave,
  disabled = false
}) => {
  const [enablePreset, setEnablePreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  
  const handleSave = () => {
    if (presetName.trim()) {
      onSave(presetName.trim());
      setPresetName('');
    }
  };
  
  return (
    <div style={{ 
      opacity: disabled ? 0.7 : 1, 
      pointerEvents: disabled ? 'none' : 'auto',
      marginTop: '30px'
    }}>
      <h4>Save Parameters as Preset</h4>
      <p>Save these parameters for future use to avoid repetitive setup.</p>
      <form>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input 
            type="checkbox" 
            checked={enablePreset}
            onChange={() => setEnablePreset(!enablePreset)}
            style={{ marginRight: '5px' }}
          />
          Enable preset saving
        </label>
        
        {enablePreset && (
          <div style={{ marginTop: '10px' }}>
            <input 
              type="text" 
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name"
              style={{ 
                padding: '8px', 
                borderRadius: '4px', 
                border: '1px solid #ccc',
                marginRight: '10px'
              }}
            />
            
            <button 
              type="button"
              onClick={handleSave}
              disabled={!presetName.trim()}
              style={{
                padding: '8px 15px',
                backgroundColor: '#1976D2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: presetName.trim() ? 'pointer' : 'not-allowed',
                opacity: presetName.trim() ? 1 : 0.7
              }}
            >
              Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PresetSaver;