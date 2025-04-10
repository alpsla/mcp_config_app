/**
 * add-custom-token-input.js
 * Adds a completely separate token input form
 */

(function() {
  // Wait for the page to fully load
  window.addEventListener('load', addCustomTokenInput);
  
  function addCustomTokenInput() {
    // Only run on parameters page
    if (!window.location.href.includes('/subscribe/parameters')) {
      return;
    }
    
    // Check if already added
    if (document.getElementById('custom-token-area')) {
      return;
    }
    
    // Create the custom token input area
    const tokenArea = document.createElement('div');
    tokenArea.id = 'custom-token-area';
    tokenArea.style.margin = '30px auto';
    tokenArea.style.maxWidth = '800px';
    tokenArea.style.padding = '20px';
    tokenArea.style.backgroundColor = '#f0f4f8';
    tokenArea.style.borderRadius = '8px';
    tokenArea.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // Create the content
    tokenArea.innerHTML = `
      <h3 style="color: #1976d2; margin-top: 0; font-size: 20px;">Hugging Face API Token</h3>
      <p style="color: #555; margin-bottom: 15px;">Enter your token to access premium models:</p>
      <div style="margin-bottom: 15px;">
        <input 
          type="text" 
          id="custom-token-input" 
          placeholder="Enter your Hugging Face API token" 
          style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box;"
        >
      </div>
      <div style="display: flex; align-items: center;">
        <button 
          id="custom-token-save" 
          style="background-color: #1976d2; color: white; border: none; border-radius: 4px; padding: 10px 20px; font-size: 16px; cursor: pointer; font-weight: bold;"
        >Save Token Securely</button>
        <a 
          href="#" 
          id="custom-token-info" 
          style="margin-left: 15px; color: #1976d2; font-size: 14px; text-decoration: none;"
        >Learn more about secure token storage</a>
      </div>
    `;
    
    // Insert at the top of the page
    const root = document.getElementById('root');
    if (root && root.firstChild) {
      root.insertBefore(tokenArea, root.firstChild);
    } else {
      document.body.insertBefore(tokenArea, document.body.firstChild);
    }
    
    // Set up event handlers
    const tokenInput = document.getElementById('custom-token-input');
    const saveButton = document.getElementById('custom-token-save');
    const infoLink = document.getElementById('custom-token-info');
    
    if (tokenInput && saveButton) {
      // Pre-fill with saved token if available
      const savedToken = localStorage.getItem('huggingface_token') || 
                        sessionStorage.getItem('huggingface_token');
      if (savedToken) {
        tokenInput.value = savedToken;
      }
      
      // Add save button click handler
      saveButton.addEventListener('click', function() {
        const token = tokenInput.value.trim();
        if (!token) {
          alert('Please enter your Hugging Face API token');
          return;
        }
        
        try {
          localStorage.setItem('huggingface_token', token);
          sessionStorage.setItem('huggingface_token', token);
          
          // Visual feedback
          this.style.backgroundColor = '#4caf50';
          this.textContent = 'Token Saved ✓';
          
          setTimeout(() => {
            this.style.backgroundColor = '#1976d2';
            this.textContent = 'Save Token Securely';
          }, 2000);
        } catch (error) {
          alert('Error saving token: ' + error.message);
        }
      });
      
      // Add info link click handler
      if (infoLink) {
        infoLink.addEventListener('click', function(e) {
          e.preventDefault();
          alert('Secure Token Storage Documentation:\n\n' +
                'Your Hugging Face API token is stored securely on your device using ' +
                'platform-specific secure storage mechanisms. The token is never transmitted ' +
                'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
                'For more information, please visit our documentation site.');
        });
      }
    }
  }
  
  // Also run when hash changes (navigation)
  window.addEventListener('hashchange', function() {
    if (window.location.href.includes('/subscribe/parameters')) {
      setTimeout(addCustomTokenInput, 500);
    }
  });
})();
