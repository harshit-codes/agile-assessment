import { Context, OnboardingDataInput, UpdateUserSlugInput, UpdateDisplayNameInput } from '../types'
import { GraphQLError } from 'graphql'

// Utility function to generate slug from display name (preferred) or email (fallback)
function generateSlugFromName(displayName?: string, fallbackEmail?: string): string {
  if (displayName && displayName.trim()) {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters, keep spaces
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
      .trim()
  }
  
  // Fallback to email-based slug if no display name
  if (fallbackEmail) {
    return fallbackEmail
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  
  // Ultimate fallback
  return 'user'
}

export const userResolvers = {
  Query: {
    getUserProfile: async (_: any, { clerkUserId }: { clerkUserId: string }, { prisma }: Context) => {
      return await prisma.userProfile.findUnique({
        where: { clerkUserId }
      })
    },

    getUserProfileBySlug: async (_: any, { slug }: { slug: string }, { prisma }: Context) => {
      return await prisma.userProfile.findUnique({
        where: { slug }
      })
    },

    getUserLatestResult: async (_: any, { clerkUserId }: { clerkUserId: string }, { prisma }: Context) => {
      // Direct lookup in user-result mapping table
      const userMapping = await prisma.userQuizResult.findUnique({
        where: { clerkUserId }
      })

      if (!userMapping) return null

      // Get the full result data
      const result = await prisma.quizResult.findUnique({
        where: { id: userMapping.latestResultId },
        include: {
          personalityType: true
        }
      })

      if (!result) return null

      return {
        ...result,
        personalityType: result.personalityType,
        traits: result.traitScores,
        overallFit: result.overallFitScore,
      }
    },

    getUserLatestQuizResult: async (_: any, { clerkUserId }: { clerkUserId: string }, { prisma }: Context) => {
      // Same as getUserLatestResult - keeping for compatibility
      const userMapping = await prisma.userQuizResult.findUnique({
        where: { clerkUserId }
      })

      if (!userMapping) return null

      const result = await prisma.quizResult.findUnique({
        where: { id: userMapping.latestResultId },
        include: {
          personalityType: true
        }
      })

      if (!result) return null

      return {
        ...result,
        personalityType: result.personalityType,
        traits: result.traitScores,
        overallFit: result.overallFitScore,
      }
    },

    checkSlugAvailability: async (
      _: any,
      { slug, excludeUserId }: { slug: string; excludeUserId?: string },
      { prisma }: Context
    ) => {
      // Validate slug format
      const slugPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/
      if (slug.length < 3 || slug.length > 30 || !slugPattern.test(slug)) {
        return {
          available: false,
          reason: "Slug must be 3-30 characters, contain only lowercase letters, numbers, and hyphens, and not start or end with a hyphen"
        }
      }

      // Check for reserved slugs
      const reservedSlugs = ['admin', 'api', 'www', 'support', 'help', 'about', 'contact', 'terms', 'privacy']
      if (reservedSlugs.includes(slug)) {
        return {
          available: false,
          reason: "This slug is reserved"
        }
      }

      // Check if slug exists
      const existingProfile = await prisma.userProfile.findUnique({
        where: { slug }
      })

      if (existingProfile && existingProfile.clerkUserId !== excludeUserId) {
        return {
          available: false,
          reason: "This slug is already taken"
        }
      }

      return {
        available: true,
        reason: "Slug is available"
      }
    },
  },

  Mutation: {
    createUserProfile: async (
      _: any,
      { input }: { input: { clerkUserId: string; email: string; firstName?: string; lastName?: string; displayName?: string } },
      { prisma }: Context
    ) => {
      // Check if profile already exists
      const existingProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId: input.clerkUserId }
      })

      if (existingProfile) {
        // Return existing profile instead of creating duplicate
        return existingProfile
      }

      // Generate display name from provided data
      let displayName = input.displayName
      if (!displayName && input.firstName) {
        displayName = input.lastName 
          ? `${input.firstName} ${input.lastName}`
          : input.firstName
      }
      if (!displayName) {
        // Fallback to email-based display name
        const emailPart = input.email.split('@')[0]
        displayName = emailPart
          .replace(/[._-]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      }

      // Generate slug from display name
      const baseSlug = generateSlugFromName(displayName, input.email)
      let finalSlug = baseSlug
      let counter = 1

      // Ensure slug uniqueness
      while (true) {
        const existing = await prisma.userProfile.findUnique({
          where: { slug: finalSlug }
        })

        if (!existing) break
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }

      // Create new profile with real user data
      const profile = await prisma.userProfile.create({
        data: {
          clerkUserId: input.clerkUserId,
          email: input.email,
          slug: finalSlug,
          displayName: displayName,
          onboardingComplete: false,
        }
      })

      return profile
    },

    updateOnboardingData: async (
      _: any,
      { input }: { input: OnboardingDataInput },
      { prisma }: Context
    ) => {
      // Try to find existing profile
      let profile = await prisma.userProfile.findUnique({
        where: { clerkUserId: input.clerkUserId }
      })

      if (profile) {
        // Update existing profile
        profile = await prisma.userProfile.update({
          where: { id: profile.id },
          data: {
            ...input.onboardingData,
          }
        })
      } else {
        // Profile should have been created by webhook, but create fallback if missing
        console.warn(`⚠️ No UserProfile found for onboarding update: ${input.clerkUserId}. Creating fallback profile.`)
        
        // Use createUserProfile logic as fallback (but with minimal data)
        const baseSlug = input.clerkUserId.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20)
        let slug = baseSlug
        let counter = 1

        while (true) {
          const existingSlug = await prisma.userProfile.findUnique({
            where: { slug }
          })
          if (!existingSlug) break
          slug = `${baseSlug}-${counter}`
          counter++
        }

        profile = await prisma.userProfile.create({
          data: {
            clerkUserId: input.clerkUserId,
            email: "", // Will be updated by webhook or sharing flow later
            slug,
            displayName: "", // Will be updated by webhook or sharing flow later
            ...input.onboardingData,
          }
        })
      }

      return profile
    },

    updateUserSlug: async (
      _: any,
      { input }: { input: UpdateUserSlugInput },
      { prisma }: Context
    ) => {
      // Get current profile
      const profile = await prisma.userProfile.findUnique({
        where: { clerkUserId: input.clerkUserId }
      })

      if (!profile) {
        throw new GraphQLError("User profile not found")
      }

      // Check slug availability
      const existingProfile = await prisma.userProfile.findUnique({
        where: { slug: input.newSlug }
      })

      if (existingProfile && existingProfile.clerkUserId !== input.clerkUserId) {
        throw new GraphQLError("This slug is already taken by another user")
      }

      // Update slug
      return await prisma.userProfile.update({
        where: { id: profile.id },
        data: { slug: input.newSlug }
      })
    },

    updateDisplayName: async (
      _: any,
      { input }: { input: UpdateDisplayNameInput },
      { prisma }: Context
    ) => {
      const profile = await prisma.userProfile.findUnique({
        where: { clerkUserId: input.clerkUserId }
      })

      if (!profile) {
        throw new GraphQLError("User profile not found")
      }

      return await prisma.userProfile.update({
        where: { id: profile.id },
        data: { displayName: input.displayName }
      })
    },
  }
}