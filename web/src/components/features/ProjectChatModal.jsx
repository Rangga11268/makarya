import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { chatApi, getChatWsUrl } from "../../api";
import {
  X,
  Send,
  Link2,
  ExternalLink,
  ShieldCheck,
  Check,
  CheckCheck,
  MessageSquare,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";

export function ProjectChatModal({
  isOpen,
  onClose,
  projectId,
  projectTitle = "Ruang Kolaborasi Proyek",
  partnerName = "Mitra Proyek",
  partnerRole = "USER",
}) {
  const { user } = useAuthStore();
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
    if (!isOpen || !projectId) return;

    loadHistory();

    let socket = null;
    const token =
      useAuthStore.getState().accessToken ||
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
  }, [isOpen, projectId]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl border border-border shadow-2xl z-10 flex flex-col h-[85vh] max-h-[720px] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* 1. Modal Header */}
        <div className="px-6 py-4 border-b border-border bg-canvas/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-sm shrink-0 border border-brand-indigo/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-dark-900 leading-tight">
                  {partnerName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                  {partnerRole === "UMKM" ? "Klien UMKM" : "Mahasiswa Terverifikasi"}
                </span>
              </div>
              <p className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    wsConnected
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-400"
                  }`}
                />
                <span className="truncate max-w-xs">{projectTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escrow Terlindungi</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-muted hover:text-dark-900 hover:bg-canvas transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-canvas/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted text-xs gap-2">
              <div className="w-6 h-6 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span>Menghubungkan ke ruang diskusi...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo mb-3 shadow-xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-dark-900">
                Ruang Kolaborasi Resmi Proyek
              </h4>
              <p className="text-xs text-muted max-w-sm mt-1 leading-relaxed">
                Seluruh percakapan dan pertukaran tautan di sini tersimpan aman
                sebagai bagian dari audit perlindungan garansi Escrow Makarya.
              </p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMe = m.sender_id === user?.id;

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
                          <span className="block text-[10px] font-bold opacity-80 uppercase">
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
                      <span>
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
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
          <div className="px-6 py-3 bg-indigo-50/60 border-t border-indigo-100 flex flex-col sm:flex-row items-center gap-2 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAttachType("FIGMA")}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
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
                className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                  attachType === "LINK"
                    ? "bg-brand-indigo text-white border-brand-indigo"
                    : "bg-surface text-muted border-border"
                }`}
              >
                Drive / Web
              </button>
            </div>
            <input
              type="text"
              placeholder="Masukkan URL tautan berkas (https://...)"
              value={attachUrl}
              onChange={(e) => setAttachUrl(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-xl border border-border bg-surface text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
            />
          </div>
        )}

        {/* 4. Bottom Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-border bg-surface flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => setShowAttachInput(!showAttachInput)}
            className={`p-2.5 rounded-2xl border transition-colors ${
              showAttachInput
                ? "bg-brand-indigo text-white border-brand-indigo"
                : "bg-canvas text-muted border-border hover:text-dark-900"
            }`}
            title="Kirim tautan berkas"
          >
            <Link2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Tulis pesan atau diskusikan kebutuhan proyek..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-canvas border border-border text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo font-sans"
          />

          <button
            type="submit"
            disabled={(!inputText.trim() && !attachUrl.trim()) || sending}
            className="px-4 py-2.5 rounded-2xl bg-brand-indigo text-white font-bold text-xs flex items-center gap-1.5 shadow-brand disabled:opacity-40 hover:bg-brand-indigo-dark transition-colors shrink-0"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
