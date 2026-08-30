import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi } from "../../api";
import { ProjectCard } from "../../components/features/ProjectCard";
import { CreateProjectModal } from "../../components/features/CreateProjectModal";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { formatCurrency } from "../../utils/formatCurrency";
import { 
  Search, 
  SlidersHorizontal, 
  Compass, 
  RotateCcw, 
  ShieldCheck, 
  PlusCircle 
} from "lucide-react";

export function BrowseProjectsPage() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialKeyword = searchParams.get("keyword") || "";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [maxBudget, setMaxBudget] = useState(2000000);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const categories = [
    { key: "", label: "Semua Kategori" },
    { key: "DESIGN", label: "Desain Grafis & Logo" },
    { key: "UIUX", label: "UI/UX Design" },
    { key: "PEMROGRAMAN", label: "Web & Coding" },
    { key: "VIDEO", label: "Video & Animasi" },
    { key: "COPYWRITING", label: "Copywriting & SEO" },
    { key: "ADMIN_DATA", label: "Admin & Data Excel" },
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        status: "OPEN",
        max_budget: maxBudget,
      };
      if (category) params.kategori = category;
      if (keyword.trim()) params.keyword = keyword.trim();

      const res = await projectApi.browse(params);
      setProjects(res.data);
    } catch (err) {
      console.error("Gagal memuat proyek:", err);
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
    fetchProjects();
  };

  const handleResetFilter = () => {
    setCategory("");
    setKeyword("");
    setMaxBudget(2000000);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <SectionHeader
        badgeText="Katalog Peluang"
        title="Jelajah Proyek UMKM Aktif"
        subtitle="Temukan proyek digital yang sesuai dengan spesialisasi keahlian Anda dan tawarkan proposal terbaik."
        action={
          user?.role === "UMKM" ? (
            <Button
              variant="brand"
              size="md"
              
              className="text-xs font-bold shadow-brand"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              + Pasang Proyek Baru
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilter}
              className="text-xs text-muted"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filter
            </Button>
          )
        }
      />

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
                    onClick={() => {
                      setCategory(c.key);
                      setSearchParams(c.key ? { category: c.key } : {});
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      category === c.key
                        ? "bg-dark-900 text-white"
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

          <div className="p-4 rounded-2xl bg-brand-indigo-light/30 border border-brand-indigo/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-indigo">
              <ShieldCheck className="w-4 h-4" />
              <span>Proteksi Pembayaran 100%</span>
            </div>
            <p className="text-[11px] text-brand-indigo/80 leading-relaxed">
              Seluruh dana proyek terkunci aman di rekening bersama (*Escrow*) sebelum pekerjaan dimulai.
            </p>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-60 bg-surface rounded-card border border-border animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="Tidak ada proyek ditemukan"
              description="Coba ubah filter kategori atau kata kunci pencarian Anda untuk melihat peluang lainnya."
              action={
                <Button variant="secondary" size="sm" onClick={handleResetFilter}>
                  Reset Semua Filter
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Pasang Proyek untuk Klien UMKM */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={() => {
          fetchProjects();
        }}
      />
    </div>
  );
}