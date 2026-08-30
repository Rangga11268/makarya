import React from "react";

/**
 * 1. Rich Vector SVG for In-App Alert: Success (Emerald Glowing Check Shield)
 */
export const AlertSuccessSvg = ({ size = 56, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="sucGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="sucShield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#sucGlow)" />
    <circle cx="32" cy="32" r="22" fill="url(#sucShield)" />
    <path
      d="M23 32.5 L29 38.5 L41 26.5"
      stroke="#FFFFFF"
      strokeWidth="3.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M48 14 L49.5 17.5 L53 19 L49.5 20.5 L48 24 L46.5 20.5 L43 19 L46.5 17.5 Z"
      fill="#10B981"
    />
    <circle cx="15" cy="46" r="2" fill="#34D399" />
  </svg>
);

/**
 * 2. Rich Vector SVG for In-App Alert: Error / Danger (Ruby Alert Shield)
 */
export const AlertErrorSvg = ({ size = 56, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="errGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="errShield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#errGlow)" />
    <circle cx="32" cy="32" r="22" fill="url(#errShield)" />
    <path
      d="M24 24 L40 40 M40 24 L24 40"
      stroke="#FFFFFF"
      strokeWidth="3.8"
      strokeLinecap="round"
    />
    <circle cx="49" cy="17" r="2" fill="#EF4444" />
    <circle cx="15" cy="45" r="2" fill="#F87171" />
  </svg>
);

/**
 * 3. Rich Vector SVG for In-App Alert: Warning (Golden Amber Triangle)
 */
export const AlertWarningSvg = ({ size = 56, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="warnGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="warnTri" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#warnGlow)" />
    <path
      d="M32 14 C33.5 14 34.8 14.8 35.6 16.2 L49.6 40.2 C51.2 43 49.2 46.5 46 46.5 H18 C14.8 46.5 12.8 43 14.4 40.2 L28.4 16.2 C29.2 14.8 30.5 14 32 14 Z"
      fill="url(#warnTri)"
    />
    <rect x="30" y="24" width="4" height="12" rx="2" fill="#FFFFFF" />
    <circle cx="32" cy="40.5" r="2" fill="#FFFFFF" />
  </svg>
);

/**
 * 4. Rich Vector SVG for In-App Alert: Info (Sapphire Blue Info Pin)
 */
export const AlertInfoSvg = ({ size = 56, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="infoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="infoCircle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#infoGlow)" />
    <circle cx="32" cy="32" r="22" fill="url(#infoCircle)" />
    <circle cx="32" cy="24" r="2.5" fill="#FFFFFF" />
    <rect x="30" y="29.5" width="4" height="13" rx="2" fill="#FFFFFF" />
  </svg>
);

/**
 * 5. Rich Vector SVG for In-App Alert: Confirm (Brand Indigo Interactive Star Shield)
 */
export const AlertConfirmSvg = ({ size = 56, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="confGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#392FB4" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#00A4E4" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="confCircle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00A4E4" />
        <stop offset="100%" stopColor="#392FB4" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#confGlow)" />
    <circle cx="32" cy="32" r="22" fill="url(#confCircle)" />
    <path
      d="M27 26 C27 23 29 21 32 21 C35 21 37 23 37 25.5 C37 28 35.5 29.5 33.5 30.5 C32.5 31 32 32 32 33.5"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle cx="32" cy="39.5" r="2" fill="#FFFFFF" />
    <path
      d="M49 14 L50.5 17.5 L54 19 L50.5 20.5 L49 24 L47.5 20.5 L44 19 L47.5 17.5 Z"
      fill="#00A4E4"
    />
  </svg>
);