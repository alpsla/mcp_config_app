/**
 * QUICK FIX for Parameter Page issues
 * 
 * This script fixes the following issues:
 * 1. Save button appearing as a popup rather than inline with the form
 * 2. Hugging Face API Token header styling
 * 3. Accessibility issues with form controls
 * 
 * HOW TO USE:
 * - Include this script in your HTML file before closing body tag
 * - Or copy-paste it into browser console when on the Parameters page
 */

(function() {
  const applyFixes = () => {
    console.log("Applying Parameter Page fixes...");
    
    // Fix save button positioning
    fixSaveButton();
    
    // Fix Hugging Face header styling
    fixHuggingFaceHeader();
    
    // Fix accessibility issues
    enhanceAccessibility();
    
    console.log("Fixes applied successfully!");
  };
  
  // Function to find the Parameters page
  const isParametersPage = () => {
    return document.querySelector('.subscription-step') !== null &&
           document.querySelectorAll('h3').some(h => h.textContent.includes('Hugging Face'));
  };
  
  // Fix save button positioning
  const fixSaveButton = () => {
    // Find preset form container
    const presetContainer = Array.from(document.querySelectorAll('div'))
      .find(el => el.querySelector('h4') && 
             el.querySelector('h4').textContent.includes('Save as Preset'));
    
    if (!presetContainer) {
      console.warn("Preset container not found");
      return;
    }
    
    const presetForm = presetContainer.querySelector('form');
    if (!presetForm) {
      console.warn("Preset form not found");
      return;
    }
    
    // Fix form styling for horizontal layout
    presetForm.style.display = 'flex';
    presetForm.style.flexDirection = 'row';
    presetForm.style.alignItems = 'center';
    presetForm.style.gap = '10px';
    presetForm.style.width = '100%';
    
    // Find input and button
    const input = presetForm.querySelector('input[type="text"]');
    const button = presetForm.querySelector('button[type="submit"]');
    
    if (input && !input.parentElement.classList.contains('input-container')) {
      // Wrap input in container for proper sizing
      const inputContainer = document.createElement('div');
      inputContainer.style.flex = '1';
      inputContainer.style.maxWidth = '70%';
      inputContainer.classList.add('input-container');
      
      // Clone input to avoid DOM manipulation issues
      const newInput = input.cloneNode(true);
      
      // Copy any event listeners by replacing the input
      inputContainer.appendChild(newInput);
      input.parentNode.replaceChild(inputContainer, input);
    }
    
    if (button) {
      button.style.flexShrink = '0';
      button.style.marginLeft = '10px';
    }
    
    console.log("Save button positioning fixed");
  };
  
  // Fix Hugging Face header styling
  const fixHuggingFaceHeader = () => {
    const headers = Array.from(document.querySelectorAll('h3'))
      .filter(h => h.textContent.includes('Hugging Face'));
    
    headers.forEach(header => {
      header.style.margin = '0';
      header.style.fontSize = '16px';
      header.style.color = '#1976d2';
      header.style.paddingBottom = '8px';
      header.style.borderBottom = '2px solid #e0e0e0';
    });
    
    console.log(`Fixed ${headers.length} Hugging Face headers`);
  };
  
  // Enhance accessibility
  const enhanceAccessibility = () => {
    // Fix slider inputs
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach((slider, index) => {
      const sliderId = `fixed-slider-${index}`;
      slider.id = sliderId;
      
      // Find nearest label and connect it
      const nearestLabel = slider.closest('div').querySelector('label');
      if (nearestLabel) {
        nearestLabel.setAttribute('for', sliderId);
      }
      
      // Add aria attributes
      slider.setAttribute('aria-valuemin', slider.min);
      slider.setAttribute('aria-valuemax', slider.max);
      slider.setAttribute('aria-valuenow', slider.value);
      
      // Update the aria-valuenow when value changes
      slider.addEventListener('input', () => {
        slider.setAttribute('aria-valuenow', slider.value);
      });
    });
    
    // Fix text inputs
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach((input, index) => {
      if (!input.id) {
        input.id = `fixed-input-${index}`;
      }
      
      // Find nearest label
      const nearestLabel = input.closest('div').querySelector('label');
      if (nearestLabel && !nearestLabel.getAttribute('for')) {
        nearestLabel.setAttribute('for', input.id);
      }
    });
    
    console.log("Accessibility enhancements applied");
  };
  
  // Apply fixes when document is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (isParametersPage()) {
      applyFixes();
    } else {
      // Set up a mutation observer to detect when Parameters page loads
      const observer = new MutationObserver((mutations) => {
        if (isParametersPage()) {
          applyFixes();
          observer.disconnect();
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    }
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (isParametersPage()) {
        applyFixes();
      } else {
        // Set up mutation observer (same as above)
        const observer = new MutationObserver((mutations) => {
          if (isParametersPage()) {
            applyFixes();
            observer.disconnect();
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }
})();