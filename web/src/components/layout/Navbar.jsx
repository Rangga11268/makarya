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
  GraduationCap,
  HelpCircle,
  Palette,
  Code2,
  Smartphone,
  Video,
  BarChart3,
  FileText,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

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
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navCategories = [
    {
      name: "Desain Grafis & UI/UX",
      desc: "Logo, branding, ilustrasi, prototipe Figma",
      icon: Palette,
      color: "from-purple-500/10 to-indigo-500/10 text-indigo-600",
      path: "/projects?category=DESAIN",
    },
    {
      name: "Website & Pemrograman",
      desc: "Web statis, e-commerce, portal REST API",
      icon: Code2,
      color: "from-blue-500/10 to-cyan-500/10 text-blue-600",
      path: "/projects?category=WEB",
    },
    {
      name: "Aplikasi Mobile",
      desc: "Aplikasi Android & iOS Flutter / React Native",
      icon: Smartphone,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
      path: "/projects?category=MOBILE",
    },
    {
      name: "Video Editing & Animasi",
      desc: "Video promosi produk, motion graphics reels",
      icon: Video,
      color: "from-rose-500/10 to-pink-500/10 text-rose-600",
      path: "/projects?category=VIDEO",
    },
    {
      name: "Digital Marketing & Data",
      desc: "SEO, ads sosial media, analitik visual data",
      icon: BarChart3,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600",
      path: "/projects?category=MARKETING",
    },
    {
      name: "Penulisan & Riset UMKM",
      desc: "Copywriting, proposal bisnis, dan artikel SEO",
      icon: FileText,
      color: "from-slate-500/10 to-zinc-500/10 text-slate-700",
      path: "/projects?category=WRITING",
    },
  ];

  const guideLinks = [
    {
      title: "Rekening Bersama (Escrow)",
      desc: "Dana aman 100% tersimpan hingga hasil disetujui",
      icon: ShieldCheck,
      badge: "Keamanan 100%",
      path: "/#cara-kerja",
    },
    {
      title: "Talenta Mahasiswa Terverifikasi",
      desc: "Talenta muda terverifikasi siap bantu bisnis Anda",
      icon: GraduationCap,
      badge: "Terverifikasi",
      path: "/#talenta",
    },
    {
      title: "Pusat Bantuan & Tanya Jawab",
      desc: "Alur registrasi, pencairan dana, dan sengketa",
      icon: HelpCircle,
      badge: "24/7 Bantuan",
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
          icon: Briefcase,
        },
        { label: "Direktori Talenta", path: "/talents", icon: GraduationCap },
        { label: "Dompet Escrow", path: "/wallet", icon: WalletIcon },
        { label: "Profil Usaha", path: "/profile", icon: UserCheck },
      ];
    }
    // MAHASISWA
    return [
      { label: "Dashboard", path: "/dashboard", icon: Layers },
      { label: "Katalog Proyek", path: "/projects", icon: Compass },
      { label: "Papan Kerja", path: "/proposals", icon: Briefcase },
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
    <div className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-2 transition-all">
      <header className="max-w-6xl mx-auto rounded-full bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-lg shadow-slate-900/4 hover:border-slate-300 transition-all">
        <div className="h-14 sm:h-15 px-4 sm:px-6 flex items-center justify-between">
          {/* 1. Left Section: Logo & Campus Badge */}
          <div className="flex items-center gap-6">
            <Link
              to={getHomeTarget()}
              className="flex items-center gap-2.5 group select-none"
            >
              <img
                src="/logo.webp"
                alt="Makarya Logo"
                className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Center Desktop Navigation for Guests */}
            {!isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1">
                {/* A. Katalog Proyek */}
                <Link
                  to="/projects"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive("/projects")
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Katalog Proyek</span>
                </Link>

                {/* B. Direktori Talenta */}
                <Link
                  to="/talents"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive("/talents")
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Direktori Talenta</span>
                </Link>

                {/* B. Dropdown Kategori */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => {
                      setCategoryDropdownOpen(!categoryDropdownOpen);
                      setGuideDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
                      categoryDropdownOpen
                        ? "bg-slate-100 text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <span>Kategori</span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform ${
                        categoryDropdownOpen ? "rotate-180 text-slate-800" : ""
                      }`}
                    />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {categoryDropdownOpen && (
                    <div className="absolute left-0 mt-3 w-[460px] bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Kategori Layanan Mahasiswa
                        </span>
                        <Link
                          to="/projects"
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {navCategories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <Link
                              key={cat.name}
                              to={cat.path}
                              onClick={() => setCategoryDropdownOpen(false)}
                              className="flex items-start gap-2.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                            >
                              <div
                                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
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

                {/* C. Dropdown Panduan & Ekosistem */}
                <div className="relative" ref={guideDropdownRef}>
                  <button
                    onClick={() => {
                      setGuideDropdownOpen(!guideDropdownOpen);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
                      guideDropdownOpen
                        ? "bg-slate-100 text-slate-900 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <span>Jaminan & Bantuan</span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform ${
                        guideDropdownOpen ? "rotate-180 text-slate-800" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Jaminan */}
                  {guideDropdownOpen && (
                    <div className="absolute left-0 mt-3 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="pb-2 mb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Standar Keamanan Platform
                        </span>
                      </div>
                      <div className="space-y-1">
                        {guideLinks.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.title}
                              href={item.path}
                              onClick={() => setGuideDropdownOpen(false)}
                              className="flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                    {item.title}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
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
              <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                {authNavLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all select-none ${
                        active
                          ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/60"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold"
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          active ? "text-indigo-600" : "text-slate-400"
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {user?.role === "UMKM" && (
                  <Link to="/projects/new">
                    <Button
                      variant="brand"
                      size="sm"
                      className="hidden sm:inline-flex text-xs font-bold py-1.5 px-3.5 rounded-full shadow-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" />
                      Pasang Proyek
                    </Button>
                  </Link>
                )}

                {/* User Dropdown Trigger */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all shadow-xs group cursor-pointer select-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {initialLetter}
                    </div>
                    <div className="hidden sm:flex flex-col text-left leading-none">
                      <span className="text-[11px] font-bold text-slate-900 truncate max-w-[100px]">
                        {user?.email?.split("@")[0]}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                        {roleInfo.label}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 transition-transform group-hover:translate-y-0.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-3xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50 rounded-2xl mb-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Akun Terhubung
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
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
                          <User className="w-4 h-4 text-indigo-600" />
                          Kelola Profil
                        </Link>
                        <Link
                          to="/wallet"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <WalletIcon className="w-4 h-4 text-indigo-600" />
                          Dompet & Escrow
                        </Link>
                        {user?.role === "MHS" && (
                          <Link
                            to="/portfolio"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                          >
                            <UserCheck className="w-4 h-4 text-indigo-600" />
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
                  className="lg:hidden p-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 transition-colors select-none"
                >
                  Masuk
                </Link>

                <Link to="/register" className="hidden sm:inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold border-slate-200 hover:border-slate-800 text-slate-800 rounded-full px-3.5 py-1.5 bg-slate-50/50"
                  >
                    Pasang Proyek
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    variant="brand"
                    size="sm"
                    className="text-xs font-bold rounded-full px-4 py-1.5 shadow-sm"
                  >
                    Daftar Sekarang
                  </Button>
                </Link>

                {/* Mobile Menu Toggle for Guests */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 ml-0.5"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Mobile Navigation Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 px-4 py-3.5 space-y-3 bg-white/95 backdrop-blur-2xl rounded-b-3xl">
            {!isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/projects"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-800 rounded-xl hover:bg-slate-50"
                >
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Jelajah Katalog Proyek
                </Link>

                <Link
                  to="/talents"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-800 rounded-xl hover:bg-slate-50"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Direktori Talenta Terverifikasi
                </Link>

                <div className="py-2 border-y border-slate-100 my-2 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block">
                    Kategori Pilihan
                  </span>
                  {navCategories.slice(0, 4).map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-slate-700 rounded-xl hover:bg-slate-50"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-1 flex flex-col gap-2">
                  <Link to="/register" className="w-full">
                    <Button
                      variant="brand"
                      size="md"
                      className="w-full text-xs font-bold justify-center rounded-full"
                    >
                      Daftar Akun Baru
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full text-xs font-semibold justify-center rounded-full border-slate-200"
                    >
                      Masuk ke Akun
                    </Button>
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
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl font-bold ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar dari Akun
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
