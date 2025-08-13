'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StandardCard, CardContent } from '@/components/ui/StandardCard';
import { BodyText, H1 } from '@/components/ui/Typography';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <StandardCard className="max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          
          <H1 className="mb-4">Oops! Something went wrong</H1>
          
          <BodyText variant="secondary" className="mb-6">
            We encountered an unexpected error. This might be a temporary issue. 
            Your assessment progress has been saved and you can continue where you left off.
          </BodyText>

          <div className="space-y-3">
            <Button
              onClick={reset}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to homepage
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Technical details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </StandardCard>
    </div>
  );
}