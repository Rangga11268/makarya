import React from "react";
import { cn } from "../../utils/cn";
import { AppleGlossyCard } from "./AppleGlossyCard";

export { AppleGlossyCard };

export function Card({
  children,
  className,
  hover = false,
  variant = "default",
  ...props
}) {
  if (variant === "glossy" || variant === "apple") {
    return (
      <AppleGlossyCard hover={hover} className={className} {...props}>
        {children}
      </AppleGlossyCard>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-2xs transition-all duration-200",
        hover &&
          "hover:border-slate-300 hover:shadow-xs cursor-pointer hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
