import React from "react";
import { Lock, FileCode2, CheckCircle2, UserCheck, Sparkles, Send } from "lucide-react";
import { cn } from "../../utils/cn";

export function HowItWorksStep({ stepNumber, title, description, iconName, isHighlight = false }) {
  const iconMap = {
    escrow: Lock,
    account: UserCheck,
    work: FileCode2,
    apply: Send,
    complete: CheckCircle2,
    sparkle: Sparkles,
  };

  const IconComponent = iconMap[iconName] || (stepNumber === 1 ? Lock : (stepNumber === 2 ? FileCode2 : CheckCircle2));

  return (
    <div
      className={cn(
        "rounded-3xl p-7 sm:p-8 flex flex-col justify-between h-full transition-all duration-200 border select-none group",
        isHighlight
          ? "bg-brand-indigo text-white border-brand-indigo shadow-brand"
          : "bg-surface hover:bg-slate-50/80 text-dark-900 border-border shadow-xs"
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs",
              isHighlight
                ? "bg-white/20 text-white"
                : "bg-brand-indigo-light text-brand-indigo"
            )}
          >
            <IconComponent className="w-6 h-6 stroke-[2]" />
          </div>

          <span
            className={cn(
              "text-xs font-extrabold px-3 py-1 rounded-full border font-sans",
              isHighlight
                ? "bg-white/15 text-white border-white/20"
                : "bg-canvas text-muted border-border"
            )}
          >
            0{stepNumber}
          </span>
        </div>

        <h3
          className={cn(
            "text-base sm:text-lg font-bold tracking-tight font-sans mb-2.5",
            isHighlight ? "text-white" : "text-dark-900"
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "text-xs sm:text-sm leading-relaxed font-sans font-normal",
            isHighlight ? "text-slate-200" : "text-muted"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}