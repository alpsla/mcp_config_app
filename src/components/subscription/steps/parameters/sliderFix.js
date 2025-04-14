/**
 * This script fixes the slider styling issues to ensure the slider heads
 * are synchronized with the blue progress lines.
 */

// This function updates the background gradient of range sliders
function updateSliderTrack(slider) {
  const value = parseFloat(slider.value);
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Update the slider's background to show the blue track up to the current value
  slider.style.background = `linear-gradient(to right, #1976D2 0%, #1976D2 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
}

// Initialize all sliders when the page loads
function initializeSliders() {
  // Get all range inputs
  const sliders = document.querySelectorAll('input[type="range"]');
  
  // Process each slider
  sliders.forEach(slider => {
    // Set initial background
    updateSliderTrack(slider);
    
    // Update background when slider value changes
    slider.addEventListener('input', function() {
      updateSliderTrack(this);
    });
  });
}

// Run when page loads
document.addEventListener('DOMContentLoaded', initializeSliders);

// Also run when any DOM changes occur (for dynamically added sliders)
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      // Check if any sliders were added
      const addedSliders = Array.from(mutation.addedNodes)
        .filter(node => node.nodeType === Node.ELEMENT_NODE)
        .flatMap(element => 
          element.querySelectorAll ? Array.from(element.querySelectorAll('input[type="range"]')) : []
        );
      
      if (addedSliders.length > 0) {
        addedSliders.forEach(updateSliderTrack);
      }
    }
  });
});

// Start observing the document with all configuration
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Additional fix to ensure textboxes are accessible
function makeTextboxesAccessible() {
  // Find all text inputs that might need accessibility improvements
  const textboxes = document.querySelectorAll('input[type="text"]');
  
  textboxes.forEach(textbox => {
    // Ensure the textbox has an ID
    if (!textbox.id) {
      textbox.id = `textbox-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Find a nearby label element
    const parentElement = textbox.parentElement;
    const siblingLabel = parentElement.querySelector('label');
    
    // If there's a label but it's not connected to the textbox
    if (siblingLabel && !siblingLabel.htmlFor) {
      siblingLabel.htmlFor = textbox.id;
    }
    
    // Make sure textbox has an aria-label if it doesn't have a label
    if (!siblingLabel && !textbox.getAttribute('aria-label')) {
      // Try to guess a label from placeholder or context
      let labelText = textbox.placeholder || 'Input field';
      
      if (parentElement.textContent) {
        // Use first few words of parent text as label
        const parentText = parentElement.textContent.trim().split(' ').slice(0, 3).join(' ');
        if (parentText) {
          labelText = parentText;
        }
      }
      
      textbox.setAttribute('aria-label', labelText);
    }
  });
}

// Run the textbox accessibility fix when DOM is loaded
document.addEventListener('DOMContentLoaded', makeTextboxesAccessible);

// Also run it when DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});