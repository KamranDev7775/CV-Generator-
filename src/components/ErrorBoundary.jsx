import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary to catch JavaScript errors anywhere in child component tree
 * Prevents entire app from crashing on component errors
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Optional: Send to error tracking service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full">
            <div className="text-center space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              {/* Error Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-slate-800">
                  Something went wrong
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We apologize for the inconvenience. An unexpected error occurred.
                </p>
              </div>
              
              {/* Error Details (collapsed by default) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left">
                  <details className="bg-slate-100 rounded-lg p-4 text-sm">
                    <summary className="cursor-pointer font-medium text-slate-700">
                      Error Details
                    </summary>
                    <pre className="mt-3 text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="inline-flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="bg-black text-white hover:bg-gray-900"
                >
                  Reload Page
                </Button>
              </div>
              
              {/* Support Link */}
              <p className="text-sm text-slate-500">
                If the problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
