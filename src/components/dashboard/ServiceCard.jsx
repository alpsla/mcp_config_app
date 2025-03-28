import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-header">
        <div className={`service-icon icon-${service.icon}`}>
          {service.icon === 'folder' ? '📁' : service.icon === 'search' ? '🔍' : '🔧'}
        </div>
        <h3 className="service-title">{service.title}</h3>
        <span className="compatibility-badge">{service.compatibility}</span>
      </div>
      
      <p className="service-description">{service.description}</p>
      
      <ul className="service-benefits">
        {service.bulletPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      
      <button className="configure-button">Configure</button>
    </div>
  );
};

export default ServiceCard;