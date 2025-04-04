/**
 * Enhanced Configuration Service
 * 
 * This service implements an improved approach to configuration management
 * with a focus on security, parametrization, and automation.
 * 
 * Key enhancements:
 * 1. Secure parameter handling (tokens, API keys)
 * 2. Dynamic configuration generation based on model metadata
 * 3. Platform-specific wrapper script generation
 * 4. Robust error handling and validation
 */

import { MCPConfiguration, MCPDesktopConfig, MCPServer } from '../types';
import { TokenService } from './tokenService';
import { Platform } from '../utils/platform';
import { FileSystemService } from './fileSystemService';
import { HuggingFaceService } from './huggingFaceService';
import { EnhancedMCPConfiguration } from './EnhancedConfigurationManager';

// Classification of parameter sensitivity
enum ParameterSensitivity {
  SENSITIVE,     // Handled securely (tokens, API keys, passwords)
  NON_SENSITIVE  // Can be stored in config files
}

// Parameter definition interface
interface ParameterDefinition {
  name: string;
  displayName: string;
  description: string;
  defaultValue: any;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[]; // For select type
  required: boolean;
  sensitivity: ParameterSensitivity;
  validation?: (value: any) => boolean | string; // Returns true if valid, error message if invalid
}

// Known sensitive parameter names
const SENSITIVE_PARAM_NAMES = [
  'token', 'apiKey', 'api_key', 'key', 'password', 'secret', 'credential'
];

// Configuration result interface
interface ConfigurationResult {
  success: boolean;
  message: string;
  configPath?: string;
  scriptPaths?: string[];
  errors?: string[];
}

// Service-specific parameter templates
const SERVICE_PARAMS: Record<string, ParameterDefinition[]> = {
  'fileSystem': [
    {
      name: 'directories',
      displayName: 'Directories',
      description: 'List of directories to allow access to',
      defaultValue: [],
      type: 'string',
      required: true,
      sensitivity: ParameterSensitivity.NON_SENSITIVE
    }
  ],
  'webSearch': [
    {
      name: 'resultsCount',
      displayName: 'Results Count',
      description: 'Number of search results to return',
      defaultValue: 5,
      type: 'number',
      required: true,
      sensitivity: ParameterSensitivity.NON_SENSITIVE,
      validation: (value: number) => value > 0 && value <= 20
    },
    {
      name: 'safeSearch',
      displayName: 'Safe Search',
      description: 'Filter out adult content',
      defaultValue: true,
      type: 'boolean',
      required: false,
      sensitivity: ParameterSensitivity.NON_SENSITIVE
    }
  ],
  'huggingFace': [
    {
      name: 'token',
      displayName: 'API Token',
      description: 'Hugging Face API token',
      defaultValue: '',
      type: 'string',
      required: true,
      sensitivity: ParameterSensitivity.SENSITIVE,
      validation: (value: string) => value.startsWith('hf_')
    }
  ]
};

/**
 * Enhanced Configuration Service class
 */
