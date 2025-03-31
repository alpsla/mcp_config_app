import { Configuration } from './configurationExport';

// Type guard to check if server config has args property
function hasArgs(config: unknown): config is { args: string[] } {
  return config !== null && typeof config === 'object' && 'args' in config && Array.isArray((config as any).args);
}

// Type guard to check if server config has command property
function hasCommand(config: unknown): config is { command: string } {
  return config !== null && typeof config === 'object' && 'command' in config && typeof (config as any).command === 'string';
}

/**
 * Service for validating configurations with Claude API
 * Our application will pay for validation API calls
 */
export class ClaudeValidationService {
  private static API_URL = 'https://api.claude.ai/validation';
  
  /**
   * Validates a configuration with the Claude API
   * @param config Configuration to validate
   * @returns Promise resolving to validation result
   */
  static async validateConfiguration(config: Configuration): Promise<{
    isValid: boolean;
    message: string;
    details?: {
      issues?: string[];
      serverStatuses?: Record<string, boolean>;
      timestamp?: string;
      tokenUsage?: number;
    };
  }> {
    try {
      // In a real application, this would make an API call to Claude
      // For this example, we'll simulate it
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for basic validation issues
      const validationIssues: string[] = [];
      const serverStatuses: Record<string, boolean> = {};
      
      // Validate each server configuration
      for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
        // Check if server config has args property
        if (!hasArgs(serverConfig)) {
          validationIssues.push(`${serverName} configuration is missing args array`);
          serverStatuses[serverName] = false;
          continue;
        }

        if (serverName === 'filesystem') {
          // Check if args include directory parameter
          const directoryArg = serverConfig.args.findIndex(arg => arg === '--directory');
          if (directoryArg === -1 || directoryArg + 1 >= serverConfig.args.length) {
            validationIssues.push('File System configuration missing directory parameter');
            serverStatuses['filesystem'] = false;
          } else {
            const directory = serverConfig.args[directoryArg + 1];
            if (!directory) {
              validationIssues.push('File System directory not specified');
              serverStatuses['filesystem'] = false;
            } else {
              // In a real app, this would actually validate the directory
              serverStatuses['filesystem'] = true;
            }
          }
        } else if (serverName === 'websearch') {
          // Check if args include required parameters
          const resultsArg = serverConfig.args.findIndex(arg => arg === '--results');
          const safeSearchArg = serverConfig.args.findIndex(arg => arg === '--safe-search');
          
          if (resultsArg === -1 || safeSearchArg === -1) {
            validationIssues.push('Web Search configuration missing required parameters');
            serverStatuses['websearch'] = false;
          } else {
            // In a real app, this would actually validate the parameters
            serverStatuses['websearch'] = true;
          }
        } else if (serverName === 'huggingface') {
          // Check if args include model-id parameter
          const modelArg = serverConfig.args.findIndex(arg => arg === '--model-id');
          if (modelArg === -1 || modelArg + 1 >= serverConfig.args.length) {
            validationIssues.push('Hugging Face configuration missing model ID');
            serverStatuses['huggingface'] = false;
          } else {
            const modelId = serverConfig.args[modelArg + 1];
            if (!modelId) {
              validationIssues.push('Hugging Face model ID not specified');
              serverStatuses['huggingface'] = false;
            } else {
              // In a real app, this would actually validate with the HF API
              serverStatuses['huggingface'] = true;
            }
          }
        } else {
          // Unknown server type
          validationIssues.push(`Unknown server type: ${serverName}`);
          serverStatuses[serverName] = false;
        }
      }
      
      // If there are issues, return invalid status
      if (validationIssues.length > 0) {
        return {
          isValid: false,
          message: 'Configuration validation failed',
          details: {
            issues: validationIssues,
            serverStatuses,
            timestamp: new Date().toISOString(),
            tokenUsage: 10 // Sample token usage
          }
        };
      }
      
      // Otherwise, return successful validation
      return {
        isValid: true,
        message: 'Configuration validated successfully',
        details: {
          serverStatuses,
          timestamp: new Date().toISOString(),
          tokenUsage: 15 // Sample token usage
        }
      };
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
   * Gets the estimated cost of validation
   * @returns Cost estimation in USD
   */
  static getEstimatedValidationCost(): number {
    // Based on Claude API pricing (approximately $0.01-0.03 per 1000 tokens)
    // For a minimal test with short prompts (20-50 tokens)
    return 0.001; // $0.001 per validation
  }
}
