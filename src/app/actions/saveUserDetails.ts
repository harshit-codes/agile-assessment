'use server'

import { auth } from '@clerk/nextjs/server';
import { UPDATE_ONBOARDING_DATA } from '@/lib/graphql/operations';
import { getClient } from '@/lib/apollo-client';

export interface UserDetails {
  whatsapp?: string;
  linkedinUrl?: string;
  currentRole?: string;
}

export async function saveUserDetails(details: UserDetails) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'User not authenticated' };
    }

    // All fields are optional since name and email come from Clerk auth
    // Update GraphQL user profile with onboarding data
    const client = getClient();
    await client.mutate({
      mutation: UPDATE_ONBOARDING_DATA,
      variables: {
        input: {
          clerkUserId: userId,
          onboardingComplete: true,
          whatsapp: details.whatsapp || undefined,
          linkedinUrl: details.linkedinUrl || undefined,
          currentRole: details.currentRole || undefined,
        }
      }
    });

    return { 
      success: true, 
      message: 'Profile completed successfully'
    };
  } catch (error) {
    console.error('Save user details error:', error);
    return { 
      error: 'Failed to save profile details. Please try again.' 
    };
  }
}