"use client";

import { BodyText } from "@/components/ui/Typography";
import { GradientText } from "@/components/ui/GradientText";
import type { SectionProps } from "../utils/results.types";

export default function ResultsHeader({ authState, mode }: Pick<SectionProps, 'authState' | 'mode'>) {
  return (
    <div className="bg-background py-16 sm:py-20">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <div className="space-y-6 animate-fade-in">
          <div className="mb-6 leading-tight">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span style={{color: 'var(--text-primary)'}}>Discover Your </span>
              <GradientText
                colors={["#4FD1C7", "#50C878", "#4FD1C7", "#40E0D0", "#4FD1C7"]}
                animate={true}
                speed="slow"
              >
                Agile DNA
              </GradientText>
            </h1>
          </div>
          
          <BodyText size="large" variant="secondary" className="max-w-2xl mx-auto leading-relaxed">
            {mode === 'direct' 
              ? 'Your comprehensive behavioral analysis reveals your unique Agile personality'
              : `${authState.displayName}'s comprehensive behavioral analysis reveals their unique Agile personality`
            }
          </BodyText>
          
          <div className="flex items-center justify-center text-base opacity-80 font-medium pt-4">
            <span className="mr-2">✨</span>
            <span>Results Ready</span>
            <span className="mx-3 text-primary">•</span>
            <span>16 Personalities</span>
            <span className="mx-3 text-primary">•</span>
            <span>Instant Report</span>
          </div>
        </div>
      </div>
    </div>
  );
}