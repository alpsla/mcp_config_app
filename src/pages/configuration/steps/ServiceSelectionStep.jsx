import React from 'react';
import { InfoIcon } from '../../../components/icons';

const ServiceSelectionStep = ({ 
  services, 
  toggleService, 
  getServiceStatus, 
  getStatusClass, 
  subscriptionTier,
  onContinue,
  onCancel
}) => {
  return (
    <div className="step-content selection-step">
      <h2>Choose Services</h2>
      <p className="step-description">
        Select which services you want to enable for your Claude MCP configuration.
      </p>
      
      <div className="services-grid">
        {services.map(service => (
          <div 
            key={service.id}
            className={`service-card ${service.enabled ? 'enabled' : ''}`}
            onClick={() => toggleService(service.id)}
          >
            <div className="card-header">
              <div className="service-info">
                <h3>{service.name}</h3>
                <span className={`status-badge ${getStatusClass(service)}`}>
                  {getServiceStatus(service)}
                </span>
              </div>
              
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id={`toggle-${service.id}`}
                  checked={service.enabled}
                  onChange={() => toggleService(service.id)}
                  className="toggle-input"
                />
                <label 
                  htmlFor={`toggle-${service.id}`}
                  className="toggle-label"
                ></label>
              </div>
            </div>

            <div className="card-content">
              <p>{service.description}</p>
              
              {service.id === 'huggingFace' && subscriptionTier === 'none' && (
                <div className="subscription-notice">
                  <InfoIcon />
                  <p>Requires subscription to enable</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="step-actions" style={{ marginBottom: 0 }}>
        <button 
          className="btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        
        <button 
          className="btn-primary"
          onClick={onContinue}
          disabled={!services.some(service => service.enabled)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;