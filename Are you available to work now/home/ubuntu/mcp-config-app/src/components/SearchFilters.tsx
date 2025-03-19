import React, { useState, useEffect } from 'react';
import { SearchFilters as SearchFiltersType } from '../types';

interface SearchFiltersProps {
  categories: string[];
  onFilterChange: (filters: SearchFiltersType) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ categories, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [requiresToken, setRequiresToken] = useState<boolean | undefined>(undefined);

  // Update parent component when filters change
  useEffect(() => {
    const filters: SearchFiltersType = {
      query: searchQuery || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      minRating: minRating > 0 ? minRating : undefined,
      requiresToken: requiresToken
    };
    
    onFilterChange(filters);
  }, [searchQuery, selectedCategories, minRating, requiresToken, onFilterChange]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMinRating(0);
    setRequiresToken(undefined);
  };

  return (
    <div className="search-filters">
      <h2>Find MCP Servers</h2>
      
      <div className="filter-row">
        <div className="filter-group search-input">
          <label htmlFor="search-query">Search:</label>
          <input 
            id="search-query"
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or description"
          />
        </div>
        
        <div className="filter-group rating-filter">
          <label htmlFor="min-rating">Minimum Rating: {minRating.toFixed(1)}</label>
          <input 
            id="min-rating"
            type="range" 
            min="0" 
            max="5" 
            step="0.1" 
            value={minRating} 
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
          />
        </div>
        
        <div className="filter-group token-filter">
          <label>Token Requirement:</label>
          <div className="radio-options">
            <label>
              <input 
                type="radio" 
                name="requires-token" 
                checked={requiresToken === undefined}
                onChange={() => setRequiresToken(undefined)}
              />
              Any
            </label>
            <label>
              <input 
                type="radio" 
                name="requires-token" 
                checked={requiresToken === true}
                onChange={() => setRequiresToken(true)}
              />
              Requires Token
            </label>
            <label>
              <input 
                type="radio" 
                name="requires-token" 
                checked={requiresToken === false}
                onChange={() => setRequiresToken(false)}
              />
              No Token Required
            </label>
          </div>
        </div>
        
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
      
      <div className="categories-section">
        <h3>Categories:</h3>
        <div className="categories-list">
          {categories.map(category => (
            <label key={category} className="category-checkbox">
              <input 
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
