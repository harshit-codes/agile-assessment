"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Trophy, 
  Star, 
  Share2, 
  ArrowRight, 
  LogOut, 
  Award,
  Target,
  Brain,
  MessageSquare,
  Eye,
  Sparkles,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StandardCard, CardContent } from "@/components/ui/StandardCard";
import { DisplayText, H1, H2, H3, H4, BodyText, Caption } from "@/components/ui/Typography";
import { useClerk } from "@clerk/nextjs";
import { getPersonalityByCode } from "@/data/personality-types";
import ShareResultModal from "../sharing/ShareResultModal";
import HeaderSection from "@/components/header/HeaderSection";

interface MiniReportCardProps {
  assessmentResult: {
    personalityType?: any;
    traits?: {
      workStyle: { score: number; label: string };
      decisionProcess: { score: number; label: string };
      communicationStyle?: { score: number; label: string };
      focusOrientation?: { score: number; label: string };
      // Legacy support
      teamInteraction?: { score: number; label: string };
    };
    overallFit?: number;
  };
  quizState: any;
}

export default function MiniReportCard({ assessmentResult, quizState }: MiniReportCardProps) {
  const { signOut } = useClerk();
  const { personalityType, traits, overallFit = 0 } = assessmentResult;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Get enhanced character data
  const enhancedPersonality = personalityType ? getPersonalityByCode(personalityType.shortName) : null;
  
  // Helper function to convert score to star rating (very lenient)
  const scoreToStars = (score: number) => {
    const absScore = Math.abs(score);
    if (absScore >= 1.2) return 5;  // Much easier to get 5 stars
    if (absScore >= 0.8) return 4;  // Moderate effort gets 4 stars
    if (absScore >= 0.4) return 3;  // Even neutral leans get 3 stars
    if (absScore >= 0.1) return 2;  // Very rare to get 2 stars
    return 1;  // Almost impossible to get 1 star
  };

  // Render star display
  const renderStars = (count: number) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < count 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  // Overall star rating calculation
  const getOverallStars = (fit: number) => {
    if (fit >= 90) return 5;
    if (fit >= 75) return 4;
    if (fit >= 60) return 3;
    if (fit >= 45) return 2;
    return 1;
  };
  
  // Safety check
  if (!traits || !personalityType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <H2 className="mb-4">Generating Report Card...</H2>
          <BodyText variant="secondary">
            Please wait while we prepare your personalized assessment report.
          </BodyText>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderSection />
      <div className="py-8 px-4 space-y-8">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* SECTION 1: REPORT CARD */}
          <StandardCard variant="elevated" className="overflow-hidden">
            <CardContent className="p-0">
              {/* Header Section - Report Card Title */}
              <div className="p-8 text-center border-b border-border/20">
                <div className="inline-block px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="text-base font-semibold text-primary">Assessment Complete</span>
                  </div>
                </div>
                <H1 className="mb-2">Agile Assessment Report</H1>
                <BodyText variant="secondary">Your personalized behavioral analysis</BodyText>
              </div>

              {/* Character Hero Section */}
              <div className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  {enhancedPersonality?.characterImage && (
                    <div className="relative">
                      <Image 
                        src={enhancedPersonality.characterImage} 
                        alt={personalityType.name}
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-2xl border border-primary/20 shadow-sm"
                        style={{ imageRendering: 'pixelated' }}
                        priority
                      />
                    </div>
                  )}
                </div>
                
                <H2 className="mb-3">{personalityType.name}</H2>
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Caption className="font-bold text-primary">{personalityType.shortName}</Caption>
                </div>
                
                {enhancedPersonality?.characterEnergy && (
                  <BodyText className="italic text-muted-foreground max-w-md mx-auto">
                    "{enhancedPersonality.characterEnergy}"
                  </BodyText>
                )}
              </div>

              {/* Trait Scorecard Table */}
              <div className="p-8 border-t border-border/20">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">Trait Star Ratings</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Work Style */}
                  <div className="flex flex-col items-center text-center p-4 bg-card/50 rounded-lg border border-border/50 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <H4 className="text-foreground">Work Style</H4>
                    </div>
                    <Caption className="text-muted-foreground">{traits.workStyle.label}</Caption>
                    <div className="flex justify-center">
                      {renderStars(scoreToStars(traits.workStyle.score))}
                    </div>
                  </div>

                  {/* Decision Process */}
                  <div className="flex flex-col items-center text-center p-4 bg-card/50 rounded-lg border border-border/50 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <H4 className="text-foreground">Decision Process</H4>
                    </div>
                    <Caption className="text-muted-foreground">{traits.decisionProcess.label}</Caption>
                    <div className="flex justify-center">
                      {renderStars(scoreToStars(traits.decisionProcess.score))}
                    </div>
                  </div>

                  {/* Communication Style */}
                  {traits.communicationStyle && (
                    <div className="flex flex-col items-center text-center p-4 bg-card/50 rounded-lg border border-border/50 space-y-3">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <H4 className="text-foreground">Communication</H4>
                      </div>
                      <Caption className="text-muted-foreground">{traits.communicationStyle.label}</Caption>
                      <div className="flex justify-center">
                        {renderStars(scoreToStars(traits.communicationStyle.score))}
                      </div>
                    </div>
                  )}

                  {/* Focus Orientation */}
                  {traits.focusOrientation && (
                    <div className="flex flex-col items-center text-center p-4 bg-card/50 rounded-lg border border-border/50 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-primary" />
                        <H4 className="text-foreground">Focus Orientation</H4>
                      </div>
                      <Caption className="text-muted-foreground">{traits.focusOrientation.label}</Caption>
                      <div className="flex justify-center">
                        {renderStars(scoreToStars(traits.focusOrientation.score))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </CardContent>
          </StandardCard>

          {/* SECTION 2: PROFESSIONAL INSIGHTS */}
          <StandardCard variant="elevated" className="overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Professional Insights</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Detailed Strengths */}
                <div>
                  <H4 className="mb-4 text-foreground flex items-center">
                    <span className="mr-2">💪</span>
                    Core Strengths
                  </H4>
                  <div className="space-y-3">
                    {enhancedPersonality?.detailedStrengths?.slice(0, 3).map((strength: string, index: number) => (
                      <div key={index} className="bg-card/50 border border-border/50 p-3 rounded-lg">
                        <BodyText size="small" className="text-foreground">
                          {strength}
                        </BodyText>
                      </div>
                    )) || personalityType.strengths?.slice(0, 3).map((strength: string, index: number) => (
                      <div key={index} className="inline-block bg-card/50 border border-border/50 text-foreground px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Areas */}
                <div>
                  <H4 className="mb-4 text-foreground flex items-center">
                    <span className="mr-2">🎯</span>
                    Growth Areas
                  </H4>
                  <div className="space-y-3">
                    {enhancedPersonality?.detailedWeaknesses?.slice(0, 3).map((weakness: string, index: number) => (
                      <div key={index} className="bg-card/50 border border-border/50 p-3 rounded-lg">
                        <BodyText size="small" className="text-foreground">
                          {weakness}
                        </BodyText>
                      </div>
                    )) || personalityType.challenges?.slice(0, 3).map((challenge: string, index: number) => (
                      <div key={index} className="inline-block bg-card/50 border border-border/50 text-foreground px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {challenge}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Tips */}
                <div>
                  <H4 className="mb-4 text-foreground flex items-center">
                    <span className="mr-2">🚀</span>
                    Career Tips
                  </H4>
                  <div className="space-y-3">
                    {enhancedPersonality?.careerTips?.slice(0, 3).map((tip: string, index: number) => (
                      <div key={index} className="bg-card/50 border border-border/50 p-3 rounded-lg">
                        <BodyText size="small" className="text-foreground">
                          {tip}
                        </BodyText>
                      </div>
                    )) || personalityType.careerPaths?.slice(0, 3).map((path: string, index: number) => (
                      <div key={index} className="bg-card/50 border border-border/50 text-foreground px-3 py-2 rounded-lg text-sm">
                        {path}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </StandardCard>

          {/* SECTION 3: FINAL CTA */}
          <StandardCard variant="elevated" className="overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div>
                  <H3 className="mb-2">Ready to level up your Agile career?</H3>
                  <BodyText variant="secondary">
                    Download your report card and book a consultation with our experts
                  </BodyText>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsShareModalOpen(true)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                  
                  <a 
                    href="https://calendly.com/aayush-agileacademy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" variant="outline">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Book Consultation
                    </Button>
                  </a>
                </div>
                
                <div className="pt-4 border-t border-border/20">
                  <Button 
                    variant="ghost" 
                    onClick={() => signOut()}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Take Assessment Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </StandardCard>
        </div>

        {/* Share Result Modal */}
        <ShareResultModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          sessionId={quizState.sessionId}
          personalityType={personalityType}
        />

      </div>
    </div>
  );
}