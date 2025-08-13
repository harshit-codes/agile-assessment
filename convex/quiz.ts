import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get quiz with all sections and questions
export const getQuiz = query({
  args: { title: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const quizTitle = args.title || "The Agile Assessment";
    
    // Get quiz by title
    const quiz = await ctx.db
      .query("quizzes")
      .filter(q => q.eq(q.field("title"), quizTitle))
      .first();

    if (!quiz) return null;

    // Get sections for this quiz
    const sections = await ctx.db
      .query("quizSections")
      .withIndex("by_quiz", q => q.eq("quizId", quiz._id))
      .order("asc")
      .collect();

    // Get all questions for each section
    const sectionsWithQuestions = await Promise.all(
      sections.map(async (section) => {
        const questions = await ctx.db
          .query("questions")
          .withIndex("by_section", q => q.eq("sectionId", section._id))
          .order("asc")
          .collect();

        return {
          id: section._id,
          title: section.title,
          description: section.description,
          polarTraits: {
            left: section.leftTrait,
            right: section.rightTrait
          },
          statements: questions.map(q => ({
            id: q._id,
            statement: q.statement,
            isReversed: q.isReversed,
            displayOrder: q.displayOrder
          })),
          displayOrder: section.displayOrder
        };
      })
    );

    // Sort sections by display order
    sectionsWithQuestions.sort((a, b) => a.displayOrder - b.displayOrder);

    return {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      version: quiz.version,
      sections: sectionsWithQuestions
    };
  },
});

// Start a new quiz session
export const startQuizSession = mutation({
  args: {
    quizTitle: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    // CRITICAL: Explicitly require Clerk user ID for authenticated users
    clerkUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const quizTitle = args.quizTitle || "The Agile Assessment";
    
    // Get quiz ID
    const quiz = await ctx.db
      .query("quizzes")
      .filter(q => q.eq(q.field("title"), quizTitle))
      .first();

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Get current user identity if authenticated
    const identity = await ctx.auth.getUserIdentity();
    
    // Determine the user ID - prefer explicit parameter over auth identity
    const clerkUserId = args.clerkUserId || identity?.subject;
    
    // Create new session with guaranteed user ID for authenticated users
    const sessionId = await ctx.db.insert("quizSessions", {
      quizId: quiz._id,
      startedAt: new Date().toISOString(),
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      clerkUserId, // This will be populated for authenticated users
    });

    return {
      sessionId,
      quizId: quiz._id,
      clerkUserId, // Return the user ID so client can verify
    };
  },
});

