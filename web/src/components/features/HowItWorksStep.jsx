import React from "react";
import { UserCheck, FileText, Send, CheckCircle2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function HowItWorksStep({ stepNumber, title, description, iconName }) {
  const iconMap = {
    account: UserCheck,
    profile: FileText,
    apply: Send,
    complete: CheckCircle2,
  };

  const IconComponent = iconMap[iconName] || UserCheck;

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 flex flex-col justify-between h-full shadow-xs hover:border-brand-indigo/30 transition-all">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-11 h-11 rounded-xl bg-canvas border border-border flex items-center justify-center text-brand-indigo">
            <IconComponent className="w-5 h-5 stroke-[1.75]" />
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-border bg-canvas text-muted">
            0{stepNumber}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-dark-900 tracking-tight font-sans mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-normal">
          {description}
        </p>
      </div>
    </div>
  );
}