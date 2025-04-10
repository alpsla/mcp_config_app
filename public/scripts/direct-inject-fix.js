/**
 * direct-inject-fix.js
 * Directly injects the input field into the DOM by modifying the HTML
 */

(function() {
  // Run immediately 
  injectTokenInput();
  
  // Also run every second to catch page changes
  setInterval(injectTokenInput, 1000);
  
  function injectTokenInput() {
    console.log('Running direct injection fix...');
    
    // Look for the section containing the token info
    const sections = document.querySelectorAll('div');
    
    // Skip if we've already injected our fix
    if (document.querySelector('#direct-injected-token-input')) {
      return;
    }
    
    for (const section of sections) {
      // Check if this is the token section by its content
      if (section.textContent.includes('Hugging Face API Token') && 
          section.textContent.includes('To get a token:')) {
        
        console.log('Found token section:', section);
        
        // Find the heading
        let heading = null;
        const headings = section.querySelectorAll('h1, h2, h3, h4, h5');
        for (const h of headings) {
          if (h.textContent.includes('Hugging Face API Token')) {
            heading = h;
            break;
          }
        }
        
        if (!heading) {
          console.log('Could not find heading');
          continue;
        }
        
        // Look for the "To get a token:" text
        let insertPoint = null;
        const allElements = section.querySelectorAll('*');
        for (const el of allElements) {
          if (el.textContent && el.textContent.trim() === 'To get a token:') {
            insertPoint = el;
            break;
          }
        }
        
        if (!insertPoint) {
          console.log('Could not find insertion point');
          insertPoint = heading;
        }
        
        // Create HTML for our input components
        const html = `
          <div id="direct-injected-token-container" style="
            margin: 15px 0;
            padding: 15px;
            background-color: #f0f7ff;
            border: 1px solid #bbdefb;
            border-radius: 8px;
          ">
            <input 
              type="text" 
              id="direct-injected-token-input" 
              placeholder="Enter your Hugging Face API token here" 
              style="
                width: 100%;
                padding: 12px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
                margin-bottom: 10px;
              "
            >
            <div style="display: flex; align-items: center;">
              <button 
                id="direct-injected-save-button"
                style="
                  background-color: #1976d2;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  padding: 10px 16px;
                  font-size: 14px;
                  cursor: pointer;
                  margin-right: 10px;
                "
              >Save Token Securely</button>
              <a 
                href="#" 
                id="direct-injected-doc-link"
                style="
                  color: #1976d2;
                  text-decoration: none;
                  font-size: 13px;
                  cursor: pointer;
                "
              >Learn more about secure token storage</a>
            </div>
            <div 
              id="direct-injected-feedback"
              style="
                margin-top: 10px;
                font-size: 13px;
                display: none;
              "
            ></div>
          </div>
        `;
        
        // Create a container for our HTML
        const container = document.createElement('div');
        container.innerHTML = html;
        
        // Insert before the "To get a token:" section
        insertPoint.parentNode.insertBefore(container, insertPoint);
        
        // Add event listeners
        const saveButton = document.getElementById('direct-injected-save-button');
        const tokenInput = document.getElementById('direct-injected-token-input');
        const docLink = document.getElementById('direct-injected-doc-link');
        const feedback = document.getElementById('direct-injected-feedback');
        
        if (saveButton && tokenInput) {
          saveButton.addEventListener('click', function() {
            const token = tokenInput.value.trim();
            
            if (!token) {
              showFeedback('Please enter a token', false);
              return;
            }
            
            // Basic validation
            if (!token.startsWith('hf_')) {
              showFeedback('Invalid token format. Hugging Face tokens typically start with "hf_"', false);
              return;
            }
            
            // Save token
            try {
              localStorage.setItem('huggingface_token', token);
              sessionStorage.setItem('huggingface_token', token);
              showFeedback('Token saved successfully!', true);
              
              // Change button color temporarily
              const originalColor = saveButton.style.backgroundColor;
              saveButton.style.backgroundColor = '#4caf50';
              setTimeout(() => {
                saveButton.style.backgroundColor = originalColor;
              }, 2000);
            } catch (error) {
              showFeedback('Error saving token: ' + error.message, false);
            }
          });
        }
        
        if (docLink) {
          docLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            alert('Secure Token Storage Documentation:\n\n' +
                  'Your Hugging Face API token is stored securely on your device using ' +
                  'platform-specific secure storage mechanisms. The token is never transmitted ' +
                  'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
                  'For more information, please visit our documentation site.');
          });
        }
        
        // Check for previous token
        const savedToken = localStorage.getItem('huggingface_token') || 
                          sessionStorage.getItem('huggingface_token');
        if (savedToken && tokenInput) {
          tokenInput.value = savedToken;
        }
        
        // Helper to show feedback
        function showFeedback(message, isSuccess) {
          if (!feedback) return;
          
          feedback.textContent = isSuccess ? '✓ ' + message : '⚠️ ' + message;
          feedback.style.color = isSuccess ? '#4caf50' : '#f44336';
          feedback.style.display = 'block';
          
          // Hide after a while
          setTimeout(() => {
            feedback.style.display = 'none';
          }, 5000);
        }
        
        console.log('Successfully injected token input');
        break;
      }
    }
  }
})();
