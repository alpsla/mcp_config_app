import { Platform } from '../utils/platform';
import { FileSystemService } from './fileSystemService';

/**
 * Service for securely handling API tokens
 */
export class TokenService {
  /**
   * Validates a Hugging Face API token
   * @param token API token to validate
   * @returns Promise resolving to validation result
   */
  static async validateHuggingFaceToken(token: string): Promise<{
    isValid: boolean;
    username?: string;
    error?: string;
  }> {
    try {
      // In a real app, this would make an API request to HF
      // For this example, we'll simulate it
      if (!token || token.length < 8) {
        return { isValid: false, error: "Invalid token format" };
      }

      // Simulate API call to HF
      const isValidToken = token.startsWith('hf_') && token.length >= 8;
      
      if (isValidToken) {
        return { 
          isValid: true, 
          username: "demo_user" // This would come from the API
        };
      } else {
        return { isValid: false, error: "Invalid token" };
      }
    } catch (error: any) {
      console.error("Token validation error:", error);
      return { 
        isValid: false, 
        error: error.message || "Failed to validate token" 
      };
    }
  }

  /**
   * Securely stores a token in the OS credential store and as an environment variable
   * @param tokenName Name/key for the token
   * @param tokenValue Token value to store
   * @returns Promise resolving when token is stored
   */
  static async storeToken(tokenName: string, tokenValue: string): Promise<boolean> {
    try {
      // Enforce token length limit for security
      const trimmedToken = tokenValue.substring(0, 512);
      
      if (Platform.isDesktopEnvironment()) {
        // Store in OS credential store via Electron
        await (window as any).electron.storeCredential(tokenName, trimmedToken);
        
        // Create environment variable scripts for different platforms
        try {
          // Set in current process if available
          if (typeof process !== 'undefined' && process.env) {
            process.env[tokenName.toUpperCase()] = trimmedToken;
          }
          
          // Create environment variable in user's config directory for persistence
          const configDir = await FileSystemService.getClaudeConfigDirectory();
          const envVarDir = `${configDir}${Platform.getPathSeparator()}env-vars`;
          
          // Create platform-specific environment variable script files
          const varName = tokenName.toUpperCase();
          await FileSystemService.createEnvironmentVariableFiles(
            envVarDir,
            { [varName]: trimmedToken }
          );
          
          // Create a .env file in the user's home directory as well
          const homeDir = Platform.getHomePath();
          const dotEnvPath = `${homeDir}${Platform.getPathSeparator()}.mcp-env`;
          
          // Read existing .env file if it exists
          let envContent = '';
          try {
            envContent = await FileSystemService.readFile(dotEnvPath) || '';
          } catch (e) {
            // File doesn't exist yet, which is fine
          }
          
          // Update or add the environment variable
          const envLines = envContent.split('\n');
          const varDef = `${varName}=${trimmedToken}`;
          
          const existingLineIndex = envLines.findIndex(line => 
            line.trim().startsWith(`${varName}=`));
            
          if (existingLineIndex >= 0) {
            envLines[existingLineIndex] = varDef;
          } else {
            envLines.push(varDef);
          }
          
          // Write updated .env file
          await FileSystemService.writeFile(
            dotEnvPath, 
            envLines.join('\n')
          );
          
          console.log(`Token stored as environment variable ${varName} with scripts in ${envVarDir}`);
        } catch (envError) {
          console.warn("Could not create environment variable scripts:", envError);
          // This is not a critical failure, we still have the credential store
        }
        
        return true;
      } else {
        // For web, we'll use sessionStorage (not for production use!)
        // In a real app, consider more secure alternatives
        sessionStorage.setItem(`token_${tokenName}`, trimmedToken);
        
        // For web version, we can also try to store in localStorage with encryption
        try {
          // Simple encryption (not secure, just obfuscation)
          const encryptedToken = btoa(trimmedToken);
          localStorage.setItem(`secure_token_${tokenName}`, encryptedToken);
        } catch (e) {
          console.warn("Could not store encrypted token in localStorage");
        }
        
        return true;
      }
    } catch (error) {
      console.error("Failed to store token:", error);
      return false;
    }
  }

