import React, { useState } from 'react';
import './ModelPreferencesUI.css';

const ModelPreferencesUI = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    temperature: 0.7,
    maxOutputLength: 1024,
    topP: 0.9,
    responseFormat: 'text',
    huggingFaceToken: ''
  });

  const handleChange = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete(preferences);
  };

  return (
    <div className="model-preferences-container">
      {step === 1 && (
        <div className="preferences-step">
          <div className="step-header">
            <h2>Model Preferences</h2>
            <span className="step-indicator">1 of 2 ▶</span>
          </div>
          
          <p className="step-description">
            Let's set up your default preferences for AI models.
            These settings will apply to all models unless customized.
          </p>
          
          <div className="preference-item">
            <label className="preference-label">
              <span className="preference-icon">🔍</span> Temperature
            </label>
            <p className="preference-description">
              Controls how random or focused model responses will be
            </p>
            
            <div className="slider-container">
              <span className="slider-min">0.0</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.temperature}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="slider-input"
              />
              <span className="slider-max">1.0</span>
            </div>
            
            <div className="slider-labels">
              <span>More focused</span>
              <span>More creative</span>
            </div>
            
            <div className="current-value">
              Current: {preferences.temperature.toFixed(1)}
            </div>
            
            <div className="recommendation">
              <span className="info-icon">ℹ️</span> Recommended:
              <ul className="recommendation-list">
                <li>0.2-0.3 for factual, technical, or code tasks</li>
                <li>0.6-0.8 for creative writing or idea generation</li>
              </ul>
            </div>
          </div>
          
          <div className="preference-item">
            <label className="preference-label">
              <span className="preference-icon">🔄</span> Max Output Length
            </label>
            <p className="preference-description">
              Limits how much text the model will generate at once
            </p>
            
            <select
              value={preferences.maxOutputLength}
              onChange={(e) => handleChange('maxOutputLength', parseInt(e.target.value))}
              className="select-input"
            >
              <option value="256">256 tokens</option>
              <option value="512">512 tokens</option>
              <option value="1024">1024 tokens</option>
              <option value="2048">2048 tokens</option>
              <option value="4096">4096 tokens</option>
            </select>
            
            <div className="recommendation">
              <span className="info-icon">ℹ️</span> Guidelines:
              <ul className="recommendation-list">
                <li>256 tokens ≈ 200 words (quick responses)</li>
                <li>1024 tokens ≈ 800 words (detailed responses)</li>
                <li>4096 tokens ≈ 3000 words (long-form content)</li>
              </ul>
            </div>
          </div>
          
          <div className="step-actions">
            <button className="secondary-button" onClick={onSkip}>
              Skip for now
            </button>
            <button className="primary-button" onClick={nextStep}>
              Continue
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="preferences-step">
          <div className="step-header">
            <h2>Model Preferences</h2>
            <span className="step-indicator">2 of 2 ▶</span>
          </div>
          
          <p className="step-description">
            Let's finish setting up your model preferences.
          </p>
          
          <div className="preference-item">
            <label className="preference-label">
              <span className="preference-icon">🎲</span> Top-p Sampling
            </label>
            <p className="preference-description">
              Controls diversity of word choices in generated content
            </p>
            
            <div className="slider-container">
              <span className="slider-min">0.0</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.topP}
                onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
                className="slider-input"
              />
              <span className="slider-max">1.0</span>
            </div>
            
            <div className="slider-labels">
              <span>More focused</span>
              <span>More diverse</span>
            </div>
            
            <div className="current-value">
              Current: {preferences.topP.toFixed(1)}
            </div>
            
            <div className="recommendation">
              <span className="info-icon">ℹ️</span> Recommended default: 0.9
            </div>
          </div>
          
          <div className="preference-item">
            <label className="preference-label">
              <span className="preference-icon">📄</span> Preferred Response Format
            </label>
            <p className="preference-description">
              Choose default output structure for models that support it
            </p>
            
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="responseFormat"
                  value="text"
                  checked={preferences.responseFormat === 'text'}
                  onChange={() => handleChange('responseFormat', 'text')}
                />
                Text (Standard natural language)
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="responseFormat"
                  value="json"
                  checked={preferences.responseFormat === 'json'}
                  onChange={() => handleChange('responseFormat', 'json')}
                />
                JSON (Structured data format)
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="responseFormat"
                  value="markdown"
                  checked={preferences.responseFormat === 'markdown'}
                  onChange={() => handleChange('responseFormat', 'markdown')}
                />
                Markdown (Formatted text with headings, lists, etc.)
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="responseFormat"
                  value="html"
                  checked={preferences.responseFormat === 'html'}
                  onChange={() => handleChange('responseFormat', 'html')}
                />
                HTML (Web-ready content)
              </label>
            </div>
          </div>
          
          <div className="preference-item">
            <label className="preference-label">
              <span className="preference-icon">🔑</span> Hugging Face API Token (Optional)
            </label>
            <p className="preference-description">
              Required for accessing Hugging Face models
            </p>
            
            <input
              type="password"
              value={preferences.huggingFaceToken}
              onChange={(e) => handleChange('huggingFaceToken', e.target.value)}
              placeholder="Enter your Hugging Face API token"
              className="text-input"
            />
            
            <div className="token-help">
              <span className="info-icon">ℹ️</span> Don't have a token? <a href="#" className="help-link">Learn how to get one</a>
            </div>
          </div>
          
          <div className="step-actions">
            <button className="secondary-button" onClick={prevStep}>
              Back
            </button>
            <button className="primary-button" onClick={handleComplete}>
              Finish Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelPreferencesUI;
