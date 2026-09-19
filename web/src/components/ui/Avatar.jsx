import React, { useState } from "react";

export function Avatar({
  src,
  name,
  role = "USER",
  size = "md",
  className = "",
  alt,
}) {
  const [hasError, setHasError] = useState(false);

  const sizeMap = {
    xs: "w-5 h-5 text-[9px]",
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-16 h-16 text-base",
    "2xl": "w-20 h-20 text-lg",
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;
  const isUmkm = String(role || "").toUpperCase() === "UMKM";

  const initials = (name || (isUmkm ? "U" : "M"))
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || (isUmkm ? "U" : "M");

  const fallbackColor = isUmkm
    ? "bg-amber-100 text-amber-900 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
    : "bg-indigo-600 text-white border-indigo-700 dark:bg-indigo-700 dark:text-white";

  if (!src || hasError) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-bold select-none shrink-0 border shadow-2xs ${fallbackColor} ${currentSizeClass} ${className}`}
        title={name || alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || alt || "Avatar"}
      className={`rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs ${currentSizeClass} ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
