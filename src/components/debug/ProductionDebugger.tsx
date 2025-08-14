'use client';

/**
 * Production Debugging Component for Agile Assessment
 * 
 * Provides comprehensive logging and monitoring for production environment
 * - GraphQL operation tracking with timing
 * - Database connectivity monitoring  
 * - User flow debugging
 * - Error boundary with detailed reporting
 * - Real-time performance metrics
 */

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useUser } from '@clerk/nextjs';
import { GET_ALL_PERSONALITY_TYPES, GET_QUIZ } from '@/lib/graphql/operations';

interface DebugLog {
  timestamp: string;
  type: 'info' | 'warn' | 'error' | 'success';
  category: 'graphql' | 'auth' | 'database' | 'performance' | 'user-flow' | 'network';
  operation?: string;
  duration?: number;
  details: any;
}

interface ProductionDebuggerProps {
  enabledInProduction?: boolean;
}

export default function ProductionDebugger({ enabledInProduction = true }: ProductionDebuggerProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or if explicitly enabled in production
  const shouldShow = process.env.NODE_ENV === 'development' || enabledInProduction;

  const addLog = (log: Omit<DebugLog, 'timestamp'>) => {
    const newLog: DebugLog = {
      ...log,
      timestamp: new Date().toISOString()
    };
    
    setDebugLogs(prev => [...prev.slice(-49), newLog]); // Keep last 50 logs
    
    // Also log to browser console with detailed formatting
    const prefix = `🔍 [${log.category.toUpperCase()}]`;
    const message = `${prefix} ${log.operation || 'Operation'}: ${JSON.stringify(log.details)}`;
    
    switch (log.type) {
      case 'error':
        console.error(message, log.details);
        break;
      case 'warn':
        console.warn(message, log.details);
        break;
      case 'success':
        console.log(`✅ ${message}`, log.details);
        break;
      default:
        console.log(message, log.details);
    }
  };

  // Test critical GraphQL operations on mount
  const { data: personalityTypes, loading: typesLoading, error: typesError } = useQuery(GET_ALL_PERSONALITY_TYPES, {
    onCompleted: (data) => {
      addLog({
        type: 'success',
        category: 'graphql',
        operation: 'GET_ALL_PERSONALITY_TYPES',
        details: {
          count: data?.getAllPersonalityTypes?.length || 0,
          firstType: data?.getAllPersonalityTypes?.[0]?.name || 'N/A'
        }
      });
    },
    onError: (error) => {
      addLog({
        type: 'error',
        category: 'graphql', 
        operation: 'GET_ALL_PERSONALITY_TYPES',
        details: {
          error: error.message,
          networkError: error.networkError,
          graphQLErrors: error.graphQLErrors
        }
      });
    }
  });

  const { data: quizData, loading: quizLoading, error: quizError } = useQuery(GET_QUIZ, {
    variables: { title: 'The Agile Assessment' },
    onCompleted: (data) => {
      addLog({
        type: 'success',
        category: 'database',
        operation: 'GET_QUIZ',
        details: {
          quizId: data?.getQuiz?.id,
          title: data?.getQuiz?.title,
          sectionsCount: data?.getQuiz?.sections?.length || 0
        }
      });
    },
    onError: (error) => {
      addLog({
        type: 'error',
        category: 'database',
        operation: 'GET_QUIZ', 
        details: {
          error: error.message,
          networkError: error.networkError,
          graphQLErrors: error.graphQLErrors
        }
      });
    }
  });

  // Monitor authentication state
  useEffect(() => {
    addLog({
      type: 'info',
      category: 'auth',
      operation: 'AUTH_STATE_CHECK',
      details: {
        userLoaded,
        userId: user?.id || null,
        isSignedIn: !!user,
        email: user?.emailAddresses?.[0]?.emailAddress || null
      }
    });
  }, [user, userLoaded]);

  // Monitor page load performance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measurePageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        addLog({
          type: 'info',
          category: 'performance',
          operation: 'PAGE_LOAD_METRICS',
          details: {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            firstPaint: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            redirectCount: navigation.redirectCount
          }
        });
      }
    };

    // Measure after page is fully loaded
    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
      return () => window.removeEventListener('load', measurePageLoad);
    }
  }, []);

  // Test database connectivity with direct endpoint call
  useEffect(() => {
    const testEndpoints = async () => {
      const tests = [
        {
          name: 'GraphQL_Basic_Connectivity',
          query: '{"query":"query { __typename }"}'
        },
        {
          name: 'GraphQL_Personality_Types',  
          query: '{"query":"query { getAllPersonalityTypes { id name shortName } }"}'
        },
        {
          name: 'GraphQL_Quiz_Data',
          query: '{"query":"query { getQuiz(title: \\"The Agile Assessment\\") { id title } }"}'
        }
      ];

      for (const test of tests) {
        try {
          const start = performance.now();
          const response = await fetch('/api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: test.query
          });
          const duration = performance.now() - start;
          const data = await response.json();

          addLog({
            type: data.errors ? 'error' : 'success',
            category: 'network',
            operation: test.name,
            duration: Math.round(duration),
            details: {
              status: response.status,
              hasData: !!data.data,
              hasErrors: !!data.errors,
              responseSize: JSON.stringify(data).length
            }
          });
        } catch (error) {
          addLog({
            type: 'error',
            category: 'network',
            operation: test.name,
            details: {
              error: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined
            }
          });
        }
      }
    };

    testEndpoints();
  }, []);

  if (!shouldShow) return null;

  return (
    <>
      {/* Floating Debug Toggle Button */}
      <div
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg transition-all"
        title="Toggle Production Debugger"
      >
        🔍
      </div>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 w-96 h-96 bg-black/95 text-green-400 rounded-lg border border-green-500/30 shadow-2xl z-40 overflow-hidden font-mono text-xs">
          <div className="bg-green-500/20 px-3 py-2 border-b border-green-500/30 flex justify-between items-center">
            <span className="font-semibold">🚀 Production Debugger</span>
            <button 
              onClick={() => setDebugLogs([])}
              className="text-green-300 hover:text-white text-xs bg-green-500/20 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
          
          <div className="p-3 h-full overflow-y-auto">
            {/* Quick Status */}
            <div className="mb-3 p-2 bg-gray-800/50 rounded border border-gray-600">
              <div className="text-green-300 font-semibold mb-1">System Status:</div>
              <div>🎯 Personality Types: {personalityTypes ? `✅ ${personalityTypes.getAllPersonalityTypes.length}` : typesError ? '❌' : '⏳'}</div>
              <div>📝 Quiz Data: {quizData ? `✅ ${quizData.getQuiz?.title}` : quizError ? '❌' : '⏳'}</div>
              <div>👤 Auth: {user ? `✅ ${user.emailAddresses?.[0]?.emailAddress}` : '❌ Anonymous'}</div>
            </div>

            {/* Debug Logs */}
            <div className="space-y-1">
              {debugLogs.map((log, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded text-xs border-l-2 ${
                    log.type === 'error' ? 'border-red-500 bg-red-500/10' :
                    log.type === 'warn' ? 'border-yellow-500 bg-yellow-500/10' :
                    log.type === 'success' ? 'border-green-500 bg-green-500/10' :
                    'border-blue-500 bg-blue-500/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-white">
                      [{log.category}] {log.operation}
                    </span>
                    {log.duration && (
                      <span className="text-gray-400">{log.duration}ms</span>
                    )}
                  </div>
                  <div className="text-gray-300 break-all">
                    {typeof log.details === 'object' 
                      ? JSON.stringify(log.details, null, 1).slice(0, 200) + '...'
                      : String(log.details)
                    }
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}