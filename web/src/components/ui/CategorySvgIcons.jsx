import React from "react";

/**
 * 1. Rich Vector SVG for Desain Grafis & Logo
 */
export const CategoryDesignSvg = ({ size = 44, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="catDesignGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.03" />
      </linearGradient>
      <linearGradient id="catDesignGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#catDesignGlow)" />
    {/* Artist Palette */}
    <path
      d="M32 14C20.95 14 12 22.95 12 34C12 40.5 15.5 46 21 48.5C22.5 49.2 24.5 48.2 24.5 46.5C24.5 45.2 25.5 44 27 44H30C38.84 44 46 36.84 46 28C46 20.27 39.73 14 32 14Z"
      fill="url(#catDesignGrad)"
    />
    {/* Color Pigment Dots */}
    <circle cx="22" cy="26" r="3" fill="#F43F5E" />
    <circle cx="30" cy="22" r="3" fill="#FBBF24" />
    <circle cx="38" cy="26" r="3" fill="#10B981" />
    <circle cx="39" cy="35" r="3" fill="#38BDF8" />
  </svg>
);

/**
 * 2. Rich Vector SVG for UI/UX Design
 */
export const CategoryUiUxSvg = ({ size = 44, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="catUiGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#0369A1" stopOpacity="0.03" />
      </linearGradient>
      <linearGradient id="catUiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#catUiGlow)" />
    {/* Browser App Window */}
    <rect x="14" y="16" width="36" height="32" rx="6" fill="url(#catUiGrad)" />
    {/* Window Header Controls */}
    <circle cx="20" cy="22" r="1.8" fill="#FFFFFF" opacity="0.8" />
    <circle cx="25" cy="22" r="1.8" fill="#FFFFFF" opacity="0.8" />
    <circle cx="30" cy="22" r="1.8" fill="#FFFFFF" opacity="0.8" />
    <line x1="14" y1="27" x2="50" y2="27" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.5" />
    {/* UI Grid Elements */}
    <rect x="18" y="31" width="13" height="13" rx="3" fill="#FFFFFF" opacity="0.9" />
    <rect x="34" y="31" width="12" height="5" rx="2" fill="#FFFFFF" opacity="0.75" />
    <rect x="34" y="39" width="12" height="5" rx="2" fill="#FFFFFF" opacity="0.5" />
  </svg>
);

/**
 * 3. Rich Vector SVG for Web & Coding
 */
export const CategoryCodeSvg = ({ size = 44, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="catCodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.03" />
      </linearGradient>
      <linearGradient id="catCodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#catCodeGlow)" />
    {/* Terminal Window Box */}
    <rect x="13" y="16" width="38" height="32" rx="7" fill="url(#catCodeGrad)" />
    {/* Code Brackets < / > */}
    <path
      d="M24 28L19 32L24 36"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M40 28L45 32L40 36"
      stroke="#FFFFFF"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 26L30 38"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

/**
 * 4. Rich Vector SVG for Video & Animasi
 */
export const CategoryVideoSvg = ({ size = 44, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="catVideoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#991B1B" stopOpacity="0.03" />
      </linearGradient>
      <linearGradient id="catVideoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#catVideoGlow)" />
    {/* Video Camera Body */}
    <rect x="13" y="19" width="27" height="26" rx="6" fill="url(#catVideoGrad)" />
    {/* Camera Lens Cone */}
    <path
      d="M40 27L49 22V42L40 37V27Z"
      fill="url(#catVideoGrad)"
    />
    {/* Play Triangle Inside Camera */}
    <path
      d="M23 27L30 32L23 37V27Z"
      fill="#FFFFFF"
    />
    {/* Recording Dot */}
    <circle cx="18" cy="24" r="1.8" fill="#FDE047" />
  </svg>
);

/**
 * 5. Rich Vector SVG for Copywriting & SEO
 */
export const CategoryCopySvg = ({ size = 44, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="catCopyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D97706" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#B45309" stopOpacity="0.03" />
      </linearGradient>
      <linearGradient id="catCopyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#catCopyGlow)" />
    {/* Paper Sheet */}
    <rect x="16" y="15" width="32" height="34" rx="5" fill="url(#catCopyGrad)" />
    {/* Text Lines */}
    <line x1="22" y1="23" x2="36" y2="23" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="29" x2="42" y2="29" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    <line x1="22" y1="35" x2="38" y2="35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    {/* Fountain Pen Accent */}
    <circle cx="39" cy="40" r="3.5" fill="#FEF3C7" />
  </svg>
);

/**
 * 6. Rich Vector SVG for Admin & Data Entry
 */
export const CategoryDataSvg = ({ size = 44, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="catDataGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#334155" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#0F172A" stopOpacity="0.03" />
      </linearGradient>
      <linearGradient id="catDataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#catDataGlow)" />
    {/* Database Discs */}
    <ellipse cx="32" cy="22" rx="17" ry="6" fill="url(#catDataGrad)" />
    <path
      d="M15 22V32C15 35.3 22.6 38 32 38C41.4 38 49 35.3 49 32V22"
      fill="url(#catDataGrad)"
      opacity="0.9"
    />
    <path
      d="M15 32V42C15 45.3 22.6 48 32 48C41.4 48 49 45.3 49 42V32"
      fill="url(#catDataGrad)"
    />
    {/* Data Indicator LEDs */}
    <circle cx="43" cy="22" r="1.5" fill="#38BDF8" />
    <circle cx="43" cy="32" r="1.5" fill="#34D399" />
    <circle cx="43" cy="42" r="1.5" fill="#FBBF24" />
  </svg>
);