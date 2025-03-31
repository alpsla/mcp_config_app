import React, { useState, useEffect } from 'react';
import { HuggingFaceService } from '../../services/huggingFaceService';

interface Model {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isAvailable: boolean;
}

interface ModelSelectionProps {
  userTier: 'free' | 'standard' | 'premium';
  onModelSelected: (modelId: string) => void;
  selectedModelId?: string;
}

const ModelSelection: React.FC<ModelSelectionProps> = ({
  userTier,
  onModelSelected,
  selectedModelId
}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Load models when component mounts or tier changes
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        const availableModels = await HuggingFaceService.getAvailableModels(userTier);
        setModels(availableModels);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load models:', err);
        setError('Failed to load models. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadModels();
  }, [userTier]);
  
  // Extract all unique tags from models
  const allTags = Array.from(
    new Set(models.flatMap(model => model.tags))
  ).sort();
  
  // Filter models based on search term and selected tags
  const filteredModels = models.filter(model => {
    const matchesSearch = searchTerm === '' || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => model.tags.includes(tag));
      
    return matchesSearch && matchesTags;
  });
  
  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    onModelSelected(modelId);
  };
  
  if (loading) {
    return <div className="loading">Loading available models...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="model-selection">
      <div className="search-filter-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="tag-filters">
          <h4>Filter by tag:</h4>
          <div className="tags-list">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="tier-info">
        <h4>Your Tier: {userTier.charAt(0).toUpperCase() + userTier.slice(1)}</h4>
        <p>
          {userTier === 'free' && 'Access to 3 models'}
          {userTier === 'standard' && 'Access to 6 models'}
          {userTier === 'premium' && 'Access to all models'}
        </p>
        {userTier !== 'premium' && (
          <div className="upgrade-prompt">
            <a href="#upgrade">Upgrade for access to more models</a>
          </div>
        )}
      </div>
      
      <div className="models-list">
        {filteredModels.length === 0 ? (
          <div className="no-models">
            No models match your search criteria.
          </div>
        ) : (
          filteredModels.map(model => (
            <div 
              key={model.id}
              className={`model-card ${selectedModelId === model.id ? 'selected' : ''} ${!model.isAvailable ? 'unavailable' : ''}`}
              onClick={() => model.isAvailable && handleModelSelect(model.id)}
            >
              <div className="model-header">
                <h3 className="model-name">{model.name}</h3>
                {!model.isAvailable && (
                  <div className="tier-badge">
                    {userTier === 'free' ? 'Standard+' : 'Premium'}
                  </div>
                )}
              </div>
              
              <div className="model-id">{model.id}</div>
              <p className="model-description">{model.description}</p>
              
              <div className="model-tags">
                {model.tags.map(tag => (
                  <span key={tag} className="model-tag">{tag}</span>
                ))}
              </div>
              
              {!model.isAvailable && (
                <div className="upgrade-overlay">
                  <button className="upgrade-button">Upgrade to Access</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModelSelection;
