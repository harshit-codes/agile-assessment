"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useGraphQLQuiz } from "@/hooks/useGraphQLQuiz";
import { useUserQuizStatus } from "@/hooks/useUserQuizStatus";
import CompactQuizShell from "./CompactQuizShell";
import QuizResults from "./QuizResults";
export default function QuizComponent() {
  const searchParams = useSearchParams();
  const retakeFromSessionId = searchParams.get('retakeFrom');
  
  const quizState = useGraphQLQuiz(retakeFromSessionId);
  const { quiz, showResults, assessmentResult, isLoading, error, sessionId } = quizState;
  const userQuizStatus = useUserQuizStatus();
  const { isLoaded: isUserLoaded } = useUser();


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => quizState.clearError()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  // PRIORITY CHECK: If user has completed quiz, redirect immediately (unless explicitly retaking)
  // This must happen BEFORE loading checks to prevent getting stuck in loading state
  if (isUserLoaded && !userQuizStatus.isUserLoading && userQuizStatus.hasCompletedQuiz && userQuizStatus.latestResult && !retakeFromSessionId) {
    console.log("🔄 QuizComponent: Showing results from userQuizStatus (user has completed quiz)")
    return <QuizResults assessmentResult={userQuizStatus.latestResult} quizState={quizState} mode="direct" />;
  }

  if (isLoading || !quiz || userQuizStatus.isLoading || userQuizStatus.isUserLoading) {
    const isPrefilling = retakeFromSessionId && isLoading;
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            {isPrefilling ? "Loading Previous Responses..." : "Loading..."}
          </h2>
          <p className="text-muted-foreground mb-4">
            {isPrefilling 
              ? "We're retrieving your previous answers to prefill the assessment."
              : "Please wait while we prepare your assessment."
            }
          </p>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              If this takes too long, try refreshing the page or check your internet connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding is now integrated within the quiz flow, no separate step needed

  if (showResults && assessmentResult) {
    console.log("🎉 QuizComponent: Showing results from quiz state (showResults=true & assessmentResult exists)")
    return <QuizResults assessmentResult={assessmentResult} quizState={quizState} mode="direct" />;
  }

  if (showResults && !assessmentResult) {
    console.log("⚠️ QuizComponent: showResults=true but no assessmentResult yet, showing loading state")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            Processing Your Results...
          </h2>
          <p className="text-muted-foreground mb-4">
            We're calculating your personality profile and preparing your results.
          </p>
        </div>
      </div>
    );
  }

  return <CompactQuizShell quiz={quiz} quizState={quizState} />;
}