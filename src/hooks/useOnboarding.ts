'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE, UPDATE_ONBOARDING_DATA } from '@/lib/graphql/operations';
import { logger, logGraphQLQuery, logGraphQLMutation, logError } from '@/lib/logger';

export interface UserDetails {
  whatsapp?: string;
  linkedinUrl?: string;
  currentRole?: string;
}

export function useOnboarding() {
  const { user, isLoaded: userLoaded } = useUser();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Query user profile from GraphQL with optimized caching
  const { data: userProfileData, loading: profileLoading, error: profileError, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { clerkUserId: user?.id || '' },
    skip: !user?.id,
    // Optimize caching strategy
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    // Cache for 5 minutes to reduce redundant requests
    nextFetchPolicy: 'cache-first'
  });
  
  const userProfile = userProfileData?.getUserProfile;

  // Use GraphQL mutation for updating onboarding data with cache updates
  const [updateOnboardingDataMutation] = useMutation(UPDATE_ONBOARDING_DATA, {
    // Update cache after successful mutation
    update(cache, { data }) {
      if (data?.updateOnboardingData && user?.id) {
        // Update the existing cache entry
        cache.updateQuery(
          { 
            query: GET_USER_PROFILE, 
            variables: { clerkUserId: user.id } 
          },
          (existingData) => ({
            ...existingData,
            getUserProfile: {
              ...existingData?.getUserProfile,
              onboardingComplete: true,
              whatsapp: data.updateOnboardingData.whatsapp,
              linkedinUrl: data.updateOnboardingData.linkedinUrl,
              currentRole: data.updateOnboardingData.currentRole
            }
          })
        );
      }
    },
    // Optimistic response for better UX
    optimisticResponse: user?.id ? {
      updateOnboardingData: {
        __typename: 'UserProfile',
        id: 'temp-id',
        onboardingComplete: true,
        whatsapp: null,
        linkedinUrl: null,
        currentRole: null
      }
    } : undefined,
    errorPolicy: 'all'
  });

  // Check onboarding status when user and profile data is loaded
  useEffect(() => {
    if (userLoaded && userProfile !== undefined) {
      const isComplete = userProfile?.onboardingComplete === true;
      setIsOnboardingComplete(isComplete);
      setIsLoading(false);
    } else if (userLoaded && !user) {
      // User not signed in
      setIsLoading(false);
    } else if (userLoaded && profileLoading) {
      setIsLoading(true);
    }
  }, [userLoaded, user, userProfile, profileLoading]);

  const completeOnboarding = async (details: UserDetails): Promise<{ success?: boolean; error?: string }> => {
    try {
      if (!user?.id) {
        return { error: 'User not authenticated' };
      }

      // Use GraphQL mutation directly instead of server action
      logGraphQLMutation('UPDATE_ONBOARDING_DATA', 
        { clerkUserId: user.id }, 
        { component: 'useOnboarding', userId: user.id }
      );

      await updateOnboardingDataMutation({
        variables: {
          clerkUserId: user.id,
          onboardingData: {
            onboardingComplete: true,
            whatsapp: details.whatsapp || undefined,
            linkedinUrl: details.linkedinUrl || undefined,
            currentRole: details.currentRole || undefined,
          },
        }
      });

      logger.info('Onboarding completed successfully', {
        component: 'useOnboarding',
        action: 'completeOnboarding', 
        userId: user.id
      });

      setIsOnboardingComplete(true);
      return { success: true };
    } catch (error) {
      logError('Onboarding completion failed', {
        component: 'useOnboarding',
        action: 'completeOnboarding',
        userId: user?.id,
        metadata: { error: error instanceof Error ? error.message : String(error) }
      });
      return { error: 'Failed to complete onboarding. Please try again.' };
    }
  };

  return {
    isOnboardingComplete,
    isLoading: isLoading || profileLoading,
    userProfile,
    completeOnboarding,
    // Additional performance info
    error: profileError,
    refetch: () => {
      // Manual refetch if needed
      if (user?.id) {
        return refetch?.();
      }
    }
  };
}