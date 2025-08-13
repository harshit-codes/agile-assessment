import { memo } from "react";
import { CheckCircle, Minus, Circle } from "lucide-react";
import { Caption } from "@/components/ui/Typography";

interface MilestoneProgressBarProps {
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

const MilestoneProgressBar = memo(function MilestoneProgressBar({
  sections,
  currentSectionIndex,
  overallProgress,
  sectionProgress = {},
  visitedSections = new Set(),
  onSectionClick
}: MilestoneProgressBarProps) {
  
  const calculateSectionPosition = (index: number) => {
    return (index / (sections.length - 1)) * 100;
  };

  return (
    <div className="w-full">
      {/* Modern Progress Bar with top padding for labels */}
      <div className="relative px-2 pt-12">
        {/* Subtle Background Track */}
        <div 
          className="w-full rounded-full overflow-hidden backdrop-blur-sm"
          style={{ 
            height: '1.5px',
            backgroundColor: 'hsl(var(--muted) / 0.3)',
            boxShadow: 'inset 0 1px 2px hsl(var(--muted) / 0.2)'
          }}
        >
          {/* Elegant Progress Fill */}
          <div 
            className="h-full rounded-full relative overflow-hidden"
            style={{ 
              width: `${overallProgress.percentage}%`,
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
              boxShadow: '0 0 6px hsl(var(--primary) / 0.4)',
              transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'translate3d(0, 0, 0)',
              willChange: 'width'
            }}
          >
            {/* Subtle shimmer effect */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                animation: overallProgress.percentage > 0 ? 'shimmer 2s ease-in-out infinite' : 'none'
              }}
            />
          </div>
        </div>

        {/* Milestone Markers */}
        <div className="absolute inset-0 flex items-center">
          {sections.map((section, index) => {
            const position = calculateSectionPosition(index);
            const isCompleted = sectionProgress[index]?.isComplete;
            const isCurrent = index === currentSectionIndex;
            const isVisited = visitedSections.has(index);
            const isIncomplete = isVisited && !isCompleted && !isCurrent;
            const isNotVisited = !isVisited && !isCurrent;
            
            // Determine milestone state
            let milestoneState: 'completed' | 'current' | 'incomplete' | 'not-visited';
            if (isCompleted) milestoneState = 'completed';
            else if (isCurrent) milestoneState = 'current';
            else if (isIncomplete) milestoneState = 'incomplete';
            else milestoneState = 'not-visited';
            
            return (
              <div
                key={section.id}
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${position}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Enhanced Interactive Milestone Circle */}
                <button
                  onClick={() => onSectionClick?.(index)}
                  disabled={!onSectionClick}
                  className={`relative z-10 flex items-center justify-center rounded-full border transition-all duration-500 ease-out ${
                    onSectionClick ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                  }`}
                  style={{
                    width: isCurrent ? '18px' : '14px',
                    height: isCurrent ? '18px' : '14px',
                    backgroundColor: 
                      milestoneState === 'completed' ? 'hsl(var(--success))' :
                      milestoneState === 'current' ? 'hsl(var(--primary))' :
                      milestoneState === 'incomplete' ? 'hsl(var(--destructive))' :
                      'hsl(var(--background))',
                    borderColor: 
                      milestoneState === 'completed' ? 'hsl(var(--success))' :
                      milestoneState === 'current' ? 'hsl(var(--primary))' :
                      milestoneState === 'incomplete' ? 'hsl(var(--destructive))' :
                      'hsl(var(--border) / 0.5)',
                    borderWidth: isCurrent ? '2px' : '1px',
                    boxShadow: 
                      isCurrent ? '0 0 12px hsl(var(--primary) / 0.4), 0 2px 4px hsl(var(--primary) / 0.2)' :
                      milestoneState === 'completed' ? '0 0 6px hsl(var(--success) / 0.3)' :
                      milestoneState === 'incomplete' ? '0 0 6px hsl(var(--destructive) / 0.3)' :
                      '0 1px 2px hsl(var(--muted) / 0.2)',
                    transform: 'translate3d(0, 0, 0)',
                    animation: isCurrent ? 'gentle-pulse 2s ease-in-out infinite' : 'none'
                  }}
                  title={`${section.title} - ${
                    milestoneState === 'completed' ? 'Completed' :
                    milestoneState === 'current' ? 'Current Section' :
                    milestoneState === 'incomplete' ? 'Incomplete' :
                    'Not Started'
                  }`}
                >
                  {milestoneState === 'completed' && (
                    <CheckCircle 
                      className="text-white animate-in zoom-in-50 duration-300" 
                      style={{ 
                        width: '10px', 
                        height: '10px',
                        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
                      }}
                    />
                  )}
                  {milestoneState === 'incomplete' && (
                    <Minus 
                      className="text-white animate-in zoom-in-50 duration-300" 
                      style={{ 
                        width: '8px', 
                        height: '8px',
                        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
                      }}
                    />
                  )}
                  {milestoneState === 'not-visited' && (
                    <Circle 
                      className="text-muted animate-in zoom-in-50 duration-300" 
                      style={{ 
                        width: '6px', 
                        height: '6px',
                        opacity: 0.7
                      }}
                    />
                  )}
                </button>

                {/* Progressive Section Labels - Above Bar - Clickable */}
                <button
                  onClick={() => onSectionClick?.(index)}
                  disabled={!onSectionClick}
                  className={`absolute hidden sm:block min-w-max ${
                    onSectionClick ? 'cursor-pointer hover:scale-105' : 'cursor-default pointer-events-none'
                  }`}
                  style={{
                    top: '-36px',
                    opacity: isCurrent ? 1 : 0.7,
                    transform: `scale(${isCurrent ? 1.02 : 0.98})`,
                    transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  title={`Click to navigate to ${section.title} - ${
                    milestoneState === 'completed' ? 'Completed' :
                    milestoneState === 'current' ? 'Current Section' :
                    milestoneState === 'incomplete' ? 'Incomplete' :
                    'Not Started'
                  }`}
                >
                  <Caption 
                    variant={
                      milestoneState === 'current' ? "primary" :
                      milestoneState === 'completed' ? "secondary" :
                      milestoneState === 'incomplete' ? "secondary" :
                      "muted"
                    } 
                    className="text-xs text-center font-medium leading-tight"
                    style={{
                      letterSpacing: '0.025em',
                      textShadow: isCurrent ? '0 1px 2px hsl(var(--primary) / 0.1)' : 'none'
                    }}
                  >
                    {section.title}
                  </Caption>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Mobile Section Indicator */}
      <div className="sm:hidden text-center px-1 mt-3">
        <div className="bg-primary/10 rounded-full px-3 py-1 inline-block">
          <span className="text-sm font-semibold text-primary">
            SECTION {currentSectionIndex + 1} OF {sections.length}
          </span>
        </div>
        <div className="mt-1">
          <span className="text-sm font-medium text-foreground">
            {sections[currentSectionIndex]?.title}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate3d(0, 0, 0) scale(1.05);
            opacity: 0.95;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
});

export default MilestoneProgressBar;