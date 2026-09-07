import React from "react";
import { cn } from "../../utils/cn";
import { Calendar, Clock } from "lucide-react";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatIndonesianDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const dayName = days[d.getDay()];
  const day = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
}

function calculateDaysRemaining(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function toDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePickerInput({
  label = "Tenggat Waktu Selesai (Deadline)",
  value,
  onChange,
  helperText,
  error,
  required = false,
  minDaysAhead = 1,
  className,
}) {
  const todayStr = toDateString(new Date());
  const daysRemaining = calculateDaysRemaining(value);

  const handleApplyPreset = (days) => {
    const d = new Date(Date.now() + days * 86400000);
    onChange?.(toDateString(d));
  };

  return (
    <div className={cn("flex flex-col gap-1.5 font-sans text-left", className)}>
      {label && (
        <label className="text-xs font-bold text-dark-900 tracking-tight flex items-center justify-between">
          <span className="flex items-center gap-1">
            {label}
            {required && <span className="text-rose-500 font-bold">*</span>}
          </span>
          {daysRemaining !== null && daysRemaining >= 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                daysRemaining <= 3
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200",
              )}
            >
              <Clock className="w-3 h-3" />
              {daysRemaining === 0 ? "Hari ini" : `+${daysRemaining} hari lagi`}
            </span>
          )}
        </label>
      )}

      {/* Date Input with Calendar Icon */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-brand-indigo select-none">
          <Calendar className="w-4 h-4" />
        </div>

        <input
          type="date"
          min={todayStr}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          className={cn(
            "w-full rounded-2xl border bg-surface py-2.5 pl-10 pr-4 text-sm font-semibold text-dark-900 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/15 cursor-pointer shadow-2xs",
            error
              ? "border-rose-300 focus:border-rose-500 bg-rose-50/20"
              : "border-border focus:border-brand-indigo",
          )}
        />
      </div>

      {/* Formatted Indonesian Date Preview */}
      {value && (
        <div className="text-[11px] font-semibold text-dark-900/80 pl-1">
          {formatIndonesianDate(value)}
        </div>
      )}

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted mr-1 select-none">
          Pilihan Cepat:
        </span>
        {[
          { label: "+3 Hari (Kilat)", days: 3 },
          { label: "+7 Hari (1 Minggu)", days: 7 },
          { label: "+14 Hari (2 Minggu)", days: 14 },
          { label: "+30 Hari (1 Bulan)", days: 30 },
        ].map((item) => {
          const itemDateStr = toDateString(
            new Date(Date.now() + item.days * 86400000),
          );
          const isSelected = value === itemDateStr;
          return (
            <button
              key={item.days}
              type="button"
              onClick={() => handleApplyPreset(item.days)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                isSelected
                  ? "bg-brand-indigo text-white border-brand-indigo shadow-xs"
                  : "bg-canvas border-border text-muted hover:text-dark-900 hover:bg-surface",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

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
