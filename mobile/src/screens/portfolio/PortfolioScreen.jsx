import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { MobileCertificateModal } from "../../components/features/certificates/MobileCertificateModal";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { certificateApi, ratingApi, projectApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Building2,
  Share2,
  Briefcase,
  MessageSquare,
  Coins,
  ArrowRight,
} from "lucide-react-native";

export function PortfolioScreen({ navigation }) {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();
  const { isLandscape, isCompact, responsiveContainerStyle } =
    useResponsiveLayout();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const [activeTab, setActiveTab] = useState("certs"); // 'certs' | 'reviews'
  const [certificates, setCertificates] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [certModalVisible, setCertModalVisible] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      if (isMahasiswa) {
        const [certsRes, ratingsRes] = await Promise.all([
          certificateApi.getMy().catch(() => ({ data: [] })),
          ratingApi.getByUser(user.id).catch(() => ({ data: [] })),
        ]);
        setCertificates(Array.isArray(certsRes.data) ? certsRes.data : []);
        setRatings(Array.isArray(ratingsRes.data) ? ratingsRes.data : []);
      } else {
        const [projectsRes, ratingsRes] = await Promise.all([
          projectApi.getMyProjects().catch(() => ({ data: [] })),
          ratingApi.getByUser(user.id).catch(() => ({ data: [] })),
        ]);
        setMyProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setRatings(Array.isArray(ratingsRes.data) ? ratingsRes.data : []);
      }
    } catch (err) {
      console.error("Gagal memuat portofolio:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSharePortfolio = async () => {
    const portfolioUrl = `https://makarya.id/talents/${user?.id}`;
    try {
      await Share.share({
        title: `Portofolio Digital ${user?.nama_lengkap || user?.nama || "Talenta"} - Makarya`,
        message: `Lihat profil portofolio dan sertifikat proyek industri terverifikasi milik ${
          user?.nama_lengkap || user?.nama || "Talenta"
        } di Makarya: ${portfolioUrl}`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleShowcase = async (cert) => {
    try {
      setTogglingId(cert.id);
      const updatedStatus = !cert.is_showcase;
      const res = await certificateApi.toggleShowcase(cert.id, {
        is_showcase: updatedStatus,
      });
      setCertificates((prev) =>
        prev.map((c) => (c.id === cert.id ? res.data : c)),
      );
      showToast(
        updatedStatus
          ? "Sertifikat ditampilkan di profil publik!"
          : "Sertifikat disembunyikan dari profil publik.",
        "success",
      );
    } catch (err) {
      showToast("Gagal memperbarui status visibilitas.", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, r) => acc + (r.skor_bintang || 5), 0) /
          ratings.length
        ).toFixed(1)
      : user?.rating_rata_rata || "5.0";

  const publicShowcaseCount = certificates.filter((c) => c.is_showcase).length;

  return (
    <View style={styles.screen}>
      <OrganicRibbonBackground />

      <Header
        title="Portofolio & Reputasi"
        subtitle={
          isMahasiswa
            ? "Showcase karya dan kredensial resmi"
            : "Rekam jejak kepuasan proyek mitra UMKM"
        }
        showBack
        onBack={() => navigation.goBack()}
        rightIcon={<Share2 size={18} color="#0F172A" />}
        onRightPress={handleSharePortfolio}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isCompact && { paddingHorizontal: 14 },
          isLandscape && { paddingVertical: 10 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.brandIndigo || "#0F172A"]}
            tintColor={COLORS.brandIndigo || "#0F172A"}
          />
        }
      >
        <View style={responsiveContainerStyle}>
          {/* 1. Hero Summary Barometer Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <ShieldCheck size={13} color="#0F172A" />
                <Text style={styles.heroBadgeText}>
                  {isMahasiswa
                    ? "Kredensial Portofolio Resmi"
                    : "Pusat Reputasi Mitra"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSharePortfolio}
                style={styles.shareIconBtn}
                activeOpacity={0.7}
              >
                <Share2 size={13} color={COLORS.brandIndigo} />
                <Text style={styles.shareIconBtnText}>Bagikan</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.heroTitle}>
              {user?.nama_lengkap ||
                user?.nama_usaha ||
                user?.nama ||
                "Talenta"}
            </Text>
            <Text style={styles.heroSubtitle}>
              {isMahasiswa
                ? `${user?.universitas || "Kampus Terdaftar"} • ${user?.prodi || "Talenta Industri"}`
                : `${user?.bidang_industri || "Mitra UMKM"} • ${user?.kota || "Indonesia"}`}
            </Text>

            {/* Metrics Row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricVal}>
                  {isMahasiswa
                    ? certificates.length
                    : myProjects.length || user?.total_proyek_diterbitkan || 0}
                </Text>
                <Text style={styles.metricLbl}>
                  {isMahasiswa ? "Karya Selesai" : "Total Proyek"}
                </Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricCol}>
                <View style={styles.scoreRow}>
                  <CheckCircle2 size={13} color={COLORS.success} />
                  <Text style={[styles.metricVal, { color: "#0F172A" }]}>
                    {averageRating}
                  </Text>
                </View>
                <Text style={styles.metricLbl}>
                  {ratings.length > 0
                    ? `Kepuasan (${ratings.length})`
                    : "Skor Kepuasan"}
                </Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricCol}>
                <Text style={[styles.metricVal, { color: COLORS.success }]}>
                  {user?.escrow_success_rate || "100%"}
                </Text>
                <Text style={styles.metricLbl}>Sukses Escrow</Text>
              </View>
            </View>
          </View>

          {/* 2. Modern Segmented Tab Switcher */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "certs" && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab("certs")}
              activeOpacity={0.8}
            >
              <Briefcase
                size={14}
                color={
                  activeTab === "certs" ? COLORS.brandIndigo : COLORS.textMuted
                }
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === "certs" && styles.tabBtnTextActive,
                ]}
              >
                {isMahasiswa ? "Sertifikat & Karya" : "Riwayat Proyek"} (
                {isMahasiswa ? certificates.length : myProjects.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === "reviews" && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab("reviews")}
              activeOpacity={0.8}
            >
              <MessageSquare
                size={14}
                color={
                  activeTab === "reviews"
                    ? COLORS.brandIndigo
                    : COLORS.textMuted
                }
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === "reviews" && styles.tabBtnTextActive,
                ]}
              >
                Ulasan Klien ({ratings.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3. TAB CONTENT */}
          {loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="small" color={COLORS.brandIndigo} />
              <Text style={styles.loaderText}>Memuat lembar portofolio...</Text>
            </View>
          ) : activeTab === "certs" ? (
            /* TAB 1: CERTIFICATES & DELIVERABLES */
            <View style={{ gap: 12 }}>
              {isMahasiswa && certificates.length > 0 && (
                <View style={styles.showcaseInfoRow}>
                  <View style={styles.showcasePill}>
                    <Eye size={12} color={COLORS.success} />
                    <Text style={styles.showcasePillText}>
                      {publicShowcaseCount} dari {certificates.length} tampil di
                      profil publik
                    </Text>
                  </View>
                  <Text style={styles.showcaseHint}>
                    Atur visibilitas karya
                  </Text>
                </View>
              )}

              {isMahasiswa ? (
                certificates.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <View style={styles.emptyIconCircle}>
                      <Briefcase size={26} color={COLORS.brandIndigo} />
                    </View>
                    <Text style={styles.emptyTitle}>
                      Belum Ada Sertifikat Terbit
                    </Text>
                    <Text style={styles.emptyDesc}>
                      Selesaikan penugasan proyek pertama Anda bersama mitra
                      UMKM untuk mendapatkan sertifikat resmi dan portofolio
                      industri.
                    </Text>
                    <TouchableOpacity
                      style={styles.emptyCta}
                      onPress={() => navigation.navigate("ProjectsTab")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.emptyCtaText}>
                        Jelajahi Proyek Tersedia
                      </Text>
                      <ArrowRight size={14} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  certificates.map((cert) => {
                    const hasDeliverable = Boolean(cert.deliverable_url);
                    const isToggling = togglingId === cert.id;

                    return (
                      <View key={cert.id} style={styles.certCard}>
                        {/* Header: Role Tag on left, Honor on right */}
                        <View style={styles.certCardHeader}>
                          <View style={styles.roleTag}>
                            <Text style={styles.roleTagText} numberOfLines={1}>
                              {cert.role_name}
                            </Text>
                          </View>
                          <View style={styles.honorPill}>
                            <Coins size={12} color="#059669" />
                            <Text
                              style={styles.honorPillText}
                              numberOfLines={1}
                            >
                              {formatCurrency(
                                cert.honor_amount || cert.slot_budget || 0,
                              )}
                            </Text>
                          </View>
                        </View>

                        {/* Title & Client */}
                        <Text style={styles.certTitle}>
                          {cert.project_title}
                        </Text>

                        <View style={styles.clientMetaRow}>
                          <Building2 size={13} color={COLORS.textMuted} />
                          <Text style={styles.clientMetaText} numberOfLines={1}>
                            Klien UMKM:{" "}
                            <Text style={styles.boldText}>
                              {cert.client_name}
                            </Text>
                          </Text>
                        </View>

                        {/* Credential ID & Team Meta Bar */}
                        <View style={styles.certMetaRow}>
                          <Text style={styles.credIdText} numberOfLines={1}>
                            Kredensial: {cert.credential_id}
                          </Text>
                          {cert.collaboration_type === "TIM" && (
                            <View style={styles.teamTypePill}>
                              <Text style={styles.teamTypePillText}>Tim</Text>
                            </View>
                          )}
                        </View>

                        {/* External Deliverable Link */}
                        {hasDeliverable && (
                          <TouchableOpacity
                            style={styles.deliverableLinkBtn}
                            onPress={() =>
                              Linking.openURL(cert.deliverable_url)
                            }
                            activeOpacity={0.7}
                          >
                            <ExternalLink
                              size={12}
                              color={COLORS.brandIndigo}
                            />
                            <Text
                              style={styles.deliverableLinkText}
                              numberOfLines={1}
                            >
                              Lihat Hasil Karya Deliverable Proyek
                            </Text>
                          </TouchableOpacity>
                        )}

                        {/* Actions Footer */}
                        <View style={styles.certFooter}>
                          <TouchableOpacity
                            onPress={() => handleToggleShowcase(cert)}
                            style={[
                              styles.showcaseBtn,
                              cert.is_showcase
                                ? styles.showcaseBtnActive
                                : styles.showcaseBtnInactive,
                            ]}
                            disabled={isToggling}
                            activeOpacity={0.8}
                          >
                            {isToggling ? (
                              <ActivityIndicator
                                size="small"
                                color={COLORS.brandIndigo}
                              />
                            ) : cert.is_showcase ? (
                              <>
                                <Eye size={12} color={COLORS.success} />
                                <Text style={styles.showcaseBtnTextActive}>
                                  Tampil Publik
                                </Text>
                              </>
                            ) : (
                              <>
                                <EyeOff size={12} color={COLORS.textMuted} />
                                <Text style={styles.showcaseBtnTextInactive}>
                                  Disembunyikan
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setSelectedCert(cert);
                              setCertModalVisible(true);
                            }}
                            style={styles.viewModalBtn}
                            activeOpacity={0.8}
                          >
                            <Award size={13} color="#FFF" />
                            <Text style={styles.viewModalBtnText}>
                              Buka Sertifikat
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )
              ) : /* UMKM: Riwayat Proyek */
              myProjects.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>
                    Belum Ada Proyek Diterbitkan
                  </Text>
                  <Text style={styles.emptyDesc}>
                    Terbitkan kebutuhan proyek Anda untuk mulai berkolaborasi
                    dengan talenta mahasiswa terpilih.
                  </Text>
                </View>
              ) : (
                myProjects.map((p) => (
                  <View key={p.id} style={styles.certCard}>
                    <View style={styles.certCardHeader}>
                      <View style={styles.roleTag}>
                        <Text style={styles.roleTagText}>{p.kategori}</Text>
                      </View>
                      <Text style={styles.credIdText}>
                        {formatDate(p.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.certTitle}>{p.judul}</Text>
                    <View style={styles.honorBadgeBar}>
                      <View style={styles.honorPill}>
                        <Coins size={12} color="#059669" />
                        <Text style={styles.honorPillText}>
                          Pagu: {formatCurrency(p.budget_max)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            /* TAB 2: REVIEWS & TESTIMONIALS */
            <View style={{ gap: 12 }}>
              {ratings.length === 0 ? (
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconCircle}>
                    <MessageSquare size={26} color={COLORS.brandIndigo} />
                  </View>
                  <Text style={styles.emptyTitle}>Belum Ada Ulasan</Text>
                  <Text style={styles.emptyDesc}>
                    Ulasan kepuasan dan penilaian dari mitra industri akan
                    muncul di sini setelah proyek disetujui.
                  </Text>
                </View>
              ) : (
                ratings.map((r, rIdx) => (
                  <View key={r.id || rIdx} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>
                          {(r.reviewer_name || "M").charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewerName} numberOfLines={1}>
                          {r.reviewer_name || "Mitra Klien UMKM"}
                        </Text>
                        <Text
                          style={styles.reviewProjectName}
                          numberOfLines={1}
                        >
                          {r.project_title || "Proyek Kolaborasi Makarya"}
                        </Text>
                      </View>

                      <View style={styles.scorePill}>
                        <CheckCircle2 size={11} color="#059669" />
                        <Text style={styles.scorePillText}>
                          {r.skor_bintang || 5}.0
                        </Text>
                      </View>
                    </View>

                    {r.catatan_ulasan ? (
                      <View style={styles.reviewQuoteBox}>
                        <Text style={styles.reviewQuoteText}>
                          "{r.catatan_ulasan}"
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.reviewFooter}>
                      <View style={styles.verifiedReviewBadge}>
                        <CheckCircle2 size={11} color={COLORS.success} />
                        <Text style={styles.verifiedReviewText}>
                          Ulasan Resmi Terverifikasi Escrow
                        </Text>
                      </View>
                      <Text style={styles.reviewDate}>
                        {formatDate(r.created_at)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Full Certificate Details Modal */}
      <MobileCertificateModal
        visible={certModalVisible}
        certificate={selectedCert}
        onClose={() => {
          setCertModalVisible(false);
          setSelectedCert(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgDark || "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.95)",
    padding: 16,
    gap: 10,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  shareIconBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
  },
  shareIconBtnText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 17,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  heroSubtitle: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metricCol: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  metricVal: {
    fontSize: 15,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  metricLbl: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricDivider: {
    width: 1,
    height: 26,
    backgroundColor: "#E2E8F0",
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "rgba(241, 245, 249, 0.95)",
    borderRadius: 13,
    padding: 3,
    gap: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  tabBtnTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  showcaseInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 2,
  },
  showcasePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  showcasePillText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyMedium,
    color: "#047857",
  },
  showcaseHint: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  certCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.95)",
    padding: 13,
    gap: 7,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  certCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  roleTag: {
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    maxWidth: "55%",
  },
  roleTagText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  certMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 2,
  },
  credIdText: {
    fontSize: 9.5,
    fontFamily: FONTS.mono || FONTS.bodyRegular,
    color: COLORS.textMuted,
    flex: 1,
  },
  certTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    lineHeight: 18,
    fontWeight: "700",
  },
  clientMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  clientMetaText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    flex: 1,
  },
  boldText: {
    fontFamily: FONTS.bodyBold,
    color: "#1E293B",
    fontWeight: "700",
  },
  honorBadgeBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  honorPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  honorPillText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#047857",
    fontWeight: "700",
  },
  teamTypePill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  teamTypePillText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyMedium,
    color: "#475569",
    fontWeight: "600",
  },
  deliverableLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
  },
  deliverableLinkText: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.brandIndigo,
    textDecorationLine: "underline",
    flex: 1,
  },
  certFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 9,
    marginTop: 3,
    gap: 8,
  },
  showcaseBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    borderRadius: 8,
  },
  showcaseBtnActive: {
    backgroundColor: "#ECFDF5",
  },
  showcaseBtnInactive: {
    backgroundColor: "#F1F5F9",
  },
  showcaseBtnTextActive: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  showcaseBtnTextInactive: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  viewModalBtn: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 6.5,
    borderRadius: 8,
  },
  viewModalBtnText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.95)",
    padding: 13,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  reviewerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewerInitial: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  reviewerName: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  reviewProjectName: {
    fontSize: 10,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  scorePillText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyBold,
    color: "#047857",
    fontWeight: "700",
  },
  reviewQuoteBox: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 9,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brandIndigo,
  },
  reviewQuoteText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#334155",
    fontStyle: "italic",
    lineHeight: 16,
  },
  reviewFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 8,
  },
  verifiedReviewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  verifiedReviewText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.success,
  },
  reviewDate: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  emptyTitle: {
    fontSize: 14.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  emptyDesc: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
  emptyCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 15,
    paddingVertical: 8.5,
    borderRadius: 10,
    marginTop: 6,
  },
  emptyCtaText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  loaderWrap: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
  },
  loaderText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
  },
});
