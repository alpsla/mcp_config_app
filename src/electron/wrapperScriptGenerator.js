/**
 * Wrapper Script Generator for Hugging Face API token
 * Generates platform-specific wrapper scripts for securely using Hugging Face API tokens
 * with Claude Desktop MCP integration
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Token service name used in secure storage
 */
const TOKEN_SERVICE = 'HuggingFaceToken';

/**
 * Generates platform-specific wrapper scripts for HF token usage
 */
class WrapperScriptGenerator {
  /**
   * Generate a wrapper script for the current platform
   * @param {string} configPath - Path to the Claude Desktop config file
   * @returns {string} Path to the generated script
   */
  generateScript(configPath) {
    const platform = os.platform();
    
    if (platform === 'darwin') {
      return this.generateMacOSScript(configPath);
    } else if (platform === 'win32') {
      return this.generateWindowsScript(configPath);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
  }
  
  /**
   * Generate a macOS wrapper script
   * @param {string} configPath - Path to the Claude Desktop config file
   * @returns {string} Path to the generated script
   */
  generateMacOSScript(configPath) {
    const configDir = path.dirname(configPath);
    const scriptPath = path.join(configDir, 'hf_token_wrapper.sh');
    
    const scriptContent = `#!/bin/bash
# Hugging Face API token wrapper - generated by MCP Config App

# Get token from secure storage
export HF_TOKEN=$(security find-generic-password -s "${TOKEN_SERVICE}" -w 2>/dev/null)

# Check if token retrieval succeeded
if [ -z "$HF_TOKEN" ]; then
  echo "Error: Could not retrieve Hugging Face API token from secure storage."
  echo "Please set up your token in the MCP Config App first."
  exit 1
fi

# Replace token placeholder in first argument if it's a JSON file
if [[ "$1" == *.json ]]; then
  # Create a temporary file
  TEMP_FILE=$(mktemp)
  # Replace the placeholder with the actual token
  sed "s/{{HF_TOKEN}}/$HF_TOKEN/g" "$1" > "$TEMP_FILE"
  # Use the temporary file instead
  shift
  set -- "$TEMP_FILE" "$@"
fi

# Execute the command with the token as an environment variable
exec "$@"
`;
    
    fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 }); // Make executable
    return scriptPath;
  }
  
  /**
   * Generate a Windows wrapper script
   * @param {string} configPath - Path to the Claude Desktop config file
   * @returns {string} Path to the generated script
   */
  generateWindowsScript(configPath) {
    const configDir = path.dirname(configPath);
    const scriptPath = path.join(configDir, 'hf_token_wrapper.ps1');
    
    const scriptContent = `# Hugging Face API token wrapper - generated by MCP Config App

# Try to retrieve the token from secure storage
try {
  # First try Windows Credential Manager
  try {
    $cred = Get-StoredCredential -Target "${TOKEN_SERVICE}"
    if ($cred) {
      $env:HF_TOKEN = $cred.GetNetworkCredential().Password
    }
  } catch {
    # Fall back to encrypted file storage
    $secureFilePath = "$env:USERPROFILE\\.hf_token_secure.txt"
    if (Test-Path $secureFilePath) {
      $secureString = Get-Content $secureFilePath | ConvertTo-SecureString
      $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
      $env:HF_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
      [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    }
  }
  
  if ([string]::IsNullOrEmpty($env:HF_TOKEN)) {
    throw "Empty token retrieved"
  }
  
  # Replace token placeholder in first argument if it's a JSON file
  if ($args[0] -like "*.json") {
    # Create a temporary file
    $tempFile = [System.IO.Path]::GetTempFileName()
    # Replace the placeholder with the actual token
    (Get-Content $args[0]) -replace "{{HF_TOKEN}}", "$env:HF_TOKEN" | Set-Content $tempFile
    # Use the temporary file instead
    $newArgs = @($tempFile) + $args[1..($args.Length-1)]
    $args = $newArgs
  }
  
} catch {
  Write-Error "Error: Could not retrieve Hugging Face API token from secure storage."
  Write-Error "Please set up your token in the MCP Config App first."
  exit 1
}

# Execute the command with the token as an environment variable
& $args
`;
    
    fs.writeFileSync(scriptPath, scriptContent);
    return scriptPath;
  }
  
  /**
   * Update the Claude Desktop config file to use the wrapper script
   * @param {string} configPath - Path to the Claude Desktop config file
   * @param {string} scriptPath - Path to the generated wrapper script
   */
  updateConfigFile(configPath, scriptPath) {
    try {
      // Make sure the config file exists
      if (!fs.existsSync(configPath)) {
        const defaultConfig = { mcpServers: {} };
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      }
      
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
      
      // Find HF related servers and update their environment variables
      let hasHfServer = false;
      Object.keys(config.mcpServers).forEach(serverName => {
        const server = config.mcpServers[serverName];
        
        // If this server has HF in the name or uses HF API
        if (
          serverName.toLowerCase().includes('hf') ||
          serverName.toLowerCase().includes('huggingface')
        ) {
          hasHfServer = true;
          
          // Create or update env section
          if (!server.env) {
            server.env = {};
          }
          
          // Update token
          server.env.HF_TOKEN = '{{HF_TOKEN}}';
          
          // Add comment about token placeholder
          server.comment = "Uses securely stored Hugging Face token";
        }
      });
      
      // Add a generic huggingface server entry if none exists
      if (!hasHfServer) {
        // Add a placeholder server that uses the wrapper script
        config.mcpServers.huggingface = {
          command: scriptPath,
          args: [],
          env: {
            HF_TOKEN: '{{HF_TOKEN}}'
          },
          comment: "Uses securely stored Hugging Face token"
        };
      }
      
      // Save updated config
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      
      console.log(`Updated config file ${configPath} to use wrapper script ${scriptPath}`);
    } catch (error) {
      console.error(`Error updating config file: ${error}`);
      throw error;
    }
  }
}

module.exports = new WrapperScriptGenerator();