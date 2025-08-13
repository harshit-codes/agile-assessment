"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface SectionResults {
  [sectionId: string]: {
    title: string;
    score: number;
    trait: string;
    label: string;
  };
}

export function useConvexQuiz(retakeFromSessionId?: Id<"quizSessions"> | null) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [sessionId, setSessionId] = useState<Id<"quizSessions"> | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1); // Start with onboarding (step -1)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [sectionResults, setSectionResults] = useState<SectionResults>({});
  const [visitedSections, setVisitedSections] = useState<Set<number>>(new Set([-1])); // Include onboarding in visited
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrefilling, setIsPrefilling] = useState(!!retakeFromSessionId);

  // Onboarding state
  const [onboardingData, setOnboardingData] = useState<{
    whatsapp?: string;
    linkedinUrl?: string;
    currentRole?: string;
  }>({
    whatsapp: '',
    linkedinUrl: '',
    currentRole: ''
  });
  const [isOnboardingValid, setIsOnboardingValid] = useState(true); // All fields are optional

  // Reset to onboarding when retaking
  useEffect(() => {
    if (retakeFromSessionId) {
      setCurrentSectionIndex(-1); // Start with onboarding for retakes too
      setVisitedSections(new Set([-1]));
      setShowResults(false);
      setSectionResults({});
    }
  }, [retakeFromSessionId]);

  // Convex hooks
  const quiz = useQuery(api.quiz.getQuiz, {});
  const startSession = useMutation(api.quiz.startQuizSession);
  const submitResponse = useMutation(api.quiz.submitResponse);
  const completeSession = useMutation(api.quiz.completeQuizSession);
  const calculateResult = useMutation(api.scoring.calculateAssessmentResult);
  const responses = useQuery(api.quiz.getSessionResponses, sessionId ? { sessionId } : "skip");
  const result = useQuery(api.quiz.getQuizResult, sessionId ? { sessionId } : "skip");
  
  // Query for prefill responses when retaking - no auth requirement
  const prefillResponses = useQuery(
    api.quiz.getSessionResponsesForRetake,
    retakeFromSessionId && quiz?.id ? { 
      originalSessionId: retakeFromSessionId, 
      currentQuizId: quiz.id 
    } : "skip"
  );

  // Query for prefill onboarding data when retaking
  const prefillOnboardingData = useQuery(
    api.quiz.getOnboardingDataForRetake,
    retakeFromSessionId ? { 
      originalSessionId: retakeFromSessionId
    } : "skip"
  );



  // Add timeout for quiz loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!quiz && !error) {
        setError("Failed to connect to quiz database. This might be due to network issues or ad blockers. Please check your internet connection and try refreshing the page.");
      }
    }, 10000);

    if (quiz) {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [quiz, error]);

  const currentSection = quiz?.sections[currentSectionIndex];

  // Initialize quiz session on mount
  useEffect(() => {
    if (quiz && !sessionId) {
      initializeSession();
    }
  }, [quiz]);

  // Handle prefill responses and onboarding data when retaking (runs once)
  useEffect(() => {
    if (retakeFromSessionId) {
      let hasQuizData = false;
      let hasOnboardingData = false;
      
      // Handle quiz responses prefilling
      if (prefillResponses) {
        const answersMap: Record<string, number> = {};
        prefillResponses.forEach(response => {
          // Check both possible property names (responseValue from schema, value from server logs)
          const value = response.responseValue ?? (response as any).value;
          
          if (value !== undefined) {
            answersMap[response.questionId] = value;
          }
        });
        
        setAnswers(answersMap);
        hasQuizData = true;
      } else if (prefillResponses !== undefined) {
        hasQuizData = true; // Empty array is still resolved
      }

      // Handle onboarding data prefilling
      if (prefillOnboardingData) {
        setOnboardingData({
          whatsapp: prefillOnboardingData.whatsapp || '',
          linkedinUrl: prefillOnboardingData.linkedinUrl || '',
          currentRole: prefillOnboardingData.currentRole || ''
        });
        hasOnboardingData = true;
      } else if (prefillOnboardingData !== undefined) {
        hasOnboardingData = true; // null is still resolved
      }

      // Mark prefilling as complete when both queries have resolved
      if (hasQuizData && hasOnboardingData) {
        setIsPrefilling(false);
      }
    }
  }, [retakeFromSessionId, prefillResponses, prefillOnboardingData]);

  // Load responses from current session (normal flow only - not during retake)
  useEffect(() => {
    // Only load current session responses if NOT retaking
    if (!retakeFromSessionId && responses && responses.length > 0) {
      const answersMap: Record<string, number> = {};
      responses.forEach(response => {
        answersMap[response.questionId] = response.responseValue;
      });
      
      setAnswers(answersMap);
    }
  }, [responses, retakeFromSessionId]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const session = await startSession({
        quizTitle: "The Agile Assessment",
        ipAddress: undefined, // Could add client IP detection
        userAgent: navigator.userAgent,
        // CRITICAL: Pass Clerk user ID if authenticated to ensure proper linking
        clerkUserId: isSignedIn && isLoaded && user?.id ? user.id : undefined,
      });
      setSessionId(session.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start quiz session");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate comprehensive progress across all sections
  const overallProgress = useMemo(() => {
    if (!quiz) return { totalQuestions: 0, answeredQuestions: 0, percentage: 0 };

    let totalQuestions = 0;
    let answeredQuestions = 0;

    quiz.sections.forEach(section => {
      totalQuestions += section.statements.length;
      section.statements.forEach(statement => {
        if (answers[statement.id] !== undefined) {
          answeredQuestions++;
        }
      });
    });

    return {
      totalQuestions,
      answeredQuestions,
      percentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
    };
  }, [answers, quiz?.sections]);

  // Calculate section progress
  const sectionProgress = useMemo(() => {
    if (!currentSection) return { answered: 0, total: 0, percentage: 0, isComplete: false };
    
    const answeredCount = currentSection.statements.filter(stmt => answers[stmt.id] !== undefined).length;
    const totalCount = currentSection.statements.length;
    const percentage = (answeredCount / totalCount) * 100;
    
    return {
      answered: answeredCount,
      total: totalCount,
      percentage,
      isComplete: answeredCount === totalCount
    };
  }, [currentSection, answers]);

  const handleAnswerChange = async (statementId: string, value: number) => {
    if (!sessionId) {
      setError("No active session. Please refresh the page.");
      return;
    }

    try {
      setError(null);
      
      // Update local state immediately for responsive UI
      setAnswers(prev => ({
        ...prev,
        [statementId]: value
      }));

      // Submit to Convex
      await submitResponse({
        sessionId,
        questionId: statementId as Id<"questions">,
        responseValue: value,
      });
    } catch (err) {
      // Revert local state on error
      setAnswers(prev => {
        const { [statementId]: removed, ...rest } = prev;
        return rest;
      });
      setError(err instanceof Error ? err.message : "Failed to save response");
    }
  };

  const calculateSectionResults = () => {
    if (!quiz) return;

    const results: SectionResults = {};
    
    quiz.sections.forEach(section => {
      let totalScore = 0;
      let answeredCount = 0;
      
      section.statements.forEach(statement => {
        const answer = answers[statement.id];
        if (answer !== undefined) {
          // Apply reverse scoring if needed
          let adjustedScore = answer;
          if (statement.isReversed) {
            adjustedScore = -answer;
          }
          totalScore += adjustedScore;
          answeredCount++;
        }
      });
      
      const averageScore = answeredCount > 0 ? totalScore / answeredCount : 0;
      
      // Map section IDs to trait results  
      let trait = '';
      let label = '';
      
      switch (section.id) {
        case 'work-style':
          trait = averageScore >= 0 ? 'structured' : 'dynamic';
          label = averageScore >= 0 ? 'Structured & Organized' : 'Dynamic & Adaptable';
          break;
        case 'decision-process':
          trait = averageScore >= 0 ? 'evidence-based' : 'intuitive';
          label = averageScore >= 0 ? 'Evidence-Based & Analytical' : 'Intuitive & Experience-Based';
          break;
        case 'communication-style':
          trait = averageScore >= 0 ? 'direct' : 'harmonizing';
          label = averageScore >= 0 ? 'Direct & Straightforward' : 'Harmonizing & Diplomatic';
          break;
        case 'focus-orientation':
          trait = averageScore >= 0 ? 'visionary' : 'people-centered';
          label = averageScore >= 0 ? 'Visionary & Strategic' : 'People-Centered & Supportive';
          break;
      }
      
      results[section.id] = {
        title: section.title,
        score: averageScore,
        trait,
        label
      };
    });
    
    setSectionResults(results);
  };

  const navigateToSection = async (sectionIndex: number) => {
    // Handle onboarding completion when moving from -1 to 0
    if (currentSectionIndex === -1 && sectionIndex === 0) {
      try {
        await handleOnboardingComplete();
      } catch (error) {
        // Error is already logged and set in handleOnboardingComplete
        return; // Don't navigate if onboarding save fails
      }
    }
    
    if (sectionIndex >= 0) {
      calculateSectionResults();
    }
    setCurrentSectionIndex(sectionIndex);
    setVisitedSections(prev => new Set(prev).add(sectionIndex));
  };

  const goToNextSection = async () => {
    if (currentSectionIndex === -1) {
      // Moving from onboarding to first quiz section
      await navigateToSection(0);
    } else if (quiz && currentSectionIndex < quiz.sections.length - 1) {
      await navigateToSection(currentSectionIndex + 1);
    }
  };

  const goToPreviousSection = async () => {
    if (currentSectionIndex === 0) {
      // Go back to onboarding from first section
      await navigateToSection(-1);
    } else if (currentSectionIndex > 0) {
      await navigateToSection(currentSectionIndex - 1);
    }
  };

  const completeQuiz = async () => {
    if (!sessionId) {
      setError("No active session. Please refresh the page.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Complete session
      await completeSession({ sessionId });

      // Calculate results - this will save to database
      const calculationResult = await calculateResult({ sessionId });
      
      if (calculationResult) {
        calculateSectionResults();
        setShowResults(true);
      } else {
        throw new Error("Failed to calculate results");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setSessionId(null);
    setCurrentSectionIndex(-1); // Reset to onboarding
    setAnswers({});
    setShowResults(false);
    setSectionResults({});
    setVisitedSections(new Set([-1]));
    setError(null);
    setOnboardingData({ whatsapp: '', linkedinUrl: '', currentRole: '' });
  };

  const saveContactInfo = useMutation(api.quiz.saveContactInfo);

  const handleSaveContactInfo = async (email?: string, name?: string) => {
    if (!sessionId) {
      setError("No active session");
      return;
    }

    try {
      await saveContactInfo({
        sessionId,
        email,
        name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact info");
    }
  };

  // Import the onboarding mutation
  const updateOnboardingData = useMutation(api.userProfiles.updateOnboardingData);

  const handleOnboardingComplete = async () => {
    if (!user?.id) {
      console.warn('User not authenticated, skipping onboarding completion');
      return;
    }
    
    try {
      console.log('Saving onboarding data:', onboardingData);
      await updateOnboardingData({
        clerkUserId: user.id,
        onboardingData: {
          onboardingComplete: true,
          whatsapp: onboardingData.whatsapp?.trim() || undefined,
          linkedinUrl: onboardingData.linkedinUrl?.trim() || undefined,
          currentRole: onboardingData.currentRole?.trim() || undefined,
        },
      });
      console.log('Onboarding data saved successfully');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setError('Failed to save onboarding data. Please try again.');
      throw error; // Re-throw to prevent navigation if save fails
    }
  };

  const handleOnboardingDataChange = (data: { whatsapp?: string; linkedinUrl?: string; currentRole?: string; }) => {
    setOnboardingData(data);
  };

  return {
    // State
    quiz,
    sessionId,
    currentSectionIndex,
    currentSection: currentSectionIndex >= 0 ? quiz?.sections[currentSectionIndex] : null,
    answers,
    showResults,
    sectionResults,
    assessmentResult: result,
    visitedSections,
    isLoading: isLoading || isPrefilling,
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
  };
}