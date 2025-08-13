"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StandardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const StandardCard = React.forwardRef<HTMLDivElement, StandardCardProps>(
  ({ variant = "default", size = "md", className, children, ...props }, ref) => {
    const baseClasses = "rounded-2xl transition-all duration-300 group relative overflow-hidden";
    
    const variants = {
      default: "bg-card/50 border border-border/50 hover:bg-card/70 hover:border-border/70 hover:shadow-lg",
      elevated: "bg-card/80 border border-border backdrop-blur-sm shadow-lg hover:shadow-2xl hover:bg-card/90 hover:border-primary/30",
      outlined: "bg-transparent border-2 border-border hover:border-primary/30 hover:bg-card/20 hover:shadow-lg",
      filled: "bg-card border border-border/30 shadow-sm hover:shadow-lg hover:bg-card/90"
    };

    const sizes = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        onMouseMove={handleMouseMove}
        {...props}
        style={{
          ...props.style,
          position: 'relative'
        }}
      >
        {/* Glow effect overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(
              300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              color-mix(in srgb, var(--primary) 10%, transparent) 0%,
              color-mix(in srgb, var(--primary) 5%, transparent) 20%,
              transparent 50%
            )`
          }}
        />
        
        {/* Card border glow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            boxShadow: `0 0 30px -5px color-mix(in srgb, var(--primary) 20%, transparent)`
          }}
        />
        
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    );
  }
);

StandardCard.displayName = "StandardCard";

// Header component for cards
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

// Title component for cards
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("text-h4 text-text-primary", className)}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = "CardTitle";

// Description component for cards
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-body-small", className)}
      style={{ color: 'var(--text-secondary)' }}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = "CardDescription";

// Content component for cards
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

export {
  StandardCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
};