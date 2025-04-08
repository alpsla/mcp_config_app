// This script injects styles directly into the page to improve the parameters UI
// Add this to the public directory or directly to the HTML

(function() {
  // Wait for the document to be loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }

  // Listen for hash changes to apply styles when parameters page loads
  window.addEventListener('hashchange', function() {
    if (window.location.hash.includes('/subscribe/parameters')) {
      injectStyles();
    }
  });

  function injectStyles() {
    // Only apply to parameters page
    if (!window.location.hash.includes('/subscribe/parameters')) {
      return;
    }

    // Remove any existing styles
    const existingStyle = document.getElementById('parameters-page-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create a new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'parameters-page-styles';
    
    // Define enhanced styles
    styleElement.innerHTML = `
      /* Main container styling */
      .subscription-step, div[style*="max-width: 900px"] {
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
      .subscription-step::before, div[style*="max-width: 900px"]::before {
        content: "" !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 8px !important;
        background: linear-gradient(to right, #1976d2, rgba(25, 118, 210, 0.8)) !important;
      }
      
      /* Header styling */
      h2 {
        font-size: 28px !important;
        margin: 20px 0 15px !important;
        color: #333 !important;
        font-weight: 600 !important;
        text-align: center !important;
      }
      
      p[style*="margin: 0 auto"] {
        text-align: center !important;
        color: #666 !important;
        max-width: 650px !important;
        margin: 0 auto 30px !important;
      }
      
      /* Parameter section styling */
      div[style*="backgroundColor: #FAFAFA"] {
        background-color: #f8f9fa !important;
        border-radius: 10px !important;
        padding: 20px !important;
        margin-bottom: 20px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        transition: all 0.3s ease !important;
      }
      
      div[style*="backgroundColor: #FAFAFA"]:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
      }
      
      /* Hugging Face token section */
      div[style*="backgroundColor: #F0F7FF"] {
        background-color: #f0f7ff !important;
        padding: 25px !important;
        border-radius: 10px !important;
        border: 1px solid #bbdefb !important;
        margin: 30px 0 !important;
      }
      
      /* Token input styling */
      input[placeholder*="Enter your Hugging Face API token"] {
        width: 100% !important;
        padding: 12px !important;
        border-radius: 4px !important;
        border: 1px solid #ccc !important;
        font-size: 15px !important;
        margin-bottom: 10px !important;
        transition: all 0.2s ease !important;
      }
      
      input[placeholder*="Enter your Hugging Face API token"]:focus {
        border-color: #1976d2 !important;
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
      }
      
      /* Security message */
      div[style*="backgroundColor: #E8F5E9"] {
        background-color: #e8f5e9 !important;
        padding: 12px 15px !important;
        border-radius: 4px !important;
        margin: 15px 0 !important;
        display: flex !important;
        align-items: center !important;
        border-left: 3px solid #4caf50 !important;
      }
      
      /* Token steps list */
      ol {
        margin-left: 25px !important;
        padding: 0 !important;
      }
      
      ol li {
        margin-bottom: 8px !important;
        color: #444 !important;
        font-size: 14px !important;
      }
      
      /* Section headers */
      h3 {
        font-size: 20px !important;
        color: #333 !important;
        margin: 30px 0 15px !important;
        padding-bottom: 8px !important;
        border-bottom: 2px solid #e0e0e0 !important;
      }
      
      /* Range sliders */
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
      
      /* Descriptions with more breathing room */
      div[style*="backgroundColor: #f1f8ff"] {
        background-color: #f1f8ff !important;
        padding: 15px !important;
        border-radius: 6px !important;
        font-size: 14px !important;
        color: #555 !important;
        margin-top: 15px !important;
        line-height: 1.5 !important;
      }
      
      /* Action buttons */
      div[style*="margin-top: 30px"] {
        margin-top: 40px !important;
        padding-top: 20px !important;
        border-top: 1px solid #e0e0e0 !important;
      }
      
      button[style*="backgroundColor: #1976d2"] {
        background-color: #1976d2 !important;
        color: white !important;
        border: none !important;
        border-radius: 6px !important;
        padding: 12px 28px !important;
        font-size: 16px !important;
        font-weight: bold !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      
      button[style*="backgroundColor: #1976d2"]:hover {
        background-color: #1565c0 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
      
      button[style*="backgroundColor: #fff"] {
        padding: 12px 24px !important;
        background-color: #f5f5f5 !important;
        color: #333 !important;
        border: 1px solid #ddd !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 16px !important;
        transition: all 0.2s ease !important;
      }
      
      button[style*="backgroundColor: #fff"]:hover {
        background-color: #e0e0e0 !important;
      }
      
      /* Links */
      a {
        color: #1976d2 !important;
        text-decoration: none !important;
        transition: all 0.2s ease !important;
      }
      
      a:hover {
        text-decoration: underline !important;
      }
      
      /* Toggle switch improvements */
      span[style*="position: absolute"] {
        box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
      }
      
      /* Advanced parameters spacing */
      div > div > div > div:last-child h3 {
        margin-top: 40px !important;
      }
      
      /* Preset section formatting */
      div > div > div > div:last-child h4 {
        font-size: 18px !important;
        color: #333 !important;
        margin: 25px 0 10px !important;
      }
      
      /* Custom form elements */
      input[type="checkbox"] {
        width: 18px !important;
        height: 18px !important;
        margin-right: 8px !important;
      }
      
      input[type="text"][name="presetName"] {
        padding: 10px 12px !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        margin-right: 10px !important;
      }
      
      /* Button formatting */
      form button[type="button"] {
        padding: 10px 16px !important;
        background-color: #1976d2 !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      
      form button[type="button"]:hover {
        background-color: #1565c0 !important;
      }
      
      /* Top P and Top K sliders */
      input[type="range"][min="0.1"][max="1"],
      input[type="range"][min="1"][max="100"] {
        background: linear-gradient(to right, #1976d2 0%, #1976d2 50%, #e0e0e0 50%, #e0e0e0 100%) !important;
      }
    `;
    
    // Add the styles to the document head
    document.head.appendChild(styleElement);
    
    console.log('Parameter page styles injected!');

    // Create a mutation observer to wait for the specific elements to appear
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // Check if there are any divs with the backgroundColor: #FAFAFA style
          const parameterSections = document.querySelectorAll('div[style*="backgroundColor: #FAFAFA"]');
          if (parameterSections.length > 0) {
            // Add specific styles to improve visual elements
            enhanceVisualElements();
            observer.disconnect(); // Stop observing once we've found and enhanced the elements
          }
        }
      });
    });

    // Start observing changes to the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    function enhanceVisualElements() {
      // Find and enhance slider values
      const sliders = document.querySelectorAll('input[type="range"]');
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
    }
  }
})();
