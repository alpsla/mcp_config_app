/**
 * Configuration interface for MCP servers
 */
export interface Configuration {
  mcpServers: {
    [key: string]: {
      command: string;
      args: string[];
      [key: string]: any;
    };
  };
}

/**
 * Generate MCP configuration JSON
 * @param servers Object containing enabled server configurations
 * @returns Formatted JSON string
 */
export const generateConfiguration = (servers: Record<string, any>): string => {
  const mcpServers: Record<string, any> = {};
  
  // Format each enabled server for export
  Object.entries(servers).forEach(([serverType, config]) => {
    switch (serverType) {
      case 'filesystem':
        // Use directories array if available
        if (config.directories && config.directories.length > 0) {
          const args = ['@anthropic-ai/mcp-filesystem'];
          
          // Add each directory as a separate --directory argument
          config.directories.forEach(dir => {
            args.push('--directory', dir);
          });
          
          mcpServers.filesystem = {
            command: 'npx',
            args: args
          };
        } else {
          // Fallback to single directory
          mcpServers.filesystem = {
            command: 'npx',
            args: ['@anthropic-ai/mcp-filesystem', '--directory', config.directory]
          };
        }
        break;
      case 'websearch':
        mcpServers.websearch = {
          command: 'npx',
          args: [
            '@anthropic-ai/mcp-web-search', 
            '--results-count', String(config.results),
            '--safe-search', String(config.safeSearch)
          ]
        };
        break;
      case 'huggingface':
        mcpServers.huggingface = {
          command: 'npx',
          args: ['@anthropic-ai/mcp-huggingface', '--model-id', config.modelId]
        };
        
        // Add optional parameters if present
        if (config.parameters) {
          Object.entries(config.parameters).forEach(([key, value]) => {
            mcpServers.huggingface.args.push(`--${key}`, String(value));
          });
        }
        break;
      default:
        break;
    }
  });
  
  // Final JSON structure
  const configJson = {
    mcpServers
  };
  
  return JSON.stringify(configJson, null, 2);
};

/**
 * Copy configuration JSON to clipboard
 * @param jsonString The JSON string to copy
 * @returns Promise indicating success
 */
export const copyConfigurationToClipboard = async (jsonString: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(jsonString);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
};

/**
 * Download configuration as a JSON file
 * @param jsonString The JSON string to download
 * @param filename The filename to use
 */
export const downloadConfiguration = (jsonString: string, filename: string): void => {
  try {
    // Create a blob with the JSON content
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    // Click the anchor to trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download configuration:', error);
    throw error;
  }
};
