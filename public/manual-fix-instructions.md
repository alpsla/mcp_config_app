# Manual Fix for Missing Textbox

If the automatic fixes don't work, here are manual steps to add the textbox using the browser developer tools:

## Option 1: Use the Console Script

1. Open the Parameters page in your application
2. Open the browser developer tools (F12 or right-click > Inspect)
3. Click on the "Console" tab
4. Copy and paste this script:

```javascript
(function() {
  // Find the save button
  const saveButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent.includes('Save Token')
  );
  
  if (saveButtons.length === 0) {
    console.error('Could not find save button');
    return;
  }
  
  const saveButton = saveButtons[0];
  
  // Create textbox
  const textbox = document.createElement('input');
  textbox.type = 'text';
  textbox.id = 'emergency-textbox-fix';
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
  
  // Try to find a place to insert the textbox
  if (saveButton.parentNode) {
    // Insert before save button
    saveButton.parentNode.insertBefore(textbox, saveButton);
  } else {
    // Look for the token section by its title
    const sections = Array.from(document.querySelectorAll('div')).filter(div => 
      div.textContent.includes('Hugging Face API Token')
    );
    
    if (sections.length > 0) {
      // Add to the first matching section
      sections[0].prepend(textbox);
    } else {
      // Last resort: add to the body
      document.body.prepend(textbox);
    }
  }
  
  // Try to retrieve saved token
  const savedToken = localStorage.getItem('huggingface_token') || 
                     sessionStorage.getItem('huggingface_token');
  if (savedToken) {
    textbox.value = savedToken;
  }
  
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
  
  console.log('Manual textbox added successfully');
})();
```

5. Press Enter to run the script
6. The textbox should now appear above the Save Token button

## Option 2: Manual HTML Injection

If Option 1 doesn't work, you can try manually adding the HTML:

1. Open the Parameters page in your application
2. Open the browser developer tools (F12 or right-click > Inspect)
3. Click on the "Elements" tab
4. Find the button that says "Save Token Securely" (Ctrl+F or Cmd+F to search)
5. Right-click on the parent element of the button and select "Edit as HTML"
6. At the beginning of the HTML, add this line:

```html
<input type="text" id="manual-token-input" placeholder="Enter your Hugging Face API token here" style="width: 100%; padding: 12px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; margin-bottom: 15px; display: block; background-color: #fff;">
```

7. Press Enter to apply the changes
8. The textbox should now appear above the Save Token button

## Option 3: Create a Standalone Page

If both options above fail, you can use the standalone HTML page:

1. Open `/public/token-input-inline.html` in your browser
2. Enter your token in the field
3. Click "Save Token Securely"
4. Return to your application - it should now have the token stored in localStorage

## Checking If Token Was Saved

To verify that your token has been saved:

1. Open the browser developer tools (F12)
2. Click on the "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Expand "Local Storage" in the sidebar
4. Click on your domain
5. Look for a key named "huggingface_token"
6. If it shows your token, the save was successful

## Need More Help?

If you're still having issues, you can modify the TokenInputManualFallback.jsx component in your React application and add it directly to your Parameters page.
