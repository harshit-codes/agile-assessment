import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { H2, BodyText } from "@/components/ui/Typography";

export default function CTASection() {
  return (
    <div className="text-center mb-16">
      <StandardCard variant="elevated" size="lg" className="max-w-2xl mx-auto animate-fade-in">
        <CardContent>
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl mb-6 animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <H2 className="mb-4">
              Join thousands of Agile professionals
            </H2>
            <BodyText variant="secondary">
              Discover your ideal role and accelerate your career in Agile teams with scientifically-backed insights.
            </BodyText>
          </div>
          
          <SignInButton mode="modal">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-slate-600 via-slate-500 to-slate-700 transition-all duration-500 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </SignInButton>
        </CardContent>
      </StandardCard>
    </div>
  );
}