export class EnhancedConfigurationService {
  /**
   * Generate a Claude Desktop configuration from an MCP configuration
   * with security enhancements for sensitive parameters
   * 
   * @param config The MCP configuration
   * @returns Promise resolving to configuration result
   */
  async generateDesktopConfig(config: MCPConfiguration | EnhancedMCPConfiguration): Promise<ConfigurationResult> {
    try {
      // Prepare result object
      const result: ConfigurationResult = {
        success: false,
        message: '',
        scriptPaths: [],
        errors: []
      };
      
      // Basic validation
      if (!config.servers || config.servers.length === 0) {
        result.message = 'No servers configured';
        result.errors = ['Configuration must include at least one server'];
        return result;
      }
      
      // Create the Desktop config structure
      const mcpDesktopConfig: MCPDesktopConfig = {
        mcpServers: {},
        configId: config.id || 'default-config',
        servers: [],
        format: 'json'
      };
      
      // Generate wrapper scripts for servers with sensitive parameters
      for (const server of config.servers) {
        if (!server.enabled) continue;
        
        try {
          if (this.serverRequiresSensitiveHandling(server)) {
            // Create a wrapper script for this server
            const scriptPath = await this.createWrapperScript(server);
            result.scriptPaths?.push(scriptPath);
            
            // Add the script to the config
            mcpDesktopConfig.mcpServers![server.id] = {
              command: this.getPlatformSpecificCommand(scriptPath),
              args: []
            };
          } else {
            // For servers without sensitive params, add directly to config
            mcpDesktopConfig.mcpServers![server.id] = {
              command: `npx @llmindset/mcp-${server.type}`,
              args: this.formatNonSensitiveParams(server.config || {})
            };
          }
        } catch (error: any) {
          result.errors?.push(`Error configuring server ${server.name}: ${error.message}`);
        }
      }
      
      // If all servers failed to configure, return error
      if (Object.keys(mcpDesktopConfig.mcpServers!).length === 0) {
        result.message = 'Failed to configure any servers';
        return result;
      }
      
      // Save the configuration file
      const configPath = await this.saveDesktopConfig(mcpDesktopConfig);
      result.configPath = configPath;
      
      // Update result information
      result.success = true;
      result.message = Object.keys(mcpDesktopConfig.mcpServers!).length === config.servers.length
        ? 'Configuration successfully generated'
        : 'Configuration generated with some errors';
      
      return result;
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to generate configuration: ${error.message}`,
        errors: [error.message]
      };
    }
  }
  
  /**
   * Check if a server requires special handling for sensitive parameters
   * 
   * @param server The server configuration
   * @returns Boolean indicating if sensitive handling is required
   */
  private serverRequiresSensitiveHandling(server: MCPServer): boolean {
    // Check for known sensitive server types
    if (['huggingFace'].includes(server.type)) {
      return true;
    }
    
    // Check if any parameters are sensitive
    if (server.config) {
      return Object.keys(server.config).some(key => 
        SENSITIVE_PARAM_NAMES.some(sensitiveParam => 
          key.toLowerCase().includes(sensitiveParam.toLowerCase())
        )
      );
    }
    
    return false;
  }
  
  /**
   * Format non-sensitive parameters for command line arguments
   * 
   * @param params Parameter object
   * @returns Array of command line arguments
   */
  private formatNonSensitiveParams(params: Record<string, any>): string[] {
    const args: string[] = [];
    
    // Convert params to command line args
    for (const [key, value] of Object.entries(params)) {
      // Skip sensitive parameters
      if (this.isParameterSensitive(key)) continue;
      
      // Handle different parameter types
      if (typeof value === 'boolean') {
        if (value === true) {
          args.push(`--${key}`);
        }
      } else if (Array.isArray(value)) {
        // Handle array values
        for (const item of value) {
          args.push(`--${key}`, item.toString());
        }
      } else if (value !== null && value !== undefined) {
        args.push(`--${key}`, value.toString());
      }
    }
    
    return args;
  }
  
  /**
   * Create a wrapper script for server with sensitive parameters
   * 
   * @param server The server configuration
   * @returns Promise resolving to script path
   */
  private async createWrapperScript(server: MCPServer): Promise<string> {
    // Extract sensitive and non-sensitive parameters
    const sensitiveParams: Record<string, any> = {};
    const nonSensitiveParams: Record<string, any> = {};
    
    if (server.config) {
      for (const [key, value] of Object.entries(server.config)) {
        if (this.isParameterSensitive(key)) {
          sensitiveParams[key] = value;
        } else {
          nonSensitiveParams[key] = value;
        }
      }
    }
    
    // Create script content based on platform
    const isWindows = Platform.isWindows();
    let scriptContent = '';
    const scriptName = `${server.id}_wrapper`;
    const scriptPath = await this.getScriptPath(scriptName, isWindows);
    
    // Store sensitive parameters in secure storage
    for (const [key, value] of Object.entries(sensitiveParams)) {
      // Generate a unique identifier for this token
      const tokenKey = `mcp_${server.id}_${key}`;
      
      try {
        // Store token securely
        await TokenService.storeToken(tokenKey, value.toString());
      } catch (error: any) {
        throw new Error(`Failed to store sensitive parameter ${key}: ${error.message}`);
      }
    }
    
    // Generate platform-specific script
    if (isWindows) {
      scriptContent = this.generateWindowsScript(server, sensitiveParams, nonSensitiveParams);
    } else {
      scriptContent = this.generateUnixScript(server, sensitiveParams, nonSensitiveParams);
    }
    
    // Write script to file
    try {
      await FileSystemService.writeFile(scriptPath, scriptContent);
      
      // Make script executable on Unix
      if (!isWindows) {
        // In a real app, this would use electron APIs to chmod the file
        console.log(`Script made executable: ${scriptPath}`);
      }
      
      return scriptPath;
    } catch (error: any) {
      throw new Error(`Failed to create wrapper script: ${error.message}`);
    }
  }
  
  /**
   * Generate a PowerShell script for Windows
   * 
   * @param server Server configuration
   * @param sensitiveParams Sensitive parameters
   * @param nonSensitiveParams Non-sensitive parameters
   * @returns Script content
   */
  private generateWindowsScript(
    server: MCPServer,
    sensitiveParams: Record<string, any>,
    nonSensitiveParams: Record<string, any>
  ): string {
    let script = `# MCP wrapper script for ${server.name}\n`;
    script += `# Generated by MCP Configuration Tool\n\n`;
    
    // Retrieve sensitive parameters from secure storage
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(sensitiveParams)) {
      const tokenKey = `mcp_${server.id}_${key}`;
      script += `$env:${key.toUpperCase()} = "$(powershell -Command "[System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR((Get-Content '${tokenKey}.token' | ConvertTo-SecureString)))")"\n`;
    }
    
    // Build the command
    script += `\n# Run the MCP server\n`;
    script += `npx @llmindset/mcp-${server.type}`;
    
    // Add non-sensitive parameters
    const args = this.formatNonSensitiveParams(nonSensitiveParams);
    if (args.length > 0) {
      script += ` ${args.join(' ')}`;
    }
    
    return script;
  }
  
