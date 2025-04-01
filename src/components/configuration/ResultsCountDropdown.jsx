import React from 'react';

/**
 * Dropdown component for selecting search results count
 */
const ResultsCountDropdown = ({ value, onChange, min = 1, max = 10 }) => {
  // Generate options from min to max
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="results-dropdown-container">
      <div className="results-input-wrapper">
        <select 
          value={value} 
          onChange={handleChange}
          className="results-dropdown"
        >
          {options.map(number => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        <label className="results-label">search results</label>
      </div>
      
      <div className="dropdown-description">
        <span>Controls how many search results Claude can access. More results provide broader information but may increase response time.</span>
      </div>

      <style jsx>{`
        .results-dropdown-container {
          margin: 15px 0;
          width: 100%;
        }

        .results-input-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .results-dropdown {
          appearance: none;
          background-color: #fff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          width: 80px;
          text-align: center;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          color: #111827;
        }

        .results-dropdown:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .results-label {
          margin-left: 12px;
          font-size: 16px;
          color: #374151;
        }

        .dropdown-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .results-dropdown {
            width: 60px;
            padding: 6px 24px 6px 12px;
            font-size: 14px;
          }
          
          .results-label {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsCountDropdown;