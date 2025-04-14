/**
 * Emergency DOM Protection
 * This script blocks any attempts to hide form elements by overriding
 * critical DOM methods before any other scripts can run
 */
(function() {
  // Run this code IMMEDIATELY
  console.log("🛡️ DOM Protection: Installing emergency protections...");
  
  // ----- CRITICAL DOM METHOD OVERRIDES -----
  
  // Save original methods
  const originalSetAttribute = Element.prototype.setAttribute;
  const originalRemoveAttribute = Element.prototype.removeAttribute;
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  const originalRemoveProperty = CSSStyleDeclaration.prototype.removeProperty;
  const originalAddClass = DOMTokenList.prototype.add;
  const originalRemoveClass = DOMTokenList.prototype.remove;
  
  // Protect setAttribute from hiding elements
  Element.prototype.setAttribute = function(name, value) {
    // Block any attempts to hide elements via style attribute
    if (name === 'style' && 
        (value.includes('display: none') || 
         value.includes('visibility: hidden') || 
         value.includes('opacity: 0'))) {
      
      // Check if this is a form-related element
      if (this.closest('.subscription-form') || 
          this.closest('form') ||
          this.classList.contains('form-group') ||
          this.classList.contains('form-row') ||
          this.nodeName === 'INPUT' ||
          this.nodeName === 'LABEL' ||
          this.nodeName === 'BUTTON') {
        
        console.log("🛡️ Blocked attempt to hide form element via setAttribute", this);
        return; // Don't apply the style
      }
    }
    
    // Otherwise proceed normally
    return originalSetAttribute.call(this, name, value);
  };
  
  // Protect style.setProperty from hiding elements
  CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
    // Block attempts to hide elements through CSS properties
    if ((propertyName === 'display' && value === 'none') || 
        (propertyName === 'visibility' && value === 'hidden') || 
        (propertyName === 'opacity' && parseFloat(value) === 0)) {
      
      // Check if this is a form-related element
      const element = this.parentElement || document.querySelector(`[style*="${this}"]`);
      if (element && (
          element.closest('.subscription-form') || 
          element.closest('form') ||
          element.classList.contains('form-group') ||
          element.classList.contains('form-row') ||
          element.nodeName === 'INPUT' ||
          element.nodeName === 'LABEL' ||
          element.nodeName === 'BUTTON')) {
        
        console.log("🛡️ Blocked attempt to hide form element via setProperty", propertyName, value);
        return; // Don't apply the style
      }
    }
    
    // Otherwise proceed normally
    return originalSetProperty.call(this, propertyName, value, priority);
  };
  
  // Override form element style setters directly
  const protectElement = (element) => {
    // Protect critical properties from being set directly
    ['display', 'visibility', 'opacity'].forEach(prop => {
      let originalValue = element.style[prop];
      Object.defineProperty(element.style, prop, {
        get: function() {
          return originalValue;
        },
        set: function(value) {
          // Block attempts to hide the element
          if ((prop === 'display' && value === 'none') || 
              (prop === 'visibility' && value === 'hidden') || 
              (prop === 'opacity' && parseFloat(value) === 0)) {
            console.log(`🛡️ Blocked attempt to hide form element via style.${prop}`, element);
            return;
          }
          originalValue = value;
        },
        configurable: true // Allow this to be re-defined if needed
      });
    });
  };
  
  // Override the createElement method to apply protections to new elements
  const originalCreateElement = document.createElement;
  document.createElement = function() {
    const element = originalCreateElement.apply(this, arguments);
    // Apply protection to the new element
    protectElement(element);
    return element;
  };
  
  // Function to find and protect all form elements
  const protectFormElements = () => {
    // Find all form-related elements
    const formElements = document.querySelectorAll(
      '.subscription-form, form, .form-group, .form-row, input, label, button, .step-actions'
    );
    
    // Apply protection to each element
    formElements.forEach(protectElement);
    
    console.log(`🛡️ Protected ${formElements.length} form elements`);
  };
  
  // Apply protections as soon as the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      protectFormElements();
      
      // Set up a MutationObserver to protect new elements
      const observer = new MutationObserver((mutations) => {
        let shouldProtect = false;
        
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length > 0) {
            shouldProtect = true;
          }
        });
        
        if (shouldProtect) {
          protectFormElements();
        }
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  } else {
    // DOM already loaded, protect immediately
    protectFormElements();
  }
  
  console.log("🛡️ DOM Protection: Critical protections installed");
})();
