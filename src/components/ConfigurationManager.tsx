import React, { useState, useEffect } from 'react';
import FileSystemConfig from './FileSystemIntegration/FileSystemConfig';
import WebSearchConfig from './WebSearchIntegration/WebSearchConfig';
import HuggingFaceConfig from './HuggingFaceIntegration/HuggingFaceConfig';
import { generateConfiguration, copyConfigurationToClipboard, downloadConfiguration } from '../services/configurationExport';
import { FileSystemService } from '../services/fileSystemService';
import { Platform } from '../utils/platform';
import { useAuth } from '../auth/AuthContext';

interface ConfigurationManagerProps {
  userLoggedIn: boolean;
}

interface ConfigurationState {
  name: string;
  filesystem?: { 
    enabled: boolean; 
    directory: string;
  };
  websearch?: {
    enabled: boolean;
    results: number;
    safeSearch: boolean;
    advancedOptions: Record<string, any>;
  };
  huggingface?: {
    enabled: boolean;
    modelId: string;
    parameters: Record<string, any>;
  };
}

const ConfigurationManager: React.FC<ConfigurationManagerProps> = ({ userLoggedIn }) => {
  const { getUserSubscriptionTier } = useAuth();
  const [configuration, setConfiguration] = useState<ConfigurationState>({
    name: 'My Configuration'
  });
  const [configJson, setConfigJson] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('filesystem');
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    details?: Record<string, any>;
  } | null>(null);
  
  // Get the user's subscription tier (none, basic, or complete)
  const subscriptionTier = getUserSubscriptionTier();
  
  // Explicitly type the subscription tier for HuggingFaceConfig
  const huggingFaceTier = subscriptionTier as 'none' | 'basic' | 'complete' | 'free' | 'standard' | 'premium';
  
  // Check if configuration has any servers enabled
  const hasEnabledServers = () => {
    return !!(configuration.filesystem?.enabled || 
              configuration.websearch?.enabled || 
              configuration.huggingface?.enabled);
  };
  
  // Check if user is logged in before performing actions that require auth
  const handleAction = (action: () => void) => {
    if (!userLoggedIn) {
      // Show login prompt
      alert("Please log in to save configurations.");
      return;
    }
    
    action();
  };
  
  // Generate JSON configuration when dependencies change
  useEffect(() => {
    const enabledServers: any = {};
    
    if (configuration.filesystem?.enabled) {
      enabledServers.filesystem = {
        directory: configuration.filesystem.directory
      };
    }
    
    if (configuration.websearch?.enabled) {
      enabledServers.websearch = {
        results: configuration.websearch.results,
        safeSearch: configuration.websearch.safeSearch
      };
    }
    
    if (configuration.huggingface?.enabled) {
      enabledServers.huggingface = {
        modelId: configuration.huggingface.modelId,
        parameters: configuration.huggingface.parameters
      };
    }
    
    const json = generateConfiguration(enabledServers);
    setConfigJson(json);
  }, [configuration]);
  
  // Handle file system configuration updates
  const handleFileSystemUpdate = (fsConfig: { enabled: boolean; directory: string }) => {
    setConfiguration(prev => ({
      ...prev,
      filesystem: fsConfig
    }));
  };
  
  // Handle web search configuration updates
  const handleWebSearchUpdate = (wsConfig: { 
    enabled: boolean; 
    results: number; 
    safeSearch: boolean;
    advancedOptions: Record<string, any>;
  }) => {
    setConfiguration(prev => ({
      ...prev,
      websearch: wsConfig
    }));
  };
  
  // Handle Hugging Face configuration updates
  const handleHuggingFaceUpdate = (hfConfig: { 
    enabled: boolean; 
    modelId: string;
    parameters: Record<string, any>;
  }) => {
    setConfiguration(prev => ({
      ...prev,
      huggingface: hfConfig
    }));
  };
  
  // Wrap authentication-required actions
  const handleCopyConfig = async () => {
    if (!hasEnabledServers()) {
      alert("Please enable at least one integration before copying the configuration.");
      return;
    }
    
    try {
      await copyConfigurationToClipboard(configJson);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('Failed to copy configuration:', error);
    }
  };
  
  // Handle download - requires login
  const handleDownloadConfig = () => {
    if (!hasEnabledServers()) {
      alert("Please enable at least one integration before downloading the configuration.");
      return;
    }
    
    handleAction(() => {
      try {
        const filename = `${configuration.name.replace(/\s+/g, '_').toLowerCase()}.json`;
        downloadConfiguration(configJson, filename);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (error) {
        console.error('Failed to download configuration:', error);
      }
    });
  };
  
  // Save to Claude dir - requires login
  const handleSaveConfigToClaudeDir = async () => {
    if (!hasEnabledServers()) {
      alert("Please enable at least one integration before saving the configuration.");
      return;
    }
    
    handleAction(async () => {
      try {
        if (!Platform.isDesktopEnvironment()) {
          throw new Error('Saving to Claude directory is only available in desktop environment');
        }
        
        const claudeConfigDir = await FileSystemService.getClaudeConfigDirectory();
        const configPath = `${claudeConfigDir}/claude_config.json`;
        
        await FileSystemService.writeFile(configPath, configJson);
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error('Failed to save configuration:', error);
      }
    });
  };
  
  // Validate configuration - requires login
  const handleValidateConfig = async () => {
    if (!hasEnabledServers()) {
      alert("Please enable at least one integration before validating the configuration.");
      return;
    }
    
    handleAction(async () => {
      try {
        setValidationStatus({
          isValid: false,
          message: 'Validating configuration...'
        });
        
        // In a real application, this would make an API call to Claude
        // Our application will pay for validation API calls
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check for basic validation issues
        const validationIssues = [];
        
        if (configuration.filesystem?.enabled && !configuration.filesystem.directory) {
          validationIssues.push('File System directory not specified');
        }
        
        if (configuration.huggingface?.enabled && !configuration.huggingface.modelId) {
          validationIssues.push('Hugging Face model not selected');
        }
        
        // If there are issues, return invalid status
        if (validationIssues.length > 0) {
          setValidationStatus({
            isValid: false,
            message: 'Configuration validation failed',
            details: {
              issues: validationIssues
            }
          });
          return;
        }
        
        // Otherwise, simulate successful validation
        setValidationStatus({
          isValid: true,
          message: 'Configuration validated successfully',
          details: {
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Validation error:', error);
        setValidationStatus({
          isValid: false,
          message: 'Error during validation',
          details: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }
    });
  };
  
  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfiguration(prev => ({
      ...prev,
      name: e.target.value
    }));
  };
  
  // Handle tab click with proper event handling
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };
  
  return (
    <div className="configuration-manager">
      <div className="manager-header">
        <h1>MCP Configuration Tool</h1>
        <div className="configuration-name">
          <label htmlFor="configName">Configuration Name:</label>
          <input
            id="configName"
            type="text"
            value={configuration.name}
            onChange={handleNameChange}
          />
        </div>
      </div>
      
      <div className="integration-tabs">
        <div
          className={`tab ${activeTab === 'filesystem' ? 'active' : ''}`}
          onClick={() => handleTabClick('filesystem')}
        >
          File System
          {configuration.filesystem?.enabled && <span className="enabled-indicator">✓</span>}
        </div>
        <div
          className={`tab ${activeTab === 'websearch' ? 'active' : ''}`}
          onClick={() => handleTabClick('websearch')}
        >
          Web Search
          {configuration.websearch?.enabled && <span className="enabled-indicator">✓</span>}
        </div>
        <div
          className={`tab ${activeTab === 'huggingface' ? 'active' : ''}`}
          onClick={() => handleTabClick('huggingface')}
        >
          Hugging Face
          {configuration.huggingface?.enabled && <span className="enabled-indicator">✓</span>}
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'filesystem' && (
          <FileSystemConfig 
            onConfigurationUpdate={handleFileSystemUpdate}
            initialConfig={configuration.filesystem}
          />
        )}
        
        {activeTab === 'websearch' && (
          <WebSearchConfig 
            onConfigurationUpdate={handleWebSearchUpdate}
            initialConfig={configuration.websearch}
          />
        )}
        
        {activeTab === 'huggingface' && (
          <HuggingFaceConfig 
            onConfigurationUpdate={handleHuggingFaceUpdate}
            initialConfig={configuration.huggingface}
            userTier={huggingFaceTier}
          />
        )}
      </div>
      
      <div className="configuration-output">
        <h3>Configuration JSON</h3>
        <pre className="json-preview">{configJson}</pre>
        
        <div className="action-buttons">
          <button onClick={handleCopyConfig}>
            {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          
          <button onClick={handleDownloadConfig}>
            {downloadSuccess ? 'Downloaded!' : 'Download JSON'}
            {!userLoggedIn && <span className="login-required"> (Login Required)</span>}
          </button>
          
          {Platform.isDesktopEnvironment() && (
            <button onClick={handleSaveConfigToClaudeDir}>
              {saveSuccess ? 'Saved!' : 'Save to Claude Directory'}
              {!userLoggedIn && <span className="login-required"> (Login Required)</span>}
            </button>
          )}
          
          <button 
            onClick={handleValidateConfig}
            className="validate-button"
          >
            Validate Configuration
            {!userLoggedIn && <span className="login-required"> (Login Required)</span>}
          </button>
        </div>
        
        {validationStatus && (
          <div className={`validation-status ${validationStatus.isValid ? 'valid' : 'invalid'}`}>
            <h4>Validation Result</h4>
            <p>{validationStatus.message}</p>
            
            {validationStatus.details?.issues && (
              <ul className="validation-issues">
                {(validationStatus.details.issues as string[]).map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      <div className="integration-help">
        <h3>Getting Started</h3>
        <p>Enable the integrations you want to use with Claude:</p>
        <ul>
          <li><strong>File System</strong>: Allows Claude to access files on your computer</li>
          <li><strong>Web Search</strong>: Enables Claude to search the internet for up-to-date information</li>
          <li><strong>Hugging Face</strong>: Integrates models from Hugging Face with Claude</li>
        </ul>
        <p>After configuring your integrations, copy the configuration JSON or save it to your Claude directory.</p>
      </div>
    </div>
  );
};

export default ConfigurationManager;