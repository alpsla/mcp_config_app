#!/usr/bin/env node

/**
 * MCP Config Migration Script
 * Safely migrates tokens from an existing config file to secure storage
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
  console.log('\n=== MCP Configuration Migration Tool ===\n');
  
  // Get config path from args or use default
  let configPath = process.argv[2];
  
  if (!configPath) {
    const defaultPath = path.join(require('os').homedir(), '.claude-desktop', 'claude_desktop_config.json');
    
    console.log(`No config path provided. Default: ${defaultPath}`);
    
    const useDefault = await question('Use default config path? (Y/n): ');
    
    if (useDefault.toLowerCase() !== 'n') {
      configPath = defaultPath;
    } else {
      configPath = await question('Enter path to config file: ');
    }
  }
  
  // Validate file exists
  if (!fs.existsSync(configPath)) {
    console.error(`Error: Config file not found at ${configPath}`);
    process.exit(1);
  }
  
  console.log(`\nMigrating configuration from: ${configPath}`);
  
  // Create migration instance
  const migration = new ConfigMigration(configPath);
  
  // Preview tokens that will be migrated
  const tokens = migration.extractTokens();
  
  if (Object.keys(tokens).length === 0) {
    console.log('\nNo tokens found in config file. Nothing to migrate.');
    process.exit(0);
  }
  
  console.log('\nFound the following tokens:');
  
  Object.entries(tokens).forEach(([serverName, token]) => {
    // Show only the first few characters of the token
    const displayToken = token.substring(0, 5) + '*'.repeat(token.length - 8) + token.substring(token.length - 3);
    console.log(`- ${serverName}: ${displayToken}`);
  });
  
  // Confirm migration
  const confirm = await question('\nDo you want to migrate these tokens to secure storage? (y/N): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('\nMigration cancelled. No changes made.');
    process.exit(0);
  }
  
  // Perform migration
  console.log('\nMigrating tokens...');
  
  try {
    const result = await migration.migrateTokens();
    
    if (result.success) {
      console.log('\n✅ Migration completed successfully!');
      console.log(`- ${result.tokensFound} tokens found`);
      console.log(`- ${result.tokensMigrated} tokens migrated to secure storage`);
      console.log(`- Backup created at: ${result.backupPath}`);
      
      if (result.configCleaned) {
        console.log('- Configuration file updated to remove hardcoded tokens');
      }
      
      console.log('\n🔒 Your tokens are now stored securely and will be used automatically');
      console.log('   with the new wrapper scripts when launching MCP servers.');
    } else {
      console.error('\n❌ Migration completed with errors.');
      console.log(`- Backup created at: ${result.backupPath}`);
      console.log('- You can restore the backup if needed.');
      
      const restore = await question('\nWould you like to restore the backup now? (y/N): ');
      
      if (restore.toLowerCase() === 'y') {
        const restored = migration.restoreBackup(result.backupPath);
        
        if (restored) {
          console.log('\n✅ Backup restored successfully.');
        } else {
          console.error('\n❌ Failed to restore backup.');
        }
      }
    }
  } catch (error) {
    console.error('\n❌ Error during migration:', error);
  }
  
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
