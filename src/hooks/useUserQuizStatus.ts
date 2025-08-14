"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { GET_USER_LATEST_RESULT } from "../lib/graphql/operations";

export interface UserQuizStatus {
  hasCompletedQuiz: boolean;
  latestResult: any | null;
  isLoading: boolean;
  isUserLoading: boolean;
}

export function useUserQuizStatus(): UserQuizStatus {
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // Query user's latest quiz result using GraphQL
  const { data, loading } = useQuery(GET_USER_LATEST_RESULT, {
    variables: { clerkUserId: user?.id || '' },
    skip: !user?.id,
    errorPolicy: 'all'
  });

  const latestResult = data?.getUserLatestResult;

  return {
    hasCompletedQuiz: !!latestResult,
    latestResult: latestResult || null,
    isLoading: loading,
    isUserLoading: !isUserLoaded,
  };
}