/**
 * Config Backup Handler
 * Electron IPC handler for MCP config backup operations
 */

const { ipcMain } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');

class ConfigBackupHandler {
  constructor() {
    this.setupIpcHandlers();
    this.configPath = this.getConfigPath();
  }

  /**
   * Set up IPC handlers for config backup operations
   */
  setupIpcHandlers() {
    ipcMain.on('backup-mcp-config', async (event, args) => {
      try {
        const backupPath = await this.backupCurrentConfig();
        
        if (backupPath) {
          // If backup was successful, sanitize the config file
          const sanitized = await this.sanitizeConfig(args.token);
          
          event.reply('backup-mcp-config-reply', { 
            success: true, 
            backupPath, 
            sanitized 
          });
        } else {
          event.reply('backup-mcp-config-reply', { 
            success: false, 
            error: 'Failed to create backup' 
          });
        }
      } catch (error) {
        console.error('Error in backup-mcp-config handler:', error);
        event.reply('backup-mcp-config-reply', { 
          success: false, 
          error: error.message 
        });
      }
    });
    
    ipcMain.handle('restore-mcp-config', async (event, args) => {
      try {
        const success = await this.restoreConfig(args.backupPath);
        return { success };
      } catch (error) {
        console.error('Error in restore-mcp-config handler:', error);
        return { success: false, error: error.message };
      }
    });
  }

  /**
   * Get the path to the Claude Desktop config file
   * @returns {string} Path to the config file
   */
  getConfigPath() {
    // Default paths for Claude Desktop config file
    const possiblePaths = [
      path.join(os.homedir(), '.claude-desktop', 'claude_desktop_config.json'),
      path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
      path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json'),
      path.join(os.homedir(), '.config', 'claude-desktop', 'claude_desktop_config.json')
    ];
    
    // Return the first path that exists
    for (const configPath of possiblePaths) {
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }
    
    // If no existing config found, return the default path based on platform
    const platform = os.platform();
    if (platform === 'win32') {
      return possiblePaths[2]; // Windows path
    } else if (platform === 'darwin') {
      return possiblePaths[1]; // macOS path
    } else {
      return possiblePaths[3]; // Linux path
    }
  }

  /**
   * Create a backup of the current config file
   * @returns {Promise<string|null>} Path to the backup file or null
   */
  async backupCurrentConfig() {
    try {
      // Check if the config file exists
      if (!this.configPath || !fs.existsSync(this.configPath)) {
        console.warn('MCP config file not found');
        return null;
      }
      
      // Read the current config
      const configData = fs.readFileSync(this.configPath, 'utf8');
      
      // Create backup file name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(os.homedir(), '.mcp-config-backups');
      
      // Create the backup directory if it doesn't exist
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Generate backup file path
      const fileName = path.basename(this.configPath);
      const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
      
      // Write the backup file
      fs.writeFileSync(backupPath, configData);
      
      console.log(`Created backup of ${this.configPath} at ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Error creating config backup:', error);
      return null;
    }
  }

  /**
   * Sanitize the config file to remove any hardcoded tokens
   * @param {string} token - The new token value
   * @returns {Promise<boolean>} Success status
   */
  async sanitizeConfig(token) {
    try {
      // Check if the config file exists
      if (!this.configPath || !fs.existsSync(this.configPath)) {
        console.warn('MCP config file not found');
        return false;
      }
      
      // Read the config file
      const configData = fs.readFileSync(this.configPath, 'utf8');
      
      // Parse the JSON
      let configJson;
      try {
        configJson = JSON.parse(configData);
      } catch (e) {
        console.error('Error parsing config file as JSON:', e);
        return false;
      }
      
      let modified = false;
      
      // Process mcpServers section if present
      if (configJson.mcpServers) {
        // Process each server config
        Object.keys(configJson.mcpServers).forEach(serverKey => {
          const server = configJson.mcpServers[serverKey];
          
          // Check for token in args
          if (Array.isArray(server.args)) {
            const newArgs = server.args.filter(arg => {
              // Filter out any args containing tokens
              return !(/--hf[_-]token=|--hugging[_-]?face[_-]?token=|hf_[a-zA-Z0-9]{20,}/i.test(arg));
            });
            
            if (newArgs.length !== server.args.length) {
              server.args = newArgs;
              modified = true;
            }
          }
          
          // Check for token in env
          if (server.env) {
            const tokenKeys = Object.keys(server.env).filter(key => {
              return /hf[_-]token|hugging[_-]?face[_-]?token/i.test(key);
            });
            
            if (tokenKeys.length > 0) {
              // Remove token environment variables
              tokenKeys.forEach(key => {
                delete server.env[key];
              });
              modified = true;
            }
          }
        });
      }
      
      if (modified) {
        // Write the updated config back to the file
        fs.writeFileSync(this.configPath, JSON.stringify(configJson, null, 2));
        console.log(`Updated ${this.configPath} to remove hardcoded tokens`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error sanitizing config:', error);
      return false;
    }
  }

  /**
   * Restore a config file from backup
   * @param {string} backupPath - Path to the backup file
   * @returns {Promise<boolean>} Success status
   */
  async restoreConfig(backupPath) {
    try {
      // Check if the backup file exists
      if (!backupPath || !fs.existsSync(backupPath)) {
        console.error('Backup file not found:', backupPath);
        return false;
      }
      
      // Read the backup data
      const backupData = fs.readFileSync(backupPath, 'utf8');
      
      // Restore to the config file
      fs.writeFileSync(this.configPath, backupData);
      
      console.log(`Restored ${this.configPath} from backup ${backupPath}`);
      return true;
    } catch (error) {
      console.error('Error restoring config:', error);
      return false;
    }
  }
}

module.exports = ConfigBackupHandler;
