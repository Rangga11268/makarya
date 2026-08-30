import React from "react";
import { cn } from "../../utils/cn";

export function SectionHeader({
  badgeText,
  title,
  subtitle,
  centered = false,
  action,
  className
}) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8", centered && "text-center items-center", className)}>
      <div className={cn("space-y-2 max-w-2xl", centered && "mx-auto")}>
        {badgeText && (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-brand-indigo-light text-brand-indigo text-[11px] font-bold tracking-wider uppercase border border-brand-indigo/15">
            {badgeText}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-serif font-normal text-dark-900 tracking-tight leading-snug">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-normal">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}