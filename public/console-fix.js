// Copy and paste this entire script into the browser console
// when viewing the Parameters page with the missing textbox.

// Find the save button
const saveButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
  btn.textContent.includes('Save Token')
);

if (saveButtons.length === 0) {
  console.error('Could not find save button');
  alert('Could not find save button');
} else {
  const saveButton = saveButtons[0];
  console.log('Found save button:', saveButton);
  
  // Create textbox
  const textbox = document.createElement('input');
  textbox.type = 'text';
  textbox.id = 'console-fix-textbox';
  textbox.placeholder = 'Enter your Hugging Face API token here';
  
  // Style the textbox
  textbox.style.width = '100%';
  textbox.style.padding = '12px';
  textbox.style.boxSizing = 'border-box';
  textbox.style.border = '1px solid #ccc';
  textbox.style.borderRadius = '4px';
  textbox.style.fontSize = '14px';
  textbox.style.marginBottom = '15px';
  textbox.style.display = 'block';
  textbox.style.backgroundColor = '#fff';
  
  // Try to retrieve saved token
  const savedToken = localStorage.getItem('huggingface_token') || 
                     sessionStorage.getItem('huggingface_token');
  if (savedToken) {
    textbox.value = savedToken;
  }
  
  // Find container to insert into
  const container = saveButton.parentNode;
  
  if (!container) {
    console.error('Button container not found');
    alert('Button container not found');
  } else {
    // Insert textbox before save button
    container.insertBefore(textbox, saveButton);
    
    // Connect to save button
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
    
    console.log('Textbox added successfully');
    alert('Textbox added successfully! You can now enter your token.');
  }
}
