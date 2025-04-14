import React, { useState } from 'react';
import './PresetSaver.css';

interface PresetSaverProps {
  onSave: (name: string) => void;
  disabled?: boolean;
}

/**
 * PresetSaver component for saving parameter settings as presets
 * 
 * This version fixes the layout issues with the save button appearing as a popup
 * and properly positions it inline with the form input.
 */
const PresetSaver: React.FC<PresetSaverProps> = ({
  onSave,
  disabled = false
}) => {
  const [presetName, setPresetName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (presetName.trim()) {
      onSave(presetName.trim());
      setPresetName('');
    }
  };
  
  return (
    <div className="preset-saver">
      <h4 id="preset-heading">Save as Preset</h4>
      <p className="preset-description">
        Save your current parameter settings as a preset for future use.
      </p>
      
      <form onSubmit={handleSubmit} className="preset-form">
        <div className="preset-input-container">
          <input
            type="text"
            name="presetName"
            id="preset-name-input"
            className="preset-name-input"
            placeholder="Enter preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            disabled={disabled}
            aria-labelledby="preset-heading"
          />
        </div>
        
        <button
          type="submit"
          className="save-preset-button"
          disabled={disabled || !presetName.trim()}
          aria-labelledby="preset-heading"
        >
          Save Preset
        </button>
      </form>
    </div>
  );
};

export default PresetSaver;