/**
 * Profile Form Fix
 * This script ensures the profile form remains visible at all times
 */
(function() {
  console.log('Profile form fix: Initializing...');
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile form fix: DOM loaded');
    
    // Create a style tag to ensure the profile form remains visible
    const styleEl = document.createElement('style');
    styleEl.id = 'profile-form-fix-styles';
    styleEl.textContent = `
      /* Ensure profile form is always visible */
      [data-testid="profile-form"],
      .subscription-form,
      #profile-form,
      form.subscription-form {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        position: static !important;
        overflow: visible !important;
      }
      
      [data-testid="profile-form"] *,
      .subscription-form *,
      form.subscription-form * {
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      [data-testid="profile-form"] .form-row,
      .subscription-form .form-row,
      form.subscription-form .form-row {
        display: flex !important;
      }
      
      [data-testid="profile-form"] .form-group,
      .subscription-form .form-group,
      form.subscription-form .form-group {
        display: block !important;
        flex: 1 !important;
      }
      
      [data-testid="profile-form"] label,
      .subscription-form label,
      form.subscription-form label {
        display: block !important;
      }
      
      [data-testid="profile-form"] input,
      .subscription-form input,
      form.subscription-form input {
        display: block !important;
        width: 100% !important;
      }
      
      /* Fix for step actions */
      .step-actions {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .step-actions button,
      .button-back,
      .button-next,
      .secondary-button,
      .primary-button {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    
    document.head.appendChild(styleEl);
    console.log('Profile form fix: CSS protection added');
    
    // Check and fix the profile form periodically
    const fixProfileForm = () => {
      const selectors = [
        '[data-testid="profile-form"]',
        '.subscription-form',
        '#profile-form',
        'form.subscription-form'
      ];
      
      let form = null;
      
      // Try each selector until we find a form
      for (const selector of selectors) {
        form = document.querySelector(selector);
        if (form) break;
      }
      
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
            } else if (child.tagName === 'BUTTON') {
              child.style.setProperty('display', 'inline-block', 'important');
            } else if (child.classList.contains('form-group')) {
              child.style.setProperty('display', 'block', 'important');
              child.style.setProperty('flex', '1', 'important');
            } else if (child.classList.contains('step-actions')) {
              child.style.setProperty('display', 'flex', 'important');
            }
          }
        });
        
        console.log('Profile form fix: Form visibility enforced');
      }
    };
    
    // Run fix every 500ms
    const intervalId = setInterval(fixProfileForm, 500);
    
    // Also run fix when route changes
    const originalPushState = history.pushState;
    history.pushState = function() {
      // Call the original function
      const result = originalPushState.apply(this, arguments);
      
      // Then run our fix
      console.log('Profile form fix: Route changed, checking form visibility');
      setTimeout(fixProfileForm, 100);
      
      return result;
    };
    
    // Also observe DOM for changes that might affect the form
    const observer = new MutationObserver(mutations => {
      let shouldCheckForm = false;
      
      mutations.forEach(mutation => {
        // If nodes are added or removed
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheckForm = true;
        }
        
        // If attributes change
        if (mutation.type === 'attributes') {
          const target = mutation.target;
          // Only check if this was a style or class change
          if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
            shouldCheckForm = true;
          }
        }
      });
      
      if (shouldCheckForm) {
        // Run the fix if DOM changed in a way that might affect the form
        fixProfileForm();
      }
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Clean up when page unloads
    window.addEventListener('beforeunload', () => {
      clearInterval(intervalId);
      observer.disconnect();
    });
    
    console.log('Profile form fix: Observer and interval started');
    
    // Run fix immediately
    fixProfileForm();
  });
})();