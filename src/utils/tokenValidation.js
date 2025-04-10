/**
 * Hugging Face Token Validation Utilities
 * Provides functions for validating Hugging Face API tokens
 */

/**
 * Validates the format of a Hugging Face API token
 * @param {string} token - The token to validate
 * @returns {object} Validation result with isValid flag and message
 */
export function validateTokenFormat(token) {
  if (!token || typeof token !== 'string') {
    return {
      isValid: false,
      message: "Token is required"
    };
  }

  // Most Hugging Face tokens start with "hf_"
  const isValidFormat = /^hf_[a-zA-Z0-9]{20,}$/.test(token);
  
  if (!isValidFormat) {
    return {
      isValid: false,
      message: "Token format appears invalid. Hugging Face tokens typically start with 'hf_' followed by at least 20 alphanumeric characters."
    };
  }
  
  return {
    isValid: true,
    message: "Token format is valid"
  };
}

/**
 * Validates a Hugging Face token by making a lightweight API call
 * @param {string} token - The token to validate
 * @returns {Promise<object>} Promise resolving to validation result
 */
export async function validateTokenWithAPI(token) {
  try {
    // First validate format
    const formatValidation = validateTokenFormat(token);
    if (!formatValidation.isValid) {
      return formatValidation;
    }

    // Then check with the API
    const response = await fetch('https://huggingface.co/api/whoami-v2', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        isValid: true,
        username: data.name || 'Unknown user',
        orgs: data.orgs || [],
        message: 'Token validated successfully!'
      };
    } else if (response.status === 401) {
      return {
        isValid: false,
        message: 'Invalid token: Authentication failed'
      };
    } else {
      return {
        isValid: false,
        message: `Token validation failed: ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: `Error validating token: ${error.message}`
    };
  }
}
