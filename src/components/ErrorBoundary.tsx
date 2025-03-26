import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AuthErrorHandler } from '../utils/authErrorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors
 * Especially useful for catching React Router context errors
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Check for React Router errors
    if (
      error.message.includes('useNavigate') ||
      error.message.includes('Router') ||
      error.message.includes('outside')
    ) {
      // Handle router context error
      AuthErrorHandler.handleRouterContextError(error);
    } else {
      // Handle other errors
      AuthErrorHandler.diagnoseError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>The application has encountered an error. It will refresh automatically in a few seconds.</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            style={{
              padding: '8px 16px',
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Refresh Now
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
