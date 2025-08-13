// Server Component - Pure typography components with no client-side logic
import React from "react";
import { cn } from "@/lib/utils";

// Heading components
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "muted";
}

const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, variant = "primary", ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("text-h1 font-head", className)}
      style={{ 
        color: variant === "primary" ? 'var(--text-primary)' : 
               variant === "secondary" ? 'var(--text-secondary)' : 'var(--text-muted)'
      }}
      {...props}
    >
      {children}
    </h1>
  )
);
H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, variant = "primary", ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-h2 font-head", className)}
      style={{ 
        color: variant === "primary" ? 'var(--text-primary)' : 
               variant === "secondary" ? 'var(--text-secondary)' : 'var(--text-muted)'
      }}
      {...props}
    >
      {children}
    </h2>
  )
);
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, variant = "primary", ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-h3 font-head", className)}
      style={{ 
        color: variant === "primary" ? 'var(--text-primary)' : 
               variant === "secondary" ? 'var(--text-secondary)' : 'var(--text-muted)'
      }}
      {...props}
    >
      {children}
    </h3>
  )
);
H3.displayName = "H3";

const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, variant = "primary", ...props }, ref) => (
    <h4
      ref={ref}
      className={cn("text-h4 font-head", className)}
      style={{ 
        color: variant === "primary" ? 'var(--text-primary)' : 
               variant === "secondary" ? 'var(--text-secondary)' : 'var(--text-muted)'
      }}
      {...props}
    >
      {children}
    </h4>
  )
);
H4.displayName = "H4";

const H5 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, variant = "primary", ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("text-h5 font-head", className)}
      style={{ 
        color: variant === "primary" ? 'var(--text-primary)' : 
               variant === "secondary" ? 'var(--text-secondary)' : 'var(--text-muted)'
      }}
      {...props}
    >
      {children}
    </h5>
  )
);
H5.displayName = "H5";

// Display and Hero text
interface DisplayTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

const DisplayText = React.forwardRef<HTMLHeadingElement, DisplayTextProps>(
  ({ className, children, as: Component = "h1", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("text-display font-head", className)}
      style={{ color: 'var(--text-primary)' }}
      {...props}
    >
      {children}
    </Component>
  )
);
DisplayText.displayName = "DisplayText";

const HeroText = React.forwardRef<HTMLHeadingElement, DisplayTextProps>(
  ({ className, children, as: Component = "h1", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("text-hero font-head", className)}
      style={{ color: 'var(--text-primary)' }}
      {...props}
    >
      {children}
    </Component>
  )
);
HeroText.displayName = "HeroText";

// Body text components
interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "muted";
  size?: "small" | "default" | "large";
}

const BodyText = React.forwardRef<HTMLParagraphElement, BodyTextProps>(
  ({ className, children, variant = "primary", size = "default", ...props }, ref) => {
    const sizeClasses = {
      small: "text-body-small",
      default: "text-body",
      large: "text-body-large"
    };
    
    return (
      <p
        ref={ref}
        className={cn(sizeClasses[size], "font-body", className)}
        style={{ 
          color: variant === "primary" ? 'var(--text-primary)' : 
                 variant === "secondary" ? 'var(--text-secondary)' : 'var(--text-muted)'
        }}
        {...props}
      >
        {children}
      </p>
    );
  }
);
BodyText.displayName = "BodyText";

// Caption text
interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "muted";
}

const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, children, variant = "muted", ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-caption", className)}
      style={{ 
        color: variant === "primary" ? 'var(--text-primary)' : 
               variant === "secondary" ? 'var(--text-secondary)' : 'var(--text-muted)'
      }}
      {...props}
    >
      {children}
    </span>
  )
);
Caption.displayName = "Caption";

// Interactive text (buttons, links)
interface InteractiveTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "button" | "link";
}

const InteractiveText = React.forwardRef<HTMLSpanElement, InteractiveTextProps>(
  ({ className, children, variant = "button", ...props }, ref) => {
    const variantClasses = {
      button: "text-button",
      link: "text-link"
    };
    
    return (
      <span
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
InteractiveText.displayName = "InteractiveText";

export {
  H1,
  H2,
  H3,
  H4,
  H5,
  DisplayText,
  HeroText,
  BodyText,
  Caption,
  InteractiveText
};