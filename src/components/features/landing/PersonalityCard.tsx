"use client";

import { useRef, useState } from "react";
import { PersonalityType } from "@/data/personality-types";
import { H4, BodyText, Caption } from "@/components/ui/Typography";

interface PersonalityCardProps {
  personality: PersonalityType;
  onClick?: (personality: PersonalityType) => void;
  className?: string;
}

export default function PersonalityCard({ personality, onClick, className = "" }: PersonalityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleClick = () => {
    onClick?.(personality);
  };

  return (
    <div
      ref={cardRef}
      className={`personality-card group cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        "--card-border": personality.borderColor || "#4F46E5",
        "--card-gradient": personality.gradient || "linear-gradient(145deg, #4F46E5, #000)",
      } as React.CSSProperties}
    >
      {/* Card Background with Gradient */}
      <div className="personality-card__background" />
      
      {/* Spotlight Effect */}
      <div className="personality-card__spotlight" />
      
      {/* Content */}
      <div className="personality-card__content">
        {/* Header with emoji and code */}
        <div className="personality-card__header">
          <span className="personality-card__emoji" aria-hidden="true">
            {personality.name.split(' ')[0]}
          </span>
          <Caption className="personality-card__code opacity-70">
            {personality.shortName}
          </Caption>
        </div>

        {/* Main content */}
        <div className="personality-card__main">
          <H4 className="personality-card__title">
            {personality.name.slice(3)} {/* Remove emoji from title */}
          </H4>
          <BodyText size="small" variant="secondary" className="personality-card__description">
            {personality.description}
          </BodyText>
        </div>

        {/* Hover details */}
        <div className={`personality-card__details transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="personality-card__career-paths">
            <Caption className="opacity-90 font-medium mb-1">Career Paths:</Caption>
            <div className="space-y-1">
              {personality.careerPaths.slice(0, 2).map((path, index) => (
                <Caption key={index} className="opacity-70">
                  • {path}
                </Caption>
              ))}
            </div>
          </div>
        </div>

        {/* Click indicator */}
        <div className="personality-card__cta">
          <Caption className="opacity-60 group-hover:opacity-90 transition-opacity">
            Click to explore →
          </Caption>
        </div>
      </div>

      <style jsx>{`
        .personality-card {
          @apply relative p-4 rounded-xl border border-white/10 backdrop-blur-sm;
          @apply transition-all duration-300 ease-out;
          @apply hover:scale-[1.02] hover:-translate-y-1;
          @apply bg-gradient-to-br from-slate-900/50 to-slate-800/30;
          min-height: 200px;
          overflow: hidden;
        }

        .personality-card:hover {
          box-shadow: 
            0 0 0 1px var(--card-border),
            0 20px 40px -10px rgba(0, 0, 0, 0.3),
            0 0 30px -5px color-mix(in srgb, var(--card-border) 20%, transparent);
        }

        .personality-card__background {
          @apply absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300;
          background: var(--card-gradient);
        }

        .personality-card__spotlight {
          @apply absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300;
          background: radial-gradient(
            300px circle at var(--mouse-x) var(--mouse-y),
            color-mix(in srgb, var(--card-border) 15%, transparent) 0%,
            color-mix(in srgb, var(--card-border) 8%, transparent) 20%,
            transparent 50%
          );
        }

        .personality-card__content {
          @apply relative z-10 h-full flex flex-col;
        }

        .personality-card__header {
          @apply flex items-center justify-between mb-3;
        }

        .personality-card__emoji {
          @apply text-2xl;
        }

        .personality-card__code {
          @apply px-2 py-1 rounded-md bg-white/5 border border-white/10;
          color: var(--card-border);
        }

        .personality-card__main {
          @apply flex-1 mb-3;
        }

        .personality-card__title {
          @apply mb-2 group-hover:text-white transition-colors;
        }

        .personality-card__description {
          @apply leading-relaxed line-clamp-3;
        }

        .personality-card__details {
          @apply mb-3 min-h-[3rem];
        }

        .personality-card__cta {
          @apply mt-auto text-center;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .personality-card {
            min-height: 160px;
          }
          
          .personality-card__emoji {
            @apply text-xl;
          }
          
          .personality-card__description {
            @apply line-clamp-2;
          }
        }
      `}</style>
    </div>
  );
}