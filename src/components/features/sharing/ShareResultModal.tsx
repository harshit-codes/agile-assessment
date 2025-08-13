"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
// TODO: Re-enable for private sharing in future version
// import { generate } from "random-words";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Share2, 
  Copy, 
  Check, 
  Globe,
  Dna
} from "lucide-react";
import Image from "next/image";
import { BodyText } from "@/components/ui/Typography";
import { Id } from "../../../../convex/_generated/dataModel";

interface ShareResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: Id<"quizSessions">;
  personalityType?: {
    name: string;
    shortName: string;
  };
}

export default function ShareResultModal({ 
  isOpen, 
  onClose, 
  sessionId, 
  personalityType 
}: ShareResultModalProps) {
  const { user } = useUser();
  const [isPublic, setIsPublic] = useState(true); // Always public in current version
  const [copied, setCopied] = useState(false);
  
  // TODO: Re-enable for future version with private sharing
  // const [customSlug, setCustomSlug] = useState("");
  // const [isEditingSlug, setIsEditingSlug] = useState(false);
  // const [slugError, setSlugError] = useState("");
  // const [accessCode, setAccessCode] = useState("");

  // Mutations
  const toggleSharing = useMutation(api.sharing.toggleResultSharing);
  const linkResultToUser = useMutation(api.sharing.linkResultToUser);
  
  // TODO: Re-enable for future version with slug editing
  // const updateUserSlug = useMutation(api.userProfiles.updateUserSlug);
  // const checkSlugAvailability = useQuery(
  //   api.userProfiles.checkSlugAvailability, 
  //   isEditingSlug ? { 
  //     slug: customSlug,
  //     excludeUserId: user?.id 
  //   } : "skip"
  // );

  // Queries
  const userProfile = useQuery(
    api.userProfiles.getUserProfile,
    user?.id ? { clerkUserId: user.id } : "skip"
  );
  const sharingStats = useQuery(
    api.sharing.getUserSharingStats,
    user?.id ? { clerkUserId: user.id } : "skip"
  );
  const shareableUrl = useQuery(
    api.sharing.getShareableUrl,
    user?.id ? { sessionId, clerkUserId: user.id } : "skip"
  );
  const brandingConfig = useQuery(api.appConfig.getBrandingConfig);
  const enhancedPersonality = useQuery(
    api.quiz.getPersonalityTypeByShortName, 
    personalityType?.shortName ? { shortName: personalityType.shortName } : "skip"
  );

  // TODO: Re-enable for private sharing in future version
  // const generateRandomAccessCode = () => {
  //   try {
  //     const words = generate({ exactly: 3, wordsPerString: 1, separator: '-' });
  //     return Array.isArray(words) ? words.join('-') : words;
  //   } catch (error) {
  //     // Fallback if random-words fails
  //     return `quiz-${Math.random().toString(36).substring(2, 8)}`;
  //   }
  // };

  // Initialize sharing state - always public in current version
  useEffect(() => {
    if (shareableUrl) {
      setIsPublic(true); // Always public in current version
    }
  }, [shareableUrl]);

  // Auto-enable sharing when modal opens (only if quiz results exist)
  useEffect(() => {
    if (isOpen && user && personalityType) {
      handleUpdateSharing();
    }
  }, [isOpen, user, personalityType]);

  // TODO: Re-enable for private sharing in future version
  // useEffect(() => {
  //   if (userProfile && !customSlug) {
  //     setCustomSlug(userProfile.slug);
  //   }
  // }, [userProfile, customSlug]);
  
  // useEffect(() => {
  //   if (accessCode.trim().length > 0) {
  //     setIsPublic(false);
  //   } else {
  //     setIsPublic(true);
  //   }
  // }, [accessCode]);

  // Create/link user profile on first open
  useEffect(() => {
    if (isOpen && user && !userProfile) {
      const email = user.emailAddresses[0]?.emailAddress;
      const displayName = user.fullName || user.firstName || undefined;
      
      if (email) {
        linkResultToUser({
          sessionId,
          clerkUserId: user.id,
          email,
          displayName,
        }).catch(console.error);
      }
    }
  }, [isOpen, user, userProfile, linkResultToUser, sessionId]);

  const shareUrl = userProfile ? `${window.location.origin}/results/${userProfile.slug}` : "";

  const handleUpdateSharing = async () => {
    if (!user) return;

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return;

    try {
      await toggleSharing({
        sessionId,
        clerkUserId: user.id,
        email,
        isPublic: true, // Always public in current version
        displayName: user.fullName || user.firstName || undefined,
        // TODO: Re-enable for private sharing
        // passcode: accessCode.trim().length > 0 ? accessCode.trim() : undefined,
      });
    } catch (error) {
      console.error("Failed to update sharing:", error);
    }
  };

  // TODO: Re-enable for future version with slug editing
  // const handleSlugUpdate = async () => {
  //   if (!user || !customSlug || customSlug === userProfile?.slug) {
  //     setIsEditingSlug(false);
  //     return;
  //   }

  //   if (checkSlugAvailability && !checkSlugAvailability.available) {
  //     setSlugError(checkSlugAvailability.reason);
  //     return;
  //   }

  //   try {
  //     await updateUserSlug({
  //       clerkUserId: user.id,
  //       newSlug: customSlug,
  //     });
  //     setIsEditingSlug(false);
  //     setSlugError("");
  //   } catch (error) {
  //     setSlugError(error instanceof Error ? error.message : "Failed to update slug");
  //   }
  // };

  const handleCopyUrl = async () => {
    const baseUrl = window.location.origin;
    
    const message = personalityType 
      ? `🧬 Just discovered I'm "${personalityType.name}" (${personalityType.shortName}) in my Agile DNA assessment!\n\nThis free 15-minute test analyzes your behavioral patterns across Work Style, Decision Process, Communication & Focus.\n\nReally insightful for understanding yourself better for career growth and team collaboration!\n\n✨ Try it yourself: ${baseUrl}\n📊 My results: ${shareUrl}`
      : `🧬 Just took this insightful Agile DNA assessment - really eye-opening!\n\nIt's a free 15-minute test that analyzes your behavioral patterns across Work Style, Decision Process, Communication & Focus.\n\nGreat for personal development and understanding team dynamics.\n\n✨ Try it yourself: ${baseUrl}`;
    
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };



  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Public Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agile DNA Report Preview Card - Larger */}
          {personalityType && shareUrl && (
            <div className="space-y-6">
              <div className="w-full min-h-[400px] border border-border rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                {/* Card Header */}
                <div className="p-6 border-b border-slate-600">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <Dna className="h-6 w-6 text-primary" />
                      <span className="text-primary font-semibold text-lg">Agile DNA Report</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8 flex-1 flex flex-col items-center text-center space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    {personalityType.name}
                  </h3>
                  
                  {/* Character Image */}
                  {enhancedPersonality?.characterImage && (
                    <div className="flex-shrink-0">
                      <img 
                        src={enhancedPersonality.characterImage} 
                        alt={personalityType.name}
                        className="w-48 h-48 rounded-lg border-2 border-primary/30 shadow-lg"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                  )}
                  
                  {/* Personality Code */}
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-bold">
                    {personalityType.shortName}
                  </div>
                  
                  <p className="text-base text-slate-300 line-clamp-3 leading-relaxed max-w-md">
                    {enhancedPersonality?.description || 'Discover your unique Agile personality profile'}
                  </p>
                  
                  {/* Key Characteristics */}
                  {enhancedPersonality?.characterAttributes && enhancedPersonality.characterAttributes.length > 0 && (
                    <div className="flex gap-3 flex-wrap justify-center px-6">
                      {enhancedPersonality.characterAttributes.slice(0, 4).map((attribute: string, idx: number) => (
                        <span 
                          key={idx}
                          className="text-sm bg-primary/90 text-white px-4 py-2 rounded-full border border-primary shadow-md font-medium"
                        >
                          {attribute}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Share URL - Simplified */}
          {shareUrl && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button size="sm" onClick={handleCopyUrl}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Footer info */}
          <div className="pt-4 border-t text-center">
            <BodyText size="small" variant="muted">
              💡 The link holds the latest result on quiz retakes
            </BodyText>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}