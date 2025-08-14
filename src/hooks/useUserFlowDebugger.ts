/**
 * User Flow Debugging Hook
 * 
 * Tracks and logs user interactions step-by-step for debugging purposes
 * Provides comprehensive logging for quiz taking, onboarding, and results flows
 */

import { useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname, useSearchParams } from 'next/navigation';

interface FlowStep {
  step: string;
  flow: 'onboarding' | 'quiz' | 'results' | 'sharing' | 'navigation';
  timestamp: number;
  userId?: string;
  sessionId?: string;
  data?: any;
  performance?: {
    renderTime?: number;
    loadTime?: number;
  };
}

interface UserFlowDebuggerOptions {
  trackNavigation?: boolean;
  trackInteractions?: boolean;
  trackPerformance?: boolean;
  logToConsole?: boolean;
}

export function useUserFlowDebugger(
  currentFlow: FlowStep['flow'],
  options: UserFlowDebuggerOptions = {}
) {
  const {
    trackNavigation = true,
    trackInteractions = true,  
    trackPerformance = true,
    logToConsole = true
  } = options;

  const { user } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Store flow steps
  const logStep = useCallback((step: Omit<FlowStep, 'timestamp' | 'userId'>) => {
    const flowStep: FlowStep = {
      ...step,
      timestamp: Date.now(),
      userId: user?.id || undefined
    };

    // Add to sessionStorage for persistence across page loads
    const existingSteps = JSON.parse(sessionStorage.getItem('userFlowDebug') || '[]');
    const updatedSteps = [...existingSteps.slice(-49), flowStep]; // Keep last 50 steps
    sessionStorage.setItem('userFlowDebug', JSON.stringify(updatedSteps));

    // Log to console if enabled
    if (logToConsole) {
      const emoji = {
        onboarding: '🎯',
        quiz: '📝', 
        results: '📊',
        sharing: '🔗',
        navigation: '🧭'
      }[step.flow];

      console.log(`${emoji} [USER-FLOW] ${step.flow.toUpperCase()}: ${step.step}`, {
        ...flowStep,
        pathname,
        searchParams: Object.fromEntries(searchParams.entries()),
        userAgent: navigator.userAgent,
        timestamp: new Date(flowStep.timestamp).toISOString()
      });
    }
  }, [user?.id, pathname, searchParams, logToConsole]);

  // Track navigation changes
  useEffect(() => {
    if (!trackNavigation) return;

    logStep({
      step: `Page loaded: ${pathname}`,
      flow: 'navigation',
      data: {
        pathname,
        searchParams: Object.fromEntries(searchParams.entries()),
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent.substring(0, 100)
      }
    });
  }, [pathname, searchParams, trackNavigation, logStep]);

  // Track page performance
  useEffect(() => {
    if (!trackPerformance) return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        logStep({
          step: 'Page performance measured',
          flow: 'navigation',
          performance: {
            loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            renderTime: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
          },
          data: {
            domInteractive: Math.round(navigation.domInteractive - navigation.navigationStart),
            domComplete: Math.round(navigation.domComplete - navigation.navigationStart),
            redirectCount: navigation.redirectCount,
            type: navigation.type
          }
        });
      }
    };

    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [trackPerformance, logStep]);

  // Track authentication state changes
  useEffect(() => {
    logStep({
      step: user ? 'User authenticated' : 'User anonymous',
      flow: 'onboarding',
      data: {
        isSignedIn: !!user,
        userId: user?.id || null,
        email: user?.emailAddresses?.[0]?.emailAddress || null,
        hasOnboarded: user?.publicMetadata?.onboardingComplete || false
      }
    });
  }, [user, logStep]);

  // Provide methods for manual step logging
  const trackQuizStep = useCallback((step: string, data?: any) => {
    logStep({
      step,
      flow: 'quiz',
      data
    });
  }, [logStep]);

  const trackOnboardingStep = useCallback((step: string, data?: any) => {
    logStep({
      step,
      flow: 'onboarding', 
      data
    });
  }, [logStep]);

  const trackResultsStep = useCallback((step: string, data?: any) => {
    logStep({
      step,
      flow: 'results',
      data
    });
  }, [logStep]);

  const trackSharingStep = useCallback((step: string, data?: any) => {
    logStep({
      step,
      flow: 'sharing',
      data
    });
  }, [logStep]);

  const trackInteraction = useCallback((element: string, action: string, data?: any) => {
    if (!trackInteractions) return;
    
    logStep({
      step: `User ${action} on ${element}`,
      flow: currentFlow,
      data: {
        element,
        action,
        ...data
      }
    });
  }, [trackInteractions, currentFlow, logStep]);

  const trackError = useCallback((error: Error | string, context?: any) => {
    logStep({
      step: `Error occurred: ${typeof error === 'string' ? error : error.message}`,
      flow: currentFlow,
      data: {
        error: typeof error === 'string' ? error : {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context,
        pathname,
        searchParams: Object.fromEntries(searchParams.entries())
      }
    });
  }, [currentFlow, logStep, pathname, searchParams]);

  // Get all flow steps for analysis
  const getFlowSteps = useCallback((): FlowStep[] => {
    return JSON.parse(sessionStorage.getItem('userFlowDebug') || '[]');
  }, []);

  // Clear flow history
  const clearFlowHistory = useCallback(() => {
    sessionStorage.removeItem('userFlowDebug');
    console.log('🧹 [USER-FLOW] Flow history cleared');
  }, []);

  // Export flow data for analysis
  const exportFlowData = useCallback(() => {
    const steps = getFlowSteps();
    const exportData = {
      userId: user?.id,
      sessionDate: new Date().toISOString(),
      totalSteps: steps.length,
      flows: steps.reduce((acc, step) => {
        acc[step.flow] = (acc[step.flow] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      steps
    };

    console.log('📋 [USER-FLOW] Flow data exported:', exportData);
    return exportData;
  }, [getFlowSteps, user?.id]);

  return {
    // Manual step tracking
    trackQuizStep,
    trackOnboardingStep,
    trackResultsStep,
    trackSharingStep,
    trackInteraction,
    trackError,
    
    // Flow analysis
    getFlowSteps,
    clearFlowHistory,
    exportFlowData,
    
    // Current state
    currentFlow,
    userId: user?.id
  };
}