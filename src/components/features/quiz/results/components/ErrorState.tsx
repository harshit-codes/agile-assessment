"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H2, BodyText } from "@/components/ui/Typography";
import Link from "next/link";
import type { ErrorStateProps } from "../utils/results.types";

export default function ErrorState({ 
  title, 
  subtitle, 
  actionText = "Take Assessment",
  onAction
}: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🔍</span>
        </div>
        <H2 className="mb-4">{title}</H2>
        <BodyText variant="secondary" className="mb-6">
          {subtitle}
        </BodyText>
        {onAction ? (
          <Button onClick={onAction}>
            {actionText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Link href="/">
            <Button>
              {actionText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}