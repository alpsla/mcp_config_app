#!/usr/bin/env node

/**
 * MCP Config Restoration Script
 * Restores a previously backed up configuration file
 */

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const ConfigMigration = require('../src/utils/configMigration');

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promise wrapper for readline question
function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('\n=== MCP Configuration Restoration Tool ===\n');
  
  // Get backup path from args
  let backupPath = process.argv[2];
  
  if (!backupPath) {
    // List available backups
    const defaultConfigPath = path.join(require('os').homedir(), '.claude-desktop', 'claude_desktop_config.json');
    const configDir = path.dirname(defaultConfigPath);
    
    if (fs.existsSync(configDir)) {
      const files = fs.readdirSync(configDir);
      const backups = files.filter(file => file.startsWith('claude_desktop_config.json.backup-'));
      
      if (backups.length > 0) {
        console.log('Available backups:');
        backups.forEach((backup, index) => {
          console.log(`${index + 1}. ${backup}`);
        });
        
        const selection = await question('\nSelect a backup to restore (number) or enter full path: ');
        
        if (!isNaN(parseInt(selection)) && parseInt(selection) <= backups.length) {
          backupPath = path.join(configDir, backups[parseInt(selection) - 1]);
        } else {
          backupPath = selection;
        }
      } else {
        console.log('No backups found in default location.');
        backupPath = await question('Enter path to backup file: ');
      }
    } else {
      backupPath = await question('Enter path to backup file: ');
    }
  }
  
  // Validate backup exists
  if (!fs.existsSync(backupPath)) {
    console.error(`Error: Backup file not found at ${backupPath}`);
    process.exit(1);
  }
  
  // Get config path or use default
  let configPath = process.argv[3];
  
  if (!configPath) {
    const defaultPath = path.join(require('os').homedir(), '.claude-desktop', 'claude_desktop_config.json');
    
    console.log(`\nNo target config path provided. Default: ${defaultPath}`);
    
    const useDefault = await question('Restore to default config path? (Y/n): ');
    
    if (useDefault.toLowerCase() !== 'n') {
      configPath = defaultPath;
    } else {
      configPath = await question('Enter path to restore to: ');
    }
  }
  
  // Confirm restoration
  if (fs.existsSync(configPath)) {
    const confirm = await question(`\n⚠️ Warning: ${configPath} already exists. Overwrite? (y/N): `);
    
    if (confirm.toLowerCase() !== 'y') {
      console.log('\nRestoration cancelled. No changes made.');
      process.exit(0);
    }
  }
  
  // Create migration instance with target config
  const migration = new ConfigMigration(configPath);
  
  // Perform restoration
  console.log(`\nRestoring from ${backupPath} to ${configPath}...`);
  
  try {
    const result = migration.restoreBackup(backupPath);
    
    if (result) {
      console.log('\n✅ Restoration completed successfully!');
      console.log(`- ${configPath} has been restored from backup`);
    } else {
      console.error('\n❌ Restoration failed.');
    }
  } catch (error) {
    console.error('\n❌ Error during restoration:', error);
  }
  
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
