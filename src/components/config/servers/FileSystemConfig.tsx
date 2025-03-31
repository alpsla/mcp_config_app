import React, { useState } from 'react';
import { FileSystemConfig as FileSystemConfigType } from '../../../types';
import './ServerConfigs.css';

interface FileSystemConfigProps {
  config: FileSystemConfigType;
  onChange: (config: FileSystemConfigType) => void;
}

export const FileSystemConfig: React.FC<FileSystemConfigProps> = ({ 
  config, 
  onChange 
}) => {
  const [newDirectory, setNewDirectory] = useState('');

  const handleToggleEnabled = () => {
    onChange({
      ...config,
      enabled: !config.enabled
    });
  };

  const handleAddDirectory = () => {
    if (newDirectory && !config.directories.includes(newDirectory)) {
      onChange({
        ...config,
        directories: [...config.directories, newDirectory]
      });
      setNewDirectory('');
    }
  };

  const handleRemoveDirectory = (dir: string) => {
    onChange({
      ...config,
      directories: config.directories.filter(d => d !== dir)
    });
  };

  const handleToggleRootPermissions = () => {
    onChange({
      ...config,
      useRootPermissions: !config.useRootPermissions
    });
  };

  return (
    <div className="server-config-container">
      <div className="server-config-header">
        <h2 className="server-config-title">File System Configuration</h2>
        <p className="server-config-description">
          Configure file system access to allow Claude to read and write files on your desktop.
        </p>
      </div>

      <div className="form-checkbox">
        <input 
          type="checkbox"
          id="file-system-enabled"
          checked={config.enabled}
          onChange={handleToggleEnabled}
        />
        <label htmlFor="file-system-enabled">Enable File System Access</label>
      </div>

      {config.enabled && (
        <>
          <div className="form-group">
            <label>Allowed Directories</label>
            
            <div className="directory-list">
              {config.directories.length === 0 ? (
                <div className="empty-directory-message">
                  No directories added. Add directories to allow file access.
                </div>
              ) : (
                <ul className="directory-items">
                  {config.directories.map((dir, index) => (
                    <li key={index} className="directory-item">
                      <span className="directory-path">{dir}</span>
                      <button 
                        className="directory-remove"
                        onClick={() => handleRemoveDirectory(dir)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="directory-input">
              <input 
                type="text"
                className="form-control"
                placeholder="Enter directory path"
                value={newDirectory}
                onChange={(e) => setNewDirectory(e.target.value)}
              />
              <button 
                className="btn btn-outline"
                onClick={handleAddDirectory}
                disabled={!newDirectory}
              >
                Add
              </button>
            </div>
          </div>

          <div className="form-checkbox">
            <input 
              type="checkbox"
              id="root-permissions"
              checked={config.useRootPermissions}
              onChange={handleToggleRootPermissions}
            />
            <label htmlFor="root-permissions">Use Root Permissions</label>
            <div className="help-text">
              Allows access to system directories that may require elevated permissions.
              <strong className="warning-text">Use with caution.</strong>
            </div>
          </div>

          <div className="platform-compatibility">
            <span className="platform-compatibility-icon">ℹ️</span>
            <span>File System access requires desktop environment</span>
          </div>
        </>
      )}
    </div>
  );
};
