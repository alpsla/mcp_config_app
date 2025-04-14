import { useEffect, useRef } from 'react';

/**
 * A hook to ensure form elements remain visible even if other scripts try to hide them
 * @param formId The data-testid or id of the form to protect
 */
const useFormVisibility = (formId: string) => {
  // Use a ref to track if the protection has been applied
  const protectionApplied = useRef(false);
  
  useEffect(() => {
    // Don't apply multiple times
    if (protectionApplied.current) return;
    
    console.log(`useFormVisibility: Setting up protection for form with id ${formId}`);
    
    // This will run once when the component mounts
    const styleEl = document.createElement('style');
    styleEl.id = 'form-visibility-protection';
    styleEl.textContent = `
      /* Ensure form with data-testid=${formId} and all its elements are visible */
      [data-testid="${formId}"],
      [data-testid="${formId}"] *,
      [data-testid="${formId}"] .form-row,
      [data-testid="${formId}"] .form-group,
      [data-testid="${formId}"] label,
      [data-testid="${formId}"] input,
      [data-testid="${formId}"] button {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        overflow: visible !important;
        height: auto !important;
        position: static !important;
      }
      
      [data-testid="${formId}"] .form-row {
        display: flex !important;
      }
      
      [data-testid="${formId}"] .form-group {
        flex: 1 !important;
      }
      
      [data-testid="${formId}"] input {
        width: 100% !important;
      }
      
      [data-testid="${formId}"] button,
      .step-actions button {
        display: inline-block !important;
      }
    `;
    
    // Add style to head
    document.head.appendChild(styleEl);
    
    // Interval to ensure the form remains visible
    const intervalId = setInterval(() => {
      const form = document.querySelector(`[data-testid="${formId}"]`);
      if (form) {
        // Force visibility
        const formEl = form as HTMLElement;
        formEl.style.display = 'block';
        formEl.style.visibility = 'visible';
        formEl.style.opacity = '1';
        
        // Also ensure form children are visible
        const elements = form.querySelectorAll('input, label, .form-group, .form-row, button');
        elements.forEach(el => {
          if (el instanceof HTMLElement) {
            const tagName = el.tagName.toLowerCase();
            const display = tagName === 'div' ? 'block' : 
                          tagName === 'button' ? 'inline-block' : 
                          'block';
            
            el.style.display = display;
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
        });
      }
    }, 300); // Check every 300ms
    
    // Mark protection as applied
    protectionApplied.current = true;
    
    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
      const style = document.getElementById('form-visibility-protection');
      if (style) {
        document.head.removeChild(style);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - we only want this to run once
};

export default useFormVisibility;