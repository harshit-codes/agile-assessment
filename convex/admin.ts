import { query } from "./_generated/server";

// Get all quiz sessions (for debugging/admin purposes)
export const getAllSessions = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("quizSessions").collect();
    return sessions.map(session => ({
      sessionId: session._id,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      userAgent: session.userAgent?.substring(0, 50) + "..." || "unknown"
    }));
  },
});

// Get all quiz responses 
export const getAllResponses = query({
  args: {},
  handler: async (ctx) => {
    const responses = await ctx.db.query("quizResponses").collect();
    return {
      totalResponses: responses.length,
      sessions: [...new Set(responses.map(r => r.sessionId))].length,
      responses: responses.slice(0, 5) // Show first 5 as sample
    };
  },
});

// Get all quiz results
export const getAllResults = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("quizResults").collect();
    return results.map(result => ({
      sessionId: result.sessionId,
      personalityTypeId: result.personalityTypeId,
      overallFitScore: result.overallFitScore,
      calculatedAt: result.calculatedAt,
      traits: Object.keys(result.traitScores).map(key => ({
        trait: key,
        score: (result.traitScores as any)[key].score,
        label: (result.traitScores as any)[key].label
      }))
    }));
  },
});

// Get saved contact info
export const getAllSavedResults = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("savedResults").collect();
  },
});