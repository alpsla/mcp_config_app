/**
 * Complete Subscription Flow Progress Bar Fix
 * 
 * This script fixes the progress bar on all subscription flow pages
 * to ensure all steps are displayed correctly.
 */

(function() {
  // Prevent too many retries
  let retryCount = 0;
  const MAX_RETRIES = 10;
  
  // Special handling for the Interests page
  function fixInterestsPage() {
    if (!window.location.hash.includes('/subscribe/interests')) {
      return;
    }
    
    console.log('Interests page detected, applying specific fix');
    
    // Look for the main content container
    const contentContainer = document.querySelector(
      'div[style*="background-color: rgb(245, 240, 255)"], ' + // Purple background
      'div[style*="background-color: rgb(242, 230, 255)"]' // Alternative purple shade
    );
    
    if (!contentContainer) {
      console.log('Interests page container not found, will retry');
      setTimeout(fixInterestsPage, 500);
      return;
    }
    
    // Check if there's already a progress bar
    const existingProgressBar = document.querySelector(
      'div[style*="display: flex"][style*="justify-content: center"][style*="margin-bottom: 30px"]'
    );
    
    if (existingProgressBar) {
      console.log('Progress bar already exists on Interests page');
      return;
    }
    
    console.log('Creating progress bar for Interests page');
    
    // Create progress bar container
    const progressBarContainer = document.createElement('div');
    progressBarContainer.setAttribute('style', 'display: flex; justify-content: center; margin-bottom: 30px;');
    
    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.setAttribute('style', 'display: flex; align-items: center;');
    
    // Define all steps
    const allSteps = [
      { name: 'Welcome', index: 0 },
      { name: 'Profile', index: 1 },
      { name: 'Interests', index: 2 },
      { name: 'Parameters', index: 3 },
      { name: 'Payment', index: 4 },
      { name: 'Success', index: 5 }
    ];
    
    // Create step elements - Interests page is step 2
    allSteps.forEach((step, index) => {
      const isCompleted = index < 2;
      const isActive = index === 2;
      
      // Create number circle
      const circleDiv = document.createElement('div');
      let circleStyle = 'width: 30px; height: 30px; border-radius: 50%; ';
      
      if (isCompleted) {
        circleStyle += 'background-color: rgb(52, 168, 83); color: white; ';
      } else if (isActive) {
        circleStyle += 'background-color: rgb(66, 133, 244); color: white; ';
      } else {
        circleStyle += 'background-color: rgb(224, 224, 224); color: rgb(102, 102, 102); ';
      }
      
      circleStyle += 'display: flex; align-items: center; justify-content: center; ' +
                   'font-size: 14px; font-weight: bold; margin-right: 10px;';
      
      circleDiv.setAttribute('style', circleStyle);
      
      if (isCompleted) {
        circleDiv.innerHTML = '&#x2713;'; // Checkmark
      } else {
        circleDiv.textContent = (index + 1).toString();
      }
      
      // Create label
      const labelDiv = document.createElement('div');
      let labelStyle = 'font-size: 14px; ';
      
      if (isActive) {
        labelStyle += 'color: rgb(51, 51, 51); font-weight: bold; ';
      } else if (isCompleted) {
        labelStyle += 'color: rgb(52, 168, 83); ';
      } else {
        labelStyle += 'color: rgb(102, 102, 102); ';
      }
      
      // Not the last item
      if (index < allSteps.length - 1) {
        labelStyle += 'margin-right: 20px;';
      }
      
      labelDiv.setAttribute('style', labelStyle);
      labelDiv.textContent = step.name;
      
      // Add to container
      stepsContainer.appendChild(circleDiv);
      stepsContainer.appendChild(labelDiv);
    });
    
    // Add steps container to progress bar container
    progressBarContainer.appendChild(stepsContainer);
    
    // Get the title heading to insert before
    const titleHeading = contentContainer.querySelector('h2, h3, div[style*="font-size: 24px"]');
    
    if (titleHeading && titleHeading.parentNode) {
      // Insert before the title
      titleHeading.parentNode.insertBefore(progressBarContainer, titleHeading);
      console.log('Progress bar added to Interests page');
    } else {
      // Insert at the beginning of the content container
      contentContainer.insertBefore(progressBarContainer, contentContainer.firstChild);
      console.log('Progress bar added to beginning of Interests page container');
    }
  }

  // Function to find and fix the progress bar
  function fixSubscriptionProgressBar() {
    if (retryCount >= MAX_RETRIES) {
      console.log('Max retries reached, stopping progress bar fix attempts');
      return;
    }
    
    retryCount++;
    
    // Only run on subscription flow pages
    if (!window.location.hash.includes('/subscribe/')) {
      return;
    }

    // Special handling for Interests page
    if (window.location.hash.includes('/subscribe/interests')) {
      fixInterestsPage();
      return;
    }
    
    console.log('Looking for progress bar, attempt ' + retryCount);
    
    // Find the progress bar container by its distinctive style
    const progressBarContainer = document.querySelector(
      'div[style*="display: flex"][style*="justify-content: center"][style*="margin-bottom: 30px"]'
    );
    
    if (!progressBarContainer) {
      console.log('Progress bar container not found, will try again');
      if (retryCount < MAX_RETRIES) {
        setTimeout(fixSubscriptionProgressBar, 300);
      }
      return;
    }
    
    // Find the steps container
    const stepsContainer = progressBarContainer.querySelector(
      'div[style*="display: flex"][style*="align-items: center"]'
    );
    
    if (!stepsContainer) {
      console.log('Steps container not found, will try again');
      if (retryCount < MAX_RETRIES) {
        setTimeout(fixSubscriptionProgressBar, 300);
      }
      return;
    }
    
    console.log('Found progress bar, checking for missing steps');
    
    // Check if we're missing the Interests and Parameters steps
    const stepLabels = [];
    const labelElements = stepsContainer.querySelectorAll('div[style*="color: rgb"][style*="font-size: 14px"]');
    
    for (let i = 0; i < labelElements.length; i++) {
      if (i % 2 === 1) { // Every other element is a label
        stepLabels.push(labelElements[i].textContent.trim());
      }
    }
    
    console.log('Current steps:', stepLabels.join(', '));
    
    // Check if we need to fix the steps
    if (stepLabels.length === 6 && stepLabels.includes('Interests') && stepLabels.includes('Parameters')) {
      console.log('All steps are present, no fix needed');
      return;
    }
    
    // Determine which page we're on
    const currentPath = window.location.hash;
    let currentStep = 0;
    
    if (currentPath.includes('/profile')) {
      currentStep = 1;
    } else if (currentPath.includes('/interests')) {
      currentStep = 2;
    } else if (currentPath.includes('/parameters')) {
      currentStep = 3;
    } else if (currentPath.includes('/payment')) {
      currentStep = 4;
    } else if (currentPath.includes('/success')) {
      currentStep = 5;
    }
    
    console.log('Current step index:', currentStep);
    
    // Create a new steps container
    const newStepsContainer = document.createElement('div');
    newStepsContainer.setAttribute('style', 'display: flex; align-items: center;');
    
    // Define all steps
    const allSteps = [
      { name: 'Welcome', index: 0 },
      { name: 'Profile', index: 1 },
      { name: 'Interests', index: 2 },
      { name: 'Parameters', index: 3 },
      { name: 'Payment', index: 4 },
      { name: 'Success', index: 5 }
    ];
    
    // Create each step element
    allSteps.forEach((step, index) => {
      // Determine step state
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;
      
      // Create number circle
      const circleDiv = document.createElement('div');
      let circleStyle = 'width: 30px; height: 30px; border-radius: 50%; ';
      
      if (isCompleted) {
        circleStyle += 'background-color: rgb(52, 168, 83); color: white; ';
      } else if (isActive) {
        circleStyle += 'background-color: rgb(66, 133, 244); color: white; ';
      } else {
        circleStyle += 'background-color: rgb(224, 224, 224); color: rgb(102, 102, 102); ';
      }
      
      circleStyle += 'display: flex; align-items: center; justify-content: center; ' +
                   'font-size: 14px; font-weight: bold; margin-right: 10px;';
      
      circleDiv.setAttribute('style', circleStyle);
      
      if (isCompleted) {
        circleDiv.innerHTML = '&#x2713;'; // Checkmark
      } else {
        circleDiv.textContent = (index + 1).toString();
      }
      
      // Create label
      const labelDiv = document.createElement('div');
      let labelStyle = 'font-size: 14px; ';
      
      if (isActive) {
        labelStyle += 'color: rgb(51, 51, 51); font-weight: bold; ';
      } else if (isCompleted) {
        labelStyle += 'color: rgb(52, 168, 83); ';
      } else {
        labelStyle += 'color: rgb(102, 102, 102); ';
      }
      
      // Not the last item
      if (index < allSteps.length - 1) {
        labelStyle += 'margin-right: 20px;';
      }
      
      labelDiv.setAttribute('style', labelStyle);
      labelDiv.textContent = step.name;
      
      // Add to container
      newStepsContainer.appendChild(circleDiv);
      newStepsContainer.appendChild(labelDiv);
    });
    
    // Replace the old steps container
    stepsContainer.parentNode.replaceChild(newStepsContainer, stepsContainer);
    
    console.log('Progress bar fixed with all steps');
  }
  
  // Run on hash change - handles navigation between subscription pages
  window.addEventListener('hashchange', function() {
    if (window.location.hash.includes('/subscribe/')) {
      console.log('Navigation within subscription flow detected');
      retryCount = 0; // Reset retry count on navigation
      setTimeout(fixSubscriptionProgressBar, 300);
    }
  });
  
  // Run initially if we're on a subscription page
  if (window.location.hash.includes('/subscribe/')) {
    setTimeout(fixSubscriptionProgressBar, 500);
    // Try the interests page fix specifically
    if (window.location.hash.includes('/subscribe/interests')) {
      setTimeout(fixInterestsPage, 600);
    }
  }
})();
