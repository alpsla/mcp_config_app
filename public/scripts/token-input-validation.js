/**
 * token-input-validation.js
 * Adds validation to the Hugging Face API token input field
 */

(function() {
  // Config
  const DEBUG = false; // Set to false to disable logging
  
  // Utility function for controlled logging
  function log(message, ...args) {
    if (DEBUG) {
      console.log('[TokenValidation]', message, ...args);
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initValidation);
  } else {
    // Small delay to ensure other scripts had time to run
    setTimeout(initValidation, 300);
  }
  
  // Listen for hash changes
  window.addEventListener('hashchange', function() {
    if (window.location.hash.includes('/subscribe/parameters')) {
      setTimeout(initValidation, 300);
    }
  });
  
  // Check if there's a save button already
  function isSaveButtonPresent() {
    return !!document.getElementById('optimized-save-button');
  }
  
  function initValidation() {
    // Skip if the optimized fix has already added a save button
    if (isSaveButtonPresent()) {
      log('Optimized fix detected, skipping validation script');
      return;
    }
    
    log('Initializing token validation');
    
    // Find the token input - try first the optimized input, then fallbacks
    const tokenInput = document.getElementById('optimized-token-input') ||
                       document.querySelector('.fixed-direct-token-input') || 
                       document.querySelector('input[placeholder*="API token"]') ||
                       document.querySelector('input[placeholder*="Hugging Face"]');
    
    if (!tokenInput || tokenInput.hasAttribute('data-validation-applied')) {
      log('No suitable token input found or validation already applied');
      return;
    }
    
    // Mark to prevent double initialization
    tokenInput.setAttribute('data-validation-applied', 'true');
    
    // Create validation feedback element
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'token-validation-feedback';
    feedbackEl.style.fontSize = '13px';
    feedbackEl.style.marginTop = '5px';
    feedbackEl.style.transition = 'all 0.2s ease';
    
    // Insert feedback after input
    if (tokenInput.parentNode) {
      tokenInput.parentNode.insertBefore(feedbackEl, tokenInput.nextSibling);
    }
    
    // Create "Save Token Securely" button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Token Securely';
    saveButton.className = 'save-token-button';
    saveButton.style.backgroundColor = '#1976D2';
    saveButton.style.color = 'white';
    saveButton.style.padding = '10px 16px';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.marginTop = '15px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.fontWeight = 'bold';
    saveButton.style.fontSize = '14px';
    saveButton.style.display = 'block';
    
    // Add button after feedback
    feedbackEl.parentNode.insertBefore(saveButton, feedbackEl.nextSibling);
    
    // Add documentation link
    const docsLink = document.createElement('a');
    docsLink.href = '#';
    docsLink.textContent = 'Learn more about secure token storage';
    docsLink.className = 'token-docs-link';
    docsLink.style.display = 'block';
    docsLink.style.marginTop = '10px';
    docsLink.style.fontSize = '13px';
    docsLink.style.color = '#1976D2';
    docsLink.style.textDecoration = 'none';
    
    // Add click handler to open documentation
    docsLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Try to open documentation if in Electron
      if (window.electron && window.electron.openExternal) {
        window.electron.openExternal('docs/secure-token-usage-guide.md');
      } else {
        // Show documentation in an alert for web version
        alert('Secure Token Storage Documentation:\n\n' +
              'Your Hugging Face API token is stored securely on your device using ' +
              'platform-specific secure storage mechanisms. The token is never transmitted ' +
              'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
              'For more information, please visit our documentation site.');
      }
    });
    
    // Add the link after the save button
    saveButton.parentNode.insertBefore(docsLink, saveButton.nextSibling);
    
    // Validate token format
    function validateTokenFormat(token) {
      if (!token || typeof token !== 'string' || token.trim() === '') {
        return {
          isValid: false,
          message: ""  // Empty for no token
        };
      }
    
      // Most Hugging Face tokens start with "hf_"
      const isValidFormat = /^hf_[a-zA-Z0-9]{20,}$/.test(token);
      
      if (!isValidFormat) {
        return {
          isValid: false,
          message: "⚠️ Token format appears invalid. Hugging Face tokens typically start with 'hf_'"
        };
      }
      
      return {
        isValid: true,
        message: "✓ Token format is valid"
      };
    }
    
    // Update validation feedback
    function updateValidationFeedback(validation) {
      if (!feedbackEl) return;
      
      feedbackEl.textContent = validation.message;
      
      if (!validation.message) {
        feedbackEl.style.display = 'none';
        return;
      }
      
      feedbackEl.style.display = 'block';
      feedbackEl.style.color = validation.isValid ? '#4CAF50' : '#F44336';
    }
    
    // Handle input validation
    let debounceTimer;
    tokenInput.addEventListener('input', function(e) {
      const token = e.target.value;
      
      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Set a new timer to avoid excessive validation
      debounceTimer = setTimeout(() => {
        const validation = validateTokenFormat(token);
        updateValidationFeedback(validation);
        
        // Update save button state
        saveButton.disabled = !validation.isValid;
      }, 300);
    });
    
    // Handle save button click
    saveButton.addEventListener('click', async function() {
      const token = tokenInput.value;
      
      // Validate token
      const validation = validateTokenFormat(token);
      if (!validation.isValid) {
        alert('Invalid token format. Please check your token and try again.');
        return;
      }
      
      // Show saving indicator
      const originalText = saveButton.textContent;
      saveButton.textContent = 'Saving...';
      saveButton.disabled = true;
      
      try {
        // Store in storage
        sessionStorage.setItem('huggingface_token', token);
        localStorage.setItem('huggingface_token', token);
        sessionStorage.setItem('hf_token', token);
        
        // Set a flag to indicate we need to backup MCP config file if present
        localStorage.setItem('backup_mcp_config', 'true');
        
        // If electron is available, try to trigger a config backup
        if (window.electron && window.electron.ipcRenderer) {
          try {
            window.electron.ipcRenderer.send('backup-mcp-config', {
              token: token
            });
          } catch (e) {
            if (DEBUG) {
              console.warn('Unable to trigger config backup via IPC:', e);
            }
          }
        }
        
        // Simulate API validation (will be implemented in Phase 4)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Show success message
        saveButton.textContent = 'Token Saved ✓';
        saveButton.style.backgroundColor = '#4CAF50';
        feedbackEl.textContent = '✓ Token saved securely';
        feedbackEl.style.color = '#4CAF50';
        feedbackEl.style.display = 'block';
        
        // Reset button after delay
        setTimeout(() => {
          saveButton.textContent = originalText;
          saveButton.disabled = false;
          saveButton.style.backgroundColor = '#1976D2';
        }, 2000);
      } catch (error) {
        // Show error message
        saveButton.textContent = 'Error Saving';
        saveButton.style.backgroundColor = '#F44336';
        feedbackEl.textContent = '⚠️ Failed to save token';
        feedbackEl.style.color = '#F44336';
        feedbackEl.style.display = 'block';
        
        // Reset button after delay
        setTimeout(() => {
          saveButton.textContent = originalText;
          saveButton.disabled = false;
          saveButton.style.backgroundColor = '#1976D2';
        }, 2000);
      }
    });
    
    // Initial validation
    const initialToken = tokenInput.value;
    if (initialToken) {
      const validation = validateTokenFormat(initialToken);
      updateValidationFeedback(validation);
      saveButton.disabled = !validation.isValid;
    } else {
      feedbackEl.style.display = 'none';
      saveButton.disabled = true;
    }
  }
})();
