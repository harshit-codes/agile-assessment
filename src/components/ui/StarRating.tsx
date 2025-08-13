import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 1-5 rating
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = "md",
  className,
  showCount = false
}) => {
  // Ensure rating is between 0 and maxStars
  const clampedRating = Math.max(0, Math.min(maxStars, rating));
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxStars; i++) {
      const filled = i <= clampedRating;
      const isPartial = !filled && i - 1 < clampedRating && clampedRating < i;
      
      stars.push(
        <div key={i} className="relative">
          <Star
            className={cn(
              sizeClasses[size],
              "transition-all duration-300",
              filled 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-muted text-muted-foreground"
            )}
          />
          {isPartial && (
            <Star
              className={cn(
                sizeClasses[size],
                "absolute top-0 left-0 fill-yellow-400 text-yellow-400 transition-all duration-300"
              )}
              style={{
                clipPath: `inset(0 ${100 - ((clampedRating - (i - 1)) * 100)}% 0 0)`
              }}
            />
          )}
        </div>
      );
    }
    
    return stars;
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex items-center space-x-0.5">
        {renderStars()}
      </div>
      {showCount && (
        <span className="text-body-small text-muted-foreground ml-2">
          {clampedRating.toFixed(1)}/{maxStars}
        </span>
      )}
    </div>
  );
};

// Helper function to convert score to star rating
export const scoreToStars = (score: number): number => {
  // Convert -2 to +2 scale to 1-5 stars
  // -2 = 1 star, 0 = 3 stars, +2 = 5 stars
  return Math.round(((score + 2) / 4) * 4) + 1;
};