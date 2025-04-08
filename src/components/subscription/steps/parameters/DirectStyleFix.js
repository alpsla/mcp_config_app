/**
 * DirectStyleFix.js - Immediate style fixes for the Parameters page
 * 
 * This module applies direct DOM styling to improve the appearance
 * of the parameters page without requiring component replacements.
 */

// Function to inject styles into the page
export const applyParameterPageStyles = () => {
  // Remove any existing injected styles
  const existingStyle = document.getElementById('parameter-page-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create a new style element
  const styleElement = document.createElement('style');
  styleElement.id = 'parameter-page-styles';
  
  // Define enhanced styles that will apply to the current DOM structure
  styleElement.innerHTML = `
    /* Main container styling */
    .subscription-step, .parameters-step {
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
    .subscription-step::before, .parameters-step::before {
      content: "" !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 8px !important;
      background: linear-gradient(to right, #1976d2, rgba(25, 118, 210, 0.8)) !important;
    }
    
    /* Header styling */
    .subscription-step h2, .parameters-step h2 {
      font-size: 28px !important;
      margin: 20px 0 15px !important;
      color: #333 !important;
      font-weight: 600 !important;
      text-align: center !important;
    }
    
    .step-description {
      text-align: center !important;
      color: #666 !important;
      max-width: 650px !important;
      margin: 0 auto 30px !important;
    }
    
    /* Parameter section styling */
    .parameter-section, .parameter-item {
      background-color: #f8f9fa !important;
      border-radius: 10px !important;
      padding: 20px !important;
      margin-bottom: 20px !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
      transition: all 0.3s ease !important;
    }
    
    .parameter-section:hover, .parameter-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
    
    /* Hugging Face token section */
    .huggingface-token {
      background-color: #f0f7ff !important;
      padding: 20px !important;
      border-radius: 10px !important;
      border: 1px solid #bbdefb !important;
      margin-bottom: 20px !important;
    }
    
    .token-input-container {
      display: flex !important;
      margin-bottom: 15px !important;
    }
    
    .token-input {
      flex-grow: 1 !important;
      padding: 12px !important;
      border-radius: 4px 0 0 4px !important;
      border: 1px solid #ccc !important;
      font-size: 14px !important;
    }
    
    .toggle-visibility-btn {
      padding: 0 15px !important;
      background-color: #f5f5f5 !important;
      border: 1px solid #ccc !important;
      border-left: none !important;
      border-radius: 0 4px 4px 0 !important;
      cursor: pointer !important;
    }
    
    .get-token-button {
      display: inline-block !important;
      padding: 8px 16px !important;
      background-color: #1976d2 !important;
      color: white !important;
      text-decoration: none !important;
      border-radius: 4px !important;
      margin-left: 10px !important;
      font-weight: 500 !important;
      font-size: 14px !important;
    }
    
    /* Security note styling */
    .security-note {
      background-color: #e8f5e9 !important;
      padding: 10px 15px !important;
      border-radius: 4px !important;
      margin: 15px 0 !important;
      display: flex !important;
      align-items: center !important;
      border-left: 3px solid #4caf50 !important;
    }
    
    /* Token steps */
    .token-steps {
      background-color: #f5f9ff !important;
      border-radius: 8px !important;
      padding: 15px !important;
      margin-top: 15px !important;
      border-left: 4px solid #1976d2 !important;
    }
    
    .token-steps ol {
      margin: 10px 0 10px 20px !important;
      padding: 0 !important;
    }
    
    .token-steps li {
      margin-bottom: 8px !important;
      color: #444 !important;
    }
    
    /* Section headers */
    .section-header, h3 {
      font-size: 20px !important;
      color: #333 !important;
      margin: 30px 0 15px !important;
      padding-bottom: 8px !important;
      border-bottom: 2px solid #e0e0e0 !important;
    }
    
    /* Sliders */
    input[type="range"] {
      height: 6px !important;
      border-radius: 5px !important;
      outline: none !important;
      appearance: none !important;
      background: #e0e0e0 !important;
      cursor: pointer !important;
      width: 100% !important;
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
    
    /* Descriptions */
    .parameter-description {
      color: #666 !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      margin: 10px 0 !important;
    }
    
    /* Buttons */
    .primary-button, .next-button, button.next, button[type="button"].next {
      background-color: #1976d2 !important;
      color: white !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 12px 28px !important;
      font-size: 16px !important;
      font-weight: bold !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      cursor: pointer !important;
      transition: 0.2s !important;
    }
    
    .primary-button:hover, .next-button:hover, button.next:hover, button[type="button"].next:hover {
      background-color: #1565c0 !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
    
    .secondary-button, .back-button, button.back, button[type="button"].back {
      padding: 12px 24px !important;
      background-color: #f5f5f5 !important;
      color: #333 !important;
      border: 1px solid #ddd !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      font-size: 16px !important;
      transition: 0.2s !important;
    }
    
    .secondary-button:hover, .back-button:hover, button.back:hover, button[type="button"].back:hover {
      background-color: #e0e0e0 !important;
    }
    
    /* Fix specific buttons */
    a[href*="huggingface.co"] {
      color: #1976d2 !important;
      text-decoration: none !important;
      transition: 0.2s !important;
    }
    
    a[href*="huggingface.co"]:hover {
      text-decoration: underline !important;
    }
    
    /* Step actions */
    .step-actions {
      display: flex !important;
      justify-content: space-between !important;
      margin-top: 40px !important;
      padding-top: 20px !important;
      border-top: 1px solid #e0e0e0 !important;
    }
    
    /* Save preset section */
    .save-preset-section {
      background-color: #f5f5f5 !important;
      padding: 20px !important;
      border-radius: 8px !important;
      margin-top: 30px !important;
    }
    
    input[type="text"] {
      padding: 10px !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      font-size: 14px !important;
    }
    
    button[type="button"] {
      padding: 8px 16px !important;
      background-color: #1976d2 !important;
      color: white !important;
      border: none !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      font-size: 14px !important;
      margin-left: 10px !important;
    }
    
    input[type="checkbox"] {
      margin-right: 8px !important;
    }
  `;
  
  // Add the styles to the document head
  document.head.appendChild(styleElement);
  
  // Add focus to the style so our changes take precedence
  const focusStyles = document.createElement('style');
  focusStyles.innerHTML = `
    /* Additional styles with !important to ensure they take effect */
    .subscription-step, div[class*="parameters"], form, .parameter-item {
      max-width: 900px !important;
      margin: 30px auto !important;
      background-color: white !important;
    }
    
    /* Target back/next buttons regardless of class names */
    button {
      transition: all 0.2s ease !important;
    }
    
    button:last-child:not(:first-child) {
      background-color: #1976d2 !important;
      color: white !important;
    }
  `;
  document.head.appendChild(focusStyles);
  
  return () => {
    // Cleanup function to remove styles if needed
    document.head.removeChild(styleElement);
    document.head.removeChild(focusStyles);
  };
};
