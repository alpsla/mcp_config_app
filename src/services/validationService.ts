import { Configuration } from './configurationExport';

// Type guard to check if server config has args
function hasArgs(config: any): config is { args: string[] } {
  return config && Array.isArray(config.args);
}

// Type guard to check if server config has command
function hasCommand(config: any): config is { command: string } {
  return config && typeof config.command === 'string';
}

/**
 * Service for validating MCP configurations with Claude API
 * Our application will pay for validation API calls
 */
export class ValidationService {
  private static VALIDATION_ENDPOINT = 'https://api.claude.ai/validation';
  
  /**
   * Validates a configuration with the Claude API
   * @param config MCP configuration to validate
   * @returns Promise resolving to validation result
   */
  static async validateConfiguration(config: Configuration): Promise<{
    isValid: boolean;
    message: string;
    details?: {
      issues?: string[];
      serverStatuses?: Record<string, string>;
      tokenUsage?: number;
      timestamp?: string;
    };
  }> {
    try {
      // In a real application, this would make an authenticated API call to Claude
      // For this demo, we'll simulate it with realistic validation logic
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for common validation issues
      const validationIssues: string[] = [];
      const serverStatuses: Record<string, string> = {};
      
      // Validate each server configuration
      for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
        // Check if the server config has the required properties
        if (!hasArgs(serverConfig)) {
          validationIssues.push(`${serverName} configuration is missing args array`);
          serverStatuses[serverName] = 'error';
          continue;
        }

        if (serverName === 'filesystem') {
          // Check if directory parameter is present and valid
          const directoryArg = serverConfig.args.findIndex(arg => arg === '--directory');
          
          if (directoryArg === -1 || directoryArg + 1 >= serverConfig.args.length) {
            validationIssues.push('File System configuration missing directory parameter');
            serverStatuses['filesystem'] = 'error';
          } else {
            const directory = serverConfig.args[directoryArg + 1];
            if (!directory) {
              validationIssues.push('File System directory not specified');
              serverStatuses['filesystem'] = 'error';
            } else {
              // In a real implementation, we would validate that the directory exists
              serverStatuses['filesystem'] = 'ok';
            }
          }
        } else if (serverName === 'websearch') {
          // Check if required parameters are present
          const resultsArg = serverConfig.args.findIndex(arg => arg === '--results');
          const safeSearchArg = serverConfig.args.findIndex(arg => arg === '--safe-search');
          
          if (resultsArg === -1 || resultsArg + 1 >= serverConfig.args.length) {
            validationIssues.push('Web Search configuration missing results parameter');
            serverStatuses['websearch'] = 'error';
          } else if (safeSearchArg === -1 || safeSearchArg + 1 >= serverConfig.args.length) {
            validationIssues.push('Web Search configuration missing safe-search parameter');
            serverStatuses['websearch'] = 'error';
          } else {
            // Validate specific parameter values
            const resultsValue = parseInt(serverConfig.args[resultsArg + 1], 10);
            if (isNaN(resultsValue) || resultsValue < 1 || resultsValue > 10) {
              validationIssues.push('Web Search results parameter must be between 1 and 10');
              serverStatuses['websearch'] = 'warning';
            } else {
              // Perform a test search query
              try {
                // In a real implementation, we would make a test API call
                // For this demo, simulate a successful response
                serverStatuses['websearch'] = 'ok';
              } catch (err) {
                validationIssues.push('Web Search API test failed: ' + (err as Error).message);
                serverStatuses['websearch'] = 'error';
              }
            }
          }
        } else if (serverName === 'huggingface') {
          // Check if model parameter is present
          const modelArg = serverConfig.args.findIndex(arg => arg === '--model-id');
          
          if (modelArg === -1 || modelArg + 1 >= serverConfig.args.length) {
            validationIssues.push('Hugging Face configuration missing model-id parameter');
            serverStatuses['huggingface'] = 'error';
          } else {
            const modelId = serverConfig.args[modelArg + 1];
            if (!modelId) {
              validationIssues.push('Hugging Face model ID not specified');
              serverStatuses['huggingface'] = 'error';
            } else {
              // In a real implementation, we would validate the model ID with Hugging Face API
              // For this demo, simulate different response based on model format
              if (modelId.includes('/')) {
                // Properly formatted model ID (e.g., "facebook/bart-large-cnn")
                serverStatuses['huggingface'] = 'ok';
              } else {
                validationIssues.push('Hugging Face model ID format is invalid');
                serverStatuses['huggingface'] = 'warning';
              }
              
              // Check for valid token
              // In a real implementation, we would attempt to access the model with the token
              if (hasCommand(serverConfig)) {
                const isWrapperScript = serverConfig.command.includes('wrapper') || 
                    serverConfig.command.includes('powershell') ||
                    serverConfig.command.includes('bash');
                    
                if (!isWrapperScript) {
                  validationIssues.push('Hugging Face configuration might be missing secure token handling');
                  serverStatuses['huggingface'] = 'warning';
                }
              } else {
                validationIssues.push('Hugging Face configuration missing command');
                serverStatuses['huggingface'] = 'error';
              }
            }
          }
        } else {
          // Unknown server type
          validationIssues.push(`Unknown server type: ${serverName}`);
          serverStatuses[serverName] = 'error';
        }
      }
      
      // If no servers are configured, that's an error
      if (Object.keys(config.mcpServers).length === 0) {
        validationIssues.push('Configuration must include at least one MCP server');
        return {
          isValid: false,
          message: 'Configuration validation failed: No servers configured',
          details: {
            issues: validationIssues,
            timestamp: new Date().toISOString(),
            tokenUsage: 5 // Minimal usage for empty validation
          }
        };
      }
      
      // Determine overall validation status
      const hasErrors = Object.values(serverStatuses).includes('error');
      const hasWarnings = Object.values(serverStatuses).includes('warning');
      
      // Calculate simulated token usage based on configuration complexity
      const serverCount = Object.keys(config.mcpServers).length;
      const tokenUsage = 10 + (serverCount * 5) + (validationIssues.length * 2);
      
      if (hasErrors) {
        return {
          isValid: false,
          message: 'Configuration validation failed',
          details: {
            issues: validationIssues,
            serverStatuses,
            tokenUsage,
            timestamp: new Date().toISOString()
          }
        };
      } else if (hasWarnings) {
        return {
          isValid: true,
          message: 'Configuration valid but has warnings',
          details: {
            issues: validationIssues,
            serverStatuses,
            tokenUsage,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        return {
          isValid: true,
          message: 'Configuration validated successfully',
          details: {
            serverStatuses,
            tokenUsage,
            timestamp: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        message: 'Error during validation',
        details: {
          issues: ['An unexpected error occurred during validation'],
          timestamp: new Date().toISOString()
        }
      };
    }
  }
  
  /**
   * Simulates a Claude test prompt to validate an integration
   * @param config Configuration to test
   * @param serverName Server to test
   * @returns Promise resolving to test response
   */
  static async testWithClaude(config: Configuration, serverName: string): Promise<{
    success: boolean;
    response: string;
    tokenUsage: number;
  }> {
    // In a real implementation, this would send a minimal test prompt to Claude
    // using the configured integration
    // Our application will pay for these validation API calls
    
    // Simulate network delay and API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For this demo, simulate different responses based on server type
    if (serverName === 'filesystem') {
      return {
        success: true,
        response: "I can see the files in the configured directory.",
        tokenUsage: 15
      };
    } else if (serverName === 'websearch') {
      return {
        success: true,
        response: "I successfully performed a test web search.",
        tokenUsage: 20
      };
    } else if (serverName === 'huggingface') {
      return {
        success: true,
        response: "I successfully connected to the configured Hugging Face model.",
        tokenUsage: 25
      };
    } else {
      return {
        success: false,
        response: "Unknown server type or connection failed.",
        tokenUsage: 10
      };
    }
  }
  
  /**
   * Gets the estimated cost of validation
   * @returns Cost estimation in USD
   */
  static getEstimatedValidationCost(): number {
    // Based on Claude API pricing (approximately $0.01-0.03 per 1000 tokens)
    // For a minimal test with short prompts (20-50 tokens)
    return 0.001; // $0.001 per validation
  }
  
  /**
   * Gets total validation cost for multiple servers
   * @param serverCount Number of servers to validate
   * @returns Total estimated cost
   */
  static getTotalValidationCost(serverCount: number): number {
    return serverCount * this.getEstimatedValidationCost();
  }
}
