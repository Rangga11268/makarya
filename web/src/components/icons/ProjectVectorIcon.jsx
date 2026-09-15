import React from "react";

export function ProjectBriefVectorIcon({
  size = 20,
  color = "currentColor",
  className = "",
}) {
  const style = typeof size === "number" ? { width: size, height: size } : {};
  return (
    <svg
      width={typeof size === "number" ? size : undefined}
      height={typeof size === "number" ? size : undefined}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 12l2 2 4-4" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function ProjectOfferVectorIcon({
  size = 24,
  color = "currentColor",
  className = "",
}) {
  const style = typeof size === "number" ? { width: size, height: size } : {};
  return (
    <svg
      width={typeof size === "number" ? size : undefined}
      height={typeof size === "number" ? size : undefined}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <path d="M9 12h6M12 9v6" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
