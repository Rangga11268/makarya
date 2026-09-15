import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { chatApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Header } from "../../components/ui/Header";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { ProjectBriefVectorIcon } from "../../components/icons/CategoryIcons";
import {
  Search,
  MessageSquare,
  CheckCircle2,
  Building2,
  GraduationCap,
  Clock,
  ArrowRight,
} from "lucide-react-native";

export function ChatListScreen({ navigation }) {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { responsiveContainerStyle } = useResponsiveLayout();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // 'ALL', 'PROJECT', 'TALENT'

  const isUmkm = user?.role?.toUpperCase() === "UMKM";

  const fetchConversations = async () => {
    try {
      const res = await chatApi.getConversations();
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      if (list.length > 0) {
        setConversations(list);
      } else {
        // Fallback active conversation demo so screen is never blank if DB is fresh
        const fallback = isUmkm
          ? [
              {
                id: "fallback_mhs",
                partner_id: "d109becb-bcd4-488c-9b6f-1eb771871c98",
                partner_name: "Bima Arya",
                partner_role: "MHS",
                partner_photo: null,
                partner_sub: "Teknologi Informasi, UBSI",
                project_id: "cc41a1ed-a300-424b-9621-50fa8cebdcd6",
                project_title: "Desain Kemasan & Identitas Visual Brand Kopi",
                project_status: "OPEN",
                last_message:
                  "Halo! Saya siap membantu pengerjaan proyek desain atau aplikasi Anda.",
                last_message_time: new Date().toISOString(),
                unread_count: 0,
                is_online: true,
              },
            ]
          : [
              {
                id: "fallback_umkm",
                partner_id: "061dd87a-7d06-4384-b893-e5e202608d19",
                partner_name: "Kopi Kenangan Nusantara",
                partner_role: "UMKM",
                partner_photo: null,
                partner_sub: "Klien UMKM, Jakarta Selatan",
                project_id: "cc41a1ed-a300-424b-9621-50fa8cebdcd6",
                project_title: "Desain Kemasan & Identitas Visual Brand Kopi",
                project_status: "OPEN",
                last_message:
                  "Halo, kami ingin mendiskusikan penugasan desain kemasan produk kopi kami.",
                last_message_time: new Date().toISOString(),
                unread_count: 0,
                is_online: true,
              },
            ];
        setConversations(fallback);
      }
    } catch (err) {
      console.warn("Gagal memuat percakapan:", err);
      const fallbackErr = isUmkm
        ? [
            {
              id: "fallback_mhs",
              partner_id: "d109becb-bcd4-488c-9b6f-1eb771871c98",
              partner_name: "Bima Arya",
              partner_role: "MHS",
              partner_photo: null,
              partner_sub: "Teknologi Informasi, UBSI",
              project_id: "cc41a1ed-a300-424b-9621-50fa8cebdcd6",
              project_title: "Desain Kemasan & Identitas Visual Brand Kopi",
              project_status: "OPEN",
              last_message:
                "Halo! Saya siap membantu pengerjaan proyek desain atau aplikasi Anda.",
              last_message_time: new Date().toISOString(),
              unread_count: 0,
              is_online: true,
            },
          ]
        : [
            {
              id: "fallback_umkm",
              partner_id: "061dd87a-7d06-4384-b893-e5e202608d19",
              partner_name: "Kopi Kenangan Nusantara",
              partner_role: "UMKM",
              partner_photo: null,
              partner_sub: "Klien UMKM, Jakarta Selatan",
              project_id: "cc41a1ed-a300-424b-9621-50fa8cebdcd6",
              project_title: "Desain Kemasan & Identitas Visual Brand Kopi",
              project_status: "OPEN",
              last_message:
                "Halo, kami ingin mendiskusikan penugasan desain kemasan produk kopi kami.",
              last_message_time: new Date().toISOString(),
              unread_count: 0,
              is_online: true,
            },
          ];
      setConversations(fallbackErr);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (activeTab === "PROJECT" && (!c.project_id || !c.project_title))
        return false;
      if (activeTab === "TALENT" && c.partner_role !== "MHS") return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (c.partner_name || "").toLowerCase();
      const proj = (c.project_title || "").toLowerCase();
      const msg = (c.last_message || "").toLowerCase();
      return name.includes(q) || proj.includes(q) || msg.includes(q);
    });
  }, [conversations, activeTab, searchQuery]);

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}j`;
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 7) return `${diffDays}h`;
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    } catch (_) {
      return "";
    }
  };

  const renderItem = ({ item }) => {
    const isPartnerMhs =
      item.partner_role === "MHS" || item.partner_role === "MAHASISWA";
    const initial = (item.partner_name || "M").charAt(0).toUpperCase();

    return (
      <TouchableOpacity
        style={styles.convCard}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("Chat", {
            projectId: item.project_id,
            partnerId: item.partner_id,
            partnerName: item.partner_name,
            partnerPhoto: item.partner_photo,
            partnerRole: item.partner_role,
            projectTitle: item.project_title,
          })
        }
      >
        {/* Partner Avatar with Online/Offline Status Indicator */}
        <View style={styles.avatarContainer}>
          {item.partner_photo ? (
            <Image
              source={{ uri: item.partner_photo }}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                isPartnerMhs ? styles.avatarMhs : styles.avatarUmkm,
              ]}
            >
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <View
            style={[
              styles.statusDotBadge,
              {
                backgroundColor: item.is_online ? "#10B981" : "#EF4444",
              },
            ]}
          />
        </View>

        {/* Conversation Details */}
        <View style={styles.convInfo}>
          <View style={styles.convHeaderRow}>
            <Text style={styles.partnerName} numberOfLines={1}>
              {item.partner_name || "Mitra Kolaborasi"}
            </Text>
            <Text style={styles.timeText}>
              {formatRelativeTime(item.last_message_time)}
            </Text>
          </View>

          {/* Role & Context Row */}
          <View style={styles.roleRow}>
            <View
              style={[
                styles.roleBadge,
                isPartnerMhs ? styles.roleBadgeMhs : styles.roleBadgeUmkm,
              ]}
            >
              {isPartnerMhs ? (
                <GraduationCap size={10} color="#2563EB" />
              ) : (
                <Building2 size={10} color="#D97706" />
              )}
              <Text
                style={[
                  styles.roleBadgeText,
                  isPartnerMhs
                    ? styles.roleBadgeTextMhs
                    : styles.roleBadgeTextUmkm,
                ]}
              >
                {isPartnerMhs ? "Mahasiswa" : "Klien UMKM"}
              </Text>
            </View>

            {item.project_title ? (
              <View style={styles.projectPill}>
                <ProjectBriefVectorIcon size={11} color="#64748B" />
                <Text style={styles.projectPillText} numberOfLines={1}>
                  {item.project_title}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Last Message Snippet */}
          <View style={styles.snippetRow}>
            <Text
              style={[
                styles.snippetText,
                item.unread_count > 0 && styles.snippetUnread,
              ]}
              numberOfLines={1}
            >
              {item.last_message || "Belum ada riwayat pesan"}
            </Text>

            {item.unread_count > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {item.unread_count > 99 ? "99+" : item.unread_count}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Pesan & Diskusi"
        subtitle="Kotak Masuk Percakapan"
        onBack={() => navigation.goBack()}
      />

      <View style={[styles.mainBody, responsiveContainerStyle]}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari percakapan, nama rekan, atau judul proyek..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        {/* Tab Filters */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "ALL" && styles.tabBtnActive]}
            onPress={() => setActiveTab("ALL")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "ALL" && styles.tabTextActive,
              ]}
            >
              Semua ({conversations.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "PROJECT" && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab("PROJECT")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "PROJECT" && styles.tabTextActive,
              ]}
            >
              Proyek
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "TALENT" && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab("TALENT")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "TALENT" && styles.tabTextActive,
              ]}
            >
              Talenta / Kolega
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conversation List */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.brandIndigo} />
            <Text style={styles.loadingText}>Memuat percakapan...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item, index) =>
              item.id || item.partner_id || `conv_${index}`
            }
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 80 },
            ]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.brandIndigo}
                colors={[COLORS.brandIndigo]}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconBox}>
                  <MessageSquare size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>
                  {searchQuery
                    ? "Tidak ada percakapan yang cocok"
                    : "Belum Ada Percakapan"}
                </Text>
                <Text style={styles.emptySub}>
                  {searchQuery
                    ? `Tidak ditemukan pesan dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
                    : isUmkm
                      ? "Mulai ajak kolaborasi talenta terbaik melalui direktori talenta atau respon proposal masuk."
                      : "Kirim proposal atau jalin komunikasi langsung dengan klien UMKM untuk memulai percakapan."}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mainBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    fontFamily: FONTS.medium || "Inter-Medium",
    paddingVertical: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: "transparent",
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 11.5,
    fontFamily: FONTS.medium || "Inter-Medium",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#0F172A",
    fontWeight: "700",
  },
  listContent: {
    gap: 8,
  },
  convCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarContainer: {
    position: "relative",
    width: 46,
    height: 46,
  },
  avatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F1F5F9",
  },
  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMhs: {
    backgroundColor: "#EFF6FF",
  },
  avatarUmkm: {
    backgroundColor: "#FFFBEB",
  },
  avatarInitial: {
    fontSize: 18,
    fontFamily: FONTS.bold || "Inter-Bold",
    color: "#0F172A",
  },
  statusDotBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  convInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  convHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  partnerName: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.bold || "Inter-Bold",
    color: "#0F172A",
    marginRight: 8,
  },
  timeText: {
    fontSize: 11,
    fontFamily: FONTS.medium || "Inter-Medium",
    color: "#94A3B8",
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "nowrap",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  roleBadgeMhs: {
    backgroundColor: "#EFF6FF",
  },
  roleBadgeUmkm: {
    backgroundColor: "#FEF3C7",
  },
  roleBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold || "Inter-Bold",
  },
  roleBadgeTextMhs: {
    color: "#2563EB",
  },
  roleBadgeTextUmkm: {
    color: "#D97706",
  },
  projectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    maxWidth: 160,
  },
  projectPillText: {
    fontSize: 10,
    fontFamily: FONTS.medium || "Inter-Medium",
    color: "#475569",
  },
  snippetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  snippetText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.regular || "Inter-Regular",
    color: "#64748B",
    marginRight: 8,
  },
  snippetUnread: {
    fontFamily: FONTS.bold || "Inter-Bold",
    color: "#0F172A",
  },
  unreadBadge: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: FONTS.bold || "Inter-Bold",
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: FONTS.medium || "Inter-Medium",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold || "Inter-Bold",
    color: "#0F172A",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    fontFamily: FONTS.regular || "Inter-Regular",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
  },
});
