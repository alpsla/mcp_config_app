/**
 * Config Backup Manager
 * Provides utilities for backing up and restoring MCP configuration files
 * before making changes to token storage
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

class ConfigBackupManager {
  /**
   * Create a backup of a configuration file
   * @param {string} configPath - Path to the config file to backup
   * @returns {string} Path to the backup file
   */
  static backupConfig(configPath) {
    try {
      // Make sure the file exists
      if (!fs.existsSync(configPath)) {
        console.warn(`Config file does not exist: ${configPath}`);
        return null;
      }

      // Read the current config
      const configData = fs.readFileSync(configPath, 'utf8');
      
      // Create backup file name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(os.homedir(), '.mcp-config-backups');
      
      // Create the backup directory if it doesn't exist
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Generate backup file path
      const fileName = path.basename(configPath);
      const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
      
      // Write the backup file
      fs.writeFileSync(backupPath, configData);
      
      console.log(`Created backup of ${configPath} at ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Error creating config backup:', error);
      return null;
    }
  }
  
  /**
   * Restore a configuration from backup
   * @param {string} backupPath - Path to the backup file
   * @param {string} configPath - Path to restore to
   * @returns {boolean} Success status
   */
  static restoreFromBackup(backupPath, configPath) {
    try {
      // Make sure the backup file exists
      if (!fs.existsSync(backupPath)) {
        console.error(`Backup file does not exist: ${backupPath}`);
        return false;
      }
      
      // Read the backup data
      const backupData = fs.readFileSync(backupPath, 'utf8');
      
      // Restore to the config file
      fs.writeFileSync(configPath, backupData);
      
      console.log(`Restored ${configPath} from backup ${backupPath}`);
      return true;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }
  
  /**
   * List available backups for a configuration file
   * @param {string} configFileName - Name of the config file
   * @returns {Array<string>} List of backup file paths
   */
  static listBackups(configFileName) {
    try {
      const backupDir = path.join(os.homedir(), '.mcp-config-backups');
      
      // If backup directory doesn't exist, no backups available
      if (!fs.existsSync(backupDir)) {
        return [];
      }
      
      // Get all files in the backup directory
      const files = fs.readdirSync(backupDir);
      
      // Filter to find backups of the specified config file
      const backups = files.filter(file => file.startsWith(configFileName) && file.endsWith('.bak'));
      
      // Return full paths to backup files
      return backups.map(file => path.join(backupDir, file));
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }
  
  /**
   * Get the latest backup for a configuration file
   * @param {string} configFileName - Name of the config file
   * @returns {string|null} Path to the latest backup file or null
   */
  static getLatestBackup(configFileName) {
    const backups = this.listBackups(configFileName);
    
    if (backups.length === 0) {
      return null;
    }
    
    // Sort backups by modification time (most recent first)
    backups.sort((a, b) => {
      const statA = fs.statSync(a);
      const statB = fs.statSync(b);
      return statB.mtime.getTime() - statA.mtime.getTime();
    });
    
    return backups[0];
  }
  
  /**
   * Checks if a config file contains a hardcoded Hugging Face token
   * @param {string} configPath - Path to the config file
   * @returns {boolean} True if a hardcoded token is found
   */
  static hasHardcodedToken(configPath) {
    try {
      // Make sure the file exists
      if (!fs.existsSync(configPath)) {
        return false;
      }
      
      // Read the config file
      const configData = fs.readFileSync(configPath, 'utf8');
      
      // Try to parse as JSON
      let configJson;
      try {
        configJson = JSON.parse(configData);
      } catch (e) {
        console.error('Error parsing config file as JSON:', e);
        return false;
      }
      
      // Check for common token patterns in the file
      const configStr = JSON.stringify(configJson);
      
      // Check for HF token pattern in args or environment variables
      const tokenPatterns = [
        /hf_[a-zA-Z0-9]{20,}/i,  // Direct token
        /"token"\s*:\s*"[^"]+"/i,  // "token": "value"
        /"hf[_-]token"\s*:\s*"[^"]+"/i,  // "hf_token": "value"
        /"hugging[_-]?face[_-]?token"\s*:\s*"[^"]+"/i,  // "huggingface_token": "value"
        /--hf[_-]token=/i,  // --hf-token=value
        /--hugging[_-]?face[_-]?token=/i  // --huggingface-token=value
      ];
      
      for (const pattern of tokenPatterns) {
        if (pattern.test(configStr)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for hardcoded token:', error);
      return false;
    }
  }
  
  /**
   * Remove hardcoded token from a config file and replace with safer alternatives
   * @param {string} configPath - Path to the config file
   * @param {boolean} createBackup - Whether to create a backup
   * @returns {boolean} Success status
   */
  static sanitizeConfig(configPath, createBackup = true) {
    try {
      // Make sure the file exists
      if (!fs.existsSync(configPath)) {
        console.error(`Config file does not exist: ${configPath}`);
        return false;
      }
      
      // Create a backup first if requested
      if (createBackup) {
        this.backupConfig(configPath);
      }
      
      // Read the config file
      const configData = fs.readFileSync(configPath, 'utf8');
      
      // Parse the JSON
      let configJson;
      try {
        configJson = JSON.parse(configData);
      } catch (e) {
        console.error('Error parsing config file as JSON:', e);
        return false;
      }
      
      // Check if there are direct token references in mcpServers
      if (configJson.mcpServers) {
        let modified = false;
        
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
            const newEnv = { ...server.env };
            const tokenKeys = Object.keys(newEnv).filter(key => {
              return /hf[_-]token|hugging[_-]?face[_-]?token/i.test(key);
            });
            
            for (const key of tokenKeys) {
              delete newEnv[key];
              modified = true;
            }
            
            server.env = newEnv;
          }
        });
        
        if (modified) {
          // Write the updated config back to the file
          fs.writeFileSync(configPath, JSON.stringify(configJson, null, 2));
          console.log(`Updated ${configPath} to remove hardcoded tokens`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error sanitizing config:', error);
      return false;
    }
  }
}

export default ConfigBackupManager;
