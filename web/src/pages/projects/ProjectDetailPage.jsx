import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { projectApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ProposalModal } from "../../components/features/ProposalModal";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, daysRemaining } from "../../utils/formatDate";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  Tag,
  Users,
  Send,
} from "lucide-react";

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
        "Akun Klien UMKM tidak dapat mengajukan proposal proyek. Gunakan akun mahasiswa.",
        "warning",
      );
      return;
    }
    setModalOpen(true);
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getDetail(id);
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
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-surface rounded-card border border-border" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold">Proyek tidak ditemukan</h2>
        <Link
          to="/projects"
          className="text-xs text-dark-800 hover:underline mt-2 block"
        >
          Kembali ke Jelajah Proyek
        </Link>
      </div>
    );
  }

  const daysLeft = daysRemaining(project.deadline);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Daftar Proyek
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="dark">{project.kategori}</Badge>
                <Badge
                  variant={project.status === "OPEN" ? "success" : "warning"}
                >
                  Status: {project.status}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight leading-tight">
                {project.judul}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Diposting: {formatDate(project.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-dark-800" />
                  Tenggat: {formatDate(project.deadline)} ({daysLeft} hari lagi)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {project.total_pelamar} Mahasiswa Melamar
                </span>
              </div>
            </div>

            {/* Description Section */}
            <div className="pt-6 border-t border-border space-y-3">
              <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
                Deskripsi & Kebutuhan Proyek
              </h3>
              <p className="text-sm text-dark-900/90 leading-relaxed whitespace-pre-line font-normal">
                {project.deskripsi_raw}
              </p>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Client Profile & Proposal Action */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="p-6 space-y-4 bg-surface border-dark-800/20 shadow-xs">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block">
              Batas Anggaran Klien
            </span>
            <div className="text-3xl font-black text-dark-900">
              {formatCurrency(project.budget_max)}
            </div>

            <Button
              variant="brand"
              size="lg"
              onClick={handleApplyClick}
              className="w-full text-sm font-bold shadow-brand"
            >
              <Send className="w-4 h-4 mr-1.5" />
              Lamar Proyek Ini
            </Button>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Escrow Protected
              </div>
              <p className="text-[11px] text-emerald-700 leading-snug">
                Honor kerja Anda otomatis dijamin dan dikunci di sistem saat
                proposal disetujui.
              </p>
            </div>
          </Card>

          {/* Client Profile Card */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider border-b border-border pb-2">
              Profil Pemberi Kerja (UMKM)
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-dark-900 text-white flex items-center justify-center font-bold text-sm">
                {project.umkm_profile?.nama_usaha?.charAt(0) || "U"}
              </div>
              <div>
                <h4 className="text-sm font-bold text-dark-900">
                  {project.umkm_profile?.nama_usaha || "Klien UMKM"}
                </h4>
                <p className="text-xs text-muted">
                  {project.umkm_profile?.bidang_industri || "Usaha Mandiri"} •{" "}
                  {project.umkm_profile?.kota || "Indonesia"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Kirim Proposal */}
      <ProposalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={project}
        onSuccess={fetchProject}
      />
    </div>
  );
}
