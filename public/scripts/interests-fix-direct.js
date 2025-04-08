/**
 * Direct fix for the Interests page progress bar
 * Specifically targets the known page structure
 */

(function() {
  console.log('Direct Interests page fix loaded');
  
  // Function to add progress bar
  function addProgressBar() {
    // Only run on the interests page
    if (!window.location.hash.includes('/subscribe/interests')) {
      return;
    }
    
    console.log('On Interests page, looking for header element...');
    
    // Find the specific header element with the magnifying glass icon
    const headerElement = document.querySelector(
      'div[style*="display: flex"][style*="flex-direction: column"][style*="align-items: center"][style*="text-align: center"]'
    );
    
    if (!headerElement) {
      console.log('Header element not found, will retry');
      setTimeout(addProgressBar, 500);
      return;
    }
    
    // Check if we already added the progress bar
    if (document.getElementById('interests-progress-bar')) {
      console.log('Progress bar already exists');
      return;
    }
    
    console.log('Found header element, adding progress bar before it');
    
    // Create progress bar container
    const progressBarContainer = document.createElement('div');
    progressBarContainer.id = 'interests-progress-bar';
    progressBarContainer.setAttribute('style', 
      'display: flex; justify-content: center; margin-bottom: 30px; width: 100%;'
    );
    
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
    
    // Create each step
    allSteps.forEach((step, index) => {
      const isCompleted = index < 2; // Welcome and Profile are completed
      const isActive = index === 2;  // Interests is active
      
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
      
      // Add to steps container
      stepsContainer.appendChild(circleDiv);
      stepsContainer.appendChild(labelDiv);
    });
    
    // Add steps to progress bar container
    progressBarContainer.appendChild(stepsContainer);
    
    // Insert before the header element
    const parent = headerElement.parentNode;
    if (parent) {
      parent.insertBefore(progressBarContainer, headerElement);
      console.log('Progress bar added before header element');
    } else {
      console.log('Could not find parent node for header element');
    }
  }
  
  // Run on hash change
  window.addEventListener('hashchange', function() {
    if (window.location.hash.includes('/subscribe/interests')) {
      // Remove any existing progress bar
      const existingBar = document.getElementById('interests-progress-bar');
      if (existingBar) {
        existingBar.remove();
      }
      
      // Try to add the progress bar with multiple attempts
      setTimeout(addProgressBar, 300);
      setTimeout(addProgressBar, 800);
      setTimeout(addProgressBar, 1500);
    }
  });
  
  // Run initially if already on interests page
  if (window.location.hash.includes('/subscribe/interests')) {
    // Try several times with increasing delays
    setTimeout(addProgressBar, 300);
    setTimeout(addProgressBar, 800);
    setTimeout(addProgressBar, 1500);
    setTimeout(addProgressBar, 2500);
  }
})();
