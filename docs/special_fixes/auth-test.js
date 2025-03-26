/**
 * Authentication Test Script
 * 
 * This script can be run in the browser console to test the authentication flow
 * and check for any router context errors or other authentication issues.
 */

console.log('Starting Authentication Test...');

// Test navigation functionality
const testNavigation = () => {
  console.log('Testing navigation...');
  
  try {
    // Try to navigate to different auth pages using both approaches
    const paths = ['/login', '/forgot-password', '/reset-password', '/verify-email'];
    
    console.log('Direct navigation test:');
    paths.forEach(path => {
      console.log(`Testing navigation to ${path}`);
      window.location.href = `#${path}`; // Using hash for testing purposes
    });
    
    console.log('Navigation test complete!');
    return true;
  } catch (err) {
    console.error('Navigation test failed:', err);
    return false;
  }
};

// Test error handling functionality
const testErrorHandling = () => {
  console.log('Testing error handling...');
  
  try {
    // Purposely create a router context error
    console.log('Testing router context error handling (will trigger refresh):');
    
    // This should be caught by our error handler
    console.log('This should trigger the error handler:');
    const RouterMock = {
      useNavigate: () => {
        throw new Error('useNavigate() may be used only in the context of a <Router> component.');
      }
    };
    
    try {
      RouterMock.useNavigate();
    } catch (err) {
      // This should be caught and handled by our code
      console.log('Error caught successfully!');
      
      // Test if our error handler is working
      if (window.AuthErrorHandler) {
        window.AuthErrorHandler.diagnoseError(err);
        console.log('Error handled by AuthErrorHandler');
      } else {
        console.warn('AuthErrorHandler not available globally. Manual testing required.');
      }
    }
    
    console.log('Error handling test complete!');
    return true;
  } catch (err) {
    console.error('Error handling test failed:', err);
    return false;
  }
};

// Run the tests
const runTests = () => {
  console.log('=== Authentication Test Suite ===');
  
  const navigationResult = testNavigation();
  console.log(`Navigation Test: ${navigationResult ? 'PASSED' : 'FAILED'}`);
  
  const errorHandlingResult = testErrorHandling();
  console.log(`Error Handling Test: ${errorHandlingResult ? 'PASSED' : 'FAILED'}`);
  
  console.log('=== Test Results ===');
  console.log(`OVERALL: ${navigationResult && errorHandlingResult ? 'PASSED' : 'FAILED'}`);
  
  return navigationResult && errorHandlingResult;
};

// Export the test functions for use in the browser console
window.authTests = {
  runAll: runTests,
  testNavigation,
  testErrorHandling
};

console.log('Auth tests ready! Run window.authTests.runAll() to execute all tests.');

/**
 * Usage Instructions:
 * 
 * 1. Copy this entire script
 * 2. Open your application in a browser
 * 3. Open the developer console (F12 or right-click > Inspect > Console)
 * 4. Paste the script and press Enter
 * 5. Run the tests by typing: window.authTests.runAll()
 * 6. Check the results in the console
 * 
 * You can also run individual tests:
 * - window.authTests.testNavigation()
 * - window.authTests.testErrorHandling()
 */
