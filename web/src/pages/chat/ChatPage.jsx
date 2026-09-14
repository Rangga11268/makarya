import React, { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { projectApi, talentApi, chatApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { WorkroomChatPanel } from "../../components/features/WorkroomChatPanel";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatStatus } from "../../utils/formatStatus";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export function ChatPage() {
  const { projectId: routeProjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const isUmkm = user?.role?.toUpperCase() === "UMKM";
  const talentId = searchParams.get("talent");

  // Projects list
  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(
    routeProjectId || "",
  );

  // Targeted talent profile (if coming from talent directory / detail)
  const [talentPartner, setTalentPartner] = useState(null);
  const [loadingTalent, setLoadingTalent] = useState(false);

  // Pre-chat sending state
  const [sendingPreChat, setSendingPreChat] = useState(false);

  // 1. Fetch UMKM's projects
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
          setMyProjects(list);

          // Select project from route param or fallback to first project
          if (routeProjectId) {
            setSelectedProjectId(routeProjectId);
          } else if (list.length > 0) {
            setSelectedProjectId(list[0].id);
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              return next;
            });
          }
        } catch (err) {
          console.error("Gagal memuat proyek UMKM:", err);
        } finally {
          setLoadingProjects(false);
        }
      }
      loadProjects();
    }
  }, [isUmkm, routeProjectId]);

  // 2. Fetch talent detail if talent param is provided
  useEffect(() => {
    if (talentId) {
      async function loadTalent() {
        try {
          setLoadingTalent(true);
          const res = await talentApi.getTalentDetail(talentId);
          setTalentPartner(res?.data || res);
        } catch (err) {
          console.error("Gagal memuat profil talenta partner:", err);
        } finally {
          setLoadingTalent(false);
        }
      }
      loadTalent();
    }
  }, [talentId]);

  // Active Project
  const activeProject = myProjects.find((p) => p.id === selectedProjectId);

  // Switch Active Project
  const handleSwitchProject = (newProjectId) => {
    setSelectedProjectId(newProjectId);
    navigate(`/chat/${newProjectId}${talentId ? `?talent=${talentId}` : ""}`, {
      replace: true,
    });
  };

  // Generate Recommended Pre-Chat Pitch
  const preChatMessage = (() => {
    const talentName = talentPartner?.nama_lengkap || "Rekan Mahasiswa";
    const projectTitle = activeProject?.judul || "proyek kami";
    return `Halo ${talentName}, kami tertarik mengajak Anda berkolaborasi untuk proyek "${projectTitle}". Apakah Anda bersedia mendiskusikan brief dan ketersediaan waktu untuk pengerjaan proyek ini?`;
  })();

  // Send Pre-Chat Directly to Room
  const handleSendPreChat = async () => {
    if (!selectedProjectId) {
      addToast({
        type: "warning",
        title: "Pilih Proyek",
        message: "Silakan pilih salah satu proyek terlebih dahulu.",
      });
      return;
    }
    try {
      setSendingPreChat(true);
      await chatApi.sendMessage(selectedProjectId, {
        message: preChatMessage,
      });
      addToast({
        type: "success",
        title: "Pesan Terkirim!",
        message: "Ajakan kolaborasi berhasil dikirim ke ruang diskusi.",
      });
      // Trigger refresh in Chat Panel by re-mounting or state change
      window.location.reload();
    } catch (err) {
      addToast({
        type: "error",
        title: "Gagal Mengirim",
        message:
          err.response?.data?.detail || "Gagal mengirimkan pesan ajakan.",
      });
    } finally {
      setSendingPreChat(false);
    }
  };

  if (loadingProjects && !activeProject) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4 font-sans">
        <div className="h-6 w-40 bg-slate-200 rounded-md animate-pulse" />
        <div className="h-96 bg-surface rounded-2xl border border-border animate-pulse" />
      </div>
    );
  }

  // UMKM has no projects yet
  if (isUmkm && !loadingProjects && myProjects.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5 font-sans">
        <div className="p-8 bg-surface rounded-2xl border border-border shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-dark-900">
            Anda Belum Memiliki Proyek Aktif
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Untuk memulai diskusi dan kolaborasi resmi dengan talenta kampus
            yang dilindungi escrow, silakan pasang kebutuhan proyek Anda
            terlebih dahulu.
          </p>
          <Link to="/projects/new">
            <Button variant="brand" size="sm" className="font-bold text-xs">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Pasang Proyek Baru
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4 font-sans">
      {/* Top Header: Back button & Context Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-xl border border-border bg-surface hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-dark-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-indigo" />
              <span>Ruang Diskusi & Chat Kolaborasi</span>
            </h1>
            <p className="text-xs text-slate-500">
              Komunikasi resmi real-time terlindungi sistem escrow Makarya
            </p>
          </div>
        </div>

        {/* Project Selector (Dropdown for UMKM) */}
        {isUmkm && myProjects.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium shrink-0">
              Proyek:
            </span>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => handleSwitchProject(e.target.value)}
                className="text-xs font-semibold bg-surface border border-border rounded-xl px-3 py-1.5 pr-8 text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo cursor-pointer appearance-none max-w-[240px] truncate"
              >
                {myProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.judul} ({formatStatus(p.status)})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Pre-Chat Banner / Quick Proposal Invitation for Selected Talent */}
      {talentPartner && (
        <div className="p-4 bg-brand-indigo-light/30 border border-brand-indigo/20 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              {talentPartner.url_foto ? (
                <img
                  src={talentPartner.url_foto}
                  alt={talentPartner.nama_lengkap}
                  className="w-8 h-8 rounded-xl object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-brand-indigo text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                  {(talentPartner.nama_lengkap || "M").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-dark-900 block leading-tight">
                  Mengajak Kolaborasi: {talentPartner.nama_lengkap}
                </span>
                <span className="text-[11px] text-slate-500">
                  {talentPartner.prodi || "Mahasiswa"} •{" "}
                  {talentPartner.universitas || "Kampus Terverifikasi"}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-brand-indigo font-semibold bg-brand-indigo-light px-2.5 py-0.5 rounded-full border border-brand-indigo/15 self-start sm:self-auto">
              Konteks: {activeProject?.judul || "Pilih Proyek"}
            </span>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border text-xs text-slate-700 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="italic text-slate-600">"{preChatMessage}"</p>
            <Button
              variant="brand"
              size="sm"
              loading={sendingPreChat}
              onClick={handleSendPreChat}
              className="shrink-0 text-xs font-bold py-1.5 px-3"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Kirim Ajakan Ini Langsung
            </Button>
          </div>
        </div>
      )}

      {/* Main Realtime Chat Panel */}
      {selectedProjectId ? (
        <WorkroomChatPanel
          projectId={selectedProjectId}
          projectTitle={activeProject?.judul || "Diskusi Proyek"}
          partnerName={
            talentPartner?.nama_lengkap ||
            activeProject?.accepted_mhs_nama ||
            "Mitra Kolaborasi"
          }
          partnerRole={isUmkm ? "MHS" : "UMKM"}
          partnerPhoto={
            talentPartner?.url_foto || activeProject?.accepted_mhs_foto || null
          }
        />
      ) : (
        <div className="p-12 text-center bg-surface border border-border rounded-2xl text-xs text-slate-500">
          Silakan pilih proyek aktif Anda di atas untuk membuka percakapan chat.
        </div>
      )}
    </div>
  );
}
