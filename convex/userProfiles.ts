import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Utility function to generate slug from email
function generateSlugFromEmail(email: string): string {
  return email
    .split('@')[0] // Take part before @
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Debug function to check user profile by email (temporary)
export const debugGetUserProfileByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();
    
    if (!profile) {
      return { found: false, message: "No profile found for this email" };
    }
    
    return {
      found: true,
      profile: {
        email: profile.email,
        clerkUserId: profile.clerkUserId,
        onboardingComplete: profile.onboardingComplete,
        whatsapp: profile.whatsapp,
        linkedinUrl: profile.linkedinUrl,
        currentRole: profile.currentRole,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    };
  },
});

// Debug function to check user profile by Clerk ID
export const debugGetUserProfileByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();
    
    if (!profile) {
      return { found: false, message: "No profile found for this Clerk User ID" };
    }
    
    return {
      found: true,
      profile: {
        email: profile.email,
        clerkUserId: profile.clerkUserId,
        onboardingComplete: profile.onboardingComplete,
        whatsapp: profile.whatsapp,
        linkedinUrl: profile.linkedinUrl,
        currentRole: profile.currentRole,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    };
  },
});

// Get or create user profile (internal only)
export const getOrCreateUserProfile = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existingProfile) {
      return existingProfile;
    }

    // Generate unique slug
    const baseSlug = generateSlugFromEmail(args.email);
    let slug = baseSlug;
    let counter = 1;

    // Check for slug uniqueness
    while (true) {
      const existingSlug = await ctx.db
        .query("userProfiles")
        .withIndex("by_slug", q => q.eq("slug", slug))
        .first();

      if (!existingSlug) {
        break; // Slug is unique
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create new profile
    const now = new Date().toISOString();
    const profileId = await ctx.db.insert("userProfiles", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      slug,
      displayName: args.displayName,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(profileId);
  },
});

// Get user profile by Clerk ID
export const getUserProfile = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
});

// Get user profile by slug (for public access)
export const getUserProfileBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .first();
  },
});

// Check if slug is available
export const checkSlugAvailability = query({
  args: { 
    slug: v.string(),
    excludeUserId: v.optional(v.string()) // Exclude current user when updating
  },
  handler: async (ctx, args) => {
    // Validate slug format
    const slugPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (args.slug.length < 3 || args.slug.length > 30 || !slugPattern.test(args.slug)) {
      return {
        available: false,
        reason: "Slug must be 3-30 characters, contain only lowercase letters, numbers, and hyphens, and not start or end with a hyphen"
      };
    }

    // Check for reserved slugs
    const reservedSlugs = ['admin', 'api', 'www', 'support', 'help', 'about', 'contact', 'terms', 'privacy'];
    if (reservedSlugs.includes(args.slug)) {
      return {
        available: false,
        reason: "This slug is reserved"
      };
    }

    // Check if slug exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .first();

    if (existingProfile && existingProfile.clerkUserId !== args.excludeUserId) {
      return {
        available: false,
        reason: "This slug is already taken"
      };
    }

    return {
      available: true,
      reason: "Slug is available"
    };
  },
});

// Update user slug
export const updateUserSlug = mutation({
  args: {
    clerkUserId: v.string(),
    newSlug: v.string(),
  },
  handler: async (ctx, args) => {
    // Get current profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    // Check slug availability inline
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_slug", q => q.eq("slug", args.newSlug))
      .first();
      
    if (existingProfile && existingProfile.clerkUserId !== args.clerkUserId) {
      throw new Error("This slug is already taken by another user");
    }

    // Update slug
    await ctx.db.patch(profile._id, {
      slug: args.newSlug,
      updatedAt: new Date().toISOString(),
    });

    return await ctx.db.get(profile._id);
  },
});

// Update display name
export const updateDisplayName = mutation({
  args: {
    clerkUserId: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!profile) {
      throw new Error("User profile not found");
    }

    await ctx.db.patch(profile._id, {
      displayName: args.displayName,
      updatedAt: new Date().toISOString(),
    });

    return await ctx.db.get(profile._id);
  },
});

