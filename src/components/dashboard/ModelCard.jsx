import React, { useState } from 'react';

const ModelCard = ({ model, userTier, onAddToConfiguration }) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Check if model is available for user's tier
  const isAvailable = 
    model.tier === userTier || 
    (model.tier === "Basic" && userTier === "Standard") || 
    userTier === "Complete";
  
  return (
    <div className="model-card">
      <div className="model-header">
        <h3 className="model-title">{model.name}</h3>
        <div className="model-badges">
          {model.isNew && (
            <span className="new-badge">New</span>
          )}
          {model.isFree ? (
            <span className="free-badge">Free Model</span>
          ) : (
            <span className="paid-badge">Paid Model</span>
          )}
        </div>
      </div>
      
      <p className="model-description">{model.description || 'No description available'}</p>
      
      <div className="model-meta">
        {model.releaseDate ? (
          <div className="meta-item">
            <svg className="meta-icon calendar" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5z"/>
            </svg>
            Released: {model.releaseDate}
          </div>
        ) : null}
        {model.version ? (
          <div className="meta-item">
            <svg className="meta-icon version" viewBox="0 0 24 24">
              <path d="M16 10h-2v2h2v-2zm0 4h-2v2h2v-2zm-8-4H6v2h2v-2zm0 4H6v2h2v-2zm12-2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8zm-2 0c0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6 6-2.69 6-6z"/>
            </svg>
            v{model.version}
          </div>
        ) : null}
          {model.usageCount ? (
            <div className="meta-item">
              <svg className="meta-icon users" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {model.usageCount.toLocaleString()} users
            </div>
          ) : null}
          {model.rating ? (
            <div className="meta-item">
              <svg className="meta-icon star" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              {model.rating} rating
            </div>
          ) : null}
      </div>
      
      {model.previousVersions && Array.isArray(model.previousVersions) && model.previousVersions.length > 0 && (
        <div className="model-versions">
          <button 
            className="version-history-toggle"
            onClick={() => setShowVersionHistory(!showVersionHistory)}
          >
            <svg 
              className="meta-icon" 
              viewBox="0 0 24 24"
              style={{ transform: showVersionHistory ? 'rotate(90deg)' : 'none' }}
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
            View version history ({model.previousVersions.length} previous versions)
          </button>
          
          {showVersionHistory && (
            <div className="version-history">
              <ul className="version-list">
                <li className="version-item">
                  <strong>Current: v{model.version}</strong> (Released: {model.releaseDate})
                </li>
                {model.previousVersions.map((version, index) => (
                  <li key={index} className="version-item">
                    v{version}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="model-actions">
        {isAvailable ? (
          <button 
            className="add-model-button"
            onClick={() => onAddToConfiguration && onAddToConfiguration(model.id)}
          >
            Add to Configuration
          </button>
        ) : (
          <div className="tier-required">
            <span className="tier-required-text">
              {model.tier} Tier Required
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelCard;
