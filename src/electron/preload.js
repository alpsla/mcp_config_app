/**
 * Electron preload script
 * Sets up secure IPC communication between the renderer process and main process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose secured IPC communication to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Secure token storage operations
  secureStorage: {
    /**
     * Store a token securely in the OS keychain/credential store
     * @param {string} token - The token to store
     * @returns {Promise<boolean>} - Whether the operation was successful
     */
    storeToken: (token) => ipcRenderer.invoke('storeToken', token),

    /**
     * Retrieve a token from the OS keychain/credential store
     * @returns {Promise<string|null>} - The retrieved token or null if not found
     */
    retrieveToken: () => ipcRenderer.invoke('retrieveToken'),

    /**
     * Delete a token from the OS keychain/credential store
     * @returns {Promise<boolean>} - Whether the operation was successful
     */
    deleteToken: () => ipcRenderer.invoke('deleteToken'),

    /**
     * Validate a token with the Hugging Face API
     * @param {string} token - The token to validate
     * @returns {Promise<object>} - The validation result
     */
    validateToken: (token) => ipcRenderer.invoke('validateToken', token)
  },

  // OS information
  os: {
    /**
     * Get the platform name (darwin, win32)
     * @returns {Promise<string>} - The platform name
     */
    platform: () => ipcRenderer.invoke('getPlatform')
  },

  // App version information
  app: {
    /**
     * Get the app version
     * @returns {Promise<string>} - The app version
     */
    getVersion: () => ipcRenderer.invoke('getAppVersion')
  }
});

// Log when preload script has run
console.log('Electron preload script loaded');
