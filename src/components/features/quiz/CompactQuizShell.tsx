"use client";

import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { BodyText } from "@/components/ui/Typography";
import { useGraphQLQuiz } from "@/hooks/useGraphQLQuiz";
import HeaderSection from "@/components/header/HeaderSection";
import CompactQuestionSection from "./CompactQuestionSection";
import OnboardingQuestionSection from "./OnboardingQuestionSection";
import UnifiedProgressBar from "./UnifiedProgressBar";

interface CompactQuizShellProps {
  quiz: any; // Using GraphQL quiz structure
  quizState?: ReturnType<typeof useGraphQLQuiz>;
}

export default function CompactQuizShell({ quiz, quizState }: CompactQuizShellProps) {
  const hookState = useGraphQLQuiz();
  const state = quizState || hookState;
  
  
  const {
    currentSectionIndex,
    currentSection,
    answers,
    overallProgress,
    sectionProgress,
    visitedSections,
    handleAnswerChange,
    goToNextSection,
    goToPreviousSection,
    completeQuiz,
    navigateToSection,
    onboardingData,
    setOnboardingData,
    isOnboardingValid,
    setIsOnboardingValid
  } = state;

  // Calculate section completion data for milestones
  const sectionCompletionData = quiz.sections.reduce((acc: any, section: any, index: number) => {
    const answeredCount = section.statements.filter((stmt: any) => answers[stmt.id] !== undefined).length;
    const totalCount = section.statements.length;
    const percentage = (answeredCount / totalCount) * 100;
    const isComplete = answeredCount === totalCount;
    
    acc[index] = {
      isComplete,
      percentage
    };
    
    
    return acc;
  }, {} as { [key: number]: { isComplete: boolean; percentage: number } });

  if (!quiz.sections || quiz.sections.length === 0) {
    return (
      <StandardCard variant="elevated" className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <BodyText variant="muted">No quiz sections available.</BodyText>
        </CardContent>
      </StandardCard>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderSection />
      

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Only show progress bar for quiz sections, not onboarding */}
          {currentSectionIndex >= 0 && (
            <UnifiedProgressBar
              sections={quiz.sections.map((section: any) => ({ id: section.id, title: section.title }))}
              currentSectionIndex={currentSectionIndex}
              overallProgress={overallProgress}
              sectionProgress={sectionCompletionData}
              visitedSections={visitedSections}
              onSectionClick={navigateToSection}
            />
          )}

          {/* Questions Section */}
          <div className="mt-6 sm:mt-8">
            {currentSectionIndex === -1 ? (
              /* Onboarding Section */
              <OnboardingQuestionSection
                onboardingData={onboardingData}
                onDataChange={setOnboardingData}
                onValidationChange={setIsOnboardingValid}
              />
            ) : currentSection ? (
              /* Quiz Section */
              <CompactQuestionSection
                section={currentSection}
                sectionIndex={currentSectionIndex}
                totalSections={quiz.sections.length}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                sectionProgress={sectionProgress}
              />
            ) : null}
          </div>

          {/* Navigation */}
          <div className="mt-8 px-2 sm:px-0">
            <div className="flex items-center justify-between pt-6 border-t border-border/20">
              <button
                onClick={goToPreviousSection}
                disabled={currentSectionIndex === -1}
                className="min-h-11 px-4 py-2 sm:py-3 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentSectionIndex === 0 ? "Onboarding" : "Previous"}
              </button>
              
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                {currentSectionIndex === -1 ? (
                  <span>Complete your profile</span>
                ) : (
                  <span>{sectionProgress.answered}/{sectionProgress.total} answered</span>
                )}
              </div>
              
              {currentSectionIndex === -1 ? (
                <button
                  onClick={goToNextSection}
                  disabled={!isOnboardingValid}
                  className="min-h-11 px-4 py-2 sm:py-3 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              ) : currentSectionIndex === quiz.sections.length - 1 ? (
                <button
                  onClick={completeQuiz}
                  disabled={overallProgress.percentage !== 100}
                  className="min-h-11 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Complete Quiz
                </button>
              ) : (
                <button
                  onClick={goToNextSection}
                  disabled={!sectionProgress.isComplete}
                  className="min-h-11 px-4 py-2 sm:py-3 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}