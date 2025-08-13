"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { personalityTypes, PersonalityType } from "@/data/personality-types";
import { H4, BodyText, Caption } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pause, Play } from "lucide-react";

interface PersonalityCardProps {
  personality: PersonalityType;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const PersonalityCard = forwardRef<HTMLDivElement, PersonalityCardProps>(
  ({ personality, onClick, className = "", style, ...rest }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        ref={ref}
        className={`personality-swap-card ${className}`}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        {...rest}
      >
        {/* Background with gradient */}
        <div 
          className="personality-swap-card__background"
          style={{
            background: personality.gradient || "linear-gradient(145deg, #4F46E5, #000)",
          }}
        />
        
        {/* Content overlay */}
        <div className="personality-swap-card__content">
          {/* Header with emoji and code */}
          <div className="personality-swap-card__header">
            <span className="personality-swap-card__emoji">
              {personality.name.split(' ')[0]}
            </span>
            <Caption 
              className="personality-swap-card__code"
              style={{ color: personality.borderColor || "#4F46E5" }}
            >
              {personality.shortName}
            </Caption>
          </div>

          {/* Main content */}
          <div className="personality-swap-card__main">
            <H4 className="personality-swap-card__title">
              {personality.name.slice(3)} {/* Remove emoji */}
            </H4>
            <BodyText size="small" variant="secondary" className="personality-swap-card__description">
              {personality.description}
            </BodyText>
          </div>

          {/* Hover details */}
          <div className={`personality-swap-card__details ${isHovered ? 'visible' : ''}`}>
            <div className="personality-swap-card__career-paths">
              <Caption className="font-medium mb-1">Career Paths:</Caption>
              {personality.careerPaths.slice(0, 2).map((path, index) => (
                <Caption key={index} className="opacity-80">
                  • {path}
                </Caption>
              ))}
            </div>
          </div>

          {/* Click indicator */}
          <div className="personality-swap-card__cta">
            <Caption className="opacity-60">
              Click to start assessment →
            </Caption>
          </div>
        </div>

        <style jsx>{`
          .personality-swap-card {
            @apply relative rounded-xl border-2 cursor-pointer;
            @apply transition-all duration-300 ease-out;
            @apply bg-gradient-to-br from-slate-900/90 to-slate-800/90;
            @apply backdrop-blur-sm overflow-hidden;
            border-color: ${personality.borderColor || "#4F46E5"}40;
            transform-style: preserve-3d;
            will-change: transform;
            backface-visibility: hidden;
          }

          .personality-swap-card:hover {
            border-color: ${personality.borderColor || "#4F46E5"}80;
            box-shadow: 
              0 20px 40px -10px rgba(0, 0, 0, 0.4),
              0 0 30px -5px ${personality.borderColor || "#4F46E5"}30;
          }

          .personality-swap-card__background {
            @apply absolute inset-0 opacity-10 transition-opacity duration-300;
          }

          .personality-swap-card:hover .personality-swap-card__background {
            @apply opacity-20;
          }

          .personality-swap-card__content {
            @apply relative z-10 h-full flex flex-col p-6;
            min-height: 280px;
          }

          .personality-swap-card__header {
            @apply flex items-center justify-between mb-4;
          }

          .personality-swap-card__emoji {
            @apply text-3xl;
          }

          .personality-swap-card__code {
            @apply px-3 py-1 rounded-md bg-white/10 border border-white/20;
            @apply font-mono text-sm font-semibold;
          }

          .personality-swap-card__main {
            @apply flex-1 mb-4;
          }

          .personality-swap-card__title {
            @apply mb-3 text-white;
          }

          .personality-swap-card__description {
            @apply leading-relaxed line-clamp-4;
          }

          .personality-swap-card__details {
            @apply mb-4 min-h-[4rem] transition-all duration-300;
            @apply opacity-0 translate-y-2;
          }

          .personality-swap-card__details.visible {
            @apply opacity-100 translate-y-0;
          }

          .personality-swap-card__cta {
            @apply text-center mt-auto;
          }

          /* Mobile responsive */
          @media (max-width: 768px) {
            .personality-swap-card__content {
              @apply p-5;
              min-height: 240px;
            }
            
            .personality-swap-card__emoji {
              @apply text-2xl;
            }
            
            .personality-swap-card__description {
              @apply line-clamp-3;
            }
          }

          @media (max-width: 480px) {
            .personality-swap-card__content {
              @apply p-4;
              min-height: 220px;
            }
            
            .personality-swap-card__emoji {
              @apply text-xl;
            }
            
            .personality-swap-card__description {
              @apply line-clamp-2;
            }
          }
        `}</style>
      </div>
    );
  }
);