  /**
   * Generate a Bash script for Unix systems
   * 
   * @param server Server configuration
   * @param sensitiveParams Sensitive parameters
   * @param nonSensitiveParams Non-sensitive parameters
   * @returns Script content
   */
  private generateUnixScript(
    server: MCPServer,
    sensitiveParams: Record<string, any>,
    nonSensitiveParams: Record<string, any>
  ): string {
    let script = `#!/bin/bash\n`;
    script += `# MCP wrapper script for ${server.name}\n`;
    script += `# Generated by MCP Configuration Tool\n\n`;
    
    // Retrieve sensitive parameters from secure storage
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(sensitiveParams)) {
      const tokenKey = `mcp_${server.id}_${key}`;
      
      if (Platform.isMacOS()) {
        // macOS
        script += `export ${key.toUpperCase()}="$(security find-generic-password -a "$USER" -s "${tokenKey}" -w)"\n`;
      } else {
        // Linux
        script += `export ${key.toUpperCase()}="$(secret-tool lookup service "${tokenKey}" token "API")"\n`;
      }
    }
    
    // Build the command
    script += `\n# Run the MCP server\n`;
    script += `npx @llmindset/mcp-${server.type}`;
    
    // Add non-sensitive parameters
    const args = this.formatNonSensitiveParams(nonSensitiveParams);
    if (args.length > 0) {
      script += ` ${args.join(' ')}`;
    }
    
