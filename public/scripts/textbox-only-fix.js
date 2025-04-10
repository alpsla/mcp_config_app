/**
 * textbox-only-fix.js
 * Ultra-focused fix that only adds the textbox
 */

(function() {
  // Run immediately with a slight delay to let other elements render
  setTimeout(addTextbox, 300);
  
  // Also run every second to catch page changes
  setInterval(addTextbox, 1000);
  
  function addTextbox() {
    console.log('Running textbox-only fix');
    
    // Skip if we've already added our fix
    if (document.getElementById('emergency-textbox-fix')) {
      return;
    }
    
    // Find the save button that's already visible
    let saveButton = document.getElementById('direct-injected-save-button');
    
    if (!saveButton) {
      // Try to find any button with "Save Token" text
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Save Token')) {
          saveButton = btn;
          break;
        }
      }
      
      if (!saveButton) {
        console.log('Save button not found, cannot add textbox');
        return;
      }
    }
    
    console.log('Found save button, adding textbox');
    
    // Create the textbox
    const textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.id = 'emergency-textbox-fix';
    textbox.placeholder = 'Enter your Hugging Face API token here';
    
    // Add critical styling
    Object.assign(textbox.style, {
      width: '100%',
      padding: '12px',
      boxSizing: 'border-box',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      marginBottom: '15px',
      display: 'block',
      pointerEvents: 'auto',
      backgroundColor: '#fff',
      color: '#000'
    });
    
    // Look for parent container of save button
    const buttonContainer = saveButton.parentNode;
    if (!buttonContainer) {
      console.log('Button container not found');
      return;
    }
    
    // Insert textbox before button container
    buttonContainer.parentNode.insertBefore(textbox, buttonContainer);
    
    // Try to retrieve saved token
    const savedToken = localStorage.getItem('huggingface_token') || 
                       sessionStorage.getItem('huggingface_token');
    if (savedToken) {
      textbox.value = savedToken;
    }
    
    // Connect textbox to save button
    saveButton.addEventListener('click', function() {
      const token = textbox.value.trim();
      
      if (!token) {
        alert('Please enter a token');
        return;
      }
      
      // Basic validation
      if (!token.startsWith('hf_')) {
        alert('Invalid token format. Hugging Face tokens typically start with "hf_"');
        return;
      }
      
      // Save token
      try {
        localStorage.setItem('huggingface_token', token);
        sessionStorage.setItem('huggingface_token', token);
        alert('Token saved successfully!');
      } catch (error) {
        alert('Error saving token: ' + error.message);
      }
    });
    
    console.log('Textbox added successfully');
  }
})();
