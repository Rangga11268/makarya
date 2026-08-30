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

  const navLinks =
    user?.role === "ADMIN"
      ? [
          { label: "Admin Overview", path: "/admin", icon: ShieldCheck },
          { label: "Pusat Sengketa", path: "/admin/disputes", icon: Layers },
        ]
      : [
          { label: "Beranda", path: "/dashboard", icon: Layers },
          { label: "Jelajah Proyek", path: "/projects", icon: Compass },
          { label: "Proposal", path: "/proposals", icon: Briefcase },
          { label: "Portofolio", path: "/portfolio", icon: UserCheck },
          { label: "Dompet", path: "/wallet", icon: WalletIcon },
        ];

  const isActive = (path) => location.pathname === path;

  const getRoleBadge = (role) => {
    if (role === "ADMIN") return { label: "Administrator", variant: "danger" };
    if (role === "UMKM") return { label: "Klien UMKM", variant: "warning" };
    return { label: "Mahasiswa", variant: "brand" };
  };

  const roleInfo = getRoleBadge(user?.role);
  const initialLetter = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            to={
              isAuthenticated
                ? user?.role === "ADMIN"
                  ? "/admin"
                  : "/dashboard"
                : "/"
            }
            className="flex items-center group"
          >
            <img
              src="/logo.webp"
              alt="Logo Makarya"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Center Desktop Navigation Pill */}
        {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-1 bg-canvas px-2.5 py-1.5 rounded-full border border-border">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive(link.path)
                      ? "bg-dark-900 text-white shadow-xs"
                      : "text-muted hover:text-dark-900 hover:bg-surface"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Action Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* UMKM Quick Action */}
              {user?.role === "UMKM" && (
                <Link to="/projects/new">
                  <Button
                    variant="brand"
                    size="sm"
                    className="hidden sm:inline-flex text-xs font-bold shadow-brand py-2 px-4"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    Pasang Proyek
                  </Button>
                </Link>
              )}

              {/* User Dropdown Avatar */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-full border border-border hover:bg-canvas transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-dark-900 text-white flex items-center justify-center font-bold text-xs">
                    {initialLetter}
                  </div>
                  <Badge
                    variant={roleInfo.variant}
                    className="hidden sm:inline-flex text-[10px] py-0 px-2"
                  >
                    {roleInfo.label}
                  </Badge>
                  <ChevronDown className="w-3.5 h-3.5 text-muted hidden sm:block mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl border border-border shadow-float p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2.5 border-b border-border">
                      <span className="text-[11px] text-muted block">
                        Masuk sebagai
                      </span>
                      <span className="text-xs font-bold text-dark-900 truncate block">
                        {user?.email}
                      </span>
                      <Badge
                        variant={roleInfo.variant}
                        className="text-[10px] mt-1"
                      >
                        {roleInfo.label}
                      </Badge>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-dark-900 hover:bg-canvas rounded-xl transition-all"
                      >
                        <User className="w-4 h-4 text-brand-indigo" />
                        Kelola Profil Saya
                      </Link>
                      <Link
                        to="/wallet"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-dark-900 hover:bg-canvas rounded-xl transition-all"
                      >
                        <WalletIcon className="w-4 h-4 text-brand-indigo" />
                        Dompet & Saldo
                      </Link>
                      {user?.role === "MHS" && (
                        <Link
                          to="/portfolio"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-dark-900 hover:bg-canvas rounded-xl transition-all"
                        >
                          <UserCheck className="w-4 h-4 text-brand-indigo" />
                          Portofolio Saya
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar dari Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full border border-border text-dark-900 hover:bg-gray-100"
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
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="brand" size="sm">
                  Daftar Mahasiswa
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="lg:hidden border-b border-border bg-surface px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 text-xs text-muted font-medium border-b border-border mb-2 flex items-center justify-between">
            <div>
              Login: <b className="text-dark-900">{user?.email}</b>
            </div>
            <Badge variant={roleInfo.variant} className="text-[10px]">
              {roleInfo.label}
            </Badge>
          </div>

          {user?.role === "UMKM" && (
            <Link
              to="/projects/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block mb-2"
            >
              <Button
                variant="brand"
                size="sm"
                className="w-full justify-center text-xs font-bold shadow-brand"
              >
                <PlusCircle className="w-4 h-4 mr-2" />+ Pasang Proyek UMKM Baru
              </Button>
            </Link>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-xs font-bold ${
                  isActive(link.path)
                    ? "bg-dark-900 text-white"
                    : "text-muted hover:text-dark-900 hover:bg-canvas"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-xs font-bold ${
              isActive("/profile")
                ? "bg-dark-900 text-white"
                : "text-muted hover:text-dark-900 hover:bg-canvas"
            }`}
          >
            <User className="w-4 h-4" />
            Kelola Profil Saya
          </Link>
          <div className="pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full text-rose-600 border-rose-200 justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar dari Akun
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