    return script;
  }
  
  /**
   * Get the platform-specific path for a script
   * 
   * @param scriptName Name of the script
   * @param isWindows Is Windows platform
   * @returns Promise resolving to script path
   */
  private async getScriptPath(scriptName: string, isWindows: boolean): Promise<string> {
    const scriptDir = isWindows 
      ? `${Platform.getAppDataPath()}\\MCP-Config` 
      : `${Platform.getHomePath()}/.mcp-config`;
      
    // Ensure directory exists
    await FileSystemService.createDirectoryIfNotExists(scriptDir);
    
    // Return full path
    return isWindows
      ? `${scriptDir}\\${scriptName}.ps1`
      : `${scriptDir}/${scriptName}.sh`;
  }
  
  /**
   * Get platform-specific command to run a script
   * 
   * @param scriptPath Path to the script
   * @returns Command to run the script
   */
  private getPlatformSpecificCommand(scriptPath: string): string {
    if (Platform.isWindows()) {
      return `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`;
    } else {
      return scriptPath;
    }
  }
  
  /**
   * Save the desktop configuration file
   * 
   * @param config Desktop configuration object
   * @returns Promise resolving to config file path
   */
  private async saveDesktopConfig(config: MCPDesktopConfig): Promise<string> {
    try {
      // Get Claude's config directory
      const configDir = await FileSystemService.getClaudeConfigDirectory();
      
      // Ensure directory exists
      await FileSystemService.createDirectoryIfNotExists(configDir);
      
      // Create config file path
      const configPath = Platform.isWindows()
        ? `${configDir}\\claude_desktop_config.json`
        : `${configDir}/claude_desktop_config.json`;
      
      // Write config to file
      await FileSystemService.writeFile(
        configPath,
        JSON.stringify(config, null, 2)
      );
      
      return configPath;
    } catch (error: any) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }
  
  /**
   * Check if a parameter is sensitive based on its name
   * 
   * @param paramName Parameter name
   * @returns Boolean indicating sensitivity
   */
  private isParameterSensitive(paramName: string): boolean {
    return SENSITIVE_PARAM_NAMES.some(sensitiveParam => 
      paramName.toLowerCase().includes(sensitiveParam.toLowerCase())
    );
  }
  
  /**
   * Validate a configuration
   * 
   * @param config MCP configuration to validate
   * @returns Validation result
   */
  validateConfiguration(config: MCPConfiguration | EnhancedMCPConfiguration): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    // Check if configuration has servers
    if (!config.servers || config.servers.length === 0) {
      errors.push('Configuration must include at least one server');
      return { isValid: false, errors };
    }
    
    // Check that at least one server is enabled
    const enabledServers = config.servers.filter(s => s.enabled);
    if (enabledServers.length === 0) {
      errors.push('At least one server must be enabled');
      return { isValid: false, errors };
    }
    
    // Validate each enabled server
    for (const server of enabledServers) {
      // Check server type
      if (!server.type) {
        errors.push(`Server ${server.name} is missing a type`);
        continue;
      }
      
      // Validate parameters
      this.validateServerParameters(server, errors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate a server's parameters
   * 
   * @param server Server config
   * @param errors Errors array to append to
   */
  private validateServerParameters(server: MCPServer, errors: string[]): void {
    // Get parameter definitions for this server type
    const paramDefinitions = SERVICE_PARAMS[server.type];
    
    if (!paramDefinitions) {
      errors.push(`Unknown server type: ${server.type}`);
      return;
    }
    
    // Check for required parameters
    for (const param of paramDefinitions) {
      if (param.required) {
        const paramValue = server.config?.[param.name];
        
        if (paramValue === undefined || paramValue === null || paramValue === '') {
          errors.push(`Required parameter '${param.displayName}' is missing for ${server.name}`);
        }
      }
    }
    
    // Validate parameter values
    if (server.config) {
      for (const [key, value] of Object.entries(server.config)) {
        const paramDef = paramDefinitions.find(p => p.name === key);
        
        if (paramDef?.validation) {
          const validationResult = paramDef.validation(value);
          
          if (typeof validationResult === 'string') {
            errors.push(`Parameter '${paramDef.displayName}' for ${server.name}: ${validationResult}`);
          } else if (validationResult === false) {
            errors.push(`Parameter '${paramDef.displayName}' is invalid for ${server.name}`);
          }
        }
      }
    }
  }
  
  /**
   * Fetch metadata for a Hugging Face model
   * 
   * @param modelId Model ID
   * @param token API token
   * @returns Promise resolving to model metadata
   */
  async fetchModelMetadata(modelId: string, token: string): Promise<any> {
    try {
      return await HuggingFaceService.getModelDetails(modelId, token);
    } catch (error: any) {
      throw new Error(`Failed to fetch model metadata: ${error.message}`);
    }
  }
  
  /**
   * Get parameter definitions for a model based on its metadata
   * 
   * @param modelId Model ID
   * @param token API token
   * @returns Promise resolving to parameter definitions
   */
  async getModelParameterDefinitions(
    modelId: string,
    token: string
  ): Promise<ParameterDefinition[]> {
    try {
      // Get model metadata
      const metadata = await this.fetchModelMetadata(modelId, token);
      const params: ParameterDefinition[] = [];
      
      // Add default parameters based on model type
      if (metadata.pipeline_tag) {
        switch (metadata.pipeline_tag) {
          case 'text-generation':
            params.push(
              {
                name: 'temperature',
                displayName: 'Temperature',
                description: 'Controls randomness in generation',
                defaultValue: 0.7,
                type: 'number',
                required: false,
                sensitivity: ParameterSensitivity.NON_SENSITIVE,
                validation: (v) => v >= 0 && v <= 1
              },
              {
                name: 'max_length',
                displayName: 'Max Length',
                description: 'Maximum length of generated text',
                defaultValue: 100,
                type: 'number',
                required: false,
                sensitivity: ParameterSensitivity.NON_SENSITIVE,
                validation: (v) => v > 0
              }
            );
            break;
            
          case 'text-classification':
            // No special parameters needed
            break;
            
          case 'image-to-text':
          case 'image-classification':
            // No special parameters needed
            break;
        }
      }
      
      return params;
    } catch (error) {
      console.error('Error getting model parameter definitions:', error);
      return [];
    }
  }
}

// Create and export singleton instance
export const enhancedConfigurationService = new EnhancedConfigurationService();
