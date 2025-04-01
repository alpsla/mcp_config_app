import React, { useState, useEffect } from 'react';

/**
 * Custom slider specifically for search results count
 */
const ResultsCountSlider = ({ value, onChange, min = 1, max = 10 }) => {
  const [sliderValue, setSliderValue] = useState(value || 5);
  
  useEffect(() => {
    if (value !== undefined) {
      setSliderValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setSliderValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Calculate percentage for styling
  const percentage = ((sliderValue - min) / (max - min)) * 100;
  
  return (
    <div className="results-slider-container">
      <div className="results-slider-display">
        <div className="current-value">{sliderValue}</div>
      </div>
      
      <div className="results-slider-wrapper">
        <input
          type="range"
          min={min}
          max={max}
          value={sliderValue}
          onChange={handleChange}
          className="results-slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
          }}
        />
        
        <div className="slider-labels">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
      
      <style jsx>{`
        .results-slider-container {
          width: 100%;
          margin: 15px 0;
          position: relative;
        }
        
        .results-slider-display {
          width: 100%;
          text-align: right;
          margin-bottom: 5px;
        }
        
        .current-value {
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .results-slider-wrapper {
          position: relative;
          padding-bottom: 20px;
        }
        
        .results-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
        }
        
        .results-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 2px rgba(0,0,0,0.3);
        }
        
        .results-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 2px rgba(0,0,0,0.3);
        }
        
        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          color: #6b7280;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ResultsCountSlider;