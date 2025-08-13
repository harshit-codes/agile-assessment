"use client";

import { H2, BodyText } from "@/components/ui/Typography";
import type { LoadingStateProps } from "../utils/results.types";

export default function LoadingState({ 
  title = "Loading Results...",
  subtitle = "Please wait while we load the assessment results."
}: LoadingStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <H2 className="mb-2">{title}</H2>
        <BodyText variant="secondary">{subtitle}</BodyText>
      </div>
    </div>
  );
}