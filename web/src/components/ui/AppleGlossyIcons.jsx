import React from "react";
import { cn } from "../../utils/cn";

/**
 * 1. Apple Message / Chat Glossy Vector Icon (Web)
 * Squircle glass tile with Apple blue/green gradient & gloss highlight
 */
export function AppleMessageIcon({
  size = 28,
  variant = "blue", // "blue" | "green"
  className = "",
}) {
  const isGreen = variant === "green";
  const startColor = isGreen ? "#34C759" : "#0A84FF";
  const endColor = isGreen ? "#28A745" : "#0062D2";
  const gradId = isGreen ? "webAppleMsgGreenGrad" : "webAppleMsgBlueGrad";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center relative select-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 2px 5px ${isGreen ? "rgba(52, 199, 89, 0.35)" : "rgba(10, 132, 255, 0.35)"})`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
          <linearGradient
            id="webAppleGlossHighlight"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Base Squircle Tile */}
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="10"
          fill={`url(#${gradId})`}
        />

        {/* Top Gloss Sheen */}
        <rect
          x="1.5"
          y="1.5"
          width="33"
          height="16"
          rx="9"
          fill="url(#webAppleGlossHighlight)"
        />

        {/* Apple Message Bubble Silhouette */}
        <path
          d="M18 9C12.48 9 8 13.03 8 18C8 20.88 9.53 23.42 11.94 24.96C11.66 26.24 10.95 27.53 9.4 28.52C11.37 28.61 13.56 27.87 15.08 26.68C16.02 26.89 16.99 27 18 27C23.52 27 28 22.97 28 18C28 13.03 23.52 9 18 9Z"
          fill="#FFFFFF"
        />
        {/* Subtle Chat Tail Dot Accent */}
        <circle cx="14" cy="18" r="1.3" fill={startColor} opacity="0.6" />
        <circle cx="18" cy="18" r="1.3" fill={startColor} opacity="0.6" />
        <circle cx="22" cy="18" r="1.3" fill={startColor} opacity="0.6" />
      </svg>
    </div>
  );
}

/**
 * 2. Apple Vector Icon: Aset / Berkas Sumber (Web)
 */
export function AppleSourceAssetIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="webAppleAssetGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#webAppleAssetGrad)"
      />
      <path d="M7 16V13.5L13.5 7L16 9.5L9.5 16H7Z" fill="#FFFFFF" />
      <circle cx="16.5" cy="7.5" r="1.5" fill="#FDE047" />
    </svg>
  );
}

/**
 * 3. Apple Vector Icon: Deliverable Siap Pakai (Web)
 */
export function AppleReadyDeliverableIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="webAppleReadyGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#webAppleReadyGrad)"
      />
      <path
        d="M12 6L17 9V15L12 18L7 15V9L12 6Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <path
        d="M12 6V18M7 9L17 15M17 9L7 15"
        stroke="#2563EB"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 4. Apple Vector Icon: Revisi Terstruktur (Web)
 */
export function AppleStructuredRevisionIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="webAppleRevGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#webAppleRevGrad)"
      />
      <path
        d="M7.5 12.5L10.5 15.5L16.5 9.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 5. Apple Vector Icon: Shield Verified (Web)
 */
export function AppleShieldVerifiedIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="webAppleShieldGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#webAppleShieldGrad)"
      />
      <path
        d="M12 6L7 8V12.5C7 15.8 9.1 18.8 12 19.5C14.9 18.8 17 15.8 17 12.5V8L12 6Z"
        fill="#FFFFFF"
        opacity="0.9"
      />
      <path
        d="M10 12.5L11.5 14L14.5 11"
        stroke="#047857"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 6. Apple Vector Icon: Escrow Lock Guarantee (Web)
 */
export function AppleEscrowLockIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="webAppleLockGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#webAppleLockGrad)"
      />
      <path
        d="M9 11V9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9V11"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="7.5" y="11" width="9" height="7" rx="2" fill="#FFFFFF" />
      <circle cx="12" cy="14" r="1" fill="#D97706" />
    </svg>
  );
}

/**
 * 7. Apple Vector Icon: Wallet / Budget Pagu (Web)
 */
export function AppleWalletPayIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="webAppleWalletGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#webAppleWalletGrad)"
      />
      <rect x="6" y="8" width="12" height="9" rx="2" fill="#FFFFFF" />
      <path d="M6 10H18" stroke="#1D4ED8" strokeWidth="1.2" />
      <circle cx="14.5" cy="13.5" r="1" fill="#F59E0B" />
    </svg>
  );
}

/**
 * 8. Apple Vector Icon: Calendar Deadline (Web)
 */
export function AppleCalendarDeadlineIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="webAppleCalGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        fill="url(#webAppleCalGrad)"
      />
      <rect x="6" y="7" width="12" height="11" rx="2" fill="#FFFFFF" />
      <path d="M6 10.5H18" stroke="#DC2626" strokeWidth="1.2" />
      <circle cx="9" cy="13.5" r="0.8" fill="#64748B" />
      <circle cx="12" cy="13.5" r="0.8" fill="#64748B" />
      <circle cx="15" cy="13.5" r="0.8" fill="#64748B" />
    </svg>
  );
}

/**
 * 9. AppleGlossyBadge (Web)
 */
export function AppleGlossyBadge({
  icon: IconComponent,
  label,
  className = "",
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-[0_2px_8px_rgb(0,0,0,0.03)] text-xs font-semibold text-slate-800 transition-all",
        className,
      )}
    >
      {IconComponent && <IconComponent size={18} />}
      <span>{label}</span>
    </div>
  );
}
