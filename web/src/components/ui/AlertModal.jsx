import React, { useEffect } from "react";
import { useAlertStore } from "../../store/alertStore";
import { 
  AlertSuccessSvg, 
  AlertErrorSvg, 
  AlertWarningSvg, 
  AlertInfoSvg, 
  AlertConfirmSvg 
} from "./AlertIcons";
import { cn } from "../../utils/cn";

export function AlertModal() {
  const {
    isOpen,
    type,
    title,
    message,
    confirmText,
    cancelText,
    showCancel,
    isDestructive,
    onConfirm,
    onCancel,
    hideAlert,
  } = useAlertStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        hideAlert();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, hideAlert]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    hideAlert();
    onConfirm?.();
  };

  const handleCancel = () => {
    hideAlert();
    onCancel?.();
  };

  const getAlertIcon = () => {
    switch (type) {
      case "success":
        return <AlertSuccessSvg size={60} />;
      case "error":
        return <AlertErrorSvg size={60} />;
      case "warning":
        return <AlertWarningSvg size={60} />;
      case "confirm":
        return <AlertConfirmSvg size={60} />;
      case "info":
      default:
        return <AlertInfoSvg size={60} />;
    }
  };

  const themes = {
    success: {
      bg: "bg-emerald-50/80",
      border: "border-emerald-200",
      buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
    },
    error: {
      bg: "bg-rose-50/80",
      border: "border-rose-200",
      buttonBg: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20",
    },
    warning: {
      bg: "bg-amber-50/80",
      border: "border-amber-200",
      buttonBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
    },
    confirm: {
      bg: "bg-indigo-50/80",
      border: "border-indigo-200",
      buttonBg: isDestructive 
        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
        : "bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-brand",
    },
    info: {
      bg: "bg-sky-50/80",
      border: "border-sky-200",
      buttonBg: "bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-brand",
    },
  };

  const currentTheme = themes[type] || themes.info;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={hideAlert}
      />

      {/* Centered Modal Card */}
      <div className="relative w-full max-w-[380px] bg-surface rounded-[28px] border border-border shadow-2xl p-6 sm:p-7 flex flex-col items-center text-center z-10 animate-in zoom-in-95 fade-in duration-200">
        
        {/* Top Circular Icon Ring with Rich SVG (Tunggal Jaya Transport Style) */}
        <div
          className={cn(
            "w-20 h-20 rounded-full border-2 flex items-center justify-center mb-4.5 shadow-2xs transition-transform duration-300 hover:scale-105",
            currentTheme.bg,
            currentTheme.border
          )}
        >
          {getAlertIcon()}
        </div>

        {/* Title & Message */}
        <h3 className="text-lg font-black text-dark-900 tracking-tight font-sans mb-2">
          {title}
        </h3>

        {message && (
          <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-normal mb-6 px-1">
            {message}
          </p>
        )}

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-2.5 mt-1">
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-canvas hover:bg-slate-200/70 text-dark-900 border border-border transition-all select-none cursor-pointer"
            >
              {cancelText || "Batal"}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              "py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all select-none cursor-pointer",
              showCancel ? "flex-[1.3]" : "w-full",
              currentTheme.buttonBg
            )}
          >
            {confirmText || "Mengerti"}
          </button>
        </div>

      </div>
    </div>
  );
}