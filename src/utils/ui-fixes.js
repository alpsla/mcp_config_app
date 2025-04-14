/**
 * UI Fixes Utility
 * 
 * This script contains runtime fixes for UI issues in the application.
 * It uses direct DOM manipulation to ensure elements are visible and properly styled.
 */

// Fix Profile Form Fields - applies direct CSS to make fields visible
const fixProfileForm = () => {
  console.log('Applying profile form fix...');
  
  // Find the form elements
  const formContainer = document.querySelector('.subscription-form');
  const formRows = document.querySelectorAll('.form-row');
  const formGroups = document.querySelectorAll('.form-group');
  const inputFields = document.querySelectorAll('.subscription-form input');
  const labels = document.querySelectorAll('.subscription-form label');
  
  if (formContainer) {
    console.log('Form container found, applying styles...');
    
    // Force visibility on the form container
    Object.assign(formContainer.style, {
      visibility: 'visible',
      display: 'block',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      zIndex: '1'
    });
    
    // Style form rows
    formRows.forEach(row => {
      Object.assign(row.style, {
        display: 'flex',
        visibility: 'visible',
        gap: '1rem',
        marginBottom: '1.5rem'
      });
    });
    
    // Style form groups
    formGroups.forEach(group => {
      Object.assign(group.style, {
        flex: '1',
        visibility: 'visible',
        marginBottom: '1.5rem',
        position: 'relative'
      });
    });
    
    // Style input fields
    inputFields.forEach(input => {
      Object.assign(input.style, {
        display: 'block',
        visibility: 'visible',
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        backgroundColor: '#fff',
        color: '#333',
        boxSizing: 'border-box',
        position: 'relative'
      });
    });
    
    // Style labels
    labels.forEach(label => {
      Object.assign(label.style, {
        display: 'block',
        visibility: 'visible',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: '#333'
      });
    });
    
    console.log('Profile form styles applied successfully');
  } else {
    console.log('Form container not found, cannot apply fix');
  }
};

// Fix Interests Other Input - handles the "Other" option input field
const fixInterestsOther = () => {
  console.log('Applying interests "Other" fix...');
  
  // Get interest checkboxes and other input container
  const otherCheckbox = document.getElementById('interest-other');
  const otherContainer = document.getElementById('other-interest-container');
  const otherInput = document.getElementById('other-interest-input');
  
  // If we found the elements, check if we need to create the container
  if (otherCheckbox) {
    console.log('Other checkbox found, checking for container...');
    
    if (!otherContainer && otherCheckbox.checked) {
      console.log('Container missing but should be visible, creating it...');
      
      // Create container if it doesn't exist but should
      const container = document.createElement('div');
      container.id = 'other-interest-container';
      Object.assign(container.style, {
        marginTop: '10px',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
        height: 'auto'
      });
      
      // Create input field
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'other-interest-input';
      input.placeholder = 'Tell us about your other interest';
      Object.assign(input.style, {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #d1c4e9',
        fontSize: '15px',
        boxSizing: 'border-box'
      });
      
      // Add input to container
      container.appendChild(input);
      
      // Insert after the other checkbox's parent element
      otherCheckbox.closest('.interest-checkbox')?.parentElement?.insertAdjacentElement('afterend', container);
      
      console.log('Created other interest container and input');
    } else if (otherContainer) {
      console.log('Container exists, ensuring proper visibility');
      
      // Make sure visibility matches checkbox state
      if (otherCheckbox.checked) {
        Object.assign(otherContainer.style, {
          height: 'auto',
          opacity: '1',
          pointerEvents: 'auto',
          margin: '10px 0 20px',
          overflow: 'hidden'
        });
        
        if (otherInput) {
          otherInput.disabled = false;
          otherInput.style.opacity = '1';
        }
      } else {
        Object.assign(otherContainer.style, {
          height: '0',
          opacity: '0',
          pointerEvents: 'none',
          margin: '0',
          overflow: 'hidden'
        });
        
        if (otherInput) {
          otherInput.disabled = true;
          otherInput.style.opacity = '0';
        }
      }
    }
  } else {
    console.log('Other checkbox not found, cannot apply fix');
  }
};

