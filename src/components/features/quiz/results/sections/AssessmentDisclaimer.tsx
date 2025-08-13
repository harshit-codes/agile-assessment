"use client";

import { BodyText } from "@/components/ui/Typography";
import type { SectionProps } from "../utils/results.types";

interface AssessmentDisclaimerProps {
  mode?: 'direct' | 'shared';
  displayName?: string;
  sharedResult?: any;
}

export default function AssessmentDisclaimer({ 
  mode, 
  displayName,
  sharedResult 
}: AssessmentDisclaimerProps) {
  return (
    <div className="text-center py-6 border-t border-border/20 bg-muted/20 rounded-lg">
      <div className="max-w-xl mx-auto px-4">
        <BodyText size="small" variant="muted" className="italic">
          <strong>Important Notice:</strong><br />
          This assessment provides <strong>personalized insights</strong> for self-reflection and career development. 
          Results may vary based on your current circumstances, personal growth, and life context. While our methodology is{' '}
          <strong>grounded in behavioral science</strong>, these results should <em>complement</em>—not replace—professional career guidance 
          and coaching.
        </BodyText>
        {mode === 'shared' && (
          <div className="mt-4 pt-4 border-t border-border/20">
            <BodyText size="small" variant="muted" suppressHydrationWarning>
              Shared by <span className="font-semibold text-foreground">{displayName}</span>
              {mode === 'shared' && sharedResult?.result && (sharedResult.result as any).sharedAt && (
                <span className="block mt-1" suppressHydrationWarning>
                  {new Date((sharedResult.result as any).sharedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
            </BodyText>
          </div>
        )}
      </div>
    </div>
  );
}