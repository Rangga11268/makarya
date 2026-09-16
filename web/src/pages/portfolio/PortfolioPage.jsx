import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ratingApi, projectApi, certificateApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StarRating } from "../../components/ui/StarRating";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getProjectUrl } from "../../utils/slugify";
import { CertificateViewModal } from "../../components/features/CertificateViewModal";
import { useToastStore } from "../../store/toastStore";
import {
  Award,
  GraduationCap,
  CheckCircle2,
  Building2,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  FileCheck2,
} from "lucide-react";
import { ProjectBriefVectorIcon } from "../../components/icons/ProjectVectorIcon";

export function PortfolioPage() {
  const { user, fetchProfile } = useAuthStore();
  const { addToast } = useToastStore();
  const isUmkm = user?.role === "UMKM";

  const [ratings, setRatings] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchProfile) {
      fetchProfile();
    }
    async function loadData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        if (isUmkm) {
          const [projectsRes, ratingsRes] = await Promise.all([
            projectApi.getMyProjects().catch(() => ({ data: [] })),
            ratingApi.getByUser(user.id).catch(() => ({ data: [] })),
          ]);
          setMyProjects(projectsRes.data);
          setRatings(ratingsRes.data);
        } else {
          const [ratingsRes, certsRes] = await Promise.all([
            ratingApi.getByUser(user.id).catch(() => ({ data: [] })),
            certificateApi.getMy().catch(() => ({ data: [] })),
          ]);
          setRatings(ratingsRes.data);
          setCertificates(certsRes.data);
        }
      } catch (err) {
        console.error("Gagal memuat portofolio:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id, isUmkm]);

  const handleToggleShowcase = async (cert) => {
    try {
      setTogglingId(cert.id);
      const updatedStatus = !cert.is_showcase;
      const res = await certificateApi.toggleShowcase(cert.id, {
        is_showcase: updatedStatus,
      });
      setCertificates((prev) =>
        prev.map((c) => (c.id === cert.id ? res.data : c))
      );
      addToast({
        type: "success",
        title: "Showcase Diperbarui",
        message: updatedStatus
          ? "Karya & sertifikat kini ditampilkan di profil publik Anda."
          : "Karya disembunyikan dari profil publik.",
      });
    } catch (err) {
      console.error("Gagal mengubah visibilitas showcase:", err);
      addToast({
        type: "error",
        title: "Gagal Mengubah Visibilitas",
        message: "Gagal memperbarui status showcase. Silakan coba lagi.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleViewCert = (cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, curr) => acc + curr.skor, 0) / ratings.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            {isUmkm ? "Profil & Riwayat Kemitraan" : "Portofolio Karya & Sertifikasi"}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-900 tracking-tight leading-tight mt-1">
            {isUmkm ? "Rekam Jejak Usaha UMKM" : "Karya Terverifikasi & Sertifikat Resmi"}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            {isUmkm
              ? "Informasi profil usaha, rekam jejak proyek yang Anda pasang, dan ulasan kepuasan dari talenta mahasiswa."
              : "Pamerkan hasil karya proyek industri Anda dan peroleh sertifikat digital resmi untuk portofolio & konversi MBKM."}
          </p>
        </div>

        {isUmkm && (
          <Link to="/projects/new">
            <Button
              variant="brand"
              size="md"
              className="shadow-brand text-xs font-bold shrink-0"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Pasang Proyek Baru
            </Button>
          </Link>
        )}
      </div>

      {/* ID Badge Card */}
      <div className="bg-surface border border-border rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {user?.url_foto ? (
            <img
              src={user.url_foto}
              alt={user?.nama || "Avatar"}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs border-2 border-slate-100"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-indigo text-white text-2xl font-bold flex items-center justify-center shrink-0 shadow-xs select-none">
              {(user?.nama || user?.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-dark-900 font-sans">
                {user?.nama ||
                  user?.nama_lengkap ||
                  user?.nama_usaha ||
                  user?.email}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-muted font-mono">{user?.email}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
              {isUmkm ? (
                <>
                  <Building2 className="w-4 h-4 text-brand-indigo" />
                  <span>Klien UMKM Terverifikasi, Mitra Usaha Makarya</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-brand-indigo" />
                  <span>Mahasiswa Terverifikasi, Domain Kampus .ac.id</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-8">
          <div className="text-center sm:text-left">
            <span className="text-xs text-muted block font-medium">
              Rating Rata-rata
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {avgRating ? (
                <>
                  <StarRating rating={parseFloat(avgRating)} size="md" />
                  <span className="text-sm font-bold text-dark-900">
                    {avgRating}
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted font-medium">
                  Belum ada ulasan
                </span>
              )}
            </div>
          </div>

          {!isUmkm && (
            <div className="text-center sm:text-left">
              <span className="text-xs text-muted block font-medium">
                Sertifikat Resmi
              </span>
              <span className="text-2xl font-black text-brand-indigo font-sans">
                {certificates.length}
              </span>
            </div>
          )}

          <div className="text-center sm:text-left">
            <span className="text-xs text-muted block font-medium">
              {isUmkm ? "Total Proyek Dipasang" : "Proyek Selesai"}
            </span>
            <span className="text-2xl font-black text-dark-900 font-sans">
              {isUmkm ? myProjects.length : ratings.length}
            </span>
          </div>
        </div>
      </div>

      {/* MAHASISWA ONLY: Showcase Karya & Sertifikat Terverifikasi */}
      {!isUmkm && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-indigo" />
                <h2 className="text-xl font-serif text-dark-900">
                  Showcase Karya & Sertifikat Terverifikasi
                </h2>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Setiap proyek selesai secara otomatis menghasilkan sertifikat resmi dan dapat Anda tampilkan di profil publik talenta.
              </p>
            </div>
            {certificates.length > 0 && (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                {certificates.filter((c) => c.is_showcase).length} dari {certificates.length} tampil publik
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-48 bg-surface rounded-3xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <Card className="text-center py-10 px-4 space-y-3 bg-surface border-border">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-dark-900">
                Belum Ada Sertifikat Proyek
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto">
                Selesaikan penugasan proyek UMKM pertama Anda hingga disetujui klien untuk secara otomatis memperoleh sertifikat digital resmi dan showcase portofolio.
              </p>
              <Link to="/projects">
                <Button variant="brand" size="sm" className="text-xs font-bold shadow-xs">
                  Cari Lowongan Proyek UMKM
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificates.map((cert) => (
                <Card
                  key={cert.id}
                  className="p-5 sm:p-6 space-y-4 bg-surface border border-border hover:border-brand-indigo/40 transition-all rounded-3xl shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="brand" className="text-xs font-bold">
                          {cert.role_name}
                        </Badge>
                        {cert.project_category && (
                          <Badge variant="outline" className="text-[10px]">
                            {cert.project_category}
                          </Badge>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-muted font-bold tracking-wider">
                        {cert.credential_id}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-dark-900 line-clamp-1">
                        {cert.project_title}
                      </h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-muted" />
                        Klien: <strong className="text-dark-900">{cert.client_name}</strong>
                      </p>
                    </div>

                    <p className="text-xs text-muted leading-relaxed font-sans line-clamp-2">
                      {cert.showcase_description ||
                        `Penyelesaian penugasan ${cert.role_name} untuk proyek ${cert.project_title}.`}
                    </p>

                    {cert.deliverable_url && (
                      <div className="pt-1">
                        <a
                          href={cert.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Buka Berkas Hasil Karya (Figma/GitHub/Live)
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Toggle Showcase Button */}
                    <button
                      type="button"
                      disabled={togglingId === cert.id}
                      onClick={() => handleToggleShowcase(cert)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all text-xs ${
                        cert.is_showcase
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {cert.is_showcase ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tampil di Publik</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Disembunyikan</span>
                        </>
                      )}
                    </button>

                    {/* View Certificate Action */}
                    <Button
                      variant="brand"
                      size="sm"
                      onClick={() => handleViewCert(cert)}
                      className="text-xs font-semibold shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5 mr-1.5" />
                      Lihat Sertifikat
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* UMKM ONLY: Published Projects Section */}
      {isUmkm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-dark-900">
              Daftar Proyek yang Pernah Anda Pasang
            </h2>
            <Link
              to="/proposals"
              className="text-xs font-bold text-brand-indigo hover:underline"
            >
              Kelola Semua Pelamar & Pekerjaan →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-40 bg-surface rounded-2xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : myProjects.length === 0 ? (
            <Card className="text-center py-12 space-y-3 bg-surface border-border">
              <ProjectBriefVectorIcon
                size={40}
                className="w-10 h-10 text-muted mx-auto opacity-40"
              />
              <h3 className="text-sm font-bold text-dark-900">
                Belum Ada Proyek yang Dipasang
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Pasang kebutuhan desain, website, atau promosi usaha Anda untuk
                mendapatkan proposal dari mahasiswa bertalenta.
              </p>
              <Link to="/projects/new">
                <Button
                  variant="brand"
                  size="sm"
                  className="mt-2 text-xs font-bold shadow-brand"
                >
                  Pasang Proyek Pertama Sekarang
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProjects.map((proj) => (
                <Card
                  key={proj.id}
                  className="p-5 space-y-3 bg-surface border-border hover:border-brand-indigo/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="dark">{proj.kategori}</Badge>
                    <Badge
                      variant={
                        proj.status === "COMPLETED" || proj.status === "DONE"
                          ? "success"
                          : proj.status === "IN_PROGRESS"
                            ? "brand"
                            : "warning"
                      }
                    >
                      {proj.status}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-dark-900 line-clamp-1">
                    {proj.judul}
                  </h3>
                  <div className="text-base font-black text-dark-900">
                    {formatCurrency(proj.budget_max)}
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted">
                      Tenggat: {formatDate(proj.deadline)}
                    </span>
                    <Link
                      to={getProjectUrl(proj)}
                      className="font-bold text-brand-indigo hover:underline flex items-center gap-1"
                    >
                      Detail <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif text-dark-900">
          {isUmkm
            ? "Ulasan dari Mahasiswa yang Bekerjasama"
            : "Ulasan & Penilaian Klien UMKM"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-40 bg-surface rounded-card border border-border animate-pulse"
              />
            ))}
          </div>
        ) : ratings.length === 0 ? (
          <EmptyState
            icon={Award}
            title={
              isUmkm
                ? "Belum ada ulasan kemitraan"
                : "Belum ada ulasan portofolio"
            }
            description={
              isUmkm
                ? "Selesaikan proyek pertama Anda bersama mahasiswa untuk mengumpulkan reputasi kemitraan usaha."
                : "Selesaikan proyek pertama Anda dan minta klien UMKM memberikan ulasan kepuasan kerja."
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ratings.map((r) => (
              <Card
                key={r.id}
                className="p-5 sm:p-6 space-y-3 bg-surface border border-border shadow-xs hover:border-dark-900/30 transition-all rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <StarRating rating={r.skor} size="sm" />
                  <span className="text-xs text-muted font-mono">
                    {formatDate(r.created_at)}
                  </span>
                </div>

                {r.project_judul && (
                  <h4 className="text-xs font-bold text-dark-900 line-clamp-1">
                    {r.project_judul}
                  </h4>
                )}

                <p className="text-xs sm:text-sm text-dark-900/90 leading-relaxed font-sans italic">
                  "
                  {r.ulasan ||
                    "Kerjasama berjalan sangat baik, komunikatif, dan memuaskan."}
                  "
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted" />
                    <span>Proyek Terverifikasi:</span>
                    <span className="font-mono text-dark-900 font-semibold">
                      #{r.project_id ? r.project_id.slice(0, 8) : "PROYEK"}
                    </span>
                  </div>
                  {r.dari_nama && (
                    <span className="text-muted font-medium">
                      Oleh: <b className="text-dark-900">{r.dari_nama}</b>
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Certificate View Modal */}
      <CertificateViewModal
        certificate={selectedCert}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCert(null);
        }}
      />
    </div>
  );
}
