import React from "react";
import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

export function StarRating({ rating = 0, totalReviews, size = "sm", className }) {
  const numRating = typeof rating === "number" ? rating : parseFloat(rating) || 0;
  
  const starSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSizes[size],
              star <= Math.round(numRating)
                ? "fill-amber-400 text-amber-400"
                : "fill-border text-border"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-dark-900 ml-1 font-sans">
        {numRating > 0 ? numRating.toFixed(1) : "Baru"}
      </span>
      {totalReviews !== undefined && (
        <span className="text-[11px] text-muted font-normal">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}