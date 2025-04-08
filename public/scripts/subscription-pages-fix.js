/**
 * Subscription Pages Fix Script
 * 
 * This script provides targeted fixes for specific issues in the subscription flow.
 * It is designed with page-specific scoping to avoid unintended side effects.
 */

(function() {
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFixScript);
  } else {
    initFixScript();
  }

  // Re-run on hash change (for SPA navigation)
  window.addEventListener('hashchange', function() {
    console.log('Hash changed to:', window.location.hash);
    initFixScript();
  });

  // Main initialization function
  function initFixScript() {
    // Determine which page we're on
    if (window.location.hash.includes('/subscribe/profile')) {
      console.log('Detected Profile page - applying profile page fixes');
      fixProfilePage();
    } else if (window.location.hash.includes('/subscribe/parameters')) {
      console.log('Detected Parameters page - applying parameters page fixes');
      fixParametersPage();
    } else if (window.location.hash.includes('/subscribe')) {
      console.log('Detected subscription page - applying default subscription fixes');
      // For all other subscription pages
      fixSubscriptionPage();
    } else {
      console.log('Not on a subscription page - no fixes needed');
    }
  }

  // ========== PROFILE PAGE FIX ==========
  function fixProfilePage() {
    // Inject CSS specifically for profile page
    injectProfileCSS();
    
    // Immediate fix for DOM elements
    setTimeout(fixProfileElements, 50);
    setTimeout(fixProfileElements, 300);
    setTimeout(fixProfileElements, 1000);
    
    // Set up observer to ensure fixes are applied when DOM changes
    setupProfileObserver();
  }

  function injectProfileCSS() {
    // Clear existing style if present
    const existingStyleId = 'subscription-pages-profile-styles';
    if (document.getElementById(existingStyleId)) {
      document.getElementById(existingStyleId).remove();
    }

    // Create new style element for profile page
    const style = document.createElement('style');
    style.id = existingStyleId;
    style.innerHTML = `
      /* PROFILE PAGE SPECIFIC STYLES */
      
      /* Progress bar container */
      .subscription-progress {
        display: flex !important;
        justify-content: space-between !important;
        margin-bottom: 2rem !important;
        position: relative !important;
        z-index: 2 !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
      }
      
      /* Progress steps */
      .subscription-progress .progress-step {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        position: relative !important;
        z-index: 2 !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin-bottom: 10px !important;
      }
      
      /* Step circles */
      .subscription-progress .step-number {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin-bottom: 8px !important;
      }
      
      /* Step names */
      .subscription-progress .step-name {
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
      }
      
      /* Navigation buttons container */
      .step-actions,
      #profile-buttons-container,
      .button-container,
      .navigation-buttons {
        display: flex !important;
        justify-content: space-between !important;
        width: 100% !important;
        visibility: visible !important;
        opacity: 1 !important;
        margin-top: 30px !important;
        padding-top: 20px !important;
        position: relative !important;
        z-index: 100 !important;
      }
      
      /* Buttons */
      .step-actions button,
      #profile-buttons-container button,
      .button-container button,
      .navigation-buttons button,
      #profile-back-button,
      #profile-next-button {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 101 !important;
        min-width: 100px !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('Profile page styles injected');
  }

  function fixProfileElements() {
    if (!window.location.hash.includes('/subscribe/profile')) {
      return; // Only run on profile page
    }
    
    console.log('Fixing profile page elements directly');
    
    // Fix progress bar or create it if missing
    let progressBar = document.querySelector('.subscription-progress');
    
    if (progressBar) {
      console.log('Found progress bar, ensuring visibility and all steps');
      progressBar.style.display = 'flex';
      progressBar.style.visibility = 'visible';
      progressBar.style.opacity = '1';
      
      // Get existing steps to check if we're missing any
      const existingSteps = progressBar.querySelectorAll('.progress-step');
      const stepNames = [];
      
      existingSteps.forEach(step => {
        const nameElement = step.querySelector('.step-name');
        if (nameElement) {
          stepNames.push(nameElement.textContent.trim());
        }
      });
      
      console.log('Found steps:', stepNames.join(', '));
      
      // Check if we're missing any required steps
      const requiredSteps = ['Welcome', 'Profile', 'Interests', 'Parameters', 'Payment', 'Success'];
      const missingSteps = requiredSteps.filter(step => !stepNames.includes(step));
      
      if (missingSteps.length > 0) {
        console.log('Missing steps:', missingSteps.join(', '), '- recreating all steps');
        
        // Create all steps from scratch to ensure we have all of them
        progressBar.innerHTML = '';  // Clear existing steps
        
        // Create step elements for all required steps
        requiredSteps.forEach((stepName, index) => {
          const isCompleted = index < 1;  // Welcome completed
          const isActive = index === 1;   // Profile is active
          
          const stepDiv = document.createElement('div');
          stepDiv.className = `progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
          stepDiv.style.display = 'flex';
          stepDiv.style.flexDirection = 'column';
          stepDiv.style.alignItems = 'center';
          stepDiv.style.visibility = 'visible';
          stepDiv.style.opacity = '1';
          stepDiv.style.position = 'relative';
          stepDiv.style.zIndex = '2';
          stepDiv.style.flex = '1';
          stepDiv.style.minWidth = '80px';
          stepDiv.style.marginBottom = '10px';
          
          // Number circle
          const numberDiv = document.createElement('div');
          numberDiv.className = 'step-number';
          numberDiv.style.width = '32px';
          numberDiv.style.height = '32px';
          numberDiv.style.borderRadius = '50%';
          numberDiv.style.display = 'flex';
          numberDiv.style.alignItems = 'center';
          numberDiv.style.justifyContent = 'center';
          numberDiv.style.marginBottom = '0.5rem';
          numberDiv.style.fontWeight = '600';
          numberDiv.style.border = '2px solid #fff';
          numberDiv.style.visibility = 'visible';
          numberDiv.style.opacity = '1';
          
          if (isActive) {
            numberDiv.style.backgroundColor = '#4285f4';
            numberDiv.style.color = 'white';
          } else if (isCompleted) {
            numberDiv.style.backgroundColor = '#34a853';
            numberDiv.style.color = 'white';
            
            // Use checkmark for completed steps
            numberDiv.innerHTML = '✓';
          } else {
            numberDiv.style.backgroundColor = '#e0e0e0';
            numberDiv.style.color = '#757575';
            numberDiv.textContent = (index + 1).toString();
          }
          
          // Step name
          const nameDiv = document.createElement('div');
          nameDiv.className = 'step-name';
          nameDiv.textContent = stepName;
          nameDiv.style.fontSize = '0.85rem';
          nameDiv.style.color = isActive ? '#4285f4' : (isCompleted ? '#34a853' : '#757575');
          nameDiv.style.textAlign = 'center';
          nameDiv.style.visibility = 'visible';
          nameDiv.style.opacity = '1';
          nameDiv.style.display = 'block';
          nameDiv.style.fontWeight = isActive ? '600' : 'normal';
          
          // Add to step div
          stepDiv.appendChild(numberDiv);
          stepDiv.appendChild(nameDiv);
          
          // Add to progress bar
          progressBar.appendChild(stepDiv);
        });
      } else {
        // Fix each existing step
        existingSteps.forEach(step => {
          step.style.display = 'flex';
          step.style.visibility = 'visible';
          step.style.opacity = '1';
          
          // Number circle
          const number = step.querySelector('.step-number');
          if (number) {
            number.style.display = 'flex';
            number.style.visibility = 'visible';
            number.style.opacity = '1';
          }
          
          // Step name
          const name = step.querySelector('.step-name');
          if (name) {
            name.style.display = 'block';
            name.style.visibility = 'visible';
            name.style.opacity = '1';
          }
        });
      }
    } else {
      // No progress bar found, create one from scratch
      console.log('No progress bar found, creating one');
      
      // Find a good container to insert the progress bar
      const container = document.querySelector('.subscription-step') || 
                       document.querySelector('.subscription-flow-container') || 
                       document.querySelector('.subscription-content');
      
      if (container) {
        // Create progress bar element
        progressBar = document.createElement('div');
        progressBar.className = 'subscription-progress';
        progressBar.style.display = 'flex';
        progressBar.style.justifyContent = 'space-between';
        progressBar.style.marginBottom = '2rem';
        progressBar.style.position = 'relative';
        progressBar.style.zIndex = '2';
        progressBar.style.width = '100%';
        progressBar.style.visibility = 'visible';
        progressBar.style.opacity = '1';
        
        // Add progress line
        const progressLine = document.createElement('div');
        progressLine.style.position = 'absolute';
        progressLine.style.top = '16px';
        progressLine.style.left = '0';
        progressLine.style.right = '0';
        progressLine.style.height = '2px';
        progressLine.style.backgroundColor = '#e0e0e0';
        progressLine.style.zIndex = '1';
        
        progressBar.appendChild(progressLine);
        
        // Step names and their states
        const steps = [
          { name: 'Welcome', completed: true, active: false },
          { name: 'Profile', completed: false, active: true },
          { name: 'Interests', completed: false, active: false },
          { name: 'Parameters', completed: false, active: false },
          { name: 'Payment', completed: false, active: false },
          { name: 'Success', completed: false, active: false }
        ];
        
        // Create each step
        steps.forEach((step, index) => {
          const stepDiv = document.createElement('div');
          stepDiv.className = `progress-step ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`;
          stepDiv.style.display = 'flex';
          stepDiv.style.flexDirection = 'column';
          stepDiv.style.alignItems = 'center';
          stepDiv.style.position = 'relative';
          stepDiv.style.zIndex = '2';
          stepDiv.style.flex = '1';
          stepDiv.style.minWidth = '80px';
          stepDiv.style.marginBottom = '10px';
          stepDiv.style.visibility = 'visible';
          stepDiv.style.opacity = '1';
          
          // Number circle
          const numberDiv = document.createElement('div');
          numberDiv.className = 'step-number';
          numberDiv.style.width = '32px';
          numberDiv.style.height = '32px';
          numberDiv.style.borderRadius = '50%';
          numberDiv.style.display = 'flex';
          numberDiv.style.alignItems = 'center';
          numberDiv.style.justifyContent = 'center';
          numberDiv.style.marginBottom = '0.5rem';
          numberDiv.style.fontWeight = '600';
          numberDiv.style.border = '2px solid #fff';
          numberDiv.style.visibility = 'visible';
          numberDiv.style.opacity = '1';
          
          if (step.active) {
            numberDiv.style.backgroundColor = '#4285f4';
            numberDiv.style.color = 'white';
            numberDiv.textContent = (index + 1).toString();
          } else if (step.completed) {
            numberDiv.style.backgroundColor = '#34a853';
            numberDiv.style.color = 'white';
            numberDiv.innerHTML = '✓';
          } else {
            numberDiv.style.backgroundColor = '#e0e0e0';
            numberDiv.style.color = '#757575';
            numberDiv.textContent = (index + 1).toString();
          }
          
          // Step name
          const nameDiv = document.createElement('div');
          nameDiv.className = 'step-name';
          nameDiv.textContent = step.name;
          nameDiv.style.fontSize = '0.85rem';
          nameDiv.style.color = step.active ? '#4285f4' : (step.completed ? '#34a853' : '#757575');
          nameDiv.style.textAlign = 'center';
          nameDiv.style.visibility = 'visible';
          nameDiv.style.opacity = '1';
          nameDiv.style.display = 'block';
          nameDiv.style.fontWeight = step.active ? '600' : 'normal';
          
          // Add to step div
          stepDiv.appendChild(numberDiv);
          stepDiv.appendChild(nameDiv);
          
          // Add to progress bar
          progressBar.appendChild(stepDiv);
        });
        
        // Insert progress bar at top of container
        container.insertBefore(progressBar, container.firstChild);
        console.log('Created new progress bar with all steps');
      } else {
        console.error('Could not find appropriate container for progress bar');
      }
    }
    
    // Find and fix buttons container
    const buttonContainers = document.querySelectorAll('.step-actions, #profile-buttons-container, .button-container, .navigation-buttons');
    buttonContainers.forEach(container => {
      console.log('Found button container, ensuring visibility');
      container.style.display = 'flex';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
      container.style.zIndex = '100';
      
      // Fix buttons inside container
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        button.style.display = 'inline-block';
        button.style.visibility = 'visible';
        button.style.opacity = '1';
        button.style.zIndex = '101';
      });
    });
    
    // If no button container exists yet, check again soon
    if (buttonContainers.length === 0) {
      setTimeout(fixProfileElements, 200);
    }
  }

  function setupProfileObserver() {
    if (!window.location.hash.includes('/subscribe/profile')) {
      return; // Only run on profile page
    }
    
    // Create mutation observer to detect when elements are added
    const observer = new MutationObserver(function(mutations) {
      let shouldFix = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if important elements were added
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) { // Only process Element nodes
              if (node.classList && 
                 (node.classList.contains('subscription-form') ||
                  node.classList.contains('step-actions') ||
                  node.classList.contains('subscription-progress'))) {
                shouldFix = true;
                break;
              }
            }
          }
        }
      }
      
      if (shouldFix) {
        console.log('Detected new elements in profile page, applying fixes');
        fixProfileElements();
      }
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Disconnect after 10 seconds to avoid unnecessary processing
    setTimeout(() => {
      observer.disconnect();
      console.log('Profile page observer disconnected after timeout');
    }, 10000);
  }
  
  // ========== PARAMETERS PAGE FIX ==========
  function fixParametersPage() {
    // We'll keep this simple for parameters page
    injectParametersCSS();
  }
  
  function injectParametersCSS() {
    // Clear existing style if present
    const existingStyleId = 'subscription-pages-parameters-styles';
    if (document.getElementById(existingStyleId)) {
      document.getElementById(existingStyleId).remove();
    }

    // Create new style for parameters page
    const style = document.createElement('style');
    style.id = existingStyleId;
    style.innerHTML = `
      /* PARAMETERS PAGE SPECIFIC STYLES */
      
      /* Navigation buttons container - only in parameters page */
      .subscription-step .step-actions,
      .subscription-step .button-container,
      .subscription-step .navigation-buttons {
        display: flex !important;
        justify-content: space-between !important;
        gap: 20px !important;
        margin-top: 30px !important;
        padding-top: 20px !important;
        border-top: 1px solid #e0e0e0 !important;
        width: 100% !important;
      }
      
      /* Parameters page button styles */
      .subscription-step .secondary-button, 
      .subscription-step .primary-button {
        display: inline-block !important;
        min-width: 150px !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('Parameters page styles injected');
  }
  
  // ========== DEFAULT SUBSCRIPTION PAGE FIX ==========
  function fixSubscriptionPage() {
    // Light fixes for all other subscription pages
    injectSubscriptionCSS();
  }
  
  function injectSubscriptionCSS() {
    // Clear existing style if present
    const existingStyleId = 'subscription-pages-common-styles';
    if (document.getElementById(existingStyleId)) {
      document.getElementById(existingStyleId).remove();
    }

    // Create new style for all subscription pages
    const style = document.createElement('style');
    style.id = existingStyleId;
    style.innerHTML = `
      /* COMMON SUBSCRIPTION PAGE STYLES */
      
      /* Basic button visibility */
      .step-actions button,
      .button-container button,
      .navigation-buttons button {
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      /* Price display in welcome page */
      .subscription-badge, 
      [style*="backgroundColor: #F0F7FF"],
      [style*="backgroundColor: #EDE7F6"] {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('Common subscription page styles injected');
  }
})();