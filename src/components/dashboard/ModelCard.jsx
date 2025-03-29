import React from 'react';
import './ModelCard.css';

const ModelCard = ({ model, onWatchDemo = () => {} }) => {
  return (
    <div className="model-card">
      <div className="model-badge-container">
        <span className="model-category">{model.category}</span>
        <span className="tier-badge tier-paid">Paid</span>
      </div>
      
      <h3 className="model-name">{model.name}</h3>
      <p className="model-description">{model.description}</p>
      
      <div className="model-card-footer">
        <button 
          className="model-demo-button" 
          onClick={() => onWatchDemo(model.id, model.demoUrl)}
        >
          Watch Demo
        </button>
      </div>
    </div>
  );
};

export default ModelCard;