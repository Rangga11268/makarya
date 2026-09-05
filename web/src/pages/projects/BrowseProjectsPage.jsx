import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";

export function BrowseProjectsPage() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialKeyword = searchParams.get("keyword") || "";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [maxBudget, setMaxBudget] = useState(2000000);
  const [sortBy, setSortBy] = useState("newest"); // newest | budget_desc | budget_asc | deadline_soon
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { key: "", label: "Semua Kategori" },
    { key: "DESIGN", label: "Desain Grafis & Logo" },
    { key: "UIUX", label: "UI/UX Design" },
    { key: "PEMROGRAMAN", label: "Web & Coding" },
    { key: "VIDEO", label: "Video & Animasi" },
    { key: "COPYWRITING", label: "Copywriting & SEO" },
    { key: "ADMIN_DATA", label: "Admin & Data Excel" },
  ];

  // Sinkronkan perubahan URL query params ke state
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    const urlKeyword = searchParams.get("keyword") || "";
    setCategory(urlCategory);
    setKeyword(urlKeyword);
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        status: "OPEN",
        max_budget: maxBudget,
      };
      if (category) params.kategori = category;
      if (keyword.trim()) params.keyword = keyword.trim();

      const res = await projectApi.browse(params);
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setProjects(data);
      setCurrentPage(1); // Reset page on new search/filter
    } catch (err) {
      console.error("Gagal memuat proyek:", err);
      setError("Gagal terhubung ke katalog proyek. Silakan coba muat ulang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProjects();
    }, 200);
    return () => clearTimeout(timeout);
  }, [category, maxBudget]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
    if (sortBy === "newest") {
      return list.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
      );
    }
    if (sortBy === "budget_desc") {
      return list.sort(
        (a, b) => Number(b.budget_max || 0) - Number(a.budget_max || 0),
      );
    }
    if (sortBy === "budget_asc") {
      return list.sort(
        (a, b) => Number(a.budget_max || 0) - Number(b.budget_max || 0),
      );
    }
    if (sortBy === "deadline_soon") {
      return list.sort(
        (a, b) => daysRemaining(a.deadline) - daysRemaining(b.deadline),
      );
    }
    return list;
  }, [projects, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProjects.slice(start, start + itemsPerPage);
  }, [sortedProjects, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            Katalog Peluang & Spesialisasi
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1 font-normal">
            Jelajah Proyek UMKM Aktif
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            Temukan proyek digital yang sesuai dengan spesialisasi keahlian Anda
            dan tawarkan proposal terbaik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === "UMKM" ? (
            <Link to="/projects/new">
              <Button
                variant="brand"
                size="md"
                className="text-xs font-bold shadow-brand"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Pasang Proyek Baru
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilter}
              className="text-xs font-bold text-muted hover:text-dark-900"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 space-y-6">
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
                  onChange={(e) => setKeyword(e.target.value)}
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
        <div className="lg:col-span-3 space-y-5">
          {/* Top Control Bar: Total Count & Sort By Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface border border-border rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-muted font-medium">
              <Layers className="w-4 h-4 text-dark-900" />
              <span>
                Menampilkan{" "}
                <b className="text-dark-900">
                  {sortedProjects.length > 0
                    ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                        currentPage * itemsPerPage,
                        sortedProjects.length,
                      )}`
                    : "0"}
                </b>{" "}
                dari <b className="text-dark-900">{sortedProjects.length}</b>{" "}
                Proyek Terbuka
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label
                htmlFor="sort-select"
                className="text-xs font-semibold text-muted flex items-center gap-1 shrink-0"
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
                className="text-xs font-bold bg-canvas border border-border rounded-xl px-3 py-1.5 text-dark-900 focus:outline-none focus:border-brand-indigo cursor-pointer shadow-xs"
              >
                <option value="newest">Terbaru Ditambahkan</option>
                <option value="deadline_soon">Tenggat Waktu Terdekat</option>
                <option value="budget_desc">Budget Tertinggi</option>
                <option value="budget_asc">Budget Terendah</option>
              </select>
            </div>
          </div>

          {/* Project Cards Grid */}
          {error && paginatedProjects.length === 0 ? (
            <div className="p-8 bg-surface rounded-3xl border border-rose-200 text-center space-y-3 shadow-xs">
              <p className="text-sm font-bold text-rose-700">{error}</p>
              <p className="text-xs text-muted">Pastikan server backend aktif di http://127.0.0.1:8000</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-60 bg-surface rounded-3xl border border-border animate-pulse"
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

          {/* Pagination Controls Bar */}
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-dark-900 text-white shadow-xs"
                          : "bg-surface hover:bg-canvas text-dark-900 border border-border"
                      }`}
                    >
                      {pageNum}
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
