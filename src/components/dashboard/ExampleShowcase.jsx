import React, { useState, useRef, useEffect } from 'react';
import './ExampleShowcase.css';

const ExampleShowcase = ({ example }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Debug: log the example data to check asset paths
    console.log(`Rendering example: ${example.id}`, {
      type: example.type,
      assetPath: example.assetPath,
      assetLoaded: example.assetPath ? 'Yes' : 'No'
    });
    
    // Check if the asset exists by attempting to fetch it
    if (example.assetPath) {
      console.log(`Attempting to verify asset: ${example.assetPath}`);
      fetch(example.assetPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Asset not found: ${response.status}`);
          }
          console.log(`Asset found: ${example.assetPath}`);
          return response;
        })
        .catch(error => {
          console.error(`Error verifying asset: ${example.assetPath}`, error);
          // Set appropriate error state based on example type
          if (example.type === 'image') setImageError(true);
          if (example.type === 'audio') setAudioError(true);
          if (example.type === 'video') setVideoError(true);
        });
    }
    
    // Reset error states when example changes
    setImageError(false);
    setAudioError(false);
    setVideoError(false);
  }, [example]);
  
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
  
  const renderFallbackMessage = (type) => (
    <div className="asset-error" style={{ padding: '20px', background: '#f8f8f8', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ color: '#666' }}>{type} asset could not be loaded</p>
      <p style={{ fontSize: '14px', marginTop: '10px' }}>
        Expected path: {example.assetPath}
      </p>
    </div>
  );

  const renderExampleContent = () => {
    switch (example.type) {
      case 'image':
        return (
          <div className="example-result image-result">
            {/* Use public URL for assets */}
            {imageError ? renderFallbackMessage('Image') : (
              <img 
                src={example.assetPath} 
                alt={example.title} 
                onError={(e) => {
                  console.error(`Error loading image: ${example.assetPath}`, e);
                  setImageError(true);
                }}
              />
            )}
          </div>
        );
        
      case 'audio':
        return (
          <div className="example-result audio-result">
            {audioError ? renderFallbackMessage('Audio') : (
              <div className="audio-player">
                <div className="player-controls">
                  <button 
                    className={`play-button ${isPlaying ? 'playing' : ''}`}
                    onClick={handlePlayAudio}
                    disabled={audioError}
                  >
                    {isPlaying ? '❚❚' : '▶'}
                  </button>
                  
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>
                  
                  <span className="time-display">00:30</span>
                </div>
                
                {/* Use public URL for assets */}
                <audio 
                  ref={audioRef}
                  src={example.assetPath}
                  onEnded={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error(`Error loading audio: ${example.assetPath}`, e);
                    setAudioError(true);
                  }}
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
            )}
          </div>
        );
        
      case 'video':
        return (
          <div className="example-result video-result">
            {/* Use public URL for assets */}
            {videoError ? renderFallbackMessage('Video') : (
              <video 
                src={example.assetPath}
                controls
                width="100%"
                height="auto"
                style={{ maxHeight: '300px', borderRadius: 'var(--border-radius)' }}
                onError={(e) => {
                  console.error(`Error loading video: ${example.assetPath}`, e);
                  setVideoError(true);
                }}
              ></video>
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