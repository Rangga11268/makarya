import React from "react";
import { cn } from "../../utils/cn";
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X, 
  ShieldCheck, 
  Sparkles 
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
    info: "bg-canvas border-border text-dark-900",
    brand: "bg-brand-indigo-light/50 border-brand-indigo/20 text-brand-indigo",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    danger: "bg-rose-50 border-rose-200 text-rose-900",
  };

  const defaultIcons = {
    info: Info,
    brand: Sparkles,
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
        className
      )}
    >
      <IconComponent className={cn("w-4 h-4 shrink-0 mt-0.5", iconColors[variant])} />
      
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-bold text-dark-900 tracking-tight">{title}</h5>}
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