"use client";

import { BookOpen, Lock, Target, ArrowRight } from "lucide-react";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Link from "next/link";
import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { H2, H3, BodyText } from "@/components/ui/Typography";
import type { SectionProps } from "../utils/results.types";

export default function CareerPathwaysSection({ 
  resultsData, 
  authState 
}: SectionProps) {
  const { personalityType } = resultsData;
  const { isAuthenticated } = authState;
  
  return (
    <StandardCard variant="elevated" size="lg">
      <CardContent className="space-y-8">
        <div className="text-center border-b border-border/30 pb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-7 w-7 text-primary" />
            <H2 className="text-primary">Career Pathways</H2>
            {!isAuthenticated && <Lock className="h-5 w-5 text-muted-foreground ml-2" />}
          </div>
          <BodyText variant="secondary" className="max-w-lg mx-auto">
            {isAuthenticated 
              ? 'Recommended career paths based on your personality type' 
              : 'See personalized career recommendations based on your unique personality type'
            }
          </BodyText>
        </div>
        
        {isAuthenticated ? (
          personalityType && (
            <div className="space-y-4">
              <div className="space-y-3">
                {personalityType.careerPaths.map((path: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-primary/10 rounded-xl border border-primary/30">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BodyText size="small" className="font-bold text-primary">{index + 1}</BodyText>
                    </div>
                    <BodyText className="text-foreground font-medium leading-relaxed">{path}</BodyText>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto border-2 border-primary/20">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-3">
              <H3>Unlock Your Career Potential</H3>
              <BodyText variant="secondary" className="max-w-lg mx-auto leading-relaxed">
                Get personalized career development recommendations, role-specific guidance, and growth strategies tailored to your unique personality type.
              </BodyText>
            </div>
            <Link href="/">
              <RainbowButton size="lg" className="text-lg group transition-all duration-300 hover:scale-105">
                <span className="flex items-center justify-center font-semibold">
                  Sign Up to Unlock
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </RainbowButton>
            </Link>
          </div>
        )}
      </CardContent>
    </StandardCard>
  );
}