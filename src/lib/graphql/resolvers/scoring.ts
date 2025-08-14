import { Context, SectionScores, TraitResults } from '../types'
import { GraphQLError } from 'graphql'

export const scoringResolvers = {
  Query: {
    // Additional scoring-related queries can go here
  },

  Mutation: {
    calculateAssessmentResult: async (
      _: any,
      { sessionId }: { sessionId: string },
      { prisma }: Context
    ) => {
      // Get session
      const session = await prisma.quizSession.findUnique({
        where: { id: sessionId },
        include: {
          quiz: {
            include: {
              sections: {
                include: {
                  questions: true
                }
              }
            }
          }
        }
      })

      if (!session) {
        throw new GraphQLError("Session not found")
      }

      // Get all responses for this session
      const responses = await prisma.quizResponse.findMany({
        where: { sessionId },
        include: { question: true }
      })

      // Get all questions for calculating section scores
      const questions = await prisma.question.findMany({
        where: { quizId: session.quizId }
      })

      // Calculate section scores
      const sectionScores: SectionScores = {
        workStyle: 0,
        decisionProcess: 0,
        communicationStyle: 0,
        focusOrientation: 0
      }

      // Group questions by section for scoring
      const questionsBySection: Record<string, any[]> = {}
      questions.forEach(question => {
        const sectionId = question.sectionId
        if (!questionsBySection[sectionId]) questionsBySection[sectionId] = []
        questionsBySection[sectionId].push(question)
      })

      // Calculate average score for each section with reverse scoring
      for (const section of session.quiz.sections) {
        const sectionQuestions = questionsBySection[section.id] || []
        const sectionResponses = responses.filter(r => 
          sectionQuestions.some(q => q.id === r.questionId)
        )

        if (sectionResponses.length > 0) {
          let sectionTotal = 0
          let responseCount = 0

          for (const response of sectionResponses) {
            const question = sectionQuestions.find(q => q.id === response.questionId)
            if (question) {
              let adjustedScore = response.responseValue
              
              // Apply reverse scoring if question is reversed
              if (question.isReversed) {
                adjustedScore = -adjustedScore
              }
              
              sectionTotal += adjustedScore
              responseCount++
            }
          }

          const sectionAverage = responseCount > 0 ? sectionTotal / responseCount : 0

          // Map section titles to score properties
          if (section.title === "Work Style Preferences" || section.valueLine === "workStyle") {
            sectionScores.workStyle = sectionAverage
          } else if (section.title === "Decision Making Process" || section.valueLine === "decisionProcess") {
            sectionScores.decisionProcess = sectionAverage
          } else if (section.title === "Communication Style" || section.valueLine === "communicationStyle") {
            sectionScores.communicationStyle = sectionAverage
          } else if (section.title === "Focus Orientation" || section.valueLine === "focusOrientation") {
            sectionScores.focusOrientation = sectionAverage
          }
        }
      }

      // Convert scores to trait preferences
      const traitResults: TraitResults = {
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
      }

      // Calculate confidence score based on section score magnitudes
      const avgMagnitude = (
        Math.abs(sectionScores.workStyle) + 
        Math.abs(sectionScores.decisionProcess) + 
        Math.abs(sectionScores.communicationStyle) + 
        Math.abs(sectionScores.focusOrientation)
      ) / 4
      
      // Lenient confidence calculation
      const confidenceLeniency = 1.5
      const adjustedMagnitude = Math.min(2.0, avgMagnitude * confidenceLeniency)
      const baseConfidence = Math.round((adjustedMagnitude / 2.0) * 100)
      const confidence = Math.max(65, Math.min(100, baseConfidence))

      // Calculate overall fit percentage
      const traitStrengths = [
        Math.abs(sectionScores.workStyle),
        Math.abs(sectionScores.decisionProcess),
        Math.abs(sectionScores.communicationStyle),
        Math.abs(sectionScores.focusOrientation)
      ]
      const averageStrength = traitStrengths.reduce((sum, strength) => sum + strength, 0) / 4
      
      // Lenient fit calculation
      const fitLeniency = 1.6
      const adjustedStrength = Math.min(2.0, averageStrength * fitLeniency)
      const baseFit = Math.round((adjustedStrength / 2.0) * 100)
      const overallFit = Math.max(70, Math.min(100, baseFit))

      // Generate personality code
      const codes = {
        workStyle: traitResults.workStyle.trait === 'structured' ? 'S' : 'D',
        decisionProcess: traitResults.decisionProcess.trait === 'evidence-based' ? 'E' : 'I',
        communicationStyle: traitResults.communicationStyle.trait === 'direct' ? 'D' : 'H',
        focusOrientation: traitResults.focusOrientation.trait === 'visionary' ? 'V' : 'P'
      }
      const personalityCode = codes.workStyle + codes.decisionProcess + codes.communicationStyle + codes.focusOrientation

      // Find matching personality type
      const personalityType = await prisma.personalityType.findFirst({
        where: {
          workStyle: traitResults.workStyle.trait,
          decisionProcess: traitResults.decisionProcess.trait,
          communicationStyle: traitResults.communicationStyle.trait,
          focusOrientation: traitResults.focusOrientation.trait
        }
      })

      // Get user profile for linking (if user is authenticated)
      let userProfile = null
      if (session.clerkUserId) {
        userProfile = await prisma.userProfile.findUnique({
          where: { clerkUserId: session.clerkUserId }
        })

        // Create profile if it doesn't exist
        if (!userProfile) {
          const baseSlug = session.clerkUserId.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20)
          let slug = baseSlug
          let counter = 1

          // Check for slug uniqueness
          while (true) {
            const existingSlug = await prisma.userProfile.findUnique({
              where: { slug }
            })

            if (!existingSlug) break

            slug = `${baseSlug}-${counter}`
            counter++
          }

          userProfile = await prisma.userProfile.create({
            data: {
              clerkUserId: session.clerkUserId,
              email: "",
              slug,
              displayName: "",
              onboardingComplete: false,
            }
          })
        }
      }

      // Check if result already exists for this session
      const existingResult = await prisma.quizResult.findFirst({
        where: { sessionId }
      })

      // Create or update result
      const result = existingResult 
        ? await prisma.quizResult.update({
            where: { id: existingResult.id },
            data: {
              userProfileId: userProfile?.id,
              personalityTypeId: personalityType?.id,
              personalityCode,
              sectionScores,
              traitScores: traitResults,
              confidence,
              overallFitScore: overallFit,
              calculatedAt: new Date(),
            },
            include: {
              personalityType: true
            }
          })
        : await prisma.quizResult.create({
            data: {
              sessionId,
              userProfileId: userProfile?.id,
              personalityTypeId: personalityType?.id,
              personalityCode,
              sectionScores,
              traitScores: traitResults,
              confidence,
              overallFitScore: overallFit,
            },
            include: {
              personalityType: true
            }
          })

      // Update user-result mapping for reliable lookups
      if (session.clerkUserId) {
        await prisma.userQuizResult.upsert({
          where: { clerkUserId: session.clerkUserId },
          update: {
            latestResultId: result.id,
          },
          create: {
            clerkUserId: session.clerkUserId,
            latestResultId: result.id,
          },
        })
      }

      return {
        resultId: result.id,
        scores: sectionScores,
        traits: traitResults,
        personalityType: result.personalityType,
        personalityCode,
        confidence,
        overallFit,
        sessionId,
        calculatedAt: result.calculatedAt
      }
    },
  }
}