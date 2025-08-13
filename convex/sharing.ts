import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Utility function to generate slug from email (copied from userProfiles.ts)
function generateSlugFromEmail(email: string): string {
  return email
    .split('@')[0] // Take part before @
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Utility function to generate a friendly display name from email
function generateDisplayNameFromEmail(email: string): string {
  const username = email.split('@')[0];
  // Capitalize first letter and replace common separators with spaces
  return username
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Simple hash function for passcode (not for security, just obfuscation)
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Toggle result sharing (make public/private)
export const toggleResultSharing = mutation({
  args: {
    sessionId: v.id("quizSessions"),
    clerkUserId: v.string(),
    email: v.string(),
    isPublic: v.boolean(),
    displayName: v.optional(v.string()),
    passcode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the quiz result
    const result = await ctx.db
      .query("quizResults")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .first();

    if (!result) {
      throw new Error("Quiz result not found");
    }

    // Check if user profile already exists
    let userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    // Create user profile if it doesn't exist
    if (!userProfile) {
      const baseSlug = generateSlugFromEmail(args.email);
      let finalSlug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness
      while (true) {
        const existing = await ctx.db
          .query("userProfiles")
          .withIndex("by_slug", q => q.eq("slug", finalSlug))
          .first();
        
        if (!existing) break;
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      const userProfileId = await ctx.db.insert("userProfiles", {
        clerkUserId: args.clerkUserId,
        email: args.email,
        slug: finalSlug,
        displayName: args.displayName || generateDisplayNameFromEmail(args.email),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Get the actual profile object
      userProfile = await ctx.db.get(userProfileId);
    }

    if (!userProfile) {
      throw new Error("Failed to create user profile");
    }

    // Ensure only one result per user: unshare any previous results for this user
    if (args.isPublic) {
      const previousResults = await ctx.db
        .query("quizResults")
        .withIndex("by_user_profile", q => q.eq("userProfileId", userProfile._id))
        .filter(q => q.neq(q.field("_id"), result._id)) // Exclude current result
        .collect();
      
      // Unshare all previous results for this user
      for (const prevResult of previousResults) {
        if (prevResult.isPublic) {
          await ctx.db.patch(prevResult._id, {
            isPublic: false,
            // Keep other fields intact
          });
        }
      }
    }

    // Update result with sharing settings
    const updateData: any = {
      isPublic: args.isPublic,
      userProfileId: userProfile._id,
    };

    // TODO: Re-enable for private sharing in future version
    // Handle passcode protection
    // if (args.passcode && args.passcode.trim().length > 0) {
    //   updateData.passcode = simpleHash(args.passcode.trim());
    //   updateData.hasPasscode = true;
    // } else {
    //   updateData.passcode = undefined;
    //   updateData.hasPasscode = false;
    // }

    // Set sharedAt timestamp when making public for the first time
    if (args.isPublic && !result.sharedAt) {
      updateData.sharedAt = new Date().toISOString();
    }

    await ctx.db.patch(result._id, updateData);

    return {
      success: true,
      isPublic: args.isPublic,
      shareUrl: args.isPublic ? `/results/${userProfile.slug}` : null,
    };
  },
});

// Validate passcode for protected result
export const validatePasscode = query({
  args: { 
    slug: v.string(),
    passcode: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user profile by slug
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .first();

    if (!userProfile) {
      return { valid: false, reason: "User not found" };
    }

    // Get the most recent result for this user (public or private)
    const result = await ctx.db
      .query("quizResults")
      .withIndex("by_user_profile", q => q.eq("userProfileId", userProfile._id))
      .order("desc")
      .first();

    if (!result) {
      return { valid: false, reason: "No results found" };
    }

    // Check if result has passcode protection
    if (!result.hasPasscode || !result.passcode) {
      return { valid: false, reason: "Result is not passcode protected" };
    }

    // Validate passcode
    const hashedInput = simpleHash(args.passcode.trim());
    const isValid = hashedInput === result.passcode;

    return { 
      valid: isValid,
      reason: isValid ? "Valid passcode" : "Invalid passcode"
    };
  },
});

// Get public result by user slug
export const getPublicResult = query({
  args: { 
    slug: v.string(),
    passcode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get user profile by slug
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .first();

    if (!userProfile) {
      return null;
    }

    // Get the most recent result for this user (public or passcode-protected)
    const result = await ctx.db
      .query("quizResults")
      .withIndex("by_user_profile", q => q.eq("userProfileId", userProfile._id))
      .filter(q => q.or(
        q.eq(q.field("isPublic"), true),
        q.eq(q.field("hasPasscode"), true)
      ))
      .order("desc")
      .first();

    if (!result) {
      return null;
    }

    // If result is passcode protected, validate passcode
    if (result.hasPasscode && !result.isPublic) {
      if (!args.passcode || !result.passcode) {
        return { 
          requiresPasscode: true,
          hasPasscode: true,
        };
      }

      const hashedInput = simpleHash(args.passcode.trim());
      if (hashedInput !== result.passcode) {
        return { 
          requiresPasscode: true,
          hasPasscode: true,
          invalidPasscode: true,
        };
      }
    }

    // Get personality type details
    let personalityType = null;
    if (result.personalityTypeId) {
      personalityType = await ctx.db.get(result.personalityTypeId);
    }

    // Get current user identity for ownership check
    const identity = await ctx.auth.getUserIdentity();
    const isViewerOwner = identity?.subject === userProfile.clerkUserId;

    // Generate a friendly display name if one doesn't exist
    const displayName = userProfile.displayName || generateDisplayNameFromEmail(userProfile.email || '') || userProfile.slug
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return {
      userProfile: {
        slug: userProfile.slug,
        displayName: displayName,
        createdAt: userProfile.createdAt,
        // Only include clerkUserId if viewer is the owner
        clerkUserId: isViewerOwner ? userProfile.clerkUserId : undefined,
      },
      result: {
        ...result,
        personalityType,
        // Map for frontend compatibility
        traits: result.traitScores,
        overallFit: result.overallFitScore,
      },
      isViewerOwner,
    };
  },
});

// Get sharing stats for a user
export const getUserSharingStats = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!userProfile) {
      return {
        hasProfile: false,
        totalResults: 0,
        publicResults: 0,
        shareUrl: null,
      };
    }

    const allResults = await ctx.db
      .query("quizResults")
      .withIndex("by_user_profile", q => q.eq("userProfileId", userProfile._id))
      .collect();

    const publicResults = allResults.filter(r => r.isPublic);

    return {
      hasProfile: true,
      slug: userProfile.slug,
      totalResults: allResults.length,
      publicResults: publicResults.length,
      shareUrl: publicResults.length > 0 ? `/results/${userProfile.slug}` : null,
      lastSharedAt: publicResults.length > 0 ? 
        Math.max(...publicResults.map(r => new Date(r.sharedAt || r.calculatedAt).getTime())) : null,
    };
  },
});

// Update existing quiz result to link with user profile
export const linkResultToUser = mutation({
  args: {
    sessionId: v.id("quizSessions"),
    clerkUserId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user profile already exists
    let userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    // Create user profile if it doesn't exist
    if (!userProfile) {
      const baseSlug = generateSlugFromEmail(args.email);
      let finalSlug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness
      while (true) {
        const existing = await ctx.db
          .query("userProfiles")
          .withIndex("by_slug", q => q.eq("slug", finalSlug))
          .first();
        
        if (!existing) break;
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      const userProfileId = await ctx.db.insert("userProfiles", {
        clerkUserId: args.clerkUserId,
        email: args.email,
        slug: finalSlug,
        displayName: args.displayName || generateDisplayNameFromEmail(args.email),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Get the actual profile object
      userProfile = await ctx.db.get(userProfileId);
    }

    if (!userProfile) {
      throw new Error("Failed to create user profile");
    }

    // Update the quiz result to link to user profile
    const result = await ctx.db
      .query("quizResults")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .first();

    if (result) {
      await ctx.db.patch(result._id, {
        userProfileId: userProfile._id,
      });
    }

    return userProfile;
  },
});

// Get shareable URL for a result
export const getShareableUrl = query({
  args: { 
    sessionId: v.id("quizSessions"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!userProfile) {
      return null;
    }

    const result = await ctx.db
      .query("quizResults")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .first();

    if (!result || !result.isPublic) {
      return null;
    }

    return {
      shareUrl: `/results/${userProfile.slug}`,
      slug: userProfile.slug,
      isPublic: result.isPublic,
      sharedAt: result.sharedAt,
    };
  },
});

// Fix existing user profiles that don't have proper display names
export const updateUserDisplayName = mutation({
  args: { 
    slug: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .first();

    if (!userProfile) {
      return { success: false, message: "User profile not found" };
    }

    await ctx.db.patch(userProfile._id, {
      displayName: args.displayName,
      updatedAt: new Date().toISOString(),
    });

    return { 
      success: true, 
      message: `Updated display name to: ${args.displayName}`,
      userProfile: {
        slug: userProfile.slug,
        displayName: args.displayName
      }
    };
  },
});