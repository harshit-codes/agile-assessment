"use client";

import ChromaGrid from "./ChromaGrid";
import { HeroText, BodyText, Caption } from "@/components/ui/Typography";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import ShinyText from "@/components/ui/ShinyText";
import { ArrowRight } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";

interface CleanLandingPageProps {
  className?: string;
}

export default function CleanLandingPage({ className = "" }: CleanLandingPageProps) {
  const { isSignedIn } = useUser();
  // Cards are now display-only, no click functionality

  return (
    <section className={`clean-landing ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Title */}
        <div className="text-center mb-16">
          <div className="mb-6 leading-tight">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              <span style={{color: 'var(--text-primary)'}}>Discover Your </span>
              <GradientText
                colors={["#4FD1C7", "#50C878", "#4FD1C7", "#40E0D0", "#4FD1C7"]}
                animate={true}
                speed="slow"
              >
                Agile DNA
              </GradientText>
            </h2>
          </div>
          
          <BodyText size="large" variant="secondary" className="max-w-3xl mx-auto mb-6 leading-relaxed text-lg">
            Scientifically analyze your behavioral patterns across<br />
            Work Style, Decision Process, Communication Style, and Focus Orientation
          </BodyText>
          
          <div className="flex items-center justify-center text-base opacity-80 font-medium">
            <span className="mr-2">✨</span>
            <span>15 mins</span>
            <span className="mx-3 text-primary">•</span>
            <span>100% free</span>
            <span className="mx-3 text-primary">•</span>
            <span>Instant Report</span>
          </div>
        </div>

        {/* Enhanced CTA with RainbowButton */}
        <div className="text-center mb-20">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <RainbowButton 
                size="lg" 
                className="px-12 py-6 h-auto group transition-all duration-300 hover:scale-105 text-lg"
              >
                <span className="flex items-center justify-center font-semibold">
                  Discover My DNA
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </RainbowButton>
            </SignInButton>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground text-lg">Welcome back! You're already signed in.</p>
            </div>
          )}
        </div>

        {/* ChromaGrid */}
        <div className="mb-20">
          <ChromaGrid 
            radius={300}
            columns={4}
            rows={4}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </div>

      </div>

      <style jsx>{`
        .clean-landing {
          @apply py-20 min-h-screen flex flex-col justify-center;
          background: linear-gradient(
            180deg,
            transparent 0%,
            color-mix(in srgb, var(--primary) 2%, transparent) 50%,
            transparent 100%
          );
        }
      `}</style>
    </section>
  );
}