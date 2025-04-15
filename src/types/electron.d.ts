/**
 * TypeScript declarations for Electron APIs exposed to the renderer process
 */

interface ElectronSecureStorage {
  /**
   * Store a token securely in the OS keychain/credential store
   * @param token - The token to store
   * @returns A promise that resolves to whether the operation was successful
   */
  storeToken(token: string): Promise<boolean>;

  /**
   * Retrieve a token from the OS keychain/credential store
   * @returns A promise that resolves to the retrieved token or null if not found
   */
  retrieveToken(): Promise<string | null>;

  /**
   * Delete a token from the OS keychain/credential store
   * @returns A promise that resolves to whether the operation was successful
   */
  deleteToken(): Promise<boolean>;

  /**
   * Validate a token with the Hugging Face API
   * @param token - The token to validate
   * @returns A promise that resolves to the validation result
   */
  validateToken(token: string): Promise<{
    isValid: boolean;
    username?: string;
    orgs?: string[];
    message?: string;
  }>;
}

interface ElectronOS {
  /**
   * Get the platform name (darwin, win32)
   * @returns A promise that resolves to the platform name
   */
  platform(): Promise<string>;
}

interface ElectronApp {
  /**
   * Get the app version
   * @returns A promise that resolves to the app version
   */
  getVersion(): Promise<string>;
}

interface Electron {
  /**
   * Secure token storage operations
   */
  secureStorage: ElectronSecureStorage;

  /**
   * OS information
   */
  os: ElectronOS;

  /**
   * App version information
   */
  app: ElectronApp;
}

/**
 * Extend the Window interface to include the Electron API
 */
interface Window {
  /**
   * Electron API for the renderer process
   */
  electron?: Electron;
}
