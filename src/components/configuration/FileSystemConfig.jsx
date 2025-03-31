import React, { useState, useEffect } from 'react';
import './ConfigComponents.css';
import { Platform } from '../../utils/platform';
import { FileSystemService } from '../../services/fileSystemService';

const FileSystemConfig = ({ config = {}, updateConfig }) => {
  // Initialize state with values from props or defaults
  const [directories, setDirectories] = useState(config.directories || []);
  const [currentDirectory, setCurrentDirectory] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);

  // When component mounts, check if running in desktop environment
  useEffect(() => {
    setIsDesktop(FileSystemService.isAvailable());
  }, []);
  
  // Update parent component when directories change
  useEffect(() => {
    updateConfig({
      directories
    });
  }, [directories, updateConfig]);

  // Handle adding a new directory
  const handleAddDirectory = () => {
    if (!currentDirectory || directories.includes(currentDirectory)) return;
    
    setDirectories([...directories, currentDirectory]);
    setCurrentDirectory('');
  };
  
  // Handle removing a directory
  const handleRemoveDirectory = (dirToRemove) => {
    setDirectories(directories.filter(dir => dir !== dirToRemove));
  };
  
  // Handle directory selection (mock functionality)
  const handleBrowseDirectory = async () => {
    try {
      // In a real implementation, this would open a directory picker dialog
      // For now, we'll just simulate it with a mock directory
      if (isDesktop) {
        const homeDir = await FileSystemService.getHomeDirectory();
        const mockSelectedDir = `${homeDir}${Platform.getPathSeparator()}Documents${Platform.getPathSeparator()}sample-folder-${Math.floor(Math.random() * 1000)}`;
        setCurrentDirectory(mockSelectedDir);
      }
    } catch (error) {
      console.error('Error browsing directory:', error);
    }
  };

  return (
    <div className="config-component">
      <h2 className="config-component-title">File System Access Configuration</h2>
      
      {!isDesktop && (
        <div className="config-desktop-only-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div className="config-desktop-warning-content">
            <h3>Desktop Application Required</h3>
            <p>File System Access is only available when using Claude Desktop application. The configuration can still be set up, but it will only work when exported to Claude Desktop.</p>
          </div>
        </div>
      )}
      
      <p className="config-component-description">
        Configure which directories on your computer Claude can access. Claude will only be able to read files from these directories.
      </p>
      
      <div className="config-form">
        <div className="config-form-group">
          <label className="config-form-label">
            Add Directory
          </label>
          
          <div className="config-directory-input">
            <div className="config-directory-input-group">
              <input 
                type="text" 
                className="config-form-input" 
                value={currentDirectory}
                onChange={(e) => setCurrentDirectory(e.target.value)}
                placeholder="/path/to/directory"
              />
              <button 
                type="button" 
                className="config-directory-browse-btn"
                onClick={handleBrowseDirectory}
                disabled={!isDesktop}
              >
                Browse
              </button>
            </div>
            <button 
              type="button" 
              className="config-directory-add-btn"
              disabled={!currentDirectory}
              onClick={handleAddDirectory}
            >
              Add Directory
            </button>
          </div>
          
          <p className="config-form-helper">
            Enter the full path to a directory or use the Browse button to select it.
          </p>
        </div>
        
        {directories.length > 0 && (
          <div className="config-selected-directories">
            <label className="config-form-label">
              Selected Directories
            </label>
            
            {directories.map((dir, index) => (
              <div key={index} className="config-selected-directory-item">
                <div className="config-selected-directory-path">
                  {dir}
                </div>
                <button 
                  type="button" 
                  className="config-remove-directory"
                  onClick={() => handleRemoveDirectory(dir)}
                  aria-label="Remove directory"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="config-security-notice">
          <div className="config-security-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="config-security-content">
            <h4>Security Information</h4>
            <p>
              Claude will only be able to access files in the directories you specify. Access is read-only, which means Claude can read files but cannot modify, delete, or create files.
            </p>
            <p>
              For your security, avoid adding directories containing sensitive information, such as financial records or private documents.
            </p>
          </div>
        </div>
      </div>
      
      <div className="config-platform-compatibility">
        <h4>Platform Compatibility</h4>
        <div className="config-platform-icons">
          <div className={`config-platform-icon ${Platform.isWindows() ? 'compatible' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>Windows</span>
          </div>
          <div className={`config-platform-icon ${Platform.isMacOS() ? 'compatible' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>macOS</span>
          </div>
          <div className={`config-platform-icon ${Platform.isLinux() ? 'compatible' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
              <line x1="10" y1="3" x2="8" y2="21"></line>
              <line x1="16" y1="3" x2="14" y2="21"></line>
            </svg>
            <span>Linux</span>
          </div>
        </div>
      </div>
      
      <div className="config-component-footer">
        <div className="config-status">
          {directories.length > 0 ? (
            <>
              <div className="config-status-icon config-status-success"></div>
              <span>File System Access is properly configured</span>
            </>
          ) : (
            <>
              <div className="config-status-icon config-status-warning"></div>
              <span>No directories selected. Claude will not have file access.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSystemConfig;