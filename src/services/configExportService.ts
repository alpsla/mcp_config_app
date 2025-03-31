import { MCPDesktopConfig, MCPConfiguration, WebSearchConfig, FileSystemConfig, HuggingFaceConfig } from '../types';
import { Platform } from '../utils/platform';

/**
 * Service for exporting configurations in Claude-compatible format
 */
export class ConfigExportService {
  /**
   * Convert an app configuration to Claude's required format
   * @param config The configuration to convert
   * @param webSearchConfig Web search specific configuration
   * @param fileSystemConfig File system specific configuration
   * @param huggingFaceConfig Hugging Face specific configuration
   * @returns Formatted MCPDesktopConfig for Claude
   */
  generateClaudeConfig(
    config: MCPConfiguration,
    webSearchConfig?: WebSearchConfig,
    fileSystemConfig?: FileSystemConfig,
    huggingFaceConfig?: HuggingFaceConfig
  ): MCPDesktopConfig {
    const desktopConfig: MCPDesktopConfig = {
      configId: config.id,
      mcpServers: {},
      servers: [],
      format: 'json'
    };

    // Add Web Search configuration if enabled
    if (webSearchConfig?.enabled) {
      desktopConfig.mcpServers = {
        ...desktopConfig.mcpServers,
        websearch: {
          command: "npx",
          args: [
            "@llmindset/mcp-websearch",
            "--results", 
            webSearchConfig.resultCount?.toString() || "5",
            "--safe-search", 
            (webSearchConfig.safeSearch !== false).toString()
          ]
        }
      };

      // Add to servers array for backward compatibility
      desktopConfig.servers.push({
        id: webSearchConfig.id,
        enabled: true,
        args: [
          "--results", webSearchConfig.resultCount?.toString() || "5",
          "--safe-search", (webSearchConfig.safeSearch !== false).toString()
        ]
      });
    }

    // Add File System configuration if enabled
    if (fileSystemConfig?.enabled && fileSystemConfig.directories.length > 0) {
      desktopConfig.mcpServers = {
        ...desktopConfig.mcpServers,
        filesystem: {
          command: "npx",
          args: [
            "@llmindset/mcp-filesystem", 
            "--directory", 
            fileSystemConfig.directories[0] // Using the first directory
          ]
        }
      };

      // Add to servers array for backward compatibility
      desktopConfig.servers.push({
        id: fileSystemConfig.id,
        enabled: true,
        args: ["--directory", fileSystemConfig.directories[0]]
      });
    }

    // Add Hugging Face configuration if enabled
    if (huggingFaceConfig?.enabled && huggingFaceConfig.models.some(m => m.enabled)) {
      const enabledModels = huggingFaceConfig.models.filter(m => m.enabled);
      
      if (enabledModels.length > 0) {
        // Create wrapper script path
        // Get platform in a format compatible with our utility
        const platform = Platform.isWindows() ? 'windows' : 
                          Platform.isMac() ? 'macos' : 
                          Platform.isLinux() ? 'linux' : 'unknown';
        const scriptName = `hf_wrapper.${Platform.isWindows() ? 'ps1' : 'sh'}`;
        const scriptPath = platform === 'windows' 
          ? `${process.env.NEXT_PUBLIC_APP_DATA_PATH || '%APPDATA%'}\\MCP-Config\\${scriptName}`
          : `${process.env.NEXT_PUBLIC_HOME_PATH || '~'}/.mcp-config/${scriptName}`;
        
        // Add configuration for the first enabled model (we'll handle multiple models in Phase 2)
        const firstModel = enabledModels[0];
        
        desktopConfig.mcpServers = {
          ...desktopConfig.mcpServers,
          huggingface: {
            command: Platform.isWindows() ? 'powershell.exe' : '/bin/bash',
            args: [
              scriptPath,
              "--model-id", 
              firstModel.id
            ]
          }
        };

        // Add to servers array for backward compatibility
        desktopConfig.servers.push({
          id: huggingFaceConfig.id,
          enabled: true,
          args: ["--model-id", firstModel.id],
          tokenValue: huggingFaceConfig.token
        });
      }
    }

    return desktopConfig;
  }

  /**
   * Generate wrapper scripts for secure token handling
   * @param token The API token to secure
   * @returns Object containing script content for each platform
   */
  generateWrapperScripts(token: string): {
    windows: string;
    macos: string;
    linux: string;
  } {
    // Windows PowerShell script
    const windowsScript = `
# Hugging Face API wrapper script
# This script securely injects the HF token into the environment
# without exposing it in the Claude configuration

# Get command line arguments
param (
    [Parameter(Mandatory=$true)]
    [string]$modelId
)

# Set the API token as an environment variable
$env:HF_TOKEN = "${token}"

# Call the MCP server with the environment variable set
npx @llmindset/mcp-huggingface --model-id $modelId

# Clean up the environment variable when done
Remove-Item Env:\\HF_TOKEN
`;

    // Unix (macOS/Linux) shell script
    const unixScript = `
#!/bin/bash

# Hugging Face API wrapper script
# This script securely injects the HF token into the environment
# without exposing it in the Claude configuration

# Get model ID from command line arguments
model_id=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --model-id)
      model_id="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [ -z "$model_id" ]; then
  echo "Error: --model-id parameter is required"
  exit 1
fi

# Set the API token as an environment variable
export HF_TOKEN="${token}"

# Call the MCP server with the environment variable set
npx @llmindset/mcp-huggingface --model-id "$model_id"

# Clean up the environment variable when done
unset HF_TOKEN
`;

    return {
      windows: windowsScript,
      macos: unixScript,
      linux: unixScript
    };
  }

  /**
   * Exports a configuration to JSON format
   * @param config The configuration to export
   * @returns JSON string of the configuration
   */
  exportAsJson(config: MCPDesktopConfig): string {
    return JSON.stringify(config, null, 2);
  }

  /**
   * Copies configuration to clipboard
   * @param config Configuration JSON string
   * @returns Promise that resolves when copied
   */
  async copyToClipboard(config: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(config);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to copy configuration:", error);
      return Promise.reject(error);
    }
  }

  /**
   * Downloads configuration as a JSON file
   * @param config Configuration JSON string
   * @param filename Name of the file to download
   */
  downloadAsFile(config: string, filename: string = "claude_config.json"): void {
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Validates a configuration object to ensure it meets Claude's requirements
   * @param config Configuration object to validate
   * @throws Error if configuration is invalid
   */
  validateConfiguration(config: MCPDesktopConfig): void {
    // Check if at least one server is enabled
    if (!config.mcpServers || Object.keys(config.mcpServers).length === 0) {
      throw new Error("Configuration must include at least one MCP server");
    }
    
    // Validate each server configuration
    for (const [serverType, serverConfig] of Object.entries(config.mcpServers)) {
      // Every server must have a command
      if (!serverConfig.command) {
        throw new Error(`Server "${serverType}" is missing a command`);
      }
      
      // Every server must have args array (can be empty)
      if (!Array.isArray(serverConfig.args)) {
        throw new Error(`Server "${serverType}" must have an args array`);
      }
      
      // Add specific validations for each server type
      switch (serverType) {
        case 'filesystem':
          if (!serverConfig.args.includes('--directory')) {
            throw new Error('File System server must include a --directory argument');
          }
          break;
          
        case 'websearch':
          if (!serverConfig.args.includes('--results')) {
            throw new Error('Web Search server must include a --results argument');
          }
          break;
          
        case 'huggingface':
          if (!serverConfig.args.includes('--model-id')) {
            throw new Error('Hugging Face server must include a --model-id argument');
          }
          break;
      }
    }
  }
}

export default new ConfigExportService();
