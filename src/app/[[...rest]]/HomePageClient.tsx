"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import PageBackground from "@/components/layout/PageBackground";
import HeaderSection from "@/components/header/HeaderSection";
import HeroSection from "@/components/hero/HeroSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import QuizComponent from "@/components/features/quiz/QuizComponent";
import LightRays from "@/components/LightRays/LightRays";
import StructuredData from "@/components/seo/StructuredData";

interface HomePageClientProps {
  retakeFromSessionId: string | null;
}

function WelcomeScreen() {
  return (
    <div className="min-h-screen relative overflow-hidden" suppressHydrationWarning={true}>
      <PageBackground />
      
      {/* LightRays Background - Top Layer */}
      <div 
        className="absolute top-0 left-0 right-0 h-3/5 pointer-events-none -z-10" 
        suppressHydrationWarning={true}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#ebfb9dff"
          raysSpeed={1.5}
          lightSpread={0.75}
          rayLength={2.5}
          followMouse={true}
          mouseInfluence={0.25}
          noiseAmount={0.25}
          distortion={0.05}
          className="opacity-40"
        />
      </div>
      
      <HeaderSection />
      <HeroSection />
    </div>
  );
}

function QuizLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center" suppressHydrationWarning={true}>
      <div className="text-center" suppressHydrationWarning={true}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4" suppressHydrationWarning={true}></div>
        <p className="text-lg text-muted-foreground">Loading your assessment...</p>
      </div>
    </div>
  );
}

export default function HomePageClient({ retakeFromSessionId }: HomePageClientProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  let isSignedIn = false;
  let isLoaded = false;
  
  try {
    const user = useUser();
    isSignedIn = user.isSignedIn || false;
    isLoaded = user.isLoaded || false;
    
    console.log("🔍 Page - Client - 1a. HomePageClient rendering");
    console.log("🔍 Page - Client - 1b. retakeFromSessionId:", retakeFromSessionId);
    console.log("🔍 Page - Client - 1c. Clerk state:", { isSignedIn, isLoaded });
    
    // Additional validation for authentication state
    if (user.error) {
      console.error("🔍 Page - Client - 1d. Clerk error state:", user.error);
      setError(`Authentication error: ${user.error.message || 'Unknown error'}`);
      isLoaded = true;
      isSignedIn = false;
    }
  } catch (err) {
    console.error("🔍 Page - Client - 1e. Clerk hook error:", err);
    const errorMsg = err instanceof Error ? err.message : 'Authentication system error';
    console.error("🔍 Page - Client - 1f. Error details:", {
      errorType: typeof err,
      errorStack: err instanceof Error ? err.stack : 'No stack available',
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'Server-side'
    });
    setError(errorMsg);
    // Fallback to showing welcome screen
    isLoaded = true;
    isSignedIn = false;
  }

  // Set a timeout to show fallback if Clerk takes too long to load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.log("🔍 Page - Client - Clerk timeout, showing welcome screen as fallback");
        setShowFallback(true);
      }
    }, 8000); // Wait 8 seconds for Clerk to load

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  // Show error state if there was an error
  if (error) {
    console.log("🔍 Page - Client - 2a. Error state, showing WelcomeScreen");
    return (
      <>
        <StructuredData type="website" />
        <StructuredData type="assessment" />
        <WelcomeScreen />
      </>
    );
  }

  // Wait for Clerk to load before proceeding, but show fallback after timeout
  if (!isLoaded && !showFallback) {
    console.log("🔍 Page - Client - 2b. Clerk not loaded yet, showing QuizLoader");
    return <QuizLoader />;
  }

  // If user is signed in, show the quiz component (which handles onboarding and retake)
  if (isSignedIn) {
    console.log("🔍 Page - Client - 2c. User signed in, rendering QuizComponent with ErrorBoundary");
    
    try {
      return (
        <ErrorBoundary>
          <div>
            <script dangerouslySetInnerHTML={{
              __html: `console.log("🔍 Page - Client - 2c. About to render QuizComponent with retakeFrom: ${retakeFromSessionId}");`
            }} />
            <QuizComponent />
          </div>
        </ErrorBoundary>
      );
    } catch (error) {
      console.error("🔍 Page - Client - 2d. Error rendering QuizComponent:", error);
      return (
        <div style={{padding: '20px', border: '2px solid red'}}>
          <h3>Page Rendering Error</h3>
          <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <pre>{error instanceof Error ? error.stack : JSON.stringify(error)}</pre>
        </div>
      );
    }
  }

  // Show landing page for anonymous users
  console.log("🔍 Page - Client - 2f. User not signed in, showing WelcomeScreen");
  return (
    <>
      <StructuredData type="website" />
      <StructuredData type="assessment" />
      <WelcomeScreen />
    </>
  );
}