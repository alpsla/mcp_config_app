/**
 * Secure Token Manager
 * Manages secure storage of Hugging Face API tokens and wrapper script generation
 * for use with Claude Desktop
 */

const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const wrapperScriptGenerator = require('./wrapperScriptGenerator');

// Constants
const TOKEN_SERVICE = 'HuggingFaceToken';
const CONFIG_FILE_NAME = 'claude_desktop_config.json';

class SecureTokenManager {
  /**
   * Initialize the secure token manager
   * @param {BrowserWindow} mainWindow - The main Electron window
   */
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.configPath = this.getConfigPath();
    
    // Set up IPC handlers
    this.setupIpcHandlers();
  }
  
  /**
   * Set up IPC handlers for token-related operations
   */
  setupIpcHandlers() {
    ipcMain.handle('store-token', async (event, token) => {
      return await this.storeToken(token);
    });
    
    ipcMain.handle('retrieve-token', async () => {
      return await this.retrieveToken();
    });
    
    ipcMain.handle('delete-token', async () => {
      return await this.deleteToken();
    });
    
    ipcMain.handle('validate-token', async (event, token) => {
      return await this.validateToken(token);
    });
    
    ipcMain.handle('generate-wrapper-script', async () => {
      return await this.generateWrapperScript();
    });
  }
  
  /**
   * Get the path to the Claude Desktop config file
   * @returns {string} Path to the config file
   */
  getConfigPath() {
    // Default to user's home directory
    const userConfigDir = path.join(os.homedir(), '.claude-desktop');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(userConfigDir)) {
      fs.mkdirSync(userConfigDir, { recursive: true });
    }
    
    return path.join(userConfigDir, CONFIG_FILE_NAME);
  }
  
  /**
   * Store a token securely
   * @param {string} token - The token to store
   * @returns {Promise<boolean>} Promise resolving to success status
   */
  async storeToken(token) {
    try {
      const platform = os.platform();
      
      if (platform === 'darwin') {
        // macOS - use Keychain
        await this.storeTokenMacOS(token);
      } else if (platform === 'win32') {
        // Windows - use encrypted file or Windows Credential Manager
        await this.storeTokenWindows(token);
      } else if (platform === 'linux') {
        // Linux - use libsecret or encrypted file
        await this.storeTokenLinux(token);
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      
      // Generate wrapper script after storing token
      await this.generateWrapperScript();
      
      return true;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  }
  
  /**
   * Store token in macOS Keychain
   * @param {string} token - The token to store
   * @returns {Promise<void>}
   */
  async storeTokenMacOS(token) {
    return new Promise((resolve, reject) => {
      // Use security command-line tool to store in Keychain
      const cmd = `security add-generic-password -U -a "${os.userInfo().username}" -s "${TOKEN_SERVICE}" -w "${token}"`;
      
      exec(cmd, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  
  /**
   * Store token in Windows
   * @param {string} token - The token to store
   * @returns {Promise<void>}
   */
  async storeTokenWindows(token) {
    // For Windows, we'll use encrypted file storage
    // In a more robust implementation, you would use the Windows Credential Manager API
    
    const secureFilePath = path.join(os.homedir(), '.hf_token_secure.txt');
    
    return new Promise((resolve, reject) => {
      // Use PowerShell to encrypt the token
      const psScript = `
        $secureString = ConvertTo-SecureString "${token}" -AsPlainText -Force
        $secureString | ConvertFrom-SecureString | Out-File "${secureFilePath}"
      `;
      
      exec(`powershell -Command "${psScript}"`, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  
  /**
   * Store token in Linux
   * @param {string} token - The token to store
   * @returns {Promise<void>}
   */
  async storeTokenLinux(token) {
    return new Promise((resolve, reject) => {
      // Try to use secret-tool if available
      exec('which secret-tool', (error) => {
        if (error) {
          // Fall back to encrypted file
          try {
            const configDir = path.join(os.homedir(), '.config', 'huggingface');
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(configDir)) {
              fs.mkdirSync(configDir, { recursive: true });
            }
            
            // Write token to file
            fs.writeFileSync(path.join(configDir, 'token'), token, { mode: 0o600 });
            resolve();
          } catch (err) {
            reject(err);
          }
        } else {
          // Use secret-tool
          const cmd = `echo "${token}" | secret-tool store --label="Hugging Face API Token" service huggingface token api`;
          
          exec(cmd, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }
      });
    });
  }
  
  /**
   * Retrieve a stored token
   * @returns {Promise<string|null>} Promise resolving to the token or null
   */
  async retrieveToken() {
    try {
      const platform = os.platform();
      
      if (platform === 'darwin') {
        return await this.retrieveTokenMacOS();
      } else if (platform === 'win32') {
        return await this.retrieveTokenWindows();
      } else if (platform === 'linux') {
        return await this.retrieveTokenLinux();
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }
  
  /**
   * Retrieve token from macOS Keychain
   * @returns {Promise<string|null>} Promise resolving to the token or null
   */
  async retrieveTokenMacOS() {
    return new Promise((resolve, reject) => {
      const cmd = `security find-generic-password -s "${TOKEN_SERVICE}" -w`;
      
      exec(cmd, (error, stdout) => {
        if (error) {
          // Not finding the password also triggers an error
          resolve(null);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }
  
  /**
   * Retrieve token from Windows
   * @returns {Promise<string|null>} Promise resolving to the token or null
   */
  async retrieveTokenWindows() {
    const secureFilePath = path.join(os.homedir(), '.hf_token_secure.txt');
    
    // Check if file exists
    if (!fs.existsSync(secureFilePath)) {
      return null;
    }
    
    return new Promise((resolve, reject) => {
      // Use PowerShell to decrypt the token
      const psScript = `
        $secureString = Get-Content "${secureFilePath}" | ConvertTo-SecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
        $plainText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
        Write-Output $plainText
      `;
      
      exec(`powershell -Command "${psScript}"`, (error, stdout) => {
        if (error) {
          resolve(null);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }
  
  /**
   * Retrieve token from Linux
   * @returns {Promise<string|null>} Promise resolving to the token or null
   */
  async retrieveTokenLinux() {
    return new Promise((resolve) => {
      // Try to use secret-tool if available
      exec('which secret-tool', (error) => {
        if (error) {
          // Fall back to file
          try {
            const tokenPath = path.join(os.homedir(), '.config', 'huggingface', 'token');
            
            if (fs.existsSync(tokenPath)) {
              const token = fs.readFileSync(tokenPath, 'utf8').trim();
              resolve(token);
            } else {
              resolve(null);
            }
          } catch (err) {
            resolve(null);
          }
        } else {
          // Use secret-tool
          exec('secret-tool lookup service huggingface token api', (error, stdout) => {
            if (error) {
              resolve(null);
            } else {
              resolve(stdout.trim());
            }
          });
        }
      });
    });
  }
  
  /**
   * Delete a stored token
   * @returns {Promise<boolean>} Promise resolving to success status
   */
  async deleteToken() {
    try {
      const platform = os.platform();
      
      if (platform === 'darwin') {
        await this.deleteTokenMacOS();
      } else if (platform === 'win32') {
        await this.deleteTokenWindows();
      } else if (platform === 'linux') {
        await this.deleteTokenLinux();
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting token:', error);
      return false;
    }
  }
  
  /**
   * Delete token from macOS Keychain
   * @returns {Promise<void>}
   */
  async deleteTokenMacOS() {
    return new Promise((resolve, reject) => {
      const cmd = `security delete-generic-password -s "${TOKEN_SERVICE}"`;
      
      exec(cmd, (error) => {
        // Ignore errors (e.g., password not found)
        resolve();
      });
    });
  }
  
  /**
   * Delete token from Windows
   * @returns {Promise<void>}
   */
  async deleteTokenWindows() {
    const secureFilePath = path.join(os.homedir(), '.hf_token_secure.txt');
    
    // Delete file if it exists
    if (fs.existsSync(secureFilePath)) {
      fs.unlinkSync(secureFilePath);
    }
    
    return Promise.resolve();
  }
  
  /**
   * Delete token from Linux
   * @returns {Promise<void>}
   */
  async deleteTokenLinux() {
    return new Promise((resolve) => {
      // Try to use secret-tool if available
      exec('which secret-tool', (error) => {
        if (error) {
          // Fall back to file
          try {
            const tokenPath = path.join(os.homedir(), '.config', 'huggingface', 'token');
            
            if (fs.existsSync(tokenPath)) {
              fs.unlinkSync(tokenPath);
            }
          } catch (err) {
            // Ignore errors
          }
        } else {
          // Use secret-tool
          exec('secret-tool clear service huggingface token api', (error) => {
            // Ignore errors
          });
        }
        
        resolve();
      });
    });
  }
  
  /**
   * Validate a token with the Hugging Face API
   * @param {string} token - The token to validate
   * @returns {Promise<object>} Promise resolving to validation result
   */
  async validateToken(token) {
    try {
      // Make a lightweight API call to validate the token
      const response = await fetch('https://huggingface.co/api/whoami-v2', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          username: data.name || 'Unknown user',
          orgs: data.orgs || [],
          message: 'Token validated successfully!'
        };
      } else if (response.status === 401) {
        return {
          isValid: false,
          message: 'Invalid token: Authentication failed'
        };
      } else {
        return {
          isValid: false,
          message: `Token validation failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        isValid: false,
        message: `Error validating token: ${error.message}`
      };
    }
  }
  
  /**
   * Generate a wrapper script for the current platform
   * @returns {Promise<boolean>} Promise resolving to success status
   */
  async generateWrapperScript() {
    try {
      // Make sure we have a token before generating the script
      const token = await this.retrieveToken();
      
      if (!token) {
        throw new Error('No token found in secure storage');
      }
      
      // Generate the wrapper script
      const scriptPath = wrapperScriptGenerator.generateScript(this.configPath);
      
      // Update the Claude Desktop config file
      wrapperScriptGenerator.updateConfigFile(this.configPath, scriptPath);
      
      // Notify the renderer process
      if (this.mainWindow) {
        this.mainWindow.webContents.send('wrapper-script-generated', {
          success: true,
          scriptPath
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error generating wrapper script:', error);
      
      // Notify the renderer process
      if (this.mainWindow) {
        this.mainWindow.webContents.send('wrapper-script-generated', {
          success: false,
          error: error.message
        });
      }
      
      return false;
    }
  }
}

module.exports = SecureTokenManager;
