import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  Compass,
  Layers,
  Briefcase,
  Wallet as WalletIcon,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  UserCheck,
  User,
  PlusCircle,
  ChevronDown,
  Sparkles,
  Search,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = (() => {
    if (user?.role === "ADMIN") {
      return [
        { label: "Admin Overview", path: "/admin", icon: ShieldCheck },
        { label: "Pusat Sengketa", path: "/admin/disputes", icon: Layers },
      ];
    }
    if (user?.role === "UMKM") {
      return [
        { label: "Beranda", path: "/dashboard", icon: Layers },
        { label: "Katalog Proyek", path: "/projects", icon: Compass },
        { label: "Kelola Pelamar", path: "/proposals", icon: Briefcase },
        { label: "Profil Usaha", path: "/profile", icon: UserCheck },
        { label: "Dompet & Escrow", path: "/wallet", icon: WalletIcon },
      ];
    }
    // MAHASISWA
    return [
      { label: "Beranda", path: "/dashboard", icon: Layers },
      { label: "Jelajah Proyek", path: "/projects", icon: Compass },
      { label: "Proposal Saya", path: "/proposals", icon: Briefcase },
      { label: "Portofolio", path: "/portfolio", icon: UserCheck },
      { label: "Dompet Mahasiswa", path: "/wallet", icon: WalletIcon },
    ];
  })();

  const isActive = (path) => {
    if (
      path === "/projects" &&
      location.pathname.startsWith("/projects/") &&
      location.pathname !== "/projects/new"
    ) {
      return true;
    }
    return location.pathname === path;
  };

  const getRoleBadge = (role) => {
    if (role === "ADMIN") return { label: "Administrator", variant: "danger" };
    if (role === "UMKM") return { label: "Klien UMKM", variant: "warning" };
    return { label: "Mahasiswa", variant: "brand" };
  };

  const roleInfo = getRoleBadge(user?.role);
  const initialLetter = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border/80 transition-all shadow-2xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Brand Logo & Campus Badge */}
        <div className="flex items-center gap-6">
          <Link
            to={
              isAuthenticated
                ? user?.role === "ADMIN"
                  ? "/admin"
                  : "/dashboard"
                : "/"
            }
            className="flex items-center gap-2.5 group select-none"
          >
            <img
              src="/logo.webp"
              alt="Logo Makarya"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Center: Modern Floating Pill Navigation */}
        {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 backdrop-blur-md shadow-2xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
                    active
                      ? "bg-white text-dark-900 font-bold shadow-xs border border-slate-200/60"
                      : "text-slate-600 hover:text-dark-900 hover:bg-white/60 font-semibold"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${active ? "text-brand-indigo" : "text-slate-500"}`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: Quick Action & User Profile Dropdown */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* UMKM Quick Action: Pasang Proyek */}
              {user?.role === "UMKM" && (
                <Link to="/projects/new">
                  <Button
                    variant="brand"
                    size="sm"
                    className="hidden sm:inline-flex text-xs font-bold shadow-brand py-2 px-4 rounded-full"
                  >
                    <PlusCircle className="w-4 h-4 mr-1.5" />
                    Pasang Proyek
                  </Button>
                </Link>
              )}

              {/* Mahasiswa Quick Action: Jelajah Proyek */}
              {user?.role === "MHS" && (
                <Link to="/projects" className="hidden sm:inline-flex">
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-bold text-dark-900 transition-all select-none">
                    <Search className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>Cari Proyek</span>
                  </button>
                </Link>
              )}

              {/* User Dropdown Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-full border border-border bg-canvas/60 hover:bg-canvas transition-all shadow-2xs group cursor-pointer select-none"
                >
                  <div className="w-7 h-7 rounded-full bg-dark-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-200/70 shadow-2xs">
                    {initialLetter}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-[11px] font-bold text-dark-900 truncate max-w-[110px]">
                      {user?.email?.split("@")[0]}
                    </span>
                    <span className="text-[9px] font-bold text-muted uppercase mt-0.5">
                      {roleInfo.label}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted transition-transform group-hover:translate-y-0.5" />
                </button>

                {/* Dropdown Menu Box */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-surface rounded-2xl border border-border shadow-float p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                    <div className="px-3 py-2.5 border-b border-border bg-slate-50/50 rounded-xl mb-1">
                      <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                        Akun Terhubung
                      </span>
                      <span className="text-xs font-bold text-dark-900 truncate block mt-0.5">
                        {user?.email}
                      </span>
                      <Badge
                        variant={roleInfo.variant}
                        className="text-[10px] mt-1.5"
                      >
                        {roleInfo.label}
                      </Badge>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-dark-900 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4 text-brand-indigo" />
                        Kelola Profil Saya
                      </Link>
                      <Link
                        to="/wallet"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-dark-900 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <WalletIcon className="w-4 h-4 text-brand-indigo" />
                        Dompet & Saldo
                      </Link>
                      {user?.role === "MHS" && (
                        <Link
                          to="/portfolio"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-dark-900 hover:bg-slate-100 rounded-xl transition-all"
                        >
                          <UserCheck className="w-4 h-4 text-brand-indigo" />
                          Portofolio Saya
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-border mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar dari Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full border border-border text-dark-900 hover:bg-canvas transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs font-bold">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="brand"
                  size="sm"
                  className="text-xs font-bold shadow-brand rounded-full"
                >
                  Daftar Mahasiswa
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          {isAuthenticated ? (
            <>
              <div className="px-2 py-1 flex items-center justify-between border-b border-border pb-2">
                <div>
                  <span className="text-xs font-bold text-dark-900 block">
                    {user?.email}
                  </span>
                  <span className="text-[10px] text-muted block">
                    Peran: {roleInfo.label}
                  </span>
                </div>
                <Badge variant={roleInfo.variant} className="text-[10px]">
                  {roleInfo.label}
                </Badge>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? "bg-dark-900 text-white shadow-xs"
                          : "text-slate-700 hover:bg-canvas"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {user?.role === "UMKM" && (
                <div className="pt-2">
                  <Link
                    to="/projects/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button
                      variant="brand"
                      size="md"
                      className="w-full text-xs font-bold shadow-brand"
                    >
                      <PlusCircle className="w-4 h-4 mr-1.5" />
                      Pasang Proyek Baru
                    </Button>
                  </Link>
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar dari Akun
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-xs font-bold"
                >
                  Masuk ke Akun
                </Button>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block"
              >
                <Button
                  variant="brand"
                  size="md"
                  className="w-full text-xs font-bold shadow-brand"
                >
                  Daftar Akun Mahasiswa
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
