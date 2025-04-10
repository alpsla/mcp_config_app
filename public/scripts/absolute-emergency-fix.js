/**
 * absolute-emergency-fix.js
 * Optimized fix for the token input that doesn't interfere with progress bar
 */

(function() {
  // Config - minimal logging to avoid console spam
  const DEBUG = false;
  
  function log(message) {
    if (DEBUG) console.log('[TokenFix]', message);
  }
  
  // Run immediately and once more after a delay
  setTimeout(fixTokenSection, 500);
  setTimeout(fixTokenSection, 1500); // Try again to catch late renders
  
  // Check if on parameters page before doing anything
  function isParametersPage() {
    return window.location.href.indexOf('/subscribe/parameters') !== -1;
  }
  
  // Main fix function
  function fixTokenSection() {
    // Only run on parameters page
    if (!isParametersPage()) {
      return;
    }
    
    log('Looking for token section');
    
    // Already fixed?
    if (document.querySelector('#fixed-token-input')) {
      return;
    }
    
    // Find the token section
    const sections = document.querySelectorAll('div');
    let tokenSection = null;
    
    for (const section of sections) {
      if (section.textContent && section.textContent.includes('Hugging Face API Token')) {
        tokenSection = section;
        break;
      }
    }
    
    if (!tokenSection) {
      log('Token section not found');
      return;
    }
    
    log('Found token section');
    
    // Find existing token input (if any)
    const existingInput = tokenSection.querySelector('input[placeholder*="API token"]') || 
                         tokenSection.querySelector('input[placeholder*="Face"]');
    
    if (existingInput) {
      // Fix existing input
      existingInput.disabled = false;
      existingInput.readOnly = false;
      existingInput.style.pointerEvents = 'auto';
      existingInput.style.opacity = '1';
      existingInput.style.visibility = 'visible';
      existingInput.id = 'fixed-token-input';
      
      log('Fixed existing token input');
    } else {
      // Create new input
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'fixed-token-input';
      input.placeholder = 'Enter your Hugging Face API token';
      input.style.width = '100%';
      input.style.padding = '12px';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '4px';
      input.style.fontSize = '14px';
      input.style.marginTop = '10px';
      input.style.marginBottom = '10px';
      
      // Find a good place to insert it
      const tokenInfo = tokenSection.querySelector('p');
      if (tokenInfo && tokenInfo.textContent.includes('need a Hugging Face API token')) {
        tokenInfo.parentNode.insertBefore(input, tokenInfo.nextSibling);
      } else {
        // Look for section with "To get a token"
        const elements = tokenSection.querySelectorAll('*');
        let insertPoint = null;
        
        for (const el of elements) {
          if (el.textContent && el.textContent.includes('To get a token')) {
            insertPoint = el;
            break;
          }
        }
        
        if (insertPoint) {
          insertPoint.parentNode.insertBefore(input, insertPoint);
        } else {
          // Last resort - add at the top
          const firstChild = tokenSection.firstChild;
          if (firstChild) {
            tokenSection.insertBefore(input, firstChild.nextSibling);
          } else {
            tokenSection.appendChild(input);
          }
        }
      }
      
      // Try to find save button
      const saveButtons = tokenSection.querySelectorAll('button');
      let saveButton = null;
      
      for (const btn of saveButtons) {
        if (btn.textContent && btn.textContent.includes('Save Token')) {
          saveButton = btn;
          break;
        }
      }
      
      // If no save button found, create one
      if (!saveButton) {
        saveButton = document.createElement('button');
        saveButton.textContent = 'Save Token Securely';
        saveButton.style.backgroundColor = '#1976D2';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.padding = '8px 16px';
        saveButton.style.marginTop = '8px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontWeight = 'bold';
        
        input.parentNode.insertBefore(saveButton, input.nextSibling);
      }
      
      // Wire up the save button
      saveButton.addEventListener('click', function() {
        const token = input.value.trim();
        
        if (!token) {
          alert('Please enter your Hugging Face API token');
          return;
        }
        
        try {
          localStorage.setItem('huggingface_token', token);
          sessionStorage.setItem('huggingface_token', token);
          
          // Simple feedback
          alert('Token saved successfully!');
        } catch (err) {
          alert('Error saving token: ' + err.message);
        }
      });
      
      // Load any saved token
      const savedToken = localStorage.getItem('huggingface_token') || 
                        sessionStorage.getItem('huggingface_token');
      
      if (savedToken) {
        input.value = savedToken;
      }
      
      log('Added new token input');
    }
    
    console.log('Token section fixed successfully');
  }
  
  // Listen for hash changes to handle navigation
  window.addEventListener('hashchange', function() {
    if (isParametersPage()) {
      setTimeout(fixTokenSection, 500);
    }
  });
})();
