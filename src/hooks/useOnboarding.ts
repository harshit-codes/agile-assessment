'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export interface UserDetails {
  whatsapp?: string;
  linkedinUrl?: string;
  currentRole?: string;
}

export function useOnboarding() {
  const { user, isLoaded: userLoaded } = useUser();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Query user profile from Convex
  const userProfile = useQuery(
    api.userProfiles.getUserProfile, 
    user?.id ? { clerkUserId: user.id } : 'skip'
  );

  // Use Convex mutation for updating onboarding data
  const updateOnboardingData = useMutation(api.userProfiles.updateOnboardingData);

  // Check onboarding status when user and profile data is loaded
  useEffect(() => {
    if (userLoaded && userProfile !== undefined) {
      const isComplete = userProfile?.onboardingComplete === true;
      setIsOnboardingComplete(isComplete);
      setIsLoading(false);
    } else if (userLoaded && !user) {
      // User not signed in
      setIsLoading(false);
    }
  }, [userLoaded, user, userProfile]);

  const completeOnboarding = async (details: UserDetails): Promise<{ success?: boolean; error?: string }> => {
    try {
      if (!user?.id) {
        return { error: 'User not authenticated' };
      }

      // Use Convex mutation directly instead of server action
      await updateOnboardingData({
        clerkUserId: user.id,
        onboardingData: {
          onboardingComplete: true,
          whatsapp: details.whatsapp || undefined,
          linkedinUrl: details.linkedinUrl || undefined,
          currentRole: details.currentRole || undefined,
        },
      });

      setIsOnboardingComplete(true);
      return { success: true };
    } catch (error) {
      console.error('Onboarding completion error:', error);
      return { error: 'Failed to complete onboarding. Please try again.' };
    }
  };

  return {
    isOnboardingComplete,
    isLoading,
    userProfile,
    completeOnboarding,
  };
}