import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ratingApi, projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StarRating } from "../../components/ui/StarRating";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getProjectUrl } from "../../utils/slugify";
import {
  Award,
  GraduationCap,
  CheckCircle2,
  Building2,
  Briefcase,
  PlusCircle,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export function PortfolioPage() {
  const { user } = useAuthStore();
  const isUmkm = user?.role === "UMKM";

  const [ratings, setRatings] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          const res = await ratingApi.getByUser(user.id);
          setRatings(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat portofolio:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id, isUmkm]);

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, curr) => acc + curr.skor, 0) / ratings.length
        ).toFixed(1)
      : "5.0";

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            {isUmkm ? "Profil & Riwayat Kemitraan" : "Reputasi & Kinerja Kerja"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1">
            {isUmkm ? "Rekam Jejak Usaha UMKM" : "Portofolio Karya Mahasiswa"}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            {isUmkm
              ? "Informasi profil usaha, rekam jejak proyek yang Anda pasang, dan ulasan kepuasan dari talenta mahasiswa."
              : "Kumpulan ulasan terverifikasi dan hasil kerja nyata dari proyek UMKM yang telah Anda selesaikan."}
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
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-indigo text-white font-serif text-2xl font-bold flex items-center justify-center shrink-0 shadow-xs select-none">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-dark-900 font-sans">
                {user?.email}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
              {isUmkm ? (
                <>
                  <Building2 className="w-4 h-4 text-brand-indigo" />
                  <span>Klien UMKM Terverifikasi • Mitra Usaha Makarya</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-brand-indigo" />
                  <span>Mahasiswa Terverifikasi • Domain Kampus .ac.id</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-8">
          <div className="text-center sm:text-left">
            <span className="text-xs text-muted block font-medium">
              Rating Rata-rata
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={parseFloat(avgRating)} size="md" />
            </div>
          </div>

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
              <Briefcase className="w-10 h-10 text-muted mx-auto opacity-40" />
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
                        proj.status === "COMPLETED"
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
                className="p-6 space-y-3 bg-surface border-border"
              >
                <div className="flex items-center justify-between">
                  <StarRating rating={r.skor} size="sm" />
                  <span className="text-xs text-muted">
                    {formatDate(r.created_at)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-dark-900/90 leading-relaxed font-sans italic">
                  "
                  {r.ulasan ||
                    "Kerjasama berjalan sangat baik, komunikatif, dan memuaskan."}
                  "
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-muted pt-3 border-t border-border-subtle">
                  <Building2 className="w-3.5 h-3.5 text-muted" />
                  <span>Proyek Terverifikasi: </span>
                  <span className="font-mono text-dark-900 font-semibold">
                    #{r.project_id.slice(0, 8)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
