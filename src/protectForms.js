/**
 * Global form protection script
 * This script runs once when loaded and ensures that forms with specific data-testid attributes
 * always remain visible regardless of any other scripts trying to hide them.
 */

(function() {
  console.log('Global form protection: Initializing...');
  
  // List of form test IDs to protect
  const PROTECTED_FORM_IDS = ['profile-form'];
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Global form protection: DOM loaded');
    
    // Create a style tag to ensure forms remain visible
    const styleEl = document.createElement('style');
    styleEl.id = 'global-form-protection';
    
    // Build CSS rules for each protected form
    let cssRules = '';
    PROTECTED_FORM_IDS.forEach(formId => {
      cssRules += `
        /* Protection for ${formId} */
        [data-testid="${formId}"] {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          height: auto !important;
          position: static !important;
        }
        
        [data-testid="${formId}"] * {
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        [data-testid="${formId}"] .form-row {
          display: flex !important;
        }
        
        [data-testid="${formId}"] .form-group {
          display: block !important;
          flex: 1 !important;
        }
        
        [data-testid="${formId}"] label {
          display: block !important;
        }
        
        [data-testid="${formId}"] input {
          display: block !important;
          width: 100% !important;
        }
      `;
    });
    
    styleEl.textContent = cssRules;
    document.head.appendChild(styleEl);
    console.log('Global form protection: CSS protection added');
    
    // Set up a mutation observer to detect when protected forms are added
    const protectForms = () => {
      PROTECTED_FORM_IDS.forEach(formId => {
        const form = document.querySelector(`[data-testid="${formId}"]`);
        if (form && form instanceof HTMLElement) {
          // Force visibility properties
          form.style.setProperty('display', 'block', 'important');
          form.style.setProperty('visibility', 'visible', 'important');
          form.style.setProperty('opacity', '1', 'important');
          
          // Also protect child elements
          const children = form.querySelectorAll('*');
          children.forEach(child => {
            if (child instanceof HTMLElement) {
              child.style.setProperty('visibility', 'visible', 'important');
              child.style.setProperty('opacity', '1', 'important');
              
              // Handle specific element types
              if (child.classList.contains('form-row')) {
                child.style.setProperty('display', 'flex', 'important');
              } else if (child.tagName === 'INPUT' || child.tagName === 'LABEL') {
                child.style.setProperty('display', 'block', 'important');
              }
            }
          });
        }
      });
    };
    
    // Run protection immediately
    protectForms();
    
    // And set up an interval to continually check and fix the forms
    setInterval(protectForms, 500);
    
    // Also override some DOM methods to prevent form hiding
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
      // Check if this is a protected element
      const isProtected = PROTECTED_FORM_IDS.some(id => {
        const form = document.querySelector(`[data-testid="${id}"]`);
        return form && (this === form || form.contains(this));
      });
      
      if (isProtected) {
        // Block style changes that would hide the element
        if (name === 'style' && 
            (value.includes('display: none') || 
             value.includes('visibility: hidden') || 
             value.includes('opacity: 0'))) {
          console.log('Global form protection: Blocked setAttribute that would hide protected element', this);
          // Don't apply this style change
          return;
        }
      }
      
      // Otherwise, use the original setAttribute method
      return originalSetAttribute.call(this, name, value);
    };
    
    console.log('Global form protection: DOM method overrides applied');
  });
})();