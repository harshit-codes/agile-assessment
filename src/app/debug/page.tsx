"use client";

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const errorLogs: string[] = [];
    const consoleLogs: string[] = [];

    // Capture console errors
    const originalError = console.error;
    console.error = (...args) => {
      const errorMsg = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      errorLogs.push(`${new Date().toISOString()}: ${errorMsg}`);
      setErrors([...errorLogs]);
      originalError.apply(console, args);
    };

    // Capture console logs
    const originalLog = console.log;
    console.log = (...args) => {
      const logMsg = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      consoleLogs.push(`${new Date().toISOString()}: ${logMsg}`);
      setLogs([...consoleLogs]);
      originalLog.apply(console, args);
    };

    // Global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      const errorMsg = `Global Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
      errorLogs.push(`${new Date().toISOString()}: ${errorMsg}`);
      setErrors([...errorLogs]);
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
      errorLogs.push(`${new Date().toISOString()}: ${errorMsg}`);
      setErrors([...errorLogs]);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.error = originalError;
      console.log = originalLog;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff' }}>
      <h1>🔍 Production Debug Console</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Info</h2>
        <pre>
          URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}<br />
          User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}<br />
          Timestamp: {new Date().toISOString()}<br />
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>❌ Errors ({errors.length})</h2>
        <div style={{ backgroundColor: '#300', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
          {errors.length === 0 ? (
            <p>No errors detected yet...</p>
          ) : (
            errors.map((error, i) => (
              <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #600', paddingBottom: '5px' }}>
                {error}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>📝 Console Logs ({logs.length})</h2>
        <div style={{ backgroundColor: '#003', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
          {logs.length === 0 ? (
            <p>No logs captured yet...</p>
          ) : (
            logs.slice(-50).map((log, i) => (
              <div key={i} style={{ marginBottom: '5px', fontSize: '12px' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <button 
          onClick={() => { setErrors([]); setLogs([]); }}
          style={{ padding: '10px 20px', backgroundColor: '#444', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Clear All
        </button>
        
        <button 
          onClick={() => window.location.href = '/'}
          style={{ padding: '10px 20px', backgroundColor: '#006', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}