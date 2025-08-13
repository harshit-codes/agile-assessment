"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { personalityTypes } from "@/data/personality-types";
import { H4, BodyText, Caption } from "@/components/ui/Typography";

interface ChromaGridItem {
  image?: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  gradient: string;
  url?: string;
  emoji?: string;
  description?: string;
}

interface ChromaGridProps {
  items?: ChromaGridItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  onCardClick?: (item: ChromaGridItem, index: number) => void;
}

export default function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 4,
  rows = 4,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  onCardClick,
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((value: any) => void) | null>(null);
  const setY = useRef<((value: any) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  // Convert personality types to ChromaGrid format
  const data: ChromaGridItem[] = items || personalityTypes.map((personality) => ({
    image: personality.characterImage,
    emoji: personality.name.split(' ')[0],
    title: personality.name.slice(3), // Remove emoji
    subtitle: personality.shortName,
    handle: personality.characterPersona || personality.description.slice(0, 60) + (personality.description.length > 60 ? '...' : ''),
    borderColor: personality.borderColor || "#4F46E5",
    gradient: personality.gradient || "linear-gradient(145deg, #4F46E5, #000)",
    description: personality.description,
  }));

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, "--x", "px") as any;
    setY.current = gsap.quickSetter(el, "--y", "px") as any;
    
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current?.(pos.current.x);
    setY.current?.(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: 1,
        duration: fadeOut,
        overwrite: true,
      });
    }
  };

  // Removed click functionality - cards are now display-only
  
  // Helper function to decode personality codes
  const decodePersonalityCode = (code: string): string => {
    if (code.length !== 4) return '';
    
    const workStyle = code[0] === 'S' ? 'Structured' : 'Dynamic';
    const decisionProcess = code[1] === 'E' ? 'Evidence-based' : 'Intuitive';
    const communicationStyle = code[2] === 'D' ? 'Direct' : 'Harmonizing';
    const focusOrientation = code[3] === 'V' ? 'Visionary' : 'People-centered';
    
    return `${workStyle}, ${decisionProcess}, ${communicationStyle}, ${focusOrientation}`;
  };

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((item, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          style={
            {
              "--card-border": item.borderColor,
              "--card-gradient": item.gradient,
            } as React.CSSProperties
          }
        >
          <div className="chroma-card-inner">
            {/* Front Side */}
            <div className="chroma-card-front">
              <div className="chroma-img-wrapper">
                {item.image ? (
                  <img src={item.image} alt={item.title} loading="lazy" className="chroma-character-img" />
                ) : item.emoji ? (
                  <div className="chroma-emoji">
                    {item.emoji}
                  </div>
                ) : (
                  <div className="chroma-placeholder">
                    {item.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <footer className="chroma-info">
                <H4 className="chroma-name">{item.title}</H4>
              </footer>
            </div>

            {/* Back Side */}
            <div className="chroma-card-back">
              <div className="chroma-back-content">
                <div className="chroma-code-wrapper">
                  <Caption className="chroma-code">{item.subtitle}</Caption>
                  <br />
                  <Caption className="chroma-code-full">
                    ({decodePersonalityCode(item.subtitle || '')})
                  </Caption>
                </div>
                <div className="chroma-description-wrapper">
                  <BodyText size="small" className="chroma-description">
                    {item.description}
                  </BodyText>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
      
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />

      <style jsx>{`
        .chroma-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
          min-height: 90vh;
          height: auto;
          padding: 3rem;
          margin: 0 auto;
          overflow: hidden;
        }

        .chroma-card {
          position: relative;
          border-radius: 1rem;
          perspective: 1000px;
          transition: all 0.3s ease;
          overflow: visible;
          min-height: 280px;
        }

        .chroma-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .chroma-card:hover .chroma-card-inner {
          transform: rotateY(180deg);
        }

        .chroma-card-front,
        .chroma-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
          background: rgba(15, 23, 42, 0.8);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .chroma-card-front {
          justify-content: flex-start;
          align-items: center;
        }

        .chroma-card-back {
          transform: rotateY(180deg);
        }

        .chroma-card-front:hover,
        .chroma-card-back:hover {
          border-color: var(--card-border);
          box-shadow: 
            0 20px 40px -10px rgba(0, 0, 0, 0.3),
            0 0 30px -5px color-mix(in srgb, var(--card-border) 20%, transparent);
        }

        .chroma-card-front::before,
        .chroma-card-back::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--card-gradient);
          opacity: 0.1;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 1rem;
        }

        .chroma-card:hover .chroma-card-front::before,
        .chroma-card:hover .chroma-card-back::before {
          opacity: 0.15;
        }

        .chroma-card-front::after,
        .chroma-card-back::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            300px circle at var(--mouse-x) var(--mouse-y),
            color-mix(in srgb, var(--card-border) 15%, transparent) 0%,
            color-mix(in srgb, var(--card-border) 8%, transparent) 20%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 1rem;
        }

        .chroma-card:hover .chroma-card-front::after,
        .chroma-card:hover .chroma-card-back::after {
          opacity: 1;
        }

        .chroma-img-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 12rem;
          aspect-ratio: 1;
          margin: 0 auto 1rem auto;
          padding: 0.5rem;
          border-radius: 1.25rem;
          background: linear-gradient(135deg, var(--card-border), color-mix(in srgb, var(--card-border) 60%, #000));
          position: relative;
          z-index: 10;
        }

        .chroma-emoji {
          font-size: 4.5rem;
          line-height: 1;
        }

        .chroma-placeholder {
          font-size: 3.5rem;
          font-weight: bold;
          color: white;
        }

        .chroma-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .chroma-character-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .chroma-info {
          text-align: center;
          position: relative;
          z-index: 10;
          width: 100%;
        }

        .chroma-name {
          margin: 0;
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .chroma-handle {
          color: var(--card-border);
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
          opacity: 0.9;
          line-height: 1.3;
          font-size: 0.875rem;
        }

        /* Back side styling */
        .chroma-back-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          text-align: center;
          padding: 0.5rem 0;
        }

        .chroma-code-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          margin: auto 0;
        }

        .chroma-code {
          color: var(--card-border);
          font-weight: 700;
          font-size: 2.5rem;
          padding: 1rem 2rem;
          border: 3px solid var(--card-border);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.15);
          letter-spacing: 0.15em;
          text-shadow: 0 0 10px color-mix(in srgb, var(--card-border) 30%, transparent);
          display: block;
          margin-bottom: 0.75rem;
        }

        .chroma-code-full {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.4;
          opacity: 0.9;
          font-style: italic;
        }

        .chroma-description-wrapper {
          max-width: 100%;
          flex: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0;
        }

        .chroma-description {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          font-size: 0.9rem;
          text-align: center;
        }


        .chroma-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            var(--r) circle at var(--x) var(--y),
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 40%,
            transparent 70%
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .chroma-fade {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            var(--r) circle at var(--x) var(--y),
            transparent 0%,
            rgba(0, 0, 0, 0.1) 70%,
            rgba(0, 0, 0, 0.2) 100%
          );
          pointer-events: none;
        }

        /* Responsive grid adjustments with better scaling */
        
        /* Large Desktop (1200px+) - 4x4 grid */
        @media (min-width: 1200px) {
          .chroma-grid {
            min-height: 85vh;
            padding: 3rem;
          }
        }

        /* Desktop/Large Tablet (1024px - 1199px) - 3 column grid */
        @media (max-width: 1199px) {
          .chroma-grid {
            grid-template-columns: repeat(3, 1fr);
            max-width: 900px;
            min-height: 85vh;
            gap: 1.75rem;
            padding: 2.75rem;
          }
        }

        /* Medium Tablet (768px - 1023px) - 2 column grid */
        @media (max-width: 1023px) {
          .chroma-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 700px;
            min-height: 90vh;
            padding: 2.5rem;
            gap: 1.5rem;
          }
          
          .chroma-card-front,
          .chroma-card-back {
            padding: 1.5rem;
          }
          
          .chroma-img-wrapper {
            max-width: 10rem;
            padding: 0.375rem;
            margin-bottom: 0.875rem;
          }
          
          .chroma-name {
            font-size: 1.1rem;
          }
          
          .chroma-emoji {
            font-size: 3.5rem;
          }
          
          .chroma-placeholder {
            font-size: 2.75rem;
          }
          
          .chroma-code {
            font-size: 2rem;
            padding: 0.875rem 1.5rem;
          }
          
          .chroma-code-full {
            font-size: 0.8rem;
          }
          
          .chroma-description {
            font-size: 0.9rem;
          }
          
          .chroma-card {
            min-height: 250px;
          }
        }

        /* Small Tablet (640px - 767px) - 2x4 grid optimized */
        @media (max-width: 767px) {
          .chroma-grid {
            max-width: 600px;
            min-height: 100vh;
            padding: 2rem;
            gap: 1.25rem;
          }
          
          .chroma-card-front,
          .chroma-card-back {
            padding: 1.25rem;
          }
          
          .chroma-img-wrapper {
            max-width: 8.5rem;
            padding: 0.375rem;
            margin-bottom: 0.75rem;
          }
          
          .chroma-name {
            font-size: 1rem;
          }
          
          .chroma-emoji {
            font-size: 3.25rem;
          }
          
          .chroma-placeholder {
            font-size: 2.5rem;
          }
          
          .chroma-code {
            font-size: 1.875rem;
            padding: 0.75rem 1.25rem;
          }
          
          .chroma-code-full {
            font-size: 0.75rem;
          }
          
          .chroma-description {
            font-size: 0.875rem;
          }
          
          .chroma-card {
            min-height: 220px;
          }
        }

        /* Large Mobile (480px - 639px) - 2x4 grid compact */
        @media (max-width: 639px) {
          .chroma-grid {
            max-width: 500px;
            min-height: 100vh;
            padding: 1.5rem;
            gap: 1rem;
          }
          
          .chroma-card-front,
          .chroma-card-back {
            padding: 1rem;
          }
          
          .chroma-img-wrapper {
            max-width: 7rem;
            padding: 0.25rem;
            margin-bottom: 0.625rem;
          }
          
          .chroma-name {
            font-size: 0.95rem;
          }
          
          .chroma-emoji {
            font-size: 2.75rem;
          }
          
          .chroma-placeholder {
            font-size: 2.25rem;
          }
          
          .chroma-code {
            font-size: 1.5rem;
            padding: 0.625rem 1rem;
          }
          
          .chroma-code-full {
            font-size: 0.7rem;
          }
          
          .chroma-description {
            font-size: 0.8rem;
          }
          
          .chroma-card {
            min-height: 200px;
          }
        }

        /* Small Mobile (320px - 479px) - 1 column grid */
        @media (max-width: 479px) {
          .chroma-grid {
            grid-template-columns: 1fr;
            max-width: 380px;
            min-height: 120vh;
            padding: 1rem;
            gap: 0.75rem;
          }
          
          .chroma-card-front,
          .chroma-card-back {
            padding: 0.875rem;
          }
          
          .chroma-img-wrapper {
            max-width: 6rem;
            padding: 0.25rem;
            margin-bottom: 0.5rem;
          }
          
          .chroma-name {
            font-size: 0.9rem;
          }
          
          .chroma-emoji {
            font-size: 2.5rem;
          }
          
          .chroma-placeholder {
            font-size: 2rem;
          }
          
          .chroma-code {
            font-size: 1.25rem;
            padding: 0.5rem 0.75rem;
          }
          
          .chroma-code-full {
            font-size: 0.65rem;
          }
          
          .chroma-description {
            font-size: 0.75rem;
          }
          
          .chroma-card {
            min-height: 180px;
          }
        }
      `}</style>
    </div>
  );
}