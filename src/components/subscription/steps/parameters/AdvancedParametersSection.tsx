import React, { useState, useEffect } from 'react';
import './AdvancedParametersSection.css';
import UnifiedSlider from './UnifiedSlider';

interface AdvancedParametersSectionProps {
  // Original parameters
  topP: number;
  topK: number;
  onTopPChange: (value: number) => void;
  onTopKChange: (value: number) => void;
  
  // New parameters with default values
  repetitionPenalty?: number;
  onRepetitionPenaltyChange?: (value: number) => void;
  
  encoderRepetitionPenalty?: number;
  onEncoderRepetitionPenaltyChange?: (value: number) => void;
  
  noRepeatNgramSize?: number;
  onNoRepeatNgramSizeChange?: (value: number) => void;
  
  typicalP?: number;
  onTypicalPChange?: (value: number) => void;
  
  numBeams?: number;
  onNumBeamsChange?: (value: number) => void;
  
  disabled?: boolean;
  initialExpanded?: boolean;
}

/**
 * Enhanced Advanced Parameters Section with more options and better organization
 */
const AdvancedParametersSection: React.FC<AdvancedParametersSectionProps> = ({
  // Original parameters
  topP,
  topK,
  onTopPChange,
  onTopKChange,
  
  // New parameters with defaults
  repetitionPenalty = 1.1,
  onRepetitionPenaltyChange = () => {},
  
  encoderRepetitionPenalty = 1.0,
  onEncoderRepetitionPenaltyChange = () => {},
  
  noRepeatNgramSize = 0,
  onNoRepeatNgramSizeChange = () => {},
  
  typicalP = 1.0,
  onTypicalPChange = () => {},
  
  numBeams = 1,
  onNumBeamsChange = () => {},
  
  disabled = false,
  initialExpanded = false
}) => {
  // Initial expanded state comes from props, with default fallback
  // NOTE: useEffect is needed to respond to prop changes after initial render
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  // Update expanded state if prop changes after initial render
  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);
  const [activeCategory, setActiveCategory] = useState<string | null>("sampling");
  
  // Calculate percentages for track display
  const topPPercentage = ((topP - 0.1) / 0.9) * 100; // Range is 0.1 to 1
  const topKPercentage = ((topK - 1) / 99) * 100;    // Range is 1 to 100
  const repetitionPenaltyPercentage = ((repetitionPenalty - 1) / 1) * 100; // Range is 1 to 2
  const encoderRepPenaltyPercentage = ((encoderRepetitionPenalty - 0.8) / 0.7) * 100; // Range is 0.8 to 1.5
  const typicalPPercentage = typicalP * 100; // Range is 0 to 1
  
  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Toggle category
  const toggleCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };
  
  return (
    <div className={`advanced-parameters ${disabled ? 'disabled' : ''}`}>
      <div className="advanced-header" onClick={toggleExpand}>
        <h3 className="advanced-title">
          <span className="advanced-icon">🔧</span>
          Advanced Parameters
        </h3>
        <button 
          type="button" 
          className="expand-button"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse advanced parameters" : "Expand advanced parameters"}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="advanced-content">
          <div className="advanced-description">
            These parameters give you more detailed control over how AI models generate text. 
            Most users won't need to adjust these, but they can be helpful for specific use cases.
          </div>
          
          {/* Category buttons */}
          <div className="parameter-categories">
            <button 
              className={`category-button ${activeCategory === 'sampling' ? 'active' : ''}`}
              onClick={() => toggleCategory('sampling')}
            >
              Sampling Parameters
            </button>
            <button 
              className={`category-button ${activeCategory === 'repetition' ? 'active' : ''}`}
              onClick={() => toggleCategory('repetition')}
            >
              Repetition Control
            </button>
            <button 
              className={`category-button ${activeCategory === 'beam' ? 'active' : ''}`}
              onClick={() => toggleCategory('beam')}
            >
              Beam Search
            </button>
          </div>
          
          {/* Sampling Parameters Category */}
          {activeCategory === 'sampling' && (
            <div className="parameter-category-content">
              <div className="advanced-section">
                <div className="parameter-row">
                  <div className="parameter-info">
                    <label htmlFor="top-p-slider" className="parameter-name">
                      Top P <span className="parameter-value">{topP.toFixed(2)}</span>
                    </label>
                  </div>
                  
                  <div className="parameter-slider-container">
                    <UnifiedSlider
                      value={topP}
                      onChange={onTopPChange}
                      min={0.1}
                      max={1}
                      step={0.05}
                      disabled={disabled}
                      ariaLabel="Top P slider"
                    />
                  </div>
                </div>
                
                <div className="parameter-description">
                  <strong>Top P (Nucleus Sampling)</strong>: Controls how varied the AI's word choices are. 
                  Lower values (like 0.5) make responses more focused and predictable. 
                  Higher values (like 0.9) allow for more varied, creative language choices.
                </div>
                
                <div className="parameter-example-box">
                  <div className="example-title">Examples:</div>
                  <ul className="example-list">
                    <li><strong>0.5</strong>: More predictable, factual language. Good for precise tasks.</li>
                    <li><strong>0.9</strong>: More diverse vocabulary. Good for creative writing.</li>
                  </ul>
                </div>
              </div>
              
              <div className="advanced-section">
                <div className="parameter-row">
                  <div className="parameter-info">
                    <label htmlFor="top-k-slider" className="parameter-name">
                      Top K <span className="parameter-value">{Math.round(topK)}</span>
                    </label>
                  </div>
                  
                  <div className="parameter-slider-container">
                    <UnifiedSlider
                      value={topK}
                      onChange={onTopKChange}
                      min={1}
                      max={100}
                      step={1}
                      disabled={disabled}
                      ariaLabel="Top K slider"
                    />
                  </div>
                </div>
                
                <div className="parameter-description">
                  <strong>Top K</strong>: Limits how many word choices the AI considers at each step.
                  Lower values (like 10) focus on only the most likely words.
                  Higher values (like 50) consider more options and can be more creative.
                </div>
                
                <div className="parameter-example-box">
                  <div className="example-title">Examples:</div>
                  <ul className="example-list">
                    <li><strong>10</strong>: More focused, uses common words. Good for technical content.</li>
                    <li><strong>50</strong>: More varied vocabulary. Good for creative or exploratory content.</li>
                  </ul>
                </div>
              </div>
              
              <div className="advanced-section">
                <div className="parameter-row">
                  <div className="parameter-info">
                    <label htmlFor="typical-p-slider" className="parameter-name">
                      Typical P <span className="parameter-value">{typicalP.toFixed(2)}</span>
                    </label>
                  </div>
                  
                  <div className="parameter-slider-container">
                    <UnifiedSlider
                      value={typicalP}
                      onChange={onTypicalPChange}
                      min={0}
                      max={1}
                      step={0.01}
                      disabled={disabled}
                      ariaLabel="Typical P slider"
                    />
                  </div>
                </div>
                
                <div className="parameter-description">
                  <strong>Typical P</strong>: Controls selection of more or less typical tokens at each step.
                  Higher values lead to more predictable, common outputs based on the model's training data.
                  Lower values allow for more unusual or unexpected outputs.
                </div>
                
                <div className="parameter-example-box">
                  <div className="example-title">Examples:</div>
                  <ul className="example-list">
                    <li><strong>0.2</strong>: More creative, unusual outputs. Good for brainstorming.</li>
                    <li><strong>0.9</strong>: More typical, predictable outputs. Good for standard tasks.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Repetition Control Category */}
          {activeCategory === 'repetition' && (
            <div className="parameter-category-content">
              <div className="advanced-section">
                <div className="parameter-row">
                  <div className="parameter-info">
                    <label htmlFor="repetition-penalty-slider" className="parameter-name">
                      Repetition Penalty <span className="parameter-value">{repetitionPenalty.toFixed(2)}</span>
                    </label>
                  </div>
                  
                  <div className="parameter-slider-container">
                    <UnifiedSlider
                      value={repetitionPenalty}
                      onChange={onRepetitionPenaltyChange}
                      min={1.0}
                      max={2.0}
                      step={0.05}
                      disabled={disabled}
                      ariaLabel="Repetition Penalty slider"
                    />
                  </div>
                </div>
                
                <div className="parameter-description">
                  <strong>Repetition Penalty</strong>: Penalizes repetition of the same words or phrases.
                  Higher values (e.g., 1.5) strongly prevent repetition, while 1.0 applies no penalty.
                  Useful for reducing the likelihood of the model getting stuck in repetitive patterns.
                </div>
                
                <div className="parameter-example-box">
                  <div className="example-title">Examples:</div>
                  <ul className="example-list">
                    <li><strong>1.0</strong>: No penalty applied, natural model behavior.</li>
                    <li><strong>1.2</strong>: Moderate prevention of repetition, good balance.</li>
                    <li><strong>1.5+</strong>: Strong prevention, good for avoiding repetitive loops.</li>
                  </ul>
                </div>
              </div>
              
              <div className="advanced-section">
                <div className="parameter-row">
                  <div className="parameter-info">
                    <label htmlFor="encoder-rep-penalty-slider" className="parameter-name">
                      Encoder Rep. Penalty <span className="parameter-value">{encoderRepetitionPenalty.toFixed(2)}</span>
                    </label>
                  </div>
                  
                  <div className="parameter-slider-container">
                    <UnifiedSlider
                      value={encoderRepetitionPenalty}
                      onChange={onEncoderRepetitionPenaltyChange}
                      min={0.8}
                      max={1.5}
                      step={0.05}
                      disabled={disabled}
                      ariaLabel="Encoder Repetition Penalty slider"
                    />
                  </div>
                </div>
                
                <div className="parameter-description">
                  <strong>Encoder Repetition Penalty</strong>: Similar to repetition penalty, but applied only to the input text.
                  Prevents the model from copying directly from the input prompt. Values above 1.0 increase the penalty.
                </div>
                
                <div className="parameter-example-box">
                  <div className="example-title">Examples:</div>
                  <ul className="example-list">
                    <li><strong>1.0</strong>: Standard behavior, no special penalty.</li>
                    <li><strong>1.2</strong>: Moderate prevention of copying from input.</li>
                  </ul>
                </div>
              </div>
              
              <div className="advanced-section">
                <div className="parameter-row">
                  <div className="parameter-info">
                    <label htmlFor="no-repeat-ngram-slider" className="parameter-name">
                      No Repeat NGram <span className="parameter-value">{noRepeatNgramSize}</span>
                    </label>
                  </div>
                  
                  <div className="parameter-slider-container">
                    <UnifiedSlider
                      value={noRepeatNgramSize}
                      onChange={onNoRepeatNgramSizeChange}
                      min={0}
                      max={10}
                      step={1}
                      disabled={disabled}
                      ariaLabel="No Repeat NGram Size slider"
                    />
                  </div>
                </div>
                
                <div className="parameter-description">
                  <strong>No Repeat NGram Size</strong>: Prevents any sequence of N tokens from appearing twice in the generated text.
                  A value of 0 disables this feature. Higher values prevent longer phrases from repeating.
                </div>
                
                <div className="parameter-example-box">
                  <div className="example-title">Examples:</div>
                  <ul className="example-list">
                    <li><strong>0</strong>: No ngram prevention (default).</li>
                    <li><strong>3</strong>: Prevents any 3-word sequence from repeating.</li>
                    <li><strong>5</strong>: Prevents any 5-word sequence from repeating (more strict).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Beam Search Category */}
          {activeCategory === 'beam' && (
            <div className="parameter-category-content">
              <div className="advanced-section">
                <div className="parameter-row">
                  <div className="parameter-info">
                    <label htmlFor="num-beams-slider" className="parameter-name">
                      Number of Beams <span className="parameter-value">{numBeams}</span>
                    </label>
                  </div>
                  
                  <div className="parameter-slider-container">
                    {/* Track background */}
                    <div className="slider-track">
                      <div 
                        className="slider-track-fill"
                        style={{ width: `${((numBeams - 1) / 9) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Actual slider */}
                    <input
                      id="num-beams-slider"
                      type="range"
                      className="advanced-slider"
                      min={1}
                      max={10}
                      step={1}
                      value={numBeams}
                      onChange={(e) => onNumBeamsChange(parseInt(e.target.value))}
                      disabled={disabled}
                      aria-valuemin={1}
                      aria-valuemax={10}
                      aria-valuenow={numBeams}
                    />
                  </div>
                </div>
                
                <div className="parameter-description">
                  <strong>Number of Beams</strong>: Controls beam search, which explores multiple possible text continuations in parallel.
                  Higher values explore more possibilities but increase computation time. A value of 1 disables beam search.
                </div>
                
                <div className="parameter-example-box">
                  <div className="example-title">Examples:</div>
                  <ul className="example-list">
                    <li><strong>1</strong>: No beam search, uses greedy or sampling methods instead.</li>
                    <li><strong>4</strong>: Standard beam search, good balance of quality vs. speed.</li>
                    <li><strong>8</strong>: Wide beam search, can produce higher quality at the cost of speed.</li>
                  </ul>
                </div>
              </div>
              
              <div className="parameter-example-box beam-search-explanation">
                <div className="example-title">What is Beam Search?</div>
                <p>
                  Beam search is a technique to find the most likely sequence of words by exploring multiple paths simultaneously.
                  Instead of picking just the single most likely next word at each step, it maintains several promising sequences
                  (beams) and eventually selects the one with the highest overall probability.
                </p>
                <p>
                  <strong>When to use:</strong> Beam search works well for tasks like translation, summarization, or any
                  scenario where you need coherent, high-quality text and can sacrifice some generation speed.
                </p>
              </div>
            </div>
          )}
          
          <div className="advanced-hint">
            <div className="hint-icon">💡</div>
            <div className="hint-text">
              <strong>Tip:</strong> These advanced parameters offer precise control, but the impact varies by model.
              Start with the recommended values and adjust gradually while observing the results.
              Different parameter combinations work better for different use cases.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedParametersSection;