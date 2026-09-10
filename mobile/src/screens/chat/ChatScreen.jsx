import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Linking,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { chatApi, getChatWsUrl } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { ChatSkeleton } from "../../components/ui/Skeleton";
import {
  ArrowLeft,
  Send,
  Link2,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  CheckCheck,
  ExternalLink,
  Plus,
  Paperclip,
  Briefcase,
  X,
  Radio,
  AlertTriangle,
} from "lucide-react-native";

export function ChatScreen({ route, navigation }) {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const projectId = route.params?.projectId || route.params?.id;
  const projectTitle = route.params?.projectTitle || "Ruang Kolaborasi Proyek";
  const partnerName = route.params?.partnerName || "Mitra Kolaborasi";
  const partnerRole = route.params?.partnerRole || "User";
  const partnerPhoto =
    route.params?.partnerPhoto ||
    route.params?.photoUrl ||
    route.params?.url_foto;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  // Derive verified partner name dynamically if partnerName is generic or literal 'string'
  const partnerMsg = messages.find(
    (m) =>
      m.sender_id !== user?.id &&
      m.sender_name &&
      m.sender_name.toLowerCase() !== "string",
  );
  const isGenericPartner =
    !partnerName ||
    partnerName.toLowerCase() === "string" ||
    partnerName === "Mitra Kolaborasi" ||
    partnerName === "Klien UMKM" ||
    partnerName === "Client";
  const resolvedPartnerName = isGenericPartner
    ? partnerMsg?.sender_name || partnerName || "Mitra Kolaborasi"
    : partnerName;

  const isUnassignedTalent =
    (resolvedPartnerName === "Mahasiswa Talenta" ||
      resolvedPartnerName === "Mitra Kolaborasi") &&
    messages.length === 0;

  const resolvedPartnerPhoto =
    partnerPhoto ||
    messages.find((m) => m.sender_id !== user?.id && m.sender_photo)
      ?.sender_photo ||
    null;

  const userPhoto =
    user?.url_foto || user?.url_foto_usaha || user?.photoUrl || null;

  // Attachment Modal
  const [attachModal, setAttachModal] = useState(false);
  const [attachUrl, setAttachUrl] = useState("");
  const [attachType, setAttachType] = useState("LINK"); // 'LINK', 'FIGMA', 'IMAGE'

  const wsRef = useRef(null);
  const flatListRef = useRef(null);

  // 1. Muat riwayat chat lama via REST
  const loadHistory = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await chatApi.getMessages(projectId);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn("Gagal memuat riwayat pesan:", err);
      showToast("Gagal memuat riwayat chat", "danger");
    } finally {
      setLoading(false);
    }
  };

  // 2. Hubungkan ke WebSocket Realtime
  useEffect(() => {
    loadHistory();

    let isMounted = true;
    let socket = null;

    const setupWebSocket = async () => {
      try {
        const token =
          (await AsyncStorage.getItem("makarya_access_token")) ||
          useAuthStore.getState().token;
        if (!token || !projectId) return;

        const wsUrl = getChatWsUrl(projectId, token);
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          if (isMounted) {
            setWsConnected(true);
          }
        };

        socket.onmessage = (event) => {
          try {
            const incomingMsg = JSON.parse(event.data);
            if (incomingMsg && incomingMsg.id) {
              setMessages((prev) => {
                // Hindari duplikasi jika pesan sudah ada
                const exists = prev.some((m) => m.id === incomingMsg.id);
                if (exists) return prev;
                return [...prev, incomingMsg];
              });
              // Scroll ke bawah
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          } catch (e) {
            console.warn("Gagal parse pesan WS:", e);
          }
        };

        socket.onerror = (e) => {
          console.warn("WebSocket error:", e.message);
          if (isMounted) setWsConnected(false);
        };

        socket.onclose = () => {
          if (isMounted) setWsConnected(false);
        };

        wsRef.current = socket;
      } catch (err) {
        console.warn("Gagal setup WS:", err);
      }
    };

    setupWebSocket();

    return () => {
      isMounted = false;
      if (socket) {
        socket.close();
      }
    };
  }, [projectId]);

  // 3. Kirim pesan (WebSocket langsung atau fallback REST)
  const handleSendMessage = async (customAttachment = null) => {
    if (isUnassignedTalent) {
      showToast(
        "Pilih dan setujui pelamar terlebih dahulu untuk memulai obrolan",
        "warning",
      );
      return;
    }

    const textToSend = inputText.trim();
    if (!textToSend && !customAttachment) return;

    const payload = {
      message: textToSend || (customAttachment ? "Lampiran tautan berkas" : ""),
      attachment_url: customAttachment?.url || null,
      attachment_type: customAttachment?.type || null,
    };

    setInputText("");

    // Jika WebSocket aktif, kirim via socket
    if (
      wsRef.current &&
      wsConnected &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      try {
        wsRef.current.send(JSON.stringify(payload));
        return;
      } catch (e) {
        console.warn("Gagal kirim lewat socket, fallback ke REST:", e);
      }
    }

    // Fallback REST API
    try {
      setSending(true);
      const res = await chatApi.sendMessage(projectId, payload);
      setMessages((prev) => [...prev, res.data]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal mengirim pesan", "danger");
    } finally {
      setSending(false);
    }
  };

  const handleSendAttachment = () => {
    if (!attachUrl.trim()) {
      showToast("URL lampiran wajib diisi", "danger");
      return;
    }
    const clean = attachUrl.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      showToast("Tautan harus diawali https://", "danger");
      return;
    }

    handleSendMessage({
      url: clean,
      type: attachType,
    });

    setAttachUrl("");
    setAttachModal(false);
    showToast("Tautan lampiran berhasil dikirim!", "success");
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.sender_id === user?.id;

    return (
      <View
        style={[
          styles.bubbleRow,
          isMe ? styles.bubbleRowMe : styles.bubbleRowPartner,
        ]}
      >
        {!isMe &&
          (item.sender_photo || resolvedPartnerPhoto ? (
            <Image
              source={{ uri: item.sender_photo || resolvedPartnerPhoto }}
              style={styles.chatAvatarSmall}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.chatAvatarPlaceholder}>
              <Text style={styles.chatAvatarPlaceholderText}>
                {(item.sender_name || resolvedPartnerName || "P")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
          ))}

        <View
          style={[
            styles.bubbleBox,
            isMe ? styles.bubbleBoxMe : styles.bubbleBoxPartner,
          ]}
        >
          {/* Sender Header if Partner */}
          {!isMe && (
            <View style={styles.senderHeader}>
              <Text style={styles.senderNameText} numberOfLines={1}>
                {item.sender_name && item.sender_name.toLowerCase() !== "string"
                  ? item.sender_name
                  : resolvedPartnerName}
              </Text>
              <View style={styles.roleTagMini}>
                <Text style={styles.roleTagMiniText}>
                  {item.sender_role === "UMKM" ? "Klien UMKM" : "Mahasiswa"}
                </Text>
              </View>
            </View>
          )}

          {/* Text Message */}
          {item.message ? (
            <Text
              style={[
                styles.messageText,
                isMe ? styles.messageTextMe : styles.messageTextPartner,
              ]}
            >
              {item.message}
            </Text>
          ) : null}

          {/* Attachment Preview Card */}
          {item.attachment_url ? (
            <TouchableOpacity
              style={[
                styles.attachmentCard,
                isMe ? styles.attachmentCardMe : styles.attachmentCardPartner,
              ]}
              onPress={() => Linking.openURL(item.attachment_url)}
              activeOpacity={0.8}
            >
              <View style={styles.attachmentIconWrap}>
                <Link2
                  size={16}
                  color={isMe ? "#FFFFFF" : COLORS.brandIndigo}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.attachmentTypeLabel,
                    isMe
                      ? { color: "rgba(255,255,255,0.8)" }
                      : { color: COLORS.brandIndigo },
                  ]}
                >
                  {item.attachment_type === "FIGMA"
                    ? "Tautan Desain Figma"
                    : "Tautan Berkas Deliverable"}
                </Text>
                <Text
                  style={[
                    styles.attachmentUrlText,
                    isMe ? { color: "#FFFFFF" } : { color: COLORS.textDark },
                  ]}
                  numberOfLines={1}
                >
                  {item.attachment_url}
                </Text>
              </View>
              <ExternalLink
                size={14}
                color={isMe ? "#FFFFFF" : COLORS.textMuted}
              />
            </TouchableOpacity>
          ) : null}

          {/* Bubble Footer: Time & Checkmark */}
          <View style={styles.bubbleFooter}>
            <Text
              style={[
                styles.timeText,
                isMe ? styles.timeTextMe : styles.timeTextPartner,
              ]}
            >
              {formatTime(item.created_at)}
            </Text>
            {isMe && (
              <View style={styles.readStatusWrap}>
                {item.is_read ? (
                  <CheckCheck size={13} color="#A7F3D0" />
                ) : (
                  <Check size={13} color="rgba(255,255,255,0.7)" />
                )}
              </View>
            )}
          </View>
        </View>

        {isMe &&
          (userPhoto ? (
            <Image
              source={{ uri: userPhoto }}
              style={styles.chatAvatarSmall}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.chatAvatarPlaceholder,
                styles.chatAvatarPlaceholderMe,
              ]}
            >
              <Text
                style={[styles.chatAvatarPlaceholderText, { color: "#FFFFFF" }]}
              >
                {(user?.nama_lengkap || user?.nama_usaha || user?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
          ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.textDark} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {resolvedPartnerPhoto ? (
              <Image
                source={{ uri: resolvedPartnerPhoto }}
                style={styles.headerPartnerAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.headerPartnerAvatarPlaceholder}>
                <Text style={styles.headerPartnerAvatarText}>
                  {resolvedPartnerName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.headerName} numberOfLines={1}>
                {resolvedPartnerName}
              </Text>
              <View style={styles.headerSubRow}>
                <Text style={styles.headerProjectTitle} numberOfLines={1}>
                  {projectTitle}
                </Text>
                <View
                  style={[
                    styles.onlineDot,
                    wsConnected
                      ? styles.onlineDotActive
                      : styles.onlineDotInactive,
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.escrowChip}>
          <ShieldCheck size={12} color={COLORS.brandCyan} />
          <Text style={styles.escrowChipText}>Escrow Aktif</Text>
        </View>
      </View>

      {/* 2. Messages List */}
      {loading ? (
        <ChatSkeleton />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          ListEmptyComponent={
            isUnassignedTalent ? (
              <View style={styles.emptyWrap}>
                <View
                  style={[styles.emptyIconBox, { backgroundColor: "#F1F5F9" }]}
                >
                  <Briefcase size={28} color={COLORS.textDim} />
                </View>
                <Text style={styles.emptyTitle}>
                  Ruang Obrolan Belum Terbuka
                </Text>
                <Text style={styles.emptyDesc}>
                  Belum ada mahasiswa yang disetujui untuk proyek ini. Ruang
                  obrolan kerja dan koordinasi langsung akan otomatis dibuka
                  setelah Anda menerima salah satu proposal pelamar.
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 16,
                    backgroundColor: COLORS.brandIndigo,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 12,
                  }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.85}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bodyBold,
                      fontSize: 12,
                      color: "#FFFFFF",
                      fontWeight: "700",
                    }}
                  >
                    Kembali ke Rincian Proyek
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconBox}>
                  <Briefcase size={28} color={COLORS.brandIndigo} />
                </View>
                <Text style={styles.emptyTitle}>Ruang Kolaborasi Resmi</Text>
                <Text style={styles.emptyDesc}>
                  Percakapan ini dilindungi sistem escrow Makarya. Kirim pesan
                  pertama untuk mulai mendiskusikan brief dan progres
                  pengerjaan.
                </Text>
              </View>
            )
          }
        />
      )}

      {/* Anti-Bypass Escrow Guard Warning */}
      {(() => {
        if (!inputText || inputText.trim().length < 5) return null;
        const text = inputText.trim();
        let warn = null;
        if (/(?:\+?62|08)[0-9\s.-]{8,14}/.test(text)) {
          warn = {
            title: "Nomor Kontak / WA Terdeteksi",
            desc: "Demi keamanan Anda, hindari bertukar kontak di luar ruang kerja. Komunikasi di luar sistem membatalkan proteksi Escrow 100% jika terjadi wanprestasi.",
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
            desc: "Peringatan: Seluruh pembayaran wajib melalui Escrow Makarya. Pembayaran di luar sistem berisiko penipuan dan tidak dilindungi garansi saldo.",
          };
        }
        if (!warn) return null;
        return (
          <View style={styles.bypassWarningBox}>
            <AlertTriangle size={15} color="#D97706" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <View style={styles.bypassWarningTitleRow}>
                <Text style={styles.bypassWarningTitle}>{warn.title}</Text>
                <View style={styles.bypassBadge}>
                  <Text style={styles.bypassBadgeText}>Proteksi Escrow</Text>
                </View>
              </View>
              <Text style={styles.bypassWarningDesc}>{warn.desc}</Text>
            </View>
          </View>
        );
      })()}

      {/* 3. Bottom Input Bar */}
      {isUnassignedTalent ? (
        <View
          style={[
            styles.inputContainer,
            { justifyContent: "center", paddingVertical: 14 },
          ]}
        >
          <Text
            style={{
              fontFamily: FONTS.bodyMedium,
              fontSize: 12,
              color: COLORS.textMuted,
              textAlign: "center",
            }}
          >
            Ruang obrolan terkunci hingga ada pelamar yang disetujui
          </Text>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          {/* Tombol Lampiran */}
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={() => setAttachModal(true)}
            activeOpacity={0.7}
          >
            <Plus size={20} color={COLORS.brandIndigo} />
          </TouchableOpacity>

          {/* Input Text */}
          <TextInput
            style={styles.inputField}
            placeholder="Tulis pesan atau perkembangan proyek..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />

          {/* Tombol Kirim */}
          <TouchableOpacity
            style={[
              styles.sendBtn,
              inputText.trim() ? styles.sendBtnActive : styles.sendBtnDisabled,
            ]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* 4. Modal Lampiran Tautan Berkas */}
      <Modal visible={attachModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kirim Lampiran Tautan</Text>
              <TouchableOpacity
                onPress={() => setAttachModal(false)}
                activeOpacity={0.7}
              >
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Pilih tipe lampiran untuk dikirim langsung ke ruang obrolan
            </Text>

            {/* Pilihan Tipe Lampiran */}
            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  attachType === "FIGMA" && styles.typeOptionActive,
                ]}
                onPress={() => setAttachType("FIGMA")}
              >
                <Link2
                  size={16}
                  color={
                    attachType === "FIGMA"
                      ? COLORS.brandIndigo
                      : COLORS.textMuted
                  }
                />
                <Text
                  style={[
                    styles.typeOptionText,
                    attachType === "FIGMA" && styles.typeOptionTextActive,
                  ]}
                >
                  Figma Link
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeOption,
                  attachType === "LINK" && styles.typeOptionActive,
                ]}
                onPress={() => setAttachType("LINK")}
              >
                <Briefcase
                  size={16}
                  color={
                    attachType === "LINK"
                      ? COLORS.brandIndigo
                      : COLORS.textMuted
                  }
                />
                <Text
                  style={[
                    styles.typeOptionText,
                    attachType === "LINK" && styles.typeOptionTextActive,
                  ]}
                >
                  Google Drive / Web
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input URL */}
            <View style={styles.urlInputWrap}>
              <TextInput
                style={styles.urlInput}
                placeholder="https://..."
                placeholderTextColor={COLORS.textMuted}
                value={attachUrl}
                onChangeText={setAttachUrl}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.confirmAttachBtn}
              onPress={handleSendAttachment}
              activeOpacity={0.88}
            >
              <Text style={styles.confirmAttachBtnText}>
                Kirim Tautan Lampiran
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 34,
    paddingBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.7)",
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(241, 245, 249, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerName: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  headerSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 1,
  },
  headerProjectTitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    maxWidth: 160,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  onlineDotActive: {
    backgroundColor: COLORS.success,
  },
  onlineDotInactive: {
    backgroundColor: COLORS.textDim,
  },
  escrowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandCyanLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  escrowChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.brandCyan,
    fontWeight: "700",
  },

  centerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Messages List
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    width: "100%",
  },
  chatAvatarSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 2,
  },
  chatAvatarPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  chatAvatarPlaceholderMe: {
    backgroundColor: COLORS.brandIndigo,
  },
  chatAvatarPlaceholderText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  headerPartnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  headerPartnerAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerPartnerAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  bubbleRowMe: {
    justifyContent: "flex-end",
  },
  bubbleRowPartner: {
    justifyContent: "flex-start",
  },
  bubbleBox: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleBoxMe: {
    backgroundColor: COLORS.brandIndigo,
    borderBottomRightRadius: 4,
  },
  bubbleBoxPartner: {
    backgroundColor: COLORS.bgSurface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  senderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  senderNameText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  roleTagMini: {
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  roleTagMiniText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: COLORS.brandIndigo,
  },
  messageText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
  },
  messageTextMe: {
    color: "#FFFFFF",
  },
  messageTextPartner: {
    color: COLORS.textDark,
  },
  bubbleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
  },
  timeTextMe: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  timeTextPartner: {
    color: COLORS.textMuted,
  },
  readStatusWrap: {
    marginLeft: 2,
  },

  // Attachment Card
  attachmentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
  },
  attachmentCardMe: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  attachmentCardPartner: {
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  attachmentIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentTypeLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
  },
  attachmentUrlText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    marginTop: 1,
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 60,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  emptyDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },

  // Bypass Warning Box
  bypassWarningBox: {
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bypassWarningTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    flexWrap: "wrap",
  },
  bypassWarningTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#78350F",
  },
  bypassBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  bypassBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    fontWeight: "700",
    color: "#92400E",
  },
  bypassWarningDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    lineHeight: 15,
    color: "#92400E",
    marginTop: 2,
  },

  // Input Bar
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.8)",
    gap: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    flex: 1,
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnActive: {
    backgroundColor: COLORS.brandIndigo,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.borderDark,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.canvasSoft,
  },
  typeOptionActive: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: COLORS.brandIndigoLight,
  },
  typeOptionText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  typeOptionTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  urlInputWrap: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  urlInput: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
    height: 40,
  },
  confirmAttachBtn: {
    backgroundColor: COLORS.brandIndigo,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmAttachBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
