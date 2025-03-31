export class Platform {
  /**
   * Check if the app is running in a desktop environment
   * @returns boolean
   */
  static isDesktopEnvironment(): boolean {
    // In a real implementation, this would detect Electron or other desktop frameworks
    // For now, this is a simple mock implementation
    return typeof window !== 'undefined' && 
      (
        // Check for Electron
        !!(window as any).process?.type || 
        !!(window as any).electron || 
        navigator.userAgent.indexOf('Electron') >= 0 ||
        // Check for other desktop environments
        navigator.userAgent.indexOf('Desktop') >= 0
      );
  }
  
  /**
   * Check if the platform is Windows
   * @returns boolean
   */
  static isWindows(): boolean {
    return typeof navigator !== 'undefined' && navigator.platform.indexOf('Win') > -1;
  }
  
  /**
   * Check if the platform is macOS
   * @returns boolean
   */
  static isMacOS(): boolean {
    return typeof navigator !== 'undefined' && 
      (navigator.platform.indexOf('Mac') > -1 || 
       navigator.userAgent.indexOf('Macintosh') > -1);
  }
  
  /**
   * Alias for isMacOS to maintain backward compatibility
   * @returns boolean 
   */
  static isMac(): boolean {
    return this.isMacOS();
  }
  
  /**
   * Check if the platform is Linux
   * @returns boolean
   */
  static isLinux(): boolean {
    return typeof navigator !== 'undefined' && navigator.platform.indexOf('Linux') > -1;
  }
  
  /**
   * Get the home directory path
   * @returns string
   */
  static getHomePath(): string {
    // This is a placeholder. In a real desktop app, you'd use node's os module
    // or other platform-specific APIs to get the home directory
    
    if (Platform.isWindows()) {
      return 'C:\\Users\\username';
    } else if (Platform.isMacOS()) {
      return '/Users/username';
    } else {
      return '/home/username';
    }
  }
  
  /**
   * Get the app data path
   * @returns string
   */
  static getAppDataPath(): string {
    // This is a placeholder. In a real desktop app, you'd use electron's app.getPath API
    // or similar platform-specific APIs
    
    if (Platform.isWindows()) {
      return 'C:\\Users\\username\\AppData\\Roaming';
    } else if (Platform.isMacOS()) {
      return '/Users/username/Library/Application Support';
    } else {
      return '/home/username/.config';
    }
  }
  
  /**
   * Get platform-specific path separator
   * @returns string
   */
  static getPathSeparator(): string {
    return Platform.isWindows() ? '\\' : '/';
  }
}