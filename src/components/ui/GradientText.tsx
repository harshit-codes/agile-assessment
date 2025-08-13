import { ReactNode, memo } from "react";

interface GradientTextProps {
  children: ReactNode;
  colors: string[];
  className?: string;
  animate?: boolean;
  speed?: "slow" | "normal" | "fast";
}

export const GradientText = memo(function GradientText({ 
  children, 
  colors, 
  className = "", 
  animate = false, 
  speed = "normal" 
}: GradientTextProps) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
  
  const animationDuration = 
    speed === "slow" ? "6s" : 
    speed === "fast" ? "2s" : 
    "4s";

  // Generate unique class name for this gradient to avoid FOUC
  const gradientId = `gradient-${colors.join("").replace(/[^a-zA-Z0-9]/g, "").substring(0, 8)}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .${gradientId} {
            background: ${gradient};
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: ${animate ? "200% 200%" : "100% 100%"};
            animation: ${animate ? `gradient-flow ${animationDuration} ease-in-out infinite` : "none"};
          }
        `
      }} />
      <span className={`inline-block ${gradientId} ${className}`}>
        {children}
      </span>
    </>
  );
});