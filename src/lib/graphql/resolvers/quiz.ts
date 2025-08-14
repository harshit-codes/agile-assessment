import { Context, StartQuizSessionInput, SubmitResponseInput, SaveContactInput } from '../types'
import { GraphQLError } from 'graphql'

export const quizResolvers = {
  Query: {
    getQuiz: async (_: any, { title }: { title?: string }, { prisma }: Context) => {
      const quizTitle = title || "The Agile Assessment"
      
      // Get quiz by title
      const quiz = await prisma.quiz.findFirst({
        where: { title: quizTitle },
        include: {
          sections: {
            include: {
              questions: {
                orderBy: { displayOrder: 'asc' }
              }
            },
            orderBy: { displayOrder: 'asc' }
          }
        },
      })

      if (!quiz) return null

      // Transform to match frontend expectations
      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        version: quiz.version,
        sections: quiz.sections.map(section => ({
          id: section.id,
          title: section.title,
          description: section.description,
          polarTraits: {
            left: section.leftTrait,
            right: section.rightTrait
          },
          statements: section.questions.map(q => ({
            id: q.id,
            statement: q.statement,
            isReversed: q.isReversed,
            displayOrder: q.displayOrder
          })),
          displayOrder: section.displayOrder,
          valueLine: section.valueLine
        }))
      }
    },

    getSessionResponses: async (_: any, { sessionId }: { sessionId: string }, { prisma }: Context) => {
      return await prisma.quizResponse.findMany({
        where: { sessionId },
        include: {
          question: true
        }
      })
    },

    getSessionResponsesForRetake: async (
      _: any, 
      { originalSessionId, currentQuizId }: { originalSessionId: string, currentQuizId: string }, 
      { prisma }: Context
    ) => {
      // Check if the original session has a completed result
      const originalResult = await prisma.quizResult.findFirst({
        where: { sessionId: originalSessionId }
      })

      if (!originalResult) {
        return []
      }

      // Get original session responses
      const originalResponses = await prisma.quizResponse.findMany({
        where: { sessionId: originalSessionId },
        include: { question: true }
      })

      if (originalResponses.length === 0) {
        return []
      }

      // Get current quiz questions to validate and map responses
      const currentQuestions = await prisma.question.findMany({
        where: { quizId: currentQuizId }
      })

      const currentQuestionIds = new Set(currentQuestions.map(q => q.id))

      // Filter responses to only include questions that still exist
      return originalResponses.filter(response => 
        currentQuestionIds.has(response.questionId)
      )
    },

    getOnboardingDataForRetake: async (
      _: any,
      { originalSessionId }: { originalSessionId: string },
      { prisma }: Context
    ) => {
      // Get the original session to find the user
      const originalSession = await prisma.quizSession.findUnique({
        where: { id: originalSessionId }
      })

      if (!originalSession || !originalSession.clerkUserId) {
        return null
      }

      // Get the user's profile with onboarding data
      const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId: originalSession.clerkUserId }
      })

      if (!userProfile) {
        return null
      }

      return {
        whatsapp: userProfile.whatsapp || '',
        linkedinUrl: userProfile.linkedinUrl || '',
        currentRole: userProfile.currentRole || ''
      }
    },

    getQuizResult: async (_: any, { sessionId }: { sessionId: string }, { prisma }: Context) => {
      const result = await prisma.quizResult.findFirst({
        where: { sessionId },
        include: {
          personalityType: true
        }
      })

      if (!result) return null

      return {
        ...result,
        personalityType: result.personalityType,
        // Map for frontend compatibility
        traits: result.traitScores,
        overallFit: result.overallFitScore,
      }
    },

    getAllPersonalityTypes: async (_: any, __: any, { prisma }: Context) => {
      const types = await prisma.personalityType.findMany({})
      console.log(`📊 Found ${types.length} personality types in getAllPersonalityTypes`)
      return types
    },

    getPersonalityTypeByTraits: async (
      _: any,
      { workStyle, decisionProcess, communicationStyle, focusOrientation }: {
        workStyle: string
        decisionProcess: string
        communicationStyle: string
        focusOrientation: string
      },
      { prisma }: Context
    ) => {
      // Find exact match first
      const exactMatch = await prisma.personalityType.findFirst({
        where: {
          workStyle,
          decisionProcess,
          communicationStyle,
          focusOrientation
        },
      })

      if (exactMatch) {
        return exactMatch
      }

      // If no exact match, find closest match by counting matching traits
      const allTypes = await prisma.personalityType.findMany({
      })

      let bestMatch = null
      let bestScore = 0

      for (const type of allTypes) {
        let score = 0
        if (type.workStyle === workStyle) score++
        if (type.decisionProcess === decisionProcess) score++
        if (type.communicationStyle === communicationStyle) score++
        if (type.focusOrientation === focusOrientation) score++

        if (score > bestScore) {
          bestScore = score
          bestMatch = type
        }
      }

      return bestMatch
    },

    getPersonalityTypeByShortName: async (
      _: any,
      { shortName }: { shortName: string },
      { prisma }: Context
    ) => {
      const result = await prisma.personalityType.findUnique({
        where: { shortName }
      })
      console.log(`🔍 Finding personality type by shortName: ${shortName}, found:`, !!result)
      return result
    },
  },

  Mutation: {
    startQuizSession: async (
      _: any,
      { input }: { input: StartQuizSessionInput },
      { prisma }: Context
    ) => {
      const quizTitle = input.quizTitle || "The Agile Assessment"

      // Get quiz ID
      const quiz = await prisma.quiz.findFirst({
        where: { title: quizTitle }
      })

      if (!quiz) {
        throw new GraphQLError("Quiz not found")
      }

      // Create new session
      const session = await prisma.quizSession.create({
        data: {
          quizId: quiz.id,
          startedAt: new Date(),
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          clerkUserId: input.clerkUserId,
        },
      })

      return {
        sessionId: session.id,
        quizId: quiz.id,
        clerkUserId: session.clerkUserId,
      }
    },

    submitResponse: async (
      _: any,
      { input }: { input: SubmitResponseInput },
      { prisma }: Context
    ) => {
      // Validate response value is within range
      if (input.responseValue < -2 || input.responseValue > 2) {
        throw new GraphQLError("Response value must be between -2 and 2")
      }

      // Check if session exists
      const session = await prisma.quizSession.findUnique({
        where: { id: input.sessionId },
        include: { quiz: true }
      })

      if (!session) {
        throw new GraphQLError("Session not found")
      }

      // Upsert response (update if exists, create if not)
      await prisma.quizResponse.upsert({
        where: {
          sessionId_questionId: {
            sessionId: input.sessionId,
            questionId: input.questionId
          }
        },
        update: {
          responseValue: input.responseValue,
        },
        create: {
          sessionId: input.sessionId,
          questionId: input.questionId,
          responseValue: input.responseValue,
        },
      })

      // Get total questions for this quiz
      const totalQuestions = await prisma.question.count({
        where: { quizId: session.quizId }
      })

      // Get current responses for this session
      const responses = await prisma.quizResponse.count({
        where: { sessionId: input.sessionId }
      })

      const progress = {
        answered: responses,
        total: totalQuestions,
        percentage: Math.round((responses / totalQuestions) * 100)
      }

      return {
        success: true,
        progress
      }
    },

    completeQuizSession: async (
      _: any,
      { sessionId }: { sessionId: string },
      { prisma }: Context
    ) => {
      await prisma.quizSession.update({
        where: { id: sessionId },
        data: { completedAt: new Date() }
      })

      return true
    },

    saveContactInfo: async (
      _: any,
      { input }: { input: SaveContactInput },
      { prisma }: Context
    ) => {
      await prisma.savedResult.create({
        data: {
          sessionId: input.sessionId,
          email: input.email,
          name: input.name,
        },
      })

      return true
    },
  },

  Subscription: {
    // TODO: Implement real-time subscriptions for quiz progress
    quizProgress: {
      subscribe: () => {
        // Implementation would use a pub/sub system like Redis
        throw new GraphQLError("Subscriptions not yet implemented")
      }
    }
  }
}