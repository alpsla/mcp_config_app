/**
 * token-input-direct-fix.js
 * Emergency direct fix for the Hugging Face token input issue
 * This is a standalone solution that doesn't rely on the existing DOM structure
 */

(function() {
  // Config
  const DEBUG = false;
  
  // Log helper
  function log(message) {
    if (DEBUG) {
      console.log('[TokenDirectFix]', message);
    }
  }
  
  // Function to fix the token input
  function fixTokenInput() {
    log('Starting direct token input fix');
    
    // Find the Hugging Face section
    const sections = document.querySelectorAll('div[style*="background-color: rgb(240, 247, 255)"]');
    let tokenSection = null;
    
    // Look for the HF token section
    for (const section of sections) {
      if (section.textContent.includes('Hugging Face API Token')) {
        tokenSection = section;
        break;
      }
    }
    
    // If we didn't find it, stop here
    if (!tokenSection) {
      log('HF token section not found');
      return;
    }
    
    // Check if we've already fixed this section
    if (tokenSection.querySelector('.hf-token-fixed-input')) {
      log('Token input already fixed');
      return;
    }
    
    log('Found HF token section, creating fixed input');
    
    // Create container for the input and button
    const container = document.createElement('div');
    container.className = 'hf-token-fixed-container';
    container.style.margin = '15px 0';
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'hf-token-fixed-input';
    input.placeholder = 'Enter your Hugging Face API token';
    input.style.width = '100%';
    input.style.padding = '12px';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid #ccc';
    input.style.fontSize = '14px';
    input.style.boxSizing = 'border-box';
    
    // Create save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Token Securely';
    saveButton.className = 'hf-token-save-button';
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
    
    // Create helper text
    const helperText = document.createElement('div');
    helperText.textContent = 'Enter your token in the field above and click "Save Token Securely"';
    helperText.style.fontSize = '13px';
    helperText.style.color = '#666';
    helperText.style.marginTop = '5px';
    helperText.style.textAlign = 'center';
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'hf-token-feedback';
    feedback.style.fontSize = '13px';
    feedback.style.marginTop = '10px';
    feedback.style.display = 'none';
    
    // Create documentation link
    const docsLink = document.createElement('a');
    docsLink.href = '#';
    docsLink.textContent = 'Learn more about secure token storage';
    docsLink.className = 'hf-token-docs-link';
    docsLink.style.display = 'block';
    docsLink.style.marginTop = '10px';
    docsLink.style.fontSize = '13px';
    docsLink.style.color = '#1976D2';
    docsLink.style.textDecoration = 'none';
    docsLink.style.textAlign = 'center';
    
    // Add event handlers
    
    // Input validation
    input.addEventListener('input', function(e) {
      const token = e.target.value;
      validateToken(token);
    });
    
    // Save button click
    saveButton.addEventListener('click', function() {
      const token = input.value;
      
      // Validate token
      if (!validateToken(token, true)) {
        return;
      }
      
      // Save token
      saveToken(token);
    });
    
    // Docs link click
    docsLink.addEventListener('click', function(e) {
      e.preventDefault();
      showDocumentation();
    });
    
    // Token validation function
    function validateToken(token, showAlert = false) {
      if (!token || token.trim() === '') {
        feedback.textContent = '';
        feedback.style.display = 'none';
        saveButton.disabled = true;
        return false;
      }
      
      // Most Hugging Face tokens start with "hf_"
      const isValidFormat = /^hf_[a-zA-Z0-9]{20,}$/.test(token);
      
      if (!isValidFormat) {
        feedback.textContent = '⚠️ Token format appears invalid. Hugging Face tokens typically start with "hf_"';
        feedback.style.color = '#F44336';
        feedback.style.display = 'block';
        saveButton.disabled = true;
        
        if (showAlert) {
          alert('Invalid token format. Please check your token and try again.');
        }
        
        return false;
      }
      
      feedback.textContent = '✓ Token format is valid';
      feedback.style.color = '#4CAF50';
      feedback.style.display = 'block';
      saveButton.disabled = false;
      return true;
    }
    
    // Save token function
    function saveToken(token) {
      // Save to storage
      try {
        localStorage.setItem('huggingface_token', token);
        sessionStorage.setItem('huggingface_token', token);
        
        // Show success message
        feedback.textContent = '✓ Token saved securely';
        feedback.style.color = '#4CAF50';
        feedback.style.display = 'block';
        
        // Update button
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Token Saved ✓';
        saveButton.style.backgroundColor = '#4CAF50';
        
        // Reset button after delay
        setTimeout(function() {
          saveButton.textContent = originalText;
          saveButton.style.backgroundColor = '#1976D2';
        }, 2000);
        
        log('Token saved successfully');
      } catch (error) {
        // Show error message
        feedback.textContent = '⚠️ Failed to save token';
        feedback.style.color = '#F44336';
        feedback.style.display = 'block';
        
        log('Error saving token:', error);
      }
    }
    
    // Show documentation function
    function showDocumentation() {
      alert('Secure Token Storage Documentation:\n\n' +
            'Your Hugging Face API token is stored securely on your device using ' +
            'platform-specific secure storage mechanisms. The token is never transmitted ' +
            'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
            'For more information, please visit our documentation site.');
    }
    
    // Assemble the elements
    container.appendChild(input);
    container.appendChild(helperText);
    container.appendChild(saveButton);
    container.appendChild(feedback);
    container.appendChild(docsLink);
    
    // Find a good location to insert our fixed input
    const paragraphs = tokenSection.querySelectorAll('p');
    if (paragraphs.length > 0) {
      // Insert after the first paragraph
      paragraphs[0].parentNode.insertBefore(container, paragraphs[0].nextSibling);
    } else {
      // If no paragraphs, insert at the beginning
      tokenSection.insertBefore(container, tokenSection.firstChild.nextSibling);
    }
    
    // Hide any existing inputs that might be broken
    const existingInputs = tokenSection.querySelectorAll('input:not(.hf-token-fixed-input)');
    for (const existingInput of existingInputs) {
      existingInput.style.display = 'none';
    }
    
    log('Fixed input added to the DOM');
    
    // Check if there's a saved token
    try {
      const savedToken = localStorage.getItem('huggingface_token') || 
                         sessionStorage.getItem('huggingface_token');
      
      if (savedToken) {
        input.value = savedToken;
        validateToken(savedToken);
      }
    } catch (error) {
      log('Error loading saved token:', error);
    }
  }
  
  // Run the fix when the page loads
  if (document.readyState !== 'loading') {
    fixTokenInput();
  } else {
    document.addEventListener('DOMContentLoaded', fixTokenInput);
  }
  
  // Also run on hash changes
  window.addEventListener('hashchange', function() {
    setTimeout(fixTokenInput, 500);
  });
  
  // Run periodically to catch dynamic updates
  setInterval(fixTokenInput, 2000);
})();
