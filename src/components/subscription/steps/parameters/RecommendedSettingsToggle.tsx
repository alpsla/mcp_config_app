import React from 'react';
import './RecommendedSettingsToggle.css';

interface RecommendedSettingsToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const RecommendedSettingsToggle: React.FC<RecommendedSettingsToggleProps> = ({
  enabled,
  onChange
}) => {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="recommended-settings">
      <div className="toggle-container">
        <label className="toggle-label">
          <span className="toggle-text">
            Use Recommended Parameters
          </span>
          
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              checked={enabled}
              onChange={handleToggle}
              className="toggle-input"
              aria-label="Use recommended parameters"
              id="recommendedSettingsToggle"
            />
            <div className="toggle-slider"></div>
          </div>
        </label>
      </div>
      
      <div className="toggle-description">
        {enabled ? (
          <div className="description-with-icon">
            <div className="description-icon">✅</div>
            <p>
              <strong>Using optimized settings for your subscription.</strong> These settings provide a good balance 
              of quality and performance. You can still adjust any parameter as needed.
            </p>
          </div>
        ) : (
          <div className="description-with-icon">
            <div className="description-icon">🔧</div>
            <p>
              <strong>Custom settings mode.</strong> All parameters are set to your preferences.
              Toggle this switch to quickly restore recommended settings.
            </p>
          </div>
        )}
      </div>
      
      <div className="toggle-help">
        <div className="help-icon">💡</div>
        <div className="help-text">
          <strong>Tip:</strong> The recommended settings are just a starting point. Feel free to 
          adjust any parameter even when using recommended settings. Your changes will be saved
          when you create a preset.
        </div>
      </div>
    </div>
  );
};

export default RecommendedSettingsToggle;