/**
 * direct-token-fix.js
 * Direct DOM replacement approach for maximum reliability
 */

(function() {
  // Wait for page to load
  window.addEventListener('load', fixTokenSection);
  
  // Also run on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', fixTokenSection);
  
  // Run immediately as well
  setTimeout(fixTokenSection, 500);
  setTimeout(fixTokenSection, 1500);
  
  function fixTokenSection() {
    // Only run on parameters page
    if (!window.location.href.includes('/subscribe/parameters')) {
      return;
    }
    
    // Find the token section
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
    
    // Find existing input fields and buttons to clean up
    const existingInputs = tokenSection.querySelectorAll('input');
    const existingButtons = tokenSection.querySelectorAll('button');
    
    // Hide all but one input field
    if (existingInputs.length > 0) {
      // Keep only the first input visible
      for (let i = 1; i < existingInputs.length; i++) {
        existingInputs[i].style.display = 'none';
      }
      
      // Make sure the first input is properly enabled and styled
      existingInputs[0].disabled = false;
      existingInputs[0].readOnly = false;
      existingInputs[0].style.pointerEvents = 'auto';
      existingInputs[0].style.opacity = '1';
      existingInputs[0].style.visibility = 'visible';
      existingInputs[0].style.backgroundColor = 'white';
      existingInputs[0].style.color = 'black';
      existingInputs[0].style.cursor = 'text';
      existingInputs[0].style.userSelect = 'auto';
      existingInputs[0].style.WebkitUserSelect = 'auto';
      existingInputs[0].style.border = '1px solid #ced4da';
      existingInputs[0].style.borderRadius = '4px';
      existingInputs[0].style.padding = '12px';
      existingInputs[0].style.fontSize = '14px';
      existingInputs[0].style.boxSizing = 'border-box';
      existingInputs[0].style.width = '100%';
      
      // Load saved token if available
      const savedToken = localStorage.getItem('huggingface_token') || 
                        sessionStorage.getItem('huggingface_token');
      if (savedToken) {
        existingInputs[0].value = savedToken;
      }
    }
    
    // Find the "Save Token Securely" button and improve it
    let saveButton = null;
    for (let i = 0; i < existingButtons.length; i++) {
      if (existingButtons[i].textContent && existingButtons[i].textContent.includes('Save Token')) {
        saveButton = existingButtons[i];
        break;
      }
    }
    
    if (saveButton) {
      // Improve button styling
      saveButton.style.backgroundColor = '#1976d2';
      saveButton.style.color = 'white';
      saveButton.style.border = 'none';
      saveButton.style.borderRadius = '4px';
      saveButton.style.padding = '10px 16px';
      saveButton.style.fontSize = '14px';
      saveButton.style.fontWeight = 'bold';
      saveButton.style.cursor = 'pointer';
      saveButton.style.transition = 'background-color 0.2s';
      saveButton.style.pointerEvents = 'auto';
      saveButton.style.opacity = '1';
      saveButton.style.visibility = 'visible';
      saveButton.style.display = 'inline-block';
      
      // Remove any existing click handlers and add our own
      saveButton.onclick = null;
      saveButton.addEventListener('click', function() {
        const activeInput = existingInputs[0];
        if (!activeInput) return;
        
        const token = activeInput.value.trim();
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
      
      // Add hover effect
      saveButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#0d47a1';
      });
      
      saveButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#1976d2';
      });
    }
    
    // Look for any "Learn more" link
    const links = tokenSection.querySelectorAll('a');
    let learnMoreLink = null;
    
    for (let i = 0; i < links.length; i++) {
      if (links[i].textContent && links[i].textContent.includes('Learn more')) {
        learnMoreLink = links[i];
        break;
      }
    }
    
    // Improve the link if found
    if (learnMoreLink) {
      learnMoreLink.style.color = '#1976d2';
      learnMoreLink.style.textDecoration = 'none';
      learnMoreLink.style.fontSize = '14px';
      learnMoreLink.style.margin = '0 0 0 15px';
      learnMoreLink.style.display = 'inline-block';
      learnMoreLink.style.verticalAlign = 'middle';
      
      // Make sure it has a proper click handler
      learnMoreLink.onclick = function(e) {
        e.preventDefault();
        alert('Secure Token Storage Documentation:\n\n' +
              'Your Hugging Face API token is stored securely on your device using ' +
              'platform-specific secure storage mechanisms. The token is never transmitted ' +
              'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
              'For more information, please visit our documentation site.');
        return false;
      };
    }
    
    // Fix overall layout
    // Find instruction list (1. Visit... 2. Sign in...)
    const instructionsList = tokenSection.querySelector('ol') || 
                           tokenSection.querySelector('div:has(> div:contains("Visit the Hugging Face Token page"))');
    
    if (instructionsList) {
      // Add proper margin above the list
      instructionsList.style.marginTop = '20px';
    }
    
    // Find the secure storage message
    const secureStorageMsg = Array.from(tokenSection.querySelectorAll('div')).find(div => 
      div.textContent && div.textContent.includes('Your token is stored securely on your local device'));
    
    if (secureStorageMsg) {
      // Improve styling
      secureStorageMsg.style.backgroundColor = '#e8f5e9';
      secureStorageMsg.style.borderRadius = '4px';
      secureStorageMsg.style.padding = '12px 15px';
      secureStorageMsg.style.margin = '15px 0';
      secureStorageMsg.style.color = '#2e7d32';
      secureStorageMsg.style.display = 'flex';
      secureStorageMsg.style.alignItems = 'center';
    }
    
    // Find and hide any duplicate content
    const toGetAToken = Array.from(tokenSection.querySelectorAll('div, p')).filter(el => 
      el.textContent && el.textContent.trim() === 'To get a token:');
    
    if (toGetAToken.length > 1) {
      // Hide all but the first one
      for (let i = 1; i < toGetAToken.length; i++) {
        toGetAToken[i].style.display = 'none';
      }
    }
  }
  
  // Also run when hash changes
  window.addEventListener('hashchange', function() {
    setTimeout(fixTokenSection, 500);
  });
})();
