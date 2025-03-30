/**
 * Script to test the returning user flow
 * Run this in the browser console to simulate a returning user
 */

// Simulate a user that has configurations
const simulateReturningUser = () => {
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify({
    id: 'user-123',
    name: 'Test User',
    tier: 'Standard',
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }));
  
  // Set the hasConfigurations flag to true
  localStorage.setItem('hasConfigurations', 'true');
  
  // Also store in sessionStorage for the SmartDashboard component
  sessionStorage.setItem('userType', 'returning');
  
  console.log('✅ Simulated returning user data set in localStorage');
  console.log('Refresh the page to see the returning user dashboard');
};

// Simulate a new user by clearing the data
const simulateNewUser = () => {
  // Remove user data from localStorage  
  localStorage.removeItem('user');
  localStorage.removeItem('hasConfigurations');
  
  // Also clear sessionStorage
  sessionStorage.removeItem('userType');
  
  console.log('✅ User data cleared from localStorage');
  console.log('Refresh the page to see the new user dashboard');
};

// Export the functions so they can be used from the console
window.simulateReturningUser = simulateReturningUser;
window.simulateNewUser = simulateNewUser;

// Output instructions
console.log('To simulate a returning user, run: window.simulateReturningUser()');
console.log('To simulate a new user, run: window.simulateNewUser()');

// Export as module for TypeScript compatibility
module.exports = {
  simulateReturningUser,
  simulateNewUser
};
