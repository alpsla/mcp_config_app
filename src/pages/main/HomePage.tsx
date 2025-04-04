import React from 'react';
import './MainPages.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>MCP Configuration Tool</h1>
        <p>
          Configure Claude's Model Control Protocol servers to enhance your AI experience
        </p>
        <a href="#/dashboard" className="cta-button">
          Get Started
        </a>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>File System</h3>
          <p>
            Connect Claude to your local files and directories securely
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Web Search</h3>
          <p>
            Enable Claude to search the web for up-to-date information
          </p>
        </div>
        
        <div className="feature-card">
          <h3>Hugging Face</h3>
          <p>
            Extend Claude with powerful AI models from Hugging Face
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;