'use server'

import { auth } from '@clerk/nextjs/server';
import { api } from '../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
    // Update Convex user profile with onboarding data
    await convex.mutation(api.userProfiles.updateOnboardingData, {
      clerkUserId: userId,
      onboardingData: {
        onboardingComplete: true,
        whatsapp: details.whatsapp || undefined,
        linkedinUrl: details.linkedinUrl || undefined,
        currentRole: details.currentRole || undefined,
      },
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