"use client";

import { ArrowRight, Calendar, RotateCcw, Share2 } from "lucide-react";
import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { H2, H3, BodyText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Link from "next/link";
import type { SectionProps } from "../utils/results.types";

interface EngagementSectionProps extends SectionProps {
  onRetakeAssessment: () => void;
  onShareModalOpen: () => void;
}

export default function EngagementSection({ 
  authState, 
  mode,
  onRetakeAssessment,
  onShareModalOpen
}: EngagementSectionProps) {
  const { isAuthenticated, isOwnResult, displayName } = authState;
  
  return (
    <StandardCard variant="elevated" size="lg" className="border-2 border-primary/20 shadow-lg">
      <CardContent className="space-y-8">
        <div className="text-center border-b border-border/30 pb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <H2 className="text-primary">Take Action</H2>
          </div>
          <BodyText variant="secondary" className="max-w-lg mx-auto">
            Ready to leverage your personality insights for career success?
          </BodyText>
        </div>
        
        {!isAuthenticated ? (
          // Unauthenticated: Create Account - Book a Call
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <H3>Unlock Your Full Potential</H3>
              <BodyText variant="secondary" className="max-w-lg mx-auto leading-relaxed">
                Join thousands of professionals who've accelerated their careers with personalized Agile coaching and career development.
              </BodyText>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/">
                <RainbowButton size="lg" className="w-full py-6 h-auto text-lg group transition-all duration-300 hover:scale-105">
                  <span className="flex items-center justify-center font-semibold">
                    Create Account & Take Assessment
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </RainbowButton>
              </Link>
              <a 
                href="https://calendly.com/aayush-agileacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full py-6 h-auto border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-lg" size="lg">
                  <span className="flex items-center justify-center font-medium">
                    <Calendar className="mr-3 h-6 w-6" />
                    Book Expert Consultation
                  </span>
                </Button>
              </a>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
              <BodyText size="small" variant="muted" className="text-center italic">
                💡 Pro tip: Users who book consultations are 3x more likely to land their ideal Agile role
              </BodyText>
            </div>
          </div>
        ) : isOwnResult ? (
          // Authenticated Own Results: Attempt - Share - Book a Call
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <H3>Continue Your Journey</H3>
              <BodyText variant="secondary" className="max-w-lg mx-auto leading-relaxed">
                Share your insights, explore different scenarios, or get expert guidance to maximize your career potential.
              </BodyText>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="py-4 h-auto border-2 border-muted-foreground/20 hover:border-primary hover:bg-primary/5 hover:text-foreground" 
                  size="lg"
                  onClick={onRetakeAssessment}
                >
                  <span className="flex items-center justify-center text-base">
                    <RotateCcw className="mr-3 h-5 w-5" />
                    Retake Assessment
                  </span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={onShareModalOpen}
                  className="py-4 h-auto border-2 border-muted-foreground/20 hover:border-primary hover:bg-primary/5 hover:text-foreground"
                  size="lg"
                >
                  <span className="flex items-center justify-center text-base">
                    <Share2 className="mr-3 h-5 w-5" />
                    Share Results
                  </span>
                </Button>
              </div>
              <a 
                href="https://calendly.com/aayush-agileacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block"
              >
                <RainbowButton size="lg" className="w-full py-6 h-auto text-lg group transition-all duration-300 hover:scale-105">
                  <span className="flex items-center justify-center font-semibold">
                    <Calendar className="mr-3 h-6 w-6" />
                    Book Career Consultation
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </RainbowButton>
              </a>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
              <BodyText size="small" className="text-center text-primary font-medium">
                🎯 Ready to level up? Our expert consultations have helped 500+ professionals advance their Agile careers
              </BodyText>
            </div>
          </div>
        ) : (
          // Authenticated Others' Results: Take Assessment - Book a Call
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <H3>Discover Your Personality Type</H3>
              <BodyText variant="secondary" className="max-w-lg mx-auto leading-relaxed">
                Take your own assessment to see how your Agile personality compares to {displayName}'s results and unlock your career potential.
              </BodyText>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/">
                <RainbowButton size="lg" className="w-full py-6 h-auto text-lg group transition-all duration-300 hover:scale-105">
                  <span className="flex items-center justify-center font-semibold">
                    Take Your Assessment
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </RainbowButton>
              </Link>
              <a 
                href="https://calendly.com/aayush-agileacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full py-6 h-auto border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-lg" size="lg">
                  <span className="flex items-center justify-center font-medium">
                    <Calendar className="mr-3 h-6 w-6" />
                    Book Expert Consultation
                  </span>
                </Button>
              </a>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
              <BodyText size="small" variant="muted" className="text-center italic">
                ⚡ Compare your results and see which Agile roles align best with your personality
              </BodyText>
            </div>
          </div>
        )}
      </CardContent>
    </StandardCard>
  );
}