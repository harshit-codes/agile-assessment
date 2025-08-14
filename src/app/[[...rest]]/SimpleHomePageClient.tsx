"use client";

import { useState, useEffect } from "react";

// Minimal diagnostic component to test client-side rendering
export default function SimpleHomePageClient() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🟢 SimpleHomePageClient: useEffect running");
    setMounted(true);
    
    // Test basic client-side functionality
    try {
      console.log("🟢 SimpleHomePageClient: Testing basic JS operations");
      const testObj = { test: "working" };
      console.log("🟢 SimpleHomePageClient: Object creation works:", testObj);
      
      // Test localStorage access
      if (typeof window !== 'undefined') {
        localStorage.setItem('test', 'working');
        const testValue = localStorage.getItem('test');
        console.log("🟢 SimpleHomePageClient: LocalStorage works:", testValue);
      }
      
    } catch (err) {
      console.error("🔴 SimpleHomePageClient: Basic JS error:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        backgroundColor: '#ff0000', 
        color: '#fff', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1>🔴 Client-Side Error Detected</h1>
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div style={{ 
        padding: '40px', 
        backgroundColor: '#333', 
        color: '#fff', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1>⏳ Loading...</h1>
        <p>Client-side mounting in progress...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#008000', 
      color: '#fff', 
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1>🟢 Client-Side Rendering Works!</h1>
      <p>✅ React hydration successful</p>
      <p>✅ useState works</p>
      <p>✅ useEffect works</p>
      <p>✅ localStorage works</p>
      <p>✅ Basic JavaScript execution works</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Debug Information</h2>
        <pre style={{ backgroundColor: '#006600', padding: '20px', textAlign: 'left', fontSize: '14px' }}>
          {JSON.stringify({
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A',
            url: typeof window !== 'undefined' ? window.location.href : 'Server-side',
            screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'
          }, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.href = '/debug'}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px', 
            cursor: 'pointer',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none'
          }}
        >
          Go to Debug Page
        </button>
        
        <button 
          onClick={() => {
            console.log("🔵 Testing full application load...");
            window.location.href = '/?test=full';
          }}
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer',
            backgroundColor: '#cc6600',
            color: '#fff',
            border: 'none'
          }}
        >
          Test Full App
        </button>
      </div>
    </div>
  );
}