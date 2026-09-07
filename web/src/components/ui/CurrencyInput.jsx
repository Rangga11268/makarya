import React from "react";
import { cn } from "../../utils/cn";
import { terbilangRupiah, formatNumberDots } from "../../utils/terbilang";
import { X, Sparkles } from "lucide-react";

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
  // Format raw numeric value to string with dot thousand separator (e.g. 750000 -> "750.000")
  const formatNumberWithDots = (num) => {
    if (num === "" || num === null || num === undefined) return "";
    const cleanStr = String(num).replace(/\D/g, "");
    if (!cleanStr) return "";
    return cleanStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const rawNumericString = String(value ?? "").replace(/\D/g, "");
  const numericVal = rawNumericString ? parseInt(rawNumericString, 10) : "";
  const displayValue = formatNumberDots(rawNumericString);
  const terbilangText = showTerbilang && numericVal > 0 ? terbilangRupiah(numericVal) : "";

  const handleInputChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const numericVal = rawVal ? parseInt(rawVal, 10) : "";
    onChange?.(numericVal);
    const cleanStr = e.target.value.replace(/\D/g, "");
    const val = cleanStr ? parseInt(cleanStr, 10) : "";
    onChange?.(val);
  };

  const displayValue = formatNumberWithDots(value);
  const handleClear = () => {
    onChange?.("");
  };

  const handleQuickSelect = (nom) => {
    onChange?.(nom);
  };

  return (
    <div className={cn("flex flex-col gap-1.5 font-sans", className)}>
    <div className={cn("flex flex-col gap-1.5 font-sans text-left", className)}>
      {label && (
        <label className="text-xs font-bold text-dark-900 tracking-tight uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        <label className="text-xs font-bold text-dark-900 tracking-tight flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted font-bold text-xs select-none">
            {prefix}
          <div className="absolute left-2.5 px-2.5 py-1 rounded-lg bg-canvas border border-border flex items-center pointer-events-none select-none">
            <span className="text-xs font-extrabold text-brand-indigo font-sans">{prefix}</span>
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
            "w-full rounded-xl border bg-canvas py-2.5 text-xs sm:text-sm font-semibold text-dark-900 placeholder:text-muted/60 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/10",
            prefix ? "pl-10 pr-4" : "px-4",
            "w-full rounded-2xl border bg-surface py-2.5 text-sm sm:text-base font-bold text-dark-900 placeholder:text-muted/50 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/15",
            prefix ? "pl-14 pr-9" : "px-4",
            error
              ? "border-rose-300 focus:border-rose-500 bg-rose-50/30"
              : "border-border focus:border-brand-indigo",
              ? "border-rose-300 focus:border-rose-500 bg-rose-50/20"
              : "border-border focus:border-brand-indigo shadow-2xs",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100"
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

      {error && <span className="text-[11px] font-medium text-rose-600">{error}</span>}
      {/* Terbilang Preview */}
      {terbilangText && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-brand-indigo italic pl-1 animate-in fade-in duration-150">
          <Sparkles className="w-3 h-3 shrink-0" />
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
                    : "bg-canvas border-border text-muted hover:text-dark-900 hover:bg-surface"
                )}
              >
                Rp {formatNumberDots(nom)}
              </button>
            );
          })}
        </div>
      )}

      {error && <span className="text-xs font-medium text-rose-600 pl-1">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-muted font-normal leading-snug">{helperText}</span>
        <span className="text-[11px] text-muted font-normal leading-snug pl-1">{helperText}</span>
      )}
    </div>
  );
}