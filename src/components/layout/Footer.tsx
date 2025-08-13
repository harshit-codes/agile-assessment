"use client";

import Link from "next/link";
import { BodyText } from "@/components/ui/Typography";

export default function Footer() {

  return (
    <footer className="border-t border-border/30 bg-card/20 backdrop-blur-sm mt-auto" suppressHydrationWarning={true}>
      <div className="max-w-2xl mx-auto px-4 py-6" suppressHydrationWarning={true}>
        <div className="text-center space-y-3" suppressHydrationWarning={true}>
          {/* Ultra-crisp disclaimer */}
          <BodyText size="small" variant="muted">
            This assessment is for guidance only, not definitive evaluation.
          </BodyText>
          
          {/* Attribution */}
          <Link 
            href="https://www.linkedin.com/in/harshitconnects/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Made with ❤️ by Harshit
          </Link>
          
          {/* Legal Links */}
          <div className="flex items-center justify-center space-x-4 pt-2" suppressHydrationWarning={true}>
            <Link 
              href="/policy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <Link 
              href="/services"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}