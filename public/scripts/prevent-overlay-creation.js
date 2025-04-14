/**
 * prevent-overlay-creation.js
 * This script prevents the creation of token overlays and preset forms
 * by overriding key DOM manipulation methods.
 */
(function() {
  // Store original methods
  const originalCreateElement = document.createElement;
  const originalAppendChild = Node.prototype.appendChild;
  const originalInsertBefore = Node.prototype.insertBefore;
  const originalQuerySelector = Document.prototype.querySelector;
  const originalQuerySelectorAll = Document.prototype.querySelectorAll;
  
  // Override document.createElement
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    // Add a custom property to track elements we might want to block
    element._createdByScript = true;
    
    return element;
  };
  
  // Override appendChild to block certain elements
  Node.prototype.appendChild = function(node) {
    // Skip if the node is one we want to block
    if (shouldBlockNode(node)) {
      console.log('Blocked appendChild for overlay element:', node);
      return node; // Return the node but don't actually append it
    }
    
    return originalAppendChild.call(this, node);
  };
  
  // Override insertBefore to block certain elements
  Node.prototype.insertBefore = function(node, referenceNode) {
    // Skip if the node is one we want to block
    if (shouldBlockNode(node)) {
      console.log('Blocked insertBefore for overlay element:', node);
      return node; // Return the node but don't actually insert it
    }
    
    return originalInsertBefore.call(this, node, referenceNode);
  };
  
  // Helper function to determine if a node should be blocked
  function shouldBlockNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    
    // Check for token overlay
    if (node.id === 'token-entry-overlay') {
      return true;
    }
    
    // Check for Dashlane attributes
    if (node.hasAttribute && (
        node.hasAttribute('data-dashlane-rid') || 
        node.hasAttribute('data-dashlane-created') ||
        node.hasAttribute('data-kwimpalastatus') ||
        node.hasAttribute('data-kwimpalaid')
    )) {
      return true;
    }
    
    // Check for preset form
    if (node.querySelector) {
      const h4 = node.querySelector('h4');
      if (h4 && h4.textContent && h4.textContent.includes('Save Parameters as Preset')) {
        return true;
      }
      
      const input = node.querySelector('input[name="presetName"], input[name="enablePreset"]');
      if (input) {
        return true;
      }
    }
    
    // Check for positioning that might indicate an overlay
    if (node.style && 
        node.style.position === 'fixed' && 
        node.style.zIndex && parseInt(node.style.zIndex, 10) > 1000 &&
        node.style.top === '20px' && 
        node.style.right === '20px') {
      return true;
    }
    
    return false;
  }
  
  // Clean up any existing problematic elements
  function cleanupElements() {
    // Remove token overlay
    const tokenOverlay = document.getElementById('token-entry-overlay');
    if (tokenOverlay) {
      tokenOverlay.remove();
    }
    
    // Remove any direct token inputs
    document.querySelectorAll('#direct-token-input, #direct-token-save').forEach(el => {
      el.remove();
    });
    
    // Remove preset forms
    document.querySelectorAll('form[data-dashlane-rid], [data-dashlanecreated="true"]').forEach(el => {
      el.remove();
    });
    
    // Remove any elements with specific IDs that match our targets
    document.querySelectorAll('[id^="1744379926365-"]').forEach(el => {
      el.remove();
    });
  }
  
  // Run on page load
  document.addEventListener('DOMContentLoaded', function() {
    cleanupElements();
    
    // Set a timer to periodically clean up elements
    setInterval(cleanupElements, 1000);
  });
  
  // Also clean up right away
  cleanupElements();
})();
