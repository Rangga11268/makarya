import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { talentApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { StarRating } from "../../components/ui/StarRating";
import { ContactTalentModal } from "../../components/features/ContactTalentModal";
import {
  ProdiVectorIcon,
  CampusVectorIcon,
  AcademicStatusVectorIcon,
  GithubVectorIcon,
  FigmaVectorIcon,
  GlobeVectorIcon,
  LinkedinVectorIcon,
} from "../../components/icons/ProfileVectorIcons";
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
  Star,
  ShieldCheck,
  Briefcase,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Layers,
  ChevronRight,
} from "lucide-react";

/**
 * TalentDetailModal: Modal detail lengkap portofolio dan ulasan talenta mahasiswa
 */
function TalentDetailModal({ isOpen, onClose, talent, onContact }) {
  if (!isOpen || !talent) return null;

  const initial = talent.nama_lengkap
    ? talent.nama_lengkap.charAt(0).toUpperCase()
    : "M";
  const ratingScore = Number(talent.rating_avg) || 5.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="relative p-6 sm:p-8 bg-slate-900 text-white border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-brand-indigo text-white font-serif text-3xl font-bold flex items-center justify-center shrink-0 shadow-sm border border-white/20 select-none">
              {initial}
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-sans">
                  {talent.nama_lengkap}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Resmi
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="flex items-center gap-1">
                  <ProdiVectorIcon size={14} className="text-sky-400" />
                  {talent.prodi || "Sistem Informasi"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CampusVectorIcon size={14} className="text-amber-400" />
                  {talent.universitas || "Universitas Bina Sarana Informatika"}
                </span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                  NIM: {talent.nim || "12210001"}
                </span>
                <span className="text-[11px] font-semibold text-brand-cyan bg-brand-cyan/20 px-2 py-0.5 rounded-md">
                  Semester {talent.semester || 6}
                </span>
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Award className="w-3 h-3" /> {talent.status_badge || "Mahasiswa Berprestasi & Terverifikasi"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 bg-canvas rounded-2xl border border-border text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-lg sm:text-xl font-serif">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{ratingScore.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-muted block mt-0.5 font-medium">
                Reputasi Skor
              </span>
            </div>

            <div className="p-3.5 sm:p-4 bg-canvas rounded-2xl border border-border text-center">
              <span className="text-lg sm:text-xl font-bold text-dark-900 font-serif block">
                {talent.total_proyek_selesai ?? 3}
              </span>
              <span className="text-[11px] text-muted block mt-0.5 font-medium">
                Proyek Tuntas
              </span>
            </div>

            <div className="p-3.5 sm:p-4 bg-canvas rounded-2xl border border-border text-center">
              <span className="text-lg sm:text-xl font-bold text-emerald-600 font-serif block">
                {talent.escrow_success_rate || "100%"}
              </span>
              <span className="text-[11px] text-muted block mt-0.5 font-medium">
                Sukses Escrow
              </span>
            </div>
          </div>

          {/* Bio Singkat */}
          {talent.bio && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                Ringkasan Profesional
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-canvas p-4 rounded-2xl border border-border">
                {talent.bio}
              </p>
            </div>
          )}

          {/* Portfolio Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Tautan Portofolio & Akun Resmi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {talent.github_url && (
                <a
                  href={talent.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 hover:shadow-xs transition-all text-xs font-medium text-dark-900 group"
                >
                  <div className="flex items-center gap-2">
                    <GithubVectorIcon size={16} className="text-slate-800" />
                    <span>GitHub Repository</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-dark-900" />
                </a>
              )}

              {talent.figma_url && (
                <a
                  href={talent.figma_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 hover:shadow-xs transition-all text-xs font-medium text-dark-900 group"
                >
                  <div className="flex items-center gap-2">
                    <FigmaVectorIcon size={16} />
                    <span>Figma Showcase</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-dark-900" />
                </a>
              )}

              {talent.website_url && (
                <a
                  href={talent.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 hover:shadow-xs transition-all text-xs font-medium text-dark-900 group"
                >
                  <div className="flex items-center gap-2">
                    <GlobeVectorIcon size={16} className="text-emerald-600" />
                    <span>Situs / Web Portofolio</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-dark-900" />
                </a>
              )}

              {talent.linkedin_url && (
                <a
                  href={talent.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 hover:shadow-xs transition-all text-xs font-medium text-dark-900 group"
                >
                  <div className="flex items-center gap-2">
                    <LinkedinVectorIcon size={16} className="text-[#0A66C2]" />
                    <span>Profil LinkedIn</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-dark-900" />
                </a>
              )}
            </div>

            {!talent.github_url &&
              !talent.figma_url &&
              !talent.website_url &&
              !talent.linkedin_url && (
                <p className="text-xs text-muted italic bg-canvas p-3 rounded-xl border border-border">
                  Tautan portofolio publik belum ditambahkan. Anda dapat meminta sampel pekerjaan saat berdiskusi via chat.
                </p>
              )}
          </div>

          {/* Skills */}
          {talent.skills && talent.skills.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                Keahlian & Bidang Spesialisasi
              </h4>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo border border-brand-indigo/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                Ulasan Klien UMKM ({talent.reviews_count || 0})
              </h4>
              <span className="text-[11px] text-muted">
                Ulasan transaksi escrow terverifikasi
              </span>
            </div>

            {talent.recent_reviews && talent.recent_reviews.length > 0 ? (
              <div className="space-y-2.5">
                {talent.recent_reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-canvas rounded-2xl border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-700">
                          {rev.client_name ? rev.client_name.charAt(0).toUpperCase() : "K"}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-dark-900 block leading-tight">
                            {rev.client_name}
                          </span>
                          <span className="text-[10px] text-muted">
                            Klien UMKM Terverifikasi
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-bold text-amber-800">
                          {rev.skor}.0
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{rev.ulasan}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted italic bg-canvas p-3.5 rounded-xl border border-border">
                Belum ada ulasan tertulis. Mahasiswa ini siap mengerjakan deliverable pertama untuk usaha Anda.
              </p>
            )}
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 sm:p-6 border-t border-border bg-canvas flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose} className="font-semibold text-xs">
            Tutup
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => {
              onClose();
              if (onContact) onContact(talent);
            }}
            className="font-bold text-xs shadow-brand flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ajak Chat & Kolaborasi
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TalentsDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedProdi, setSelectedProdi] = useState(searchParams.get("prodi") || "");
  const [minRating, setMinRating] = useState(searchParams.get("rating") ? Number(searchParams.get("rating")) : 0);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "rating");
  const [onlyCompleted, setOnlyCompleted] = useState(false);

  // Modals State
  const [activeContactTalent, setActiveContactTalent] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeDetailTalent, setActiveDetailTalent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const categoryPills = [
    { key: "", label: "Semua Bidang" },
    { key: "Sistem Informasi", label: "Web & Sistem Informasi" },
    { key: "Desain Komunikasi Visual", label: "UI/UX & Desain Grafis" },
    { key: "Teknologi Informasi", label: "Software & Mobile" },
    { key: "Ilmu Komunikasi", label: "Copywriting & Konten" },
  ];

  const fetchTalents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        only_completed: onlyCompleted,
        sort_by: sortBy,
      };
      if (selectedProdi) params.prodi = selectedProdi;
      if (keyword.trim()) params.keyword = keyword.trim();
      if (minRating > 0) params.min_rating = minRating;

      const res = await talentApi.getTalents(params);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setTalents(list);
    } catch (err) {
      console.error("Gagal memuat direktori talenta:", err);
      setError("Gagal terhubung ke direktori talenta. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTalents();
    }, 250);
    return () => clearTimeout(timeout);
  }, [keyword, selectedProdi, minRating, sortBy, onlyCompleted]);

  const handleResetFilter = () => {
    setKeyword("");
    setSelectedProdi("");
    setMinRating(0);
    setSortBy("rating");
    setOnlyCompleted(false);
    setSearchParams({});
  };

  const handleOpenContact = (talent) => {
    setActiveContactTalent(talent);
    setIsContactModalOpen(true);
  };

  const handleOpenDetail = (talent) => {
    setActiveDetailTalent(talent);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Explore Hub Switcher: Proyek UMKM vs Direktori Talenta */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Link
          to="/projects"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-muted hover:text-dark-900 hover:bg-canvas transition-colors"
        >
          <Briefcase className="w-4 h-4" />
          <span>Katalog Proyek UMKM</span>
        </Link>
        <Link
          to="/talents"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-dark-900 text-white shadow-xs"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Direktori Mahasiswa Berprestasi</span>
        </Link>
      </div>

      {/* 1. Hero Showcase Section - Antislop: Clean, high-trust, cohesive with platform identity */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo text-xs font-bold uppercase tracking-wider border border-brand-indigo/15">
              <Award className="w-3.5 h-3.5" />
              <span>Direktori Talenta Terkurasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight font-normal">
              Mahasiswa Berprestasi & Terverifikasi
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-2xl font-sans">
              Temukan talenta mahasiswa terverifikasi dengan rekam jejak deliverable riil, skor ulasan memuaskan dari UMKM, dan proteksi transaksi escrow resmi platform.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-muted font-medium bg-canvas px-3 py-1.5 rounded-xl border border-border">
              Total Talenta Terkurasi: <b className="text-dark-900">{talents.length}</b>
            </span>
          </div>
        </div>

        {/* 4 Trust Highlights Strip - Clean surface without emoji or glowing gradients */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-canvas border border-border rounded-2xl p-3.5 text-left">
            <div className="flex items-center gap-1.5 text-dark-900 text-xs font-bold">
              <CampusVectorIcon size={15} className="text-brand-indigo" />
              <span>Kampus Resmi</span>
            </div>
            <span className="text-[11px] text-muted block mt-0.5">
              Terakreditasi (UBSI & Mitra)
            </span>
          </div>

          <div className="bg-canvas border border-border rounded-2xl p-3.5 text-left">
            <div className="flex items-center gap-1.5 text-dark-900 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Skor 5.0 Rata-rata</span>
            </div>
            <span className="text-[11px] text-muted block mt-0.5">
              Ulasan Klien UMKM Riil
            </span>
          </div>

          <div className="bg-canvas border border-border rounded-2xl p-3.5 text-left">
            <div className="flex items-center gap-1.5 text-dark-900 text-xs font-bold">
              <Briefcase className="w-3.5 h-3.5 text-slate-700" />
              <span>Deliverable Tuntas</span>
            </div>
            <span className="text-[11px] text-muted block mt-0.5">
              Rekam Jejak Terverifikasi
            </span>
          </div>

          <div className="bg-canvas border border-border rounded-2xl p-3.5 text-left">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Proteksi Escrow</span>
            </div>
            <span className="text-[11px] text-muted block mt-0.5">
              Dana Aman di Platform
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filters Section */}
      <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 space-y-5 shadow-xs">
        {/* Search Bar & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama mahasiswa, keahlian (contoh: Figma, React, Copywriting)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-canvas border border-border rounded-2xl text-dark-900 placeholder:text-muted/70 focus:outline-none focus:border-brand-indigo transition-colors"
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark-900 p-0.5 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-canvas px-3 py-1.5 rounded-2xl border border-border">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
              <span className="text-xs text-muted font-medium hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-transparent text-dark-900 font-semibold focus:outline-none cursor-pointer py-1"
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="projects">Proyek Terbanyak</option>
                <option value="newest">Terbaru Terdaftar</option>
                <option value="name">Nama (A - Z)</option>
              </select>
            </div>

            {(keyword || selectedProdi || minRating > 0 || onlyCompleted || sortBy !== "rating") && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilter}
                className="text-xs font-bold text-muted hover:text-dark-900 rounded-2xl py-2 px-3"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Pilihan Program Studi & Spesialisasi
          </span>
          <div className="flex flex-wrap gap-2">
            {categoryPills.map((pill) => {
              const active = selectedProdi === pill.key;
              return (
                <button
                  key={pill.key}
                  onClick={() => setSelectedProdi(pill.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                    active
                      ? "bg-brand-indigo text-white shadow-xs"
                      : "bg-canvas text-slate-700 hover:bg-slate-200/60 border border-border"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating & Proyek Status Filter Row - Antislop: Clean labels without literal emoji */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted font-medium mr-1">Filter Rating:</span>
            {[
              { val: 0, label: "Semua Rating" },
              { val: 4.8, label: "Rating 4.8+" },
              { val: 4.5, label: "Rating 4.5+" },
            ].map((r) => (
              <button
                key={r.val}
                onClick={() => setMinRating(r.val)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                  minRating === r.val
                    ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
                    : "bg-canvas text-slate-600 hover:bg-slate-200/50 border border-border"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="inline-flex items-center gap-2 text-dark-900 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyCompleted}
                onChange={(e) => setOnlyCompleted(e.target.checked)}
                className="rounded text-brand-indigo focus:ring-brand-indigo w-4 h-4 cursor-pointer"
              />
              <span>Hanya yang telah menyelesaikan proyek</span>
            </label>

            <span className="text-muted text-[11px] font-medium bg-canvas px-2.5 py-1 rounded-full border border-border">
              Ditemukan: <b className="text-dark-900">{talents.length}</b> talenta
            </span>
          </div>
        </div>
      </div>

      {/* 3. Talents Grid */}
      {error ? (
        <div className="p-8 bg-surface rounded-3xl border border-rose-200 text-center space-y-3 shadow-xs">
          <p className="text-sm font-bold text-rose-700">{error}</p>
          <Button variant="brand" size="sm" onClick={fetchTalents}>
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Coba Muat Ulang
          </Button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 bg-surface rounded-3xl border border-border animate-pulse"
            />
          ))}
        </div>
      ) : talents.length === 0 ? (
        <EmptyState
          title="Tidak ada talenta yang sesuai filter"
          description="Coba gunakan kata kunci pencarian yang lebih umum atau reset filter rating dan kategori."
          action={
            <Button variant="secondary" size="sm" onClick={handleResetFilter}>
              Reset Semua Filter
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {talents.map((talent) => {
            const initial = talent.nama_lengkap
              ? talent.nama_lengkap.charAt(0).toUpperCase()
              : "M";
            const ratingScore = Number(talent.rating_avg) || 5.0;

            return (
              <div
                key={talent.id}
                className="bg-surface rounded-3xl border border-border p-6 flex flex-col justify-between hover:border-brand-indigo/40 hover:shadow-md transition-all duration-200 group relative"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        onClick={() => handleOpenDetail(talent)}
                        className="w-14 h-14 rounded-2xl bg-brand-indigo text-white font-serif text-xl font-bold flex items-center justify-center shrink-0 shadow-xs select-none group-hover:scale-105 transition-transform cursor-pointer"
                      >
                        {initial}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3
                            onClick={() => handleOpenDetail(talent)}
                            className="text-base font-bold text-dark-900 leading-snug truncate hover:text-brand-indigo cursor-pointer transition-colors"
                          >
                            {talent.nama_lengkap}
                          </h3>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>

                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5 truncate">
                          <ProdiVectorIcon size={14} className="text-brand-indigo shrink-0" />
                          <span className="truncate">{talent.prodi}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badge & University Tag */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-indigo-light text-brand-indigo border border-brand-indigo/15 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {talent.status_badge || "Mahasiswa Berprestasi"}
                    </span>
                    <span className="text-[10px] text-muted font-mono bg-canvas px-2 py-0.5 rounded-md border border-border">
                      NIM {talent.nim || "12210001"}
                    </span>
                  </div>

                  {/* Quick 3-Metric Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-canvas rounded-2xl border border-border mb-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-dark-900">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{ratingScore.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] text-muted block mt-0.5 font-medium">
                        Skor
                      </span>
                    </div>

                    <div className="border-x border-border/80 px-1">
                      <span className="text-xs font-bold text-dark-900 block">
                        {talent.total_proyek_selesai ?? 3}
                      </span>
                      <span className="text-[10px] text-muted block mt-0.5 font-medium">
                        Proyek Selesai
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-emerald-700 block">
                        {talent.escrow_success_rate || "100%"}
                      </span>
                      <span className="text-[10px] text-muted block mt-0.5 font-medium">
                        Escrow
                      </span>
                    </div>
                  </div>

                  {/* Bio Singkat */}
                  {talent.bio && (
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4 font-normal">
                      {talent.bio}
                    </p>
                  )}

                  {/* Verified Portfolio Mini Link Buttons */}
                  {(talent.github_url || talent.figma_url || talent.website_url || talent.linkedin_url) && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[11px] text-muted font-medium">Portofolio:</span>
                      <div className="flex items-center gap-1.5">
                        {talent.github_url && (
                          <a
                            href={talent.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-border bg-canvas hover:border-dark-900 text-slate-800 transition-colors"
                            title="Lihat GitHub Repository"
                          >
                            <GithubVectorIcon size={14} />
                          </a>
                        )}
                        {talent.figma_url && (
                          <a
                            href={talent.figma_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-border bg-canvas hover:border-dark-900 transition-colors"
                            title="Lihat Figma Portfolio"
                          >
                            <FigmaVectorIcon size={14} />
                          </a>
                        )}
                        {talent.website_url && (
                          <a
                            href={talent.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-border bg-canvas hover:border-dark-900 text-emerald-600 transition-colors"
                            title="Lihat Situs Pribadi"
                          >
                            <GlobeVectorIcon size={14} />
                          </a>
                        )}
                        {talent.linkedin_url && (
                          <a
                            href={talent.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-border bg-canvas hover:border-dark-900 text-[#0A66C2] transition-colors"
                            title="Lihat LinkedIn"
                          >
                            <LinkedinVectorIcon size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Client Testimonial Snippet */}
                  {talent.recent_reviews && talent.recent_reviews.length > 0 && (
                    <div className="p-3 bg-canvas/80 rounded-2xl border border-border/80 mb-4 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1 font-bold text-dark-900">
                          <Quote className="w-3 h-3 text-brand-indigo" />
                          <span className="truncate">{talent.recent_reviews[0].client_name}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                          <span>{talent.recent_reviews[0].skor}.0</span>
                        </div>
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

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-border flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDetail(talent)}
                    className="font-semibold text-xs rounded-xl py-2 px-3 border-border hover:bg-canvas cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5 text-muted" />
                    Detail
                  </Button>

                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => handleOpenContact(talent)}
                    className="flex-1 font-bold text-xs shadow-brand rounded-xl py-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Ajak Chat / Rekrut
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <TalentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        talent={activeDetailTalent}
        onContact={handleOpenContact}
      />

      {/* Contact Modal */}
      <ContactTalentModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        talent={activeContactTalent}
      />
    </div>
  );
}
