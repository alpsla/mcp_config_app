// Script to apply immediate fixes to the Parameters page
// Run this script when the parameters page loads

(function() {
  console.log("Applying fixes to Parameters page...");
  
  // Wait for the DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", applyFixes);
  
  // Also try to apply fixes if the page is already loaded
  if (document.readyState === "complete" || document.readyState === "interactive") {
    applyFixes();
  }
  
  function applyFixes() {
    // Check if we're on the parameters page
    if (!document.querySelector(".subscription-step")) {
      console.log("Not on Parameters page, skipping fixes");
      return;
    }
    
    console.log("Parameters page detected, applying fixes...");
    
    // 1. Fix PresetSaver component
    fixPresetSaver();
    
    // 2. Apply additional accessibility fixes
    applyAccessibilityFixes();
    
    console.log("All fixes applied successfully!");
  }
  
  function fixPresetSaver() {
    // Find the preset saver container
    const presetSaverContainer = Array.from(document.querySelectorAll(".preset-saver, div[style*='background-color: #f8f9fa']"))
      .find(el => el.querySelector("h4") && el.querySelector("h4").textContent.includes("Save as Preset"));
    
    if (!presetSaverContainer) {
      console.warn("Preset saver not found");
      return;
    }
    
    console.log("Found preset saver:", presetSaverContainer);
    
    // Get the current preset value if any
    const presetInput = presetSaverContainer.querySelector("input[type='text']");
    const currentValue = presetInput ? presetInput.value : "";
    
    // Create a new fixed preset saver
    const fixedPresetSaver = document.createElement("div");
    fixedPresetSaver.className = "preset-saver-fixed";
    fixedPresetSaver.style.marginTop = "30px";
    fixedPresetSaver.style.backgroundColor = "#f8f9fa";
    fixedPresetSaver.style.padding = "20px";
    fixedPresetSaver.style.borderRadius = "10px";
    fixedPresetSaver.style.transition = "all 0.3s ease";
    
    // Add the heading
    const heading = document.createElement("h4");
    heading.id = "preset-heading";
    heading.style.fontSize = "18px";
    heading.style.color = "#333";
    heading.style.margin = "0 0 10px 0";
    heading.style.fontWeight = "600";
    heading.textContent = "Save as Preset";
    fixedPresetSaver.appendChild(heading);
    
    // Add the description
    const description = document.createElement("p");
    description.style.color = "#666";
    description.style.fontSize = "14px";
    description.style.marginBottom = "15px";
    description.textContent = "Save your current parameter settings as a preset for future use.";
    fixedPresetSaver.appendChild(description);
    
    // Create the form with horizontal layout
    const form = document.createElement("form");
    form.id = "fixed-preset-form";
    form.style.display = "flex";
    form.style.flexDirection = "row";
    form.style.alignItems = "center";
    form.style.gap = "10px";
    form.style.width = "100%";
    
    // Create the input container
    const inputContainer = document.createElement("div");
    inputContainer.style.flex = "1";
    inputContainer.style.maxWidth = "70%";
    
    // Create the input
    const input = document.createElement("input");
    input.type = "text";
    input.name = "presetName";
    input.id = "fixed-preset-input";
    input.placeholder = "Enter preset name";
    input.value = currentValue;
    input.setAttribute("aria-labelledby", "preset-heading");
    input.style.width = "100%";
    input.style.padding = "10px 12px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "4px";
    input.style.fontSize = "14px";
    input.style.transition = "all 0.2s ease";
    
    // Create the button
    const button = document.createElement("button");
    button.type = "submit";
    button.setAttribute("aria-labelledby", "preset-heading");
    button.style.padding = "10px 16px";
    button.style.backgroundColor = "#1976d2";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.fontSize = "14px";
    button.style.fontWeight = "500";
    button.style.cursor = "pointer";
    button.style.transition = "all 0.2s ease";
    button.style.whiteSpace = "nowrap";
    button.style.height = "40px";
    button.style.display = "inline-flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.textContent = "Save Preset";
    
    if (!currentValue.trim()) {
      button.disabled = true;
      button.style.backgroundColor = "#ccc";
      button.style.cursor = "not-allowed";
    }
    
    // Add event listeners
    input.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      button.disabled = !val;
      button.style.backgroundColor = val ? "#1976d2" : "#ccc";
      button.style.cursor = val ? "pointer" : "not-allowed";
    });
    
    // Hook up the form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value.trim()) {
        // Try to find the original save button and click it
        const originalButton = presetSaverContainer.querySelector("button[type='submit']");
        if (originalButton) {
          // First set the original input's value
          if (presetInput) {
            presetInput.value = input.value;
            // Trigger an input event to update any listeners
            const event = new Event('input', { bubbles: true });
            presetInput.dispatchEvent(event);
          }
          
          // Then click the original button
          originalButton.click();
          
          // Clear the input
          input.value = "";
          button.disabled = true;
          button.style.backgroundColor = "#ccc";
          button.style.cursor = "not-allowed";
        } else {
          console.warn("Original save button not found");
          alert(`Would save preset: ${input.value}`);
        }
      }
    });
    
    // Assemble the form
    inputContainer.appendChild(input);
    form.appendChild(inputContainer);
    form.appendChild(button);
    fixedPresetSaver.appendChild(form);
    
    // Replace the original container with our fixed version
    presetSaverContainer.parentNode.replaceChild(fixedPresetSaver, presetSaverContainer);
    
    console.log("PresetSaver fixed successfully!");
  }
  
  function applyAccessibilityFixes() {
    // Fix Hugging Face API Token header
    const tokenHeaders = Array.from(document.querySelectorAll("h3"))
      .filter(el => el.textContent.includes("Hugging Face API Token"));
    
    if (tokenHeaders.length > 0) {
      tokenHeaders.forEach(header => {
        header.style.margin = "0";
        header.style.fontSize = "16px";
        header.style.color = "#1976d2";
        header.style.paddingBottom = "8px";
        header.style.borderBottom = "2px solid #e0e0e0";
      });
      console.log("Hugging Face Token headers fixed:", tokenHeaders.length);
    }
    
    // Fix sliders if needed
    const sliders = document.querySelectorAll("input[type='range']");
    sliders.forEach(slider => {
      slider.style.width = "100%";
      slider.style.height = "6px";
      slider.style.borderRadius = "5px";
      slider.style.outline = "none";
      slider.style.appearance = "none";
      slider.style.cursor = "pointer";
      slider.style.margin = "20px 0";
    });
    console.log("Sliders fixed:", sliders.length);
  }
})();