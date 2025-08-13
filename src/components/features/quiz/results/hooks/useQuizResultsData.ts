"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { QuizResultsProps, ResultsData } from "../utils/results.types";

export function useQuizResultsData({ 
  assessmentResult, 
  slug, 
  mode = 'direct' 
}: QuizResultsProps) {
  // Data fetching for shared results
  const sharedResult = useQuery(
    api.sharing.getPublicResult, 
    mode === 'shared' && slug ? { slug } : "skip"
  );

  // Determine data source and extract result data
  const result = mode === 'shared' ? sharedResult?.result : assessmentResult;
  const userProfile = mode === 'shared' ? sharedResult?.userProfile : null;
  const { personalityType, traits, overallFit = 0, sessionId: originalSessionId } = result || {};
  
  
  const resultsData: ResultsData = {
    personalityType,
    traits,
    overallFit
  };

  const isLoading = mode === 'shared' && sharedResult === undefined;
  const isNotFound = mode === 'shared' && sharedResult === null;
  const hasData = !!(traits && personalityType);

  return {
    resultsData,
    userProfile,
    sharedResult,
    originalSessionId,
    isLoading,
    isNotFound,
    hasData
  };
}