"use client";

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { StandardCard, CardContent } from '@/components/ui/StandardCard';
import { BodyText, H2 } from '@/components/ui/Typography';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔥 ErrorBoundary caught an error:', error, errorInfo);
    console.error('🔥 Error stack:', error.stack);
    console.error('🔥 Component stack:', errorInfo.componentStack);
    
    // Store error details for debugging
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('lastError', JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        timestamp: new Date().toISOString(),
        url: window.location.href
      }));
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <StandardCard className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              
              <H2 className="mb-4">Something went wrong</H2>
              
              <BodyText variant="secondary" className="mb-4">
                We encountered an unexpected error while loading your assessment. 
                Don't worry - your progress has been saved.
              </BodyText>
              
              {process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' ? (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                    🔍 Error Details (for debugging)
                  </summary>
                  <div className="bg-destructive/5 p-3 rounded border text-xs font-mono text-left">
                    <div><strong>Error:</strong> {this.state.error?.name || 'Unknown'}</div>
                    <div><strong>Message:</strong> {this.state.error?.message || 'No message'}</div>
                    <div><strong>Time:</strong> {new Date().toISOString()}</div>
                    {this.state.error?.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-xs">{this.state.error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              ) : null}

              <div className="space-y-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </StandardCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;