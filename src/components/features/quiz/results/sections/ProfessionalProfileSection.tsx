"use client";

import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { H2, H3, BodyText } from "@/components/ui/Typography";
import type { SectionProps } from "../utils/results.types";

export default function ProfessionalProfileSection({ resultsData }: SectionProps) {
  const { personalityType } = resultsData;
  
  if (!personalityType) return null;

  return (
    <StandardCard variant="elevated" size="lg">
      <CardContent className="space-y-8">
        <div className="text-center border-b border-border/30 pb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <TrendingUp className="h-7 w-7 text-primary" />
            <H2 className="text-primary">Professional Profile</H2>
          </div>
          <BodyText variant="secondary" className="max-w-lg mx-auto">
            Your natural strengths and development opportunities in Agile environments
          </BodyText>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Strengths */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <H3 className="text-green-300">Key Strengths</H3>
            </div>
            <div className="space-y-3">
              {personalityType.strengths.map((strength: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-950/20 rounded-lg border border-green-800/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <BodyText size="small" className="text-green-200 leading-relaxed">{strength}</BodyText>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Areas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
              <H3 className="text-orange-300">Growth Areas</H3>
            </div>
            <div className="space-y-3">
              {personalityType.challenges.map((challenge: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-950/20 rounded-lg border border-orange-800/20">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <BodyText size="small" className="text-orange-200 leading-relaxed">{challenge}</BodyText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </StandardCard>
  );
}