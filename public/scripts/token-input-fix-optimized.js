/**
 * token-input-fix-optimized.js
 * Optimized direct DOM manipulation fix for the Hugging Face token input
 * Reduced logging and better UI integration
 */

(function() {
  // Config
  const DEBUG = false; // Set to false to disable logging
  
  // Utility function for controlled logging
  function log(message, ...args) {
    if (DEBUG) {
      console.log('[TokenFix]', message, ...args);
    }
  }
  
  // Check if the main fix is already applied
  function isMainFixApplied() {
    return !!document.getElementById('optimized-token-input');
  }
  
  // Skip execution if the main fix is already applied
  if (isMainFixApplied()) {
    log('Main fix already applied, skipping secondary fix');
    return;
  }
  
  // Run after a small delay to allow the page to load
  setTimeout(function() {
    // Final check before running
    if (!isMainFixApplied()) {
      fixTokenInput();
    }
  }, 500);
  
  // Store whether a fix has been applied
  let fixApplied = false;
  let fixedInput = null;
  
  // Find and fix the token input field
  function fixTokenInput() {
    // Skip if already fixed
    if (fixApplied || isMainFixApplied()) {
      return;
    }
    
    log('Searching for token input');
    
    // Target exactly what we saw in the screenshot
    const tokenSections = document.querySelectorAll('div[style*="background-color: rgb(240, 247, 255)"]');
    
    if (tokenSections.length === 0) {
      log('No token sections found');
      return;
    }
    
    let tokenInput = null;
    let tokenSection = null;
    
    // Find the specific token section and input
    for (const section of tokenSections) {
      if (section.textContent.includes('Hugging Face API Token')) {
        tokenSection = section;
        tokenInput = section.querySelector('input');
        log('Found token section and input');
        break;
      }
    }
    
    // If not found directly, try a more aggressive approach
    if (!tokenInput) {
      for (const section of tokenSections) {
        if (section.textContent.includes('Hugging Face')) {
          tokenSection = section;
          tokenInput = section.querySelector('input');
          log('Found token section via partial match');
          break;
        }
      }
    }
    
    // If still not found, try one more method
    if (!tokenInput && tokenSections.length > 0) {
      tokenSection = tokenSections[0];
      tokenInput = tokenSection.querySelector('input');
      log('Taking first token section as fallback');
    }
    
    // Final check if the main fix is applied
    if (isMainFixApplied()) {
      log('Main fix detected, abandoning secondary fix');
      return;
    }
    
    // If we found an input, check if it's already been fixed
    if (tokenInput && !tokenInput.hasAttribute('data-fixed-direct')) {
      log('Fixing token input');
      
      // Fix for original token input not working: create a new input
      // This is needed because the original input may be completely non-functional

      // ALWAYS create a new input field that we control
      const newInput = document.createElement('input');
      newInput.type = 'text';
      newInput.placeholder = 'Enter your Hugging Face API token';
      newInput.value = tokenInput ? tokenInput.value || '' : '';
      newInput.className = 'fixed-direct-token-input';
      newInput.style.width = '100%';
      newInput.style.padding = '12px';
      newInput.style.borderRadius = '4px';
      newInput.style.border = '1px solid #ccc';
      newInput.style.fontSize = '14px';
      newInput.style.boxSizing = 'border-box';
      newInput.style.marginBottom = '10px';
      fixedInput = newInput;
      
      // Create single event handler function for both input and change
      function handleInputChange(e) {
        const newValue = e.target.value;
        
        // Only update if value actually changed to reduce excessive updates
        if (tokenInput && tokenInput.value !== newValue) {
          // Silent update without logging
          try {
            // Use property descriptor to set value
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype, 'value'
            ).set;
            
            nativeInputValueSetter.call(tokenInput, newValue);
            
            // Dispatch input event only
            const inputEvent = new Event('input', { bubbles: true });
            tokenInput.dispatchEvent(inputEvent);
            
            // Save to session storage but only when user stops typing
            if (fixedInput.saveTimeout) {
              clearTimeout(fixedInput.saveTimeout);
            }
            
            fixedInput.saveTimeout = setTimeout(() => {
              try {
                sessionStorage.setItem('hf_token', newValue);
              } catch (err) {
                // Silent error
              }
            }, 1000);
          } catch (err) {
            // Silent error, do not log
          }
        }
      }
      
      // Add event listeners, throttled to reduce multiple firings
      let lastInputTime = 0;
      fixedInput.addEventListener('input', function(e) {
        const now = Date.now();
        // Throttle to max once per 100ms
        if (now - lastInputTime > 100) {
          lastInputTime = now;
          handleInputChange(e);
        }
      });
      
      // Only trigger on blur to minimize events
      fixedInput.addEventListener('blur', handleInputChange);
      
      // Create a container with minimal styling
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.margin = '10px 0';
      container.style.padding = '10px';
      container.style.backgroundColor = 'transparent';
      container.style.borderRadius = '4px';
      container.style.border = 'none';
      
      // Add a simple label - but make it invisible
      const label = document.createElement('div');
      label.textContent = 'Hugging Face API Token';
      label.style.fontWeight = 'bold';
      label.style.marginBottom = '8px';
      label.style.color = '#1565C0';
      label.style.display = 'none'; // Hide the label
      
      // Assemble the container with minimal extras
      container.appendChild(label);
      container.appendChild(fixedInput);
      
      // Create placeholder text to guide users
      const placeholder = document.createElement('div');
      placeholder.textContent = 'Enter your token in the field above and click "Save Token Securely"';
      placeholder.style.fontSize = '13px';
      placeholder.style.color = '#666';
      placeholder.style.marginTop = '5px';
      placeholder.style.textAlign = 'center';
      container.appendChild(placeholder);
      
      // Check again for main fix before inserting
      if (isMainFixApplied()) {
        log('Main fix detected during container creation, abandoning secondary fix');
        return;
      }
      
      // Insert the container in a good location
      if (tokenInput && tokenInput.parentNode) {
        // If we have the original input, insert before it
        tokenInput.parentNode.insertBefore(container, tokenInput);
        
        // Hide original instead of setting opacity
        tokenInput.style.display = 'none';
      } else if (tokenSection) {
        // If we have the section but not the input, find the first paragraph
        const firstParagraph = tokenSection.querySelector('p');
        if (firstParagraph && firstParagraph.nextSibling) {
          tokenSection.insertBefore(container, firstParagraph.nextSibling);
        } else {
          // Just append it to the token section
          tokenSection.appendChild(container);
        }
      }
      
      // Focus the input but with a slightly longer delay to ensure page is ready
      setTimeout(() => {
        if (!isMainFixApplied()) {
          fixedInput.focus();
        }
      }, 200);
      
      // Set global access with minimal properties
      window.fixedHuggingFaceInput = fixedInput;
      
      // Check for token in session storage
      try {
        const savedToken = sessionStorage.getItem('hf_token') || 
                          localStorage.getItem('huggingface_token') || 
                          sessionStorage.getItem('huggingface_token');
        if (savedToken && savedToken !== fixedInput.value && savedToken.length > 0) {
          fixedInput.value = savedToken;
          // Trigger input event once without logging
          handleInputChange({ target: fixedInput });
        }
      } catch (err) {
        // Silent error
      }
      
      // Mark as fixed
      fixApplied = true;
      window.fixedTokenInput = fixedInput;
      
      return true;
    } else if (tokenInput) {
      // Already fixed
      log('Token input already fixed');
      fixApplied = true;
      return true;
    }
    
    // No token input found
    log('No token input found');
    return false;
  }
})();
