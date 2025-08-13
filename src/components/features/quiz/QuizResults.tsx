"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H2, BodyText } from "@/components/ui/Typography";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ShareResultModal from "../sharing/ShareResultModal";
import Link from "next/link";
import PageBackground from "@/components/layout/PageBackground";
import LightRays from "@/components/LightRays/LightRays";

// Modularized components
import LoadingState from "./results/components/LoadingState";
import ErrorState from "./results/components/ErrorState";
import HeaderSection from "@/components/header/HeaderSection";
import PersonalitySection from "./results/sections/PersonalitySection";
import TraitScoresSection from "./results/sections/TraitScoresSection";
import ProfessionalProfileSection from "./results/sections/ProfessionalProfileSection";
import CareerPathwaysSection from "./results/sections/CareerPathwaysSection";
import EngagementSection from "./results/sections/EngagementSection";
import AssessmentDisclaimer from "./results/sections/AssessmentDisclaimer";

// Hooks and utilities
import { useQuizResultsData } from "./results/hooks/useQuizResultsData";
import { useResultsAuth } from "./results/hooks/useResultsAuth";
import type { QuizResultsProps } from "./results/utils/results.types";


export default function QuizResults({ 
  assessmentResult, 
  quizState, 
  slug, 
  mode = 'direct' 
}: QuizResultsProps) {
  const { isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Custom hooks for data and auth
  const { resultsData, userProfile, sharedResult, originalSessionId, isLoading, isNotFound, hasData } = useQuizResultsData({ 
    assessmentResult, 
    slug, 
    mode 
  });
  const authState = useResultsAuth(mode, sharedResult, userProfile);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleRetakeAssessment = useCallback(() => {
    // Reset quiz state and navigate with retake parameter
    if (quizState?.resetQuiz) {
      quizState.resetQuiz();
    }
    
    // Navigate with retake parameter for server-side prefill
    if (originalSessionId) {
      window.location.href = `/?retakeFrom=${originalSessionId}`;
    } else {
      window.location.href = '/';
    }
  }, [quizState, originalSessionId]);

  const handleShareModalOpen = () => {
    setIsShareModalOpen(true);
  };
  
  // Loading states for both direct and shared modes
  if (!isClient || !isUserLoaded) {
    return <LoadingState />;
  }

  // Handle loading state for shared results
  if (isLoading) {
    return <LoadingState />;
  }

  // Handle not found state for shared results
  if (isNotFound) {
    return (
      <ErrorState
        title="Result Not Found"
        subtitle="The assessment result you're looking for doesn't exist or is no longer public."
        actionText="Take Your Own Assessment"
      />
    );
  }

  // Safety check - if no traits data, show appropriate message
  if (!hasData) {
    if (quizState?.isLoading) {
      return <LoadingState title="Processing Results..." subtitle="Please wait while we calculate your personality profile." />;
    }
    
    if (mode === 'direct') {
      return (
        <ErrorState
          title="Results Not Available"
          subtitle="We couldn't calculate your results. This might be because you haven't completed all questions or there was a processing error."
          actionText="Start New Assessment"
          onAction={handleRetakeAssessment}
        />
      );
    }
    
    return (
      <ErrorState
        title="Results Not Available"
        subtitle="We couldn't load the assessment results. Please try again later."
        actionText="Take Assessment"
      />
    );
  }

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
      
      {/* Header Section - Same as quiz */}
      <HeaderSection />

      {/* Results Content - Report Card Style with Welcome Page Theming */}
      <div className="results-content relative z-10">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12 space-y-10">
        
        {/* Section 1: Personality Type */}
        <PersonalitySection 
          resultsData={resultsData} 
          authState={authState} 
          mode={mode}
        />

        {/* Section 2: Trait Scores */}
        <TraitScoresSection resultsData={resultsData} authState={authState} />

        {/* Section 3: Professional Profile */}
        <ProfessionalProfileSection resultsData={resultsData} authState={authState} />

        {/* Section 4: Career Pathways */}
        <CareerPathwaysSection resultsData={resultsData} authState={authState} />

        {/* Section 5: Engagement */}
        <EngagementSection 
          resultsData={resultsData}
          authState={authState}
          mode={mode}
          onRetakeAssessment={handleRetakeAssessment}
          onShareModalOpen={handleShareModalOpen}
        />

        {/* Assessment Disclaimer */}
        <AssessmentDisclaimer 
          mode={mode}
          displayName={authState.displayName}
          sharedResult={sharedResult}
        />
        </div>
      </div>

      {/* Share Result Modal - Only for own results */}
      {authState.isOwnResult && mode === 'direct' && quizState?.sessionId && (
        <ShareResultModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          sessionId={quizState.sessionId}
          personalityType={resultsData.personalityType}
        />
      )}

      <style jsx>{`
        .results-content {
          background: linear-gradient(
            180deg,
            transparent 0%,
            color-mix(in srgb, var(--primary) 2%, transparent) 50%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
}