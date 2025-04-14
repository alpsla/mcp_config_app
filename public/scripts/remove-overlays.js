/**
 * Script to remove token overlay and preset form elements
 */
document.addEventListener('DOMContentLoaded', function() {
  // Function to remove elements
  function removeElements() {
    // Remove token overlay
    const tokenOverlay = document.getElementById('token-entry-overlay');
    if (tokenOverlay) {
      tokenOverlay.remove();
    }
    
    // Remove all elements with token in the ID
    document.querySelectorAll('[id*="token-entry"], [id*="direct-token"]').forEach(el => {
      el.remove();
    });
    
    // Remove preset elements
    document.querySelectorAll('[id*="preset"], [class*="preset"]').forEach(el => {
      el.remove();
    });
    
    // Remove any elements created by Dashlane
    document.querySelectorAll('[data-dashlane-rid], [data-dashlanecreated], [data-kwimpalastatus], [data-kwimpalaid]').forEach(el => {
      el.remove();
    });
    
    // Find and remove elements containing "Save Parameters as Preset" text
    document.querySelectorAll('h4, p, div, form, label').forEach(el => {
      if (el.textContent.includes('Save Parameters as Preset') || 
          el.textContent.includes('Enable preset') ||
          el.textContent.includes('Save these parameters')) {
        // Find the parent container and remove it
        let parent = el;
        // Look up to 3 levels up to find a suitable container
        for (let i = 0; i < 3; i++) {
          if (parent.parentElement) {
            parent = parent.parentElement;
          }
        }
        parent.remove();
      }
    });
  }
  
  // Run immediately
  removeElements();
  
  // Also run periodically to catch dynamically added elements
  setInterval(removeElements, 500);
  
  // Run on any DOM changes
  const observer = new MutationObserver(function(mutations) {
    removeElements();
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
});
