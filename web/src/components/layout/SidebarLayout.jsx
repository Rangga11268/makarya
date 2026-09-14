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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
        { label: "Sengketa & Escrow", path: "/admin/disputes", icon: ShieldAlert },
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

  // Mobile Floating Dock Items
  const mobileNavItems = (() => {
    if (isAdmin) {
      return [
        { label: "Admin", path: "/admin", icon: LayoutDashboard },
        { label: "Sengketa", path: "/admin/disputes", icon: ShieldAlert },
        { label: "Talenta", path: "/talents", icon: GraduationCap },
        { label: "Profil", path: "/profile", icon: User },
      ];
    }
    if (isUmkm) {
      return [
        { label: "Proyek Saya", path: "/proposals", icon: FolderKanban },
        { label: "Cari Mhs", path: "/talents", icon: GraduationCap },
        { label: "+ Pasang", path: "/projects/new", icon: PlusCircle, isPrimary: true },
        { label: "Dompet", path: "/wallet", icon: WalletIcon },
      ];
    }
    // MAHASISWA
    return [
      { label: "Cari Proyek", path: "/projects", icon: Compass },
      { label: "Ruang Kerja", path: "/proposals", icon: FolderKanban },
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

              {/* Quick Escrow / Wallet Pill */}
              {!isAdmin && (
                <Link
                  to="/wallet"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-bold text-slate-800 transition-colors select-none group"
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

              {/* Profile Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200 select-none"
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

                {/* Dropdown Card */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
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
      {/* 2. MAIN WORKSPACE CANVAS (100% Full Width, Air & Breathing Room) */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE FLOATING BOTTOM DOCK (< 768px screens) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl py-1.5 px-2 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const active = isTabActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all select-none min-w-[56px]",
                active ? "text-slate-950 font-bold" : "text-slate-500 font-medium",
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                  item.isPrimary
                    ? "bg-slate-900 text-white shadow-xs"
                    : active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500",
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. MINIMAL DESKTOP FOOTER */}
      {/* ========================================================================= */}
      <footer className="hidden md:block py-6 border-t border-slate-200/60 text-center text-xs text-slate-400 font-sans">
        <p>
          Makarya © 2026 — Platform Kolaborasi Terproteksi Mahasiswa & UMKM Lokal
        </p>
      </footer>
    </div>
  );
}
