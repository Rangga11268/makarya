import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { projectApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, daysRemaining } from "../../utils/formatDate";
import { extractIdFromSlug, getProjectUrl } from "../../utils/slugify";
import { formatStatus } from "../../utils/formatStatus";
import {
  CategoryDesignSvg,
  CategoryUiUxSvg,
  CategoryCodeSvg,
  CategoryVideoSvg,
  CategoryCopySvg,
  CategoryDataSvg,
} from "../../components/ui/CategorySvgIcons";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  Tag,
  Users,
  Send,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  Lock,
  Layers,
  Award,
  AlertCircle,
  MapPin,
  Share2,
  MessageSquare,
  PlusCircle,
} from "lucide-react";
import { ProjectChatModal } from "../../components/features/ProjectChatModal";

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const getCategorySvg = (catCode) => {
    switch (catCode) {
      case "DESIGN":
      case "DESAIN":
        return <CategoryDesignSvg size={28} />;
      case "UIUX":
        return <CategoryUiUxSvg size={28} />;
      case "PEMROGRAMAN":
      case "WEB":
        return <CategoryCodeSvg size={28} />;
      case "VIDEO":
        return <CategoryVideoSvg size={28} />;
      case "COPYWRITING":
        return <CategoryCopySvg size={28} />;
      case "ADMIN_DATA":
      case "ADMIN":
      default:
        return <CategoryDataSvg size={28} />;
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      addToast(
        "Silakan masuk dengan akun mahasiswa terlebih dahulu untuk mengajukan proposal.",
        "info",
      );
      navigate("/login");
      return;
    }
    if (user?.role === "UMKM") {
      addToast(
        "Akun Klien UMKM tidak dapat mengajukan proposal. Gunakan akun mahasiswa untuk melamar proyek.",
        "warning",
      );
      return;
    }
    navigate(`/projects/${id}/apply`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast("Tautan proyek disalin ke clipboard!", "success");
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectId = extractIdFromSlug(id);
      const res = await projectApi.getDetail(projectId);
      setProject(res.data);
    } catch (err) {
      console.error("Gagal memuat detail proyek:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 font-sans">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-surface rounded-3xl border border-border animate-pulse" />
          <div className="lg:col-span-4 h-96 bg-surface rounded-3xl border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-sans space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-dark-900">
          Proyek Tidak Ditemukan
        </h2>
        <p className="text-xs text-muted">
          Proyek ini mungkin telah dihapus atau link tidak valid.
        </p>
        <Link to="/projects">
          <Button variant="brand" size="sm">
            Kembali ke Katalog Proyek
          </Button>
        </Link>
      </div>
    );
  }

  const daysLeft = daysRemaining(project.deadline);
  const isOwner = user?.id === project.umkm_id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* 1. Breadcrumbs & Top Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 hover:text-dark-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Jelajah Proyek
          </Link>
          <span>/</span>
          <span className="text-brand-indigo font-bold">
            {project.kategori}
          </span>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-xs">
            {project.judul}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas border border-border text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors w-fit"
        >
          <Share2 className="w-3.5 h-3.5" />
          Bagikan Peluang Ini
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: MAIN PROJECT BRIEF & WORKFLOW ROADMAP (8 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Main Project Header & Overview */}
          <Card className="p-6 sm:p-8 space-y-6 bg-surface border-border rounded-3xl shadow-xs">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-canvas border border-border text-xs font-bold text-dark-900">
                  {getCategorySvg(project.kategori)}
                  <span>{project.kategori}</span>
                </div>

                <Badge
                  variant={
                    project.status === "OPEN" || project.status === "BIDDING"
                      ? "success"
                      : project.status === "IN_PROGRESS"
                        ? "brand"
                        : "warning"
                  }
                >
                  {formatStatus(project.status)}
                </Badge>

                <span className="text-xs text-muted font-mono">
                  ID: #{project.id?.substring(0, 8)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-dark-900 tracking-tight leading-snug font-normal">
                {project.judul}
              </h1>

              {/* Client Pill */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full bg-dark-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {project.umkm_profile?.nama_usaha?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-dark-900">
                      {project.umkm_profile?.nama_usaha || "Klien UMKM"}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                      Verified Client
                    </span>
                  </div>
                  <p className="text-[11px] text-muted">
                    {project.umkm_profile?.bidang_industri || "Usaha Mandiri"} •{" "}
                    {project.umkm_profile?.kota || "Indonesia"}
                  </p>
                </div>
              </div>
            </div>

            {/* 4-Stat Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
              <div className="p-3 bg-canvas rounded-2xl border border-border/80">
                <span className="text-[11px] font-semibold text-muted block">
                  Batas Anggaran:
                </span>
                <span className="text-sm font-black text-dark-900 block mt-0.5">
                  {formatCurrency(project.budget_max)}
                </span>
              </div>

              <div className="p-3 bg-canvas rounded-2xl border border-border/80">
                <span className="text-[11px] font-semibold text-muted block">
                  Tenggat Waktu:
                </span>
                <span
                  className={`text-sm font-bold block mt-0.5 ${daysLeft <= 3 ? "text-rose-600" : "text-dark-900"}`}
                >
                  {daysLeft > 0 ? `${daysLeft} Hari Lagi` : "Hari Terakhir"}
                </span>
              </div>

              <div className="p-3 bg-canvas rounded-2xl border border-border/80">
                <span className="text-[11px] font-semibold text-muted block">
                  Total Pelamar:
                </span>
                <span className="text-sm font-bold text-dark-900 block mt-0.5">
                  {project.total_pelamar || 0} Mahasiswa
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
                <span className="text-[11px] font-semibold text-emerald-800 block">
                  Proteksi Escrow:
                </span>
                <span className="text-sm font-bold text-emerald-900 block mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Aman
                </span>
              </div>
            </div>

            {/* Brief Description Body */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-indigo" />
                Rincian Kebutuhan & Deskripsi Brief UMKM
              </h3>

              <div className="p-5 bg-canvas rounded-2xl border border-border text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                {project.deskripsi_raw}
              </div>

              {/* Realtime Chat Banner */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-dark-900">
                      Ruang Diskusi & Kolaborasi Realtime
                    </h4>
                    <p className="text-[11px] text-muted">
                      Bahas kebutuhan brief, klarifikasi teknis, atau kirim
                      tautan Figma langsung dengan mitra.
                    </p>
                  </div>
                </div>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => {
                    if (!isAuthenticated) {
                      addToast(
                        "Silakan masuk terlebih dahulu untuk membuka ruang obrolan.",
                        "info",
                      );
                      navigate("/login");
                      return;
                    }
                    setChatModalOpen(true);
                  }}
                  className="shrink-0 text-xs font-bold py-2 px-4 shadow-brand"
                >
                  Buka Obrolan
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 2: How Escrow Pengerjaan Works (Roadmap Visual) */}
          <Card className="p-6 sm:p-7 space-y-4 bg-surface border-border rounded-3xl shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-indigo" />
              <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
                Alur Pengerjaan & Garansi Pembayaran Makarya
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3.5 bg-canvas rounded-2xl border border-border space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-dark-900 text-white font-bold flex items-center justify-center text-[11px]">
                  1
                </div>
                <h4 className="font-bold text-dark-900">Ajukan Proposal</h4>
                <p className="text-[11px] text-muted leading-snug">
                  Mahasiswa melampirkan portofolio, harga tawar, dan rencana
                  kerja.
                </p>
              </div>

              <div className="p-3.5 bg-canvas rounded-2xl border border-border space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-brand-indigo text-white font-bold flex items-center justify-center text-[11px]">
                  2
                </div>
                <h4 className="font-bold text-dark-900">Kunci Escrow</h4>
                <p className="text-[11px] text-muted leading-snug">
                  Klien UMKM menyetujui proposal & dana honor dikunci aman di
                  sistem.
                </p>
              </div>

              <div className="p-3.5 bg-canvas rounded-2xl border border-border space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-dark-900 text-white font-bold flex items-center justify-center text-[11px]">
                  3
                </div>
                <h4 className="font-bold text-dark-900">Eksekusi Karya</h4>
                <p className="text-[11px] text-muted leading-snug">
                  Mahasiswa mengerjakan tugas dan mengunggah tautan hasil kerja.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px]">
                  4
                </div>
                <h4 className="font-bold text-emerald-950">Pencairan Honor</h4>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Klien puas & honor 100% langsung cair ke dompet mahasiswa.
                </p>
              </div>
            </div>
          </Card>

          {/* Card 3: Tips Sukses Melamar Bagi Mahasiswa */}
          <Card className="p-6 space-y-3 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-indigo" />
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Panduan Melamar Efektif Bagi Mahasiswa
              </h3>
            </div>
            <ul className="text-xs text-indigo-900 space-y-1.5 pl-4 list-disc leading-relaxed">
              <li>
                Berikan penawaran harga yang wajar sesuai kompleksitas brief
                UMKM.
              </li>
              <li>
                Sertakan contoh karya nyata pada portofolio (Figma, GitHub,
                Behance, atau Drive).
              </li>
              <li>
                Tuliskan rencana langkah kerja yang jelas agar klien UMKM merasa
                yakin atas profesionalitas Anda.
              </li>
            </ul>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: STICKY PROPOSAL ACTION & CLIENT INFO (4 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Card 1: Action Box (Apply Button) */}
          <Card className="p-6 space-y-5 bg-surface border-border rounded-3xl shadow-md">
            <div className="space-y-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Batas Anggaran Klien (Budget Max)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-dark-900 font-sans tracking-tight">
                {formatCurrency(project.budget_max)}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                ✓ 0% Potongan Komisi bagi Mahasiswa
              </span>
            </div>

            {isOwner ? (
              <Link to="/proposals">
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full text-xs font-bold shadow-brand"
                >
                  Kelola Pelamar Proyek Ini →
                </Button>
              </Link>
            ) : user?.role === "UMKM" ? (
              <div className="space-y-3">
                <div className="p-4 bg-canvas rounded-2xl border border-border text-center space-y-1.5 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-dark-900 mx-auto">
                    <Building2 className="w-4 h-4 text-muted" />
                  </div>
                  <span className="text-xs font-bold text-dark-900 block">
                    Mode Klien UMKM
                  </span>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Hanya akun mahasiswa terverifikasi yang dapat mengajukan
                    proposal untuk proyek ini.
                  </p>
                </div>
                <Link to="/projects/new">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full text-xs font-bold border-border text-dark-900 hover:bg-surface"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    Pasang Kebutuhan Proyek Anda
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                variant="brand"
                size="lg"
                onClick={handleApplyClick}
                className="w-full text-xs sm:text-sm font-bold shadow-brand py-3.5"
              >
                <Send className="w-4 h-4 mr-2" />
                {isAuthenticated
                  ? "Lamar Proyek Ini"
                  : "Masuk untuk Melamar Proyek"}
              </Button>
            )}

            {/* Tombol Buka Ruang Obrolan */}
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                if (!isAuthenticated) {
                  addToast(
                    "Silakan masuk terlebih dahulu untuk membuka ruang kerja & obrolan.",
                    "info",
                  );
                  navigate("/login");
                  return;
                }
                navigate(`/proposals?project=${project.id}`);
              }}
              className="w-full text-xs font-bold border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 py-3 flex items-center justify-center gap-2 rounded-2xl"
            >
              <MessageSquare className="w-4 h-4 text-brand-indigo" />
              <span>Buka Ruang Kerja & Obrolan</span>
            </Button>

            {/* Escrow Guarantee Pill */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dana Terkunci di Escrow</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug font-normal">
                Honor kerja Anda otomatis dijamin dan dikunci di sistem saat
                proposal disetujui klien.
              </p>
            </div>
          </Card>

          {/* Card 2: Client UMKM Business Profile */}
          <Card className="p-6 space-y-4 bg-surface border-border rounded-3xl shadow-xs">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider border-b border-border pb-2 flex items-center justify-between">
              <span>Tentang Klien UMKM</span>
              <Building2 className="w-4 h-4 text-muted" />
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-dark-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                  {project.umkm_profile?.nama_usaha?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-dark-900 leading-snug">
                    {project.umkm_profile?.nama_usaha || "Klien UMKM"}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-muted" />
                    <span>{project.umkm_profile?.kota || "Indonesia"}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-canvas rounded-xl text-xs space-y-1.5 border border-border">
                <div className="flex justify-between">
                  <span className="text-muted">Bidang Industri:</span>
                  <span className="font-semibold text-dark-900">
                    {project.umkm_profile?.bidang_industri || "Usaha Mandiri"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Status Kemitraan:</span>
                  <span className="font-bold text-emerald-600">
                    Terverifikasi Aktif
                  </span>
                </div>
              </div>

              {project.umkm_profile?.deskripsi_usaha && (
                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                  "{project.umkm_profile.deskripsi_usaha}"
                </p>
              )}
            </div>
          </Card>

          {/* Card 3: Terms & Fair Practice Guarantee */}
          <Card className="p-5 space-y-2 bg-canvas border border-border rounded-2xl text-[11px] text-muted">
            <span className="font-bold text-dark-900 block">
              Ketentuan Kemitraan:
            </span>
            <p>
              1. Hak cipta hasil karya beralih ke UMKM setelah pembayaran
              disetujui.
            </p>
            <p>
              2. Mahasiswa berhak menyertakan hasil karya di portofolio pribadi.
            </p>
            <p>
              3. Resolusi sengketa diawasi langsung oleh sistem audit Makarya.
            </p>
          </Card>
        </div>
      </div>

      {/* Realtime Project Collaboration Chat Modal */}
      <ProjectChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        projectId={project?.id}
        projectTitle={project?.judul}
        partnerName={
          isOwner
            ? "Mahasiswa Talenta"
            : project?.umkm_profile?.nama_usaha || "Klien UMKM"
        }
        partnerRole={isOwner ? "MHS" : "UMKM"}
      />
    </div>
  );
}
