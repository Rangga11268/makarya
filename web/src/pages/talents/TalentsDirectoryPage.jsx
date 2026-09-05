import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { talentApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { StarRating } from "../../components/ui/StarRating";
import { ContactTalentModal } from "../../components/features/ContactTalentModal";
import {
  Search,
  RotateCcw,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Award,
  Filter,
  Sparkles,
  Quote,
} from "lucide-react";

export function TalentsDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedProdi, setSelectedProdi] = useState(searchParams.get("prodi") || "");
  const [minRating, setMinRating] = useState(searchParams.get("rating") ? Number(searchParams.get("rating")) : 0);
  const [onlyCompleted, setOnlyCompleted] = useState(true);

  // Modal State
  const [activeTalent, setActiveTalent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prodiOptions = [
    { key: "", label: "Semua Program Studi" },
    { key: "Sistem Informasi", label: "Sistem Informasi (Web & Data)" },
    { key: "Desain Komunikasi Visual", label: "DKV (Desain & Branding)" },
    { key: "Teknologi Informasi", label: "Teknologi Informasi (Software)" },
    { key: "Ilmu Komunikasi", label: "Ilmu Komunikasi (Copy & Konten)" },
  ];

  const fetchTalents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        only_completed: onlyCompleted,
      };
      if (selectedProdi) params.prodi = selectedProdi;
      if (keyword.trim()) params.keyword = keyword.trim();
      if (minRating > 0) params.min_rating = minRating;

      const res = await talentApi.getTalents(params);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setTalents(list);
    } catch (err) {
      console.error("Gagal memuat direktori talenta:", err);
      setError("Gagal terhubung ke database talenta. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTalents();
    }, 200);
    return () => clearTimeout(timeout);
  }, [selectedProdi, minRating, onlyCompleted]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTalents();
  };

  const handleResetFilter = () => {
    setKeyword("");
    setSelectedProdi("");
    setMinRating(0);
    setOnlyCompleted(false);
    setSearchParams({});
    fetchTalents();
  };

  const handleContactTalent = (talent) => {
    setActiveTalent(talent);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo text-xs font-bold uppercase tracking-wider border border-brand-indigo/15">
            <Award className="w-3.5 h-3.5" />
            Direktori Talenta Terkurasi
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-2 font-normal">
            Mahasiswa Berprestasi & Terverifikasi
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
            Temukan talenta muda terverifikasi dengan rekam jejak deliverable sukses,
            rating kepuasan tinggi dari klien UMKM, dan portofolio karya nyata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilter}
            className="text-xs font-bold text-muted hover:text-dark-900"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 bg-surface rounded-3xl border border-border space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="sm:col-span-5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama mahasiswa atau keahlian..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo"
              />
            </form>
          </div>

          {/* Prodi Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedProdi}
              onChange={(e) => setSelectedProdi(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-canvas border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo cursor-pointer"
            >
              {prodiOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="sm:col-span-3">
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-canvas border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo cursor-pointer"
            >
              <option value={0}>Semua Rating</option>
              <option value={4.8}>Rating 4.8+ (Unggulan)</option>
              <option value={4.5}>Rating 4.5+ (Sangat Baik)</option>
            </select>
          </div>
        </div>

        {/* Toggle Only Completed */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
          <label className="inline-flex items-center gap-2 text-dark-900 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyCompleted}
              onChange={(e) => setOnlyCompleted(e.target.checked)}
              className="rounded text-brand-indigo focus:ring-brand-indigo w-4 h-4 cursor-pointer"
            />
            <span>Hanya tampilkan mahasiswa yang sudah ada rating atau proyek selesai</span>
          </label>

          <span className="text-muted text-[11px]">
            Ditemukan: <b className="text-dark-900">{talents.length}</b> talenta
          </span>
        </div>
      </div>

      {/* Grid Talenta */}
      {error ? (
        <div className="p-8 bg-surface rounded-3xl border border-rose-200 text-center space-y-3 shadow-xs">
          <p className="text-sm font-bold text-rose-700">{error}</p>
          <Button variant="brand" size="sm" onClick={fetchTalents}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Coba Muat Ulang
          </Button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 bg-surface rounded-3xl border border-border animate-pulse"
            />
          ))}
        </div>
      ) : talents.length === 0 ? (
        <EmptyState
          title="Tidak ada talenta yang sesuai filter"
          description="Coba ubah kata kunci atau hapus filter rating untuk melihat mahasiswa bertalenta lainnya."
          action={
            <Button variant="secondary" size="sm" onClick={handleResetFilter}>
              Reset Semua Filter
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {talents.map((talent) => {
            const initial = talent.nama_lengkap
              ? talent.nama_lengkap.charAt(0).toUpperCase()
              : "M";
            const ratingScore = Number(talent.rating_avg) || 5.0;

            return (
              <div
                key={talent.id}
                className="bg-surface rounded-3xl border border-border p-6 flex flex-col justify-between hover:border-brand-indigo/30 hover:shadow-md transition-all duration-200 group relative"
              >
                <div>
                  {/* Top Profile Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-indigo text-white font-serif text-xl font-bold flex items-center justify-center shrink-0 shadow-xs select-none group-hover:scale-105 transition-transform">
                        {initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-dark-900 leading-snug">
                            {talent.nama_lengkap}
                          </h3>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                          <span className="truncate">{talent.prodi}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Proyek Completed Stats Bar */}
                  <div className="flex items-center justify-between py-2.5 px-3.5 bg-canvas rounded-2xl border border-border mb-4">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={ratingScore} size="xs" />
                      <span className="text-xs font-black text-dark-900">
                        {ratingScore.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {talent.total_proyek_selesai || 0} Proyek Selesai
                    </span>
                  </div>

                  {/* Bio Overview */}
                  {talent.bio && (
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4 font-normal">
                      {talent.bio}
                    </p>
                  )}

                  {/* Recent Client Review Snippet */}
                  {talent.recent_reviews && talent.recent_reviews.length > 0 && (
                    <div className="p-3 bg-canvas/70 rounded-2xl border border-border/80 mb-4 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-dark-900">
                        <Quote className="w-3 h-3 text-brand-indigo" />
                        <span>Ulasan Klien ({talent.recent_reviews[0].client_name}):</span>
                      </div>
                      <p className="text-[11px] text-slate-700 italic line-clamp-2">
                        "{talent.recent_reviews[0].ulasan}"
                      </p>
                    </div>
                  )}

                  {/* Skills Pills */}
                  {talent.skills && talent.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {talent.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-indigo-light text-brand-indigo border border-brand-indigo/10"
                        >
                          {skill}
                        </span>
                      ))}
                      {talent.skills.length > 4 && (
                        <span className="text-[10px] text-muted py-0.5 px-1 font-semibold">
                          +{talent.skills.length - 4} lainnya
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 border-t border-border flex items-center gap-2">
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => handleContactTalent(talent)}
                    className="flex-1 font-bold text-xs shadow-brand rounded-xl py-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Hubungi / Ajak Chat
                  </Button>

                  {talent.url_portofolio && (
                    <a
                      href={
                        talent.url_portofolio.startsWith("http")
                          ? talent.url_portofolio
                          : `https://${talent.url_portofolio}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border text-dark-900 hover:bg-canvas transition-colors shrink-0"
                      title="Lihat Portofolio Karya"
                    >
                      <ExternalLink className="w-4 h-4 text-muted" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Hubungi / Diskusi dengan Talenta */}
      <ContactTalentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        talent={activeTalent}
      />
    </div>
  );
}
