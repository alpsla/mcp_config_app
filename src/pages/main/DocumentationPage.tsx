import React, { useState } from 'react';
import './MainPages.css';

const DocumentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  
  return (
    <div className="documentation-page">
      <div className="doc-header">
        <h1>Documentation</h1>
        <p>
          Learn how to use the MCP Configuration Tool to enhance your Claude experience
        </p>
      </div>
      
      <div className="doc-content">
        <div className="doc-nav">
          <ul>
            <li className={activeTab === 'getting-started' ? 'active' : ''}>
              <button onClick={() => setActiveTab('getting-started')}>Getting Started</button>
            </li>
            <li className={activeTab === 'file-system' ? 'active' : ''}>
              <button onClick={() => setActiveTab('file-system')}>File System Integration</button>
            </li>
            <li className={activeTab === 'web-search' ? 'active' : ''}>
              <button onClick={() => setActiveTab('web-search')}>Web Search Integration</button>
            </li>
            <li className={activeTab === 'hugging-face' ? 'active' : ''}>
              <button onClick={() => setActiveTab('hugging-face')}>Hugging Face Integration</button>
            </li>
            <li className={activeTab === 'troubleshooting' ? 'active' : ''}>
              <button onClick={() => setActiveTab('troubleshooting')}>Troubleshooting</button>
            </li>
          </ul>
        </div>
        
        <div className="doc-tab-content">
          {activeTab === 'getting-started' && (
            <div>
              <h2>Getting Started</h2>
              <p>
                The MCP Configuration Tool helps you configure and manage Claude's Model Control Protocol (MCP) servers
                for different integration types. This guide will walk you through the basic setup process.
              </p>
              <h4>Requirements</h4>
              <ul>
                <li>Claude Desktop application installed</li>
                <li>An active internet connection</li>
                <li>Appropriate permissions for your operating system</li>
              </ul>
            </div>
          )}
          
          {activeTab === 'file-system' && (
            <div>
              <h2>File System Integration</h2>
              <p>
                The File System integration allows Claude to access files and directories on your local machine.
              </p>
              <h4>Configuration Steps</h4>
              <ol>
                <li>Enable the File System integration in the Configuration tool</li>
                <li>Select directories you want Claude to access</li>
                <li>Review permissions and validate the configuration</li>
                <li>Export the configuration to Claude</li>
              </ol>
            </div>
          )}
          
          {activeTab === 'web-search' && (
            <div>
              <h2>Web Search Integration</h2>
              <p>
                Enable Claude to search the web for up-to-date information and provide more accurate responses.
              </p>
              <h4>Configuration Steps</h4>
              <ol>
                <li>Enable the Web Search integration</li>
                <li>Configure search parameters (result count, safe search)</li>
                <li>Validate and export the configuration</li>
              </ol>
            </div>
          )}
          
          {activeTab === 'hugging-face' && (
            <div>
              <h2>Hugging Face Integration</h2>
              <p>
                Connect Claude to powerful AI models from Hugging Face to extend its capabilities.
              </p>
              <h4>Configuration Steps</h4>
              <ol>
                <li>Subscribe to Basic or Complete tier</li>
                <li>Enable Hugging Face integration</li>
                <li>Enter your Hugging Face API token</li>
                <li>Select models based on your subscription tier</li>
                <li>Validate and export the configuration</li>
              </ol>
            </div>
          )}
          
          {activeTab === 'troubleshooting' && (
            <div>
              <h2>Troubleshooting</h2>
              <p>
                Common issues and their solutions.
              </p>
              <h4>Configuration Not Working</h4>
              <ul>
                <li>Ensure Claude Desktop is restarted after configuration</li>
                <li>Check that your API tokens are valid</li>
                <li>Verify directory permissions for File System integration</li>
                <li>Ensure your configuration file is in the correct location</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;