// Submit a response to a question
export const submitResponse = mutation({
  args: {
    sessionId: v.id("quizSessions"),
    questionId: v.id("questions"),
    responseValue: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate response value is within range
    if (args.responseValue < -2 || args.responseValue > 2) {
      throw new Error("Response value must be between -2 and 2");
    }

    // Check if session exists
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Check if response already exists and update, otherwise insert
    const existingResponse = await ctx.db
      .query("quizResponses")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .filter(q => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (existingResponse) {
      // Update existing response
      await ctx.db.patch(existingResponse._id, {
        responseValue: args.responseValue,
      });
    } else {
      // Insert new response
      await ctx.db.insert("quizResponses", {
        sessionId: args.sessionId,
        questionId: args.questionId,
        responseValue: args.responseValue,
      });
    }

    // Get total questions for this quiz
    const quiz = await ctx.db.get(session.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const totalQuestions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", q => q.eq("quizId", session.quizId))
      .collect();

    // Get current responses for this session
    const responses = await ctx.db
      .query("quizResponses")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .collect();

    const progress = {
      answered: responses.length,
      total: totalQuestions.length,
      percentage: Math.round((responses.length / totalQuestions.length) * 100)
    };

    return {
      success: true,
      progress
    };
  },
});

// Get session responses
export const getSessionResponses = query({
  args: { sessionId: v.id("quizSessions") },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("quizResponses")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .collect();

    return responses;
  },
});

// Get session responses for retake - simplified without user auth requirement
export const getSessionResponsesForRetake = query({
  args: { 
    originalSessionId: v.id("quizSessions"),
    currentQuizId: v.id("quizzes")
  },
  handler: async (ctx, args) => {
    // Check if the original session has a completed result (basic security)
    const originalResult = await ctx.db
      .query("quizResults")
      .withIndex("by_session", q => q.eq("sessionId", args.originalSessionId))
      .first();

    if (!originalResult) {
      return [];
    }

    // Get original session responses
    const originalResponses = await ctx.db
      .query("quizResponses")
      .withIndex("by_session", q => q.eq("sessionId", args.originalSessionId))
      .collect();

    if (originalResponses.length === 0) {
      return []; // No responses to prefill
    }

    // Get current quiz questions to validate and map responses
    const currentQuestions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", q => q.eq("quizId", args.currentQuizId))
      .collect();

    // Create a mapping of current question IDs
    const currentQuestionIds = new Set(currentQuestions.map(q => q._id));

    // Filter responses to only include questions that still exist
    const validResponses = originalResponses.filter(response => 
      currentQuestionIds.has(response.questionId)
    );

    return validResponses;
  },
});

// Complete quiz session
export const completeQuizSession = mutation({
  args: { sessionId: v.id("quizSessions") },
  handler: async (ctx, args) => {
    // Update session completion time
    await ctx.db.patch(args.sessionId, {
      completedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

// Get all personality types
export const getAllPersonalityTypes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("personalityTypes").collect();
  },
});

// Get personality type by traits (updated for 4-trait system)
export const getPersonalityTypeByTraits = query({
  args: {
    workStyle: v.union(v.literal("structured"), v.literal("dynamic")),
    decisionProcess: v.union(v.literal("evidence-based"), v.literal("intuitive")),
    communicationStyle: v.union(v.literal("direct"), v.literal("harmonizing")),
    focusOrientation: v.union(v.literal("visionary"), v.literal("people-centered")),
  },
  handler: async (ctx, args) => {
    // Find exact match
    const exactMatch = await ctx.db
      .query("personalityTypes")
      .filter(q => 
        q.eq(q.field("traits.workStyle"), args.workStyle) &&
        q.eq(q.field("traits.decisionProcess"), args.decisionProcess) &&
        q.eq(q.field("traits.communicationStyle"), args.communicationStyle) &&
        q.eq(q.field("traits.focusOrientation"), args.focusOrientation)
      )
      .first();

    if (exactMatch) {
      return exactMatch;
    }

    // If no exact match, find closest match by counting matching traits
    const allTypes = await ctx.db.query("personalityTypes").collect();
    
    let bestMatch = null;
    let bestScore = 0;

    for (const type of allTypes) {
      let score = 0;
      if (type.traits.workStyle === args.workStyle) score++;
      if (type.traits.decisionProcess === args.decisionProcess) score++;
      if (type.traits.communicationStyle === args.communicationStyle) score++;
      if (type.traits.focusOrientation === args.focusOrientation) score++;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = type;
      }
    }

    return bestMatch;
  },
});

// Get personality type by shortName
export const getPersonalityTypeByShortName = query({
  args: { shortName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("personalityTypes")
      .filter((q) => q.eq(q.field("shortName"), args.shortName))
      .first();
  },
});

// Get quiz result by session
export const getQuizResult = query({
  args: { sessionId: v.id("quizSessions") },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("quizResults")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .first();

    if (!result) return null;

    // Get personality type if available
    let personalityType = null;
    if (result.personalityTypeId) {
      personalityType = await ctx.db.get(result.personalityTypeId);
    }

    return {
      ...result,
      personalityType,
      // Map traitScores to traits for frontend compatibility
      traits: result.traitScores,
      // Map overallFitScore to overallFit for frontend compatibility  
      overallFit: result.overallFitScore,
    };
  },
});

// Get user's latest quiz result - Simple, reliable direct lookup
export const getUserLatestResult = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    // Direct lookup in user-result mapping table
    const userMapping = await ctx.db
      .query("userQuizResults")
      .withIndex("by_clerk_user", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!userMapping) return null;

    // Get the full result data
    const result = await ctx.db.get(userMapping.latestResultId);
    if (!result) return null;

    // Get personality type if available
    let personalityType = null;
    if (result.personalityTypeId) {
      personalityType = await ctx.db.get(result.personalityTypeId);
    }

    return {
      ...result,
      personalityType,
      // Map traitScores to traits for frontend compatibility
      traits: result.traitScores,
      // Map overallFitScore to overallFit for frontend compatibility  
      overallFit: result.overallFitScore,
    };
  },
});

// Get user's latest quiz result by Clerk user ID - Production-ready direct mapping
export const getUserLatestQuizResult = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    // Direct lookup in user-result mapping table for fast, reliable access
    const userMapping = await ctx.db
      .query("userQuizResults")
      .withIndex("by_clerk_user", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!userMapping) return null;

    const result = await ctx.db.get(userMapping.latestResultId);
    if (!result) return null;

    let personalityType = null;
    if (result.personalityTypeId) {
      personalityType = await ctx.db.get(result.personalityTypeId);
    }

    return {
      ...result,
      personalityType,
      traits: result.traitScores,
      overallFit: result.overallFitScore,
    };
  },
});

// Link unlinked quiz result to user profile
export const linkQuizResultToProfile = mutation({
  args: {
    resultId: v.id("quizResults"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user profile
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    // Get the result and ensure it's not already linked
    const result = await ctx.db.get(args.resultId);
    if (!result) {
      throw new Error("Quiz result not found");
    }

    if (result.userProfileId) {
      return { success: true, message: "Result already linked" };
    }

    // Link the result to the user profile
    await ctx.db.patch(args.resultId, {
      userProfileId: userProfile._id
    });

    return { success: true, message: "Result linked successfully" };
  },
});




// Get user onboarding data for retaking a quiz
export const getOnboardingDataForRetake = query({
  args: { 
    originalSessionId: v.id("quizSessions")
  },
  handler: async (ctx, args) => {
    // Get the original session to find the user
    const originalSession = await ctx.db.get(args.originalSessionId);
    if (!originalSession || !originalSession.clerkUserId) {
      return null; // No user linked to original session
    }

    // Get the user's profile with onboarding data
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerk_id", q => q.eq("clerkUserId", originalSession.clerkUserId!))
      .first();

    if (!userProfile) {
      return null; // No profile found
    }

    // Return only the onboarding fields
    return {
      whatsapp: userProfile.whatsapp || '',
      linkedinUrl: userProfile.linkedinUrl || '',
      currentRole: userProfile.currentRole || ''
    };
  },
});

// Save contact information
export const saveContactInfo = mutation({
  args: {
    sessionId: v.id("quizSessions"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("savedResults", {
      sessionId: args.sessionId,
      email: args.email,
      name: args.name,
      savedAt: new Date().toISOString(),
    });
  },
});