"use client";

import AssessmentTitle from "./AssessmentTitle";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser, SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function HeaderSection() {
  const { isSignedIn } = useUser();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Agile Academy Logo - Clickable */}
          <div className="mb-6">
            <Link 
              href="https://theagilecoach.com/product-manager" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image 
                src="/logo.png" 
                alt="Agile Academy" 
                width={120} 
                height={36}
                priority
                className="cursor-pointer"
              />
            </Link>
          </div>
          
          <AssessmentTitle />
          
          {/* User Button or Sign Up Button */}
          <div className="mt-6 flex justify-center">
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    // Avatar styling - responsive sizing
                    avatarBox: "w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary/20 shadow-lg transition-all duration-200 hover:ring-primary/40 hover:scale-105",
                    avatarImage: "rounded-full",
                    
                    // User info styling
                    userButtonBox: "flex-col gap-2",
                    userButtonTrigger: "focus:shadow-lg focus:ring-2 focus:ring-primary/30 transition-all duration-200 hover:bg-accent/10 rounded-lg p-2",
                    
                    // User name text - improved legibility and responsive sizing
                    userButtonOuterIdentifier: "text-foreground font-semibold text-sm sm:text-base tracking-wide leading-tight",
                    userButtonInnerIdentifier: "text-muted-foreground text-xs sm:text-sm font-medium leading-tight",
                    
                    // Popover card styling - responsive and accessible
                    userButtonPopoverCard: `
                      bg-background/95 backdrop-blur-sm 
                      border-2 border-border/30 
                      shadow-xl shadow-primary/10
                      rounded-xl p-3 sm:p-4
                      max-w-xs sm:max-w-sm
                    `,
                    userButtonPopoverMain: "space-y-2",
                    
                    // Action buttons in popover
                    userButtonPopoverActionButton: `
                      text-foreground hover:bg-primary/10 hover:text-primary
                      rounded-lg px-3 py-2 text-sm font-medium
                      transition-all duration-200 border border-transparent
                      hover:border-primary/20 focus:ring-2 focus:ring-primary/30
                    `,
                    userButtonPopoverActionButtonText: "text-current",
                    
                    // Footer
                    userButtonPopoverFooter: "border-t border-border/30 pt-3 mt-3",
                    
                    // User preview
                    userPreviewAvatarBox: "w-10 h-10 ring-2 ring-primary/20 rounded-full",
                    userPreviewMainIdentifier: "text-foreground font-semibold text-sm",
                    userPreviewSecondaryIdentifier: "text-muted-foreground text-xs"
                  },
                  variables: {
                    colorPrimary: "hsl(var(--primary))",
                    colorBackground: "hsl(var(--background))",
                    colorText: "hsl(var(--foreground))",
                    colorTextSecondary: "hsl(var(--muted-foreground))",
                    colorNeutral: "hsl(var(--muted))",
                    colorDanger: "hsl(var(--destructive))",
                    borderRadius: "0.75rem"
                  }
                }}
                showName={false}
                userProfileMode="modal"
                afterSignOutUrl="/"
              />
            ) : (
              <Button 
                size="lg"
                onClick={() => setShowSignUp(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90 ring-2 ring-primary/20 shadow-lg transition-all duration-200 hover:ring-primary/40 hover:scale-105 p-0"
              >
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* SignUp Modal */}
      {showSignUp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-background rounded-2xl border border-border shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full shadow-none bg-transparent border-none",
                    headerTitle: "text-foreground text-2xl font-bold",
                    headerSubtitle: "text-muted-foreground",
                    socialButtonsBlockButton: "bg-card border-2 border-muted hover:border-primary/50 hover:bg-card/80 text-foreground shadow-sm transition-all",
                    socialButtonsBlockButtonText: "text-foreground font-medium",
                    dividerLine: "bg-border",
                    dividerText: "text-muted-foreground bg-background px-4",
                    formFieldLabel: "text-foreground font-medium mb-2",
                    formFieldInput: "bg-background border-2 border-muted hover:border-primary/70 focus:border-primary focus:bg-card/50 text-foreground placeholder:text-muted-foreground rounded-lg px-4 py-3 transition-all shadow-sm",
                    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors",
                    identityPreviewText: "text-foreground",
                    identityPreviewEditButton: "text-primary hover:text-primary/80",
                    footerActionText: "text-muted-foreground",
                    footerActionLink: "text-primary hover:text-primary/80 font-medium",
                    formFieldErrorText: "text-destructive text-sm",
                    alertClerkError: "bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3"
                  },
                  variables: {
                    colorPrimary: "hsl(var(--primary))",
                    colorBackground: "hsl(var(--background))",
                    colorText: "hsl(var(--foreground))",
                    colorTextSecondary: "hsl(var(--muted-foreground))",
                    colorNeutral: "hsl(var(--card))",
                    colorInputBackground: "hsl(var(--background))",
                    colorInputText: "hsl(var(--foreground))",
                    colorDanger: "hsl(var(--destructive))",
                    borderRadius: "0.5rem",
                    spacingUnit: "1rem"
                  }
                }}
                redirectUrl="/"
                afterSignUpUrl="/"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}