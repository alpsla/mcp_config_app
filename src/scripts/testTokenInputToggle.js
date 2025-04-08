// Debug script to test the token input toggle functionality
console.log('Token Input Toggle Debug Script');

document.addEventListener('DOMContentLoaded', () => {
  // Wait for the component to be fully loaded
  setTimeout(() => {
    try {
      console.log('Looking for token input components...');
      
      // Find all show/hide instructions buttons
      const tokenInfoButtons = document.querySelectorAll('button');
      let instructionsButtons = Array.from(tokenInfoButtons).filter(button => 
        button.textContent.includes('How to Get Token') || 
        button.textContent.includes('Hide Instructions') ||
        button.textContent.includes('Show Step-by-Step Instructions')
      );
      
      console.log(`Found ${instructionsButtons.length} instruction toggle buttons:`, instructionsButtons);
      
      // Add click listeners with logging
      instructionsButtons.forEach((button, index) => {
        console.log(`Button ${index} text:`, button.textContent);
        
        // Add a data attribute to identify the button
        button.setAttribute('data-debug-id', `token-instruction-btn-${index}`);
        
        // Create a wrapped click handler that logs the event
        const originalOnClick = button.onclick;
        button.onclick = (e) => {
          console.log(`Button ${index} clicked:`, e);
          console.log('Button state before click:', button.textContent);
          
          // Call the original handler if it exists
          if (originalOnClick) {
            console.log('Calling original click handler');
            originalOnClick.call(button, e);
          }
          
          // Log the state after the click
          setTimeout(() => {
            console.log('Button state after click:', button.textContent);
            
            // Check if instructions are visible
            const instructionsElement = document.querySelector('[style*="instructionHeading"]');
            console.log('Instructions visible:', !!instructionsElement);
          }, 100);
        };
      });
      
      console.log('Debug instrumentation complete');
    } catch (error) {
      console.error('Error in token input debug script:', error);
    }
  }, 1000);
});

// Monitor state changes
let previousState = null;
setInterval(() => {
  const instructionsElement = document.querySelector('[style*="instructionHeading"]');
  const instructionsVisible = !!instructionsElement;
  
  if (previousState !== instructionsVisible) {
    console.log('Instructions visibility changed:', instructionsVisible);
    previousState = instructionsVisible;
  }
}, 500);