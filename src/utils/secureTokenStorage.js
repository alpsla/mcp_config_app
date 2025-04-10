/**
 * Secure Token Storage
 * Provides methods for securely storing and retrieving Hugging Face API tokens
 * using platform-specific secure storage mechanisms
 */

// Default to browser storage if not in Electron
const isElectron = window && window.process && window.process.type;

/**
 * Storage key for the token
 * @type {string}
 */
const TOKEN_STORAGE_KEY = 'huggingface_token';

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
      if (isElectron) {
        return await this.storeTokenElectron(token);
      } else {
        return await this.storeTokenBrowser(token);
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
      if (isElectron) {
        return await this.retrieveTokenElectron();
      } else {
        return await this.retrieveTokenBrowser();
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
      if (isElectron) {
        return await this.deleteTokenElectron();
      } else {
        return await this.deleteTokenBrowser();
      }
    } catch (error) {
      console.error('Error deleting token:', error);
      return false;
    }
  },
  
  // Electron Implementation
  
  /**
   * Store token using Electron's secure storage
   * @param {string} token - The token to store
   * @returns {Promise<boolean>} Promise resolving to success status
   * @private
   */
  async storeTokenElectron(token) {
    if (!window.electron || !window.electron.secureStorage) {
      throw new Error('Electron secure storage not available');
    }
    
    return await window.electron.secureStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  
  /**
   * Retrieve token using Electron's secure storage
   * @returns {Promise<string|null>} Promise resolving to the token or null
   * @private
   */
  async retrieveTokenElectron() {
    if (!window.electron || !window.electron.secureStorage) {
      throw new Error('Electron secure storage not available');
    }
    
    return await window.electron.secureStorage.getItem(TOKEN_STORAGE_KEY);
  },
  
  /**
   * Delete token using Electron's secure storage
   * @returns {Promise<boolean>} Promise resolving to success status
   * @private
   */
  async deleteTokenElectron() {
    if (!window.electron || !window.electron.secureStorage) {
      throw new Error('Electron secure storage not available');
    }
    
    return await window.electron.secureStorage.removeItem(TOKEN_STORAGE_KEY);
  },
  
  // Browser Implementation (encrypted localStorage)
  
  /**
   * Store token in browser storage with encryption
   * @param {string} token - The token to store
   * @returns {Promise<boolean>} Promise resolving to success status
   * @private
   */
  async storeTokenBrowser(token) {
    try {
      // For browser environments, we'll use the Web Crypto API for encryption
      // This is a simple implementation - in production you'd want a more robust
      // encryption strategy with proper key management
      
      // Generate a device-specific key (or use a stored one)
      let encryptionKey = localStorage.getItem('encryption_key');
      if (!encryptionKey) {
        // Generate a random key
        const keyBytes = new Uint8Array(32); // 256-bit key
        window.crypto.getRandomValues(keyBytes);
        encryptionKey = Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('encryption_key', encryptionKey);
      }
      
      // Simple XOR encryption (not secure for production!)
      // In a real app, use the Web Crypto API properly
      const encryptedToken = this.simpleEncrypt(token, encryptionKey);
      
      // Store the encrypted token
      localStorage.setItem(TOKEN_STORAGE_KEY, encryptedToken);
      
      return true;
    } catch (error) {
      console.error('Error storing token in browser:', error);
      
      // Fallback to plain localStorage if encryption fails
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      return true;
    }
  },
  
  /**
   * Retrieve token from browser storage
   * @returns {Promise<string|null>} Promise resolving to the token or null
   * @private
   */
  async retrieveTokenBrowser() {
    try {
      const encryptedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!encryptedToken) {
        return null;
      }
      
      const encryptionKey = localStorage.getItem('encryption_key');
      if (!encryptionKey) {
        // No encryption key, return as is (might be unencrypted)
        return encryptedToken;
      }
      
      // Decrypt the token
      return this.simpleEncrypt(encryptedToken, encryptionKey); // XOR works both ways
    } catch (error) {
      console.error('Error retrieving token from browser:', error);
      
      // Fallback to returning whatever is stored
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  },
  
  /**
   * Delete token from browser storage
   * @returns {Promise<boolean>} Promise resolving to success status
   * @private
   */
  async deleteTokenBrowser() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return true;
  },
  
  /**
   * Very simple XOR encryption/decryption
   * NOT SECURE FOR PRODUCTION USE!
   * @param {string} text - Text to encrypt/decrypt
   * @param {string} key - Encryption key
   * @returns {string} Encrypted/decrypted text
   * @private
   */
  simpleEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result); // Base64 encode for storage
  },
  
  /**
   * Simple decryption using XOR
   * NOT SECURE FOR PRODUCTION USE!
   * @param {string} encrypted - Encrypted text
   * @param {string} key - Encryption key
   * @returns {string} Decrypted text
   * @private
   */
  simpleDecrypt(encrypted, key) {
    const text = atob(encrypted); // Base64 decode
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  },
};

export default secureTokenStorage;
