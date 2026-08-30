import React from "react";
import { cn } from "../../utils/cn";

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

  const handleInputChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const numericVal = rawVal ? parseInt(rawVal, 10) : "";
    onChange?.(numericVal);
  };

  const displayValue = formatNumberWithDots(value);

  return (
    <div className={cn("flex flex-col gap-1.5 font-sans", className)}>
      {label && (
        <label className="text-xs font-bold text-dark-900 tracking-tight uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted font-bold text-xs select-none">
            {prefix}
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
            error
              ? "border-rose-300 focus:border-rose-500 bg-rose-50/30"
              : "border-border focus:border-brand-indigo",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100"
          )}
          {...props}
        />
      </div>

      {error && <span className="text-[11px] font-medium text-rose-600">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-muted font-normal leading-snug">{helperText}</span>
      )}
    </div>
  );
}