// Fix Advanced Parameters - ensures the advanced parameters section is visible
const fixAdvancedParameters = () => {
  console.log('Applying advanced parameters fix...');
  
  // Look for Advanced Parameters section
  const advancedSection = document.querySelector('.advanced-parameters');
  
  if (advancedSection) {
    console.log('Advanced parameters section found, applying styles...');
    
    // Ensure section is visible and styled
    Object.assign(advancedSection.style, {
      margin: '30px 0',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      border: '1px solid #673AB7',
      overflow: 'visible',
      boxShadow: '0 2px 5px rgba(103, 58, 183, 0.1)',
      display: 'block',
      visibility: 'visible',
      position: 'relative'
    });
    
    // Fix header
    const header = advancedSection.querySelector('.advanced-header');
    if (header) {
      Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#ede7f6',
        borderBottom: '1px solid #d1c4e9',
        visibility: 'visible'
      });
    }
    
    // Force expanded state - create content element if missing
    const content = advancedSection.querySelector('.advanced-content');
    if (!content) {
      console.log('Content section missing, creating it...');
      
      const newContent = document.createElement('div');
      newContent.className = 'advanced-content';
      
      // Add temporary content
      newContent.innerHTML = `
        <div class="advanced-description">
          These parameters give you more detailed control over how AI models generate text. 
          Most users won't need to adjust these, but they can be helpful for specific use cases.
        </div>
        
        <div class="parameter-categories">
          <button class="category-button active">Sampling Parameters</button>
          <button class="category-button">Repetition Control</button>
          <button class="category-button">Beam Search</button>
        </div>
        
        <div class="parameter-category-content">
          <div class="advanced-section">
            <div class="parameter-row">
              <div class="parameter-info">
                <label class="parameter-name">
                  Top P: <span class="parameter-value">0.9</span>
                </label>
              </div>
              
              <div class="parameter-slider-container">
                <div class="slider-track">
                  <div class="slider-track-fill" style="width: 80%"></div>
                </div>
                
                <input
                  type="range"
                  class="advanced-slider"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value="0.9"
                />
              </div>
            </div>
            
            <div class="parameter-description">
              <strong>Top P (Nucleus Sampling)</strong>: Controls how varied the AI's word choices are. 
              Lower values make responses more focused and predictable. 
              Higher values allow for more varied, creative language choices.
            </div>
          </div>
        </div>
      `;
      
      // Add content to section
      advancedSection.appendChild(newContent);
      
      console.log('Created advanced parameters content section');
    } else {
      console.log('Content section exists, ensuring it\'s visible');
      Object.assign(content.style, {
        display: 'block',
        padding: '0 20px 20px',
        visibility: 'visible'
      });
    }
    
    console.log('Advanced parameters styles applied successfully');
  } else {
    console.log('Advanced parameters section not found, cannot apply fix');
  }
};

// Fix Hugging Face Section - ensures the Hugging Face API token section is visible
const fixHuggingFaceSection = () => {
  console.log('Applying Hugging Face section fix...');
  
  // Look for Hugging Face section
  const hfSection = document.querySelector('.hf-token-section');
  
  if (hfSection) {
    console.log('Hugging Face section found, applying styles...');
    
    // Ensure section is visible and styled
    Object.assign(hfSection.style, {
      display: 'block',
      visibility: 'visible',
      backgroundColor: '#f5f7ff',
      borderRadius: '8px',
      padding: '0',
      margin: '30px 0',
      border: '1px solid #2196F3',
      overflow: 'visible',
      boxShadow: '0 2px 5px rgba(33, 150, 243, 0.1)',
      position: 'relative'
    });
    
    // Fix header
    const header = hfSection.querySelector('.token-header');
    if (header) {
      Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#e3f2fd',
        borderBottom: '1px solid #bbdefb',
        visibility: 'visible'
      });
    }
    
    // Ensure content is visible
    const content = hfSection.querySelector('.token-content');
    if (content) {
      Object.assign(content.style, {
        display: 'block',
        padding: '15px 20px 20px',
        visibility: 'visible'
      });
    }
    
    console.log('Hugging Face section styles applied successfully');
  } else {
    console.log('Hugging Face section not found, cannot apply fix');
  }
};

// Main fix function that applies all fixes
const applyUIFixes = () => {
  console.log('Applying UI fixes...');
  
  // Determine current page
  const path = window.location.pathname;
  
  if (path.includes('/profile')) {
    console.log('Profile page detected, applying profile fixes');
    fixProfileForm();
  } else if (path.includes('/interests')) {
    console.log('Interests page detected, applying interests fixes');
    fixInterestsOther();
  } else if (path.includes('/parameters')) {
    console.log('Parameters page detected, applying parameters fixes');
    fixAdvancedParameters();
    fixHuggingFaceSection();
  }
  
  console.log('UI fixes applied');
};

// Export functions
export {
  applyUIFixes,
  fixProfileForm,
  fixInterestsOther,
  fixAdvancedParameters,
  fixHuggingFaceSection
};
