'use client';

/**
 * Web Vitals Performance Monitoring Component
 * 
 * Tracks Core Web Vitals and custom performance metrics:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID) 
 * - Cumulative Layout Shift (CLS)
 * - First Contentful Paint (FCP)
 * - Time to First Byte (TTFB)
 * - Component render times
 * - GraphQL query performance
 */

import { useEffect } from 'react';
import { Metric } from 'web-vitals';
import { logger } from '@/lib/logger';

interface WebVitalsProps {
  debug?: boolean;
}

// Performance thresholds (Core Web Vitals recommended values)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
};

function getPerformanceGrade(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportWebVital(metric: Metric, debug = false) {
  const grade = getPerformanceGrade(metric.name, metric.value);
  
  logger.info(`Web Vital: ${metric.name}`, {
    component: 'WebVitals',
    action: 'performance_measurement',
    metadata: {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      grade,
      id: metric.id,
      delta: metric.delta,
      entries: metric.entries?.length || 0
    }
  });

  // In development, also log to console for debugging
  if (debug && process.env.NODE_ENV === 'development') {
    console.log(`🚀 ${metric.name}:`, {
      value: `${Math.round(metric.value * 100) / 100}${metric.name === 'CLS' ? '' : 'ms'}`,
      grade,
      rating: metric.rating,
      id: metric.id
    });
  }

  // Send to analytics service (implement as needed)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', metric.name, {
      custom_map: { metric_rating: 'rating' },
      value: Math.round(metric.value),
      metric_rating: metric.rating,
    });
  }
}

export default function WebVitals({ debug = false }: WebVitalsProps) {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    logger.info('Web Vitals monitoring initialized', {
      component: 'WebVitals',
      action: 'initialize'
    });

    // Measure Core Web Vitals using dynamic imports to handle version compatibility
    const measureWebVitals = async () => {
      try {
        const webVitals = await import('web-vitals');
        
        // Use the correct import method based on the version
        if (webVitals.getCLS) {
          webVitals.getCLS((metric: Metric) => reportWebVital(metric, debug));
        } else if ((webVitals as any).onCLS) {
          (webVitals as any).onCLS((metric: Metric) => reportWebVital(metric, debug));
        }
        
        if (webVitals.getFID) {
          webVitals.getFID((metric: Metric) => reportWebVital(metric, debug));
        } else if ((webVitals as any).onFID) {
          (webVitals as any).onFID((metric: Metric) => reportWebVital(metric, debug));
        }
        
        if (webVitals.getFCP) {
          webVitals.getFCP((metric: Metric) => reportWebVital(metric, debug));
        } else if ((webVitals as any).onFCP) {
          (webVitals as any).onFCP((metric: Metric) => reportWebVital(metric, debug));
        }
        
        if (webVitals.getLCP) {
          webVitals.getLCP((metric: Metric) => reportWebVital(metric, debug));
        } else if ((webVitals as any).onLCP) {
          (webVitals as any).onLCP((metric: Metric) => reportWebVital(metric, debug));
        }
        
        if (webVitals.getTTFB) {
          webVitals.getTTFB((metric: Metric) => reportWebVital(metric, debug));
        } else if ((webVitals as any).onTTFB) {
          (webVitals as any).onTTFB((metric: Metric) => reportWebVital(metric, debug));
        }
      } catch (error) {
        logger.warn('Web Vitals measurement failed', {
          component: 'WebVitals',
          action: 'measurement_error',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };
    
    measureWebVitals();

    // Custom performance observer for component renders
    if ('PerformanceObserver' in window) {
      // Observe long tasks (blocking the main thread for >50ms)
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            logger.warn('Long task detected', {
              component: 'WebVitals',
              action: 'long_task',
              duration: entry.duration,
              metadata: {
                startTime: entry.startTime,
                duration: entry.duration,
                name: entry.name
              }
            });
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Longtask API not supported
        logger.debug('Longtask API not supported', {
          component: 'WebVitals',
          action: 'feature_detection'
        });
      }

      // Observe navigation timing
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navigationEntry = entry as PerformanceNavigationTiming;
          
          logger.info('Navigation timing', {
            component: 'WebVitals',
            action: 'navigation_timing',
            metadata: {
              domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
              loadComplete: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
              redirectCount: navigationEntry.redirectCount,
              type: navigationEntry.type
            }
          });
        }
      });

      try {
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        logger.debug('Navigation timing API not supported', {
          component: 'WebVitals',
          action: 'feature_detection'
        });
      }
    }

    // Custom hook for React render timing
    const measureRenderPerformance = () => {
      const renderStart = performance.now();
      
      // Use requestAnimationFrame to measure after render completion
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;
        
        if (renderTime > 16) { // Flag renders slower than 60fps
          logger.warn('Slow render detected', {
            component: 'WebVitals',
            action: 'render_performance',
            duration: renderTime
          });
        }
      });
    };

    // Monitor for slow renders
    measureRenderPerformance();

    // Cleanup function
    return () => {
      logger.debug('Web Vitals monitoring cleanup', {
        component: 'WebVitals',
        action: 'cleanup'
      });
    };
  }, [debug]);

  // Component renders nothing, it's just for monitoring
  return null;
}

// Export hook for manual performance measurements
export function usePerformanceTimer(label: string) {
  return logger.startTimer(label);
}

// Export function for measuring component mount/unmount
export function measureComponentLifecycle(componentName: string) {
  return {
    onMount: () => logger.componentMount(componentName),
    onUnmount: () => logger.componentUnmount(componentName)
  };
}

// Global performance helpers
export const webVitalsHelpers = {
  measureFunction: <T extends (...args: any[]) => any>(fn: T, label: string): T => {
    return ((...args: any[]) => {
      const timer = logger.startTimer(`Function: ${label}`);
      try {
        const result = fn(...args);
        timer();
        return result;
      } catch (error) {
        timer();
        throw error;
      }
    }) as T;
  },

  measureAsyncFunction: <T extends (...args: any[]) => Promise<any>>(fn: T, label: string): T => {
    return (async (...args: any[]) => {
      const timer = logger.startTimer(`Async Function: ${label}`);
      try {
        const result = await fn(...args);
        timer();
        return result;
      } catch (error) {
        timer();
        throw error;
      }
    }) as T;
  }
};