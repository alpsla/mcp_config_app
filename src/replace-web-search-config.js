/**
 * Script to replace WebSearchConfig with the new version
 * Run this in your terminal:
 * node src/replace-web-search-config.js
 */
const fs = require('fs');
const path = require('path');

try {
  // Define paths
  const sourcePath = path.join(__dirname, 'components', 'configuration', 'WebSearchConfig.v2.jsx');
  const destPath = path.join(__dirname, 'components', 'configuration', 'WebSearchConfig.jsx');
  
  // Backup the old file
  const backupPath = path.join(__dirname, 'components', 'configuration', 'WebSearchConfig.backup.jsx');
  
  // Check if source exists
  if (!fs.existsSync(sourcePath)) {
    console.error('New component file not found at:', sourcePath);
    process.exit(1);
  }
  
  // Create backup of current file
  if (fs.existsSync(destPath)) {
    fs.copyFileSync(destPath, backupPath);
    console.log('Created backup of original file at:', backupPath);
  }
  
  // Copy the new file over the old one
  fs.copyFileSync(sourcePath, destPath);
  console.log('Successfully replaced WebSearchConfig component with new version!');
  
  // Reminder to restart the development server
  console.log('\nIMPORTANT: Remember to restart your development server to see the changes.');
  console.log('If using npm: npm run start');
  console.log('If using yarn: yarn start');
  
} catch (error) {
  console.error('Error replacing component:', error.message);
}