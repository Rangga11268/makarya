import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { walletApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Layers,
  FolderKanban,
  Wallet as WalletIcon,
  User,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  PlusCircle,
  ChevronRight,
  Award,
  Bell,
  CheckCircle2,
  Building2,
  ExternalLink,
  Compass,
} from "lucide-react";
import { cn } from "../../utils/cn";

export function SidebarLayout() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [wallet, setWallet] = useState(null);

  const role = user?.role?.toUpperCase() || "";
  const isUmkm = role === "UMKM";
  const isMahasiswa = role === "MHS" || role === "MAHASISWA";
  const isAdmin = role === "ADMIN";

  // Fetch quick wallet info for sidebar card
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      walletApi
        .getMe()
        .then((res) => setWallet(res.data))
        .catch(() => {});
    }
  }, [isAuthenticated, isAdmin, location.pathname]);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      await logout();
      navigate("/");
    }
  };

  // Role-specific navigation items
  const getNavItems = () => {
    if (isAdmin) {
      return [
        {
          group: "ADMINISTRASI",
          items: [
            {
              label: "Dashboard Ringkasan",
              path: "/admin",
              icon: LayoutDashboard,
            },
            {
              label: "Resolusi Sengketa & Escrow",
              path: "/admin/disputes",
              icon: ShieldAlert,
            },
          ],
        },
        {
          group: "DIREKTORI PLATFORM",
          items: [
            {
              label: "Direktori Mahasiswa",
              path: "/talents",
              icon: GraduationCap,
            },
            {
              label: "Katalog Proyek UMKM",
              path: "/projects",
              icon: Briefcase,
            },
          ],
        },
      ];
    }

    if (isUmkm) {
      return [
        {
          group: "RUANG KERJA UMKM",
          items: [
            {
              label: "Dashboard Usaha",
              path: "/dashboard",
              icon: LayoutDashboard,
            },
            {
              label: "Papan Proyek & Pelamar",
              path: "/proposals",
              icon: FolderKanban,
            },
            {
              label: "Pasang Proyek Baru",
              path: "/projects/new",
              icon: PlusCircle,
              badge: "Utama",
            },
          ],
        },
        {
          group: "EKSPLORASI & REKRUTMEN",
          items: [
            {
              label: "Direktori Mahasiswa",
              path: "/talents",
              icon: GraduationCap,
            },
            {
              label: "Katalog Proyek Aktif",
              path: "/projects",
              icon: Briefcase,
            },
          ],
        },
        {
          group: "AKUN & FINANSIAL",
          items: [
            {
              label: "Dompet & Escrow",
              path: "/wallet",
              icon: WalletIcon,
            },
            {
              label: "Profil Bisnis UMKM",
              path: "/profile",
              icon: User,
            },
          ],
        },
      ];
    }

    // Default Mahasiswa
    return [
      {
        group: "PORTAL MAHASISWA",
        items: [
          {
            label: "Dashboard Talenta",
            path: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            label: "Papan Tugas & Deliverable",
            path: "/proposals",
            icon: FolderKanban,
          },
        ],
      },
      {
        group: "PELUANG & DIREKTORI",
        items: [
          {
            label: "Jelajah Proyek UMKM",
            path: "/projects",
            icon: Briefcase,
          },
          {
            label: "Direktori Mahasiswa",
            path: "/talents",
            icon: GraduationCap,
          },
          {
            label: "Portofolio Karya",
            path: "/portfolio",
            icon: Award,
          },
        ],
      },
      {
        group: "AKUN & FINANSIAL",
        items: [
          {
            label: "Dompet Honor & Pencairan",
            path: "/wallet",
            icon: WalletIcon,
          },
          {
            label: "Profil & Rekening",
            path: "/profile",
            icon: User,
          },
        ],
      },
    ];
  };

  const navGroups = getNavItems();

  const userDisplayName =
    user?.nama_lengkap ||
    user?.nama_usaha ||
    user?.email?.split("@")[0] ||
    "Pengguna";

  const userInitial = userDisplayName.charAt(0).toUpperCase();

  const roleLabel = isAdmin
    ? "Platform Admin"
    : isUmkm
      ? "Klien Mitra UMKM"
      : "Talenta Mahasiswa";

  const isCurrentActive = (itemPath) => {
    if (itemPath === "/dashboard" || itemPath === "/admin") {
      return location.pathname === itemPath;
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-dark-900 font-sans">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-surface border-r border-border shrink-0 z-30 select-none">
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-border bg-surface">
          <Link to="/" className="flex items-center group select-none">
            <img
              src="/logo.webp"
              alt="Makarya Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-indigo-light text-brand-indigo border border-brand-indigo/15">
            {isAdmin ? "Admin" : isUmkm ? "UMKM" : "MHS"}
          </div>
        </div>

        {/* Pasang Proyek Action for UMKM */}
        {isUmkm && (
          <div className="px-5 pt-4">
            <Link to="/projects/new">
              <button className="w-full py-2.5 px-4 rounded-2xl bg-dark-900 hover:bg-dark-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer">
                <PlusCircle className="w-4 h-4 text-brand-cyan" />
                <span>Pasang Proyek Baru</span>
              </button>
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold tracking-wider uppercase text-muted/80 block">
                {group.group}
              </span>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item, iIdx) => {
                  const active = isCurrentActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      className={cn(
                        "group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative",
                        active
                          ? "bg-dark-900 text-white shadow-xs"
                          : "text-dark-900/80 hover:text-dark-900 hover:bg-canvas"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            active
                              ? "text-brand-cyan"
                              : "text-muted group-hover:text-dark-900"
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-brand-indigo-light text-brand-indigo"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Wallet Widget */}
          {!isAdmin && wallet && (
            <div className="mx-1 p-3.5 rounded-2xl bg-canvas border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isUmkm ? "Dana Escrow" : "Saldo Dompet"}</span>
                </span>
                <Link
                  to="/wallet"
                  className="text-[11px] font-bold text-brand-indigo hover:underline flex items-center"
                >
                  Kelola
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="text-sm font-black text-dark-900 font-sans">
                {formatCurrency(
                  isUmkm ? wallet.saldo_escrow || 0 : wallet.saldo_aktif || 0
                )}
              </div>
              <p className="text-[10px] text-muted leading-tight">
                {isUmkm
                  ? "Dana terproteksi dalam sistem rekening bersama escrow."
                  : "Honor tuntas siap ditarik ke rekening bank terdaftar."}
              </p>
            </div>
          )}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border bg-surface">
          <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-canvas transition-colors">
            <Link
              to="/profile"
              className="flex items-center gap-3 min-w-0 flex-1"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 select-none shadow-xs",
                  isUmkm
                    ? "bg-brand-cyan text-slate-900"
                    : "bg-brand-indigo text-white"
                )}
              >
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-dark-900 truncate block">
                  {userDisplayName}
                </span>
                <span className="text-[10px] text-muted truncate block">
                  {roleLabel}
                </span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              title="Keluar dari akun"
              className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border flex flex-col lg:hidden transform transition-transform duration-200 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center group select-none">
            <img
              src="/logo.webp"
              alt="Makarya Logo"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-xl border border-border flex items-center justify-center text-muted hover:text-dark-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold tracking-wider uppercase text-muted">
                {group.group}
              </span>
              <div className="space-y-1 pt-1">
                {group.items.map((item, iIdx) => {
                  const active = isCurrentActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold",
                        active
                          ? "bg-dark-900 text-white shadow-xs"
                          : "text-dark-900/80 hover:bg-canvas"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            active ? "text-brand-cyan" : "text-muted"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-surface">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 min-w-0 flex-1"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-indigo text-white font-bold flex items-center justify-center text-xs shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-dark-900 truncate block">
                  {userDisplayName}
                </span>
                <span className="text-[10px] text-muted truncate block">
                  {roleLabel}
                </span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-muted hover:text-rose-600 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-dark-900 hover:bg-canvas cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted">
              <Link to="/" className="flex items-center gap-1.5 hover:text-dark-900 transition-colors">
                <img
                  src="/logo-icon.svg"
                  alt="Makarya"
                  className="w-4 h-4 object-contain"
                />
                <span className="font-bold text-dark-900">Makarya</span>
              </Link>
              <span>/</span>
              <span className="text-muted font-semibold capitalize">
                {location.pathname.split("/")[1] || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Proteksi Escrow</span>
            </div>

            <Link
              to="/projects"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted hover:text-dark-900 hover:bg-canvas transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Katalog</span>
            </Link>

            <Link to="/profile" className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shadow-xs",
                  isUmkm
                    ? "bg-brand-cyan text-slate-900"
                    : "bg-brand-indigo text-white"
                )}
              >
                {userInitial}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
