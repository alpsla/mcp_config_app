/**
 * This script fixes the parameters page in the subscription flow
 * It adds essential CSS styles and initializes event handlers
 */

(function() {
  console.log("Subscription parameters fix script loaded");
  
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFix);
  } else {
    initFix();
  }
  
  // Watch for route changes to apply the fix when parameters page is loaded
  window.addEventListener('hashchange', function() {
    console.log('Hash changed, checking if parameters page');
    if (window.location.hash.includes('/subscribe/parameters')) {
      console.log('Parameters page detected, applying fix');
      applyFix();
    }
  });
  
  function initFix() {
    // Check if we're on the parameters page on initial load
    if (window.location.hash.includes('/subscribe/parameters')) {
      console.log('Parameters page detected on initial load, applying fix');
      applyFix();
    }
    
    // Create an observer to watch for DOM changes
    initObserver();
  }
  
  function initObserver() {
    // Create a MutationObserver to detect when the parameters content is added to the DOM
    const observer = new MutationObserver(function(mutations) {
      // Check if we're on the parameters page
      if (window.location.hash.includes('/subscribe/parameters')) {
        // Look for parameters container
        const paramContainer = document.querySelector('.parameters-container');
        if (paramContainer && !paramContainer.hasAttribute('data-fixed')) {
          console.log('Parameters container found, applying fix');
          applyFix();
          
          // Mark the container as fixed to avoid applying fixes multiple times
          paramContainer.setAttribute('data-fixed', 'true');
        }
      }
    });
    
    // Start observing the body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  function applyFix() {
    // Add the CSS fixes
    addStyles();
    
    // Short delay to ensure the DOM has fully rendered
    setTimeout(function() {
      // Apply direct DOM fixes
      fixContainer();
      fixHeaders();
      fixSliders();
      fixAdvancedSection();
      fixButton();
      
      console.log('All fixes applied to parameters page');
    }, 200);
  }
  
  function addStyles() {
    // Check if our styles have already been added
    if (document.getElementById('parameters-fix-styles')) {
      return;
    }
    
    // Create a style element
    const styleEl = document.createElement('style');
    styleEl.id = 'parameters-fix-styles';
    
    // Add the CSS fixes
    styleEl.textContent = `
      /* Container fixes */
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
      
      /* Blue top bar */
      .parameters-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 8px;
        background: linear-gradient(to right, #1976d2, rgba(25, 118, 210, 0.8));
        z-index: 1;
      }
      
      /* Header styling */
      .parameters-header {
        text-align: center;
        margin-bottom: 40px !important;
      }
      
      .parameters-icon-container {
        width: 70px !important;
        height: 70px !important;
        border-radius: 50% !important;
        background-color: #E3F2FD !important;
        color: #1976D2 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 auto 20px !important;
      }
      
      .parameters-icon {
        font-size: 30px !important;
      }
      
      .parameters-title {
        font-size: 28px !important;
        margin: 0 0 10px 0 !important;
        color: #333 !important;
        font-weight: 600 !important;
      }
      
      .parameters-description {
        margin: 0 auto !important;
        color: #666 !important;
        font-size: 16px !important;
        max-width: 600px !important;
      }
      
      /* Content area */
      .parameters-content {
        max-width: 650px !important;
        margin: 0 auto !important;
        opacity: 1 !important; /* Ensure content is visible */
        pointer-events: auto !important; /* Ensure content is interactive */
      }
      
      /* Parameter sliders */
      .parameter-sliders {
        transition: opacity 0.3s ease !important;
      }
      
      /* Range slider styling */
      input[type="range"] {
        height: 6px !important;
        border-radius: 5px !important;
        outline: none !important;
        appearance: none !important;
        cursor: pointer !important;
        width: 100% !important;
        margin: 10px 0 !important;
      }
      
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        width: 18px !important;
        height: 18px !important;
        border-radius: 50% !important;
        background: #1976d2 !important;
        cursor: pointer !important;
        border: 2px solid white !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
      }
      
      /* HF Token section */
      .huggingface-token-section {
        margin-top: 30px !important;
        margin-bottom: 20px !important;
        background-color: #F0F7FF !important;
        padding: 20px !important;
        border-radius: 10px !important;
        border: 1px solid #BBDEFB !important;
      }
      
      /* Token input */
      .token-input {
        width: 100% !important;
        padding: 12px !important;
        border-radius: 4px !important;
        border: 1px solid #ccc !important;
        font-size: 14px !important;
        margin-bottom: 10px !important;
      }
      
      /* Advanced parameters section */
      .advanced-parameters {
        margin-top: 30px !important;
      }
      
      .advanced-parameters-header {
        font-size: 18px !important;
        color: #444 !important;
        margin-bottom: 15px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
      }
      
      /* Navigation buttons */
      .navigation-buttons {
        display: flex !important;
        justify-content: space-between !important;
        margin-top: 40px !important;
        padding-top: 20px !important;
        border-top: 1px solid #f0f0f0 !important;
      }
      
      .back-button {
        padding: 12px 24px !important;
        background-color: #fff !important;
        color: #333 !important;
        border: 1px solid #ddd !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 16px !important;
        transition: all 0.2s ease !important;
      }
      
      .next-button {
        padding: 12px 28px !important;
        background-color: #1976d2 !important;
        color: white !important;
        border: none !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 16px !important;
        font-weight: bold !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        transition: all 0.2s ease !important;
      }
      
      /* Make sure all elements are visible when needed */
      input:disabled,
      button:disabled {
        opacity: 0.7 !important;
        cursor: not-allowed !important;
      }
      
      /* Input styles */
      input[type="number"] {
        width: 60px !important;
        padding: 5px !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        text-align: center !important;
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .parameters-container {
          margin: 20px !important;
          padding: 30px 20px !important;
        }
      }
    `;
    
    // Add the style element to the document head
    document.head.appendChild(styleEl);
    console.log('Parameter page styles added');
  }
  
  function fixContainer() {
    const container = document.querySelector('.parameters-container');
    if (!container) {
      console.log('Container not found');
      return;
    }
    
    // Make sure the container is visible
    container.style.opacity = '1';
    container.style.display = 'block';
    console.log('Container visibility ensured');
  }
  
  function fixHeaders() {
    const header = document.querySelector('.parameters-header');
    if (!header) {
      console.log('Header not found');
      return;
    }
    
    // Make sure the icon is visible
    const icon = header.querySelector('.parameters-icon');
    if (icon) {
      icon.innerHTML = '⚙️';
      icon.style.opacity = '1';
      icon.style.fontSize = '30px';
    }
    
    console.log('Header elements fixed');
  }
  
  function fixSliders() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
      // Ensure sliders work by fixing their appearance
      const value = parseFloat(slider.value);
      const min = parseFloat(slider.getAttribute('min') || '0');
      const max = parseFloat(slider.getAttribute('max') || '1');
      const percentage = ((value - min) / (max - min)) * 100;
      
      // Set the gradient background to reflect the current value
      slider.style.background = `linear-gradient(to right, #1976d2 0%, #1976d2 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
      
      // Add event listener to update the background when the value changes
      slider.addEventListener('input', () => {
        const newValue = parseFloat(slider.value);
        const newPercentage = ((newValue - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, #1976d2 0%, #1976d2 ${newPercentage}%, #e0e0e0 ${newPercentage}%, #e0e0e0 100%)`;
      });
      
      console.log('Slider fixed:', slider);
    });
  }
  
  function fixAdvancedSection() {
    const advancedSection = document.querySelector('.advanced-parameters');
    if (!advancedSection) {
      console.log('Advanced section not found');
      return;
    }
    
    // Make sure the section is visible
    advancedSection.style.display = 'block';
    advancedSection.style.opacity = '1';
    
    console.log('Advanced parameters section fixed');
  }
  
  function fixButton() {
    // Fix navigation buttons
    const buttons = document.querySelectorAll('.navigation-buttons button');
    buttons.forEach(button => {
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
      console.log('Button fixed:', button);
    });
  }
})();