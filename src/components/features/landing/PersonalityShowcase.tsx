"use client";

import { useState } from "react";
import { PersonalityType } from "@/data/personality-types";
import ChromaGrid from "./ChromaGrid";
import { HeroText, BodyText, Caption } from "@/components/ui/Typography";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Grid3X3 } from "lucide-react";
import { RainbowButton } from "@/components/magicui/rainbow-button";

interface PersonalityShowcaseProps {
  onStartAssessment?: () => void;
  className?: string;
}

export default function PersonalityShowcase({ onStartAssessment, className = "" }: PersonalityShowcaseProps) {
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityType | null>(null);

  const handleCardClick = (item: any, index: number) => {
    console.log(`Clicked on ${item.title} (${item.subtitle})`);
    // Add some analytics tracking here if needed
    onStartAssessment?.();
  };

  const handleStartAssessment = () => {
    // Add some analytics tracking here if needed
    onStartAssessment?.();
  };

  return (
    <section className={`personality-showcase ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-card/50 border border-border text-foreground text-caption font-medium mb-8 animate-fade-in">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Interactive Personality Grid
          </div>
          
          <HeroText className="mb-6 animate-slide-up animate-delay-100">
            <span style={{color: 'var(--text-primary)'}}>Discover All</span>
            <div className="block mt-2">
              <GradientText
                colors={["#4FD1C7", "#50C878", "#4FD1C7", "#40E0D0", "#4FD1C7"]}
                animate={true}
                speed="slow"
              >
                16 Personalities
              </GradientText>
            </div>
          </HeroText>
          
          <BodyText size="large" variant="secondary" className="max-w-4xl mx-auto mb-8 animate-fade-in animate-delay-300">
            Hover to explore each personality type with stunning visual effects. 
            Each represents a unique combination of <strong>4 behavioral dimensions</strong> found in Agile professionals.
          </BodyText>

          <div className="flex items-center justify-center space-x-8 text-caption opacity-70 animate-fade-in animate-delay-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Work Style</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Decision Process</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Communication</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Focus Orientation</span>
            </div>
          </div>
        </div>

        {/* Interactive ChromaGrid */}
        <div className="animate-fade-in animate-delay-600">
          <ChromaGrid 
            radius={300}
            columns={4}
            rows={4}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
            onCardClick={handleCardClick}
          />
        </div>

        {/* Additional Call to Action */}
        <div className="text-center mt-16 animate-slide-up animate-delay-800">
          <BodyText size="large" className="mb-8">
            <span className="opacity-90">Click any card above or take the full assessment to discover your personality type!</span>
          </BodyText>
          
          <RainbowButton 
            size="lg"
            className="text-base group transition-all duration-300"
            onClick={handleStartAssessment}
          >
            Take the Full Assessment
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </RainbowButton>
          
          <div className="flex items-center justify-center space-x-6 text-caption mt-6 opacity-70">
            <span>8 minutes</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>32 Questions</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Instant Results</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>100% Free</span>
          </div>
        </div>

        {/* Selection Feedback */}
        {selectedPersonality && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-background border border-border rounded-lg p-6 m-4 max-w-md animate-scale-up">
              <div className="text-center">
                <div className="text-4xl mb-3">
                  {selectedPersonality.name.split(' ')[0]}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {selectedPersonality.name.slice(3)}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Interesting choice! Let's discover if this matches your personality...
                </p>
                <Caption className="opacity-60">
                  Starting your assessment...
                </Caption>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .personality-showcase {
          @apply py-20 relative;
          background: linear-gradient(
            180deg,
            transparent 0%,
            color-mix(in srgb, var(--primary) 3%, transparent) 50%,
            transparent 100%
          );
        }

        /* Animation classes */
        .animate-scale-up {
          animation: scaleUp 0.3s ease-out;
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Staggered animation delays */
        .animate-delay-600 { animation-delay: 0.6s; }
        .animate-delay-800 { animation-delay: 0.8s; }
      `}</style>
    </section>
  );
}