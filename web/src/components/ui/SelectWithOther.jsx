import React, { useState, useEffect } from "react";
import { ChevronDown, Edit3 } from "lucide-react";

export function SelectWithOther({
  label,
  options = [],
  value = "",
  onChange,
  placeholder = "-- Pilih Opsi --",
  otherPlaceholder = "Ketik pilihan Anda...",
  otherLabel = "Lainnya (Ketik Sendiri)",
  required = false,
  icon: Icon = null,
  helperText = "",
  className = "",
  disabled = false,
}) {
  const isPredefined = options.includes(value);
  const [isOther, setIsOther] = useState(!isPredefined && Boolean(value));
  const [customValue, setCustomValue] = useState(
    !isPredefined && value ? value : "",
  );

  useEffect(() => {
    if (options.includes(value)) {
      setIsOther(false);
      setCustomValue("");
    } else if (value) {
      setIsOther(true);
      setCustomValue(value);
    }
  }, [value, options]);

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === "__OTHER__") {
      setIsOther(true);
      onChange?.(customValue || "");
    } else {
      setIsOther(false);
      onChange?.(selected);
    }
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange?.(val);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-brand-indigo shrink-0" />}
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          value={isOther ? "__OTHER__" : value}
          onChange={handleSelectChange}
          disabled={disabled}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo appearance-none cursor-pointer pr-10 text-dark-900"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__OTHER__" className="font-semibold text-brand-indigo">
            {otherLabel}
          </option>
        </select>
        <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {isOther && (
        <div className="relative mt-1.5 animate-fadeIn">
          <input
            type="text"
            value={customValue}
            onChange={handleCustomChange}
            placeholder={otherPlaceholder}
            required={required}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-indigo/40 bg-surface text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo/30"
          />
          <Edit3 className="w-3.5 h-3.5 text-brand-indigo absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-muted leading-tight">{helperText}</p>
      )}
    </div>
  );
}
