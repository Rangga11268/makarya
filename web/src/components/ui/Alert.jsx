import React from "react";
import { cn } from "../../utils/cn";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ShieldCheck,
} from "lucide-react";

export function Alert({
  variant = "info",
  title,
  children,
  onClose,
  className,
  icon: CustomIcon,
}) {
  const variantStyles = {
    info: "bg-slate-50/80 border-slate-200/80 text-slate-800",
    brand: "bg-blue-50/60 border-blue-200/70 text-blue-900",
    success: "bg-emerald-50/70 border-emerald-200/80 text-emerald-950",
    warning: "bg-amber-50/70 border-amber-200/80 text-amber-950",
    danger: "bg-rose-50/70 border-rose-200/80 text-rose-950",
  };

  const defaultIcons = {
    info: Info,
    brand: ShieldCheck,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: AlertCircle,
  };

  const IconComponent = CustomIcon || defaultIcons[variant] || Info;

  const iconColors = {
    info: "text-brand-indigo",
    brand: "text-brand-indigo",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-rose-600",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed transition-all",
        variantStyles[variant] || variantStyles.info,
        className,
      )}
    >
      <IconComponent
        className={cn("w-4 h-4 shrink-0 mt-0.5", iconColors[variant])}
      />

      <div className="flex-1 space-y-0.5">
        {title && (
          <h5 className="font-bold text-dark-900 tracking-tight">{title}</h5>
        )}
        <div className="font-medium opacity-90">{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 -mr-1 -mt-1 text-muted hover:text-dark-900 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
