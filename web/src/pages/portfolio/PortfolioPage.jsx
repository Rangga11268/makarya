import React, { useState, useEffect } from "react";
import { ratingApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/ui/Card";
import { StarRating } from "../../components/ui/StarRating";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { formatDate } from "../../utils/formatDate";
import { Award, GraduationCap, CheckCircle2, Building2 } from "lucide-react";

export function PortfolioPage() {
  const { user } = useAuthStore();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await ratingApi.getByUser(user.id);
        setRatings(res.data);
      } catch (err) {
        console.error("Gagal memuat ulasan portofolio:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [user?.id]);

  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, curr) => acc + curr.skor, 0) / ratings.length).toFixed(1)
    : "5.0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
          Reputasi & Kinerja
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1">
          Portofolio Karya Mahasiswa
        </h1>
        <p className="text-xs sm:text-sm text-muted font-sans mt-1">
          Kumpulan ulasan terverifikasi dan hasil kerja nyata dari proyek UMKM yang telah Anda selesaikan
        </p>
      </div>

      {/* Top Banner / Student Badge */}
      <div className="bg-surface border border-border rounded-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-cyan to-brand-indigo text-white font-serif text-2xl font-bold flex items-center justify-center shrink-0 shadow-xs">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-dark-900 font-sans">{user?.email}</h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
              <GraduationCap className="w-4 h-4" />
              <span>Mahasiswa Terverifikasi • Domain Kampus .ac.id</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-8">
          <div className="text-center sm:text-left">
            <span className="text-xs text-muted block font-medium">Rating Rata-rata</span>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={parseFloat(avgRating)} size="md" />
            </div>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-xs text-muted block font-medium">Proyek Selesai</span>
            <span className="text-2xl font-black text-dark-900 font-sans">{ratings.length}</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif text-dark-900">
          Ulasan & Penilaian Klien UMKM
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 bg-surface rounded-card border border-border animate-pulse" />
            ))}
          </div>
        ) : ratings.length === 0 ? (
          <EmptyState
            icon={Award}
            title="Belum ada ulasan portofolio"
            description="Selesaikan proyek pertama Anda dan minta klien UMKM memberikan ulasan kepuasan kerja."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ratings.map((r) => (
              <Card key={r.id} className="p-6 space-y-3 bg-surface border-border">
                <div className="flex items-center justify-between">
                  <StarRating rating={r.skor} size="sm" />
                  <span className="text-xs text-muted">{formatDate(r.created_at)}</span>
                </div>

                <p className="text-xs sm:text-sm text-dark-900/90 leading-relaxed font-sans italic">
                  "{r.ulasan || "Pekerjaan diselesaikan dengan sangat baik, rapi, dan tepat waktu."}"
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-muted pt-3 border-t border-border-subtle">
                  <Building2 className="w-3.5 h-3.5 text-muted" />
                  <span>Proyek Terverifikasi: </span>
                  <span className="font-mono text-dark-900 font-semibold">#{r.project_id.slice(0, 8)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}