// Update onboarding data
export const updateOnboardingData = mutation({
  args: {
    clerkUserId: v.string(),
    onboardingData: v.object({
      onboardingComplete: v.boolean(),
      whatsapp: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      currentRole: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // First try to find existing profile
    let profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    const now = new Date().toISOString();

    if (profile) {
      // Update existing profile
      await ctx.db.patch(profile._id, {
        ...args.onboardingData,
        updatedAt: now,
      });
      
      return await ctx.db.get(profile._id);
    } else {
      // Profile doesn't exist, create a basic one with onboarding data
      // Generate a temporary slug from clerkUserId since we don't have email
      const baseSlug = args.clerkUserId.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
      let slug = baseSlug;
      let counter = 1;

      // Check for slug uniqueness
      while (true) {
        const existingSlug = await ctx.db
          .query("userProfiles")
          .withIndex("by_slug", q => q.eq("slug", slug))
          .first();

        if (!existingSlug) {
          break; // Slug is unique
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create new profile with onboarding data
      const profileData = {
        clerkUserId: args.clerkUserId,
        email: "", // Will be updated when we get user info from Clerk
        slug,
        displayName: "",
        ...args.onboardingData,
        createdAt: now,
        updatedAt: now,
      };

      const profileId = await ctx.db.insert("userProfiles", profileData);
      return await ctx.db.get(profileId);
    }
  },
});

// Get or create user profile with onboarding support
export const getOrCreateUserProfileWithOnboarding = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    onboardingData: v.optional(v.object({
      onboardingComplete: v.boolean(),
      name: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      currentRole: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existingProfile) {
      // Update with onboarding data if provided
      if (args.onboardingData) {
        await ctx.db.patch(existingProfile._id, {
          ...args.onboardingData,
          updatedAt: new Date().toISOString(),
        });
        return await ctx.db.get(existingProfile._id);
      }
      return existingProfile;
    }

    // Generate unique slug
    const baseSlug = generateSlugFromEmail(args.email);
    let slug = baseSlug;
    let counter = 1;

    // Check for slug uniqueness
    while (true) {
      const existingSlug = await ctx.db
        .query("userProfiles")
        .withIndex("by_slug", q => q.eq("slug", slug))
        .first();

      if (!existingSlug) {
        break; // Slug is unique
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create new profile
    const now = new Date().toISOString();
    const profileData = {
      clerkUserId: args.clerkUserId,
      email: args.email,
      slug,
      displayName: args.displayName,
      ...(args.onboardingData || {}),
      createdAt: now,
      updatedAt: now,
    };

    const profileId = await ctx.db.insert("userProfiles", profileData);
    return await ctx.db.get(profileId);
  },
});

// Delete user account and all associated data (for Clerk webhook)
export const deleteUserAccount = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    console.log(`Starting account deletion for clerkUserId: ${args.clerkUserId}`);
    
    // Find user profile
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!userProfile) {
      console.log(`No user profile found for clerkUserId: ${args.clerkUserId}`);
      return {
        success: true,
        message: "No user data found to delete",
        deletedCount: 0
      };
    }

    console.log(`Found user profile: ${userProfile._id}`);
    let deletedCount = 0;

    try {
      // 1. Find all quiz sessions for this user
      const quizSessions = await ctx.db
        .query("quizSessions")
        .collect();
      
      // Filter sessions that belong to this user (through quiz results)
      const userSessions = [];
      for (const session of quizSessions) {
        const result = await ctx.db
          .query("quizResults")
          .withIndex("by_session", q => q.eq("sessionId", session._id))
          .first();
        
        if (result && result.userProfileId === userProfile._id) {
          userSessions.push(session);
        }
      }

      console.log(`Found ${userSessions.length} quiz sessions for user`);

      // 2. Delete quiz responses for each session
      for (const session of userSessions) {
        const responses = await ctx.db
          .query("quizResponses")
          .withIndex("by_session", q => q.eq("sessionId", session._id))
          .collect();
        
        for (const response of responses) {
          await ctx.db.delete(response._id);
          deletedCount++;
        }
        console.log(`Deleted ${responses.length} quiz responses for session ${session._id}`);
      }

      // 3. Delete saved results for each session
      for (const session of userSessions) {
        const savedResults = await ctx.db
          .query("savedResults")
          .withIndex("by_session", q => q.eq("sessionId", session._id))
          .collect();
        
        for (const savedResult of savedResults) {
          await ctx.db.delete(savedResult._id);
          deletedCount++;
        }
        console.log(`Deleted ${savedResults.length} saved results for session ${session._id}`);
      }

      // 4. Delete quiz results
      const quizResults = await ctx.db
        .query("quizResults")
        .withIndex("by_user_profile", q => q.eq("userProfileId", userProfile._id))
        .collect();
      
      for (const result of quizResults) {
        await ctx.db.delete(result._id);
        deletedCount++;
      }
      console.log(`Deleted ${quizResults.length} quiz results`);

      // 5. Delete quiz sessions
      for (const session of userSessions) {
        await ctx.db.delete(session._id);
        deletedCount++;
      }
      console.log(`Deleted ${userSessions.length} quiz sessions`);

      // 6. Finally, delete the user profile
      await ctx.db.delete(userProfile._id);
      deletedCount++;
      console.log(`Deleted user profile`);

      console.log(`Account deletion completed. Total items deleted: ${deletedCount}`);

      return {
        success: true,
        message: `Successfully deleted user account and all associated data`,
        deletedCount,
        userProfileId: userProfile._id,
        clerkUserId: args.clerkUserId
      };

    } catch (error) {
      console.error(`Error during account deletion for ${args.clerkUserId}:`, error);
      throw new Error(`Failed to delete user account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});