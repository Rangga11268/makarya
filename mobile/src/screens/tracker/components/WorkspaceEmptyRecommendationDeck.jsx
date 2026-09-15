import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { projectApi } from "../../../api";
import { formatCurrency } from "../../../utils/formatCurrency";
import { PebbleButton } from "../../../components/ui/PebbleButton";
import { renderProjectCategoryVectorIcon } from "../../../components/icons/CategoryIcons";
import {
  WorkspaceDeskVectorIcon,
  ContractHubVectorIcon,
} from "../../../components/icons/WorkspaceVectorIcons";
import {
  Compass,
  ArrowRight,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  Plus,
} from "lucide-react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(WINDOW_WIDTH * 0.78, 300);
const CARD_GAP = 14;

const FALLBACK_PROJECTS = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    judul: "Redesign Landing Page & Reservasi Meja Resto Kopi",
    deskripsi_raw:
      "Kami mencari mahasiswa desainer web & frontend untuk merombak tampilan landing page dan sistem reservasi meja digital agar lebih modern dan mobile friendly.",
    kategori: "PEMROGRAMAN",
    budget_max: 1500000,
    tipe_kolaborasi: "TIM",
    slots: [
      {
        id: "slot-1",
        nama_peran: "UI/UX Designer",
        alokasi_budget: 650000,
        status: "OPEN",
      },
      {
        id: "slot-2",
        nama_peran: "Frontend Developer",
        alokasi_budget: 850000,
        status: "OPEN",
      },
    ],
    umkm_nama: "Kopi Kenangan Nusantara",
    umkm_profile: {
      kota: "Jakarta Selatan",
      nama_usaha: "Kopi Kenangan Nusantara",
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    judul: "Desain UI/UX Mobile App Kasir & Manajemen Stok UMKM",
    deskripsi_raw:
      "Dibutuhkan desain UI/UX untuk aplikasi kasir Android UMKM dengan alur transaksi cepat dan laporan inventaris harian.",
    kategori: "UIUX",
    budget_max: 1200000,
    tipe_kolaborasi: "INDIVIDU",
    umkm_nama: "Toko Sembako Berkah",
    umkm_profile: { kota: "Bandung", nama_usaha: "Toko Sembako Berkah" },
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    judul: "Branding Visual, Logo & Kemasan Produk Sambal Kemasan",
    deskripsi_raw:
      "Revitalisasi logo kemasan botol sambal dan pembuatan panduan warna brand untuk produk sambal tradisional rumahan.",
    kategori: "DESIGN",
    budget_max: 850000,
    tipe_kolaborasi: "INDIVIDU",
    umkm_nama: "Dapur Pedas Bu Ani",
    umkm_profile: { kota: "Surabaya", nama_usaha: "Dapur Pedas Bu Ani" },
  },
];

const getCategoryLabel = (cat) => {
  switch (cat) {
    case "DESIGN":
      return "Desain Grafis";
    case "UIUX":
      return "UI/UX Design";
    case "PEMROGRAMAN":
      return "Web & Coding";
    case "VIDEO":
      return "Video & Reels";
    case "COPYWRITING":
      return "Copywriting";
    case "ADMIN_DATA":
      return "Admin & Data";
    default:
      return cat || "Proyek Digital";
  }
};

