import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { chatApi, getChatWsUrl } from "../../api";
import {
  Send,
  Link2,
  ExternalLink,
  ShieldCheck,
  Check,
  CheckCheck,
  MessageSquare,
  Briefcase,
  AlertCircle,
} from "lucide-react";

export function WorkroomChatPanel({
  projectId,
  projectTitle = "Diskusi Proyek",
  partnerName = "Mitra Kolaborasi",
  partnerRole = "USER",
}) {
  const { user, accessToken } = useAuthStore();
  const { addToast } = useToastStore();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

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
      const res = await chatApi.getMessages(projectId);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn("Gagal memuat pesan:", err);
    } finally {
      setLoading(false);
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
  }, [projectId]);

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
    <div className="flex flex-col h-[560px] bg-surface rounded-2xl border border-border overflow-hidden shadow-xs font-sans">
      {/* 1. Chat Header Bar */}
      <div className="px-5 py-3.5 border-b border-border bg-canvas/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-xs shrink-0 border border-brand-indigo/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-dark-900 leading-tight">
                {partnerName}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                {partnerRole === "UMKM" ? "Klien UMKM" : "Mahasiswa Terverifikasi"}
              </span>
            </div>
            <p className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  wsConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span className="text-[10px]">
                {wsConnected ? "Koneksi Realtime Aktif" : "Menghubungkan..."}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Audit Escrow Makarya</span>
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
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo mb-2.5 shadow-xs">
              <Briefcase className="w-5 h-5" />
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
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                    isMe
                      ? "bg-brand-indigo text-white rounded-br-xs"
                      : "bg-surface border border-border text-dark-900 rounded-bl-xs"
                  }`}
                >
                  {!isMe && (
                    <span className="block text-[10px] font-bold text-brand-indigo mb-1">
                      {m.sender_name || partnerName}
                    </span>
                  )}

                  {m.message && (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.message}
                    </p>
                  )}

                  {/* Attachment Link Card */}
                  {m.attachment_url && (
                    <a
                      href={m.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-2 flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                        isMe
                          ? "bg-white/15 border-white/25 text-white hover:bg-white/20"
                          : "bg-canvas border-border text-brand-indigo hover:bg-indigo-50/50"
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
                  )}

                  {/* Timestamp & Read Receipt */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      isMe ? "text-white/70" : "text-muted"
                    }`}
                  >
                    <span>{formatTime(m.created_at)}</span>
                    {isMe && (
                      <span>
                        {m.is_read ? (
                          <CheckCheck className="w-3 h-3 text-emerald-300" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Attachment Bar Toggle Panel */}
      {showAttachInput && (
        <div className="px-4 py-2.5 bg-indigo-50/70 border-t border-indigo-100 flex flex-col sm:flex-row items-center gap-2 animate-in slide-in-from-bottom-2">
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