  /**
   * Retrieves a token from secure storage or environment variables
   * @param tokenName Name/key of the token to retrieve
   * @returns Promise resolving to token value or null
   */
  static async getToken(tokenName: string): Promise<string | null> {
    try {
      let token: string | null = null;
      
      // First try environment variables (highest priority)
      if (typeof process !== 'undefined' && process.env) {
        const envVarName = tokenName.toUpperCase();
        if (process.env[envVarName]) {
          return process.env[envVarName] as string;
        }
      }
      
      if (Platform.isDesktopEnvironment()) {
        // Try the OS credential store via Electron
        token = await (window as any).electron.getCredential(tokenName);
        
        // If not found, check the .env file as fallback
        if (!token) {
          try {
            const homeDir = Platform.getHomePath();
            const envPath = `${homeDir}${Platform.getPathSeparator()}.mcp-env`;
            const envContent = await FileSystemService.readFile(envPath);
            
            if (envContent) {
              const envVarName = tokenName.toUpperCase();
              const envLines = envContent.split('\n');
              
              for (const line of envLines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith(`${envVarName}=`)) {
                  token = trimmedLine.substring(envVarName.length + 1);
                  break;
                }
              }
            }
          } catch (e) {
            // .env file doesn't exist or can't be read
          }
        }
      } else {
        // For web, first try sessionStorage
        token = sessionStorage.getItem(`token_${tokenName}`);
        
        // Then try localStorage with decryption as fallback
        if (!token) {
          try {
            const encryptedToken = localStorage.getItem(`secure_token_${tokenName}`);
            if (encryptedToken) {
              token = atob(encryptedToken);
            }
          } catch (e) {
            console.warn("Could not decrypt token from localStorage");
          }
        }
      }
      
      return token;
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  }

  /**
   * Removes a token from secure storage and environment variables
   * @param tokenName Name/key of the token to remove
   * @returns Promise resolving when token is removed
   */
  static async removeToken(tokenName: string): Promise<boolean> {
    try {
      // Remove from environment variables if possible
      if (typeof process !== 'undefined' && process.env) {
        const envVarName = tokenName.toUpperCase();
        delete process.env[envVarName];
      }
      
      if (Platform.isDesktopEnvironment()) {
        // Remove from OS credential store via Electron
        await (window as any).electron.removeCredential(tokenName);
        
        // Remove from .env file if it exists
        try {
          const homeDir = Platform.getHomePath();
          const envPath = `${homeDir}${Platform.getPathSeparator()}.mcp-env`;
          const envContent = await FileSystemService.readFile(envPath);
          
          if (envContent) {
            const envVarName = tokenName.toUpperCase();
            const envLines = envContent.split('\n');
            const filteredLines = envLines.filter(line => 
              !line.trim().startsWith(`${envVarName}=`));
              
            // Write updated .env file
            if (filteredLines.length !== envLines.length) {
              await FileSystemService.writeFile(
                envPath, 
                filteredLines.join('\n')
              );
            }
          }
        } catch (e) {
          // .env file doesn't exist or can't be read/written
          console.warn("Could not update .env file:", e);
        }
        
        return true;
      } else {
        // For web, remove from sessionStorage
        sessionStorage.removeItem(`token_${tokenName}`);
        
        // Also remove from localStorage if it exists
        localStorage.removeItem(`secure_token_${tokenName}`);
        
        return true;
      }
    } catch (error) {
      console.error("Failed to remove token:", error);
      return false;
    }
  }

  /**
   * Creates a wrapper script for secure token usage
   * @param scriptType Type identifier for the script
   * @param tokenName Name/key of the token in secure storage
   * @param additionalParams Additional parameters for the script
   * @returns Promise resolving to path of created script
   */
  static async createWrapperScript(
    scriptType: string, 
    tokenName: string, 
    additionalParams: Record<string, any> = {}
  ): Promise<string> {
    if (!Platform.isDesktopEnvironment()) {
      throw new Error("Wrapper scripts can only be created in desktop environment");
    }

    try {
      // This would generate an appropriate script based on platform
      const isWindows = Platform.isWindows();
      let scriptContent = '';
      
      if (isWindows) {
        scriptContent = `
# Token wrapper script for ${scriptType}
# Generated by MCP Configuration Tool

$env:API_TOKEN = "$(Get-StoredCredential -Target "${tokenName}")"
npx @llmindset/mcp-${scriptType} ${this.formatAdditionalParams(additionalParams)}
`;
      } else {
        scriptContent = `#!/bin/bash
# Token wrapper script for ${scriptType}
# Generated by MCP Configuration Tool

export API_TOKEN="$(security find-generic-password -a "$USER" -s "${tokenName}" -w)"
npx @llmindset/mcp-${scriptType} ${this.formatAdditionalParams(additionalParams)}
`;
      }

      // Create the script directory
      const scriptDir = isWindows 
        ? `${Platform.getAppDataPath()}\\MCP-Config` 
        : `${Platform.getHomePath()}/.mcp-config`;
        
      await FileSystemService.createDirectoryIfNotExists(scriptDir);
      
      // Save the script
      const scriptPath = isWindows
        ? `${scriptDir}\\${scriptType}_wrapper.ps1`
        : `${scriptDir}/${scriptType}_wrapper.sh`;
        
      await FileSystemService.writeFile(scriptPath, scriptContent);
      
      // On Unix systems, make the script executable
      if (!isWindows) {
        await (window as any).electron.makeFileExecutable(scriptPath);
      }
      
      return scriptPath;
    } catch (error) {
      console.error("Failed to create wrapper script:", error);
      throw error;
    }
  }

  /**
   * Formats additional parameters for wrapper scripts
   * @param params Parameter object
   * @returns Formatted parameter string
   */
  private static formatAdditionalParams(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `--${key} "${value}"`)
      .join(' ');
  }
}
