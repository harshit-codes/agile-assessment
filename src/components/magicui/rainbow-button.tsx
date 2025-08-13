import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer group transition-all animate-rainbow",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
    "text-sm font-medium whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    "overflow-hidden",
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 before:opacity-100",
    "after:absolute after:inset-0 after:bg-gradient-to-r after:from-pink-500 after:via-red-500 after:to-yellow-500 after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-100"
  ),
  {
    variants: {
      variant: {
        default: "border-0 text-white shadow-2xl",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground before:opacity-20 after:opacity-10"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

interface RainbowButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean;
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(rainbowButtonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Comp>
    );
  }
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton, type RainbowButtonProps };