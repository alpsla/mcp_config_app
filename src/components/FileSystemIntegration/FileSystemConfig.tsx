import React, { useState } from 'react';
import { DirectoryBrowser } from './DirectoryBrowser';
import { Platform } from '../../utils/platform';
import { FileSystemService } from '../../services/fileSystemService';

interface FileSystemConfigProps {
  onConfigurationUpdate: (config: { enabled: boolean; directory: string }) => void;
  initialConfig?: { enabled: boolean; directory: string };
}

const FileSystemConfig: React.FC<FileSystemConfigProps> = ({
  onConfigurationUpdate,
  initialConfig = { enabled: false, directory: '' }
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(initialConfig.enabled);
  const [directory, setDirectory] = useState<string>(initialConfig.directory);
  const [showBrowser, setShowBrowser] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDesktop, setIsDesktop] = useState<boolean>(FileSystemService.isAvailable());

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onConfigurationUpdate({ enabled: newState, directory });
  };

  const handleDirectorySelected = (selectedDirectory: string) => {
    setDirectory(selectedDirectory);
    setShowBrowser(false);
    onConfigurationUpdate({ enabled: isEnabled, directory: selectedDirectory });
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
          <div className="desktop-badge">Desktop Only</div>
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
          <div className="selected-directory">
            <label>Selected Directory:</label>
            <div className="directory-path">
              {directory || "No directory selected"}
            </div>
            <button 
              onClick={() => setShowBrowser(true)}
              className="browse-button"
            >
              Browse...
            </button>
          </div>

          {showBrowser && (
            <div className="directory-browser-container">
              <DirectoryBrowser 
                onSelect={handleDirectorySelected} 
                initialPath={directory}
              />
            </div>
          )}

          {directory && (
            <div className="compatibility-info">
              <h4>Compatibility Information</h4>
              <p>
                {Platform.isWindows() && "Windows: ✓ Fully Compatible"}
                {Platform.isMac() && "macOS: ✓ Fully Compatible"}
                {Platform.isLinux() && "Linux: ✓ Fully Compatible"}
              </p>
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
