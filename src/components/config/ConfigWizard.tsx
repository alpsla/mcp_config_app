import React, { useState } from 'react';
import { TwoPanelLayout } from '../common/TwoPanelLayout';
import { ServerPanel } from './ServerPanel';
import { ConfigPanel } from './ConfigPanel';
import { WebSearchConfig } from './servers/WebSearchConfig';
import { FileSystemConfig } from './servers/FileSystemConfig';
import { HuggingFaceConfig } from './servers/HuggingFaceConfig';
import { EmptyState } from '../common/EmptyState';
import { useConfig } from '../../hooks/useConfig';
import './ConfigWizard.css';

export const ConfigWizard: React.FC = () => {
  const { config, updateConfig, exportConfig } = useConfig();
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  
  const handleServerSelect = (server: string) => {
    setSelectedServer(server);
  };
  
  const renderServerConfig = () => {
    if (!selectedServer) {
      return <EmptyState />;
    }
    
    switch (selectedServer) {
      case 'websearch':
        return <WebSearchConfig 
          config={config.webSearch} 
          onChange={(webSearch) => updateConfig({ ...config, webSearch })} 
        />;
      case 'filesystem':
        return <FileSystemConfig 
          config={config.fileSystem} 
          onChange={(fileSystem) => updateConfig({ ...config, fileSystem })} 
        />;
      case 'huggingface':
        return <HuggingFaceConfig 
          config={config.huggingFace} 
          onChange={(huggingFace) => updateConfig({ ...config, huggingFace })} 
        />;
      default:
        return <EmptyState />;
    }
  };
  
  return (
    <div className="config-wizard-container">
      <TwoPanelLayout
        leftPanel={
          <ServerPanel 
            selectedServer={selectedServer}
            onServerSelect={handleServerSelect}
          />
        }
        rightPanel={
          <ConfigPanel>
            {renderServerConfig()}
          </ConfigPanel>
        }
      />
      
      <div className="config-wizard-actions">
        <button 
          className="btn btn-outline"
          onClick={() => {
            // Handle import config
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e: any) => {
              const file = e.target.files[0];
              if (file) {
                // Import config handling would go here
              }
            };
            input.click();
          }}
        >
          Import
        </button>
        <button 
          className="btn btn-primary"
          onClick={exportConfig}
        >
          Export
        </button>
      </div>
    </div>
  );
};
