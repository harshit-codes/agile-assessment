'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Lazy load the ChromaGrid component with loading fallback
const ChromaGrid = dynamic(() => import('./ChromaGrid'), {
  loading: () => (
    <div className="grid grid-cols-4 gap-4 p-8">
      {/* Loading skeleton for 16 personality types */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div 
          key={i}
          className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg animate-pulse"
        >
          <div className="p-4 h-full flex flex-col justify-between">
            <div className="h-16 bg-slate-400/30 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-400/30 rounded"></div>
              <div className="h-3 bg-slate-400/20 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  ssr: false, // Don't render on server-side to improve initial page load
});

// Re-export with same interface
export default function ChromaGridLazy(props: ComponentProps<typeof ChromaGrid>) {
  return <ChromaGrid {...props} />;
}