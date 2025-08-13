import { GradientText } from "@/components/ui/GradientText";

export default function AssessmentTitle() {
  return (
    <div className="text-center px-4 pt-6 pb-7 mx-2 overflow-visible relative z-20">
      <GradientText
        colors={["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#6366f1"]}
        className="text-4xl sm:text-5xl md:text-6xl major-mono-display-regular font-bold"
        animate={true}
        speed="slow"
      >
        The Agile Assessment
      </GradientText>
    </div>
  );
}