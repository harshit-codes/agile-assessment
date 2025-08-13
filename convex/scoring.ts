import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Interfaces for scoring - updated for 4-trait system
interface SectionScores {
  workStyle: number;         // -2 to +2 (negative = dynamic, positive = structured)
  decisionProcess: number;   // -2 to +2 (negative = intuitive, positive = evidence-based)
  communicationStyle: number; // -2 to +2 (negative = harmonizing, positive = direct)
  focusOrientation: number;   // -2 to +2 (negative = people-centered, positive = visionary)
}

interface TraitResults {
  workStyle: {
    score: number;
    trait: 'structured' | 'dynamic';
    label: string;
  };
  decisionProcess: {
    score: number;
    trait: 'evidence-based' | 'intuitive';
    label: string;
  };
  communicationStyle: {
    score: number;
    trait: 'direct' | 'harmonizing';
    label: string;
  };
  focusOrientation: {
    score: number;
    trait: 'visionary' | 'people-centered';
    label: string;
  };
}

// Calculate assessment results for a session
export const calculateAssessmentResult = mutation({
  args: {
    sessionId: v.id("quizSessions"),
  },
  handler: async (ctx, args) => {
    // Get session
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Get quiz sections
    const sections = await ctx.db
      .query("quizSections")
      .withIndex("by_quiz", q => q.eq("quizId", session.quizId))
      .collect();

    // Get all responses for this session
    const responses = await ctx.db
      .query("quizResponses")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .collect();

    // Get all questions for calculating section scores
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", q => q.eq("quizId", session.quizId))
      .collect();

    // Calculate section scores
    const sectionScores: any = {
      workStyle: 0,
      decisionProcess: 0,
      communicationStyle: 0,
      focusOrientation: 0
    };

    // Group questions by section for scoring
    const questionsBySection = questions.reduce((acc, question) => {
      const sectionId = question.sectionId;
      if (!acc[sectionId]) acc[sectionId] = [];
      acc[sectionId].push(question);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate average score for each section with reverse scoring
    for (const section of sections) {
      const sectionQuestions = questionsBySection[section._id] || [];
      const sectionResponses = responses.filter(r => 
        sectionQuestions.some(q => q._id === r.questionId)
      );

      if (sectionResponses.length > 0) {
        let sectionTotal = 0;
        let responseCount = 0;

        for (const response of sectionResponses) {
          const question = sectionQuestions.find(q => q._id === response.questionId);
          if (question) {
            let adjustedScore = response.responseValue;
            
            // Apply reverse scoring if question is reversed
            if (question.isReversed) {
              adjustedScore = -adjustedScore;
            }
            
            sectionTotal += adjustedScore;
            responseCount++;
          }
        }

        const sectionAverage = responseCount > 0 ? sectionTotal / responseCount : 0;

        // Map section titles to score properties - updated for 4 sections
        if (section.title === "Work Style Preferences" || section.valueLine === "workStyle") {
          sectionScores.workStyle = sectionAverage;
        } else if (section.title === "Decision Making Process" || section.valueLine === "decisionProcess") {
          sectionScores.decisionProcess = sectionAverage;
        } else if (section.title === "Communication Style" || section.valueLine === "communicationStyle") {
          sectionScores.communicationStyle = sectionAverage;
        } else if (section.title === "Focus Orientation" || section.valueLine === "focusOrientation") {
          sectionScores.focusOrientation = sectionAverage;
        }
      }
    }

    // Convert scores to trait preferences
    const traitResults: any = {
      workStyle: {
        score: sectionScores.workStyle,
        trait: sectionScores.workStyle >= 0 ? 'structured' : 'dynamic',
        label: sectionScores.workStyle >= 0 ? 'Structured & Organized' : 'Dynamic & Adaptable'
      },
      decisionProcess: {
        score: sectionScores.decisionProcess,
        trait: sectionScores.decisionProcess >= 0 ? 'evidence-based' : 'intuitive',
        label: sectionScores.decisionProcess >= 0 ? 'Evidence-Based & Analytical' : 'Intuitive & Experience-Based'
      },
      communicationStyle: {
        score: sectionScores.communicationStyle,
        trait: sectionScores.communicationStyle >= 0 ? 'direct' : 'harmonizing',
        label: sectionScores.communicationStyle >= 0 ? 'Direct & Straightforward' : 'Harmonizing & Diplomatic'
      },
      focusOrientation: {
        score: sectionScores.focusOrientation,
        trait: sectionScores.focusOrientation >= 0 ? 'visionary' : 'people-centered',
        label: sectionScores.focusOrientation >= 0 ? 'Visionary & Strategic' : 'People-Centered & Supportive'
      }
    };

    // Calculate confidence score based on section score magnitudes
    // More lenient scoring - easier to get high confidence
    const avgMagnitude = (
      Math.abs(sectionScores.workStyle) + 
      Math.abs(sectionScores.decisionProcess) + 
      Math.abs(sectionScores.communicationStyle) + 
      Math.abs(sectionScores.focusOrientation)
    ) / 4;
    
    // Much more lenient confidence calculation
    const confidenceLeniency = 1.5; // Boost confidence by 50%
    const adjustedMagnitude = Math.min(2.0, avgMagnitude * confidenceLeniency);
    const baseConfidence = Math.round((adjustedMagnitude / 2.0) * 100);
    // Apply floor protection - minimum 65% confidence
    const confidence = Math.max(65, Math.min(100, baseConfidence));

    // Calculate overall fit percentage
    // More lenient - easier to get high fit scores
    const traitStrengths = [
      Math.abs(sectionScores.workStyle),
      Math.abs(sectionScores.decisionProcess),
      Math.abs(sectionScores.communicationStyle),
      Math.abs(sectionScores.focusOrientation)
    ];
    const averageStrength = traitStrengths.reduce((sum, strength) => sum + strength, 0) / 4;
    
    // Much more lenient fit calculation - boost by 60%
    const fitLeniency = 1.6;
    const adjustedStrength = Math.min(2.0, averageStrength * fitLeniency);
    const baseFit = Math.round((adjustedStrength / 2.0) * 100);
    // Apply floor protection - minimum 70% overall fit
    const overallFit = Math.max(70, Math.min(100, baseFit));

    // Generate personality code (e.g., "SEDV", "DIHP")
    const codes = {
      workStyle: traitResults.workStyle.trait === 'structured' ? 'S' : 'D',
      decisionProcess: traitResults.decisionProcess.trait === 'evidence-based' ? 'E' : 'I',
      communicationStyle: traitResults.communicationStyle.trait === 'direct' ? 'D' : 'H',
      focusOrientation: traitResults.focusOrientation.trait === 'visionary' ? 'V' : 'P'
    };
    const personalityCode = codes.workStyle + codes.decisionProcess + codes.communicationStyle + codes.focusOrientation;

    // Find matching personality type
    const personalityType = await ctx.db
      .query("personalityTypes")
      .filter(q => 
        q.eq(q.field("traits.workStyle"), traitResults.workStyle.trait) &&
        q.eq(q.field("traits.decisionProcess"), traitResults.decisionProcess.trait) &&
        q.eq(q.field("traits.communicationStyle"), traitResults.communicationStyle.trait) &&
        q.eq(q.field("traits.focusOrientation"), traitResults.focusOrientation.trait)
      )
      .first();

    // Get user profile for linking (if user is authenticated)
    const identity = await ctx.auth.getUserIdentity();
    let userProfile = null;
    if (identity) {
      userProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_clerk_id", q => q.eq("clerkUserId", identity.subject))
        .first();
      
      // If user is authenticated but profile doesn't exist, create it
      if (!userProfile) {
        // Generate basic profile data from identity
        const baseSlug = identity.subject.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
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

        const now = new Date().toISOString();
        const userProfileId = await ctx.db.insert("userProfiles", {
          clerkUserId: identity.subject,
          email: identity.email || "",
          slug,
          displayName: identity.name || "",
          onboardingComplete: false,
          createdAt: now,
          updatedAt: now,
        });
        
        userProfile = await ctx.db.get(userProfileId);
      }
    }

    // Check if result already exists for this session
    const existingResult = await ctx.db
      .query("quizResults")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .first();

    let resultId;
    if (existingResult) {
      // Update existing result (overwrite on retake)
      await ctx.db.patch(existingResult._id, {
        userProfileId: userProfile?._id,
        personalityTypeId: personalityType?._id,
        personalityCode,
        sectionScores,
        traitScores: traitResults,
        confidence,
        overallFitScore: overallFit,
        calculatedAt: new Date().toISOString(),
      });
      resultId = existingResult._id;
    } else {
      // Create new result
      resultId = await ctx.db.insert("quizResults", {
        sessionId: args.sessionId,
        userProfileId: userProfile?._id,
        personalityTypeId: personalityType?._id,
        personalityCode,
        sectionScores,
        traitScores: traitResults,
        confidence,
        overallFitScore: overallFit,
        calculatedAt: new Date().toISOString(),
      });
    }

    // CRITICAL: Create or update direct user-result mapping for reliable lookups
    if (session?.clerkUserId) {
      // Check if mapping already exists for this user
      const existingMapping = await ctx.db
        .query("userQuizResults")
        .withIndex("by_clerk_user", q => q.eq("clerkUserId", session.clerkUserId!))
        .first();

      if (existingMapping) {
        // Update existing mapping to point to latest result
        await ctx.db.patch(existingMapping._id, {
          latestResultId: resultId,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new mapping
        await ctx.db.insert("userQuizResults", {
          clerkUserId: session.clerkUserId!,
          latestResultId: resultId,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return {
      resultId,
      scores: sectionScores,
      traits: traitResults,
      personalityType,
      personalityCode,
      confidence,
      overallFit,
      sessionId: args.sessionId,
      calculatedAt: new Date().toISOString()
    };
  },
});

// Convert score to percentage for display (0-100 scale)
export const scoreToPercentage = query({
  args: { score: v.number() },
  handler: async (ctx, args) => {
    return Math.round(((args.score + 2) / 4) * 100);
  },
});

// Get trait strength description
export const getTraitStrength = query({
  args: { score: v.number() },
  handler: async (ctx, args) => {
    const absScore = Math.abs(args.score);
    if (absScore >= 1.5) return 'Strong';
    if (absScore >= 1.0) return 'Moderate';
    if (absScore >= 0.5) return 'Mild';
    return 'Neutral';
  },
});