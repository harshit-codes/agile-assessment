import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { GradientText } from "@/components/ui/GradientText";
import { HeroText, BodyText, Caption } from "@/components/ui/Typography";
import { RainbowButton } from "@/components/magicui/rainbow-button";

interface HeroSectionProps {
  onStartAssessment?: () => void;
}

export default function HeroSection({ onStartAssessment }: HeroSectionProps) {
  const { isSignedIn, isLoaded } = useUser();
  
  // Don't render auth-dependent content until loaded
  if (!isLoaded) {
    return (
      <div className="text-center">
        <div className="mb-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="text-center" suppressHydrationWarning={true}>
      <div className="mb-16" suppressHydrationWarning={true}>
        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-card/50 border border-border text-foreground text-caption font-medium mb-8 animate-fade-in" suppressHydrationWarning={true}>
          ✨ Discover Your Agile DNA
        </div>
        
        <HeroText className="mb-6 animate-slide-up animate-delay-100">
          <span style={{color: 'var(--text-primary)'}}>Find Your Perfect</span>
          <div className="block mt-2">
            <GradientText
              colors={["#f5c842", "#f7d068", "#ffd700", "#ffed4a", "#f5c842"]}
              animate={true}
              speed="slow"
            >
              Agile Role
            </GradientText>
          </div>
        </HeroText>
        
        <BodyText size="large" variant="secondary" className="max-w-3xl mx-auto mb-12 animate-fade-in animate-delay-300">
          A comprehensive assessment that analyzes your behavioral style across 4 core dimensions 
          to reveal one of 16 unique Agile personalities and your ideal team role.
        </BodyText>

        {/* CTA Section */}
        <div className="animate-slide-up animate-delay-500" suppressHydrationWarning={true}>
          {isSignedIn ? (
            <div className="space-y-4" suppressHydrationWarning={true}>
              <Button 
                size="lg" 
                className="text-button px-8 py-4 h-auto group transition-all duration-300"
                onClick={onStartAssessment}
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <div className="flex justify-center" suppressHydrationWarning={true}>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                      userButtonPopoverCard: "bg-background border border-border",
                      userButtonPopoverActions: "bg-background"
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <SignInButton mode="modal">
              <RainbowButton size="lg" className="text-base group transition-all duration-300">
                Take the Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </RainbowButton>
            </SignInButton>
          )}
          <div className="flex items-center justify-center space-x-6 text-caption mt-6">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>8 minutes</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground opacity-50" />
            <span>32 Questions</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground opacity-50" />
            <span>16 Personalities</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground opacity-50" />
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}