import React, { useState, useEffect, useMemo } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { chatApi, projectApi, talentApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { WorkroomChatPanel } from "../../components/features/WorkroomChatPanel";
import { ProjectBriefVectorIcon } from "../../components/icons/ProjectVectorIcon";
import { Button } from "../../components/ui/Button";
import {
  PlusCircle,
  ChevronDown,
  Search,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Users,
  Building2,
  Clock,
  Sparkles,
  X,
  ShieldCheck,
} from "lucide-react";

export function ChatPage() {
  const { projectId: routeProjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const isUmkm = user?.role?.toUpperCase() === "UMKM";
  const talentId = searchParams.get("talent");
  const urlPartnerId = searchParams.get("partner");

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // 'ALL', 'PROJECT', 'TEAM'

  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [talentPartner, setTalentPartner] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Selected conversation state
  const [selectedConv, setSelectedConv] = useState(null);
  const [mobileViewChat, setMobileViewChat] = useState(
    Boolean(routeProjectId || talentId || urlPartnerId),
  );

  // 1. Fetch conversations list from backend
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await chatApi.getConversations();
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setConversations(list);
      return list;
    } catch (err) {
      console.warn("Gagal memuat daftar percakapan:", err);
      return [];
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 2. Fetch UMKM active projects for project context picker (Hanya yang OPEN/BIDDING)
  useEffect(() => {
    if (!isUmkm) return;
    (async () => {
      try {
        setLoadingProjects(true);
        const res = await projectApi.getMyProjects();
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        // Proyek yang sudah selesai (DONE/SELESAI/CLOSED/CANCELLED) TIDAK BISA ditawarkan lagi
        const activeList = list.filter(
          (p) => p.status === "OPEN" || p.status === "BIDDING",
        );
        setMyProjects(activeList);
      } catch (err) {
        console.error("Gagal memuat proyek UMKM:", err);
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, [isUmkm]);

  // 3. Fetch talent profile if ?talent= present
  useEffect(() => {
    if (!talentId) return;
    (async () => {
      try {
        const res = await talentApi.getTalentDetail(talentId);
        const data = res?.data || res;
        setTalentPartner(data);

        // Atur selectedConv otomatis untuk talenta yang diajak kolaborasi
        if (data) {
          const matchingConv = conversations.find(
            (c) => String(c.partner_id) === String(data.user_id || data.id),
          );
          if (matchingConv) {
            setSelectedConv(matchingConv);
          } else {
            // Virtual item untuk penawaran baru
            setSelectedConv({
              id: `virtual_${data.id}`,
              partner_id: data.user_id || data.id,
              partner_name: data.nama_lengkap,
              partner_role: "MHS",
              partner_photo: data.url_foto || null,
              partner_sub: data.prodi || "Mahasiswa Talenta",
              project_id: routeProjectId || (myProjects[0]?.id ?? null),
              project_title:
                myProjects.find((p) => p.id === routeProjectId)?.judul ||
                myProjects[0]?.judul ||
                "Proyek Baru",
              project_status: "OPEN",
              last_message: null,
              last_message_time: null,
              unread_count: 0,
            });
          }
          setMobileViewChat(true);
        }
      } catch (err) {
        console.error("Gagal memuat profil talenta:", err);
      }
    })();
  }, [talentId, conversations, myProjects, routeProjectId]);

  // 4. Sinkronisasi URL jika routeProjectId berubah dan belum ada talentId
  useEffect(() => {
    if (talentId) return;
    if (conversations.length > 0 && !selectedConv) {
      if (routeProjectId) {
        const target = conversations.find(
          (c) =>
            String(c.project_id) === String(routeProjectId) &&
            (!urlPartnerId || String(c.partner_id) === String(urlPartnerId)),
        );
        if (target) {
          setSelectedConv(target);
          setMobileViewChat(true);
        } else {
          // Buat conversation context dari routeProjectId
          setSelectedConv({
            id: `proj_${routeProjectId}`,
            partner_id: urlPartnerId || null,
            partner_name: "Mitra Kolaborasi",
            partner_role: isUmkm ? "MHS" : "UMKM",
            partner_photo: null,
            project_id: routeProjectId,
            project_title: "Diskusi Proyek",
            last_message: null,
            last_message_time: null,
            unread_count: 0,
          });
          setMobileViewChat(true);
        }
      } else if (window.innerWidth >= 768) {
        // Desktop default: pilih percakapan pertama
        setSelectedConv(conversations[0]);
      }
    }
  }, [
    routeProjectId,
    urlPartnerId,
    conversations,
    selectedConv,
    isUmkm,
    talentId,
  ]);

  // Handler memilih percakapan dari inbox list
  const handleSelectConversation = (conv) => {
    setSelectedConv(conv);
    setMobileViewChat(true);
    const searchPart = conv.partner_id ? `?partner=${conv.partner_id}` : "";
    if (conv.project_id) {
      navigate(`/chat/${conv.project_id}${searchPart}`, { replace: true });
    } else {
      navigate(`/chat${searchPart}`, { replace: true });
    }
  };

  // Switch project saat mengobrol dengan talenta (Khusus UMKM)
  const handleSwitchProject = (newProjId) => {
    const proj = myProjects.find((p) => p.id === newProjId);
    if (!proj) return;
    setSelectedConv((prev) => ({
      ...prev,
      project_id: proj.id,
      project_title: proj.judul,
      project_status: proj.status,
    }));
    const pId = selectedConv?.partner_id || talentId || urlPartnerId;
    const searchPart = pId ? `?partner=${pId}` : "";
    navigate(`/chat/${proj.id}${searchPart}`, { replace: true });
  };

  // Kirim tawaran proyek resmi interaktif ke chat (Khusus UMKM)
  const handleSendProjectOffer = async (proj) => {
    try {
      const targetPartnerId =
        selectedConv?.partner_id || talentId || urlPartnerId;
      const offerData = {
        projectId: proj.id,
        projectTitle: proj.judul,
        budget: proj.budget_max,
        deadline: proj.deadline,
        kategori: proj.kategori,
        status: "PENDING",
      };
      const payload = {
        message: `Tawaran Proyek Resmi: ${proj.judul}`,
        attachment_url: JSON.stringify(offerData),
        attachment_type: "PROJECT_OFFER",
        recipient_id: targetPartnerId,
      };

      await chatApi.sendMessage(proj.id, payload);
      addToast(
        "Tawaran proyek resmi berhasil diajukan kepada talenta!",
        "success",
      );
      setShowOfferModal(false);

      setSelectedConv((prev) => ({
        ...prev,
        project_id: proj.id,
        project_title: proj.judul,
        project_status: proj.status,
      }));

      const searchPart = targetPartnerId ? `?partner=${targetPartnerId}` : "";
      navigate(`/chat/${proj.id}${searchPart}`, { replace: true });
      loadConversations();
    } catch (err) {
      console.error("Gagal mengirim tawaran:", err);
      addToast(
        err?.response?.data?.detail || "Gagal mengajukan tawaran proyek",
        "danger",
      );
    }
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchSearch =
        !searchQuery.trim() ||
        c.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.project_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.last_message?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (activeTab === "PROJECT") {
        return Boolean(c.project_id);
      }
      if (activeTab === "TEAM") {
        return c.partner_role === "MHS";
      }
      return true;
    });
  }, [conversations, searchQuery, activeTab]);

  const activeProject = myProjects.find(
    (p) => p.id === selectedConv?.project_id,
  );

  // Pre-chat pitch message syncs with selected project and talent
  const preChatMessage = `Halo ${selectedConv?.partner_name || "Rekan Mahasiswa"}, kami tertarik mengajak Anda berkolaborasi untuk proyek "${activeProject?.judul || selectedConv?.project_title || "proyek kami"}". Apakah Anda bersedia mendiskusikan brief dan ketersediaan waktu untuk pengerjaan proyek ini?`;

  const formatRelativeTime = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins}m lalu`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}j lalu`;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans flex text-slate-900">
      {/* ========================================================================= */}
      {/* 1. LEFT PANE: DEDICATED INBOX & CONVERSATION LIST */}
      {/* ========================================================================= */}
      <div
        className={`w-full md:w-80 lg:w-96 h-full flex flex-col bg-white border-r border-slate-200 shrink-0 z-10 transition-all duration-200 ${
          mobileViewChat ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header Inbox */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 truncate">
                Pesan & Kolaborasi
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                Ruang Obrolan Escrow Terproteksi
              </p>
            </div>
          </div>

          <button
            onClick={() => loadConversations()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Muat Ulang Pesan"
          >
            <Clock className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama mitra atau judul proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-indigo focus:border-brand-indigo text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Segment Filter */}
          <div className="flex items-center gap-1 mt-2.5">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center ${
                activeTab === "ALL"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab("PROJECT")}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center ${
                activeTab === "PROJECT"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              Proyek
            </button>
            <button
              onClick={() => setActiveTab("TEAM")}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center ${
                activeTab === "TEAM"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {isUmkm ? "Talenta" : "Kolega MHS"}
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loadingConversations ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Memuat daftar obrolan...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Belum ada percakapan
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                {isUmkm
                  ? "Mulai ajak mahasiswa berkolaborasi dari halaman Direktori Talenta."
                  : "Lamar proyek yang tersedia untuk membuka ruang diskusi kerja."}
              </p>
              {isUmkm ? (
                <Link to="/talents">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs mt-2"
                  >
                    Eksplorasi Mahasiswa
                  </Button>
                </Link>
              ) : (
                <Link to="/projects">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs mt-2"
                  >
                    Jelajah Proyek
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected =
                selectedConv &&
                String(selectedConv.partner_id) === String(conv.partner_id) &&
                String(selectedConv.project_id) === String(conv.project_id);

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                    isSelected
                      ? "bg-brand-indigo/5 border-l-4 border-brand-indigo pl-2.5"
                      : ""
                  }`}
                >
                  {/* Partner Avatar with status dot */}
                  <div className="relative shrink-0 mt-0.5">
                    {conv.partner_photo ? (
                      <img
                        src={conv.partner_photo}
                        alt={conv.partner_name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${
                          conv.partner_role === "UMKM"
                            ? "bg-amber-100 text-amber-900 border-amber-200"
                            : "bg-brand-indigo text-white border-brand-indigo"
                        }`}
                      >
                        {(conv.partner_name || "M").charAt(0).toUpperCase()}
                      </div>
                    )}
                    {conv.is_online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-400/20" />
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {conv.partner_name}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatRelativeTime(conv.last_message_time)}
                      </span>
                    </div>

                    {/* Project context badge */}
                    {conv.project_title && (
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 truncate">
                        <ProjectBriefVectorIcon size={11} color="#2563EB" />
                        <span className="truncate max-w-[180px]">
                          {conv.project_title}
                        </span>
                      </div>
                    )}

                    {/* Last message snippet & unread counter */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-[11px] text-slate-500 truncate">
                        {conv.last_message || "Mulai percakapan..."}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-brand-indigo text-[9px] font-bold text-white shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT PANE: ACTIVE CHAT PANEL (OR EMPTY STATE ON DESKTOP) */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 h-full flex flex-col bg-white overflow-hidden ${
          !mobileViewChat ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedConv ? (
          <WorkroomChatPanel
            key={`${selectedConv.project_id || "none"}-${selectedConv.partner_id || "direct"}`}
            projectId={selectedConv.project_id}
            projectTitle={selectedConv.project_title || "Ruang Kolaborasi"}
            partnerId={selectedConv.partner_id}
            partnerName={selectedConv.partner_name || "Mitra Kolaborasi"}
            partnerRole={selectedConv.partner_role || (isUmkm ? "MHS" : "UMKM")}
            partnerPhoto={selectedConv.partner_photo || null}
            onBack={() => setMobileViewChat(false)}
            className="h-full w-full rounded-none border-0 shadow-none"
            initialDraft=""
            onOpenOfferModal={() => setShowOfferModal(true)}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50/60">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-brand-indigo mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Pilih Percakapan untuk Memulai Diskusi
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              Pilih salah satu mitra kolaborasi di daftar sebelah kiri untuk
              membuka ruang obrolan kerja terproteksi garansi Escrow Makarya.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. APPLE-STYLE PROJECT OFFER MODAL (Khusus UMKM Menawarkan Proyek) */}
      {/* ========================================================================= */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-blue-50 text-brand-indigo border border-blue-100">
                    <ProjectBriefVectorIcon size={16} color="#2563EB" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tawarkan Proyek Kolaborasi
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pilih proyek Anda untuk ditawarkan kepada{" "}
                  <span className="font-semibold text-slate-700">
                    {selectedConv?.partner_name || "Mahasiswa"}
                  </span>
                  . Talenta dapat langsung menerima atau menolak tawaran di
                  ruang chat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Project Cards */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {loadingProjects ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Memuat daftar proyek terbuka...
                </div>
              ) : myProjects.length === 0 ? (
                <div className="py-8 text-center px-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <ProjectBriefVectorIcon size={20} color="#94A3B8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Tidak Ada Proyek Terbuka
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    Semua proyek Anda saat ini sudah selesai atau sedang
                    berjalan. Buat proyek baru untuk menawarkan pekerjaan ke
                    talenta ini.
                  </p>
                  <Link to="/projects/new">
                    <Button
                      variant="brand"
                      size="sm"
                      className="mt-4 text-xs font-bold"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" />
                      Pasang Proyek Baru
                    </Button>
                  </Link>
                </div>
              ) : (
                myProjects.map((proj) => {
                  const isCurrent = proj.id === selectedConv?.project_id;
                  return (
                    <div
                      key={proj.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                        isCurrent
                          ? "bg-brand-indigo/5 border-brand-indigo ring-1 ring-brand-indigo/30"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                              {proj.kategori || "UMKM"}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {proj.status || "OPEN"}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {proj.judul}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {proj.deskripsi || "Tanpa rincian tambahan"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            Anggaran Proyek:
                          </span>
                          <span className="font-bold text-emerald-600">
                            {proj.budget_max
                              ? `Rp ${Number(proj.budget_max).toLocaleString("id-ID")}`
                              : "Sesuai Kesepakatan"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendProjectOffer(proj)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-indigo text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <span>Tawarkan Proyek Ini</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Proteksi Escrow 100% Aktif</span>
              </div>
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
