import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi } from "../../api";
import { ProjectCard } from "../../components/features/ProjectCard";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { daysRemaining } from "../../utils/formatDate";
import {
  Search,
  RotateCcw,
  ShieldCheck,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Layers,
  GraduationCap,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { ProjectBriefVectorIcon } from "../../components/icons/ProjectVectorIcon";

export function BrowseProjectsPage() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const normalizeCategory = (cat) => {
    if (!cat) return "";
    const upper = cat.trim().toUpperCase();
    return upper === "DESAIN" ? "DESIGN" : upper;
  };

  const [category, setCategory] = useState(
    normalizeCategory(
      searchParams.get("category") || searchParams.get("kategori") || "",
    ),
  );
  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") || searchParams.get("search") || "",
  );
  const [maxBudget, setMaxBudget] = useState(2000000);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Debounce ref for keyword search
  const keywordDebounceRef = useRef(null);

  const categories = [
    { key: "", label: "Semua Kategori" },
    { key: "DESIGN", label: "Desain Grafis & Logo" },
    { key: "UIUX", label: "UI/UX Design" },
    { key: "PEMROGRAMAN", label: "Web & Coding" },
    { key: "VIDEO", label: "Video & Animasi" },
    { key: "COPYWRITING", label: "Copywriting & SEO" },
    { key: "ADMIN_DATA", label: "Admin & Data Excel" },
  ];

  // Sync URL → state
  useEffect(() => {
    const urlCategory = normalizeCategory(
      searchParams.get("category") || searchParams.get("kategori") || "",
    );
    const urlKeyword =
      searchParams.get("keyword") || searchParams.get("search") || "";
    setCategory(urlCategory);
    setKeyword(urlKeyword);
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { status: "OPEN", max_budget: maxBudget };
      if (category) params.kategori = category;
      if (keyword.trim()) params.keyword = keyword.trim();

      const res = await projectApi.browse(params);
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      const activeProjects = data.filter(
        (p) => p.status !== "CANCELLED" && daysRemaining(p.deadline) >= 0,
      );
      setProjects(activeProjects);
      setCurrentPage(1);
    } catch (err) {
      console.error("Gagal memuat proyek:", err);
      setError("Gagal terhubung ke katalog proyek. Silakan coba muat ulang.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on category or budget change
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProjects();
    }, 200);
    return () => clearTimeout(timeout);
  }, [category, maxBudget]);

  // Debounced keyword auto-search (400ms)
  const handleKeywordChange = (val) => {
    setKeyword(val);
    if (keywordDebounceRef.current) clearTimeout(keywordDebounceRef.current);
    keywordDebounceRef.current = setTimeout(() => {
      const nextParams = {};
      if (category) nextParams.category = category;
      if (val.trim()) nextParams.keyword = val.trim();
      setSearchParams(nextParams);
      fetchProjects();
    }, 400);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keywordDebounceRef.current) clearTimeout(keywordDebounceRef.current);
    const nextParams = {};
    if (category) nextParams.category = category;
    if (keyword.trim()) nextParams.keyword = keyword.trim();
    setSearchParams(nextParams);
    fetchProjects();
  };

  const handleCategorySelect = (key) => {
    setCategory(key);
    const nextParams = {};
    if (key) nextParams.category = key;
    if (keyword.trim()) nextParams.keyword = keyword.trim();
    setSearchParams(nextParams);
  };

  const handleResetFilter = () => {
    setCategory("");
    setKeyword("");
    setMaxBudget(2000000);
    setSortBy("newest");
    setCurrentPage(1);
    setSearchParams({});
  };

  // Sorted Projects
  const sortedProjects = useMemo(() => {
    const list = [...projects];
    if (sortBy === "newest")
      return list.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
      );
    if (sortBy === "budget_desc")
      return list.sort(
        (a, b) => Number(b.budget_max || 0) - Number(a.budget_max || 0),
      );
    if (sortBy === "budget_asc")
      return list.sort(
        (a, b) => Number(a.budget_max || 0) - Number(b.budget_max || 0),
      );
    if (sortBy === "deadline_soon")
      return list.sort(
        (a, b) => daysRemaining(a.deadline) - daysRemaining(b.deadline),
      );
    return list;
  }, [projects, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProjects.slice(start, start + itemsPerPage);
  }, [sortedProjects, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  // Pagination page numbers with ellipsis (max 5 visible)
  const paginationPages = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-4 sm:space-y-6 font-sans">
      {/* 1. Explore Hub Switcher - Modern Segmented Control */}
      <div className="flex items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="inline-flex p-1 bg-canvas rounded-2xl border border-border w-full sm:w-auto max-w-xs shadow-2xs">
          <Link
            to="/projects"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-dark-900 text-white shadow-xs text-center transition-all"
          >
            <ProjectBriefVectorIcon
              size={13}
              className="w-3.5 h-3.5 shrink-0 text-white"
            />
            <span className="truncate">Katalog Proyek</span>
          </Link>
          <Link
            to="/talents"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted hover:text-dark-900 hover:bg-surface transition-all text-center"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Direktori Talenta</span>
          </Link>
        </div>

        {user?.role === "UMKM" && (
          <Link to="/projects/new" className="hidden sm:inline-flex">
            <Button
              variant="brand"
              size="sm"
              className="text-xs font-bold shadow-brand"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Pasang Proyek
            </Button>
          </Link>
        )}
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-indigo font-sans">
            Katalog Peluang &amp; Spesialisasi
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-900 tracking-tight mt-0.5">
            Jelajah Proyek UMKM Aktif
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-0.5 max-w-2xl">
            Temukan proyek digital yang sesuai dengan spesialisasi keahlian Anda dan tawarkan proposal terbaik.
          </p>
        </div>

        {/* Desktop-only action buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {(category || keyword.trim() || maxBudget < 2000000) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilter}
              className="text-xs font-bold text-muted hover:text-dark-900 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* UMKM Recommendation Banner */}
      {user?.role === "UMKM" && (
        <div className="bg-brand-indigo/5 border border-brand-indigo/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-brand-indigo text-white flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-dark-900">
                Mencari Talenta Mahasiswa untuk Direkrut Langsung?
              </h3>
              <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                Jelajahi direktori mahasiswa berprestasi dengan portofolio terverifikasi.
              </p>
            </div>
          </div>
          <Link to="/talents" className="w-full sm:w-auto shrink-0">
            <Button
              variant="brand"
              size="sm"
              className="w-full sm:w-auto justify-center text-xs font-bold shadow-brand"
            >
              Buka Direktori Mahasiswa
            </Button>
          </Link>
        </div>
      )}

      {/* 3. Mobile Search & Horizontal Category Slider (Smooth Swipeable Bar) */}
      <div className="lg:hidden space-y-2.5">
        {/* Mobile Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kata kunci atau judul proyek..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo shadow-xs"
          />
          {keyword ? (
            <button
              onClick={() => handleKeywordChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-dark-900 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Mobile Category Pills: Sleek Horizontal Scroll with no wrapping */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((c) => {
            const isActive = category === c.key;
            return (
              <button
                key={c.key}
                onClick={() => handleCategorySelect(c.key)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border select-none ${
                  isActive
                    ? "bg-dark-900 text-white border-dark-900 shadow-xs"
                    : "bg-surface text-slate-600 border-border hover:border-dark-900/30 hover:text-dark-900"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Active Filter Badge & Reset Button */}
        {(category || keyword.trim() || maxBudget < 2000000) && (
          <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] text-muted">
              <span>Filter:</span>
              {category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-dark-900/5 text-dark-900 text-[11px] font-semibold border border-border">
                  {categories.find((c) => c.key === category)?.label}
                </span>
              )}
              {keyword.trim() && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-dark-900/5 text-dark-900 text-[11px] font-semibold border border-border truncate max-w-[120px]">
                  "{keyword}"
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilter}
              className="text-xs text-rose-600 font-semibold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 items-start">
        {/* Sidebar Filters — desktop only */}
        <div className="hidden lg:block lg:col-span-1 space-y-5">
          <Card className="p-4 sm:p-5 space-y-5 rounded-2xl">
            <div>
              <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider mb-3">
                Cari Kata Kunci
              </h3>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ketik kata kunci..."
                  value={keyword}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo"
                />
              </form>
            </div>

            <div>
              <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider mb-3">
                Kategori Keahlian
              </h3>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => handleCategorySelect(c.key)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      category === c.key
                        ? "bg-dark-900 text-white shadow-xs"
                        : "text-muted hover:bg-canvas hover:text-dark-900"
                    }`}
                  >
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                  Maksimal Budget
                </h3>
                <span className="text-xs font-bold text-brand-indigo font-sans">
                  {formatCurrency(maxBudget)}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
                className="w-full accent-brand-indigo cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-muted mt-1">
                <span>Rp 100 rb</span>
                <span>Rp 2 Juta</span>
              </div>
            </div>
          </Card>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garansi Escrow 100%</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Seluruh dana proyek dijamin dan dikunci aman oleh sistem sebelum
              Anda memulai pengerjaan.
            </p>
          </div>
        </div>

        {/* Project Content Area */}
        <div className="lg:col-span-3 col-span-1 space-y-4 sm:space-y-5">
          {/* Top Control Bar — Single Row on Mobile & Desktop */}
          <div className="flex items-center justify-between gap-2 p-3 sm:p-3.5 bg-surface border border-border rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-muted font-medium truncate">
              <Layers className="w-4 h-4 text-dark-900 shrink-0" />
              <span className="truncate">
                {loading ? (
                  "Memuat proyek..."
                ) : (
                  <>
                    <span className="hidden sm:inline">Menampilkan </span>
                    <b className="text-dark-900">
                      {sortedProjects.length > 0
                        ? `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                            currentPage * itemsPerPage,
                            sortedProjects.length,
                          )}`
                        : "0"}
                    </b>{" "}
                    dari <b className="text-dark-900">{sortedProjects.length}</b>{" "}
                    <span className="hidden xs:inline">Proyek Terbuka</span>
                    <span className="xs:hidden">Proyek</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <label
                htmlFor="sort-select"
                className="text-xs font-semibold text-muted items-center gap-1 shrink-0 hidden sm:flex"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
                <span>Urutkan:</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-bold bg-canvas border border-border rounded-xl px-2.5 py-1.5 text-dark-900 focus:outline-none focus:border-brand-indigo cursor-pointer shadow-xs"
              >
                <option value="newest">Terbaru</option>
                <option value="deadline_soon">Tenggat Terdekat</option>
                <option value="budget_desc">Budget Tertinggi</option>
                <option value="budget_asc">Budget Terendah</option>
              </select>
            </div>
          </div>

          {/* Project Cards Grid */}
          {error && paginatedProjects.length === 0 ? (
            <div className="p-8 bg-surface rounded-3xl border border-rose-200 text-center space-y-3 shadow-xs">
              <p className="text-sm font-bold text-rose-700">{error}</p>
              <Button
                variant="brand"
                size="sm"
                onClick={fetchProjects}
                className="mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Coba Muat Ulang
              </Button>
            </div>
          ) : loading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              aria-busy="true"
              aria-label="Memuat daftar proyek"
            >
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-52 bg-surface rounded-3xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : paginatedProjects.length === 0 ? (
            <EmptyState
              title="Tidak ada proyek ditemukan"
              description="Coba ubah filter kategori atau kata kunci pencarian Anda untuk melihat peluang lainnya."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetFilter}
                >
                  Reset Semua Filter
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
              <span className="text-xs text-muted font-medium order-2 sm:order-1">
                Halaman <b className="text-dark-900">{currentPage}</b> dari{" "}
                <b className="text-dark-900">{totalPages}</b>
              </span>

              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 text-xs font-bold disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Sebelumnya
                </Button>

                {paginationPages.map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-8 text-center text-xs text-muted select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        currentPage === p
                          ? "bg-dark-900 text-white shadow-xs"
                          : "bg-surface hover:bg-canvas text-dark-900 border border-border"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 text-xs font-bold disabled:opacity-40"
                >
                  Berikutnya
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
