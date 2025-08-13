import CleanLandingPage from "@/components/features/landing/CleanLandingPage";

interface HeroSectionProps {
  onStartAssessment?: () => void;
}

export default function HeroSection({ onStartAssessment }: HeroSectionProps) {
  return (
    <div className="relative" suppressHydrationWarning={true}>
      <CleanLandingPage />
    </div>
  );
}