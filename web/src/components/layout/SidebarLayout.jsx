import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";
import { walletApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  Compass,
  FolderKanban,
  Award,
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  User,
  Wallet as WalletIcon,
  ChevronDown,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { NotificationBell } from "../features/NotificationBell";

export function SidebarLayout() {
  const { user, logout, isAuthenticated, fetchProfile } = useAuthStore();
  const { showConfirm } = useAlertStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const role = user?.role?.toUpperCase() || "";
  const isUmkm = role === "UMKM";
  const isMahasiswa = role === "MHS" || role === "MAHASISWA";
  const isAdmin = role === "ADMIN";

  // Fetch quick wallet info & ensure profile is loaded
  useEffect(() => {
    if (isAuthenticated) {
      if (!isAdmin) {
        walletApi
          .getMe()
          .then((res) => setWallet(res.data))
          .catch(() => {});
      }
      if (fetchProfile) {
        fetchProfile();
      }
    }
  }, [isAuthenticated, isAdmin, location.pathname]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#mobile-profile-sheet")
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    showConfirm(
      "Keluar dari Akun?",
      "Sesi kamu akan diakhiri dan kamu akan diarahkan ke halaman utama.",
      async () => {
        await logout();
        navigate("/");
      },
      null,
      true,
    );
  };

  const isTabActive = (path) => {
    if (path === "/projects") {
      return (
        location.pathname === "/projects" ||
        (location.pathname.startsWith("/projects/") &&
          location.pathname !== "/projects/new")
      );
    }
    if (path === "/proposals") {
      return location.pathname.startsWith("/proposals");
    }
    if (path === "/talents") {
      return location.pathname.startsWith("/talents");
    }
    return location.pathname === path;
  };

  // 3-Core Links per Role: Minimalist, roomy, zero crowding
  const coreNavLinks = (() => {
    if (isAdmin) {
      return [
        { label: "Overview Admin", path: "/admin", icon: LayoutDashboard },
        {
          label: "Sengketa & Escrow",
          path: "/admin/disputes",
          icon: ShieldAlert,
        },
        { label: "Direktori Talenta", path: "/talents", icon: GraduationCap },
      ];
    }
    if (isUmkm) {
      return [
        { label: "Papan Proyek", path: "/proposals", icon: FolderKanban },
        { label: "Cari Mahasiswa", path: "/talents", icon: GraduationCap },
        { label: "Katalog Proyek", path: "/projects", icon: Compass },
      ];
    }
    // MAHASISWA
    return [
      { label: "Jelajah Proyek", path: "/projects", icon: Compass },
      { label: "Ruang Kerja", path: "/proposals", icon: FolderKanban },
      { label: "Portofolio", path: "/portfolio", icon: Award },
    ];
  })();

  // Mobile Floating Dock Items (5 core touch points)
  const mobileNavItems = (() => {
    if (isAdmin) {
      return [
        { label: "Overview", path: "/admin", icon: LayoutDashboard },
        { label: "Sengketa", path: "/admin/disputes", icon: ShieldAlert },
        { label: "Talenta", path: "/talents", icon: GraduationCap },
        { label: "Profil", path: "/profile", icon: User },
      ];
    }
    if (isUmkm) {
      return [
        { label: "Beranda", path: "/dashboard", icon: LayoutDashboard },
        { label: "Proyek", path: "/proposals", icon: FolderKanban },
        {
          label: "Pasang",
          path: "/projects/new",
          icon: PlusCircle,
          isPrimary: true,
        },
        { label: "Talenta", path: "/talents", icon: GraduationCap },
        { label: "Dompet", path: "/wallet", icon: WalletIcon },
      ];
    }
    // MAHASISWA
    return [
      { label: "Beranda", path: "/dashboard", icon: LayoutDashboard },
      { label: "Proyek", path: "/projects", icon: Compass },
      { label: "Kerja", path: "/proposals", icon: FolderKanban },
      { label: "Portofolio", path: "/portfolio", icon: Award },
      { label: "Dompet", path: "/wallet", icon: WalletIcon },
    ];
  })();

  const userDisplayName =
    user?.nama_lengkap ||
    user?.nama_usaha ||
    (user?.email ? user.email.split("@")[0] : "Pengguna Makarya");

  const userInitial = userDisplayName.charAt(0).toUpperCase() || "M";

  const roleBadgeLabel = isUmkm
    ? "Mitra Usaha UMKM"
    : isMahasiswa
      ? "Mahasiswa Terverifikasi"
      : "Administrator";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 font-sans text-slate-900 selection:bg-brand-indigo/10 selection:text-brand-indigo">
      {/* ========================================================================= */}
      {/* 1. TOP STICKY NAVIGATION BAR (Zero Clutter Architecture) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Left: Brand Identity & Escrow Guarantee Pill */}
            <div className="flex items-center gap-3.5 shrink-0">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 group select-none"
                title="Menuju Beranda Kerja Makarya"
              >
                <img
                  src="/logo.webp"
                  alt="Makarya Logo"
                  className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50/80 border border-emerald-200/70 text-[11px] font-bold text-emerald-700 select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Proteksi Escrow</span>
              </div>
            </div>

            {/* Center: The 3 Core Nav Pills (Clean, Spacious, Never Overcrowded) */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full border border-slate-200/70">
              {coreNavLinks.map((tab) => {
                const active = isTabActive(tab.path);
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all select-none",
                      active
                        ? "bg-slate-900 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-950 hover:bg-white/80",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5",
                        active ? "text-white" : "text-slate-500",
                      )}
                    />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions & Utilities Island */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* UMKM Primary Action */}
              {isUmkm && (
                <Link to="/projects/new" className="hidden sm:inline-flex">
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pasang Proyek</span>
                  </button>
                </Link>
              )}

              {/* Quick Escrow / Wallet Pill (Clean on mobile, desktop/tablet only since mobile has it in bottom dock) */}
              {!isAdmin && (
                <Link
                  to="/wallet"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-bold text-slate-800 transition-colors select-none group"
                  title="Lihat Rincian Dompet & Escrow"
                >
                  <WalletIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="tabular-nums">
                    Rp {formatCurrency(wallet?.saldo_aktif || 0)}
                  </span>
                </Link>
              )}

              {/* Real-time Notification Bell */}
              <NotificationBell />

              {/* Profile Avatar Trigger & Dropdown/Bottom Sheet */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200 select-none active:scale-95 touch-manipulation"
                  aria-label="Menu Profil"
                >
                  {user?.url_foto ? (
                    <img
                      src={user.url_foto}
                      alt={userDisplayName}
                      className="w-8 h-8 rounded-full object-cover shadow-2xs border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                      {userInitial}
                    </div>
                  )}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-slate-400 transition-transform duration-150 hidden sm:block",
                      dropdownOpen && "rotate-180 text-slate-700",
                    )}
                  />
                </button>

                {/* Desktop Dropdown Card (>= 640px) */}
                {dropdownOpen && (
                  <div className="hidden sm:block absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                    {/* Header: User Info */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {userDisplayName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                      <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                        {isUmkm ? (
                          <Building2 className="w-3 h-3 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        )}
                        <span>{roleBadgeLabel}</span>
                      </div>
                    </div>

                    {/* Navigation Options */}
                    <div className="py-1.5 px-1.5 space-y-0.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Beranda Kerja</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profil & Pengaturan Akun</span>
                      </Link>

                      {!isAdmin && (
                        <Link
                          to="/wallet"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <WalletIcon className="w-4 h-4 text-emerald-600" />
                          <span>Dompet & Rekening Escrow</span>
                        </Link>
                      )}

                      {isMahasiswa && (
                        <Link
                          to="/portfolio"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <Award className="w-4 h-4 text-brand-indigo" />
                          <span>Portofolio Karya Saya</span>
                        </Link>
                      )}

                      {isUmkm && (
                        <Link
                          to="/projects/new"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600" />
                          <span>Pasang Proyek Baru</span>
                        </Link>
                      )}
                    </div>

                    {/* Divider & Logout */}
                    <div className="border-t border-slate-100 pt-1.5 px-1.5 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Keluar dari Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CANVAS (With generous bottom padding for mobile dock) */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full pb-28 md:pb-12">
        <Outlet />
      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE FLOATING BOTTOM DOCK (< 768px screens, Safe-Area aware) */}
      {/* ========================================================================= */}
      <nav
        className="md:hidden fixed inset-x-3 z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl py-1 px-1 flex items-center justify-around"
        style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
      >
        {mobileNavItems.map((item) => {
          const active = isTabActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all select-none flex-1 min-w-0 active:scale-95 touch-manipulation",
                active
                  ? "text-slate-950 font-bold"
                  : "text-slate-500 font-medium hover:text-slate-700",
              )}
            >
              {item.isPrimary ? (
                <div className="w-10 h-10 -mt-5 rounded-full bg-slate-900 text-white shadow-md flex items-center justify-center border-2 border-white transition-transform active:scale-90">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                    active ? "bg-slate-100 text-slate-900" : "text-slate-500",
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
              )}
              <span className="text-[10px] tracking-tight truncate max-w-full mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. MOBILE PROFILE ACTION SHEET DRAWER (< 640px) */}
      {/* (Rendered outside <header> so backdrop-blur does not distort fixed viewport) */}
      {/* ========================================================================= */}
      {dropdownOpen && (
        <div id="mobile-profile-sheet" className="sm:hidden">
          {/* Mobile Backdrop Overlay */}
          <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setDropdownOpen(false)}
          />

          {/* Sheet Container */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 font-sans"
            style={{
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
            }}
          >
            {/* Drag Handle Indicator */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

            {/* Header: User Info */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              {user?.url_foto ? (
                <img
                  src={user.url_foto}
                  alt={userDisplayName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white text-base font-bold flex items-center justify-center shadow-xs shrink-0">
                  {userInitial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {userDisplayName}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                  {isUmkm ? (
                    <Building2 className="w-3 h-3 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  )}
                  <span>{roleBadgeLabel}</span>
                </div>
              </div>
            </div>

            {/* Quick Escrow / Wallet Card */}
            {!isAdmin && (
              <Link
                to="/wallet"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-emerald-900 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <WalletIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Saldo Dompet & Escrow
                    </p>
                    <p className="text-sm font-black tabular-nums text-slate-900">
                      Rp {formatCurrency(wallet?.saldo_aktif || 0)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-emerald-200">
                  Rincian →
                </span>
              </Link>
            )}

            {/* Nav Links */}
            <div className="space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Beranda Kerja</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Profil & Pengaturan Akun</span>
              </Link>

              {!isAdmin && (
                <Link
                  to="/wallet"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <WalletIcon className="w-4 h-4 text-emerald-600" />
                  <span>Dompet & Rekening Escrow</span>
                </Link>
              )}

              {isMahasiswa && (
                <>
                  <Link
                    to="/portfolio"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <Award className="w-4 h-4 text-brand-indigo" />
                    <span>Portofolio Karya Saya</span>
                  </Link>
                  <Link
                    to="/projects"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-slate-500" />
                    <span>Jelajah Katalog Proyek</span>
                  </Link>
                </>
              )}

              {isUmkm && (
                <>
                  <Link
                    to="/projects/new"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 active:bg-emerald-100 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                    <span>Pasang Proyek Baru</span>
                  </Link>
                  <Link
                    to="/talents"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-500" />
                    <span>Cari Talenta Mahasiswa</span>
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  to="/admin/disputes"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                  <span>Pusat Sengketa & Escrow</span>
                </Link>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 active:bg-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
              <button
                onClick={() => setDropdownOpen(false)}
                className="py-2.5 px-4 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MINIMAL DESKTOP FOOTER */}
      {/* ========================================================================= */}
      <footer className="hidden md:block py-6 border-t border-slate-200/60 text-center text-xs text-slate-400 font-sans">
        <p>
          Makarya © 2026 — Platform Kolaborasi Terproteksi Mahasiswa & UMKM
          Lokal
        </p>
      </footer>
    </div>
  );
}
