/**
 * Secure Token Manager for Electron
 * 
 * Provides methods for managing Hugging Face API tokens securely in the Electron main process.
 * This component is responsible for:
 * 1. Storing tokens in the OS credential store
 * 2. Retrieving tokens from the OS credential store
 * 3. Updating the Claude Desktop config to use the tokens
 * 4. Validating tokens with the Hugging Face API
 */

const { ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');

// Constants
const TOKEN_SERVICE = 'HuggingFaceToken';
const CONFIG_FILE_NAME = 'claude_desktop_config.json';

/**
 * Get the path to the Claude Desktop config file
 * @returns {string} Path to the config file
 */
function getClaudeDesktopConfigPath() {
  const platform = os.platform();
  if (platform === 'darwin') {
    // macOS path
    return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'win32') {
    // Windows path
    return path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
  }
  throw new Error(`Unsupported platform: ${platform}`);
}

/**
 * SecureTokenManager class
 */
class SecureTokenManager {
  /**
   * Initialize the secure token manager
   * @param {BrowserWindow} mainWindow - The main Electron window
   */
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.configPath = getClaudeDesktopConfigPath();
    
    // Set up IPC handlers
    this.setupIpcHandlers();
  }
  
  /**
   * Set up IPC handlers for token-related operations
   */
  setupIpcHandlers() {
    ipcMain.handle('storeToken', async (event, token) => {
      return await this.storeToken(token);
    });
    
    ipcMain.handle('retrieveToken', async () => {
      return await this.retrieveToken();
    });
    
    ipcMain.handle('deleteToken', async () => {
      return await this.deleteToken();
    });
    
    ipcMain.handle('validateToken', async (event, token) => {
      return await this.validateToken(token);
    });
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
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      
      // Update Claude Desktop config file with the token
      await this.updateClaudeDesktopConfig(token);
      
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
   * Update Claude Desktop config file to use the Hugging Face token
   * @param {string} token - The token to include in config (not stored directly)
   * @returns {Promise<boolean>} Promise resolving to success status
   */
  async updateClaudeDesktopConfig(token) {
    try {
      const configPath = this.configPath;
      const configDir = path.dirname(configPath);
      
      // Create config directory if it doesn't exist
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      // Read existing config or create new one
      let config = {};
      if (fs.existsSync(configPath)) {
        try {
          const configContent = fs.readFileSync(configPath, 'utf8');
          config = JSON.parse(configContent);
        } catch (parseError) {
          console.warn('Error parsing Claude Desktop config, creating new one:', parseError);
        }
      }
      
      // Ensure mcpServers structure exists
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
      
      // Find HF related servers and update their environment variables
      Object.keys(config.mcpServers).forEach(serverName => {
        const server = config.mcpServers[serverName];
        
        // If this server has HF in the name or uses HF API
        if (
          serverName.toLowerCase().includes('hf') ||
          serverName.toLowerCase().includes('huggingface') ||
          (server.env && (
            server.env.HF_TOKEN || 
            server.env.HUGGINGFACE_TOKEN
          ))
        ) {
          // Create or update env section
          if (!server.env) {
            server.env = {};
          }
          
          // Update token
          server.env.HF_TOKEN = '{{HF_TOKEN}}';
          
          // Add comment about token placeholder
          server.comment = "Uses securely stored Hugging Face token";
        }
      });
      
      // Create a new wrapper script if none exists
      const platform = os.platform();
      const scriptFileName = platform === 'darwin' ? 'hf_token_wrapper.sh' : 'hf_token_wrapper.ps1';
      const scriptPath = path.join(configDir, scriptFileName);
      
      // Create the wrapper script with appropriate content
      if (platform === 'darwin') {
        // macOS bash script
        const scriptContent = `#!/bin/bash
# Hugging Face API token wrapper - generated by MCP Config App

# Get token from secure storage
export HF_TOKEN=$(security find-generic-password -s "${TOKEN_SERVICE}" -w 2>/dev/null)

# Check if token retrieval succeeded
if [ -z "$HF_TOKEN" ]; then
  echo "Error: Could not retrieve Hugging Face API token from secure storage."
  echo "Please set up your token in the MCP Config App first."
  exit 1
fi

# Replace token placeholder in first argument if it's a JSON file
if [[ "$1" == *.json ]]; then
  # Create a temporary file
  TEMP_FILE=$(mktemp)
  # Replace the placeholder with the actual token
  sed "s/{{HF_TOKEN}}/$HF_TOKEN/g" "$1" > "$TEMP_FILE"
  # Use the temporary file instead
  shift
  set -- "$TEMP_FILE" "$@"
fi

# Execute the command with the token as an environment variable
exec "$@"
`;
        fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 }); // Make executable
      } else {
        // Windows PowerShell script
        const scriptContent = `# Hugging Face API token wrapper - generated by MCP Config App

# Try to retrieve the token from secure storage
try {
  # First try Windows Credential Manager
  try {
    $cred = Get-StoredCredential -Target "HuggingFaceToken"
    if ($cred) {
      $env:HF_TOKEN = $cred.GetNetworkCredential().Password
    }
  } catch {
    # Fall back to encrypted file storage
    $secureFilePath = "$env:USERPROFILE\\.hf_token_secure.txt"
    if (Test-Path $secureFilePath) {
      $secureString = Get-Content $secureFilePath | ConvertTo-SecureString
      $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
      $env:HF_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
      [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    }
  }
  
  if ([string]::IsNullOrEmpty($env:HF_TOKEN)) {
    throw "Empty token retrieved"
  }
  
  # Replace token placeholder in first argument if it's a JSON file
  if ($args[0] -like "*.json") {
    # Create a temporary file
    $tempFile = [System.IO.Path]::GetTempFileName()
    # Replace the placeholder with the actual token
    (Get-Content $args[0]) -replace "{{HF_TOKEN}}", "$env:HF_TOKEN" | Set-Content $tempFile
    # Use the temporary file instead
    $newArgs = @($tempFile) + $args[1..($args.Length-1)]
    $args = $newArgs
  }
  
} catch {
  Write-Error "Error: Could not retrieve Hugging Face API token from secure storage."
  Write-Error "Please set up your token in the MCP Config App first."
  exit 1
}

# Execute the command with the token as an environment variable
& $args
`;
        fs.writeFileSync(scriptPath, scriptContent);
      }
      
      // Add a generic huggingface server entry if none exists
      let hasHfServer = false;
      Object.keys(config.mcpServers).forEach(serverName => {
        if (
          serverName.toLowerCase().includes('hf') ||
          serverName.toLowerCase().includes('huggingface')
        ) {
          hasHfServer = true;
        }
      });
      
      if (!hasHfServer) {
        // Add a placeholder server that uses the wrapper script
        config.mcpServers.huggingface = {
          command: scriptPath,
          args: [],
          env: {
            HF_TOKEN: '{{HF_TOKEN}}'
          },
          comment: "Uses securely stored Hugging Face token"
        };
      }
      
      // Save updated config
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      
      return true;
    } catch (error) {
      console.error('Error updating Claude Desktop config:', error);
      return false;
    }
  }
  
  /**
   * Validate a token with the Hugging Face API
   * @param {string} token - The token to validate
   * @returns {Promise<object>} Promise resolving to validation result
   */
  async validateToken(token) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'huggingface.co',
        port: 443,
        path: '/api/whoami-v2',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const jsonData = JSON.parse(data);
              resolve({
                isValid: true,
                username: jsonData.name || 'Unknown user',
                orgs: jsonData.orgs || [],
                message: 'Token validated successfully!'
              });
            } catch (error) {
              resolve({
                isValid: true,
                message: 'Token validated successfully!'
              });
            }
          } else if (res.statusCode === 401) {
            resolve({
              isValid: false,
              message: 'Invalid token: Authentication failed'
            });
          } else {
            resolve({
              isValid: false,
              message: `Token validation failed: ${res.statusCode} ${res.statusMessage}`
            });
          }
        });
      });
      
      req.on('error', (error) => {
        resolve({
          isValid: false,
          message: `Error validating token: ${error.message}`
        });
      });
      
      req.end();
    });
  }
}

module.exports = SecureTokenManager;