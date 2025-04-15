/**
 * Secure Token Storage
 * Provides methods for securely storing and retrieving Hugging Face API tokens
 * with adaptation for both browser and Electron environments.
 */

/**
 * Storage key for the token
 * @type {string}
 */
// eslint-disable-next-line no-unused-vars
const TOKEN_STORAGE_KEY = 'HuggingFaceToken';

/**
 * Secure Token Storage API
 */
const secureTokenStorage = {
  /**
   * Store a token securely
   * @param {string} token - The token to store
   * @returns {Promise<boolean>} Promise resolving to success status
   */
  async storeToken(token) {
    try {
      // Check if we're in an Electron environment
      if (this.isElectronEnvironment()) {
        // Use electron IPC to store token securely
        return await window.electron.secureStorage.storeToken(token);
      } else {
        // In browser environments, we can't securely store the token
        console.warn('Secure token storage is only available in desktop environments');
        return false;
      }
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  },
  
  /**
   * Retrieve a stored token
   * @returns {Promise<string|null>} Promise resolving to the token or null if not found
   */
  async retrieveToken() {
    try {
      // Check if we're in an Electron environment
      if (this.isElectronEnvironment()) {
        // Use electron IPC to retrieve token securely
        return await window.electron.secureStorage.retrieveToken();
      } else {
        // In browser environments, we can't securely retrieve the token
        console.warn('Secure token retrieval is only available in desktop environments');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },
  
  /**
   * Delete a stored token
   * @returns {Promise<boolean>} Promise resolving to success status
   */
  async deleteToken() {
    try {
      // Check if we're in an Electron environment
      if (this.isElectronEnvironment()) {
        // Use electron IPC to delete token securely
        return await window.electron.secureStorage.deleteToken();
      } else {
        // In browser environments, we can't securely delete the token
        console.warn('Secure token deletion is only available in desktop environments');
        return false;
      }
    } catch (error) {
      console.error('Error deleting token:', error);
      return false;
    }
  },
  
  /**
   * Check if the current environment is Electron
   * @returns {boolean} True if running in Electron
   */
  isElectronEnvironment() {
    // Check if window.electron exists (set by our preload script)
    return !!(window && window.electron && window.electron.secureStorage);
  },
  
  /**
   * Validate a token with the Hugging Face API
   * @param {string} token - The token to validate
   * @returns {Promise<object>} Promise resolving to validation result
   */
  async validateToken(token) {
    try {
      // Check if we're in an Electron environment
      if (this.isElectronEnvironment()) {
        // Use electron IPC to validate token
        return await window.electron.secureStorage.validateToken(token);
      } else {
        // In browser environments, validate directly
        return await this.validateTokenDirectly(token);
      }
    } catch (error) {
      return {
        isValid: false,
        message: `Error validating token: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  },
  
  /**
   * Validate token directly with Hugging Face API
   * @param {string} token - The token to validate
   * @returns {Promise<object>} Promise resolving to validation result
   */
  async validateTokenDirectly(token) {
    try {
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
        message: `Error validating token: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
};

export default secureTokenStorage;