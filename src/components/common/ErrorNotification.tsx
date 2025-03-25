import React, { useState, useEffect } from 'react';
import './ErrorNotification.css';

interface ErrorNotificationProps {
  message: string;
  autoHide?: boolean;
  autoHideDelay?: number;
  type?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
}

/**
 * A simple notification component for displaying errors, warnings, and other messages
 */
export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  autoHide = true,
  autoHideDelay = 5000,
  type = 'error',
  onClose
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onClose]);
  
  if (!visible) return null;
  
  return (
    <div className={`error-notification ${type}`}>
      <div className="error-message">
        {message}
      </div>
      <button 
        className="error-close-button"
        onClick={() => {
          setVisible(false);
          if (onClose) {
            onClose();
          }
        }}
      >
        ×
      </button>
    </div>
  );
};

export default ErrorNotification;
