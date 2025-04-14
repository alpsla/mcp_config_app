/**
 * disable-token-overlay.js
 * Completely disables the token overlay and preset saving functionality
 */

(function() {
  // Function to disable token overlays
  function disableTokenOverlays() {
    // Block creation of token overlay
    if (window.createTokenOverlay) {
      window.createTokenOverlay = function() { return null; };
    }
    
    // Remove any existing token overlays
    document.querySelectorAll('#token-entry-overlay').forEach(el => el.remove());
    
    // Remove any elements with position: fixed that look like overlays
    document.querySelectorAll('div').forEach(div => {
      const style = window.getComputedStyle(div);
      if (style.position === 'fixed' && 
          (style.zIndex === '9999' || parseInt(style.zIndex, 10) > 1000) && 
          style.right === '20px' && 
          style.top === '20px') {
        div.remove();
      }
    });
    
    // Block the direct token input script
    if (window.addDirectTokenInput) {
      window.addDirectTokenInput = function() { return null; };
    }
    
    // Remove specific token-related elements
    document.querySelectorAll(
      '#direct-token-input, ' +
      '#direct-token-save, ' +
      '#minimize-token-overlay, ' +
      '#token-submit-button, ' +
      '[id*="token-entry"]'
    ).forEach(el => el.remove());
  }
  
  // Function to disable preset saving
  function disablePresetSaving() {
    // Remove preset-related elements
    document.querySelectorAll(
      'form[data-dashlane-rid], ' +
      '[data-dashlane-created="true"], ' +
      '[data-kwimpalastatus], ' +
      '[data-kwimpalaid]'
    ).forEach(el => el.remove());
    
    // Find and remove any element containing preset-related text
    document.querySelectorAll('h4, div, p, form, label').forEach(el => {
      if (el.textContent && (
          el.textContent.includes('Save Parameters as Preset') ||
          el.textContent.includes('Save these parameters') ||
          el.textContent.includes('Enable preset saving')
      )) {
        // Get parent container and remove it
        let parent = el;
        for (let i = 0; i < 3 && parent.parentElement; i++) {
          parent = parent.parentElement;
        }
        parent.remove();
      }
    });
  }
  
  // Run both functions
  function runCleanup() {
    disableTokenOverlays();
    disablePresetSaving();
  }
  
  // Run on page load
  document.addEventListener('DOMContentLoaded', function() {
    runCleanup();
    // Run multiple times to catch dynamically added elements
    setTimeout(runCleanup, 500);
    setTimeout(runCleanup, 1000);
    setTimeout(runCleanup, 2000);
  });
  
  // Monitor DOM changes to catch dynamically added elements
  const observer = new MutationObserver(runCleanup);
  observer.observe(document.documentElement, { 
    childList: true, 
    subtree: true 
  });
  
  // Run on URL/hash changes (for SPAs)
  window.addEventListener('hashchange', runCleanup);
  
  // Add CSS to hide elements
  const style = document.createElement('style');
  style.textContent = `
    /* Hide token overlay */
    #token-entry-overlay,
    div[id*="token-entry-overlay"],
    div[style*="position: fixed"][style*="top: 20px"][style*="right: 20px"][style*="z-index: 9999"],
    #direct-token-input,
    #direct-token-save,
    div:has(> h4:contains("Save Parameters as Preset")),
    div:has(> p:contains("Save these parameters")),
    form[data-dashlane-rid],
    [data-dashlane-created="true"],
    [data-kwimpalastatus],
    [data-kwimpalaid],
    span[id^="1744379926365-"],
    input[name="presetName"],
    input[name="enablePreset"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      height: 0 !important;
      width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      min-height: 0 !important;
    }
  `;
  document.head.appendChild(style);
})();
