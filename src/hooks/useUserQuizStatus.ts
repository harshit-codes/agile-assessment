"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export interface UserQuizStatus {
  hasCompletedQuiz: boolean;
  latestResult: any | null;
  isLoading: boolean;
  isUserLoading: boolean;
}

export function useUserQuizStatus(): UserQuizStatus {
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // Query user's latest quiz result using direct mapping lookup
  const latestResult = useQuery(
    api.quiz.getUserLatestQuizResult,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  return {
    hasCompletedQuiz: !!latestResult,
    latestResult: latestResult || null,
    isLoading: latestResult === undefined,
    isUserLoading: !isUserLoaded,
  };
}