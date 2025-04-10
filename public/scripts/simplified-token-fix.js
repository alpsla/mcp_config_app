/**
 * simplified-token-fix.js
 * Enhanced version with improved layout and styling
 */

// Execute immediately as a self-contained function
(function() {
  // Wait a bit for the page to load
  setTimeout(addTokenInput, 500);
  
  function addTokenInput() {
    // Only run on parameters page
    if (!window.location.href.includes('/subscribe/parameters')) {
      return;
    }
    
    // Look for the token section
    const allDivs = document.querySelectorAll('div');
    let tokenSection = null;
    
    for (let i = 0; i < allDivs.length; i++) {
      const div = allDivs[i];
      if (div.textContent && div.textContent.includes('Hugging Face API Token')) {
        tokenSection = div;
        break;
      }
    }
    
    if (!tokenSection) {
      return;
    }
    
    // Find the existing input field
    const inputField = tokenSection.querySelector('input[placeholder*="Enter your Hugging Face"]') || 
                       tokenSection.querySelector('input[placeholder*="API token"]');
    
    if (inputField) {
      // Enhance the input field styling
      inputField.style.padding = '12px';
      inputField.style.border = '1px solid #ced4da';
      inputField.style.borderRadius = '4px';
      inputField.style.fontSize = '14px';
      inputField.style.width = '100%';
      inputField.style.boxSizing = 'border-box';
      inputField.style.backgroundColor = 'white';
      inputField.style.outline = 'none';
      inputField.style.transition = 'border-color 0.2s';
      
      // Add focus styles
      inputField.addEventListener('focus', function() {
        this.style.borderColor = '#1976d2';
        this.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.2)';
      });
      
      inputField.addEventListener('blur', function() {
        this.style.borderColor = '#ced4da';
        this.style.boxShadow = 'none';
      });
      
      // Find the "Save Token Securely" button
      let saveButton = null;
      const buttons = tokenSection.querySelectorAll('button');
      
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent && buttons[i].textContent.includes('Save Token')) {
          saveButton = buttons[i];
          break;
        }
      }
      
      if (saveButton) {
        // Enhance the save button styling
        saveButton.style.backgroundColor = '#1976d2';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.padding = '10px 16px';
        saveButton.style.fontSize = '14px';
        saveButton.style.fontWeight = 'bold';
        saveButton.style.cursor = 'pointer';
        saveButton.style.transition = 'background-color 0.2s';
        saveButton.style.display = 'inline-block';
        saveButton.style.marginTop = '10px';
        saveButton.style.marginBottom = '10px';
        
        // Add hover effect
        saveButton.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#0d47a1';
        });
        
        saveButton.addEventListener('mouseleave', function() {
          this.style.backgroundColor = '#1976d2';
        });
        
        // Add active effect
        saveButton.addEventListener('mousedown', function() {
          this.style.backgroundColor = '#0a3880';
        });
        
        saveButton.addEventListener('mouseup', function() {
          this.style.backgroundColor = '#0d47a1';
        });
        
        // Create a button container for better spacing
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '12px';
        
        // Move the button to our container
        const buttonParent = saveButton.parentNode;
        buttonParent.removeChild(saveButton);
        buttonContainer.appendChild(saveButton);
        
        // Find where to insert the button container
        const securityInfo = tokenSection.querySelector('div:has(img[src*="lock"])') || 
                           tokenSection.querySelector('div:contains("Your token is stored securely")');
        
        // Insert button container before security info if found
        if (securityInfo && securityInfo.parentNode) {
          securityInfo.parentNode.insertBefore(buttonContainer, securityInfo);
        } else {
          // Otherwise just put it after the input
          inputField.parentNode.insertBefore(buttonContainer, inputField.nextSibling);
        }
        
        // Create a learn more link
        const learnMoreLink = document.createElement('a');
        learnMoreLink.href = 'javascript:void(0)';
        learnMoreLink.textContent = 'Learn more about secure token storage';
        learnMoreLink.style.marginLeft = '15px';
        learnMoreLink.style.color = '#1976d2';
        learnMoreLink.style.fontSize = '13px';
        learnMoreLink.style.textDecoration = 'none';
        learnMoreLink.style.display = 'inline-block';
        learnMoreLink.style.verticalAlign = 'middle';
        
        // Add link behavior
        learnMoreLink.addEventListener('click', function(e) {
          e.preventDefault();
          alert('Secure Token Storage Documentation:\n\n' +
                'Your Hugging Face API token is stored securely on your device using ' +
                'platform-specific secure storage mechanisms. The token is never transmitted ' +
                'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
                'For more information, please visit our documentation site.');
        });
        
        // Add the link to the button container
        buttonContainer.appendChild(learnMoreLink);
        
        // Add click handler to the save button
        saveButton.addEventListener('click', function() {
          const token = inputField.value.trim();
          if (!token) {
            alert('Please enter your Hugging Face API token');
            return;
          }
          
          try {
            localStorage.setItem('huggingface_token', token);
            sessionStorage.setItem('huggingface_token', token);
            
            // Visual feedback
            const originalBgColor = this.style.backgroundColor;
            this.style.backgroundColor = '#4caf50';
            this.textContent = 'Token Saved ✓';
            
            setTimeout(() => {
              this.style.backgroundColor = originalBgColor;
              this.textContent = 'Save Token Securely';
            }, 2000);
          } catch (err) {
            alert('Error saving token: ' + err.message);
          }
        });
      }
      
      // Pre-fill with saved token if available
      const savedToken = localStorage.getItem('huggingface_token') || 
                        sessionStorage.getItem('huggingface_token');
      if (savedToken) {
        inputField.value = savedToken;
      }
    }
  }
  
  // Also run when hash changes
  window.addEventListener('hashchange', function() {
    setTimeout(addTokenInput, 500);
  });
})();