export function WorkspaceEmptyRecommendationDeck({
  navigation,
  isMahasiswa = true,
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await projectApi.getAll({ limit: 6, status: "OPEN" });
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.items)
            ? res.data.items
            : [];
        if (isMounted) {
          if (items.length > 0) {
            setProjects(items);
          } else {
            setProjects(FALLBACK_PROJECTS);
          }
        }
      } catch (e) {
        if (isMounted) {
          setProjects(FALLBACK_PROJECTS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecommendations();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(index);
  };

  // Tampilan khusus UMKM baru
  if (!isMahasiswa) {
    return (
      <View style={styles.container}>
        <View style={styles.activationCard}>
          <View style={styles.iconCircleBadge}>
            <ContractHubVectorIcon
              size={22}
              color={COLORS.brandIndigo}
              secondaryColor="#3B82F6"
            />
          </View>
          <Text style={styles.activationTitle}>
            Mulai Kolaborasi Pertama Anda
          </Text>
          <Text style={styles.activationDesc}>
            Ruang Kerja ini akan otomatis memantau progress pengerjaan, berkas
            deliverable, dan chat langsung begitu Anda menyetujui proposal
            mahasiswa.
          </Text>
          <PebbleButton
            variant="sapphire"
            size="md"
            label="Pasang Proyek Baru Sekarang"
            icon={Plus}
            onPress={() => navigation.navigate("PostProject")}
            style={{ marginTop: 14 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Activation Onboarding Card */}
      <View style={styles.activationCard}>
        <View style={styles.activationHeaderRow}>
          <View style={styles.iconCircleBadge}>
            <WorkspaceDeskVectorIcon
              size={20}
              color="#2563EB"
              secondaryColor="#60A5FA"
            />
          </View>
          <View style={styles.activationHeaderTextCol}>
            <Text style={styles.activationGreeting}>Ruang Kerja Baru</Text>
            <Text style={styles.activationTitle}>Belum Ada Kontrak Aktif</Text>
          </View>
        </View>
        <Text style={styles.activationDesc}>
          Ruang ini akan memantau jadwal pengerjaan, ruang chat, dan pencairan
          honor setelah lamaran Anda disetujui klien UMKM. Mulai dengan melamar
          proyek rekomendasi di bawah!
        </Text>
      </View>

      {/* 2. Recommendation Section Heading */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Peluang Pilihan untuk Anda</Text>
          <Text style={styles.sectionSubtitle}>
            Geser kartu untuk melihat proyek yang sedang merekrut
          </Text>
        </View>
        <View style={styles.escrowSafeBadge}>
          <ShieldCheck size={12} color="#059669" />
          <Text style={styles.escrowSafeBadgeText}>100% Escrow</Text>
        </View>
      </View>

      {/* 3. Interactive Horizontal Slider Carousel */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={COLORS.brandIndigo} />
          <Text style={styles.loadingText}>Memuat rekomendasi proyek...</Text>
        </View>
      ) : (
        <View>
          <FlatList
            ref={flatListRef}
            data={projects}
            keyExtractor={(item, index) => String(item.id || index)}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            snapToAlignment="start"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carouselContainer}
            renderItem={({ item }) => {
              const isTeam =
                item.tipe_kolaborasi === "TIM" ||
                (Array.isArray(item.slots) && item.slots.length > 1);
              const clientName =
                item.umkm_nama ||
                item.umkm_profile?.nama_usaha ||
                item.client_name ||
                "Klien UMKM";
              const clientCity = item.umkm_profile?.kota || "Indonesia";
              const clientPhoto =
                item.umkm_profile?.url_foto_usaha ||
                item.umkm_profile?.url_foto ||
                item.url_foto;

              return (
                <TouchableOpacity
                  activeOpacity={0.88}
                  style={styles.deckCard}
                  onPress={() =>
                    navigation.navigate("ProjectDetail", {
                      id: item.id,
                      projectId: item.id,
                      initialProject: item,
                    })
                  }
                >
                  {/* Card Header: Category & Collab Type */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardCategoryPill}>
                      {renderProjectCategoryVectorIcon(
                        item.kategori,
                        item.judul,
                        11,
                        COLORS.brandIndigo,
                      )}
                      <Text style={styles.cardCategoryText}>
                        {getCategoryLabel(item.kategori)}
                      </Text>
                    </View>

                    {isTeam ? (
                      <View style={styles.teamBadge}>
                        <Users size={10} color="#6D28D9" />
                        <Text style={styles.teamBadgeText}>Tim</Text>
                      </View>
                    ) : (
                      <Text style={styles.individualText}>Individu</Text>
                    )}
                  </View>

                  {/* Project Title */}
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.judul}
                  </Text>

                  {/* Client Info */}
                  <View style={styles.clientRow}>
                    {clientPhoto ? (
                      <Image
                        source={{ uri: clientPhoto }}
                        style={styles.clientAvatar}
                      />
                    ) : (
                      <View style={styles.clientAvatarFallback}>
                        <Building2 size={11} color={COLORS.brandIndigo} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.clientNameText} numberOfLines={1}>
                        {clientName}
                      </Text>
                      <Text style={styles.clientCityText} numberOfLines={1}>
                        {clientCity}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Card Footer: Budget & CTA Button */}
                  <View style={styles.cardFooterRow}>
                    <View>
                      <Text style={styles.budgetLabel}>Pagu Honor</Text>
                      <Text style={styles.budgetValue}>
                        {formatCurrency(item.budget_max)}
                      </Text>
                    </View>

                    <PebbleButton
                      variant="sapphire"
                      size="xs"
                      label="Lamar"
                      iconRight={ArrowRight}
                      onPress={() =>
                        navigation.navigate("ProjectDetail", {
                          id: item.id,
                          projectId: item.id,
                        })
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* 4. Pagination Dots Indicator */}
          {projects.length > 1 && (
            <View style={styles.paginationRow}>
              {projects.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.paginationDot,
                    i === activeIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* 5. Bottom Secondary Navigation Link */}
      <View style={styles.bottomNavBox}>
        <TouchableOpacity
          style={styles.exploreCatalogBtn}
          onPress={() => navigation.navigate("ProjectsTab")}
          activeOpacity={0.8}
        >
          <Compass size={16} color={COLORS.brandIndigo} />
          <Text style={styles.exploreCatalogBtnText}>
            Jelajahi Semua Proyek di Katalog
          </Text>
          <ArrowRight size={14} color={COLORS.brandIndigo} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  activationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  iconCircleBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  activationHeaderTextCol: {
    flex: 1,
  },
  activationGreeting: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  activationTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 14.5,
    color: COLORS.textDark,
  },
  activationDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 14,
    color: COLORS.textDark,
  },
  sectionSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  escrowSafeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  escrowSafeBadgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#059669",
  },
  carouselContainer: {
    paddingRight: 20,
    paddingBottom: 8,
  },
  deckCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginRight: CARD_GAP,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    justifyContent: "space-between",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardCategoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  cardCategoryText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.brandIndigo,
  },
  teamBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  teamBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9.5,
    color: "#6D28D9",
  },
  individualText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  cardTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 13.5,
    color: COLORS.textDark,
    lineHeight: 18.5,
    marginBottom: 10,
    height: 38,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  clientAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
  },
  clientAvatarFallback: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  clientNameText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  clientCityText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9.5,
    color: COLORS.textMuted,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  budgetLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9.5,
    color: COLORS.textMuted,
  },
  budgetValue: {
    fontFamily: FONTS.headingBold,
    fontSize: 13.5,
    color: COLORS.textDark,
    fontVariant: ["tabular-nums"],
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 10,
    marginBottom: 14,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(15, 23, 42, 0.15)",
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: COLORS.brandIndigo,
  },
  bottomNavBox: {
    alignItems: "center",
    marginTop: 6,
  },
  exploreCatalogBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  exploreCatalogBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
  },
  loadingBox: {
    padding: 30,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
