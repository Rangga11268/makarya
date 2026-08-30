import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg", className }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog Box / Bottom Sheet Card */}
      <div
        className={cn(
          "relative w-full bg-surface rounded-t-[32px] sm:rounded-3xl border-t sm:border border-border shadow-2xl z-10 p-6 sm:p-7 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto font-sans animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-250 ease-out",
          maxWidth,
          className
        )}
      >
        {/* Mobile Drag Pill Indicator */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <h3 className="text-base sm:text-lg font-bold text-dark-900 tracking-tight font-sans">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-dark-900 hover:bg-canvas transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 pb-2 sm:pb-0">{children}</div>
      </div>
    </div>
  );
}