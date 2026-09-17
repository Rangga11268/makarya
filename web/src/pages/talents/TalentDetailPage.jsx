import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { talentApi, projectApi, certificateApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { StarRating } from "../../components/ui/StarRating";
import { CertificateViewModal } from "../../components/features/CertificateViewModal";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatStatus } from "../../utils/formatStatus";
import { formatDate } from "../../utils/formatDate";
import {
  ProdiVectorIcon,
  CampusVectorIcon,
  GithubVectorIcon,
  FigmaVectorIcon,
  GlobeVectorIcon,
  LinkedinVectorIcon,
} from "../../components/icons/ProfileVectorIcons";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Award,
  Star,
  ShieldCheck,
  MessageSquare,
  Mail,
  ExternalLink,
  PlusCircle,
  Quote,
  Share2,
  Calendar,
  Send,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";

export function TalentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();

  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showcaseCerts, setShowcaseCerts] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const isUmkm = isAuthenticated && user?.role?.toUpperCase() === "UMKM";
  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const categoryLabels = {
    DESIGN: "Desain Grafis",
    DESAIN: "Desain Grafis",
    UIUX: "UI/UX Design",
    PEMROGRAMAN: "Web & Coding",
    VIDEO: "Video & Animasi",
    COPYWRITING: "Copywriting & SEO",
    ADMIN_DATA: "Admin & Data",
  };

  // 1. Fetch Talent Detail & Showcase Certificates
  const fetchTalent = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resTalent, resCerts] = await Promise.all([
        talentApi.getTalentDetail(id),
        certificateApi.getUserShowcase(id).catch(() => ({ data: [] })),
      ]);
      setTalent(resTalent?.data || resTalent);
      setShowcaseCerts(resCerts?.data || []);
    } catch (err) {
      console.error("Gagal memuat detail talenta:", err);
      setError("Profil talenta tidak ditemukan atau terjadi kendala jaringan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTalent();
    }
  }, [id]);

  // 2. Fetch UMKM Active Projects if logged in as UMKM
  useEffect(() => {
    if (isUmkm) {
      async function loadProjects() {
        try {
          setLoadingProjects(true);
          const res = await projectApi.getMyProjects();
          const list = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
              ? res
              : [];
          // Filter hanya proyek yang masih terbuka untuk pendaftaran / rekrutmen talenta
          const openProjects = list.filter(
            (p) => p.status === "OPEN" || p.status === "BIDDING",
          );
          setMyProjects(openProjects);
          if (openProjects.length > 0) {
            setSelectedProjectId(openProjects[0].id);
          }
        } catch (err) {
          console.error("Gagal memuat daftar proyek UMKM:", err);
        } finally {
          setLoadingProjects(false);
        }
      }
      loadProjects();
    }
  }, [isUmkm]);

  const [inviting, setInviting] = useState(false);
  const [copiedProject, setCopiedProject] = useState(false);

  const selectedProject = myProjects.find((p) => p.id === selectedProjectId);

  // Handle Action: Send Official Collaboration Invitation
  const handleSendInvitation = async () => {
    if (!selectedProjectId) {
      addToast({
        type: "warning",
        title: "Pilih Proyek",
        message:
          "Silakan pilih salah satu proyek aktif Anda untuk mengundang talenta ini.",
      });
      return;
    }
    try {
      setInviting(true);
      const res = await talentApi.inviteTalent(talent.id, {
        project_id: selectedProjectId,
      });
      addToast({
        type: "success",
        title: "Undangan Kolaborasi Terkirim!",
        message:
          res?.data?.message ||
          `Tawaran kolaborasi resmi berhasil dikirimkan ke akun ${talent.nama_lengkap}.`,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.detail || "Gagal mengirimkan undangan kolaborasi.";
      addToast({
        type: "error",
        title: "Gagal Mengirim Undangan",
        message: msg,
      });
    } finally {
      setInviting(false);
    }
  };

  // Salin tautan proyek untuk dibagikan ke mahasiswa
  const handleCopyProjectLink = () => {
    if (!selectedProjectId) return;
    const url = `${window.location.origin}/projects/${selectedProjectId}`;
    navigator.clipboard.writeText(url);
    setCopiedProject(true);
    addToast({
      type: "success",
      title: "Tautan Proyek Disalin",
      message:
        "Tautan rincian proyek berhasil disalin untuk dibagikan ke talenta.",
    });
    setTimeout(() => setCopiedProject(false), 2000);
  };

  // Copy Profile Link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      type: "success",
      title: "Tautan Disalin",
      message: "Link profil talenta berhasil disalin ke clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="h-6 w-44 bg-slate-200 rounded-md animate-pulse" />
        <div className="h-64 bg-surface rounded-2xl border border-border animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 md:col-span-2 bg-surface rounded-2xl border border-border animate-pulse" />
          <div className="h-48 bg-surface rounded-2xl border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-8 bg-surface rounded-2xl border border-border shadow-xs space-y-4">
          <p className="text-base font-semibold text-slate-800">
            {error || "Profil talenta tidak ditemukan."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/talents")}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Kembali ke Direktori
            </Button>
            <Button variant="brand" size="sm" onClick={fetchTalent}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initial = talent.nama_lengkap
    ? talent.nama_lengkap.charAt(0).toUpperCase()
    : "M";
  const ratingScore = Number(talent.rating_avg) || 0;
  const hasRating = ratingScore > 0;
  const completedProjects = talent.total_proyek_selesai ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/talents"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Mahasiswa</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-dark-900 bg-surface hover:bg-slate-100 border border-border rounded-xl transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Bagikan Profil</span>
        </button>
      </div>

      {/* Main Profile Header Card with Cover Banner */}
      <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
        {/* Cover Banner */}
        <div className="relative w-full h-36 sm:h-44 bg-slate-900 overflow-hidden">
          <img
            src={
              talent.banner_url ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
            }
            alt={talent.nama_lengkap}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        </div>

        <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="-mt-12 sm:-mt-14 shrink-0">
              {talent.url_foto ? (
                <img
                  src={talent.url_foto}
                  alt={talent.nama_lengkap}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-4 border-white bg-white"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brand-indigo text-white font-serif text-3xl sm:text-4xl font-bold flex items-center justify-center shadow-md border-4 border-white">
                  {initial}
                </div>
              )}
            </div>

            {/* Identity Info */}
            <div className="flex-1 text-center sm:text-left space-y-2.5 pt-2 sm:pt-3 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-dark-900">
                  {talent.nama_lengkap}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                  Terverifikasi Kampus
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <ProdiVectorIcon
                    size={14}
                    className="text-brand-indigo shrink-0"
                  />
                  <span>{talent.prodi || "Belum Memilih Prodi"}</span>
                </span>
                <span className="text-slate-300 font-light">/</span>
                <span className="flex items-center gap-1">
                  <CampusVectorIcon
                    size={14}
                    className="text-amber-500 shrink-0"
                  />
                  <span>
                    {talent.universitas ||
                      "Universitas Bina Sarana Informatika"}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {talent.nim && (
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    NIM {talent.nim}
                  </span>
                )}
                <span className="text-xs font-semibold text-brand-indigo bg-brand-indigo-light px-2.5 py-1 rounded-lg border border-brand-indigo/15">
                  Semester {talent.semester || 6}
                </span>
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{talent.status_badge || "Talenta Terverifikasi"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 3 Core Trust Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="p-3.5 bg-canvas rounded-xl border border-border text-center">
              <span className="text-xs text-slate-500 block">
                Rating Kepuasan
              </span>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <StarRating rating={ratingScore} size="sm" />
                <span className="text-sm font-bold text-dark-900">
                  {hasRating ? ratingScore.toFixed(1) : "Belum Ada"}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {talent.reviews_count || 0} Ulasan Klien
              </span>
            </div>

            <div className="p-3.5 bg-canvas rounded-xl border border-border text-center">
              <span className="text-xs text-slate-500 block">
                Proyek Selesai
              </span>
              <span className="text-base font-extrabold text-dark-900 block mt-1">
                {completedProjects} Proyek
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Penyelesaian Tepat Waktu
              </span>
            </div>

            <div className="p-3.5 bg-canvas rounded-xl border border-border text-center">
              <span className="text-xs text-slate-500 block">
                Proteksi Escrow
              </span>
              <div className="flex items-center justify-center gap-1 text-base font-extrabold text-emerald-700 mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {completedProjects > 0
                    ? talent.escrow_success_rate || "100%"
                    : "100% Aman"}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Dana Dijamin Sistem
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Grid: Left (Bio, Skills, Portofolio, Testimoni) vs Right (Kolaborasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: 2/3 Width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider text-slate-500">
              Tentang & Ringkasan Profil
            </h2>
            {talent.bio ? (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {talent.bio}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Mahasiswa belum melengkapi deskripsi bio profil.
              </p>
            )}
          </div>

          {/* Skills Section */}
          {talent.skills && talent.skills.length > 0 && (
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider text-slate-500">
                Keahlian & Kemampuan Teknis
              </h2>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-brand-indigo-light text-brand-indigo border border-brand-indigo/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Portofolio Links */}
          {(talent.github_url ||
            talent.figma_url ||
            talent.website_url ||
            talent.linkedin_url ||
            talent.url_portofolio) && (
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider text-slate-500">
                Tautan Portofolio & Karya
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {talent.github_url && (
                  <a
                    href={talent.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold group"
                  >
                    <div className="flex items-center gap-2.5">
                      <GithubVectorIcon size={18} />
                      <span>GitHub Repository</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-dark-900" />
                  </a>
                )}
                {talent.figma_url && (
                  <a
                    href={talent.figma_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FigmaVectorIcon size={18} />
                      <span>Figma Portofolio</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-dark-900" />
                  </a>
                )}
                {talent.website_url && (
                  <a
                    href={talent.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold group"
                  >
                    <div className="flex items-center gap-2.5">
                      <GlobeVectorIcon size={18} />
                      <span>Website Pribadi</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-dark-900" />
                  </a>
                )}
                {talent.linkedin_url && (
                  <a
                    href={talent.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 text-[#0A66C2] transition-colors flex items-center justify-between text-xs font-semibold group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LinkedinVectorIcon size={18} />
                      <span>LinkedIn Profile</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-dark-900" />
                  </a>
                )}
                {talent.url_portofolio &&
                  !talent.github_url &&
                  !talent.figma_url &&
                  !talent.website_url &&
                  !talent.linkedin_url && (
                    <a
                      href={
                        talent.url_portofolio.startsWith("http")
                          ? talent.url_portofolio
                          : `https://${talent.url_portofolio}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border border-border bg-canvas hover:border-dark-900 text-slate-800 transition-colors flex items-center justify-between text-xs font-semibold group"
                    >
                      <div className="flex items-center gap-2.5">
                        <GlobeVectorIcon size={18} />
                        <span>Lihat Portofolio</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-dark-900" />
                    </a>
                  )}
              </div>
            </div>
          )}

          {/* Showcase Karya & Sertifikat Terverifikasi */}
          {showcaseCerts && showcaseCerts.length > 0 && (
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-indigo" />
                  <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider text-slate-500">
                    Karya Terverifikasi & Sertifikat Resmi
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {showcaseCerts.length} Sertifikat Valid
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {showcaseCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl border border-border bg-canvas hover:border-brand-indigo/30 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="brand"
                          className="text-[11px] font-bold"
                        >
                          {cert.role_name}
                        </Badge>
                        <span className="font-mono text-[10px] text-muted font-semibold">
                          {cert.credential_id}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-dark-900 line-clamp-1">
                        {cert.project_title}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Mitra UMKM:{" "}
                        <strong className="text-dark-900">
                          {cert.client_name}
                        </strong>
                      </p>
                      {cert.showcase_description && (
                        <p className="text-xs text-slate-600 line-clamp-2 italic">
                          "{cert.showcase_description}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                      {cert.deliverable_url ? (
                        <a
                          href={cert.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-brand-indigo hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Hasil Karya
                        </a>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Terverifikasi
                        </span>
                      )}

                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => {
                          setSelectedCert(cert);
                          setIsCertModalOpen(true);
                        }}
                        className="text-[11px] font-semibold h-7 px-2.5 shadow-xs"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Lihat Sertifikat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client Reviews Section */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider text-slate-500">
                Ulasan & Riwayat Klien UMKM
              </h2>
              <span className="text-xs text-slate-500">
                {talent.recent_reviews?.length || 0} Ulasan Terverifikasi
              </span>
            </div>

            {talent.recent_reviews && talent.recent_reviews.length > 0 ? (
              <div className="space-y-3">
                {talent.recent_reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-border bg-canvas space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-dark-900 text-xs block truncate">
                          {rev.client_name}
                        </span>
                        {rev.project_title && (
                          <span className="text-[11px] text-slate-500 block truncate">
                            Proyek: {rev.project_title}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-xs font-bold text-dark-900">
                          {Number(rev.skor).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{rev.ulasan}"
                    </p>
                    {rev.created_at && (
                      <span className="text-[10px] text-slate-400 block pt-1">
                        {formatDate(rev.created_at)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-canvas rounded-xl border border-border text-center space-y-1">
                <p className="text-xs font-medium text-slate-700">
                  Belum ada ulasan publik untuk mahasiswa ini.
                </p>
                <p className="text-[11px] text-slate-400">
                  Jadilah UMKM pertama yang berkolaborasi dan memberikan ulasan
                  kinerja.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 1/3 Width (Collaboration Action Sidebar) */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-dark-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-indigo" />
              <span>Ajak Kolaborasi Proyek</span>
            </h2>

            {isUmkm ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilih salah satu proyek aktif Anda untuk membuka diskusi kerja
                  sama langsung dengan talenta ini:
                </p>

                {loadingProjects ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-canvas rounded-xl border border-border">
                    Memeriksa daftar proyek aktif Anda...
                  </div>
                ) : myProjects.length > 0 ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Pilih Proyek UMKM Anda:
                    </label>
                    <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1 py-1">
                      {myProjects.map((p) => {
                        const isSelected = selectedProjectId === p.id;
                        const isOpen =
                          p.status === "OPEN" || p.status === "BIDDING";
                        const isInProgress = p.status === "IN_PROGRESS";

                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProjectId(p.id)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                              isSelected
                                ? "bg-brand-indigo-light/30 border-brand-indigo ring-1 ring-brand-indigo shadow-xs"
                                : "bg-canvas border-border hover:border-slate-300"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-dark-900 truncate block">
                                {p.judul}
                              </span>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                <span className="font-bold text-brand-indigo font-mono">
                                  {formatCurrency(p.budget_max)}
                                </span>
                                <span>•</span>
                                <span className="font-medium text-slate-600">
                                  {categoryLabels[p.kategori] ||
                                    p.kategori ||
                                    "Proyek Digital"}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-brand-indigo bg-brand-indigo"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 space-y-2">
                      <Link
                        to={`/chat/${selectedProjectId}?talent=${talent.id}`}
                        className="block w-full"
                      >
                        <Button
                          variant="brand"
                          size="sm"
                          className="w-full font-bold text-xs shadow-brand py-2.5 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>Buka Ruang Chat Kolaborasi</span>
                        </Button>
                      </Link>

                      <Button
                        variant="secondary"
                        size="sm"
                        loading={inviting}
                        onClick={handleSendInvitation}
                        className="w-full font-semibold text-xs py-2 cursor-pointer flex items-center justify-center gap-1.5 border border-border bg-canvas hover:bg-slate-100"
                      >
                        <Send className="w-3.5 h-3.5 shrink-0 text-brand-indigo" />
                        <span>Kirim Notifikasi Undangan Resmi</span>
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleCopyProjectLink}
                          className="py-2 px-2.5 rounded-xl border border-border bg-canvas hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Salin tautan proyek untuk dibagikan ke mahasiswa"
                        >
                          {copiedProject ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>
                            {copiedProject ? "Tersalin!" : "Salin Link"}
                          </span>
                        </button>

                        <Link
                          to={`/projects/${selectedProjectId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-2.5 rounded-xl border border-border bg-canvas hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                          title="Lihat rincian halaman proyek"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          <span>Rincian Proyek</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-canvas border border-border rounded-xl space-y-3 text-center">
                    <p className="text-xs text-slate-500">
                      Anda belum memiliki proyek dengan status Terbuka
                      (Open/Bidding) untuk mengajak kolaborasi.
                    </p>
                    <Link to="/projects/new">
                      <Button
                        variant="brand"
                        size="sm"
                        className="w-full text-xs font-bold"
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Pasang Proyek Baru
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Email Direct Option */}
                {talent.email && (
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4 text-brand-indigo shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-dark-900 block truncate">
                          Email Resmi Kampus
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {talent.email}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`mailto:${talent.email}?subject=Tawaran%20Kolaborasi%20Proyek%20Makarya%20-%20${encodeURIComponent(selectedProject?.judul || "Peluang Kerja Sama")}&body=Halo%20${encodeURIComponent(talent.nama_lengkap)},%0D%0A%0D%0AKami%20dari%20UMKM%20tertarik%20mengajak%20Anda%20berkolaborasi%20untuk%20proyek%20%22${encodeURIComponent(selectedProject?.judul || "")}%22.%0D%0A%0D%0ASilakan%20buka%20rincian%20proyek%20kami%20di%20platform%20Makarya.`}
                      className="px-2.5 py-1 text-xs font-bold text-brand-indigo hover:underline shrink-0"
                    >
                      Kirim Email
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Masuk sebagai <b>Klien UMKM</b> untuk langsung mengajak
                  talenta ini berkolaborasi dalam proyek usaha Anda.
                </p>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Keuntungan Kolaborasi Resmi:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
                    <li>Sistem pembayaran escrow aman & bergaransi.</li>
                    <li>Ruang kerja terstruktur dengan fitur chat resmi.</li>
                    <li>Sertifikat kolaborasi kampus untuk mahasiswa.</li>
                  </ul>
                </div>

                <Link to="/login" className="block">
                  <Button
                    variant="brand"
                    size="sm"
                    className="w-full text-xs font-bold"
                  >
                    Masuk Sebagai Klien UMKM
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Certificate View Modal */}
      <CertificateViewModal
        certificate={selectedCert}
        isOpen={isCertModalOpen}
        onClose={() => {
          setIsCertModalOpen(false);
          setSelectedCert(null);
        }}
      />
    </div>
  );
}
