"use client";

import { Dna } from "lucide-react";
import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { H1, H2, BodyText } from "@/components/ui/Typography";
import PersonalityImage from "@/components/ui/PersonalityImage";
import LightRays from "@/components/LightRays/LightRays";
import type { SectionProps } from "../utils/results.types";

export default function PersonalitySection({ 
  resultsData, 
  authState, 
  mode 
}: SectionProps) {
  const { personalityType } = resultsData;
  
  if (!personalityType) return null;

  return (
    <div className="relative">
      {/* LightRays Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <LightRays
          raysOrigin="top-center"
          raysColor="#3b82f6"
          raysSpeed={0.8}
          lightSpread={0.6}
          rayLength={1.5}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.1}
          distortion={0.02}
          fadeDistance={0.8}
          saturation={0.7}
          className="opacity-25"
        />
      </div>
      
      <StandardCard variant="elevated" size="lg" className="relative z-10">
        <CardContent className="space-y-8">
          <div className="text-center border-b border-border/30 pb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Dna className="h-7 w-7 text-primary" />
              <H2 className="text-primary">
                {mode === 'direct' ? 'Your' : `${authState.displayName}'s`} Agile DNA Report
              </H2>
            </div>
          
            <div className="space-y-6">
              {/* Personality Image */}
              <PersonalityImage 
                personalityType={personalityType} 
                size="md"
                className="mx-auto"
              />
              
              {/* Personality Info */}
              <div className="space-y-6">
                <H1 className="text-2xl md:text-3xl font-bold">{personalityType.name}</H1>
                
                
                {/* Type Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <BodyText size="large" className="font-bold text-primary">
                    Type: {personalityType.shortName}
                  </BodyText>
                </div>
                
                {/* Description */}
                <BodyText variant="secondary" className="mt-4 max-w-2xl mx-auto leading-relaxed">
                  {personalityType.description}
                </BodyText>
                
                {/* Key Characteristics */}
                {personalityType.characterAttributes && personalityType.characterAttributes.length > 0 && (
                  <div className="space-y-3">
                    <H2 className="text-lg font-semibold text-center">Key Characteristics</H2>
                    <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                      {personalityType.characterAttributes.map((attribute: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary/90 text-white font-medium text-sm rounded-full border border-primary hover:bg-primary shadow-md transition-colors"
                        >
                          {attribute}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Motto */}
                {personalityType.motto && (
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
                    <BodyText className="font-medium text-center text-foreground">
                      💫 {personalityType.motto}
                    </BodyText>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </CardContent>
      </StandardCard>
    </div>
  );
}