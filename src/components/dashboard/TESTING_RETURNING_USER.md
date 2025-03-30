# Testing the Returning User Dashboard

This document provides instructions for testing the returning user dashboard with mock data.

## Setup

1. Run the development server:
   ```
   npm start
   ```

2. Use the browser console to simulate a returning user:
   ```javascript
   window.simulateReturningUser()
   ```

3. Refresh the page - you should see the returning user dashboard

## Key Features to Test

### 1. Configuration Management
- Expand a configuration by clicking on the chevron icon
- Verify that configuration details display correctly
- Test the action buttons (Edit, Duplicate, Export)

### 2. Configuration Validation
- Click "Test & Validate" button on a configuration
- Wait for the validation process (should show a loading indicator)
- Verify the validation results display
- For invalid configurations, check that the "Fix Issues" button is visible
- For valid configurations, check that the "Use Configuration" button is visible

### 3. User Feedback
- Click the "Give Feedback" button on a configuration
- Test the star rating system
- Add a comment and submit feedback
- Verify feedback submission (will show an alert in the mock)

### 4. View Toggle
- Toggle between "Minimal View" and "Full Dashboard" 
- Verify that additional marketing sections appear in Full Dashboard mode

###, 5 Model Listings
- Check that model cards display correctly
- Verify that Free/Paid indicators are visible
- Click on "View version history" to check the expandable version info
- Test the "Add to Configuration" button

### 6. Tier Management
- Use the console to change tiers:
  ```javascript
  window.simulateUpgradeTier("Complete")
  ```
- Refresh the page and verify that the upgrade card is hidden for Complete tier
- Change to a lower tier and verify the upgrade card appears

## Test Utility Functions

For simulating specific interactions during testing:

```javascript
// Simulate adding a model to a configuration
window.simulateAddModel(1, 1)

// Simulate successful validation
window.simulateSuccessfulValidation(1)

// Simulate failed validation
window.simulateFailedValidation(3)

// Simulate tier changes
window.simulateUpgradeTier("Basic")
window.simulateUpgradeTier("Standard")
window.simulateUpgradeTier("Complete")
```

## Reverting to New User Dashboard

To switch back to the new user dashboard:

```javascript
window.simulateNewUser()
```

Then refresh the page.

## What to Look For

During testing, pay special attention to:

1. **Visual consistency** - Verify fonts, colors, spacing are consistent
2. **Responsive behavior** - Test on different screen sizes
3. **Interactive elements** - Ensure all buttons and toggles work as expected
4. **User flow** - Ensure the experience is intuitive for returning users
5. **Error handling** - Check how validation errors are displayed

## Reporting Issues

Document any issues with:
- Screenshots
- Steps to reproduce
- Expected vs. actual behavior
