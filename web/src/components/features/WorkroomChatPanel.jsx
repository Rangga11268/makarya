import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { chatApi, getChatWsUrl } from "../../api";
import { ProjectBriefVectorIcon } from "../icons/ProjectVectorIcon";
import {
  Send,
  Link2,
  ExternalLink,
  ShieldCheck,
  Check,
  CheckCheck,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Clock,
  X,
  Users,
  Lock,
  ChevronUp,
  ChevronDown,
  Info,
  Crown,
  FileText,
  Copy,
} from "lucide-react";

export function WorkroomChatPanel({
  projectId,
  projectTitle = "Diskusi Proyek",
  partnerId = null,
  partnerName = "Mitra Kolaborasi",
  partnerRole = "USER",
  partnerPhoto = null,
  initialPartnerOnline = false,
  isGroup = false,
  groupMembers = [],
  projectStatus = "OPEN",
  onSelectPartner = null,
  onBack = null,
  headerExtra = null,
  projectContextBar = null,
  initialDraft = "",
  className = "",
  onOpenOfferModal = null,
  activeProject = null,
  myProjects = [],
  projectSlots = [],
  onNewMessage = null,
  onPartnerPresenceChange = null,
}) {
  const { user, accessToken } = useAuthStore();
  const { addToast } = useToastStore();

  const isUmkm = user?.role?.toUpperCase() === "UMKM";
  const isProjectDone = ["DONE", "SELESAI", "CLOSED", "CANCELLED"].includes(
    String(projectStatus || "").toUpperCase(),
  );

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(initialPartnerOnline);
  const [rosterMembers, setRosterMembers] = useState(groupMembers || []);
  const [showDraftPrompt, setShowDraftPrompt] = useState(true);
  const [respondingOfferId, setRespondingOfferId] = useState(null);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showBriefPinned, setShowBriefPinned] = useState(true);

  // Quick Attachment State
  const [showAttachInput, setShowAttachInput] = useState(false);
  const [attachUrl, setAttachUrl] = useState("");
  const [attachType, setAttachType] = useState("FIGMA"); // 'FIGMA' | 'LINK'

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setPartnerOnline(initialPartnerOnline);
  }, [initialPartnerOnline, partnerId]);

  useEffect(() => {
    if (groupMembers && groupMembers.length > 0) {
      setRosterMembers(groupMembers);
    }
  }, [groupMembers]);

  // Muat daftar anggota proyek resmi jika mode grup
  useEffect(() => {
    if (isGroup && projectId) {
      let isMounted = true;
      (async () => {
        try {
          const res = await chatApi.getProjectRoster(projectId);
          if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
            setRosterMembers(res.data);
          }
        } catch (err) {
          console.warn("Gagal memuat roster anggota:", err);
        }
      })();
      return () => {
        isMounted = false;
      };
    }
  }, [isGroup, projectId]);

  // 1. Muat riwayat chat lama via REST
  const loadHistory = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await chatApi.getMessages(projectId, partnerId);
      const list = Array.isArray(res.data) ? res.data : [];
      setMessages(list);

      // Jika ada pesan yang belum dibaca dari lawan bicara, kirim sinyal mark read
      if (
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN &&
        list.some((m) => !m.is_read && String(m.sender_id) !== String(user?.id))
      ) {
        wsRef.current.send(
          JSON.stringify({ type: "MARK_READ", partner_id: partnerId }),
        );
      }
    } catch (err) {
      console.warn("Gagal memuat pesan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondOffer = async (messageId, action) => {
    try {
      setRespondingOfferId(messageId);
      await chatApi.respondToOffer(messageId, action);
      addToast(
        action === "ACCEPT"
          ? "Tawaran proyek diterima! Kolaborasi resmi dimulai."
          : "Tawaran proyek ditolak.",
        action === "ACCEPT" ? "success" : "info",
      );
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId && m.attachment_url) {
            try {
              const meta = JSON.parse(m.attachment_url);
              meta.status = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
              return { ...m, attachment_url: JSON.stringify(meta) };
            } catch (_) {}
          }
          return m;
        }),
      );
      loadHistory();
    } catch (err) {
      console.warn("Gagal merespons tawaran:", err);
      addToast(
        err?.response?.data?.detail || "Gagal memproses respons tawaran",
        "danger",
      );
    } finally {
      setRespondingOfferId(null);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    loadHistory();

    let socket = null;
    const token =
      accessToken ||
      localStorage.getItem("makarya_token") ||
      localStorage.getItem("token");

    if (token) {
      try {
        const wsUrl = getChatWsUrl(projectId, token);
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          setWsConnected(true);
          // Kirim mark read saat socket aktif
          if (partnerId) {
            socket.send(
              JSON.stringify({ type: "MARK_READ", partner_id: partnerId }),
            );
          }
        };

        socket.onmessage = (event) => {
          try {
            const incoming = JSON.parse(event.data);
            if (!incoming) return;

            // A. Handle READ_RECEIPT (Lawan bicara baru membaca pesan kita)
            if (incoming.type === "READ_RECEIPT") {
              if (String(incoming.reader_id) !== String(user?.id)) {
                setMessages((prev) =>
                  prev.map((m) =>
                    String(m.sender_id) === String(user?.id)
                      ? { ...m, is_read: true }
                      : m,
                  ),
                );
              }
              return;
            }

            // B. Handle ROOM_PRESENCE / USER_PRESENCE (Status Online/Offline Lawan Bicara)
            if (
              incoming.type === "ROOM_PRESENCE" &&
              Array.isArray(incoming.online_users)
            ) {
              if (partnerId) {
                const isOnline = incoming.online_users.some(
                  (uid) => String(uid) === String(partnerId),
                );
                setPartnerOnline(isOnline);
                onPartnerPresenceChange?.(partnerId, isOnline);
              }
              return;
            }

            if (incoming.type === "USER_PRESENCE") {
              if (partnerId && String(incoming.user_id) === String(partnerId)) {
                const isOnline = incoming.status === "ONLINE";
                setPartnerOnline(isOnline);
                onPartnerPresenceChange?.(partnerId, isOnline);
              } else if (Array.isArray(incoming.online_users) && partnerId) {
                const isOnline = incoming.online_users.some(
                  (uid) => String(uid) === String(partnerId),
                );
                setPartnerOnline(isOnline);
                onPartnerPresenceChange?.(partnerId, isOnline);
              }
              return;
            }

            // C. Handle incoming Chat Message
            if (incoming.id) {
              // Jika sedang dalam percakapan dengan partner tertentu, abaikan pesan orang ketiga
              if (
                partnerId &&
                String(incoming.sender_id) !== String(user?.id) &&
                String(incoming.sender_id) !== String(partnerId)
              ) {
                onNewMessage?.(incoming);
                return;
              }

              // Jika pesan masuk dari lawan bicara saat kita sedang buka chat room ini, otomatis kirim mark read
              if (
                String(incoming.sender_id) !== String(user?.id) &&
                socket.readyState === WebSocket.OPEN
              ) {
                socket.send(
                  JSON.stringify({
                    type: "MARK_READ",
                    partner_id: incoming.sender_id,
                  }),
                );
              }

              setMessages((prev) => {
                const existsIdx = prev.findIndex((m) => m.id === incoming.id);
                if (existsIdx !== -1) {
                  const updated = [...prev];
                  updated[existsIdx] = incoming;
                  return updated;
                }
                return [...prev, incoming];
              });

              // Beritahu parent ChatPage agar sidebar terupdate realtime
              onNewMessage?.(incoming);
            }
          } catch (e) {
            console.warn("Gagal parse pesan WS:", e);
          }
        };

        socket.onerror = () => {
          setWsConnected(false);
        };

        socket.onclose = () => {
          setWsConnected(false);
        };

        wsRef.current = socket;
      } catch (err) {
        console.warn("Gagal inisialisasi WS:", err);
      }
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [projectId, partnerId, accessToken]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 2. Kirim pesan (WebSocket atau Fallback REST)
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText && !attachUrl.trim()) return;

    let customUrl = null;
    let customType = null;
    if (attachUrl.trim()) {
      const url = attachUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        addToast("Tautan berkas harus diawali dengan https://", "warning");
        return;
      }
      customUrl = url;
      customType = attachType;
    }

    const payload = {
      recipient_id: partnerId || null,
      message:
        cleanText || (customUrl ? "Lampiran tautan pengerjaan proyek" : ""),
      attachment_url: customUrl,
      attachment_type: customType,
    };

    setInputText("");
    setAttachUrl("");
    setShowAttachInput(false);

    // Kirim via WebSocket jika aktif
    if (
      wsRef.current &&
      wsConnected &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      try {
        wsRef.current.send(JSON.stringify(payload));
        return;
      } catch (err) {
        console.warn("Socket send gagal, beralih ke REST:", err);
      }
    }

    // Fallback REST API
    try {
      setSending(true);
      const res = await chatApi.sendMessage(projectId, payload);
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      addToast(
        err.response?.data?.detail || "Gagal mengirim pesan chat",
        "danger",
      );
    } finally {
      setSending(false);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return isNaN(d.getTime())
        ? ""
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const getCleanRoleName = (offer) => {
    // Cari daftar slots proyek dari offer.slots, activeProject, atau myProjects
    const matchedProject =
      activeProject?.id === offer.projectId
        ? activeProject
        : myProjects.find((p) => p.id === offer.projectId);

    const availableSlots =
      offer.slots && Array.isArray(offer.slots) && offer.slots.length > 0
        ? offer.slots
        : matchedProject?.slots &&
            Array.isArray(matchedProject.slots) &&
            matchedProject.slots.length > 0
          ? matchedProject.slots
          : projectSlots &&
              Array.isArray(projectSlots) &&
              projectSlots.length > 0
            ? projectSlots
            : [];

    // 1. Jika ada slots spesifik dari brief proyek:
    if (availableSlots.length > 0) {
      // Cocokkan by slotId jika ada
      if (offer.slotId) {
        const found = availableSlots.find(
          (s) => String(s.id) === String(offer.slotId),
        );
        if (found && found.nama_peran) return found.nama_peran;
      }
      // Cocokkan jika budget tawaran sesuai alokasi slot tertentu
      if (offer.budget) {
        const matchSlot = availableSlots.find(
          (s) => Number(s.alokasi_budget) === Number(offer.budget),
        );
        if (matchSlot && matchSlot.nama_peran) return matchSlot.nama_peran;
      }
    }

    let role = offer.posisi || offer.nama_peran;

    // 2. Jika nama role sudah spesifik (bukan placeholder kategori umum), gunakan langsung
    const genericList = [
      "PEMROGRAMAN",
      "DESAIN",
      "MARKETING",
      "PENULISAN",
      "MULTIMEDIA",
      "BISNIS",
      "DATA",
      "Programmer / Developer",
      "Desainer / UI/UX",
      "Anggota Tim",
      "Pelaksana Proyek",
      "Spesialis Proyek",
    ];

    const isGeneric =
      !role ||
      genericList.includes(role) ||
      (typeof role === "string" && role.startsWith("Spesialis "));

    // Jika generic tapi ada slots, gunakan daftar peran dari brief
    if (isGeneric && availableSlots.length > 0) {
      return availableSlots.map((s) => s.nama_peran).join(" & ");
    }

    const catMap = {
      PEMROGRAMAN: "Programmer / Developer",
      DESAIN: "Desainer / UI/UX",
      MARKETING: "Digital Marketer",
      PENULISAN: "Content Writer",
      MULTIMEDIA: "Multimedia & Video",
      BISNIS: "Konsultan Bisnis",
      DATA: "Data Analyst",
    };

    if (role && typeof role === "string" && role.startsWith("Spesialis ")) {
      const clean = role.replace(/^Spesialis\s+/i, "");
      role = catMap[clean.toUpperCase()] || clean;
    }

    if (!role && offer.kategori) {
      role = catMap[String(offer.kategori).toUpperCase()] || offer.kategori;
    }

    return (
      role ||
      (offer.tipe_kolaborasi === "TIM" ? "Anggota Tim" : "Pelaksana Proyek")
    );
  };

  return (
    <div
      className={`flex flex-col bg-surface rounded-2xl border border-border overflow-hidden shadow-xs font-sans ${
        className || "h-[500px] sm:h-[560px]"
      }`}
    >
      {/* 1. Chat Header Bar */}
      <div className="px-3.5 sm:px-5 py-3 border-b border-border bg-canvas/60 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg border border-border bg-surface hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0 -ml-1 sm:ml-0"
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {isGroup ? (
            /* GROUP CHAT AVATAR STACK & HEADER */
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div
                onClick={() => setShowRosterModal(true)}
                className="flex items-center -space-x-2 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                title="Klik untuk melihat detail seluruh anggota tim"
              >
                {rosterMembers && rosterMembers.length > 0 ? (
                  rosterMembers.slice(0, 3).map((mem, i) => (
                    <div key={mem.user_id || i} className="relative">
                      {mem.url_foto ? (
                        <img
                          src={mem.url_foto}
                          alt={mem.nama_lengkap}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white shadow-2xs"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs border-2 border-white shadow-2xs ${
                            mem.is_owner
                              ? "bg-amber-100 text-amber-900"
                              : "bg-brand-indigo text-white"
                          }`}
                        >
                          {(mem.nama_lengkap || "A").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white ${
                          mem.is_online ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-xs shadow-2xs border-2 border-white">
                    <Users className="w-4 h-4" />
                  </div>
                )}
                {rosterMembers && rosterMembers.length > 3 && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-700 border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                    +{rosterMembers.length - 3}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4
                  className="text-xs sm:text-sm font-bold text-dark-900 leading-tight truncate"
                  title={projectTitle || "Ruang Obrolan Grup Proyek"}
                >
                  {projectTitle || "Ruang Obrolan Grup Proyek"}
                </h4>

                <button
                  type="button"
                  onClick={() => setShowRosterModal(true)}
                  className="text-[10px] sm:text-[11px] text-slate-500 hover:text-brand-indigo transition-colors flex items-center gap-1 mt-0.5 cursor-pointer font-medium truncate max-w-full text-left"
                >
                  <Users className="w-3 h-3 text-brand-indigo shrink-0" />
                  <span className="truncate">
                    {rosterMembers?.length || 2} Anggota Tim (Lihat Roster)
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* 1-ON-1 DIRECT CHAT HEADER */
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {partnerPhoto ? (
                <img
                  src={partnerPhoto}
                  alt={partnerName}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shrink-0 border border-border shadow-xs"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border shadow-xs ${
                    partnerRole === "UMKM"
                      ? "bg-amber-100 text-amber-900 border-amber-200"
                      : "bg-brand-indigo text-white border-brand-indigo"
                  }`}
                >
                  {(partnerName || "M").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-dark-900 leading-tight truncate">
                    {partnerName}
                  </h4>
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                    title={
                      partnerRole === "UMKM"
                        ? "Klien Terverifikasi"
                        : "Mahasiswa Terverifikasi"
                    }
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      partnerOnline ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={`text-[10px] truncate font-medium ${
                      partnerOnline
                        ? "text-emerald-600 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {partnerOnline ? "Online" : "Offline"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {headerExtra && (
          <div className="flex items-center gap-2 shrink-0">{headerExtra}</div>
        )}
      </div>

      {/* Pinned Project Brief Announcement Card */}
      {showBriefPinned && (
        <div className="px-4 py-2 bg-slate-50/90 border-b border-slate-200 text-xs flex items-center justify-between gap-3 text-slate-700">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-lg bg-indigo-50 text-brand-indigo shrink-0">
              <ProjectBriefVectorIcon size={14} color="#2563EB" />
            </div>
            <span className="font-semibold truncate text-[11px]">
              {isGroup ? "Brief Kerja Grup:" : "Konteks Kerja:"}{" "}
              <span className="text-slate-900 font-bold">
                {activeProject?.judul || projectTitle}
              </span>
            </span>
            {activeProject?.deadline && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                <Clock className="w-3 h-3" />
                Tenggat: {activeProject.deadline}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isGroup && (
              <button
                type="button"
                onClick={() => setShowRosterModal(true)}
                className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-brand-indigo font-bold text-[10px] border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Users className="w-3 h-3" />
                <span>Roster ({groupMembers?.length || 0})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowBriefPinned(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              title="Tutup banner brief"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Chat Scrollable Thread */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-canvas/30">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-muted text-xs gap-2">
            <div className="w-6 h-6 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
            <span>Memuat pesan ruang diskusi...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-indigo mb-2.5 shadow-xs">
              <ProjectBriefVectorIcon size={22} color="#2563EB" />
            </div>
            <h5 className="text-xs sm:text-sm font-bold text-dark-900">
              {isGroup
                ? "Ruang Obrolan Tim Proyek Siap"
                : "Mulai Diskusi Pengerjaan Proyek"}
            </h5>
            <p className="text-[11px] text-muted max-w-sm mt-1 leading-relaxed">
              {isGroup
                ? "Bahas pembagian tugas, koordinasi brief, dan progres milestone bersama seluruh anggota tim dan klien."
                : "Bahas rincian brief, tanyakan klarifikasi teknis, atau bagikan tautan Figma. Seluruh percakapan terlindungi dalam audit garansi Escrow Makarya."}
            </p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMe = String(m.sender_id) === String(user?.id);

            return (
              <div
                key={m.id || idx}
                className={`flex items-start gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe &&
                  (m.sender_photo || partnerPhoto ? (
                    <img
                      src={m.sender_photo || partnerPhoto}
                      alt={m.sender_name || partnerName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-border mt-0.5 shadow-xs"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 select-none ${
                        m.sender_role === "UMKM"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-brand-indigo text-white"
                      }`}
                    >
                      {(m.sender_name || partnerName || "P")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  ))}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                    isMe
                      ? "bg-brand-indigo text-white rounded-br-xs"
                      : "bg-surface border border-border text-dark-900 rounded-bl-xs"
                  }`}
                >
                  {/* SENDER NAME & ROLE LABEL BADGE */}
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="font-bold text-[11px] text-slate-900">
                        {m.sender_name || partnerName}
                      </span>
                      {m.sender_role_label && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                            m.sender_role_label === "Project Owner" ||
                            m.sender_role === "UMKM"
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : m.sender_role_label.includes("Desain") ||
                                  m.sender_role_label.includes("UI")
                                ? "bg-purple-50 text-purple-800 border-purple-200"
                                : m.sender_role_label.includes("Programmer") ||
                                    m.sender_role_label.includes("Dev")
                                  ? "bg-sky-50 text-sky-800 border-sky-200"
                                  : "bg-indigo-50 text-brand-indigo border-indigo-100"
                          }`}
                        >
                          {m.sender_role_label === "Project Owner"
                            ? "Pemilik Proyek"
                            : m.sender_role_label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Text Message (Deduplicate if PROJECT_OFFER) */}
                  {m.message && m.attachment_type !== "PROJECT_OFFER" && (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.message}
                    </p>
                  )}

                  {/* Project Offer Interactive Card (Apple-style / Clean & Modern) */}
                  {m.attachment_type === "PROJECT_OFFER" ? (
                    (() => {
                      let offer = {};
                      try {
                        offer = JSON.parse(m.attachment_url || "{}");
                      } catch {
                        offer = {};
                      }
                      const offerStatus = (
                        offer.status || "PENDING"
                      ).toUpperCase();
                      const isResponding = respondingOfferId === m.id;

                      return (
                        <div
                          className={`mt-1 p-4 rounded-2xl border transition-all ${
                            isMe
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-white border-slate-200 text-slate-900 shadow-xs"
                          }`}
                        >
                          {/* Header badge & escrow guarantee */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                isMe
                                  ? "bg-white/20 text-white"
                                  : "bg-indigo-50 text-brand-indigo"
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>TAWARAN PROYEK</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold flex items-center gap-1 ${
                                isMe ? "text-emerald-200" : "text-emerald-700"
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              100% Escrow
                            </span>
                          </div>

                          {/* Project Title */}
                          <h5
                            className={`text-sm font-bold leading-snug mb-2.5 ${
                              isMe ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {offer.projectTitle || "Proyek Kolaborasi"}
                          </h5>

                          {/* Position / Role Highlight Pill */}
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl mb-2.5 text-xs font-semibold ${
                              isMe
                                ? "bg-white/15 text-white"
                                : "bg-indigo-50/90 text-brand-indigo border border-indigo-100"
                            }`}
                          >
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            <span className="leading-snug break-words">
                              {getCleanRoleName(offer)}
                              {offer.tipe_kolaborasi === "TIM" && (
                                <span className="opacity-80 font-medium ml-1.5 text-[10px]">
                                  (Proyek Tim)
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Clean Details Box */}
                          <div
                            className={`flex items-center justify-between p-2.5 rounded-xl mb-2.5 text-xs ${
                              isMe
                                ? "bg-white/10 text-white"
                                : "bg-slate-50 border border-slate-100 text-slate-800"
                            }`}
                          >
                            <div>
                              <span
                                className={`block text-[10px] ${
                                  isMe ? "text-white/70" : "text-slate-500"
                                }`}
                              >
                                {offer.posisi
                                  ? "Alokasi Posisi"
                                  : "Nilai Proyek"}
                              </span>
                              <span className="font-bold text-sm">
                                {offer.budget
                                  ? `Rp ${Number(offer.budget).toLocaleString("id-ID")}`
                                  : "Sesuai Diskusi"}
                              </span>
                            </div>

                            {offer.deadline && (
                              <div className="text-right">
                                <span
                                  className={`block text-[10px] ${
                                    isMe ? "text-white/70" : "text-slate-500"
                                  }`}
                                >
                                  Tenggat
                                </span>
                                <span className="font-semibold flex items-center gap-1 justify-end text-xs">
                                  <Clock className="w-3 h-3 opacity-70" />
                                  {offer.deadline}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Formasi Peran Tim List (If Team Project) */}
                          {(() => {
                            const matchedProject =
                              activeProject?.id === offer.projectId
                                ? activeProject
                                : myProjects.find(
                                    (p) => p.id === offer.projectId,
                                  );

                            const effectiveSlots =
                              offer.slots &&
                              Array.isArray(offer.slots) &&
                              offer.slots.length > 0
                                ? offer.slots
                                : matchedProject?.slots &&
                                    Array.isArray(matchedProject.slots) &&
                                    matchedProject.slots.length > 0
                                  ? matchedProject.slots
                                  : projectSlots &&
                                      Array.isArray(projectSlots) &&
                                      projectSlots.length > 0
                                    ? projectSlots
                                    : [];

                            if (!effectiveSlots || effectiveSlots.length === 0)
                              return null;

                            return (
                              <div
                                className={`p-2.5 rounded-xl mb-3 border text-left ${
                                  isMe
                                    ? "bg-white/10 border-white/15"
                                    : "bg-slate-50 border-slate-200"
                                }`}
                              >
                                <span
                                  className={`text-[10px] font-bold block mb-1.5 uppercase ${
                                    isMe ? "text-white/80" : "text-slate-500"
                                  }`}
                                >
                                  Formasi Peran Tim ({effectiveSlots.length}{" "}
                                  Posisi):
                                </span>
                                <div className="space-y-1">
                                  {effectiveSlots.map((s, idx) => {
                                    const isThisSlot =
                                      (offer.slotId &&
                                        String(s.id) ===
                                          String(offer.slotId)) ||
                                      s.nama_peran === offer.posisi ||
                                      (offer.budget &&
                                        Number(s.alokasi_budget) ===
                                          Number(offer.budget));
                                    return (
                                      <div
                                        key={s.id || idx}
                                        className={`flex items-center justify-between p-1.5 rounded-lg text-[11px] ${
                                          isThisSlot
                                            ? isMe
                                              ? "bg-white/20 text-white font-bold border border-white/30"
                                              : "bg-indigo-50 text-brand-indigo font-bold border border-indigo-200"
                                            : isMe
                                              ? "text-white/70"
                                              : "text-slate-600 bg-white border border-slate-100"
                                        }`}
                                      >
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <span className="truncate">
                                            {s.nama_peran}
                                          </span>
                                          {isThisSlot && (
                                            <span
                                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                                isMe
                                                  ? "bg-white/20 text-white"
                                                  : "bg-brand-indigo text-white"
                                              }`}
                                            >
                                              Ditawarkan
                                            </span>
                                          )}
                                        </div>
                                        <span className="shrink-0 text-[10px] font-semibold ml-2">
                                          {s.alokasi_budget
                                            ? `Rp ${Number(s.alokasi_budget).toLocaleString("id-ID")}`
                                            : "Sesuai Proyek"}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Actions for Student / Status for UMKM */}
                          {offerStatus === "PENDING" ? (
                            !isMe ? (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRespondOffer(m.id, "ACCEPT")
                                  }
                                  disabled={isResponding}
                                  className="flex-1 py-2 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {isResponding ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Terima Tawaran</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRespondOffer(m.id, "REJECT")
                                  }
                                  disabled={isResponding}
                                  className="py-2 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[11px] text-white/80 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/20">
                                <Clock className="w-3.5 h-3.5 text-white/80 shrink-0" />
                                <span>Menunggu tanggapan dari talenta...</span>
                              </div>
                            )
                          ) : offerStatus === "ACCEPTED" ? (
                            <div
                              className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border ${
                                isMe
                                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Tawaran Diterima (Kolaborasi Dimulai)</span>
                            </div>
                          ) : (
                            <div
                              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border ${
                                isMe
                                  ? "bg-white/10 text-white/70 border-white/20"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              <X className="w-3.5 h-3.5 opacity-70 shrink-0" />
                              <span>Tawaran Ditolak</span>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : m.attachment_url ? (
                    <a
                      href={m.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-2 flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                        isMe
                          ? "bg-white/15 border-white/25 text-white hover:bg-white/20"
                          : "bg-canvas border-border text-brand-indigo hover:bg-slate-100"
                      }`}
                    >
                      <div className="p-1 rounded-lg bg-white/20">
                        <Link2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <span className="block text-[9px] font-bold opacity-80 uppercase">
                          {m.attachment_type === "FIGMA"
                            ? "Tautan Figma"
                            : "Tautan Berkas"}
                        </span>
                        <span className="block text-xs font-mono truncate">
                          {m.attachment_url}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    </a>
                  ) : null}

                  {/* Timestamp & WhatsApp Read Receipt */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      isMe ? "text-white/70" : "text-muted"
                    }`}
                  >
                    <span>{formatTime(m.created_at)}</span>
                    {isMe && (
                      <span
                        className="inline-flex items-center ml-0.5"
                        title={
                          m.is_read
                            ? "Dibaca (Centang 2 Biru)"
                            : m.id
                              ? "Tersampaikan (Centang 2)"
                              : "Terkirim (Centang 1)"
                        }
                      >
                        {m.is_read ? (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                        ) : m.id ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-white/70" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {isMe &&
                  (user?.url_foto ? (
                    <img
                      src={user.url_foto}
                      alt="Me"
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-border mt-0.5 shadow-xs"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 select-none">
                      {(
                        user?.nama_lengkap ||
                        user?.nama_usaha ||
                        user?.email ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  ))}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Attachment Bar Toggle Panel */}
      {showAttachInput && (
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setAttachType("FIGMA")}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                attachType === "FIGMA"
                  ? "bg-brand-indigo text-white border-brand-indigo"
                  : "bg-surface text-muted border-border"
              }`}
            >
              Figma
            </button>
            <button
              type="button"
              onClick={() => setAttachType("LINK")}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                attachType === "LINK"
                  ? "bg-brand-indigo text-white border-brand-indigo"
                  : "bg-surface text-muted border-border"
              }`}
            >
              Google Drive / Web
            </button>
          </div>
          <input
            type="text"
            placeholder="Masukkan tautan berkas (https://...)"
            value={attachUrl}
            onChange={(e) => setAttachUrl(e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-xl border border-border bg-surface text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
          />
        </div>
      )}

      {/* Anti-Bypass Escrow Guard Warning */}
      {(() => {
        if (!inputText || inputText.trim().length < 5) return null;
        const text = inputText.trim();
        let warn = null;
        if (/(?:\+?62|08)[0-9\s.-]{8,14}/.test(text)) {
          warn = {
            title: "Nomor Kontak / WhatsApp Terdeteksi",
            desc: "Demi keamanan Anda, hindari bertukar kontak pribadi di luar ruang kerja. Komunikasi di luar sistem membatalkan garansi proteksi Escrow 100% jika terjadi wanprestasi.",
          };
        } else if (
          /\b(rekening|rek|transfer|bca|mandiri|bri|bni|cimb|bsi|dana|ovo|gopay|seabank|jago)\b[^\n\r]*?\d{4,}/i.test(
            text,
          ) ||
          /\b(transfer langsung|bayar langsung|tanpa aplikasi|luar aplikasi|direct transfer|tf langsung)\b/i.test(
            text,
          )
        ) {
          warn = {
            title: "Indikasi Pembayaran Luar Sistem",
            desc: "Peringatan: Seluruh pembayaran wajib diproses melalui Escrow Makarya. Pembayaran di luar sistem rentan penipuan dan tidak dilindungi garansi saldo.",
          };
        }
        if (!warn) return null;
        return (
          <div className="mx-3 my-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-amber-950 flex items-center gap-1.5">
                <span>{warn.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium border border-amber-300/60">
                  Proteksi Escrow
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-900/90">
                {warn.desc}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Context Bar (Pilihan proyek langsung di daerah chat box) */}
      {projectContextBar && (
        <div className="px-3 sm:px-4 py-2 bg-canvas/90 border-t border-border flex items-center justify-between gap-2 shrink-0">
          {projectContextBar}
        </div>
      )}

      {/* 4. Bottom Action Area (Read-Only Archived Workroom OR Active Input Bar) */}
      {isProjectDone ? (
        <div className="p-4 border-t border-slate-200 bg-slate-50/95 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
                <span>Ruang Kolaborasi Selesai & Diarsipkan</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Escrow Tuntas
                </span>
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Pengerjaan proyek ini telah selesai secara resmi. Seluruh
                riwayat obrolan dan berkas kerja diarsipkan permanen untuk
                portofolio digital.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-3.5 border-t border-border bg-surface flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => setShowAttachInput(!showAttachInput)}
            className={`p-2 rounded-xl border transition-colors ${
              showAttachInput
                ? "bg-brand-indigo text-white border-brand-indigo"
                : "bg-canvas text-muted border-border hover:text-dark-900"
            }`}
            title="Sisipkan tautan berkas Figma / Drive"
          >
            <Link2 className="w-4 h-4" />
          </button>

          {isUmkm && onOpenOfferModal && (
            <button
              type="button"
              onClick={onOpenOfferModal}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              title="Tawarkan Proyek Resmi kepada Talenta"
            >
              <ProjectBriefVectorIcon size={14} color="#0F172A" />
              <span className="hidden sm:inline">Tawarkan Proyek</span>
            </button>
          )}

          <input
            type="text"
            placeholder="Tulis pesan atau koordinasi tugas..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-canvas border border-border text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
          />

          <button
            type="submit"
            disabled={(!inputText.trim() && !attachUrl.trim()) || sending}
            className="px-3.5 py-2 rounded-xl bg-brand-indigo text-white font-bold text-xs flex items-center gap-1.5 shadow-brand disabled:opacity-40 hover:bg-brand-indigo-dark transition-colors shrink-0"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* 5. Team Roster Modal (Grup Anggota Tim Popover) */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-brand-indigo/10 text-brand-indigo">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Anggota Grup Proyek
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {rosterMembers?.length || 0} personil terdaftar resmi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-slate-100">
              {rosterMembers && rosterMembers.length > 0 ? (
                rosterMembers.map((mem) => {
                  const isCurrent = String(mem.user_id) === String(user?.id);
                  return (
                    <div
                      key={mem.user_id}
                      className="pt-2.5 first:pt-0 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          {mem.url_foto ? (
                            <img
                              src={mem.url_foto}
                              alt={mem.nama_lengkap}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                                mem.is_owner
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-brand-indigo text-white"
                              }`}
                            >
                              {(mem.nama_lengkap || "A")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                              mem.is_online ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {mem.nama_lengkap}
                              {isCurrent && " (Anda)"}
                            </span>
                            {mem.is_owner && (
                              <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate font-medium">
                            {mem.role_label ||
                              (mem.is_owner ? "Project Owner" : "Pelaksana")}
                          </span>
                        </div>
                      </div>

                      {!isCurrent && onSelectPartner && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowRosterModal(false);
                            onSelectPartner(mem.user_id);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-brand-indigo hover:text-white text-slate-700 font-bold text-[11px] transition-colors cursor-pointer shrink-0"
                        >
                          Chat Pribadi
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">
                  Belum ada anggota tim tambahan yang terdaftar.
                </p>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Proteksi Escrow Aktif
              </span>
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
