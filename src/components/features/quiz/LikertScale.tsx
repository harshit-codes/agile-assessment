import { memo } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Caption } from "@/components/ui/Typography";

interface LikertOption {
  value: number;
  label: string;
  emoji: string;
  intensity: string;
}

interface LikertScaleProps {
  statementId: string;
  currentAnswer?: number;
  onAnswerChange: (statementId: string, value: number) => void;
}

const likertOptions: LikertOption[] = [
  { 
    value: -2, 
    label: "Strongly Disagree", 
    emoji: "😤",
    intensity: "very-negative"
  },
  { 
    value: -1, 
    label: "Disagree", 
    emoji: "😕",
    intensity: "negative"
  },
  { 
    value: 0, 
    label: "Neutral", 
    emoji: "😐",
    intensity: "neutral"
  },
  { 
    value: 1, 
    label: "Agree", 
    emoji: "😊",
    intensity: "positive"
  },
  { 
    value: 2, 
    label: "Strongly Agree", 
    emoji: "😍",
    intensity: "very-positive"
  }
];

const LikertScale = memo(function LikertScale({
  statementId,
  currentAnswer,
  onAnswerChange
}: LikertScaleProps) {
  
  // Get current selection label
  const getCurrentLabel = () => {
    if (currentAnswer === undefined) return "Unanswered";
    const selectedOption = likertOptions.find(option => option.value === currentAnswer);
    return selectedOption?.label || "Unanswered";
  };
  
  const getCircleStyle = (option: LikertOption, isSelected: boolean) => {
    if (isSelected) {
      return option.value >= 1.5 
        ? { 
            backgroundColor: 'hsl(var(--agree-strong))',
            borderColor: 'hsl(var(--agree-strong))',
            boxShadow: '0 0 20px hsl(var(--agree-strong) / 0.4)'
          }
        : option.value >= 0.5
        ? { 
            backgroundColor: 'hsl(var(--agree-light))',
            borderColor: 'hsl(var(--agree-light))',
            boxShadow: '0 0 15px hsl(var(--agree-light) / 0.3)'
          }
        : option.value === 0
        ? { 
            backgroundColor: 'hsl(var(--neutral))',
            borderColor: 'hsl(var(--neutral))',
            boxShadow: '0 0 12px hsl(var(--neutral) / 0.25)'
          }
        : option.value >= -0.5
        ? { 
            backgroundColor: 'hsl(var(--disagree-light))',
            borderColor: 'hsl(var(--disagree-light))',
            boxShadow: '0 0 15px hsl(var(--disagree-light) / 0.3)'
          }
        : { 
            backgroundColor: 'hsl(var(--disagree-strong))',
            borderColor: 'hsl(var(--disagree-strong))',
            boxShadow: '0 0 20px hsl(var(--disagree-strong) / 0.4)'
          };
    }
    
    // Unselected state
    const baseStyle = {
      backgroundColor: 'hsl(var(--card))',
      borderWidth: '2px',
      borderStyle: 'solid'
    };
    
    return option.value >= 1.5 
      ? { ...baseStyle, borderColor: 'hsl(var(--agree-strong) / 0.4)' }
      : option.value >= 0.5
      ? { ...baseStyle, borderColor: 'hsl(var(--agree-light) / 0.4)' }
      : option.value === 0
      ? { ...baseStyle, borderColor: 'hsl(var(--neutral) / 0.5)' }
      : option.value >= -0.5
      ? { ...baseStyle, borderColor: 'hsl(var(--disagree-light) / 0.4)' }
      : { ...baseStyle, borderColor: 'hsl(var(--disagree-strong) / 0.4)' };
  };

  const getSizeClass = (option: LikertOption) => {
    const absValue = Math.abs(option.value);
    if (absValue === 0) return 'w-8 h-8 sm:w-10 sm:h-10';
    if (absValue === 1) return 'w-9 h-9 sm:w-11 sm:h-11';
    return 'w-10 h-10 sm:w-12 sm:h-12';
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
      {/* Unified Circle Scale */}
      <div className="flex items-center justify-between sm:justify-center sm:space-x-4 md:space-x-6 lg:space-x-8">
        {likertOptions.map((option) => {
          const isSelected = currentAnswer === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onAnswerChange(statementId, option.value)}
              className={`likert-circle-button group relative transition-all duration-300 ${
                isSelected ? 'transform scale-110' : 'hover:scale-105'
              }`}
              data-value={option.value}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <div 
                className={`likert-circle ${getSizeClass(option)} rounded-full transition-all duration-300 flex items-center justify-center`} 
                style={getCircleStyle(option, isSelected)}
              />
            </button>
          );
        })}
      </div>
      
      {/* Dynamic Selection Label */}
      <div className="text-center mt-3">
        <Caption 
          className={`transition-colors duration-300 ${
            currentAnswer === undefined 
              ? 'text-muted-foreground' 
              : 'text-foreground font-medium'
          }`}
        >
          {getCurrentLabel()}
        </Caption>
      </div>
    </div>
  );
});

export default LikertScale;