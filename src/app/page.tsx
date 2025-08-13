"use client";

import { useUser } from "@clerk/nextjs";
import { Suspense } from "react";
import PageBackground from "@/components/layout/PageBackground";
import HeaderSection from "@/components/header/HeaderSection";
import HeroSection from "@/components/hero/HeroSection";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import QuizComponent from "@/components/features/quiz/QuizComponent";
import LightRays from "@/components/LightRays/LightRays";
import StructuredData from "@/components/seo/StructuredData";

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

export default function HomePage() {
  console.log("🔍 Debug - HomePage component rendering");
  console.log("🔍 Debug - CONVEX_URL in component:", process.env.NEXT_PUBLIC_CONVEX_URL);
  
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return <QuizLoader />;
  }

  // If user is signed in, show the quiz component (which handles onboarding)
  if (isSignedIn) {
    return (
      <ErrorBoundary>
        <QuizComponent />
      </ErrorBoundary>
    );
  }

  // Show landing page for anonymous users
  return (
    <>
      <StructuredData type="website" />
      <StructuredData type="assessment" />
      <WelcomeScreen />
    </>
  );
}