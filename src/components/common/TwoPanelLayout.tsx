import React from 'react';
import './TwoPanelLayout.css';

interface TwoPanelLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const TwoPanelLayout: React.FC<TwoPanelLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <div className="two-panel-layout">
      <div className="panel left-panel">
        {leftPanel}
      </div>
      <div className="panel right-panel">
        {rightPanel}
      </div>
    </div>
  );
};
