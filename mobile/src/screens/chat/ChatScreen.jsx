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
import { chatApi, projectApi, getChatWsUrl } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { ChatSkeleton } from "../../components/ui/Skeleton";
import { Header } from "../../components/ui/Header";
import { ProjectBriefVectorIcon } from "../../components/icons/CategoryIcons";
import {
  ArrowLeft,
  Send,
  Link2,
  Image as ImageIcon,
  ShieldCheck,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Paperclip,
  X,
  Radio,
  AlertTriangle,
  Clock,
  Users,
} from "lucide-react-native";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

export function ChatScreen({ route, navigation }) {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const { responsiveContainerStyle, contentMaxWidth } = useResponsiveLayout();

  const isUmkm = user?.role?.toUpperCase() === "UMKM";
  const isMahasiswa = !isUmkm;
  const talentId = route.params?.talentId || route.params?.talent?.id;
  const initialProjectId = route.params?.projectId || route.params?.id;

  const [currentProjectId, setCurrentProjectId] = useState(
    initialProjectId || "",
  );
  const [currentProjectTitle, setCurrentProjectTitle] = useState(
    route.params?.projectTitle || "Ruang Kolaborasi Proyek",
  );
  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [respondingOfferId, setRespondingOfferId] = useState(null);

  const partnerName = route.params?.partnerName || "Mitra Kolaborasi";
  const partnerRole = route.params?.partnerRole || (isUmkm ? "MHS" : "UMKM");
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
    !talentId &&
    (resolvedPartnerName === "Mahasiswa Talenta" ||
      resolvedPartnerName === "Mitra Kolaborasi") &&
    messages.length === 0;

  // Never leak another student's photo if chatting with a specific targeted talent
  const resolvedPartnerPhoto =
    partnerPhoto ||
    (talentId
      ? null
      : messages.find((m) => m.sender_id !== user?.id && m.sender_photo)
          ?.sender_photo || null);

  // Filter out messages from other students if a specific talent is targeted
  const displayMessages = talentId
    ? messages.filter(
        (m) =>
          String(m.sender_id) === String(user?.id) ||
          String(m.sender_id) === String(talentId) ||
          (m.sender_name &&
            resolvedPartnerName &&
            m.sender_name.toLowerCase() === resolvedPartnerName.toLowerCase()),
      )
    : messages;

  const userPhoto =
    user?.url_foto || user?.url_foto_usaha || user?.photoUrl || null;

  // Load UMKM projects for offering
  useEffect(() => {
    if (isUmkm) {
      async function loadProjects() {
        try {
          setLoadingProjects(true);
          const res = await projectApi.getMyProjects();
          const list = Array.isArray(res.data) ? res.data : [];
          // Proyek yang sudah selesai TIDAK BISA ditawarkan lagi
          const activeList = list.filter(
            (p) => p.status === "OPEN" || p.status === "BIDDING",
          );
          setMyProjects(activeList);
          if (!currentProjectId && activeList.length > 0) {
            setCurrentProjectId(activeList[0].id);
            setCurrentProjectTitle(activeList[0].judul);
          }
        } catch (err) {
          console.warn("Gagal memuat proyek UMKM:", err);
        } finally {
          setLoadingProjects(false);
        }
      }
      loadProjects();
    }
  }, [isUmkm, talentId]);

  const handleSendProjectOffer = async (proj, selectedSlot = null) => {
    setCurrentProjectId(proj.id);
    setCurrentProjectTitle(proj.judul);
    setShowProjectModal(false);

    try {
      const catMap = {
        PEMROGRAMAN: "Programmer / Developer",
        DESAIN: "Desainer / UI/UX",
        MARKETING: "Digital Marketer",
        PENULISAN: "Content Writer",
        MULTIMEDIA: "Multimedia & Video",
        BISNIS: "Konsultan Bisnis",
        DATA: "Data Analyst",
      };

      const offeredRole =
        selectedSlot?.nama_peran ||
        proj.nama_peran ||
        (proj.tipe_kolaborasi === "TIM" && proj.slots && proj.slots.length > 0
          ? proj.slots[0].nama_peran
          : proj.kategori
            ? catMap[String(proj.kategori).toUpperCase()] || proj.kategori
            : "Pelaksana Proyek");

      const offerData = {
        projectId: proj.id,
        projectTitle: proj.judul,
        budget: selectedSlot?.alokasi_budget || proj.budget_max,
        deadline: proj.deadline,
        kategori: proj.kategori,
        tipe_kolaborasi:
          proj.tipe_kolaborasi || (proj.slots?.length > 0 ? "TIM" : "INDIVIDU"),
        posisi: offeredRole,
        slotId: selectedSlot?.id || null,
        slots: proj.slots || [],
        status: "PENDING",
      };

      const payload = {
        message: `Tawaran Proyek Resmi: ${proj.judul} (${offeredRole})`,
        attachment_url: JSON.stringify(offerData),
        attachment_type: "PROJECT_OFFER",
        recipient_id: targetRecipientId,
      };

      await chatApi.sendMessage(proj.id, payload);
      showToast(
        "Tawaran proyek & posisi berhasil diajukan kepada talenta!",
        "success",
      );
      loadHistory(proj.id);
    } catch (err) {
      console.warn("Gagal mengirim tawaran:", err);
      showToast("Gagal mengajukan tawaran proyek", "danger");
    }
  };

  const handleRespondOffer = async (messageId, action) => {
    try {
      setRespondingOfferId(messageId);
      await chatApi.respondToOffer(messageId, action);
      showToast(
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
      showToast(
        err?.response?.data?.detail || "Gagal memproses respons tawaran",
        "danger",
      );
    } finally {
      setRespondingOfferId(null);
    }
  };

  // Attachment Modal
  const [attachModal, setAttachModal] = useState(false);
  const [attachUrl, setAttachUrl] = useState("");
  const [attachType, setAttachType] = useState("LINK"); // 'LINK', 'FIGMA', 'IMAGE'

  const wsRef = useRef(null);
  const flatListRef = useRef(null);

  const targetRecipientId = talentId || route.params?.partnerId || null;

  // 1. Muat riwayat chat lama via REST
  const loadHistory = async (projId = currentProjectId) => {
    const targetId = projId || currentProjectId;
    if (!targetId) return;
    try {
      setLoading(true);
      const res = await chatApi.getMessages(targetId, targetRecipientId);
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
        if (!token || !currentProjectId) return;

        const wsUrl = getChatWsUrl(currentProjectId, token);
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
              // Jika sedang dalam percakapan dengan partner tertentu, abaikan pesan orang lain
              if (
                targetRecipientId &&
                incomingMsg.sender_id !== user?.id &&
                incomingMsg.sender_id !== targetRecipientId
              ) {
                return;
              }

              setMessages((prev) => {
                const exists = prev.some((m) => m.id === incomingMsg.id);
                if (exists) return prev;
                return [...prev, incomingMsg];
              });
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
  }, [currentProjectId]);

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
      recipient_id: targetRecipientId,
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
      const res = await chatApi.sendMessage(currentProjectId, payload);
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

  const getCleanRoleName = (offer) => {
    // 1. Jika ada slots spesifik dari brief proyek:
    if (offer.slots && Array.isArray(offer.slots) && offer.slots.length > 0) {
      // Cocokkan by slotId jika ada
      if (offer.slotId) {
        const found = offer.slots.find(
          (s) => String(s.id) === String(offer.slotId),
        );
        if (found && found.nama_peran) return found.nama_peran;
      }
      // Cocokkan jika budget tawaran sesuai alokasi slot tertentu
      if (offer.budget) {
        const matchSlot = offer.slots.find(
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
    if (isGeneric && offer.slots && Array.isArray(offer.slots) && offer.slots.length > 0) {
      return offer.slots.map((s) => s.nama_peran).join(" / ");
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

  const renderMessageItem = ({ item }) => {
    const isMe = item.sender_id === user?.id;
    const isOffer = item.attachment_type === "PROJECT_OFFER";

    return (
      <View
        style={[
          styles.bubbleRow,
          isMe ? styles.bubbleRowMe : styles.bubbleRowPartner,
        ]}
      >
        {!isMe &&
          ((
            talentId
              ? resolvedPartnerPhoto
              : item.sender_photo || resolvedPartnerPhoto
          ) ? (
            <Image
              source={{
                uri: talentId
                  ? resolvedPartnerPhoto
                  : item.sender_photo || resolvedPartnerPhoto,
              }}
              style={styles.chatAvatarSmall}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.chatAvatarPlaceholder}>
              <Text style={styles.chatAvatarPlaceholderText}>
                {(talentId
                  ? resolvedPartnerName
                  : item.sender_name || resolvedPartnerName || "P"
                )
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
          ))}

        <View
          style={[
            styles.bubbleBox,
            isOffer
              ? isMe
                ? styles.bubbleBoxOfferMe
                : styles.bubbleBoxOfferPartner
              : isMe
                ? styles.bubbleBoxMe
                : styles.bubbleBoxPartner,
          ]}
        >
          {/* Sender Header if Partner (only on regular text messages) */}
          {!isMe && !isOffer && (
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

          {/* Text Message (Exclude auto text when it is a PROJECT_OFFER) */}
          {item.message && !isOffer ? (
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
          {isOffer ? (
            (() => {
              let offer = {};
              try {
                offer = JSON.parse(item.attachment_url || "{}");
              } catch (_) {
                offer = {
                  projectTitle: item.message || "Tawaran Proyek Kolaborasi",
                };
              }
              const offerStatus = (offer.status || "PENDING").toUpperCase();
              const isResponding = respondingOfferId === item.id;

              return (
                <View
                  style={[
                    styles.offerCard,
                    isMe ? styles.offerCardMe : styles.offerCardPartner,
                  ]}
                >
                  {/* Top Bar: Badge & Escrow Guarantee */}
                  <View style={styles.offerBadgeRow}>
                    <View
                      style={[
                        styles.offerBadge,
                        isMe ? styles.offerBadgeMe : styles.offerBadgePartner,
                      ]}
                    >
                      <ShieldCheck
                        size={11}
                        color={isMe ? "#FFFFFF" : COLORS.brandIndigo}
                      />
                      <Text
                        style={[
                          styles.offerBadgeText,
                          isMe
                            ? { color: "#FFFFFF" }
                            : { color: COLORS.brandIndigo },
                        ]}
                      >
                        TAWARAN PROYEK
                      </Text>
                    </View>
                    <View style={styles.offerEscrowBadge}>
                      <ShieldCheck
                        size={11}
                        color={isMe ? "rgba(255,255,255,0.85)" : "#059669"}
                      />
                      <Text
                        style={[
                          styles.offerEscrowText,
                          isMe
                            ? { color: "rgba(255,255,255,0.9)" }
                            : { color: "#059669" },
                        ]}
                      >
                        100% Escrow
                      </Text>
                    </View>
                  </View>

                  {/* Sender Context (if partner sent it) */}
                  {!isMe && (
                    <Text style={styles.offerSenderLabel} numberOfLines={1}>
                      Diajukan oleh{" "}
                      <Text style={styles.offerSenderName}>
                        {item.sender_name || resolvedPartnerName}
                      </Text>
                    </Text>
                  )}

                  {/* Project Title */}
                  <Text
                    style={[
                      styles.offerTitle,
                      isMe ? { color: "#FFFFFF" } : { color: "#0F172A" },
                    ]}
                  >
                    {offer.projectTitle || "Proyek Kolaborasi"}
                  </Text>

                  {/* Position / Role Highlight Pill */}
                  <View
                    style={[
                      styles.offerPositionPill,
                      isMe
                        ? styles.offerPositionPillMe
                        : styles.offerPositionPillPartner,
                    ]}
                  >
                    <Users
                      size={12}
                      color={isMe ? "#FFFFFF" : COLORS.brandIndigo}
                    />
                    <Text
                      style={[
                        styles.offerPositionText,
                        isMe
                          ? { color: "#FFFFFF" }
                          : { color: COLORS.brandIndigo },
                      ]}
                    >
                      <Text style={{ fontWeight: "700" }}>
                        {getCleanRoleName(offer)}
                      </Text>
                      {offer.tipe_kolaborasi === "TIM" ? " • Proyek Tim" : ""}
                    </Text>
                  </View>

                  {/* Budget & Deadline Section (Clean, Airy, Minimal) */}
                  <View
                    style={[
                      styles.offerDetailsBox,
                      isMe
                        ? styles.offerDetailsBoxMe
                        : styles.offerDetailsBoxPartner,
                    ]}
                  >
                    <View style={styles.offerDetailCol}>
                      <Text
                        style={[
                          styles.offerDetailLabel,
                          isMe && { color: "rgba(255,255,255,0.7)" },
                        ]}
                      >
                        {offer.posisi ? "Alokasi Posisi" : "Nilai Proyek"}
                      </Text>
                      <Text
                        style={[
                          styles.offerDetailValue,
                          isMe && { color: "#FFFFFF" },
                        ]}
                      >
                        {offer.budget
                          ? `Rp ${Number(offer.budget).toLocaleString("id-ID")}`
                          : "Sesuai Diskusi"}
                      </Text>
                    </View>

                    {offer.deadline ? (
                      <View
                        style={[
                          styles.offerDetailCol,
                          { alignItems: "flex-end" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.offerDetailLabel,
                            isMe && { color: "rgba(255,255,255,0.7)" },
                          ]}
                        >
                          Tenggat
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Clock
                            size={11}
                            color={isMe ? "rgba(255,255,255,0.85)" : "#64748B"}
                          />
                          <Text
                            style={[
                              styles.offerDetailDeadlineText,
                              isMe && { color: "#FFFFFF" },
                            ]}
                          >
                            {offer.deadline}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {/* Formasi Peran Tim (If Team Project with Slots) */}
                  {offer.slots && offer.slots.length > 0 && (
                    <View
                      style={[
                        styles.offerTeamSlotsContainer,
                        isMe
                          ? styles.offerTeamSlotsContainerMe
                          : styles.offerTeamSlotsContainerPartner,
                      ]}
                    >
                      <Text
                        style={[
                          styles.offerTeamSlotsHeading,
                          isMe
                            ? { color: "rgba(255, 255, 255, 0.85)" }
                            : { color: "#64748B" },
                        ]}
                      >
                        FORMASI PERAN TIM ({offer.slots.length} POSISI):
                      </Text>
                      <View style={{ gap: 6 }}>
                        {offer.slots.map((s, sIdx) => {
                          const isThisRole =
                            (offer.slotId &&
                              String(s.id) === String(offer.slotId)) ||
                            s.nama_peran === offer.posisi;
                          return (
                            <View
                              key={s.id || sIdx}
                              style={[
                                styles.offerTeamSlotRow,
                                isThisRole
                                  ? isMe
                                    ? styles.offerTeamSlotRowSelectedMe
                                    : styles.offerTeamSlotRowSelectedPartner
                                  : isMe
                                    ? styles.offerTeamSlotRowMe
                                    : styles.offerTeamSlotRowPartner,
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 6,
                                  flex: 1,
                                }}
                              >
                                <Text
                                  style={[
                                    styles.offerTeamSlotRoleName,
                                    isThisRole && { fontWeight: "700" },
                                    isMe
                                      ? { color: "#FFFFFF" }
                                      : isThisRole
                                        ? { color: COLORS.brandIndigo }
                                        : { color: "#1E293B" },
                                  ]}
                                  numberOfLines={1}
                                >
                                  {s.nama_peran}
                                </Text>
                                {isThisRole && (
                                  <View
                                    style={[
                                      styles.offerTeamSlotTag,
                                      isMe
                                        ? {
                                            backgroundColor:
                                              "rgba(255, 255, 255, 0.25)",
                                          }
                                        : {
                                            backgroundColor: COLORS.brandIndigo,
                                          },
                                    ]}
                                  >
                                    <Text
                                      style={{
                                        color: "#FFFFFF",
                                        fontSize: 9,
                                        fontWeight: "700",
                                      }}
                                    >
                                      Ditawarkan
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <Text
                                style={[
                                  styles.offerTeamSlotBudget,
                                  isMe
                                    ? { color: "rgba(255, 255, 255, 0.9)" }
                                    : { color: "#059669" },
                                ]}
                              >
                                {s.alokasi_budget
                                  ? `Rp ${Number(s.alokasi_budget).toLocaleString("id-ID")}`
                                  : "Sesuai Proyek"}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* Action Buttons for Mahasiswa */}
                  {offerStatus === "PENDING" ? (
                    !isMe ? (
                      <View style={styles.offerActionRow}>
                        <TouchableOpacity
                          style={styles.offerAcceptBtn}
                          onPress={() => handleRespondOffer(item.id, "ACCEPT")}
                          disabled={isResponding}
                          activeOpacity={0.8}
                        >
                          {isResponding ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <>
                              <CheckCircle2 size={14} color="#FFFFFF" />
                              <Text style={styles.offerAcceptBtnText}>
                                Terima Tawaran
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.offerRejectBtn}
                          onPress={() => handleRespondOffer(item.id, "REJECT")}
                          disabled={isResponding}
                          activeOpacity={0.8}
                        >
                          <X size={14} color="#64748B" />
                          <Text style={styles.offerRejectBtnText}>Tolak</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.offerStatusPendingBox}>
                        <Clock size={12} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.offerStatusPendingText}>
                          Menunggu tanggapan dari talenta...
                        </Text>
                      </View>
                    )
                  ) : offerStatus === "ACCEPTED" ? (
                    <View
                      style={[
                        styles.offerStatusAcceptedBox,
                        isMe && styles.offerStatusAcceptedBoxMe,
                      ]}
                    >
                      <CheckCircle2
                        size={13}
                        color={isMe ? "#A7F3D0" : "#059669"}
                      />
                      <Text
                        style={[
                          styles.offerStatusAcceptedText,
                          isMe && { color: "#A7F3D0" },
                        ]}
                      >
                        ✓ Tawaran Diterima • Proyek Dimulai
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.offerStatusRejectedBox,
                        isMe && styles.offerStatusRejectedBoxMe,
                      ]}
                    >
                      <X
                        size={13}
                        color={isMe ? "rgba(255,255,255,0.7)" : "#64748B"}
                      />
                      <Text
                        style={[
                          styles.offerStatusRejectedText,
                          isMe && { color: "rgba(255,255,255,0.8)" },
                        ]}
                      >
                        ✕ Tawaran Ditolak
                      </Text>
                    </View>
                  )}

                  {/* Time & Read Receipt Inside Offer Card */}
                  <View style={styles.offerFooterRow}>
                    <Text
                      style={[
                        styles.offerTimeText,
                        isMe && { color: "rgba(255,255,255,0.7)" },
                      ]}
                    >
                      {formatTime(item.created_at)}
                    </Text>
                    {isMe && (
                      <View style={styles.readStatusWrap}>
                        {item.is_read ? (
                          <CheckCheck size={13} color="#38BDF8" />
                        ) : item.id ? (
                          <CheckCheck
                            size={13}
                            color="rgba(255, 255, 255, 0.65)"
                          />
                        ) : (
                          <Check size={13} color="rgba(255, 255, 255, 0.65)" />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              );
            })()
          ) : item.attachment_url ? (
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

          {/* Regular Bubble Footer: Time & WhatsApp Checkmark (only for normal messages) */}
          {!isOffer && (
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
                    <CheckCheck size={13} color="#38BDF8" />
                  ) : item.id ? (
                    <CheckCheck size={13} color="rgba(255, 255, 255, 0.65)" />
                  ) : (
                    <Check size={13} color="rgba(255, 255, 255, 0.65)" />
                  )}
                </View>
              )}
            </View>
          )}
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
      {/* 1. Header Bar (Standar Desain Makarya Mobile - Clean Centered Apple Style) */}
      <Header
        onBack={() => navigation.goBack()}
        centerContent={
          <View style={styles.headerCenterWrap}>
            <View style={styles.headerCenterNameRow}>
              {resolvedPartnerPhoto ? (
                <Image
                  source={{ uri: resolvedPartnerPhoto }}
                  style={styles.headerPartnerAvatarSmall}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.headerPartnerAvatarPlaceholderSmall}>
                  <Text style={styles.headerPartnerAvatarTextSmall}>
                    {(resolvedPartnerName || "M").charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.headerName} numberOfLines={1}>
                {resolvedPartnerName}
              </Text>
              <CheckCircle2 size={13} color="#059669" />
            </View>
            <View style={styles.headerSubRow}>
              <View
                style={[
                  styles.onlineDot,
                  wsConnected
                    ? styles.onlineDotActive
                    : styles.onlineDotInactive,
                ]}
              />
              <Text
                style={[
                  styles.headerStatusText,
                  wsConnected
                    ? styles.headerStatusTextActive
                    : styles.headerStatusTextInactive,
                ]}
                numberOfLines={1}
              >
                {wsConnected ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        }
        rightAction={
          <View style={styles.headerEscrowBadge}>
            <ShieldCheck size={12} color="#059669" />
            <Text style={styles.headerEscrowBadgeText}>Escrow</Text>
          </View>
        }
      />

      {/* 2. Messages List */}
      {loading ? (
        <ChatSkeleton />
      ) : (
        <FlatList
          ref={flatListRef}
          data={displayMessages}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderMessageItem}
          contentContainerStyle={[
            styles.messagesList,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          ListEmptyComponent={
            isUnassignedTalent ? (
              <View style={styles.emptyWrap}>
                <View
                  style={[styles.emptyIconBox, { backgroundColor: "#F1F5F9" }]}
                >
                  <ProjectBriefVectorIcon size={26} color={COLORS.textDim} />
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
                  <ProjectBriefVectorIcon
                    size={26}
                    color={COLORS.brandIndigo}
                  />
                </View>
                <Text style={styles.emptyTitle}>Ruang Kolaborasi Resmi</Text>
                <Text style={styles.emptyDesc}>
                  Percakapan ini dilindungi sistem escrow Makarya. Kirim pesan
                  atau ajukan tawaran proyek untuk mulai berkolaborasi.
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
            {
              justifyContent: "center",
              paddingVertical: 14,
              maxWidth: contentMaxWidth,
              width: "100%",
              alignSelf: "center",
            },
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
        <View
          style={[
            styles.bottomBarContainer,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
        >
          {/* Apple-Style Tawarkan Proyek Strip (UMKM Only) */}
          {isUmkm && (
            <View style={styles.offerBarTop}>
              <TouchableOpacity
                style={styles.offerProjectPillBtn}
                onPress={() => setShowProjectModal(true)}
                activeOpacity={0.75}
              >
                <ProjectBriefVectorIcon size={14} color={COLORS.brandIndigo} />
                <Text style={styles.offerProjectPillText} numberOfLines={1}>
                  {currentProjectTitle
                    ? `Ajukan: ${currentProjectTitle}`
                    : "Tawarkan Proyek ke Mahasiswa"}
                </Text>
                <ChevronRight size={13} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          )}

          {/* Main Input Row */}
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
              placeholder="Tulis pesan..."
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
                inputText.trim()
                  ? styles.sendBtnActive
                  : styles.sendBtnDisabled,
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
                <ProjectBriefVectorIcon
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

      {/* 5. Modal Pilih Proyek */}
      <Modal
        visible={showProjectModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProjectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowProjectModal(false)}
          />
          <View style={styles.projectModalSheet}>
            <View style={styles.projectModalHeader}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.projectModalTitle}>
                  Pilih Proyek Kolaborasi
                </Text>
                <Text style={styles.modalSub}>
                  Pilih proyek Anda yang ingin ditawarkan kepada{" "}
                  {resolvedPartnerName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowProjectModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={myProjects}
              keyExtractor={(item) => String(item.id)}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => {
                const isSelected = item.id === currentProjectId;
                const isTeam =
                  item.tipe_kolaborasi === "TIM" ||
                  (item.slots && item.slots.length > 0);
                const hasSlots = item.slots && item.slots.length > 0;

                return (
                  <View style={styles.projectOptionCard}>
                    <TouchableOpacity
                      style={[
                        styles.projectOptionItem,
                        isSelected && styles.projectOptionItemSelected,
                      ]}
                      onPress={() => handleSendProjectOffer(item)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text
                          style={[
                            styles.projectOptionTitle,
                            isSelected && { color: COLORS.brandIndigo },
                          ]}
                          numberOfLines={1}
                        >
                          {item.judul}
                        </Text>
                        <Text style={styles.projectOptionStatus}>
                          {isTeam ? "Proyek Tim" : "Proyek Individu"} •
                          Anggaran: Rp{" "}
                          {Number(item.budget_max).toLocaleString("id-ID")}
                        </Text>
                      </View>
                      <View style={styles.projectOptionTag}>
                        <Text style={styles.projectOptionTagText}>
                          {hasSlots ? "Pilih Posisi ▾" : "Tawarkan"}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Jika proyek memiliki rincian posisi slot tim */}
                    {hasSlots && (
                      <View style={styles.projectSlotsWrap}>
                        <Text style={styles.projectSlotsHeading}>
                          Pilih Posisi Tim yang Ditawarkan:
                        </Text>
                        {item.slots.map((slot) => (
                          <TouchableOpacity
                            key={slot.id}
                            style={styles.projectSlotItem}
                            onPress={() => handleSendProjectOffer(item, slot)}
                            activeOpacity={0.75}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={styles.projectSlotTitle}>
                                {slot.nama_peran}
                              </Text>
                              <Text style={styles.projectSlotBudget}>
                                Alokasi: Rp{" "}
                                {Number(
                                  slot.alokasi_budget || item.budget_max,
                                ).toLocaleString("id-ID")}
                              </Text>
                            </View>
                            <View style={styles.projectSlotOfferBtn}>
                              <Text style={styles.projectSlotOfferBtnText}>
                                Ajukan Posisi
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              }}
            />
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
  headerTitleWrap: {
    flex: 1,
  },
  headerCenterWrap: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 220,
  },
  headerCenterNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  headerPartnerAvatarSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  headerPartnerAvatarPlaceholderSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerPartnerAvatarTextSmall: {
    fontSize: 10,
    fontFamily: FONTS.displayBold,
    color: COLORS.brandIndigo,
  },
  headerEscrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.22)",
  },
  headerEscrowBadgeText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.success,
    fontWeight: "600",
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
    backgroundColor: "#10B981",
  },
  onlineDotInactive: {
    backgroundColor: "#EF4444",
  },
  headerStatusText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  headerStatusTextActive: {
    color: "#059669",
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
  },
  headerStatusTextInactive: {
    color: "#EF4444",
  },
  escrowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandCyanLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.2)",
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
    alignItems: "flex-start",
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
  bubbleBoxOfferMe: {
    maxWidth: "88%",
    borderRadius: 20,
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  bubbleBoxOfferPartner: {
    maxWidth: "88%",
    borderRadius: 20,
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
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

  // Project Context Dock (Near Bottom Input)
  projectContextDock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.8)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  projectContextLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  projectContextPicker: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(203, 213, 225, 0.8)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  projectContextPickerText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.brandIndigo,
    flex: 1,
  },

  // Project Picker Modal Sheet
  projectModalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "75%",
  },
  projectModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  projectModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  projectOptionCard: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 10,
    overflow: "hidden",
  },
  projectOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  projectOptionItemSelected: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  projectOptionTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  projectOptionStatus: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  projectOptionTag: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(203, 213, 225, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  projectOptionTagText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.brandIndigo,
  },
  projectSlotsWrap: {
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.8)",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  projectSlotsHeading: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: "#64748B",
    marginBottom: 2,
  },
  projectSlotItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  projectSlotTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#0F172A",
  },
  projectSlotBudget: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#059669",
    marginTop: 1,
  },
  projectSlotOfferBtn: {
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  projectSlotOfferBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: "#FFFFFF",
  },

  // Project Offer Attachment Card (Apple-style / Clean & Modern)
  offerCard: {
    borderRadius: 20,
    padding: 16,
    width: "100%",
  },
  offerCardMe: {
    backgroundColor: COLORS.brandIndigo,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  offerCardPartner: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  offerBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
  },
  offerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  offerBadgePartner: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  offerBadgeMe: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  offerBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  offerEscrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
  },
  offerEscrowText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
  },
  offerSenderLabel: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
    marginTop: 4,
  },
  offerSenderName: {
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
  },
  offerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 6,
  },
  offerPositionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  offerPositionPillPartner: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  offerPositionPillMe: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  offerPositionText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
  },
  offerDetailsBox: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerDetailsBoxPartner: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  offerDetailsBoxMe: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  offerDetailCol: {
    gap: 2,
  },
  offerDetailLabel: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: "#64748B",
  },
  offerDetailValue: {
    fontSize: 15,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  offerDetailDeadlineText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "600",
  },
  offerTeamSlotsContainer: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  offerTeamSlotsContainerPartner: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  offerTeamSlotsContainerMe: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  offerTeamSlotsHeading: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  offerTeamSlotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  offerTeamSlotRowPartner: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  offerTeamSlotRowMe: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  offerTeamSlotRowSelectedPartner: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  offerTeamSlotRowSelectedMe: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  offerTeamSlotRoleName: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
  },
  offerTeamSlotTag: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  offerTeamSlotBudget: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    fontWeight: "600",
  },
  offerActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  offerAcceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  offerAcceptBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  offerRejectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  offerRejectBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  offerStatusPendingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  offerStatusPendingText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#FFFFFF",
  },
  offerStatusAcceptedBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  offerStatusAcceptedBoxMe: {
    backgroundColor: "rgba(16, 185, 129, 0.25)",
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  offerStatusAcceptedText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11.5,
    color: "#059669",
  },
  offerStatusRejectedBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  offerStatusRejectedBoxMe: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  offerStatusRejectedText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#64748B",
  },
  offerFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 8,
  },
  offerTimeText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9.5,
    color: "#94A3B8",
  },
  bottomBarContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.8)",
  },
  offerBarTop: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  offerProjectPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  offerProjectPillText: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    fontWeight: "600",
    color: "#0F172A",
  },
});
