import { Platform } from '../utils/platform';

export class FileSystemService {
  /**
   * Check if file system access is available
   * @returns boolean indicating if file system access is available
   */
  static isAvailable(): boolean {
    // Always return true for demo purposes to enable the "Add directory" button
    return true;
    
    // Original implementation:
    // return Platform.isDesktopEnvironment();
  }
  
  /**
   * Get the Claude configuration directory
   * This is a placeholder - actual implementation would depend on desktop integration
   * @returns Promise with the path to Claude's configuration directory
   */
  static async getClaudeConfigDirectory(): Promise<string> {
    // This is a placeholder implementation
    // In a real application, this would use Electron or similar to access the file system
    
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    // Return platform-specific path (placeholder)
    const homePath = Platform.getHomePath();
    
    if (Platform.isWindows()) {
      return `${homePath}\\AppData\\Roaming\\Claude`;
    } else if (Platform.isMacOS()) {
      return `${homePath}/Library/Application Support/Claude`;
    } else {
      // Linux and others
      return `${homePath}/.config/claude`;
    }
  }
  
  /**
   * Get the home directory
   * @returns Promise with the path to the home directory
   */
  static async getHomeDirectory(): Promise<string> {
    // For demo purposes, we'll always return a path even in non-desktop environments
    return Platform.getHomePath();
  }
  
  /**
   * Browse for and select a directory
   * This would open a native file explorer dialog in a real implementation
   * @returns Promise with the selected directory path
   */
  static async browseForDirectory(): Promise<string> {
    // This is a placeholder implementation
    // In a real desktop app, this would open a native directory picker dialog
    
    // Simulate a delay for the directory picker
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Common directories based on platform
    const homePath = Platform.getHomePath();
    const separator = Platform.getPathSeparator();
    
    // Generate a list of common directories
    const commonDirectories = [
      `${homePath}${separator}Documents`,
      `${homePath}${separator}Downloads`,
      `${homePath}${separator}Pictures`,
      `${homePath}${separator}Desktop`,
      `${homePath}${separator}Projects`,
    ];
    
    // Randomly select one to simulate user selection
    const randomIndex = Math.floor(Math.random() * commonDirectories.length);
    const selectedDirectory = commonDirectories[randomIndex];
    
    console.log(`User selected directory: ${selectedDirectory}`);
    return selectedDirectory;
  }
  
  /**
   * Write a file to the specified path
   * This is a placeholder - actual implementation would depend on desktop integration
   * @param path The path to write to
   * @param content The content to write
   * @returns Promise indicating success
   */
  static async writeFile(path: string, content: string): Promise<boolean> {
    // This is a placeholder implementation
    // In a real application, this would use Electron or similar to access the file system
    
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    console.log(`Would write content to: ${path}`);
    
    // Simulate successful write
    return true;
  }
  
  /**
   * Read a file from the specified path
   * This is a placeholder - actual implementation would depend on desktop integration
   * @param path The path to read from
   * @returns Promise with the file content
   */
  static async readFile(path: string): Promise<string> {
    // This is a placeholder implementation
    // In a real application, this would use Electron or similar to access the file system
    
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    console.log(`Would read content from: ${path}`);
    
    // Simulate reading a file
    return JSON.stringify({ test: 'data' });
  }
  
  /**
   * Check if a file exists
   * This is a placeholder - actual implementation would depend on desktop integration
   * @param path The path to check
   * @returns Promise indicating if the file exists
   */
  static async fileExists(path: string): Promise<boolean> {
    // This is a placeholder implementation
    // In a real application, this would use Electron or similar to access the file system
    
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    console.log(`Would check if file exists: ${path}`);
    
    // Simulate file check
    return true;
  }
  
  /**
   * List contents of a directory
   * @param directoryPath Directory to list
   * @returns Promise with array of filenames
   */
  static async listDirectory(directoryPath: string): Promise<string[]> {
    // This is a placeholder implementation
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    console.log(`Would list directory: ${directoryPath}`);
    
    // Simulate directory listing
    return [
      'Documents',
      'Downloads',
      'Pictures',
      'Desktop',
      'example.txt'
    ];
  }
  
  /**
   * Check if a path is a valid directory
   * @param path Path to check
   * @returns Promise indicating if the path is a valid directory
   */
  static async isValidDirectory(path: string): Promise<boolean> {
    // This is a placeholder implementation
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    console.log(`Would check if path is a valid directory: ${path}`);
    
    // Simulate check - all items with no extension are directories
    return !path.includes('.');
  }
  
  /**
   * Create a directory if it doesn't exist
   * @param path Directory path to create
   * @returns Promise indicating success
   */
  static async createDirectoryIfNotExists(path: string): Promise<boolean> {
    // This is a placeholder implementation
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    console.log(`Would create directory if not exists: ${path}`);
    
    // Simulate successful operation
    return true;
  }
  
  /**
   * Create platform-specific environment variable declarations
   * @param envVars Object with environment variable names and values
   * @returns An object with script content for different platforms
   */
  static createEnvironmentVariableScripts(envVars: Record<string, string>): {
    bash: string;
    powershell: string;
    cmd: string;
  } {
    // Bash/Zsh script (.sh)
    let bashScript = '#!/bin/bash\n# Environment variables for MCP Configuration\n\n';
    
    // PowerShell script (.ps1)
    let powershellScript = '# Environment variables for MCP Configuration\n\n';
    
    // Command Prompt script (.bat/.cmd)
    let cmdScript = '@echo off\nREM Environment variables for MCP Configuration\n\n';
    
    // Add each environment variable to the scripts
    Object.entries(envVars).forEach(([name, value]) => {
      const varName = name.toUpperCase();
      
      // Bash format (for Linux/macOS)
      bashScript += `export ${varName}="${value.replace(/"/g, '\\"')}"\n`;
      
      // PowerShell format
      powershellScript += `$env:${varName} = "${value.replace(/"/g, '`"')}"\n`;
      
      // CMD format (for Windows)
      cmdScript += `SET ${varName}=${value}\n`;
    });
    
    return {
      bash: bashScript,
      powershell: powershellScript,
      cmd: cmdScript
    };
  }
  
  /**
   * Creates environment variable script files in the specified directory
   * @param directory Directory to create the scripts in
   * @param envVars Object with environment variable names and values
   * @returns Promise resolving to an object with the paths to the created files
   */
  static async createEnvironmentVariableFiles(
    directory: string,
    envVars: Record<string, string>
  ): Promise<{
    bashPath: string;
    powershellPath: string;
    cmdPath: string;
  }> {
    if (!Platform.isDesktopEnvironment()) {
      throw new Error('File system access is only available in desktop environment');
    }
    
    // Create the scripts
    const scripts = this.createEnvironmentVariableScripts(envVars);
    
    // Make sure the directory exists
    await this.createDirectoryIfNotExists(directory);
    
    // Define file paths
    const separator = Platform.getPathSeparator();
    const bashPath = `${directory}${separator}mcp_env.sh`;
    const powershellPath = `${directory}${separator}mcp_env.ps1`;
    const cmdPath = `${directory}${separator}mcp_env.bat`;
    
    // Write the files
    await this.writeFile(bashPath, scripts.bash);
    await this.writeFile(powershellPath, scripts.powershell);
    await this.writeFile(cmdPath, scripts.cmd);
    
    // Make the bash script executable on Unix systems
    if (!Platform.isWindows()) {
      if (typeof (window as any).electron?.makeFileExecutable === 'function') {
        await (window as any).electron.makeFileExecutable(bashPath);
      }
    }
    
    return {
      bashPath,
      powershellPath,
      cmdPath
    };
  }
}