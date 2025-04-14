import React, { useState } from 'react';
import './PresetSaver.fixed.css';

interface PresetSaverProps {
  onSave: (name: string) => void;
}

/**
 * Component for saving parameter presets
 * Provides an intuitive UI for naming and saving presets
 * Fully integrated with the parameter page
 */
const PresetSaver: React.FC<PresetSaverProps> = ({ onSave }) => {
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetName, setPresetName] = useState('');

  // Show the save form
  const handleShowSaveForm = () => {
    setShowSaveForm(true);
  };

  // Hide the save form and reset
  const handleCancel = () => {
    setShowSaveForm(false);
    setPresetName('');
  };

  // Save the preset and reset the form
  const handleSave = () => {
    if (!presetName.trim()) return;
    
    onSave(presetName.trim());
    setPresetName('');
    setShowSaveForm(false);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && presetName.trim()) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="preset-saver">
      {!showSaveForm ? (
        <button
          type="button"
          className="save-button"
          onClick={handleShowSaveForm}
        >
          <span className="save-icon">💾</span>
          Save Current Parameters as Preset
        </button>
      ) : (
        <div className="save-input-container">
          <div className="save-form-header">
            <h4 className="save-form-title">Save Parameter Preset</h4>
            <p className="save-form-description">
              Give your preset a memorable name related to its purpose (e.g., "Story Writing", "Technical Help").
            </p>
          </div>
          
          <input
            type="text"
            className="preset-name-input"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Enter a name for this preset"
            autoFocus
            onKeyDown={handleKeyDown}
          />
          
          <div className="save-actions">
            <button
              type="button"
              className="action-button cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            
            <button
              type="button"
              className="action-button save-confirm-button"
              onClick={handleSave}
              disabled={!presetName.trim()}
            >
              Save Preset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetSaver;