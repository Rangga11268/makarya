import React from "react";
import { cn } from "../../utils/cn";
import { AppleGlossyCard } from "./AppleGlossyCard";

export { AppleGlossyCard };

export function Card({
  children,
  className,
  hover = false,
  variant = "glossy",
  ...props
}) {
  if (variant === "glossy" || variant === "apple") {
    return (
      <AppleGlossyCard
        hover={hover}
        className={className}
        {...props}
      >
        {children}
      </AppleGlossyCard>
    );
  }

  return (
    <div
      className={cn(
        "bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/60 ring-inset transition-all duration-200",
        hover && "hover:border-slate-300 hover:shadow-[0_14px_45px_rgb(0,0,0,0.08)] cursor-pointer hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
