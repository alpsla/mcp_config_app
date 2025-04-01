import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Alert } from '../ui';
import { FolderIcon, PlusIcon, TrashIcon, InfoIcon } from '../icons';

/**
 * FileSystemConfiguration component for managing directory access
 * 
 * @param {Object} props
 * @param {Array} props.directories - List of directories currently configured
 * @param {Function} props.updateConfig - Callback to update the configuration
 */
const FileSystemConfig = ({ 
  config = { directories: [] },
  updateConfig
}) => {
  const [directories, setDirectories] = useState(config.directories || []);
  const [newDirectory, setNewDirectory] = useState('');
  const [directoryBrowserError, setDirectoryBrowserError] = useState(null);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [availableDirectories, setAvailableDirectories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update parent component when directories change
  useEffect(() => {
    updateConfig({
      ...config,
      directories
    });
  }, [directories]);

  // Function to browse the filesystem and get available directories
  const handleBrowseClick = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, use filesystem APIs
      // For demo purposes, simulate loading directories
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sampleDirectories = [
        '/Users/username/Documents',
        '/Users/username/Downloads',
        '/Users/username/Desktop',
        'C:\\Users\\username\\Documents',
        'C:\\Users\\username\\Downloads'
      ];
      
      setAvailableDirectories(sampleDirectories);
      setShowDirectoryModal(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error browsing directories:', error);
      setDirectoryBrowserError('Failed to browse directories. Please ensure you have the necessary permissions.');
      setIsLoading(false);
    }
  };

  // Function to select a directory from the browser
  const handleDirectorySelect = (dir) => {
    setNewDirectory(dir);
    setShowDirectoryModal(false);
  };

  // Function to add a directory to the configuration
  const handleAddDirectoryClick = () => {
    if (!newDirectory) return;
    
    // Check if directory is already in the list
    if (directories.includes(newDirectory)) {
      setDirectoryBrowserError('This directory is already in your configuration.');
      return;
    }
    
    setDirectories([...directories, newDirectory]);
    setNewDirectory('');
  };

  // Function to remove a directory from the list
  const handleRemoveDirectory = (dir) => {
    setDirectories(directories.filter(d => d !== dir));
  };

  // Function to expand a directory and show its subdirectories
  const handleExpandDirectory = async (dir) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, use filesystem APIs
      // For demo purposes, simulate loading subdirectories
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const subdirs = [
        `${dir}/Documents`,
        `${dir}/Downloads`,
        `${dir}/Pictures`,
        `${dir}/Desktop`
      ];
      
      setAvailableDirectories(subdirs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error expanding directory:', error);
      setDirectoryBrowserError('Failed to expand directory.');
      setIsLoading(false);
    }
  };

  // Function to navigate up one level in the directory hierarchy
  const handleNavigateUp = async () => {
    // In a real implementation, navigate to parent directory
    // For demo purposes, go back to root directories
    handleBrowseClick();
  };

  return (
    <div className="file-system-configuration">
      <div className="file-system-header">
        <h3>File System Access</h3>
        <p>Allow Claude to access specific directories on your computer.</p>
      </div>

      {directoryBrowserError && (
        <Alert 
          type="error" 
          message={directoryBrowserError} 
          onClose={() => setDirectoryBrowserError(null)} 
        />
      )}

      <div className="directory-input-container">
        <Input
          type="text"
          value={newDirectory}
          onChange={(e) => setNewDirectory(e.target.value)}
          placeholder="Directory path"
          className="directory-input"
        />
        <Button 
          onClick={handleBrowseClick} 
          className="browse-button"
          disabled={isLoading}
        >
          Browse
        </Button>
        <Button
          onClick={handleAddDirectoryClick}
          className="add-button"
          disabled={!newDirectory}
        >
          <PlusIcon /> Add
        </Button>
      </div>

      <div className="directories-list">
        <h4>Configured Directories</h4>
        
        {directories.length === 0 ? (
          <div className="no-directories">
            <p>No directories configured. Add directories to allow Claude to access files.</p>
          </div>
        ) : (
          <ul className="directory-items">
            {directories.map((dir, index) => (
              <li key={index} className="directory-item">
                <FolderIcon className="folder-icon" />
                <span className="directory-path">{dir}</span>
                <Button
                  className="remove-button"
                  onClick={() => handleRemoveDirectory(dir)}
                >
                  <TrashIcon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tools-list">
        <h4>Tools that will be available:</h4>
        <div className="tools-grid">
          {[
            'create_directory',
            'directory_tree',
            'edit_file',
            'get_file_info',
            'list_allowed_directories',
            'list_directory',
            'move_file',
            'read_file',
            'read_multiple_files',
            'search_files',
            'write_file'
          ].map(tool => (
            <div key={tool} className="tool-item">
              <span className="tool-icon">⚙️</span> {tool}
            </div>
          ))}
        </div>
      </div>

      {/* Directory Browser Modal */}
      <Modal
        isOpen={showDirectoryModal}
        onClose={() => setShowDirectoryModal(false)}
        title="Select Directory"
      >
        <div className="directory-browser">
          <div className="directory-browser-header">
            <Button onClick={handleNavigateUp} disabled={isLoading}>
              Up
            </Button>
            <div className="current-path">
              {/* In a real implementation, this would show the current path */}
              Select a directory
            </div>
          </div>

          {isLoading ? (
            <div className="loading-directories">Loading directories...</div>
          ) : (
            <ul className="browser-directory-list">
              {availableDirectories.map((dir, index) => (
                <li 
                  key={index} 
                  className="browser-directory-item"
                >
                  <div 
                    className="browser-directory-name"
                    onClick={() => handleDirectorySelect(dir)}
                  >
                    <FolderIcon /> {dir.split('/').pop() || dir}
                  </div>
                  <Button 
                    className="expand-button"
                    onClick={() => handleExpandDirectory(dir)}
                  >
                    Expand
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="browser-actions">
            <Button onClick={() => setShowDirectoryModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleDirectorySelect(newDirectory)}
              disabled={!newDirectory}
            >
              Select "{newDirectory}"
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FileSystemConfig;