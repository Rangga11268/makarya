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
} from "lucide-react";

export function WorkroomChatPanel({
  projectId,
  projectTitle = "Diskusi Proyek",
  partnerId = null,
  partnerName = "Mitra Kolaborasi",
  partnerRole = "USER",
  partnerPhoto = null,
  onBack = null,
  headerExtra = null,
  projectContextBar = null,
  initialDraft = "",
  className = "",
  onOpenOfferModal = null,
}) {
  const { user, accessToken } = useAuthStore();
  const { addToast } = useToastStore();

  const isUmkm = user?.role?.toUpperCase() === "UMKM";

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(true);
  const [respondingOfferId, setRespondingOfferId] = useState(null);

  // Quick Attachment State
  const [showAttachInput, setShowAttachInput] = useState(false);
  const [attachUrl, setAttachUrl] = useState("");
  const [attachType, setAttachType] = useState("FIGMA"); // 'FIGMA' | 'LINK'

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Muat riwayat chat lama via REST
  const loadHistory = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await chatApi.getMessages(projectId, partnerId);
      const list = Array.isArray(res.data) ? res.data : [];
      setMessages(list);
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
        };

        socket.onmessage = (event) => {
          try {
            const incomingMsg = JSON.parse(event.data);
            if (incomingMsg && incomingMsg.id) {
              // Jika sedang dalam percakapan dengan partner tertentu, abaikan pesan orang ketiga
              if (
                partnerId &&
                String(incomingMsg.sender_id) !== String(user?.id) &&
                String(incomingMsg.sender_id) !== String(partnerId)
              ) {
                return;
              }

              setMessages((prev) => {
                const existsIdx = prev.findIndex(
                  (m) => m.id === incomingMsg.id,
                );
                if (existsIdx !== -1) {
                  const updated = [...prev];
                  updated[existsIdx] = incomingMsg;
                  return updated;
                }
                return [...prev, incomingMsg];
              });
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
  }, [projectId, accessToken]);

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

  return (
    <div
      className={`flex flex-col bg-surface rounded-2xl border border-border overflow-hidden shadow-xs font-sans ${
        className || "h-[500px] sm:h-[560px]"
      }`}
    >
      {/* 1. Chat Header Bar */}
      <div className="px-3.5 sm:px-5 py-3 border-b border-border bg-canvas/60 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-dark-900 leading-tight truncate max-w-[160px] sm:max-w-xs">
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
                  wsConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span
                className={`text-[10px] truncate ${
                  wsConnected
                    ? "text-emerald-600 font-medium"
                    : "text-rose-500 font-medium"
                }`}
              >
                {wsConnected ? "Online" : "Offline"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerExtra}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Escrow Makarya</span>
          </div>
        </div>
      </div>

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
              Mulai Diskusi Pengerjaan Proyek
            </h5>
            <p className="text-[11px] text-muted max-w-sm mt-1 leading-relaxed">
              Bahas rincian brief, tanyakan klarifikasi teknis, atau bagikan
              tautan Figma. Seluruh percakapan terlindungi dalam audit garansi
              Escrow Makarya.
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
                  ((
                    partnerId ? partnerPhoto : m.sender_photo || partnerPhoto
                  ) ? (
                    <img
                      src={
                        partnerId
                          ? partnerPhoto
                          : m.sender_photo || partnerPhoto
                      }
                      alt={
                        partnerId ? partnerName : m.sender_name || partnerName
                      }
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-border mt-0.5 shadow-xs"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 select-none">
                      {(partnerId
                        ? partnerName
                        : m.sender_name || partnerName || "P"
                      )
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
                  {!isMe && (
                    <span className="block text-[10px] font-bold text-brand-indigo mb-1">
                      {partnerId ? partnerName : m.sender_name || partnerName}
                    </span>
                  )}

                  {/* Text Message (Deduplicate if PROJECT_OFFER) */}
                  {m.message && m.attachment_type !== "PROJECT_OFFER" && (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.message}
                    </p>
                  )}

                  {/* Project Offer Interactive Card (Apple-style / anti-slop) */}
                  {m.attachment_type === "PROJECT_OFFER" ? (
                    (() => {
                      let offer = {};
                      try {
                        offer = JSON.parse(m.attachment_url || "{}");
                      } catch (_) {
                        offer = {
                          projectTitle:
                            m.message || "Tawaran Proyek Kolaborasi",
                        };
                      }
                      const offerStatus = (
                        offer.status || "PENDING"
                      ).toUpperCase();
                      const isResponding = respondingOfferId === m.id;

                      return (
                        <div
                          className={`mt-2 p-3 rounded-2xl border transition-all ${
                            isMe
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-white border-slate-200 text-slate-900 shadow-sm"
                          }`}
                        >
                          {/* Header badge & budget */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                isMe
                                  ? "bg-white/20 text-white border-white/30"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              <span>TAWARAN PROYEK RESMI</span>
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                isMe
                                  ? "text-emerald-300"
                                  : "text-emerald-700 font-semibold"
                              }`}
                            >
                              {offer.budget
                                ? `Rp ${Number(offer.budget).toLocaleString("id-ID")}`
                                : "Sesuai Kesepakatan"}
                            </span>
                          </div>

                          {/* Project Title */}
                          <h5
                            className={`text-xs sm:text-sm font-bold leading-snug mb-1.5 ${
                              isMe ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {offer.projectTitle || "Proyek Kolaborasi"}
                          </h5>

                          {/* Meta Row with Micro-Pills */}
                          <div
                            className={`flex items-center justify-between gap-2 text-[10px] pt-2 border-t mb-2.5 ${
                              isMe ? "border-white/15" : "border-slate-100"
                            }`}
                          >
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                                isMe
                                  ? "bg-white/20 text-white"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              100% Escrow
                            </span>
                            {offer.deadline && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                  isMe
                                    ? "bg-white/10 text-white/80"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                Tenggat: {offer.deadline}
                              </span>
                            )}
                          </div>

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
                                  className="flex-1 py-1.5 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
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
                                  className="py-1.5 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[11px] text-amber-200/90 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/20">
                                <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
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
                              <span>
                                ✓ Tawaran Diterima • Kolaborasi Dimulai
                              </span>
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
                              <span>✕ Tawaran Ditolak</span>
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

      {/* 4. Bottom Input Bar */}
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
          placeholder="Tulis pesan atau tanggapan pengerjaan..."
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
    </div>
  );
}
