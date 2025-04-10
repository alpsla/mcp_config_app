/**
 * ultra-simple-fix.js
 * The simplest possible fix for the missing textbox
 */

(function() {
  // Wait for page to be ready
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixTextbox, 500);
  });
  
  // Also run on window load
  window.addEventListener('load', function() {
    setTimeout(fixTextbox, 500);
  });
  
  // Also run periodically to catch any changes
  setInterval(fixTextbox, 2000);
  
  // The actual fix
  function fixTextbox() {
    // See if we've already fixed it
    if (document.getElementById('ultra-simple-textbox')) {
      return;
    }
    
    try {
      console.log('Running ultra simple fix');
      
      // Try to find the save button
      const saveButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Save Token')
      );
      
      if (saveButtons.length === 0) {
        console.log('No save button found');
        return;
      }
      
      const saveButton = saveButtons[0];
      console.log('Found save button:', saveButton);
      
      // Create textbox
      const textbox = document.createElement('input');
      textbox.type = 'text';
      textbox.id = 'ultra-simple-textbox';
      textbox.placeholder = 'Enter your Hugging Face API token here';
      
      // Apply inline styles
      textbox.style.width = '100%';
      textbox.style.padding = '12px';
      textbox.style.boxSizing = 'border-box';
      textbox.style.border = '1px solid #ccc';
      textbox.style.borderRadius = '4px';
      textbox.style.fontSize = '14px';
      textbox.style.marginBottom = '15px';
      textbox.style.display = 'block';
      textbox.style.backgroundColor = '#fff';
      
      // Find container to insert into
      const container = saveButton.parentNode;
      
      if (!container) {
        console.log('Button container not found');
        return;
      }
      
      console.log('Found container:', container);
      
      // Insert textbox before save button
      container.insertBefore(textbox, saveButton);
      
      console.log('Textbox inserted successfully');
      
      // Connect to save button if it's not already connected
      if (!saveButton._connected) {
        saveButton.addEventListener('click', function() {
          const token = textbox.value.trim();
          
          if (!token) {
            alert('Please enter a token');
            return;
          }
          
          // Save token
          localStorage.setItem('huggingface_token', token);
          sessionStorage.setItem('huggingface_token', token);
          alert('Token saved successfully!');
        });
        
        saveButton._connected = true;
        console.log('Connected save button to textbox');
      }
      
      // Try to load saved token
      const savedToken = localStorage.getItem('huggingface_token') || 
                        sessionStorage.getItem('huggingface_token');
      if (savedToken) {
        textbox.value = savedToken;
        console.log('Loaded saved token');
      }
    } catch (error) {
      console.error('Error in ultra simple fix:', error);
    }
  }
})();
