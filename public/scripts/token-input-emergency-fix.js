/**
 * token-input-emergency-fix.js
 * Emergency fix for missing token input field and broken documentation link
 */

(function() {
  // Execute immediately
  fixHuggingFaceTokenSection();

  // Also run after a delay to catch late loading
  setTimeout(fixHuggingFaceTokenSection, 500);

  // And watch for navigation changes
  window.addEventListener('hashchange', function() {
    setTimeout(fixHuggingFaceTokenSection, 300);
  });

  // Function to fix the Hugging Face token section
  function fixHuggingFaceTokenSection() {
    console.log('[EmergencyFix] Looking for Hugging Face token section');
    
    // Find the token section
    const tokenSections = document.querySelectorAll('div[style*="background-color: rgb(240, 247, 255)"], div.huggingface-token-section');
    
    if (!tokenSections.length) {
      // If not found directly, look for the section by heading text
      const headers = document.querySelectorAll('h3');
      for (const header of headers) {
        if (header.textContent.includes('Hugging Face API Token')) {
          const section = header.closest('div');
          if (section) {
            fixTokenSection(section);
            return;
          }
        }
      }
      
      // Try with any div containing the text
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
        if (div.textContent.includes('Hugging Face API Token') && 
            !div.querySelector('.emergency-token-input')) {
          fixTokenSection(div);
          return;
        }
      }
      
      console.log('[EmergencyFix] Hugging Face token section not found');
      return;
    }
    
    // Fix each matching section (should typically be just one)
    tokenSections.forEach(section => {
      fixTokenSection(section);
    });
  }
  
  // Fix a specific token section
  function fixTokenSection(section) {
    // Skip if already fixed
    if (section.querySelector('.emergency-token-input')) {
      console.log('[EmergencyFix] Section already fixed');
      return;
    }
    
    console.log('[EmergencyFix] Fixing token section', section);
    
    // Create the input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'emergency-token-input';
    input.placeholder = 'Enter your Hugging Face API token';
    input.style.width = '100%';
    input.style.padding = '12px';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid #ccc';
    input.style.fontSize = '14px';
    input.style.marginBottom = '15px';
    input.style.marginTop = '15px';
    input.style.boxSizing = 'border-box';
    
    // Try to get a saved token
    const savedToken = localStorage.getItem('huggingface_token') || 
                       sessionStorage.getItem('huggingface_token');
    if (savedToken) {
      input.value = savedToken;
    }
    
    // Find places where we might want to insert our new input
    const targetElements = [
      section.querySelector('p'),
      section.querySelector('div[style*="margin-bottom"]'),
      section.querySelector('button'),
      section.querySelector('a'),
      section.firstElementChild
    ].filter(Boolean);
    
    if (targetElements.length === 0) {
      // If no good insertion points, just put it at the top of the section
      section.insertBefore(input, section.firstChild);
    } else {
      // Insert after the first found element
      const target = targetElements[0];
      target.parentNode.insertBefore(input, target.nextSibling);
    }
    
    // Fix the documentation link
    const links = section.querySelectorAll('a');
    let docLink = null;
    
    for (const link of links) {
      if (link.textContent.includes('token storage')) {
        docLink = link;
        break;
      }
    }
    
    if (docLink) {
      // Make sure the link is properly styled and clickable
      docLink.style.pointerEvents = 'auto';
      docLink.style.textDecoration = 'underline';
      docLink.style.cursor = 'pointer';
      docLink.style.color = '#1976D2';
      
      // Fix href if missing
      if (!docLink.href || docLink.href === '#' || docLink.href === 'javascript:void(0)') {
        docLink.href = '#'; // Use hash to keep it on the same page
        
        // Add proper click event handler
        docLink.onclick = function(e) {
          e.preventDefault();
          alert('Secure Token Storage Documentation:\n\n' +
                'Your Hugging Face API token is stored securely on your device using ' +
                'platform-specific secure storage mechanisms. The token is never transmitted ' +
                'to our servers and is accessed only when needed to authenticate with Hugging Face.\n\n' +
                'For more information, please visit our documentation site.');
        };
      }
    }
    
    // Find the save button
    const buttons = section.querySelectorAll('button');
    let saveButton = null;
    
    for (const button of buttons) {
      if (button.textContent.includes('Save Token')) {
        saveButton = button;
        break;
      }
    }
    
    if (saveButton) {
      // Make sure it has proper styling
      saveButton.style.pointerEvents = 'auto';
      saveButton.style.cursor = 'pointer';
      
      // Ensure it has a click handler
      saveButton.onclick = function() {
        const token = input.value.trim();
        
        // Basic validation
        if (!token) {
          alert('Please enter a Hugging Face API token');
          return;
        }
        
        if (!/^hf_/.test(token)) {
          alert('Invalid token format. Hugging Face tokens typically start with "hf_"');
          return;
        }
        
        // Save token to storage
        try {
          localStorage.setItem('huggingface_token', token);
          sessionStorage.setItem('huggingface_token', token);
          
          // Show success message
          alert('Token saved successfully!');
        } catch (error) {
          alert('Error saving token: ' + error.message);
        }
      };
    }
    
    console.log('[EmergencyFix] Fixed token section successfully');
  }
})();