PersonalityCard.displayName = "PersonalityCard";

interface PersonalityCardSwapProps {
  onStartAssessment?: () => void;
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  skewAmount?: number;
  easing?: "elastic" | "smooth";
  className?: string;
}

// Create slots for card positioning
const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: ReturnType<typeof makeSlot>, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

export default function PersonalityCardSwap({
  onStartAssessment,
  width = 320,
  height = 280,
  cardDistance = 35,
  verticalDistance = 45,
  delay = 4000,
  pauseOnHover = true,
  skewAmount = 3,
  easing = "elastic",
  className = "",
}: PersonalityCardSwapProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const config = easing === "elastic"
    ? {
        ease: "elastic.out(0.6,0.9)",
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05,
      }
    : {
        ease: "power1.inOut",
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.2,
      };

  const refs = useMemo(
    () => personalityTypes.map(() => React.createRef<HTMLDivElement>()),
    []
  );

  const order = useRef(
    Array.from({ length: personalityTypes.length }, (_, i) => i)
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(
          r.current,
          makeSlot(i, cardDistance, verticalDistance, total),
          skewAmount
        );
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      // Update current personality index
      setCurrentIndex(front);

      tl.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length
      );
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return"
      );
      tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
      tl.to(
        elFront,
        {
          y: backSlot.y,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return"
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    if (!isPaused) {
      swap();
      intervalRef.current = setInterval(swap, delay);
    }

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
      const resume = () => {
        if (!isPaused) {
          tlRef.current?.play();
          intervalRef.current = setInterval(swap, delay);
        }
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    easing,
    isPaused,
    config.durDrop,
    config.durMove,
    config.durReturn,
    config.ease,
    config.promoteOverlap,
    config.returnDelay,
    refs,
  ]);

  const handleCardClick = (personality: PersonalityType) => {
    // Add some feedback
    console.log(`Clicked on ${personality.name}`);
    onStartAssessment?.();
  };

  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    if (!newPausedState) {
      // Resume - will be handled by useEffect
      tlRef.current?.play();
    } else {
      // Pause
      tlRef.current?.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  return (
    <div className={`personality-card-swap-wrapper ${className}`}>
      {/* Info and Controls */}
      <div className="personality-card-swap-info">
        <div className="text-center mb-6">
          <H4 className="mb-2">
            Currently Showing: {personalityTypes[currentIndex]?.name.slice(3) || "Loading..."}
          </H4>
          <BodyText size="small" variant="secondary">
            {personalityTypes[currentIndex]?.description || ""}
          </BodyText>
        </div>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePause}
            className="flex items-center space-x-2"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </Button>
          
          <Button 
            size="sm" 
            onClick={onStartAssessment}
            className="flex items-center space-x-2"
          >
            <span>Take Assessment</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Card Swap Container */}
      <div
        ref={container}
        className="personality-card-swap-container"
        style={{ width, height }}
      >
        {personalityTypes.map((personality, i) => (
          <PersonalityCard
            key={personality.shortName}
            ref={refs[i]}
            personality={personality}
            onClick={() => handleCardClick(personality)}
            style={{ width, height }}
          />
        ))}
      </div>

      <style jsx>{`
        .personality-card-swap-wrapper {
          @apply flex flex-col items-center justify-center py-16;
        }

        .personality-card-swap-info {
          @apply max-w-md mx-auto mb-8;
        }

        .personality-card-swap-container {
          @apply relative;
          perspective: 1000px;
          overflow: visible;
          transform-origin: center center;
        }

        /* Responsive scaling */
        @media (max-width: 768px) {
          .personality-card-swap-container {
            transform: scale(0.85);
          }
          
          .personality-card-swap-info {
            @apply px-4;
          }
        }

        @media (max-width: 640px) {
          .personality-card-swap-container {
            transform: scale(0.75);
          }
        }

        @media (max-width: 480px) {
          .personality-card-swap-container {
            transform: scale(0.65);
          }
          
          .personality-card-swap-info {
            @apply px-2 mb-4;
          }
        }

        @media (max-width: 360px) {
          .personality-card-swap-container {
            transform: scale(0.55);
          }
        }
      `}</style>
    </div>
  );
}