import React from 'react';
import { SubscriptionTier } from '../types';
import './ServiceSelector.css';

interface Service {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  configured: boolean;
  requiresSubscription?: boolean;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedService: string | null;
  subscriptionTier: SubscriptionTier;
  onServiceSelect: (serviceId: string) => void;
  onServiceToggle: (serviceId: string) => void;
  onUpgradeSubscription?: () => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedService,
  subscriptionTier,
  onServiceSelect,
  onServiceToggle,
  onUpgradeSubscription
}) => {
  // Helper to get service status text
  const getServiceStatus = (service: Service): string => {
    if (!service.enabled) return "Inactive";
    if (service.configured) return "Configured";
    return "Not Configured";
  };

  // Helper to get status class
  const getStatusClass = (service: Service): string => {
    if (!service.enabled) return "inactive";
    if (service.configured) return "configured";
    return "pending";
  };

  // Handle clicking on the service card
  const handleServiceClick = (serviceId: string) => {
    onServiceSelect(serviceId);
  };

  // Handle toggling service on/off
  const handleServiceToggle = (event: React.MouseEvent, serviceId: string) => {
    event.stopPropagation();
    
    // Check if service requires subscription
    const service = services.find(s => s.id === serviceId);
    if (service?.requiresSubscription && subscriptionTier === SubscriptionTier.FREE && !service.enabled) {
      // If trying to enable a subscription-required service, trigger upgrade flow
      if (onUpgradeSubscription) {
        onUpgradeSubscription();
      }
      return;
    }
    
    onServiceToggle(serviceId);
  };

  return (
    <div className="service-selector">
      <h2 className="service-selector-title">Select MCP Services</h2>
      <p className="service-selector-description">
        Choose which services you want to configure for your Claude AI Assistant.
      </p>

      <div className="service-cards">
        {services.map(service => (
          <div 
            key={service.id}
            className={`service-card ${selectedService === service.id ? 'selected' : ''} ${service.enabled ? 'enabled' : ''}`}
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="service-header">
              <h3 className="service-name">{service.name}</h3>
              <div className="service-status-container">
                <span className={`service-status ${getStatusClass(service)}`}>
                  {getServiceStatus(service)}
                </span>
                <button 
                  className={`service-toggle ${service.enabled ? 'on' : 'off'}`}
                  onClick={(e) => handleServiceToggle(e, service.id)}
                  aria-label={service.enabled ? 'Disable service' : 'Enable service'}
                >
                  {service.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
            
            <p className="service-description">{service.description}</p>
            
            {service.requiresSubscription && subscriptionTier === SubscriptionTier.FREE && (
              <div className="subscription-required">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Requires subscription</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
