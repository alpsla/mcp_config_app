/**
 * This script specifically targets the PresetSaver component to ensure
 * the save button appears inline with the input field.
 * 
 * To use: Add this script directly to the page or call it from your main code.
 */

// This function forces the preset save button to appear inline
function fixPresetSaver() {
  // Step 1: Find the preset container
  const presetContainers = Array.from(document.querySelectorAll('div')).filter(div => {
    return div.textContent && 
           (div.textContent.includes('Save Parameters as Preset') || 
            div.textContent.includes('Save as Preset') ||
            div.textContent.includes('Enable preset saving'));
  });
  
  if (!presetContainers.length) {
    console.log('No preset container found, retrying later...');
    return false;
  }
  
  const presetContainer = presetContainers[0];
  console.log('Found preset container:', presetContainer);
  
  // Step 2: Find the input field and save button
  const inputField = presetContainer.querySelector('input[type="text"]');
  const saveButton = presetContainer.querySelector('button');
  
  if (!inputField || !saveButton) {
    console.log('Input or button not found, retrying later...');
    return false;
  }
  
  // Step 3: Get their parent elements
  const inputParent = inputField.parentElement;
  const buttonParent = saveButton.parentElement;
  
  if (!inputParent || !buttonParent) {
    console.log('Parent elements not found, retrying later...');
    return false;
  }
  
  // Step 4: Check if they're in the same parent container
  if (inputParent === buttonParent) {
    // They're already in the same container, just make sure it's styled correctly
    inputParent.style.display = 'flex';
    inputParent.style.alignItems = 'center';
    inputParent.style.gap = '10px';
    
    // Style the input and button
    inputField.style.flex = '1';
    saveButton.style.flexShrink = '0';
  } else {
    // They're in different containers, we need to restructure
    
    // Find a common parent container
    const formContainer = presetContainer.querySelector('form') || 
                          inputParent.parentElement || 
                          presetContainer;
    
    if (formContainer) {
      // Style the form container
      formContainer.style.display = 'flex';
      formContainer.style.flexDirection = 'row';
      formContainer.style.alignItems = 'center';
      formContainer.style.gap = '10px';
      formContainer.style.width = '100%';
      formContainer.style.marginTop = '15px';
      
      // Create a wrapper for the input if needed
      if (inputParent === formContainer) {
        const inputWrapper = document.createElement('div');
        inputWrapper.style.flex = '1';
        inputWrapper.style.maxWidth = '70%';
        
        // Replace input with wrapper + input
        inputField.parentNode.insertBefore(inputWrapper, inputField);
        inputWrapper.appendChild(inputField);
      } else {
        // Style existing input wrapper
        inputParent.style.flex = '1';
        inputParent.style.maxWidth = '70%';
      }
      
      // Create a wrapper for the button if needed
      if (buttonParent === formContainer) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.marginLeft = '10px';
        
        // Replace button with wrapper + button
        saveButton.parentNode.insertBefore(buttonWrapper, saveButton);
        buttonWrapper.appendChild(saveButton);
      } else {
        // Style existing button wrapper
        buttonParent.style.marginLeft = '10px';
      }
      
      // Make sure button is not positioned absolutely
      saveButton.style.position = 'static';
      buttonParent.style.position = 'static';
    }
  }
  
  // Step 5: Style the input field and save button
  inputField.style.width = '100%';
  inputField.style.padding = '10px 12px';
  inputField.style.border = '1px solid #ccc';
  inputField.style.borderRadius = '4px';
  inputField.style.fontSize = '14px';
  
  saveButton.style.padding = '10px 16px';
  saveButton.style.backgroundColor = '#1976d2';
  saveButton.style.color = 'white';
  saveButton.style.border = 'none';
  saveButton.style.borderRadius = '4px';
  saveButton.style.fontSize = '14px';
  saveButton.style.fontWeight = '500';
  saveButton.style.cursor = 'pointer';
  saveButton.style.height = '38px';
  saveButton.style.position = 'static'; // Ensure it's not positioned absolutely
  
  console.log('Successfully fixed preset saver layout');
  return true;
}

// Run the fix immediately and again after a delay
(function() {
  // Try to fix immediately
  let success = fixPresetSaver();
  
  // Retry a few times with delays
  if (!success) {
    const delays = [100, 300, 500, 1000, 2000]; // Increasing delays
    
    delays.forEach((delay, index) => {
      setTimeout(() => {
        console.log(`Attempt ${index + 1} to fix preset saver layout...`);
        success = fixPresetSaver();
      }, delay);
    });
  }
  
  // Set up a mutation observer to detect DOM changes
  const observer = new MutationObserver((mutations) => {
    // Check if any mutations involve the preset container
    const relevantMutation = mutations.some(mutation => {
      // Check added nodes
      return Array.from(mutation.addedNodes).some(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          return element.textContent && (
            element.textContent.includes('Preset') || 
            element.textContent.includes('Save')
          );
        }
        return false;
      });
    });
    
    if (relevantMutation) {
      console.log('Detected changes to preset container, reapplying fix...');
      fixPresetSaver();
    }
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();