import React from 'react';

const ConfigurationCard = ({ 
  config, 
  expandedConfig, 
  validationState, 
  feedback,
  onToggleDetails, 
  onValidate, 
  onFeedback,
  onFixIssues,
  onUseConfiguration,
  onCloseValidation,
  onSubmitFeedback,
  onCloseFeedback
}) => {
  // Format date string for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };
  
  // Get status badge based on config status
  const getStatusBadge = (status) => {
    if (status === 'Valid') {
      return (
        <span className="status-badge valid">
          Valid
        </span>
      );
    } else {
      return (
        <span className="status-badge invalid">
          Invalid
        </span>
      );
    }
  };
  
  return (
    <div className="configuration-card">
      <div className="config-header">
        <div className="config-left">
          <button 
            className="expand-button"
            onClick={() => onToggleDetails(config.id)}
            aria-expanded={expandedConfig === config.id}
          >
            <svg className={`expand-icon ${expandedConfig === config.id ? 'expanded' : ''}`} viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
          <h3 className="config-title">{config.name}</h3>
        </div>
        
        <div className="config-right">
          <div className="config-badges">
            <span className="tier-badge">{config.type}</span>
            {getStatusBadge(config.status)}
          </div>
          
          <div className="config-actions">
            <button 
              className="action-button validate-button"
              onClick={() => onValidate(config.id)}
            >
              Test & Validate
            </button>
            <button className="action-button">Edit</button>
            <button className="action-button">Duplicate</button>
            <button className="action-button">Export</button>
          </div>
        </div>
      </div>
      
      <div className="config-meta">
        <div className="meta-item">
          <span className="meta-label">Modified:</span>
          <span className="meta-value">{formatDate(config.lastModified)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Last used:</span>
          <span className="meta-value">{formatDate(config.lastUsed)}</span>
        </div>
        <div className="feedback-link">
          <button 
            className="feedback-button"
            onClick={() => onFeedback(config.id)}
          >
            <svg className="feedback-icon" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
            </svg>
            Give Feedback
          </button>
        </div>
      </div>
      
      {/* Expanded Configuration Details */}
      {expandedConfig === config.id && (
        <div className="config-details">
          <div className="details-grid">
            <div className="details-column">
              <h4 className="details-title">Enabled Services</h4>
              <ul className="services-list">
                {config.services.webSearch && (
                  <li className="service-item">
                    <svg className="service-icon" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Web Search
                  </li>
                )}
                {config.services.fileSystem && (
                  <li className="service-item">
                    <svg className="service-icon" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    File System
                  </li>
                )}
                {config.services.huggingFace && (
                  <li className="service-item">
                    <svg className="service-icon" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Hugging Face Models
                  </li>
                )}
              </ul>
            </div>
            
            <div className="details-column">
              <h4 className="details-title">Enabled Models</h4>
              {config.models.length > 0 ? (
                <ul className="models-list">
                  {config.models.map((model, index) => (
                    <li key={index} className="model-item">
                      <svg className="model-icon" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      {model}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-models">No models enabled</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Validation Results (conditionally rendered) */}
      {validationState.visible && validationState.configId === config.id && (
        <div className="validation-results">
          <h4 className="validation-title">Configuration Validation</h4>
          
          {validationState.inProgress ? (
            <div className="validation-loading">
              <div className="loading-spinner"></div>
              <span>Validating configuration...</span>
            </div>
          ) : (
            <div className="validation-content">
              <div className={`validation-summary ${validationState.result?.success ? 'valid' : 'invalid'}`}>
                <div className="summary-icon">
                  {validationState.result?.success ? (
                    <svg className="success-icon" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  ) : (
                    <svg className="error-icon" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  )}
                </div>
                <div className="summary-content">
                  <h5 className="summary-title">
                    {validationState.result?.success ? 'Configuration is valid' : 'Configuration needs attention'}
                  </h5>
                  <p className="summary-message">
                    {validationState.result?.claudeIntegration.message}
                  </p>
                  {!validationState.result?.success && (
                    <p className="troubleshooting-info">
                      Click "Troubleshoot Issues" below for step-by-step guidance to resolve these problems.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="validation-details">
                {validationState.result?.components.webSearch && (
                  <div className="validation-item">
                    <div className={`item-status ${validationState.result.components.webSearch.status.toLowerCase()}`}>
                      {validationState.result.components.webSearch.status === 'Valid' ? (
                        <svg className="status-icon" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      ) : (
                        <svg className="status-icon" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                        </svg>
                      )}
                    </div>
                    <div className="item-details">
                      <span className="item-title">Web Search:</span>
                      <span className="item-message">{validationState.result.components.webSearch.message}</span>
                    </div>
                  </div>
                )}
                
                {validationState.result?.components.fileSystem && (
                  <div className="validation-item">
                    <div className={`item-status ${validationState.result.components.fileSystem.status.toLowerCase()}`}>
                      {validationState.result.components.fileSystem.status === 'Valid' ? (
                        <svg className="status-icon" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      ) : (
                        <svg className="status-icon" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                        </svg>
                      )}
                    </div>
                    <div className="item-details">
                      <span className="item-title">File System:</span>
                      <span className="item-message">{validationState.result.components.fileSystem.message}</span>
                    </div>
                  </div>
                )}
                
                {validationState.result?.components.huggingFace && (
                  <div className="validation-item">
                    <div className={`item-status ${validationState.result.components.huggingFace.status.toLowerCase()}`}>
                      {validationState.result.components.huggingFace.status === 'Valid' ? (
                        <svg className="status-icon" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      ) : (
                        <svg className="status-icon" viewBox="0 0 24 24">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                        </svg>
                      )}
                    </div>
                    <div className="item-details">
                      <span className="item-title">Hugging Face:</span>
                      <span className="item-message">{validationState.result.components.huggingFace.message}</span>
                      <div className="item-extra">
                        <span className={`token-status ${validationState.result.components.huggingFace.tokenValid ? 'valid' : 'invalid'}`}>
                          {validationState.result.components.huggingFace.tokenValid ? '✓ Token is valid' : '✗ Token is invalid'}
                        </span>
                        <span className={`models-status ${validationState.result.components.huggingFace.modelsAccessible ? 'valid' : 'invalid'}`}>
                          {validationState.result.components.huggingFace.modelsAccessible ? '✓ Models are accessible' : '✗ Models are not accessible'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="validation-item">
                  <div className={`item-status ${validationState.result?.claudeIntegration.status.toLowerCase()}`}>
                    {validationState.result?.claudeIntegration.status === 'Valid' ? (
                      <svg className="status-icon" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    ) : (
                      <svg className="status-icon" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                      </svg>
                    )}
                  </div>
                  <div className="item-details">
                    <span className="item-title">Claude Integration:</span>
                    <span className="item-message">{validationState.result?.claudeIntegration.message}</span>
                  </div>
                </div>
              </div>
              
              <div className="validation-actions">
                <button 
                  className="secondary-button"
                  onClick={onCloseValidation}
                >
                  Close
                </button>
                
                <div className="primary-actions">
                  {!validationState.result?.success && (
                    <button 
                      className="troubleshoot-button"
                      onClick={() => onFixIssues(config.id)}
                    >
                      <svg className="button-icon" viewBox="0 0 24 24">
                        <path d="M19.1,12.9a2.8,2.8,0,0,0,0-3.9,33.4,33.4,0,0,0-4.2-3.7,35.6,35.6,0,0,0-4.5-2.7,2.9,2.9,0,0,0-3.9,2.2A10.1,10.1,0,0,0,6.7,8a12.8,12.8,0,0,0,.2,2.8,30.7,30.7,0,0,1-8.4,7A.9.9,0,0,0,.1,19.5a29.4,29.4,0,0,0,5.1,2.3,1,1,0,0,0,1.2-.5,7.3,7.3,0,0,1,4.1-3.8,31.7,31.7,0,0,0,5,1.6,2.9,2.9,0,0,0,3.5-2A31.8,31.8,0,0,0,21.4,13.2,2.2,2.2,0,0,0,19.1,12.9ZM12,10.2a2,2,0,0,1-2-2,2,2,0,0,1,2-2,2,2,0,0,1,2,2A2,2,0,0,1,12,10.2Z"/>
                      </svg>
                      Troubleshoot Issues
                    </button>
                  )}
                  
                  {validationState.result?.success && (
                    <button 
                      className="use-button"
                      onClick={() => onUseConfiguration(config.id)}
                    >
                      Use Configuration
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Feedback Form (conditionally rendered) */}
      {feedback.visible && feedback.configId === config.id && (
        <div className="feedback-form">
          <h4 className="feedback-title">How is this configuration working for you?</h4>
          
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button 
                key={rating}
                className="rating-button"
                data-rating={rating}
                onClick={(e) => {
                  // Clear any existing selected buttons
                  document.querySelectorAll('.rating-button').forEach(btn => {
                    btn.classList.remove('selected');
                  });
                  // Mark this button as selected
                  e.currentTarget.classList.add('selected');
                }}
              >
                {rating}
              </button>
            ))}
          </div>
          
          <div className="feedback-comment">
            <textarea 
              placeholder="Additional comments (optional)"
              rows="2"
              className="comment-input"
            ></textarea>
          </div>
          
          <div className="feedback-actions">
            <button 
              className="secondary-button"
              onClick={onCloseFeedback}
            >
              Cancel
            </button>
            <button 
              className="primary-button"
              onClick={(e) => {
                const selectedButton = document.querySelector('.rating-button.selected');
                const rating = selectedButton ? selectedButton.getAttribute('data-rating') : null;
                const comment = document.querySelector('.comment-input').value || '';
                
                if (rating) {
                  onSubmitFeedback(config.id, rating, comment);
                } else {
                  alert('Please select a rating');
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationCard;
