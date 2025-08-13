import { memo } from "react";
import { CheckCircle, Circle, Minus } from "lucide-react";
import { Caption } from "@/components/ui/Typography";
import ShinyText from "@/components/ui/ShinyText";

interface UnifiedProgressBarProps {
  sections: Array<{
    id: string;
    title: string;
  }>;
  currentSectionIndex: number;
  overallProgress: {
    percentage: number;
    answeredQuestions: number;
    totalQuestions: number;
  };
  sectionProgress?: {
    [sectionIndex: number]: {
      isComplete: boolean;
      percentage: number;
    };
  };
  visitedSections?: Set<number>;
  onSectionClick?: (sectionIndex: number) => void;
}

const UnifiedProgressBar = memo(function UnifiedProgressBar({
  sections,
  currentSectionIndex,
  overallProgress,
  sectionProgress = {},
  visitedSections = new Set(),
  onSectionClick
}: UnifiedProgressBarProps) {
  
  const getStepStatus = (index: number) => {
    const isCompleted = sectionProgress[index]?.isComplete;
    const isCurrent = index === currentSectionIndex;
    const isVisited = visitedSections.has(index);
    const isIncomplete = isVisited && !isCompleted && !isCurrent;
    
    // Debug logging
    console.log(`Section ${index}:`, {
      isCompleted,
      isCurrent,
      isVisited,
      sectionProgressData: sectionProgress[index]
    });
    
    // Show as completed if all questions are answered, even if it's the current section
    if (isCompleted) return 'completed';
    if (isCurrent && !isCompleted) return 'current';
    if (isIncomplete) return 'incomplete';
    return 'not-visited';
  };

  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success border-success text-white shadow-md';
      case 'current':
        return 'bg-primary border-primary text-white shadow-lg ring-2 ring-primary/20';
      case 'incomplete':
        return 'bg-destructive border-destructive text-white';
      default:
        return 'bg-background border-border text-muted-foreground';
    }
  };

  const calculatePosition = (index: number) => {
    return (index / (sections.length - 1)) * 100;
  };

  return (
    <div className="w-full px-2 sm:px-6">
      {/* Current Section Info */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-block px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mx-2">
          <span className="text-base sm:text-lg font-semibold text-primary">
            {sections[currentSectionIndex]?.title || "Loading..."}
          </span>
        </div>
      </div>

      {/* Progress Bar with Steps */}
      <div className="relative mb-6 sm:mb-8">
        {/* Background Track */}
        <div className="relative h-1 bg-border rounded-full">
          {/* Progress Fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="absolute inset-0 flex items-center justify-between">
          {sections.map((section, index) => {
            const status = getStepStatus(index);
            const position = calculatePosition(index);
            
            return (
              <div
                key={section.id}
                className="relative flex flex-col items-center"
                style={{ 
                  position: index === 0 || index === sections.length - 1 ? 'relative' : 'absolute',
                  left: index === 0 || index === sections.length - 1 ? 'auto' : `${position}%`,
                  transform: index === 0 || index === sections.length - 1 ? 'none' : 'translateX(-50%)'
                }}
              >
                {/* Step Circle */}
                <button
                  onClick={() => onSectionClick?.(index)}
                  disabled={!onSectionClick}
                  className={`
                    relative z-10 flex items-center justify-center rounded-full border-2 
                    transition-all duration-300 
                    w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold
                    ${getStepColors(status)}
                    ${onSectionClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                  title={`${section.title} - ${
                    status === 'completed' ? 'Completed' :
                    status === 'current' ? 'Current Section' :
                    status === 'incomplete' ? 'Incomplete' :
                    'Not Started'
                  }`}
                >
                  {status === 'completed' && (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  {status === 'incomplete' && (
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  {status === 'not-visited' && (
                    <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  {status === 'current' && (
                    <span>{index + 1}</span>
                  )}
                </button>

              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
        <span>{overallProgress.answeredQuestions} of {overallProgress.totalQuestions} answered</span>
        <span className="font-medium text-primary">{Math.round(overallProgress.percentage)}% complete</span>
      </div>
    </div>
  );
});

export default UnifiedProgressBar;