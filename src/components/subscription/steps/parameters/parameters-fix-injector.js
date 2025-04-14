/**
 * This script injects the fix for the parameters page
 * It should be included in the index.html file or loaded via the router
 */

(function() {
  console.log("Parameters fix injector initialized");
  
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFixer);
  } else {
    initializeFixer();
  }
  
  // Monitor for hash changes to apply the fix when parameters page is loaded
  window.addEventListener('hashchange', handleRouteChange);
  
  function initializeFixer() {
    console.log("Initializing parameters page fixer");
    
    // Check if we're on the parameters page on initial load
    if (window.location.hash.includes('subscribe/parameters')) {
      applyParametersFix();
    }
    
    // Create an observer to watch for DOM changes that might indicate
    // the parameters page has been rendered dynamically
    const bodyObserver = new MutationObserver(function(mutations) {
      // Check if we're on the parameters page
      if (window.location.hash.includes('subscribe/parameters')) {
        const parameterContainers = document.querySelectorAll('.parameters-container');
        if (parameterContainers.length > 0) {
          console.log("Parameters container detected, applying fix");
          applyParametersFix();
        }
      }
    });
    
    // Start observing the body for changes
    bodyObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
  
  function handleRouteChange() {
    console.log("Hash changed to:", window.location.hash);
    // Check if we're now on the parameters page
    if (window.location.hash.includes('subscribe/parameters')) {
      // Short delay to ensure the page has been rendered
      setTimeout(applyParametersFix, 100);
    }
  }
  
  function applyParametersFix() {
    console.log("Applying parameters fix");
    
    // Import the parameters-fix script dynamically
    const script = document.createElement('script');
    script.src = 'components/subscription/parameters-fix.js';
    script.id = 'parameters-fix-script';
    
    // Don't add the script multiple times
    if (!document.getElementById('parameters-fix-script')) {
      document.head.appendChild(script);
      console.log("Parameters fix script injected");
    }
    
    // Load CSS fixes
    const style = document.createElement('style');
    style.id = 'parameters-css-fixes';
    style.textContent = `
      /* Parameters container styling */
      .parameters-container {
        max-width: 900px !important;
        margin: 30px auto !important;
        background-color: white !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
        border: 1px solid #e3f2fd !important;
        padding: 40px !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      /* Header styling */
      .parameters-container h2 {
        font-size: 28px !important;
        margin: 0 0 10px 0 !important;
        color: #333 !important;
        font-weight: 600 !important;
      }
      
      /* Slider improvements */
      .parameter-sliders {
        max-width: 650px !important;
        margin: 0 auto 30px !important;
      }
      
      /* Make sure UI elements are visible */
      .parameters-content {
        max-width: 650px !important;
        margin: 0 auto !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
      
      /* Fix for advanced parameters */
      .advanced-parameters h3 {
        margin-top: 40px !important;
      }
      
      /* Ensure images and icons are visible */
      .parameters-icon {
        font-size: 30px !important;
        display: inline-block !important;
      }
      
      /* Fix for navigation buttons */
      .navigation-buttons {
        margin-top: 30px !important;
        padding-top: 20px !important;
        border-top: 1px solid #f0f0f0 !important;
        display: flex !important;
        justify-content: space-between !important;
      }
      
      /* Fix for token input */
      input[placeholder="Enter your Hugging Face API token"] {
        width: 100% !important;
        padding: 12px !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        margin-bottom: 10px !important;
      }
    `;
    
    // Don't add the style multiple times
    if (!document.getElementById('parameters-css-fixes')) {
      document.head.appendChild(style);
      console.log("Parameters CSS fixes injected");
    }
    
    // Apply direct DOM fixes after a short delay to ensure the page is rendered
    setTimeout(function() {
      const containerElement = document.querySelector('.parameters-container');
      if (containerElement) {
        console.log("Found parameters container, applying direct DOM fixes");
        
        // Ensure the content is visible
        const contentElement = containerElement.querySelector('.parameters-content');
        if (contentElement) {
          contentElement.style.opacity = '1';
          contentElement.style.pointerEvents = 'auto';
        }
        
        // Ensure sliders work properly
        const sliders = containerElement.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
          const value = parseFloat(slider.value);
          const min = parseFloat(slider.getAttribute('min') || '0');
          const max = parseFloat(slider.getAttribute('max') || '1');
          const percentage = ((value - min) / (max - min)) * 100;
          
          // Update the background gradient to reflect the current value
          slider.style.background = `linear-gradient(to right, #1976d2 0%, #1976d2 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
          
          // Add event listener to update gradient when value changes
          slider.addEventListener('input', () => {
            const newValue = parseFloat(slider.value);
            const newPercentage = ((newValue - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, #1976d2 0%, #1976d2 ${newPercentage}%, #e0e0e0 ${newPercentage}%, #e0e0e0 100%)`;
          });
        });
        
        console.log("Direct DOM fixes applied");
      } else {
        console.log("Parameters container not found");
      }
    }, 200);
  }
})();