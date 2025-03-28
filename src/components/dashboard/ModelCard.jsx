import React from 'react';
import './ModelCard.css';

const ModelCard = ({ model }) => {
  return (
    <div className="model-card">
      <div className="model-badge-container">
        <span className="model-category">{model.category}</span>
        {model.premium && <span className="premium-badge">Premium</span>}
      </div>
      
      <h3 className="model-name">{model.name}</h3>
      <p className="model-description">{model.description}</p>
      
      <div className="model-card-footer">
        <button className="model-button">Configure</button>
        <button className="model-demo-button">See Demo</button>
      </div>
    </div>
  );
};

export default ModelCard;