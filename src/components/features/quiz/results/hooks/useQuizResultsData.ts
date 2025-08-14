"use client";

import { useQuery } from "@apollo/client";
import { GET_PUBLIC_RESULT } from "@/lib/graphql/operations";
import type { QuizResultsProps, ResultsData } from "../utils/results.types";

export function useQuizResultsData({ 
  assessmentResult, 
  slug, 
  mode = 'direct' 
}: QuizResultsProps) {
  // Data fetching for shared results
  const { data: sharedResultData } = useQuery(GET_PUBLIC_RESULT, {
    variables: { slug: slug || '' },
    skip: mode !== 'shared' || !slug
  });
  
  const sharedResult = sharedResultData?.getPublicResult;

  // Determine data source and extract result data
  const result = mode === 'shared' ? sharedResult?.result : assessmentResult;
  const userProfile = mode === 'shared' ? sharedResult?.userProfile : null;
  const { personalityType, traits, overallFit = 0, sessionId: originalSessionId } = result || {};
  
  
  const resultsData: ResultsData = {
    personalityType,
    traits,
    overallFit
  };

  const isLoading = mode === 'shared' && sharedResultData === undefined;
  const isNotFound = mode === 'shared' && sharedResultData === null;
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