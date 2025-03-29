import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card" style={{ textAlign: 'center' }}>
      <div className="service-header">
        <div className={`service-icon icon-${service.icon}`}>
          {service.icon === 'folder' ? '📁' : service.icon === 'search' ? '🔍' : '🔧'}
        </div>
        <h3 className="service-title">{service.title}</h3>
        <span className="compatibility-badge">{service.compatibility}</span>
      </div>
      
      <p className="service-description" style={{ textAlign: 'center' }}>{service.description}</p>
      
      <ul className="service-benefits" style={{ listStyle: 'none', padding: 0, margin: '0 auto', textAlign: 'center' }}>
        {service.bulletPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      
      <button className="configure-button" style={{ display: 'block', margin: '0 auto', minWidth: '150px' }}>Configure</button>
    </div>
  );
};

export default ServiceCard;