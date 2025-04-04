import React from 'react';
import './ModelSelection.css';

interface ModelSelectionProps {
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
  userTier: 'none' | 'basic' | 'complete';
}

interface ModelCategory {
  title: string;
  models: Model[];
}

interface Model {
  id: string;
  name: string;
  description: string;
  tier: string;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({
  selectedModels,
  onModelToggle,
  userTier
}) => {
  // Organized models by category
  const modelCategories: ModelCategory[] = [
    {
      title: "Language Models",
      models: [
        { 
          id: 'gpt-neo-2-7b', 
          name: 'EleutherAI/gpt-neo-2.7B', 
          description: 'Versatile text generation for creative writing and document drafting',
          tier: 'both'
        },
        { 
          id: 'qwen2-72b', 
          name: 'Qwen2-72B-Instruct', 
          description: 'Large language model complementary to Claude',
          tier: 'complete'
        }
      ]
    },
    {
      title: "Audio Processing",
      models: [
        { 
          id: 'whisper-v3', 
          name: 'Whisper-large-v3-turbo', 
          description: 'Powerful audio transcription with superior accuracy',
          tier: 'both'
        }
      ]
    },
    {
      title: "Image Generation & Editing",
      models: [
        { 
          id: 'stable-diffusion-2', 
          name: 'stabilityai/stable-diffusion-2', 
          description: 'State-of-the-art image generation with high quality outputs',
          tier: 'both'
        },
        { 
          id: 'instruct-pix2pix', 
          name: 'CompVis/instruct-pix2pix', 
          description: 'Edit images based on text instructions',
          tier: 'complete'
        }
      ]
    },
    {
      title: "Search & Understanding",
      models: [
        { 
          id: 'all-minilm-l6-v2', 
          name: 'sentence-transformers/all-MiniLM-L6-v2', 
          description: 'Lightweight embedding model for semantic search and clustering',
          tier: 'complete'
        },
        { 
          id: 'roberta-squad2', 
          name: 'deepset/roberta-base-squad2', 
          description: 'Question-answering model for precise information extraction',
          tier: 'complete'
        },
        { 
          id: 'layoutlmv3-base', 
          name: 'microsoft/layoutlmv3-base', 
          description: 'Extract structured data from scanned documents and forms',
          tier: 'complete'
        }
      ]
    },
    {
      title: "Content Processing",
      models: [
        { 
          id: 'bart-large-cnn', 
          name: 'facebook/bart-large-cnn', 
          description: 'Specialized model for condensing long documents into concise summaries',
          tier: 'complete'
        },
        { 
          id: 'text-to-video-ms', 
          name: 'ali-vilab/text-to-video-ms-1.7b', 
          description: 'Generate videos from text descriptions with control over motion',
          tier: 'complete' 
        }
      ]
    }
  ];

  // Maximum allowed models by tier
  const getModelLimit = () => {
    switch(userTier) {
      case 'basic': return 3;
      case 'complete': return 10;
      default: return 0;
    }
  };

  const modelLimit = getModelLimit();
  const hasReachedLimit = selectedModels.length >= modelLimit && modelLimit > 0;

  return (
    <div className="model-selection">
      <div className="selection-header">
        <h3>Available Models</h3>
        <div className="model-count">
          {userTier !== 'none' && (
            <span>Selected: {selectedModels.length}/{modelLimit}</span>
          )}
        </div>
      </div>

      {modelCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="model-category-section">
          <h4 className="category-title">{category.title}</h4>
          <div className="model-grid">
            {category.models.map(model => {
              const isSelected = selectedModels.includes(model.id);
              const isAvailable = userTier === 'complete' || model.tier === 'both';
              const isDisabled = !isAvailable || (hasReachedLimit && !isSelected);
              
              return (
                <div 
                  key={model.id} 
                  className={`model-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => !isDisabled && onModelToggle(model.id)}
                >
                  <div className="model-card-header">
                    <h5 className="model-name">{model.name}</h5>
                    {model.tier === 'both' ? (
                      <span className="tier-badge basic">Basic+</span>
                    ) : (
                      <span className="tier-badge complete">Complete</span>
                    )}
                  </div>
                  <p className="model-description">{model.description}</p>
                  {/* Removed the checkbox and toggle button, rely on card coloring instead */}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {userTier === 'basic' && selectedModels.length >= modelLimit && (
        <div className="tier-upgrade-notice">
          <p>You've reached your model selection limit. <a href="#/pricing">Upgrade to Complete</a> to access all 10 models.</p>
        </div>
      )}
    </div>
  );
};

export default ModelSelection;