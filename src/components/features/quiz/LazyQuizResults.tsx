'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import { StandardCard } from '@/components/ui/StandardCard';
import { H3, BodyText } from '@/components/ui/Typography';

// Lazy load the heavy quiz results components
const MiniReportCard = dynamic(() => import('./MiniReportCard'), {
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <StandardCard variant="filled" className="w-full max-w-2xl mx-4">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
            {/* Avatar skeleton */}
            <div className="w-32 h-32 mx-auto rounded-2xl bg-primary/20 animate-pulse"></div>
            
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-8 bg-primary/20 rounded-lg w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-primary/10 rounded w-1/3 mx-auto animate-pulse"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse"></div>
            </div>
          </div>
        </div>
      </StandardCard>
    </div>
  ),
  ssr: false
});

// Type-safe wrapper
export default function LazyMiniReportCard(props: ComponentProps<typeof MiniReportCard>) {
  return <MiniReportCard {...props} />;
}