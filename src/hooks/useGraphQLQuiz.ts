"use client"

import { useState, useMemo, useEffect } from "react"
import { useQuery, useMutation } from '@apollo/client'
import { useUser } from "@clerk/nextjs"
import {
  GET_QUIZ,
  GET_SESSION_RESPONSES,
  GET_SESSION_RESPONSES_FOR_RETAKE,
  GET_ONBOARDING_DATA_FOR_RETAKE,
  GET_QUIZ_RESULT,
  START_QUIZ_SESSION,
  SUBMIT_RESPONSE,
  COMPLETE_QUIZ_SESSION,
  CALCULATE_ASSESSMENT_RESULT,
  UPDATE_ONBOARDING_DATA,
  SAVE_CONTACT_INFO
} from "../lib/graphql/operations"

interface SectionResults {
  [sectionId: string]: {
    title: string
    score: number
    trait: string
    label: string
  }
}

export function useGraphQLQuiz(retakeFromSessionId?: string | null) {
  console.log("🔍 Quiz - 1a. useGraphQLQuiz hook called")
  console.log("🔍 Quiz - 1b. retakeFromSessionId:", retakeFromSessionId)
  
  const { isSignedIn, isLoaded, user } = useUser()
  console.log("🔍 Quiz - 1c. Clerk user state:", { isSignedIn, isLoaded, userId: user?.id })
  
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1) // Start with onboarding (step -1)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [sectionResults, setSectionResults] = useState<SectionResults>({})
  const [visitedSections, setVisitedSections] = useState<Set<number>>(new Set([-1])) // Include onboarding in visited
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPrefilling, setIsPrefilling] = useState(!!retakeFromSessionId)

  // Onboarding state
  const [onboardingData, setOnboardingData] = useState<{
    whatsapp?: string
    linkedinUrl?: string
    currentRole?: string
  }>({
    whatsapp: '',
    linkedinUrl: '',
    currentRole: ''
  })
  const [isOnboardingValid, setIsOnboardingValid] = useState(true) // All fields are optional

  // Reset to onboarding when retaking
  useEffect(() => {
    if (retakeFromSessionId) {
      setCurrentSectionIndex(-1) // Start with onboarding for retakes too
      setVisitedSections(new Set([-1]))
      setShowResults(false)
      setSectionResults({})
    }
  }, [retakeFromSessionId])

  // GraphQL hooks
  console.log("🔍 Quiz - 2a. Initializing GraphQL hooks...")
  
  const { data: quiz, loading: quizLoading, error: quizError } = useQuery(GET_QUIZ, {
    variables: {},
    errorPolicy: 'all'
  })

  const [startSession] = useMutation(START_QUIZ_SESSION)
  const [submitResponse] = useMutation(SUBMIT_RESPONSE)
  const [completeSession] = useMutation(COMPLETE_QUIZ_SESSION)
  const [calculateResult] = useMutation(CALCULATE_ASSESSMENT_RESULT)
  const [updateOnboardingDataMutation] = useMutation(UPDATE_ONBOARDING_DATA)
  const [saveContactInfoMutation] = useMutation(SAVE_CONTACT_INFO)

  const { data: responsesData } = useQuery(GET_SESSION_RESPONSES, {
    variables: { sessionId: sessionId || '' },
    skip: !sessionId,
    errorPolicy: 'all'
  })

  const { data: resultData, refetch: refetchResult } = useQuery(GET_QUIZ_RESULT, {
    variables: { sessionId: sessionId || '' },
    skip: !sessionId,
    errorPolicy: 'all'
  })

  // Query for prefill responses when retaking
  const { data: prefillResponsesData } = useQuery(GET_SESSION_RESPONSES_FOR_RETAKE, {
    variables: { 
      originalSessionId: retakeFromSessionId || '',
      currentQuizId: quiz?.getQuiz?.id || ''
    },
    skip: !retakeFromSessionId || !quiz?.getQuiz?.id,
    errorPolicy: 'all'
  })

  // Query for prefill onboarding data when retaking
  const { data: prefillOnboardingData } = useQuery(GET_ONBOARDING_DATA_FOR_RETAKE, {
    variables: { originalSessionId: retakeFromSessionId || '' },
    skip: !retakeFromSessionId,
    errorPolicy: 'all'
  })

  // Handle GraphQL errors
  useEffect(() => {
    if (quizError) {
      console.error("🔍 Quiz - GraphQL error:", quizError)
      setError("Failed to load quiz data. Please check your connection and try again.")
    }
  }, [quizError])

  // Enhanced timeout and loading debugging
  useEffect(() => {
    console.log("🔍 Quiz - 3a. Quiz loading timeout effect triggered")
    console.log("🔍 Quiz - 3b. Current quiz state:", quiz ? "loaded" : "loading")
    console.log("🔍 Quiz - 3c. Current error state:", error)
    
    const timeoutChecks = [
      setTimeout(() => {
        console.log("🔍 Quiz - 3d. 2-second check - Quiz:", quiz ? "loaded" : "still loading")
      }, 2000),
      
      setTimeout(() => {
        console.log("🔍 Quiz - 3e. 5-second check - Quiz:", quiz ? "loaded" : "still loading")
        if (!quiz && !quizLoading && !error) {
          console.warn("🔍 Quiz - 3f. Quiz not loaded after 5s - this may indicate an issue")
        }
      }, 5000),
      
      setTimeout(() => {
        if (!quiz && !quizLoading && !error) {
          console.error("🔍 Quiz - 3g. TIMEOUT: Quiz not loaded after 10s")
          console.error("🔍 Quiz - 3h. Final quiz state:", quiz)
          console.error("🔍 Quiz - 3i. GraphQL URL:", process.env.NEXT_PUBLIC_GRAPHQL_URL)
          console.error("🔍 Quiz - 3j. Error state:", error)
          setError("Failed to connect to quiz database. This might be due to network issues or ad blockers. Please check your internet connection and try refreshing the page.")
        }
      }, 10000)
    ]

    if (quiz) {
      console.log("🔍 Quiz - 3m. Quiz loaded successfully, clearing timeouts")
      timeoutChecks.forEach(clearTimeout)
    }

    return () => {
      console.log("🔍 Quiz - 3n. Cleaning up quiz loading timeouts")
      timeoutChecks.forEach(clearTimeout)
    }
  }, [quiz, quizLoading, error])

  const currentSection = quiz?.getQuiz?.sections?.[currentSectionIndex]

  // Initialize quiz session on mount
  useEffect(() => {
    if (quiz?.getQuiz && !sessionId) {
      initializeSession()
    }
  }, [quiz?.getQuiz])

  // Handle prefill responses and onboarding data when retaking
  useEffect(() => {
    if (retakeFromSessionId) {
      let hasQuizData = false
      let hasOnboardingData = false
      
      // Handle quiz responses prefilling
      if (prefillResponsesData?.getSessionResponsesForRetake) {
        const answersMap: Record<string, number> = {}
        prefillResponsesData.getSessionResponsesForRetake.forEach((response: any) => {
          answersMap[response.questionId] = response.responseValue
        })
        
        setAnswers(answersMap)
        hasQuizData = true
      } else if (prefillResponsesData !== undefined) {
        hasQuizData = true // Empty array is still resolved
      }

      // Handle onboarding data prefilling
      if (prefillOnboardingData?.getOnboardingDataForRetake) {
        setOnboardingData({
          whatsapp: prefillOnboardingData.getOnboardingDataForRetake.whatsapp || '',
          linkedinUrl: prefillOnboardingData.getOnboardingDataForRetake.linkedinUrl || '',
          currentRole: prefillOnboardingData.getOnboardingDataForRetake.currentRole || ''
        })
        hasOnboardingData = true
      } else if (prefillOnboardingData !== undefined) {
        hasOnboardingData = true // null is still resolved
      }

      // Mark prefilling as complete when both queries have resolved
      if (hasQuizData && hasOnboardingData) {
        setIsPrefilling(false)
      }
    }
  }, [retakeFromSessionId, prefillResponsesData, prefillOnboardingData])

  // Load responses from current session
  useEffect(() => {
    if (!retakeFromSessionId && responsesData?.getSessionResponses?.length > 0) {
      const answersMap: Record<string, number> = {}
      responsesData.getSessionResponses.forEach((response: any) => {
        answersMap[response.questionId] = response.responseValue
      })
      
      setAnswers(answersMap)
    }
  }, [responsesData, retakeFromSessionId])

  const initializeSession = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await startSession({
        variables: {
          input: {
            quizTitle: "The Agile Assessment",
            ipAddress: undefined,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            clerkUserId: isSignedIn && isLoaded && user?.id ? user.id : undefined,
          }
        }
      })
      setSessionId(result.data?.startQuizSession?.sessionId)
    } catch (err: any) {
      setError(err.message || "Failed to start quiz session")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate comprehensive progress across all sections
  const overallProgress = useMemo(() => {
    if (!quiz?.getQuiz) return { totalQuestions: 0, answeredQuestions: 0, percentage: 0 }

    let totalQuestions = 0
    let answeredQuestions = 0

    quiz.getQuiz.sections.forEach((section: any) => {
      totalQuestions += section.statements.length
      section.statements.forEach((statement: any) => {
        if (answers[statement.id] !== undefined) {
          answeredQuestions++
        }
      })
    })

    return {
      totalQuestions,
      answeredQuestions,
      percentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
    }
  }, [answers, quiz?.getQuiz?.sections])

  // Calculate section progress
  const sectionProgress = useMemo(() => {
    if (!currentSection) return { answered: 0, total: 0, percentage: 0, isComplete: false }
    
    const answeredCount = currentSection.statements.filter((stmt: any) => answers[stmt.id] !== undefined).length
    const totalCount = currentSection.statements.length
    const percentage = (answeredCount / totalCount) * 100
    
    return {
      answered: answeredCount,
      total: totalCount,
      percentage,
      isComplete: answeredCount === totalCount
    }
  }, [currentSection, answers])

  const handleAnswerChange = async (statementId: string, value: number) => {
    if (!sessionId) {
      setError("No active session. Please refresh the page.")
      return
    }

    try {
      setError(null)
      
      // Update local state immediately for responsive UI
      setAnswers(prev => ({
        ...prev,
        [statementId]: value
      }))

      // Submit to GraphQL
      await submitResponse({
        variables: {
          input: {
            sessionId,
            questionId: statementId,
            responseValue: value,
          }
        }
      })
    } catch (err: any) {
      // Revert local state on error
      setAnswers(prev => {
        const { [statementId]: removed, ...rest } = prev
        return rest
      })
      setError(err.message || "Failed to save response")
    }
  }

  const calculateSectionResults = () => {
    if (!quiz?.getQuiz) return

    const results: SectionResults = {}
    
    quiz.getQuiz.sections.forEach((section: any) => {
      let totalScore = 0
      let answeredCount = 0
      
      section.statements.forEach((statement: any) => {
        const answer = answers[statement.id]
        if (answer !== undefined) {
          // Apply reverse scoring if needed
          let adjustedScore = answer
          if (statement.isReversed) {
            adjustedScore = -answer
          }
          totalScore += adjustedScore
          answeredCount++
        }
      })
      
      const averageScore = answeredCount > 0 ? totalScore / answeredCount : 0
      
      // Map section IDs to trait results  
      let trait = ''
      let label = ''
      
      switch (section.id) {
        case 'work-style':
          trait = averageScore >= 0 ? 'structured' : 'dynamic'
          label = averageScore >= 0 ? 'Structured & Organized' : 'Dynamic & Adaptable'
          break
        case 'decision-process':
          trait = averageScore >= 0 ? 'evidence-based' : 'intuitive'
          label = averageScore >= 0 ? 'Evidence-Based & Analytical' : 'Intuitive & Experience-Based'
          break
        case 'communication-style':
          trait = averageScore >= 0 ? 'direct' : 'harmonizing'
          label = averageScore >= 0 ? 'Direct & Straightforward' : 'Harmonizing & Diplomatic'
          break
        case 'focus-orientation':
          trait = averageScore >= 0 ? 'visionary' : 'people-centered'
          label = averageScore >= 0 ? 'Visionary & Strategic' : 'People-Centered & Supportive'
          break
      }
      
      results[section.id] = {
        title: section.title,
        score: averageScore,
        trait,
        label
      }
    })
    
    setSectionResults(results)
  }

  const navigateToSection = async (sectionIndex: number) => {
    // Handle onboarding completion when moving from -1 to 0
    if (currentSectionIndex === -1 && sectionIndex === 0) {
      try {
        await handleOnboardingComplete()
      } catch (error) {
        return // Don't navigate if onboarding save fails
      }
    }
    
    if (sectionIndex >= 0) {
      calculateSectionResults()
    }
    setCurrentSectionIndex(sectionIndex)
    setVisitedSections(prev => new Set(prev).add(sectionIndex))
  }

  const goToNextSection = async () => {
    if (currentSectionIndex === -1) {
      await navigateToSection(0)
    } else if (quiz?.getQuiz && currentSectionIndex < quiz.getQuiz.sections.length - 1) {
      await navigateToSection(currentSectionIndex + 1)
    }
  }

  const goToPreviousSection = async () => {
    if (currentSectionIndex === 0) {
      await navigateToSection(-1)
    } else if (currentSectionIndex > 0) {
      await navigateToSection(currentSectionIndex - 1)
    }
  }

  const completeQuiz = async () => {
    if (!sessionId) {
      setError("No active session. Please refresh the page.")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Complete session
      await completeSession({ variables: { sessionId } })

      // Calculate results
      const calculationResult = await calculateResult({ variables: { sessionId } })
      
      if (calculationResult.data?.calculateAssessmentResult) {
        console.log("🎉 Quiz calculation completed successfully, setting showResults to true")
        calculateSectionResults()
        
        // Refetch the quiz result to ensure we have the latest data
        await refetchResult()
        
        setShowResults(true)
        console.log("🎉 showResults set to true, should show results now")
      } else {
        throw new Error("Failed to calculate results")
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const resetQuiz = () => {
    setSessionId(null)
    setCurrentSectionIndex(-1)
    setAnswers({})
    setShowResults(false)
    setSectionResults({})
    setVisitedSections(new Set([-1]))
    setError(null)
    setOnboardingData({ whatsapp: '', linkedinUrl: '', currentRole: '' })
  }

  const handleSaveContactInfo = async (email?: string, name?: string) => {
    if (!sessionId) {
      setError("No active session")
      return
    }

    try {
      await saveContactInfoMutation({
        variables: {
          input: {
            sessionId,
            email,
            name,
          }
        }
      })
    } catch (err: any) {
      setError(err.message || "Failed to save contact info")
    }
  }

  const handleOnboardingComplete = async () => {
    if (!user?.id) {
      console.warn('User not authenticated, skipping onboarding completion')
      return
    }
    
    try {
      console.log('Saving onboarding data:', onboardingData)
      await updateOnboardingDataMutation({
        variables: {
          input: {
            clerkUserId: user.id,
            onboardingData: {
              onboardingComplete: true,
              whatsapp: onboardingData.whatsapp?.trim() || undefined,
              linkedinUrl: onboardingData.linkedinUrl?.trim() || undefined,
              currentRole: onboardingData.currentRole?.trim() || undefined,
            },
          }
        }
      })
      console.log('Onboarding data saved successfully')
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error)
      setError('Failed to save onboarding data. Please try again.')
      throw error
    }
  }

  const handleOnboardingDataChange = (data: { whatsapp?: string; linkedinUrl?: string; currentRole?: string; }) => {
    setOnboardingData(data)
  }

  return {
    // State
    quiz: quiz?.getQuiz,
    sessionId,
    currentSectionIndex,
    currentSection: currentSectionIndex >= 0 ? quiz?.getQuiz?.sections?.[currentSectionIndex] : null,
    answers,
    showResults,
    sectionResults,
    assessmentResult: resultData?.getQuizResult,
    visitedSections,
    isLoading: isLoading || isPrefilling || quizLoading,
    error,
    
    // Onboarding state
    onboardingData,
    setOnboardingData: handleOnboardingDataChange,
    isOnboardingValid,
    setIsOnboardingValid,
    
    // Computed values
    overallProgress,
    sectionProgress,
    
    // Actions
    handleAnswerChange,
    goToNextSection,
    goToPreviousSection,
    completeQuiz,
    resetQuiz,
    navigateToSection,
    handleSaveContactInfo,
    
    // Quiz validation
    isComplete: overallProgress.percentage === 100,
    
    // Utilities
    clearError: () => setError(null),
  }
}