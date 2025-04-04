import React, { useState, useEffect } from 'react';
import { DirectoryBrowser } from './DirectoryBrowser';
import { Platform } from '../../utils/platform';
import { FileSystemService } from '../../services/fileSystemService';

interface FileSystemConfigProps {
  onConfigurationUpdate: (config: { enabled: boolean; directory: string; directories?: string[] }) => void;
  initialConfig?: { enabled: boolean; directory: string; directories?: string[] };
}

const FileSystemConfig: React.FC<FileSystemConfigProps> = ({
  onConfigurationUpdate,
  initialConfig = { enabled: false, directory: '', directories: [] }
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(initialConfig.enabled);
  const [directory, setDirectory] = useState<string>(initialConfig.directory);
  const [directories, setDirectories] = useState<string[]>(initialConfig.directories || []);
  const [showBrowser, setShowBrowser] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(FileSystemService.isAvailable());
  
  // Initialize platform information on component mount
  useEffect(() => {
    // Always enable add directory button in desktop environment
    setIsDesktop(FileSystemService.isAvailable() || Platform.isDesktopEnvironment());
  }, []);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onConfigurationUpdate({ 
      enabled: newState, 
      directory,
      directories: directories.length > 0 ? directories : directory ? [directory] : []
    });
  };

  const handleDirectorySelected = (selectedDirectory: string) => {
    // Add the directory if it's not already in the list
    if (!directories.includes(selectedDirectory)) {
      const newDirectories = [...directories, selectedDirectory];
      setDirectories(newDirectories);
      setDirectory(selectedDirectory); // Also update the current directory for legacy support
      onConfigurationUpdate({ 
        enabled: isEnabled, 
        directory: selectedDirectory,
        directories: newDirectories
      });
    }
    setShowBrowser(false);
  };
  
  const handleRemoveDirectory = (dirToRemove: string) => {
    const newDirectories = directories.filter(dir => dir !== dirToRemove);
    setDirectories(newDirectories);
    
    // If we've removed the current directory, update it to the first in the list or empty
    if (directory === dirToRemove) {
      const newCurrentDir = newDirectories.length > 0 ? newDirectories[0] : '';
      setDirectory(newCurrentDir);
    }
    
    onConfigurationUpdate({
      enabled: isEnabled,
      directory: directories.length > 0 ? directories[0] : '',
      directories: newDirectories
    });
  };

  return (
    <div className="file-system-config">
      <div className="config-header">
        <h2>File System Access</h2>
        {isDesktop ? (
          <div className="toggle-container">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={handleToggle}
              />
              <span className="toggle-slider"></span>
            </label>
            <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        ) : (
          <div className="desktop-notice-indicator">Desktop Application Required</div>
        )}
      </div>

      {!isDesktop && (
        <div className="desktop-notice">
          <p>File System access is only available in the Claude Desktop application.</p>
          <p>Please download and install Claude Desktop to use this feature.</p>
        </div>
      )}

      {isDesktop && isEnabled && (
        <div className="directory-selection">
          <div className="directory-header">
            <h3>Selected Directories</h3>
            <button 
              onClick={() => setShowBrowser(true)}
              className="add-directory-button"
              disabled={false}
            >
              Add Directory
            </button>
          </div>
          
          {directories.length === 0 ? (
            <div className="no-directories">
              No directories selected. Click "Add Directory" to select a directory.
            </div>
          ) : (
            <div className="directory-list">
              {directories.map((dir, index) => (
                <div key={index} className="directory-item">
                  <div className="directory-path">{dir}</div>
                  <button 
                    onClick={() => handleRemoveDirectory(dir)}
                    className="remove-directory-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {showBrowser && (
            <div className="directory-browser-container">
              <DirectoryBrowser 
                onSelect={handleDirectorySelected} 
                initialPath={directory}
              />
            </div>
          )}

          {directory && (
            <div className="platform-compatibility">
              <h4>Platform Compatibility</h4>
              <div className="platform-indicators">
                <div className="platform-indicator">
                  <span className="platform-icon windows">🖥️</span>
                  <span className="platform-name">Windows</span>
                  <span className="compatibility-status">✓</span>
                </div>
                <div className="platform-indicator">
                  <span className="platform-icon macos">🖥️</span>
                  <span className="platform-name">macOS</span>
                  <span className="compatibility-status">✓</span>
                </div>
                <div className="platform-indicator">
                  <span className="platform-icon linux">🖥️</span>
                  <span className="platform-name">Linux</span>
                  <span className="compatibility-status">✓</span>
                </div>
              </div>
            </div>
          )}

          <div className="security-explanation">
            <h4>Security Information</h4>
            <p>When File System access is enabled, Claude will be able to:</p>
            <ul>
              <li>Read files in the selected directory and its subdirectories</li>
              <li>Use the content of these files to enhance responses</li>
              <li>Reference information from these files when answering questions</li>
            </ul>
            <p>Claude will <strong>not</strong> be able to:</p>
            <ul>
              <li>Modify or delete any files</li>
              <li>Access files outside the selected directory</li>
              <li>Execute any files or programs on your computer</li>
            </ul>
            <p className="security-tip">
              <strong>Security Tip:</strong> Create a dedicated directory for files you want to share with Claude to minimize exposure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSystemConfig;