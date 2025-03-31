  // Get a list of favorite paths
  const getFavoriteName = (path: string): string => {
    if (path === homePath) return 'Home';
    return path;
  };

  // Store the home path to avoid async issues
  const [homePath, setHomePath] = useState<string>('');import React, { useState, useEffect } from 'react';
import { FileSystemService } from '../../services/fileSystemService';
import { Platform } from '../../utils/platform';

interface DirectoryBrowserProps {
  onSelect: (path: string) => void;
  initialPath?: string;
}

export const DirectoryBrowser: React.FC<DirectoryBrowserProps> = ({ 
  onSelect, 
  initialPath 
}) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [contents, setContents] = useState<{name: string, isDirectory: boolean}[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [homePath, setHomePath] = useState<string>('');

  useEffect(() => {
    // Initialize with home directory or provided path
    const initPath = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const homePath = initialPath || await FileSystemService.getHomeDirectory();
        setCurrentPath(homePath);
        setHomePath(homePath);
        await loadDirectoryContents(homePath);
        
        // Load favorites (in a real app, these would be stored in user preferences)
        const defaultFavorites = [
          await FileSystemService.getHomeDirectory(),
          Platform.isWindows() ? 'C:\\' : '/'
        ];
        setFavorites(defaultFavorites);
      } catch (err) {
        setError(`Error initializing directory browser: ${(err as Error).message}`);
        console.error('Error initializing directory browser:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initPath();
  }, [initialPath]);

  const loadDirectoryContents = async (path: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const items = await FileSystemService.listDirectory(path);
      
      // Create array of objects with name and isDirectory flag
      const contentItems = await Promise.all(items.map(async item => {
        const fullPath = path + Platform.getPathSeparator() + item;
        const isDirectory = await FileSystemService.isValidDirectory(fullPath);
        return { name: item, isDirectory };
      }));
      
      // Sort directories first, then files
      contentItems.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setContents(contentItems);
    } catch (err) {
      setError(`Error loading directory contents: ${(err as Error).message}`);
      console.error('Error loading directory contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDirectory = async (path: string) => {
    setCurrentPath(path);
    await loadDirectoryContents(path);
  };

  const handleItemClick = async (item: {name: string, isDirectory: boolean}) => {
    if (item.isDirectory) {
      const newPath = currentPath + Platform.getPathSeparator() + item.name;
      await navigateToDirectory(newPath);
    }
  };

  const navigateUp = async () => {
    const separator = Platform.getPathSeparator();
    const pathParts = currentPath.split(separator);
    
    // Don't go above root
    if (pathParts.length <= 1 && Platform.isWindows()) {
      return; // Windows drives
    }
    
    if (pathParts.length <= 2 && !Platform.isWindows()) {
      return; // Unix root
    }
    
    pathParts.pop();
    const parentPath = pathParts.join(separator);
    await navigateToDirectory(parentPath || separator);
  };

  const handleSelectDirectory = () => {
    onSelect(currentPath);
  };

  return (
    <div className="directory-browser">
      <div className="directory-browser-header">
        <button 
          className="navigate-up-button" 
          onClick={navigateUp}
          disabled={loading || 
            (Platform.isWindows() && currentPath.length <= 3) || 
            (!Platform.isWindows() && currentPath === '/')}
        >
          ↑ Up
        </button>
        
        <div className="current-path">
          <span>{currentPath}</span>
        </div>
      </div>
      
      {error && (
        <div className="directory-error">
          {error}
        </div>
      )}
      
      <div className="directory-favorites">
        <h4>Quick Access</h4>
        <ul>
          {favorites.map((path, index) => (
            <li key={index}>
              <button 
                className="favorite-item" 
                onClick={() => navigateToDirectory(path)}
              >
                {path === homePath ? 'Home' : path}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="directory-contents">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <ul className="directory-items">
            {contents.map((item, index) => (
              <li key={index} className={`directory-item ${item.isDirectory ? 'directory' : 'file'}`}>
                <button 
                  className="directory-item-button"
                  onClick={() => handleItemClick(item)}
                  disabled={!item.isDirectory}
                >
                  {item.isDirectory ? '📁 ' : '📄 '}
                  {item.name}
                </button>
              </li>
            ))}
            
            {contents.length === 0 && (
              <li className="empty-directory">
                This directory is empty
              </li>
            )}
          </ul>
        )}
      </div>
      
      <div className="directory-browser-actions">
        <button 
          className="select-button"
          onClick={handleSelectDirectory}
          disabled={loading}
        >
          Select This Directory
        </button>
      </div>
    </div>
  );
};
