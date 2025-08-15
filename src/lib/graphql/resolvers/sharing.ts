import { Context, ToggleSharingInput, LinkResultInput } from '../types'
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

// Utility function to generate display name from email
function generateDisplayNameFromEmail(email: string): string {
  const username = email.split('@')[0]
  return username
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Simple hash function for passcode
function simpleHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

export const sharingResolvers = {
  Query: {
    getPublicResult: async (
      _: any,
      { slug, passcode }: { slug: string; passcode?: string },
      { prisma, auth }: Context
    ) => {
      // Get user profile by slug
      let userProfile = await prisma.userProfile.findUnique({
        where: { slug }
      })

      // If not found, try to find by partial slug match (for backward compatibility)
      if (!userProfile && slug.startsWith('user-')) {
        userProfile = await prisma.userProfile.findFirst({
          where: {
            slug: {
              startsWith: slug
            }
          }
        })
      }

      if (!userProfile) {
        return null
      }

      // Get the most recent result for this user (public or passcode-protected)
      const result = await prisma.quizResult.findFirst({
        where: {
          userProfileId: userProfile.id,
          OR: [
            { isPublic: true },
            { hasPasscode: true }
          ]
        },
        include: {
          personalityType: true
        },
        orderBy: { calculatedAt: 'desc' }
      })

      if (!result) {
        return null
      }

      // If result is passcode protected, validate passcode
      if (result.hasPasscode && !result.isPublic) {
        if (!passcode || !result.passcode) {
          return {
            requiresPasscode: true,
            hasPasscode: true,
          }
        }

        const hashedInput = simpleHash(passcode.trim())
        if (hashedInput !== result.passcode) {
          return {
            requiresPasscode: true,
            hasPasscode: true,
            invalidPasscode: true,
          }
        }
      }

      // Check if viewer is the owner (handle unauthenticated users)
      const isViewerOwner = auth?.userId === userProfile.clerkUserId

      // Generate display name if one doesn't exist
      const displayName = userProfile.displayName || 
        generateDisplayNameFromEmail(userProfile.email || '') || 
        userProfile.slug
          .replace(/[._-]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')

      return {
        userProfile: {
          slug: userProfile.slug,
          displayName: displayName,
          createdAt: userProfile.createdAt,
          clerkUserId: isViewerOwner ? userProfile.clerkUserId : undefined,
        },
        result: {
          ...result,
          personalityType: result.personalityType,
          traits: result.traitScores,
          overallFit: result.overallFitScore,
        },
        isViewerOwner,
      }
    },

    validatePasscode: async (
      _: any,
      { slug, passcode }: { slug: string; passcode: string },
      { prisma }: Context
    ) => {
      // Get user profile by slug
      const userProfile = await prisma.userProfile.findUnique({
        where: { slug }
      })

      if (!userProfile) {
        return { valid: false, reason: "User not found" }
      }

      // Get the most recent result for this user
      const result = await prisma.quizResult.findFirst({
        where: { userProfileId: userProfile.id },
        orderBy: { calculatedAt: 'desc' }
      })

      if (!result) {
        return { valid: false, reason: "No results found" }
      }

      // Check if result has passcode protection
      if (!result.hasPasscode || !result.passcode) {
        return { valid: false, reason: "Result is not passcode protected" }
      }

      // Validate passcode
      const hashedInput = simpleHash(passcode.trim())
      const isValid = hashedInput === result.passcode

      return {
        valid: isValid,
        reason: isValid ? "Valid passcode" : "Invalid passcode"
      }
    },

    getUserSharingStats: async (
      _: any,
      { clerkUserId }: { clerkUserId: string },
      { prisma }: Context
    ) => {
      const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        include: {
          results: {
            where: { isPublic: true },
            orderBy: { sharedAt: 'desc' }
          }
        }
      })

      if (!userProfile) {
        return {
          hasProfile: false,
          totalResults: 0,
          publicResults: 0,
          shareUrl: null,
        }
      }

      const allResults = await prisma.quizResult.count({
        where: { userProfileId: userProfile.id }
      })

      const publicResults = userProfile.results

      return {
        hasProfile: true,
        slug: userProfile.slug,
        totalResults: allResults,
        publicResults: publicResults.length,
        shareUrl: publicResults.length > 0 ? `/results/${userProfile.slug}` : null,
        lastSharedAt: publicResults.length > 0 ? publicResults[0].sharedAt : null,
      }
    },

    getShareableUrl: async (
      _: any,
      { sessionId, clerkUserId }: { sessionId: string; clerkUserId: string },
      { prisma }: Context
    ) => {
      const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId }
      })

      if (!userProfile) {
        return null
      }

      const result = await prisma.quizResult.findFirst({
        where: { sessionId }
      })

      if (!result || !result.isPublic) {
        return null
      }

      return {
        shareUrl: `/results/${userProfile.slug}`,
        slug: userProfile.slug,
        isPublic: result.isPublic,
        sharedAt: result.sharedAt,
      }
    },
  },

  Mutation: {
    toggleResultSharing: async (
      _: any,
      { input }: { input: ToggleSharingInput },
      { prisma }: Context
    ) => {
      // Get the quiz result
      const result = await prisma.quizResult.findFirst({
        where: { sessionId: input.sessionId }
      })

      if (!result) {
        throw new GraphQLError("Quiz result not found")
      }

      // Check if user profile already exists
      let userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId: input.clerkUserId }
      })

      // Create user profile if it doesn't exist
      if (!userProfile) {
        const baseSlug = generateSlugFromName(input.displayName, input.email)
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

        userProfile = await prisma.userProfile.create({
          data: {
            clerkUserId: input.clerkUserId,
            email: input.email,
            slug: finalSlug,
            displayName: input.displayName || generateDisplayNameFromEmail(input.email),
          }
        })
      }

      // Ensure only one result per user: unshare any previous results for this user
      if (input.isPublic) {
        await prisma.quizResult.updateMany({
          where: {
            userProfileId: userProfile.id,
            id: { not: result.id }
          },
          data: { isPublic: false }
        })
      }

      // Update result with sharing settings
      const updateData: any = {
        isPublic: input.isPublic,
        userProfileId: userProfile.id,
      }

      // Set sharedAt timestamp when making public for the first time
      if (input.isPublic && !result.sharedAt) {
        updateData.sharedAt = new Date()
      }

      await prisma.quizResult.update({
        where: { id: result.id },
        data: updateData
      })

      return {
        success: true,
        isPublic: input.isPublic,
        shareUrl: input.isPublic ? `/results/${userProfile.slug}` : null,
      }
    },

    linkResultToUser: async (
      _: any,
      { input }: { input: LinkResultInput },
      { prisma }: Context
    ) => {
      // Check if user profile already exists
      let userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId: input.clerkUserId }
      })

      // Create user profile if it doesn't exist
      if (!userProfile) {
        const baseSlug = generateSlugFromName(input.displayName, input.email)
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

        userProfile = await prisma.userProfile.create({
          data: {
            clerkUserId: input.clerkUserId,
            email: input.email,
            slug: finalSlug,
            displayName: input.displayName || generateDisplayNameFromEmail(input.email),
          }
        })
      }

      // Update the quiz result to link to user profile
      await prisma.quizResult.updateMany({
        where: { sessionId: input.sessionId },
        data: { userProfileId: userProfile.id }
      })

      return userProfile
    },
  }
}