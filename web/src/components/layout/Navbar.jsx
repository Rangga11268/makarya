import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ProjectBriefVectorIcon } from "../icons/ProjectVectorIcon";
import {
  CategoryDesignSvg,
  CategoryUiUxSvg,
  CategoryCodeSvg,
  CategoryVideoSvg,
  CategoryCopySvg,
  CategoryDataSvg,
} from "../ui/CategorySvgIcons";
import {
  Compass,
  Layers,
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
  GraduationCap,
  HelpCircle,
  ArrowRight,
  Shield,
  Zap,
  MessageSquare,
  Lock,
  CheckCircle2,
} from "lucide-react";

import { NotificationBell } from "../features/NotificationBell";

export function Navbar() {
  const { user, isAuthenticated, logout, fetchProfile } = useAuthStore();
  const { showConfirm } = useAlertStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && fetchProfile) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [guideDropdownOpen, setGuideDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const guideDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }
      if (
        guideDropdownRef.current &&
        !guideDropdownRef.current.contains(event.target)
      ) {
        setGuideDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCategoryDropdownOpen(false);
    setGuideDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    showConfirm(
      "Keluar dari Akun?",
      "Sesi kamu akan diakhiri dan kamu akan diarahkan ke halaman utama.",
      () => {
        logout();
        navigate("/");
      },
      null,
      true,
    );
  };

  const navCategories = [
    {
      name: "Desain Grafis & Branding",
      desc: "Logo, identitas visual, grafis promosi UMKM",
      code: "DESAIN",
      svgIcon: CategoryDesignSvg,
      path: "/projects?category=DESAIN",
    },
    {
      name: "UI/UX & Prototipe Figma",
      desc: "Desain aplikasi interaktif, mobile app flow",
      code: "UIUX",
      svgIcon: CategoryUiUxSvg,
      path: "/projects?category=UIUX",
    },
    {
      name: "Website & Pemrograman",
      desc: "Frontend React/Vue, backend REST API, e-commerce",
      code: "WEB",
      svgIcon: CategoryCodeSvg,
      path: "/projects?category=PEMROGRAMAN",
    },
    {
      name: "Video Editing & Animasi",
      desc: "Reels Instagram/TikTok, motion grafis produk",
      code: "VIDEO",
      svgIcon: CategoryVideoSvg,
      path: "/projects?category=VIDEO",
    },
    {
      name: "Penulisan & SEO UMKM",
      desc: "Copywriting landing page, artikel SEO, proposal",
      code: "COPYWRITING",
      svgIcon: CategoryCopySvg,
      path: "/projects?category=COPYWRITING",
    },
    {
      name: "Olah Data & Admin Bisnis",
      desc: "Spreadsheet Excel, entri data, rekap operasional",
      code: "ADMIN",
      svgIcon: CategoryDataSvg,
      path: "/projects?category=ADMIN_DATA",
    },
  ];

  const guideLinks = [
    {
      title: "Rekening Bersama (Escrow)",
      desc: "Dana tersimpan 100% aman hingga pekerjaan disetujui",
      icon: ShieldCheck,
      iconColor: "text-emerald-600 bg-emerald-50",
      path: "/#cara-kerja",
    },
    {
      title: "Talenta Mahasiswa Terverifikasi",
      desc: "Portofolio divalidasi langsung dengan email .ac.id kampus",
      icon: GraduationCap,
      iconColor: "text-cyan-600 bg-cyan-50",
      path: "/#talenta",
    },
    {
      title: "Pusat Bantuan & Panduan Alur",
      desc: "Alur registrasi, pencairan dompet, dan proteksi sengketa",
      icon: HelpCircle,
      iconColor: "text-blue-600 bg-blue-50",
      path: "/#faq",
    },
  ];

  const authNavLinks = (() => {
    if (user?.role === "ADMIN") {
      return [
        { label: "Overview Admin", path: "/admin", icon: ShieldCheck },
        { label: "Pusat Sengketa", path: "/admin/disputes", icon: Layers },
      ];
    }
    if (user?.role === "UMKM") {
      return [
        { label: "Dashboard", path: "/dashboard", icon: Layers },
        {
          label: "Proyek & Pelamar",
          path: "/proposals",
          icon: ProjectBriefVectorIcon,
        },
        { label: "Chat Kolaborasi", path: "/chat", icon: MessageSquare },
        { label: "Direktori Talenta", path: "/talents", icon: GraduationCap },
        { label: "Dompet Escrow", path: "/wallet", icon: WalletIcon },
        { label: "Profil Usaha", path: "/profile", icon: UserCheck },
      ];
    }
    // MAHASISWA
    return [
      { label: "Dashboard", path: "/dashboard", icon: Layers },
      { label: "Katalog Proyek", path: "/projects", icon: Compass },
      {
        label: "Papan Kerja",
        path: "/proposals",
        icon: ProjectBriefVectorIcon,
      },
      { label: "Chat Kolaborasi", path: "/chat", icon: MessageSquare },
      { label: "Portofolio", path: "/portfolio", icon: UserCheck },
      { label: "Dompet", path: "/wallet", icon: WalletIcon },
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
    if (role === "ADMIN") return { label: "Admin", variant: "danger" };
    if (role === "UMKM") return { label: "Klien UMKM", variant: "warning" };
    return { label: "Mahasiswa", variant: "brand" };
  };

  const roleInfo = getRoleBadge(user?.role);
  const initialLetter = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const getHomeTarget = () => {
    if (!isAuthenticated) return "/";
    if (user?.role === "ADMIN") return "/admin";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-2xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* 1. Left Section: Logo & Desktop Navigation */}
          <div className="flex items-center gap-7">
            {/* Brand Logo with Official Icon + Modern Typography */}
            <Link
              to={getHomeTarget()}
              className="flex items-center gap-2.5 group select-none shrink-0"
            >
              <img
                src="/logo-icon.svg"
                alt="Makarya Logo"
                className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-black tracking-tight text-slate-900">
                Makarya
              </span>
            </Link>

            {/* Center Desktop Navigation for Guests */}
            {!isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1.5">
                {/* A. Katalog Proyek */}
                <Link
                  to="/projects"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive("/projects")
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Katalog Proyek</span>
                </Link>

                {/* B. Direktori Talenta */}
                <Link
                  to="/talents"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive("/talents")
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Direktori Talenta</span>
                </Link>

                {/* C. Dropdown Kategori with Rich SVG Icons */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => {
                      setCategoryDropdownOpen(!categoryDropdownOpen);
                      setGuideDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
                      categoryDropdownOpen
                        ? "bg-slate-100 text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>Kategori</span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                        categoryDropdownOpen ? "rotate-180 text-slate-800" : ""
                      }`}
                    />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {categoryDropdownOpen && (
                    <div className="absolute left-0 mt-3 w-[520px] bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Kategori Layanan Digital
                        </span>
                        <Link
                          to="/projects"
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                        >
                          Lihat Semua Proyek <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {navCategories.map((cat) => {
                          const SvgIcon = cat.svgIcon;
                          return (
                            <Link
                              key={cat.name}
                              to={cat.path}
                              onClick={() => setCategoryDropdownOpen(false)}
                              className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group select-none"
                            >
                              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <SvgIcon size={34} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                                  {cat.desc}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* D. Dropdown Panduan & Ekosistem */}
                <div className="relative" ref={guideDropdownRef}>
                  <button
                    onClick={() => {
                      setGuideDropdownOpen(!guideDropdownOpen);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
                      guideDropdownOpen
                        ? "bg-slate-100 text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>Jaminan & Bantuan</span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                        guideDropdownOpen ? "rotate-180 text-slate-800" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Jaminan */}
                  {guideDropdownOpen && (
                    <div className="absolute left-0 mt-3 w-88 bg-white rounded-3xl border border-slate-200 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="pb-2.5 mb-2.5 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Standar Keamanan Platform
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {guideLinks.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.title}
                              href={item.path}
                              onClick={() => setGuideDropdownOpen(false)}
                              className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
                            >
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            )}

            {/* Authenticated Nav Dock */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80">
                {authNavLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all select-none ${
                        active
                          ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/60"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold"
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          active ? "text-slate-900" : "text-slate-400"
                        }`}
                      />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* 2. Right Section: Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {user?.role === "UMKM" && (
                  <Link to="/projects/new">
                    <button
                      type="button"
                      className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs hover:-translate-y-0.5 transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Pasang Proyek</span>
                    </button>
                  </Link>
                )}

                {/* Real-time Notification Bell */}
                <NotificationBell />

                {/* User Dropdown Trigger */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs group cursor-pointer select-none"
                  >
                    {user?.url_foto ? (
                      <img
                        src={user.url_foto}
                        alt="Profile"
                        className="w-7 h-7 rounded-full object-cover shadow-xs border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {initialLetter}
                      </div>
                    )}
                    <div className="hidden sm:flex flex-col text-left leading-none">
                      <span className="text-[11px] font-bold text-slate-900 truncate max-w-[120px]">
                        {user?.nama ||
                          user?.nama_lengkap ||
                          user?.nama_usaha ||
                          user?.email?.split("@")[0]}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                        {roleInfo.label}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 transition-transform group-hover:translate-y-0.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50 rounded-2xl mb-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Akun Terhubung
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                          {user?.nama ||
                            user?.nama_lengkap ||
                            user?.nama_usaha ||
                            user?.email}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">
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
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <User className="w-4 h-4 text-slate-700" />
                          Kelola Profil
                        </Link>
                        <Link
                          to="/wallet"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <WalletIcon className="w-4 h-4 text-slate-700" />
                          Dompet & Escrow
                        </Link>
                        {user?.role === "MHS" && (
                          <Link
                            to="/portfolio"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                          >
                            <UserCheck className="w-4 h-4 text-slate-700" />
                            Portofolio Saya
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar dari Akun
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle for Auth */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 px-3.5 py-2 transition-colors select-none min-h-[44px] flex items-center"
                >
                  Masuk
                </Link>

                <Link to="/register" className="hidden sm:inline-flex">
                  <button
                    type="button"
                    className="min-h-[40px] px-4 py-2 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-bold transition-all bg-white hover:bg-slate-50"
                  >
                    Pasang Proyek
                  </button>
                </Link>

                <Link to="/register">
                  <button
                    type="button"
                    className="min-h-[40px] px-4.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:-translate-y-0.5 transition-all"
                  >
                    Daftar Sekarang
                  </button>
                </Link>

                {/* Mobile Menu Toggle for Guests */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 ml-0.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Mobile Navigation Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 px-4 py-4 space-y-3 bg-white/98 backdrop-blur-xl shadow-xl rounded-b-3xl animate-in fade-in slide-in-from-top-2 duration-150">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/projects"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-900 rounded-xl hover:bg-slate-50 min-h-[44px]"
                >
                  <Compass className="w-4 h-4 text-cyan-600" />
                  Jelajah Katalog Proyek
                </Link>

                <Link
                  to="/talents"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-900 rounded-xl hover:bg-slate-50 min-h-[44px]"
                >
                  <GraduationCap className="w-4 h-4 text-cyan-600" />
                  Direktori Talenta Terverifikasi
                </Link>

                <div className="py-2 border-y border-slate-100 my-2 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3.5 block">
                    Kategori Pilihan
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {navCategories.map((cat) => {
                      const SvgIcon = cat.svgIcon;
                      return (
                        <Link
                          key={cat.name}
                          to={cat.path}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl hover:bg-slate-50 min-h-[44px]"
                        >
                          <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                            <SvgIcon size={26} />
                          </div>
                          <span>{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/register" className="w-full">
                    <button
                      type="button"
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Daftar Akun Baru</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link to="/login" className="w-full">
                    <button
                      type="button"
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-full border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center"
                    >
                      Masuk ke Akun
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {authNavLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs rounded-xl font-semibold min-h-[44px] ${
                        active
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-600" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
