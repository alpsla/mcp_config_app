import { useState, useEffect } from 'react';
import { ConfigState, WebSearchConfig, FileSystemConfig, HuggingFaceConfig, SubscriptionTier } from '../types';

// Default configurations
const defaultWebSearchConfig: WebSearchConfig = {
  id: 'web-search',
  enabled: false,
  resultCount: 5,
  safeSearch: true
};

const defaultFileSystemConfig: FileSystemConfig = {
  id: 'file-system',
  enabled: false,
  directories: [],
  useRootPermissions: false
};

const defaultHuggingFaceConfig: HuggingFaceConfig = {
  id: 'huggingface',
  enabled: false,
  token: '',
  models: [
    { id: 'model1', name: 'GPT-Neo', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'model2', name: 'BERT Base', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'model3', name: 'RoBERTa', enabled: false, tier: SubscriptionTier.STARTER },
    { id: 'model4', name: 'BART', enabled: false, tier: SubscriptionTier.STANDARD },
    { id: 'model5', name: 'T5', enabled: false, tier: SubscriptionTier.STANDARD },
    { id: 'model6', name: 'DeBERTa', enabled: false, tier: SubscriptionTier.STANDARD },
    { id: 'model7', name: 'XLNet', enabled: false, tier: SubscriptionTier.COMPLETE },
    { id: 'model8', name: 'ALBERT', enabled: false, tier: SubscriptionTier.COMPLETE },
    { id: 'model9', name: 'Longformer', enabled: false, tier: SubscriptionTier.COMPLETE },
    { id: 'model10', name: 'ELECTRA', enabled: false, tier: SubscriptionTier.COMPLETE }
  ]
};

const defaultConfig: ConfigState = {
  webSearch: defaultWebSearchConfig,
  fileSystem: defaultFileSystemConfig,
  huggingFace: defaultHuggingFaceConfig
};

export const useConfig = () => {
  const [config, setConfig] = useState<ConfigState>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load config from localStorage on initial render
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('mcp_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load configuration');
      setLoading(false);
    }
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('mcp_config', JSON.stringify(config));
    }
  }, [config, loading]);

  const updateConfig = (newConfig: ConfigState) => {
    setConfig(newConfig);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  // Export config to JSON file
  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'mcp_config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import config from JSON file
  const importConfig = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const parsedConfig = JSON.parse(event.target?.result as string);
          setConfig(parsedConfig);
          resolve();
        } catch (err) {
          reject('Invalid configuration file');
        }
      };
      
      reader.onerror = () => {
        reject('Failed to read file');
      };
      
      reader.readAsText(file);
    });
  };

  return {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    loading,
    error
  };
};
