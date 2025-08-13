"use client";

import { useUser } from "@clerk/nextjs";
import type { AuthState } from "../utils/results.types";

// Utility function to generate a friendly display name from Clerk user data
function getFriendlyDisplayName(userProfile?: any, user?: any): string {
  if (userProfile?.displayName) {
    return userProfile.displayName;
  }
  
  // Try to get name from current Clerk user if available (for current user viewing shared results)
  if (user?.firstName) {
    return user.firstName;
  }
  if (user?.fullName) {
    return user.fullName.split(' ')[0]; // Just first name
  }
  if (user?.username) {
    return user.username;
  }
  
  // Try to extract a friendly name from the userProfile slug as a fallback
  if (userProfile?.slug) {
    const cleanSlug = userProfile.slug
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    if (cleanSlug && cleanSlug !== 'User') {
      return cleanSlug;
    }
  }
  
  // Final fallback to generic "User"
  return 'User';
}

export function useResultsAuth(
  mode: 'direct' | 'shared' = 'direct',
  sharedResult?: any,
  userProfile?: any
): AuthState {
  const { user } = useUser();
  
  // Authentication and ownership logic
  const isAuthenticated = !!user;
  const isOwnResult = mode === 'direct' || (mode === 'shared' && sharedResult?.isViewerOwner);
  const displayName = mode === 'direct' ? 'Your' : getFriendlyDisplayName(userProfile, user);
  
  return {
    isAuthenticated,
    isOwnResult,
    displayName
  };
}