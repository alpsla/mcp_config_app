import React, { useState, useRef } from 'react';
import './ExampleShowcase.css';

const ExampleShowcase = ({ example }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const renderPromptInterface = () => (
    <div className="prompt-interface">
      <div className="prompt-header">
        <span>Prompt for {example.type === 'image' ? 'Image' : example.type === 'audio' ? 'Audio' : 'Video'}</span>
        
        {example.type === 'image' && (
          <div className="style-tags">
            <span className="style-tag active">Photorealistic</span>
            <span className="style-tag">Animation</span>
            <span className="style-tag">Artistic</span>
          </div>
        )}
        
        {example.type === 'audio' && (
          <div className="genre-tags">
            <span className="genre-tag">Upbeat</span>
            <span className="genre-tag active">Holiday</span>
            <span className="genre-tag">Tropical</span>
          </div>
        )}
      </div>
      
      <div className="prompt-content">
        <p>{example.prompt}</p>
      </div>
      
      {/* Generate button removed as it's just a showcase */}
    </div>
  );
  
  const renderExampleContent = () => {
    switch (example.type) {
      case 'image':
        return (
          <div className="example-result image-result">
            <img src={example.assetPath} alt={example.title} />
          </div>
        );
        
      case 'audio':
        return (
          <div className="example-result audio-result">
            <div className="audio-player">
              <div className="player-controls">
                <button 
                  className={`play-button ${isPlaying ? 'playing' : ''}`}
                  onClick={handlePlayAudio}
                >
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%' }}></div>
                </div>
                
                <span className="time-display">01:23 / 02:45</span>
              </div>
              
              <audio 
                ref={audioRef}
                src={example.assetPath} 
                onEnded={() => setIsPlaying(false)}
                style={{ display: 'none' }}
              />
              
              <div className="audio-visualization">
                {Array(20).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className={`viz-bar ${isPlaying ? 'active' : ''}`}
                    style={{ 
                      height: `${20 + Math.random() * 40}px`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'video':
        return (
          <div className="example-result video-result">
            {example.assetPath ? (
              <video 
                src={example.assetPath} 
                controls
                width="100%"
                height="auto"
                style={{ maxHeight: '300px', borderRadius: 'var(--border-radius)' }}
              ></video>
            ) : (
              <div className="video-placeholder">
                <div className="video-placeholder-icon">🎬</div>
                <span>Video example coming soon</span>
                <p className="video-placeholder-message">We're working on an amazing demonstration of our virtual world capabilities!</p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="example-card">
      <div className="example-columns">
        {renderPromptInterface()}
        {renderExampleContent()}
      </div>
      
      <div className="example-info">
        <h3>{example.title}</h3>
        <p className="model-info">Created with <strong>{example.model}</strong></p>
        <p className="example-description">
          This example demonstrates how you can use the {example.model} model 
          when configured through your MCP server.
        </p>
        {/* 'Try It Yourself' button removed as it's just a showcase */}
      </div>
    </div>
  );
};

export default ExampleShowcase;