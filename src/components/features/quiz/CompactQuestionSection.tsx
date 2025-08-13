import { StandardCard } from "@/components/ui/StandardCard";
import { H3, BodyText } from "@/components/ui/Typography";
import LikertScale from "./LikertScale";

interface CompactQuestionSectionProps {
  section: any; // Using Convex section structure
  sectionIndex: number;
  totalSections: number;
  answers: Record<string, number>;
  onAnswerChange: (statementId: string, value: number) => void;
  sectionProgress: {
    answered: number;
    total: number;
    percentage: number;
    isComplete: boolean;
  };
}

export default function CompactQuestionSection({
  section,
  sectionIndex,
  totalSections,
  answers,
  onAnswerChange,
  sectionProgress
}: CompactQuestionSectionProps) {

  return (
    <div className="space-y-6">
      {/* Compact Questions */}
      <div className="space-y-4">
        {section.statements.map((statement: any, index: number) => {
          const isAnswered = answers[statement.id] !== undefined;
          const currentAnswer = answers[statement.id];
          
          return (
            <StandardCard
              key={statement.id}
              variant={isAnswered ? "filled" : "outlined"}
              size="sm"
              className={`transition-all duration-300 ${
                !isAnswered 
                  ? 'border-primary/30 hover:border-primary/50 transform scale-100' 
                  : 'border-success/20 bg-success/5 transform scale-95 opacity-85'
              }`}
            >
              <div className="space-y-4">
                {/* Centered Question Header */}
                <div className="text-center">
                  <BodyText className="font-medium leading-relaxed text-sm sm:text-base">
                    {statement.statement}
                  </BodyText>
                </div>
                
                {/* Likert Scale */}
                <div className="mt-4">
                  <LikertScale
                    statementId={statement.id}
                    currentAnswer={currentAnswer}
                    onAnswerChange={onAnswerChange}
                  />
                </div>
              </div>
            </StandardCard>
          );
        })}
      </div>
    </div>
  );
}