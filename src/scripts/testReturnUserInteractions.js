/**
 * Test utility functions for the returning user dashboard
 * Run these in the browser console for testing interactions
 */

// Simulate adding a model to a configuration
const simulateAddModel = (modelId, configId) => {
  console.log(`✅ Model ${modelId} would be added to configuration ${configId}`);
  alert(`Adding model ${modelId} to configuration ${configId}`);
};

// Simulate validating a configuration with a successful result
const simulateSuccessfulValidation = (configId) => {
  console.log(`✅ Simulating successful validation for configuration ${configId}`);
  
  // This would target the actual components in a real implementation
  // For the mock, just show what would happen
  alert(`Configuration ${configId} validated successfully!
All components checked:
- Web Search: Valid
- File System: Valid
- Hugging Face: Valid
- Claude Integration: Valid`);
};

// Simulate validating a configuration with a failed result
const simulateFailedValidation = (configId) => {
  console.log(`❌ Simulating failed validation for configuration ${configId}`);
  
  alert(`Configuration ${configId} has validation issues:
- Web Search: Valid
- File System: Invalid (Directory not accessible)
- Hugging Face: Valid (Token verified)
- Claude Integration: Invalid (Fix file system issues first)`);
};

// Simulate upgrading the user's tier
const simulateUpgradeTier = (tier) => {
  console.log(`✅ Simulating upgrade to ${tier} tier`);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  user.tier = tier;
  localStorage.setItem('user', JSON.stringify(user));
  
  alert(`User tier upgraded to ${tier}. Refresh the page to see changes.`);
};

// Expose functions to the global window object
window.simulateAddModel = simulateAddModel;
window.simulateSuccessfulValidation = simulateSuccessfulValidation;
window.simulateFailedValidation = simulateFailedValidation;
window.simulateUpgradeTier = simulateUpgradeTier;

// Print helpful test instructions to the console
console.log('======== RETURNING USER DASHBOARD TEST UTILITIES ========');
console.log('To simulate adding a model to a configuration:');
console.log('  window.simulateAddModel(1, 1)');
console.log('To simulate a successful validation:');
console.log('  window.simulateSuccessfulValidation(1)');
console.log('To simulate a failed validation:');
console.log('  window.simulateFailedValidation(3)');
console.log('To simulate upgrading to a different tier:');
console.log('  window.simulateUpgradeTier("Complete")');
console.log('======================================================');

// Export as module for TypeScript compatibility
module.exports = {
  simulateAddModel,
  simulateSuccessfulValidation,
  simulateFailedValidation,
  simulateUpgradeTier
};
