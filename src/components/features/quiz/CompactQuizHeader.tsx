import { GradientText } from "@/components/ui/GradientText";

interface CompactQuizHeaderProps {
  quizTitle: string;
}

export default function CompactQuizHeader({ quizTitle }: CompactQuizHeaderProps) {
  return (
    <div className="bg-background border-b border-border/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Large Quiz Title */}
        <div className="text-center px-4 pt-6 pb-7 mx-2 overflow-visible">
          <GradientText
            colors={["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#6366f1"]}
            className="text-4xl sm:text-5xl md:text-6xl font-title font-bold"
            animate={true}
            speed="slow"
          >
            {quizTitle}
          </GradientText>
        </div>
      </div>
    </div>
  );
}