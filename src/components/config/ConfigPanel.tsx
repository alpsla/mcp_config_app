import React from 'react';
import './ConfigPanel.css';

interface ConfigPanelProps {
  children: React.ReactNode;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ children }) => {
  return (
    <div className="config-panel">
      {children}
    </div>
  );
};
