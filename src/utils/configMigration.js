/**
 * Configuration Migration Utility
 * Safely extracts tokens from existing configuration files and backs up the original
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Import secure token storage
const secureTokenStorage = require('./secureTokenStorage');

/**
 * Configuration Migration Utility
 */
class ConfigMigration {
  /**
   * Create a new ConfigMigration instance
   * @param {string} configPath - Path to the config file (optional)
   */
  constructor(configPath) {
    this.configPath = configPath || this.getDefaultConfigPath();
  }
  
  /**
   * Get the default config file path
   * @returns {string} Path to the default config file
   */
  getDefaultConfigPath() {
    return path.join(os.homedir(), '.claude-desktop', 'claude_desktop_config.json');
  }
  
  /**
   * Check if a config file exists
   * @returns {boolean} True if the config file exists
   */
  configExists() {
    return fs.existsSync(this.configPath);
  }
  
  /**
   * Create a backup of the current config
   * @returns {string} Path to the backup file
   */
  backupConfig() {
    if (!this.configExists()) {
      return null;
    }
    
    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupPath = `${this.configPath}.backup-${timestamp}`;
    
    // Create backup
    fs.copyFileSync(this.configPath, backupPath);
    console.log(`Backed up config to ${backupPath}`);
    
    return backupPath;
  }
  
  /**
   * Extract API tokens from the config
   * @returns {Object} Object containing extracted tokens
   */
  extractTokens() {
    if (!this.configExists()) {
      return {};
    }
    
    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const tokens = {};
      
      // Extract tokens from mcpServers
      if (config.mcpServers) {
        Object.entries(config.mcpServers).forEach(([serverName, serverConfig]) => {
          // Check for token in args
          if (serverConfig.args) {
            for (const arg of serverConfig.args) {
              // Check for patterns like --hf-token=XXX or -t XXX
              if (typeof arg === 'string') {
                const tokenMatches = arg.match(/--hf[-_]?token[=\s]([^\s]+)/i) || 
                                     arg.match(/-t[=\s]([^\s]+)/i);
                                    
                if (tokenMatches && tokenMatches[1]) {
                  tokens[serverName] = tokenMatches[1];
                }
              }
            }
          }
          
          // Check for token in environment
          if (serverConfig.env && serverConfig.env.HF_TOKEN) {
            tokens[serverName] = serverConfig.env.HF_TOKEN;
          }
        });
      }
      
      return tokens;
    } catch (error) {
      console.error('Error extracting tokens:', error);
      return {};
    }
  }
  
  /**
   * Create a new config without hardcoded tokens
   * @returns {boolean} True if successful
   */
  createCleanConfig() {
    if (!this.configExists()) {
      return false;
    }
    
    try {
      // Load existing config
      const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      
      // Remove tokens from mcpServers
      if (config.mcpServers) {
        Object.entries(config.mcpServers).forEach(([serverName, serverConfig]) => {
          // Clean up args
          if (serverConfig.args) {
            serverConfig.args = serverConfig.args.filter(arg => {
              if (typeof arg === 'string') {
                return !arg.match(/--hf[-_]?token[=\s]/i) && !arg.match(/^-t[=\s]/i);
              }
              return true;
            });
          }
          
          // Clean up environment
          if (serverConfig.env && serverConfig.env.HF_TOKEN) {
            delete serverConfig.env.HF_TOKEN;
            
            // Remove env object if empty
            if (Object.keys(serverConfig.env).length === 0) {
              delete serverConfig.env;
            }
          }
        });
      }
      
      // Write updated config
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      console.log(`Updated config at ${this.configPath}`);
      
      return true;
    } catch (error) {
      console.error('Error creating clean config:', error);
      return false;
    }
  }
  
  /**
   * Migrate tokens to secure storage
   * @returns {Promise<object>} Results of migration
   */
  async migrateTokens() {
    try {
      // Back up the config first
      const backupPath = this.backupConfig();
      
      // Extract tokens
      const tokens = this.extractTokens();
      
      if (Object.keys(tokens).length === 0) {
        console.log('No tokens found in config');
        return { 
          success: true, 
          tokensFound: 0,
          backupPath 
        };
      }
      
      // Store tokens securely
      const results = {
        success: true,
        tokensFound: Object.keys(tokens).length,
        tokensMigrated: 0,
        backupPath
      };
      
      for (const [serverName, token] of Object.entries(tokens)) {
        try {
          await secureTokenStorage.storeToken(token);
          results.tokensMigrated++;
        } catch (error) {
          console.error(`Error storing token for ${serverName}:`, error);
          results.success = false;
        }
      }
      
      // Create clean config if any tokens were migrated
      if (results.tokensMigrated > 0) {
        const cleanResult = this.createCleanConfig();
        results.configCleaned = cleanResult;
      }
      
      return results;
    } catch (error) {
      console.error('Error migrating tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Restore a backup config
   * @param {string} backupPath - Path to the backup file
   * @returns {boolean} True if successful
   */
  restoreBackup(backupPath) {
    if (!fs.existsSync(backupPath)) {
      console.error(`Backup file not found: ${backupPath}`);
      return false;
    }
    
    try {
      fs.copyFileSync(backupPath, this.configPath);
      console.log(`Restored config from ${backupPath}`);
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }
}

module.exports = ConfigMigration;
