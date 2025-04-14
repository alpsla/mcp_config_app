/**
 * This script dynamically loads resources required for the parameters page
 * It monitors the URL hash and loads the necessary components when needed
 */

(function() {
  console.log('Parameters resource loader initialized');
  
  // Listen for hash changes
  window.addEventListener('hashchange', checkAndLoadResources);
  
  // Also check on initial page load
  document.addEventListener('DOMContentLoaded', checkAndLoadResources);
  
  function checkAndLoadResources() {
    // Check if we're on the parameters page
    if (window.location.hash.includes('/subscribe/parameters')) {
      console.log('Parameters page detected, ensuring resources are loaded');
      
      // Load essential resources if not already loaded
      ensureResourceLoaded('script', 'subscription-parameters-fix-script', '/scripts/subscription-parameters-fix.js');
      ensureResourceLoaded('link', 'parameters-fix-css', '/styles/parameters-page-fix.css', 'stylesheet');
      
      // Force render the parameters container if it's empty
      setTimeout(forceRenderParametersPage, 300);
    }
  }
  
  function ensureResourceLoaded(tagName, id, src, rel) {
    // Check if the resource is already loaded
    if (document.getElementById(id)) {
      return;
    }
    
    // Create the element
    const element = document.createElement(tagName);
    element.id = id;
    
    if (tagName === 'script') {
      element.src = src;
      element.async = true;
    } else if (tagName === 'link') {
      element.href = src;
      element.rel = rel || 'stylesheet';
    }
    
    // Add the element to the document
    document.head.appendChild(element);
    console.log(`Resource loaded: ${id}`);
  }
  
  function forceRenderParametersPage() {
    const container = document.querySelector('.parameters-container');
    
    // If the container exists but is empty or invisible
    if (container) {
      if (getComputedStyle(container).opacity === '0' || container.children.length === 0) {
        console.log('Parameters container found but needs visibility fix');
        
        // Force visibility
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        container.style.display = 'block';
        
        // Force content visibility
        const content = container.querySelector('.parameters-content');
        if (content) {
          content.style.opacity = '1';
          content.style.visibility = 'visible';
          content.style.display = 'block';
        }
      }
    } else {
      // Container doesn't exist yet, it might be still loading
      console.log('Parameters container not found, might need to create a fallback');
      
      // Check if we need to create a fallback container
      const appContent = document.querySelector('.app-content');
      if (appContent && appContent.children.length === 0) {
        console.log('Empty app content detected, creating fallback container');
        
        // Create a fallback message
        const fallback = document.createElement('div');
        fallback.className = 'parameters-fallback';
        fallback.innerHTML = `
          <div style="
            max-width: 600px;
            margin: 60px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
          ">
            <h2 style="color: #1976d2; margin: 0 0 20px;">Loading Parameters</h2>
            <p style="color: #666; margin-bottom: 20px;">
              The parameters page is being prepared. This may take a moment...
            </p>
            <div style="
              width: 40px;
              height: 40px;
              margin: 0 auto;
              border: 4px solid #f3f3f3;
              border-top: 4px solid #1976d2;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            "></div>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
            <div style="margin-top: 20px;">
              <button onclick="window.location.reload()" style="
                padding: 10px 20px;
                background-color: #1976d2;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                margin-top: 10px;
              ">Refresh Page</button>
            </div>
          </div>
        `;
        
        appContent.appendChild(fallback);
      }
    }
  }
})();