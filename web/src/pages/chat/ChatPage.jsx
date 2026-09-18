import React, { useState, useEffect, useMemo } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { chatApi, projectApi, talentApi, getUserChatWsUrl } from "../../api";
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
  Trash2,
  MoreVertical,
} from "lucide-react";

export function ChatPage() {
  const { projectId: routeProjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
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

  // Realtime update handler for messages across sidebar & chat
  const handleConversationMessageUpdate = (incomingMsg) => {
    if (!incomingMsg) return;
    setConversations((prev) => {
      const pId = String(incomingMsg.project_id || "");
      const sId = String(incomingMsg.sender_id || "");
      const rId = String(incomingMsg.recipient_id || "");
      const myId = String(user?.id || "");
      const isGroupMsg = !incomingMsg.recipient_id;

      const idx = prev.findIndex((c) => {
        const cProj = String(c.project_id || "");
        if (cProj !== pId) return false;
        if (isGroupMsg) {
          return c.is_group === true;
        }
        const cPart = String(c.partner_id || "");
        return cPart === sId || cPart === rId;
      });

      const isCurrentSelected =
        selectedConv &&
        String(selectedConv.project_id || "") === pId &&
        (isGroupMsg
          ? selectedConv.is_group === true
          : String(selectedConv.partner_id || "") === sId ||
            String(selectedConv.partner_id || "") === rId);

      const isFromOther = sId !== myId;

      if (idx !== -1) {
        const existing = prev[idx];
        const newUnread = isCurrentSelected
          ? 0
          : isFromOther
            ? (existing.unread_count || 0) + 1
            : existing.unread_count || 0;

        const updated = {
          ...existing,
          last_message: incomingMsg.message,
          last_message_time: incomingMsg.created_at || new Date().toISOString(),
          unread_count: newUnread,
        };

        const copy = [...prev];
        copy.splice(idx, 1);
        return [updated, ...copy];
      } else {
        loadConversations();
        return prev;
      }
    });
  };

  const handlePartnerPresenceChange = (partnerId, isOnline) => {
    if (!partnerId) return;
    setConversations((prev) =>
      prev.map((c) =>
        String(c.partner_id) === String(partnerId)
          ? { ...c, is_online: isOnline }
          : c,
      ),
    );
    setSelectedConv((prev) =>
      prev && String(prev.partner_id) === String(partnerId)
        ? { ...prev, is_online: isOnline }
        : prev,
    );
  };

  // Global user WebSocket for real-time sidebar & inbox push updates
  useEffect(() => {
    const token =
      accessToken ||
      localStorage.getItem("makarya_token") ||
      localStorage.getItem("token");
    if (!token || !user?.id) return;

    let ws = null;
    let pingInterval = null;
    let reconnectTimer = null;
    let isUnmounted = false;

    const connectWs = () => {
      if (isUnmounted) return;
      try {
        const url = getUserChatWsUrl(token);
        ws = new WebSocket(url);

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (!data) return;

            if (data.type === "CHAT_MESSAGE") {
              handleConversationMessageUpdate(data);
            } else if (data.type === "READ_RECEIPT") {
              if (String(data.reader_id) === String(user?.id)) {
                setConversations((prev) =>
                  prev.map((c) =>
                    String(c.project_id) === String(data.project_id) &&
                    (!data.partner_id ||
                      String(c.partner_id) === String(data.partner_id))
                      ? { ...c, unread_count: 0 }
                      : c,
                  ),
                );
              }
            }
          } catch (e) {
            console.warn("Global chat WS message parse error:", e);
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            reconnectTimer = setTimeout(connectWs, 3500);
          }
        };

        ws.onerror = () => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };
      } catch (err) {
        if (!isUnmounted) {
          reconnectTimer = setTimeout(connectWs, 3500);
        }
      }
    };

    connectWs();

    pingInterval = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "PING" }));
      }
    }, 25000);

    return () => {
      isUnmounted = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (pingInterval) clearInterval(pingInterval);
      if (ws) ws.close();
    };
  }, [accessToken, user?.id, selectedConv]);

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

        if (data) {
          const matchingConv = conversations.find(
            (c) =>
              !c.is_group &&
              String(c.partner_id) === String(data.user_id || data.id),
          );
          if (matchingConv) {
            setSelectedConv(matchingConv);
          } else {
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
              is_group: false,
              member_count: 1,
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
        // Cari grup proyek atau 1-on-1 yang sesuai
        const target = conversations.find((c) => {
          if (String(c.project_id) !== String(routeProjectId)) return false;
          if (urlPartnerId) {
            return String(c.partner_id) === String(urlPartnerId);
          }
          return c.is_group === true;
        });

        if (target) {
          setSelectedConv(target);
          setMobileViewChat(true);
        } else {
          // Buat conversation context dari routeProjectId
          setSelectedConv({
            id: `proj_${routeProjectId}`,
            partner_id: urlPartnerId || null,
            partner_name: urlPartnerId ? "Mitra Kolaborasi" : "Grup Proyek",
            partner_role: urlPartnerId ? (isUmkm ? "MHS" : "UMKM") : "GROUP",
            partner_photo: null,
            project_id: routeProjectId,
            project_title: "Diskusi Proyek",
            last_message: null,
            last_message_time: null,
            unread_count: 0,
            is_group: !urlPartnerId,
            member_count: 2,
          });
          setMobileViewChat(true);
        }
      } else if (window.innerWidth >= 768) {
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
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread_count: 0 } : c)),
    );
    const searchPart = conv.partner_id ? `?partner=${conv.partner_id}` : "";
    if (conv.project_id) {
      navigate(`/chat/${conv.project_id}${searchPart}`, { replace: true });
    } else {
      navigate(`/chat${searchPart}`, { replace: true });
    }
  };

  // Navigasi ke chat personal dengan anggota tim dari roster
  const handleSelectPartnerFromRoster = (targetPartnerId) => {
    if (!targetPartnerId) return;
    const existing = conversations.find(
      (c) =>
        !c.is_group &&
        String(c.partner_id) === String(targetPartnerId) &&
        String(c.project_id) === String(selectedConv?.project_id),
    );
    if (existing) {
      handleSelectConversation(existing);
    } else {
      const memObj = selectedConv?.members?.find(
        (m) => String(m.user_id) === String(targetPartnerId),
      );
      const newDirect = {
        id: `${targetPartnerId}_${selectedConv?.project_id}`,
        partner_id: targetPartnerId,
        partner_name: memObj?.nama_lengkap || "Rekan Tim",
        partner_role: memObj?.is_owner ? "UMKM" : "MHS",
        partner_photo: memObj?.url_foto || null,
        partner_sub: memObj?.role_label || "Rekan Kolaborasi",
        project_id: selectedConv?.project_id,
        project_title: selectedConv?.project_title,
        project_status: selectedConv?.project_status,
        last_message: null,
        last_message_time: null,
        unread_count: 0,
        is_online: Boolean(memObj?.is_online),
        is_group: false,
        member_count: 1,
      };
      setSelectedConv(newDirect);
      navigate(`/chat/${selectedConv?.project_id}?partner=${targetPartnerId}`, {
        replace: true,
      });
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

      if (activeTab === "GROUP") {
        return c.is_group === true;
      }
      if (activeTab === "DIRECT") {
        return c.is_group !== true;
      }
      return true;
    });
  }, [conversations, searchQuery, activeTab]);

  const activeProject = myProjects.find(
    (p) => p.id === selectedConv?.project_id,
  );

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

  const handleDeleteConversation = async (conv, e) => {
    if (e) e.stopPropagation();
    const isGroup = conv.is_group;
    const confirmMsg = isGroup
      ? "Apakah Anda yakin ingin membersihkan/menghapus riwayat obrolan grup proyek ini?"
      : `Apakah Anda yakin ingin menghapus percakapan dengan ${conv.partner_name || "mitra ini"}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      if (isGroup) {
        await chatApi.deleteGroupRoom(conv.project_id);
      } else {
        await chatApi.deleteConversation(conv.project_id, conv.partner_id);
      }
      setConversations((prev) => prev.filter((c) => c.id !== conv.id));
      if (
        selectedConv &&
        ((isGroup &&
          selectedConv.is_group &&
          String(selectedConv.project_id) === String(conv.project_id)) ||
          (!isGroup &&
            !selectedConv.is_group &&
            String(selectedConv.partner_id) === String(conv.partner_id)))
      ) {
        setSelectedConv(null);
        setMobileViewChat(false);
        navigate("/chat", { replace: true });
      }
      addToast(
        isGroup
          ? "Obrolan grup berhasil dihapus"
          : "Percakapan berhasil dihapus",
        "info",
      );
    } catch (err) {
      addToast(
        err?.response?.data?.detail || "Gagal menghapus percakapan",
        "danger",
      );
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
              placeholder="Cari grup proyek atau mitra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-indigo focus:border-brand-indigo text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Segment Filter (Semua, Grup Proyek, Pesan Pribadi) */}
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
              onClick={() => setActiveTab("GROUP")}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center flex items-center justify-center gap-1 ${
                activeTab === "GROUP"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Grup</span>
            </button>
            <button
              onClick={() => setActiveTab("DIRECT")}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-center ${
                activeTab === "DIRECT"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              Pribadi
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
                  ? "Mulai ajak mahasiswa berkolaborasi dari Direktori Talenta atau kelola grup proyek Anda."
                  : "Lamar proyek yang tersedia untuk membuka ruang diskusi kerja."}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected =
                selectedConv &&
                ((conv.is_group &&
                  selectedConv.is_group &&
                  String(selectedConv.project_id) ===
                    String(conv.project_id)) ||
                  (!conv.is_group &&
                    String(selectedConv.partner_id) ===
                      String(conv.partner_id) &&
                    String(selectedConv.project_id) ===
                      String(conv.project_id)));

              const canDelete = !conv.is_group || isUmkm;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`group relative w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                    isSelected
                      ? "bg-brand-indigo/5 border-l-4 border-brand-indigo pl-2.5"
                      : ""
                  }`}
                >
                  {/* Avatar (Group vs Direct) */}
                  <div className="relative shrink-0 mt-0.5">
                    {conv.is_group ? (
                      conv.members && conv.members.length > 0 ? (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center p-0.5 shadow-2xs">
                          <div className="flex items-center -space-x-1.5">
                            {conv.members.slice(0, 2).map((mem, idx) =>
                              mem.url_foto ? (
                                <img
                                  key={mem.user_id || idx}
                                  src={mem.url_foto}
                                  alt={mem.nama_lengkap}
                                  className="w-5 h-5 rounded-full object-cover border border-white"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div
                                  key={mem.user_id || idx}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border border-white ${
                                    mem.is_owner
                                      ? "bg-amber-100 text-amber-900"
                                      : "bg-brand-indigo text-white"
                                  }`}
                                >
                                  {(mem.nama_lengkap || "A")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              ),
                            )}
                            {conv.members.length > 2 && (
                              <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 border border-white flex items-center justify-center text-[7px] font-bold">
                                +{conv.members.length - 2}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-brand-indigo flex items-center justify-center shadow-2xs">
                          <Users className="w-5 h-5" />
                        </div>
                      )
                    ) : conv.partner_photo ? (
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
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        conv.is_online ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      title={conv.is_online ? "Aktif Online" : "Offline"}
                    />
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {conv.partner_name}
                        </span>
                        {!conv.is_group && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatRelativeTime(conv.last_message_time)}
                      </span>
                    </div>

                    {/* Sub Info / Project context */}
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 truncate">
                      <ProjectBriefVectorIcon size={11} color="#2563EB" />
                      <span className="truncate">
                        {conv.partner_sub || conv.project_title || "Kolaborasi"}
                      </span>
                    </div>

                    {/* Last message snippet, unread counter & delete button */}
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-[11px] text-slate-500 truncate flex-1">
                        {conv.last_message || "Mulai percakapan..."}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        {conv.unread_count > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-brand-indigo text-[9px] font-bold text-white">
                            {conv.unread_count}
                          </span>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteConversation(conv, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                            title={
                              conv.is_group
                                ? "Hapus/Bersihkan Obrolan Grup"
                                : "Hapus Percakapan"
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT PANE: ACTIVE CHAT PANEL */}
      {/* ========================================================================= */}
      <div
        className={`flex-1 h-full flex flex-col bg-white overflow-hidden ${
          !mobileViewChat ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedConv ? (
          <WorkroomChatPanel
            key={`${selectedConv.project_id || "none"}-${selectedConv.is_group ? "group" : selectedConv.partner_id || "direct"}`}
            projectId={selectedConv.project_id}
            projectTitle={selectedConv.project_title || "Ruang Kolaborasi"}
            partnerId={selectedConv.partner_id}
            partnerName={selectedConv.partner_name || "Mitra Kolaborasi"}
            partnerRole={selectedConv.partner_role || (isUmkm ? "MHS" : "UMKM")}
            partnerPhoto={selectedConv.partner_photo || null}
            initialPartnerOnline={Boolean(selectedConv.is_online)}
            isGroup={Boolean(selectedConv.is_group)}
            groupMembers={selectedConv.members || []}
            projectStatus={selectedConv.project_status || "OPEN"}
            onSelectPartner={handleSelectPartnerFromRoster}
            onBack={() => setMobileViewChat(false)}
            className="h-full w-full rounded-none border-0 shadow-none"
            initialDraft=""
            onOpenOfferModal={() => setShowOfferModal(true)}
            activeProject={activeProject}
            myProjects={myProjects}
            projectSlots={activeProject?.slots || []}
            onNewMessage={handleConversationMessageUpdate}
            onPartnerPresenceChange={handlePartnerPresenceChange}
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
              Pilih grup proyek atau mitra kolaborasi di daftar sebelah kiri
              untuk membuka ruang obrolan kerja terproteksi garansi Escrow
              Makarya.
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
                  const hasSlots = proj.slots && proj.slots.length > 0;
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
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                              {proj.kategori || "UMKM"}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {proj.status || "OPEN"}
                            </span>
                            {proj.tipe_kolaborasi === "TIM" && (
                              <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Proyek Tim
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {proj.judul}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {proj.deskripsi || "Tanpa rincian tambahan"}
                          </p>
                        </div>
                      </div>

                      {/* Team Slots Selection if Team Project */}
                      {hasSlots && (
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                          <span className="text-[11px] font-bold text-slate-700 block">
                            Pilih Posisi Tim yang Ditawarkan:
                          </span>
                          <div className="space-y-2">
                            {proj.slots.map((slot) => {
                              const isFilled =
                                slot.status !== "OPEN" ||
                                Boolean(slot.accepted_mhs_id);
                              return (
                                <div
                                  key={slot.id}
                                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs gap-3 transition-colors ${
                                    isFilled
                                      ? "bg-slate-100/80 border-slate-200"
                                      : "bg-white border-slate-200 hover:border-brand-indigo/40"
                                  }`}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span
                                        className={`font-bold text-xs truncate ${
                                          isFilled
                                            ? "text-slate-500 line-through"
                                            : "text-slate-900"
                                        }`}
                                      >
                                        {slot.nama_peran}
                                      </span>
                                      {isFilled ? (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-slate-200 text-slate-600">
                                          Terisi
                                          {slot.accepted_mhs_nama
                                            ? ` (${slot.accepted_mhs_nama})`
                                            : ""}
                                        </span>
                                      ) : (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                          Tersedia
                                        </span>
                                      )}
                                    </div>
                                    <span
                                      className={`text-[11px] font-bold block mt-0.5 ${
                                        isFilled
                                          ? "text-slate-400"
                                          : "text-emerald-600"
                                      }`}
                                    >
                                      {slot.alokasi_budget
                                        ? `Rp ${Number(slot.alokasi_budget).toLocaleString("id-ID")}`
                                        : "Sesuai Proyek"}
                                    </span>
                                  </div>

                                  {isFilled ? (
                                    <span className="px-3 py-1.5 rounded-full bg-slate-200 text-slate-500 font-semibold text-[11px] shrink-0 whitespace-nowrap">
                                      Sudah Terisi
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSendProjectOffer(proj, slot)
                                      }
                                      className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-brand-indigo text-white font-bold text-[11px] transition-colors cursor-pointer shrink-0 whitespace-nowrap shadow-xs"
                                    >
                                      Tawarkan Posisi
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

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

                        {!hasSlots && (
                          <button
                            type="button"
                            onClick={() => handleSendProjectOffer(proj)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-indigo text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Tawarkan Proyek Ini</span>
                          </button>
                        )}
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
