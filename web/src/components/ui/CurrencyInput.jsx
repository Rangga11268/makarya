import React from "react";
import { cn } from "../../utils/cn";
import { terbilangRupiah, formatNumberDots } from "../../utils/terbilang";
import { X } from "lucide-react";

export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "0",
  helperText,
  error,
  required = false,
  disabled = false,
  prefix = "Rp",
  showTerbilang = true,
  quickNominals,
  className,
  ...props
}) {
  const rawNumericString = String(value ?? "").replace(/\D/g, "");
  const numericVal = rawNumericString ? parseInt(rawNumericString, 10) : "";
  const displayValue = formatNumberDots(rawNumericString);
  const terbilangText =
    showTerbilang && numericVal > 0 ? terbilangRupiah(numericVal) : "";

  const handleInputChange = (e) => {
    const cleanStr = e.target.value.replace(/\D/g, "");
    const val = cleanStr ? parseInt(cleanStr, 10) : "";
    onChange?.(val);
  };

  const handleClear = () => {
    onChange?.("");
  };

  const handleQuickSelect = (nom) => {
    onChange?.(nom);
  };

  return (
    <div className={cn("flex flex-col gap-1.5 font-sans text-left", className)}>
      {label && (
        <label className="text-xs font-bold text-dark-900 tracking-tight flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-2.5 px-2.5 py-1 rounded-lg bg-canvas border border-border flex items-center pointer-events-none select-none">
            <span className="text-xs font-extrabold text-brand-indigo font-sans">
              {prefix}
            </span>
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full rounded-2xl border bg-surface py-2.5 text-sm sm:text-base font-bold text-dark-900 placeholder:text-muted/50 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/15",
            "w-full rounded-2xl border bg-surface py-2.5 text-base sm:text-sm font-bold text-dark-900 placeholder:text-muted/50 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/15",
            prefix ? "pl-14 pr-9" : "px-4",
            error
              ? "border-rose-300 focus:border-rose-500 bg-rose-50/20"
              : "border-border focus:border-brand-indigo shadow-2xs",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100",
          )}
          {...props}
        />

        {displayValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-muted hover:text-dark-900 hover:bg-canvas transition-colors"
            title="Bersihkan input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Terbilang Preview */}
      {terbilangText && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-brand-indigo italic pl-1 animate-in fade-in duration-150">
          <span className="text-muted">•</span>
          <span className="truncate">{terbilangText}</span>
        </div>
      )}

      {/* Optional Quick Nominal Chips */}
      {Array.isArray(quickNominals) && quickNominals.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickNominals.map((nom) => {
            const isSelected = numericVal === nom;
            return (
              <button
                key={nom}
                type="button"
                onClick={() => handleQuickSelect(nom)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                  isSelected
                    ? "bg-brand-indigo text-white border-brand-indigo shadow-xs"
                    : "bg-canvas border-border text-muted hover:text-dark-900 hover:bg-surface",
                )}
              >
                Rp {formatNumberDots(nom)}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <span className="text-xs font-medium text-rose-600 pl-1">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-[11px] text-muted font-normal leading-snug pl-1">
          {helperText}
        </span>
      )}
    </div>
  );
}
