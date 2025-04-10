/**
 * subscription-parameters-fix.js
 * Fix for input fields in Subscription Parameters page
 */

(function() {
  // Constants
  const DEBUG = true;
  const LOG_PREFIX = '[SubscriptionParametersFix]';
  
  // Helper for debug logs
  function debugLog(...args) {
    if (DEBUG) {
      console.log(LOG_PREFIX, ...args);
    }
  }
  
  // Initialize the fix
  function initialize() {
    debugLog('Initializing input field fixes');
    
    // Run on document load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyFixes);
    } else {
      applyFixes();
    }
    
    // Listen for hash changes to apply fixes when parameters page loads
    window.addEventListener('hashchange', function() {
      if (isParametersPage()) {
        debugLog('Hash changed to parameters page');
        applyFixes();
      }
    });
    
    // Create MutationObserver to watch for changes that would add the parameters form
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // If we're on the parameters page and see DOM mutations, check for our form
          if (isParametersPage() && !document.querySelector('.inputs-fixed')) {
            applyFixes();
          }
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    debugLog('Initialization complete');
  }
  
  // Check if we're on the parameters page
  function isParametersPage() {
    return window.location.hash.includes('/subscribe/parameters') || 
           document.querySelector('.huggingface-token-section') !== null;
  }
  
  // Apply fixes to input fields
  function applyFixes() {
    debugLog('Applying input field fixes');
    
    // Inject CSS fixes
    injectStyles();
    
    // Fix for Hugging Face token input
    fixTokenInput();
    
    // Fix for other parameter inputs
    fixParameterInputs();
    
    // Mark that we've applied fixes
    const paramContainer = document.querySelector('.subscription-step');
    if (paramContainer) {
      paramContainer.classList.add('inputs-fixed');
      debugLog('Added inputs-fixed class to container');
    }
  }

  // Fix Hugging Face token input
  function fixTokenInput() {
    const tokenInputContainer = document.querySelector('.huggingface-token-section');
    
    if (!tokenInputContainer) {
      debugLog('Token input container not found');
      return;
    }
    
    // Find the token input
    let tokenInput = tokenInputContainer.querySelector('input');
    
    if (!tokenInput) {
      debugLog('Token input not found');
      return;
    }
    
    // Check if it's already been fixed
    if (tokenInput.hasAttribute('data-fixed')) {
      debugLog('Token input already fixed');
      return;
    }
    
    debugLog('Fixing token input field');
    
    // Clone the input to remove any potentially problematic event listeners
    const newInput = tokenInput.cloneNode(true);
    
    // Add our own event listener to ensure it works
    newInput.addEventListener('input', function(e) {
      // Dispatch input event correctly
      const event = new Event('input', { bubbles: true });
      e.target.dispatchEvent(event);
      
      // Try to manually trigger React change handler
      if (typeof window.reactTokenChangeHandler === 'function') {
        window.reactTokenChangeHandler(e.target.value);
      }
      
      debugLog('Token input value changed:', e.target.value.substr(0, 3) + '***');
    });
    
    // Replace the original input
    tokenInput.parentNode.replaceChild(newInput, tokenInput);
    
    // Mark as fixed
    newInput.setAttribute('data-fixed', 'true');
    
    // Ensure input is enabled and not read-only
    newInput.readOnly = false;
    newInput.disabled = false;
    
    // Remove any potential event blockers
    newInput.parentNode.style.pointerEvents = 'auto';
    newInput.parentNode.parentNode.style.pointerEvents = 'auto';
    
    debugLog('Token input field fixed');
  }
  
  // Fix parameter inputs (sliders, number inputs)
  function fixParameterInputs() {
    // Fix range sliders
    const sliders = document.querySelectorAll('input[type="range"]');
    
    if (sliders.length > 0) {
      debugLog(`Found ${sliders.length} sliders to fix`);
      
      sliders.forEach((slider, index) => {
        // Skip if already fixed
        if (slider.hasAttribute('data-fixed')) {
          return;
        }
        
        // Clone to remove potential event blockers
        const newSlider = slider.cloneNode(true);
        
        // Add direct event handler
        newSlider.addEventListener('input', function(e) {
          // Dispatch input event correctly
          const event = new Event('input', { bubbles: true });
          e.target.dispatchEvent(event);
          
          debugLog(`Slider ${index} value changed:`, e.target.value);
          
          // Update visual style to match value
          const value = parseFloat(e.target.value);
          const min = parseFloat(e.target.min || '0');
          const max = parseFloat(e.target.max || '100');
          const percentage = ((value - min) / (max - min)) * 100;
          
          // Apply gradient to show slider position
          e.target.style.background = `linear-gradient(to right, #1976d2 0%, #1976d2 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        });
        
        // Replace the original slider
        slider.parentNode.replaceChild(newSlider, slider);
        
        // Mark as fixed
        newSlider.setAttribute('data-fixed', 'true');
        
        // Initialize the gradient
        const value = parseFloat(newSlider.value);
        const min = parseFloat(newSlider.min || '0');
        const max = parseFloat(newSlider.max || '100');
        const percentage = ((value - min) / (max - min)) * 100;
        newSlider.style.background = `linear-gradient(to right, #1976d2 0%, #1976d2 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
      });
    }
    
    // Fix number inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    if (numberInputs.length > 0) {
      debugLog(`Found ${numberInputs.length} number inputs to fix`);
      
      numberInputs.forEach((input, index) => {
        // Skip if already fixed
        if (input.hasAttribute('data-fixed')) {
          return;
        }
        
        // Clone to remove potential event blockers
        const newInput = input.cloneNode(true);
        
        // Add direct event handler
        newInput.addEventListener('input', function(e) {
          // Dispatch input event correctly
          const event = new Event('input', { bubbles: true });
          e.target.dispatchEvent(event);
          
          debugLog(`Number input ${index} value changed:`, e.target.value);
        });
        
        // Replace the original input
        input.parentNode.replaceChild(newInput, input);
        
        // Mark as fixed
        newInput.setAttribute('data-fixed', 'true');
      });
    }
  }
  
  // Add CSS fixes
  function injectStyles() {
    const existingStyles = document.getElementById('subscription-parameters-fix-styles');
    
    if (existingStyles) {
      debugLog('Styles already injected');
      return;
    }
    
    debugLog('Injecting styles');
    
    const styles = document.createElement('style');
    styles.id = 'subscription-parameters-fix-styles';
    
    styles.textContent = `
      /* Fix for input fields that may be blocked */
      .huggingface-token-section input {
        pointer-events: auto !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      /* Improved slider styling */
      input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 5px;
        background: linear-gradient(to right, #1976d2 0%, #1976d2 50%, #e0e0e0 50%, #e0e0e0 100%);
        outline: none;
        transition: background 0.1s;
      }
      
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #1976d2;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      
      input[type="range"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #1976d2;
        cursor: pointer;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      
      /* Fix for containers that may have pointer-events disabled */
      .subscription-step {
        pointer-events: auto !important;
      }
      
      /* Improved token input field styling */
      .huggingface-token-section input {
        width: 100%;
        padding: 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      .huggingface-token-section input:focus {
        border-color: #1976d2;
        outline: none;
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
      }
    `;
    
    document.head.appendChild(styles);
    debugLog('Styles injected');
  }
  
  // Start the fix
  initialize();
  
})(window);