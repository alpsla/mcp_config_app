import React, { useState } from 'react';
import { TwoPanelLayout } from '../common/TwoPanelLayout';
import { ServerPanel } from './ServerPanel';
import { ConfigPanel } from './ConfigPanel';
import { WebSearchConfig } from './servers/WebSearchConfig';
import { FileSystemConfig } from './servers/FileSystemConfig';
import { HuggingFaceConfig } from './servers/HuggingFaceConfig';
import { EmptyState } from '../common/EmptyState';
import { useConfig } from '../../hooks/useConfig';
import Header from '../common/Header';
import Footer from '../common/Footer';
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
    <>
      <Header 
        appName="MCP Configuration Tool" 
        navLinks={[
          { to: '/', label: 'Home' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/configuration', label: 'Configuration' },
          { to: '/pricing', label: 'Pricing' }
        ]}
        isAuthenticated={true}
        onSignOut={async () => {
          console.log('Sign out');
          window.location.href = '/';
          return Promise.resolve();
        }}
      />
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
      <Footer 
        appName="MCP Configuration Tool"
        platformLinks={[
          { to: '/features', label: 'Features' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/docs', label: 'Documentation' },
          { to: '/changelog', label: 'Changelog' }
        ]}
        companyLinks={[
          { to: '/about', label: 'About Us' },
          { to: '/blog', label: 'Blog' },
          { to: '/careers', label: 'Careers' },
          { to: '/contact', label: 'Contact' }
        ]}
        isAuthenticated={true}
      />
    </>
  );
};
