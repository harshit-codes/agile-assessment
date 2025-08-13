import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core quiz definitions
  quizzes: defineTable({
    title: v.string(),
    description: v.string(),
    timeLimit: v.optional(v.number()),
    version: v.number(),
  }),

  // Quiz sections (4 sections: work-style, decision-process, communication-style, focus-orientation)
  quizSections: defineTable({
    quizId: v.id("quizzes"),
    title: v.string(),
    description: v.string(),
    leftTrait: v.string(),
    rightTrait: v.string(),
    displayOrder: v.number(),
    valueLine: v.string(), // workStyle, decisionProcess, communicationStyle, focusOrientation
  }).index("by_quiz", ["quizId"]),

  // Questions (32 questions total, 8 per section)
  questions: defineTable({
    quizId: v.id("quizzes"),
    sectionId: v.id("quizSections"),
    statement: v.string(),
    displayOrder: v.number(),
    isReversed: v.boolean(),
    valueLine: v.string(), // workStyle, decisionProcess, communicationStyle, focusOrientation
  })
    .index("by_quiz", ["quizId"])
    .index("by_section", ["sectionId"]),

  // Personality types (16 personality types - 4 dimension system)
  personalityTypes: defineTable({
    name: v.string(),
    shortName: v.string(),
    description: v.string(),
    detailedDescription: v.optional(v.string()),
    // New character attributes from traits2.md
    tagline: v.optional(v.string()),
    motto: v.optional(v.string()),
    punchline: v.optional(v.string()),
    characterAttributes: v.optional(v.array(v.string())),
    characterImage: v.optional(v.string()), // URL to character avatar image
    traits: v.object({
      workStyle: v.union(v.literal("structured"), v.literal("dynamic"), v.literal("adaptive")),
      decisionProcess: v.union(v.literal("evidence-based"), v.literal("intuitive"), v.literal("analytical")),
      communicationStyle: v.optional(v.union(v.literal("direct"), v.literal("harmonizing"))),
      focusOrientation: v.optional(v.union(v.literal("visionary"), v.literal("people-centered"))),
      // Legacy field for migration
      teamInteraction: v.optional(v.union(v.literal("collaborative"), v.literal("individual"))),
    }),
    strengths: v.array(v.string()),
    challenges: v.array(v.string()),
    workStyle: v.optional(v.array(v.string())),
    teamRole: v.optional(v.array(v.string())),
    idealEnvironment: v.optional(v.array(v.string())),
    careerPaths: v.array(v.string()),
    scrumRoles: v.optional(v.object({
      primary: v.string(),
      secondary: v.array(v.string()),
      fitPercentage: v.number(),
    })),
  }),

  // Scrum roles (8 agile roles)
  scrumRoles: defineTable({
    title: v.string(),
    description: v.string(),
    responsibilities: v.array(v.string()),
    idealTraits: v.object({
      workStyle: v.optional(v.union(v.literal("structured"), v.literal("dynamic"))),
      decisionProcess: v.optional(v.union(v.literal("evidence-based"), v.literal("intuitive"))),
      communicationStyle: v.optional(v.union(v.literal("direct"), v.literal("harmonizing"))),
      focusOrientation: v.optional(v.union(v.literal("visionary"), v.literal("people-centered"))),
    }),
    challenges: v.array(v.string()),
    successMetrics: v.array(v.string()),
  }),

  // Quiz sessions - tracks user quiz attempts
  quizSessions: defineTable({
    quizId: v.id("quizzes"),
    startedAt: v.string(),
    completedAt: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    clerkUserId: v.optional(v.string()), // Track which authenticated user created this session
  })
    .index("by_quiz", ["quizId"])
    .index("by_clerk_user", ["clerkUserId"]),

  // Individual question responses
  quizResponses: defineTable({
    sessionId: v.id("quizSessions"),
    questionId: v.id("questions"),
    responseValue: v.number(), // -2 to +2 Likert scale with lenient scoring
  })
    .index("by_session", ["sessionId"])
    .index("by_question", ["questionId"]),

  // Quiz results - calculated results with personality match
  quizResults: defineTable({
    sessionId: v.id("quizSessions"),
    userProfileId: v.optional(v.id("userProfiles")), // Link to user profile for sharing
    personalityTypeId: v.optional(v.id("personalityTypes")),
    personalityCode: v.optional(v.string()), // SSA, SSC, SIA, SIC, ASA, ASC, AIA, AIC
    sectionScores: v.object({
      workStyle: v.number(),
      decisionProcess: v.number(),
      communicationStyle: v.optional(v.number()),
      focusOrientation: v.optional(v.number()),
      // Legacy field
      teamInteraction: v.optional(v.number()),
    }),
    traitScores: v.object({
      workStyle: v.object({
        score: v.number(),
        trait: v.union(v.literal("structured"), v.literal("dynamic"), v.literal("adaptive")),
        label: v.string(),
      }),
      decisionProcess: v.object({
        score: v.number(),
        trait: v.union(v.literal("evidence-based"), v.literal("intuitive"), v.literal("analytical")),
        label: v.string(),
      }),
      communicationStyle: v.optional(v.object({
        score: v.number(),
        trait: v.union(v.literal("direct"), v.literal("harmonizing")),
        label: v.string(),
      })),
      focusOrientation: v.optional(v.object({
        score: v.number(),
        trait: v.union(v.literal("visionary"), v.literal("people-centered")),
        label: v.string(),
      })),
      // Legacy field
      teamInteraction: v.optional(v.object({
        score: v.number(),
        trait: v.union(v.literal("collaborative"), v.literal("individual")),
        label: v.string(),
      })),
    }),
    confidence: v.optional(v.number()), // 0-100 confidence score
    overallFitScore: v.number(), // 0-100
    calculatedAt: v.string(),
    // Sharing fields
    isPublic: v.optional(v.boolean()), // Whether result can be shared publicly
    sharedAt: v.optional(v.string()), // When it was first shared
    // Passcode protection for private sharing
    passcode: v.optional(v.string()), // Hashed passcode for private sharing
    hasPasscode: v.optional(v.boolean()), // Whether this result has passcode protection
  })
    .index("by_session", ["sessionId"])
    .index("by_user_profile", ["userProfileId"])
    .index("by_public", ["isPublic"]),

  // Direct mapping of users to their latest quiz results - ensures reliable lookups
  userQuizResults: defineTable({
    clerkUserId: v.string(), // Clerk user ID from authentication
    latestResultId: v.id("quizResults"), // Direct reference to the user's most recent result
    updatedAt: v.string(), // When this mapping was last updated
  })
    .index("by_clerk_user", ["clerkUserId"]), // Fast lookup by user

  // User profiles - for sharing and personalization
  userProfiles: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    slug: v.string(), // Unique slug for public sharing
    displayName: v.optional(v.string()),
    // Onboarding data
    onboardingComplete: v.optional(v.boolean()),
    name: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    currentRole: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_slug", ["slug"])
    .index("by_email", ["email"])
    .index("by_onboarding_complete", ["onboardingComplete"]),

  // Saved results - optional contact info for follow-ups
  savedResults: defineTable({
    sessionId: v.id("quizSessions"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    savedAt: v.string(),
  }).index("by_session", ["sessionId"]),

  // Application configuration - branding, URLs, etc.
  appConfig: defineTable({
    key: v.string(), // Unique configuration key
    value: v.string(), // Configuration value
    category: v.string(), // Category for grouping (e.g., "branding", "urls", "features")
    description: v.optional(v.string()), // Human-readable description
    updatedAt: v.string(),
  }).index("by_key", ["key"])
    .index("by_category", ["category"]),
});