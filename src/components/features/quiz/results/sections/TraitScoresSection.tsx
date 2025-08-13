"use client";

import { BarChart3, Target, Brain, MessageSquare, Eye, Users, Lock } from "lucide-react";
import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { H2, H3, BodyText } from "@/components/ui/Typography";
import { StarRating, scoreToStars } from "@/components/ui/StarRating";
import TraitCard from "../components/TraitCard";
import { getOverallFitLabel, getOverallFitDescription } from "../utils/scoring.utils";
import type { SectionProps } from "../utils/results.types";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TraitScoresSection({ resultsData, authState }: SectionProps) {
  const { traits, overallFit } = resultsData;
  const { isAuthenticated } = authState;
  
  if (!traits) return null;

  return (
    <StandardCard variant="elevated" size="lg">
      <CardContent className="space-y-8">
        <div className="text-center border-b border-border/30 pb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BarChart3 className="h-7 w-7 text-primary" />
            <H2 className="text-primary">Trait Assessment</H2>
            {!isAuthenticated && <Lock className="h-5 w-5 text-muted-foreground ml-2" />}
          </div>
          
          <div className="space-y-2">
            <H3 className="text-xl font-bold">
              {isAuthenticated ? getOverallFitLabel(overallFit) : 'Unlock Your Detailed Assessment'}
            </H3>
            <BodyText variant="secondary" className="max-w-lg mx-auto">
              {isAuthenticated 
                ? getOverallFitDescription(overallFit)
                : 'See your complete 4-trait personality breakdown with detailed scores and insights'
              }
            </BodyText>
          </div>
        </div>
        
        {isAuthenticated ? (
          /* Individual Trait Scores - 2x2 Grid with Stars */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Work Style */}
            <TraitCard
              title="Work Style"
              label={traits.workStyle.label}
              score={traits.workStyle.score}
              icon={Target}
              colorScheme="blue"
            />

            {/* Decision Process */}
            <TraitCard
              title="Decision Process"
              label={traits.decisionProcess.label}
              score={traits.decisionProcess.score}
              icon={Brain}
              colorScheme="purple"
            />

            {/* Communication Style */}
            {traits.communicationStyle && (
              <TraitCard
                title="Communication"
                label={traits.communicationStyle.label}
                score={traits.communicationStyle.score}
                icon={MessageSquare}
                colorScheme="orange"
              />
            )}

            {/* Focus Orientation */}
            {traits.focusOrientation && (
              <TraitCard
                title="Focus Orientation"
                label={traits.focusOrientation.label}
                score={traits.focusOrientation.score}
                icon={Eye}
                colorScheme="teal"
              />
            )}

            {/* Legacy Team Interaction - Show only if new traits not available */}
            {traits.teamInteraction && !traits.communicationStyle && !traits.focusOrientation && (
              <div className="p-4 bg-muted/20 rounded-xl border border-border/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <H3 className="mb-1">Team Interaction</H3>
                    <BodyText size="small" variant="muted">{traits.teamInteraction.label}</BodyText>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <StarRating rating={scoreToStars(traits.teamInteraction.score)} size="md" />
                  <BodyText size="small" className="font-semibold text-green-600">
                    {scoreToStars(traits.teamInteraction.score)}/5
                  </BodyText>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Locked UI - Sign Up to Unlock */
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto border-2 border-primary/20">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-3">
              <H3>Unlock Your Trait Breakdown</H3>
              <BodyText variant="secondary" className="max-w-lg mx-auto leading-relaxed">
                Get detailed insights into your work style, decision-making process, communication approach, and focus orientation with personalized scores and recommendations.
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