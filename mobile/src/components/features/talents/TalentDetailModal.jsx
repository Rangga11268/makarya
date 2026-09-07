import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import {
  X,
  Star,
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from "lucide-react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import {
  GithubVectorIcon,
  FigmaVectorIcon,
  GlobeVectorIcon,
  LinkedinVectorIcon,
} from "../../icons/ProfileVectorIcons";

export function TalentDetailModal({
  visible,
  onClose,
  talent,
  openUrl,
  onInvite,
}) {
  if (!talent) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalCard}>
          <View style={styles.detailModalHeader}>
            <Text style={styles.detailModalTitle}>Portofolio & Kredensial</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeCircleBtn}
              activeOpacity={0.7}
            >
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.detailScrollContent}
          >
            <View style={styles.detailProfileTop}>
              {talent.url_foto ? (
                <Image
                  source={{ uri: talent.url_foto }}
                  style={styles.detailAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.detailAvatarBox}>
                  <Text style={styles.detailAvatarLetter}>
                    {talent.nama_lengkap
                      ? talent.nama_lengkap.charAt(0).toUpperCase()
                      : "M"}
                  </Text>
                </View>
              )}

              <View style={styles.detailInfoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.detailNameText}>
                    {talent.nama_lengkap}
                  </Text>
                  <CheckCircle2 size={16} color={COLORS.success} />
                </View>
                <Text style={styles.detailProdiText}>
                  {talent.prodi || "Sistem Informasi"}
                  {talent.semester ? ` • Semester ${talent.semester}` : ""}
                </Text>
                {talent.nim ? (
                  <Text style={styles.detailNimText}>
                    NIM: {talent.nim} • Universitas BSI
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Metrics Summary */}
            <View style={styles.detailBadgesRow}>
              <View style={styles.detailBadgeItem}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.detailBadgeValue}>
                  {talent.rating_avg != null
                    ? Number(talent.rating_avg).toFixed(1)
                    : "-"}
                </Text>
                <Text style={styles.detailBadgeLabel}>Skor Reputasi</Text>
              </View>

              <View style={styles.detailBadgeItem}>
                <Award size={14} color={COLORS.brandIndigo} />
                <Text style={styles.detailBadgeValue}>
                  {talent.total_proyek_selesai ?? 0}
                </Text>
                <Text style={styles.detailBadgeLabel}>Proyek Tuntas</Text>
              </View>

              <View style={styles.detailBadgeItem}>
                <ShieldCheck size={14} color={COLORS.success} />
                <Text
                  style={[styles.detailBadgeValue, { color: COLORS.success }]}
                >
                  {talent.escrow_success_rate || "100%"}
                </Text>
                <Text style={styles.detailBadgeLabel}>Sukses Escrow</Text>
              </View>
            </View>

            {/* Bio Summary */}
            <View style={styles.detailSectionBox}>
              <Text style={styles.detailSectionHeading}>
                Ringkasan Profesional
              </Text>
              <Text style={styles.detailBioBody}>
                {talent.bio ||
                  "Mahasiswa aktif berfokus pada pengembangan produk digital & desain solutif untuk kemitraan UMKM."}
              </Text>
            </View>

            {/* Skills */}
            {Array.isArray(talent.skills) && talent.skills.length > 0 && (
              <View style={styles.detailSectionBox}>
                <Text style={styles.detailSectionHeading}>
                  Keahlian & Kemampuan
                </Text>
                <View style={styles.skillsRow}>
                  {talent.skills.map((skill, idx) => (
                    <View key={idx} style={styles.detailSkillPill}>
                      <Text style={styles.detailSkillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Portfolio Links */}
            <View style={styles.detailSectionBox}>
              <Text style={styles.detailSectionHeading}>
                Tautan Karya & Portofolio
              </Text>
              <View style={styles.portfolioLinksGrid}>
                {talent.github_url ? (
                  <TouchableOpacity
                    style={styles.portfolioLinkCard}
                    onPress={() => openUrl(talent.github_url)}
                    activeOpacity={0.7}
                  >
                    <GithubVectorIcon size={18} color={COLORS.textDark} />
                    <Text style={styles.portfolioLinkLabel}>
                      GitHub Profile
                    </Text>
                    <ExternalLink size={12} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ) : null}

                {talent.figma_url ? (
                  <TouchableOpacity
                    style={styles.portfolioLinkCard}
                    onPress={() => openUrl(talent.figma_url)}
                    activeOpacity={0.7}
                  >
                    <FigmaVectorIcon size={18} color={COLORS.brandIndigo} />
                    <Text style={styles.portfolioLinkLabel}>
                      Figma Portofolio
                    </Text>
                    <ExternalLink size={12} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ) : null}

                {talent.website_url ? (
                  <TouchableOpacity
                    style={styles.portfolioLinkCard}
                    onPress={() => openUrl(talent.website_url)}
                    activeOpacity={0.7}
                  >
                    <GlobeVectorIcon size={18} color={COLORS.brandCyan} />
                    <Text style={styles.portfolioLinkLabel}>
                      Website Portofolio
                    </Text>
                    <ExternalLink size={12} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ) : null}

                {talent.linkedin_url ? (
                  <TouchableOpacity
                    style={styles.portfolioLinkCard}
                    onPress={() => openUrl(talent.linkedin_url)}
                    activeOpacity={0.7}
                  >
                    <LinkedinVectorIcon size={18} color="#0A66C2" />
                    <Text style={styles.portfolioLinkLabel}>
                      LinkedIn Profile
                    </Text>
                    <ExternalLink size={12} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ) : null}

                {!talent.github_url &&
                  !talent.figma_url &&
                  !talent.website_url &&
                  !talent.linkedin_url && (
                    <Text style={styles.emptyMetaText}>
                      Tautan portofolio publik belum dicantumkan.
                    </Text>
                  )}
              </View>
            </View>

            {/* Recent Reviews */}
            {Array.isArray(talent.recent_reviews) &&
              talent.recent_reviews.length > 0 && (
                <View style={styles.detailSectionBox}>
                  <Text style={styles.detailSectionHeading}>
                    Ulasan Kepuasan Klien ({talent.recent_reviews.length})
                  </Text>
                  <View style={styles.reviewsListWrap}>
                    {talent.recent_reviews.map((rev, idx) => (
                      <View key={idx} style={styles.reviewItemCard}>
                        <View style={styles.reviewTopRow}>
                          <Text style={styles.reviewClientName}>
                            {rev.reviewer_name || "Klien UMKM Terverifikasi"}
                          </Text>
                          <View style={styles.reviewStarRow}>
                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                            <Text style={styles.reviewScoreText}>
                              {rev.rating || 5}.0
                            </Text>
                          </View>
                        </View>
                        {rev.project_title && (
                          <Text style={styles.reviewProjectTitle}>
                            Proyek: {rev.project_title}
                          </Text>
                        )}
                        <Text style={styles.reviewCommentText}>
                          "{rev.komentar}"
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
          </ScrollView>

          {/* Modal Bottom CTA */}
          <View style={styles.detailModalFooter}>
            <TouchableOpacity
              style={styles.modalPrimaryActionBtn}
              onPress={() => {
                onClose();
                if (talent && onInvite) onInvite(talent);
              }}
              activeOpacity={0.85}
            >
              <MessageSquare size={16} color="#FFFFFF" />
              <Text style={styles.modalPrimaryActionBtnText}>
                Ajak Kolaborasi Proyek
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  detailModalCard: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
  },
  detailModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  detailModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  detailScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  detailProfileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  detailAvatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  detailAvatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.canvasSoft,
  },
  detailAvatarLetter: {
    fontSize: 22,
    fontFamily: FONTS.displayBold,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  detailInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailNameText: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  detailProdiText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.brandCyan,
    marginTop: 2,
  },
  detailNimText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  detailBadgesRow: {
    flexDirection: "row",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  detailBadgeItem: {
    flex: 1,
    alignItems: "center",
  },
  detailBadgeValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    marginVertical: 2,
  },
  detailBadgeLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  detailSectionBox: {
    marginBottom: 16,
  },
  detailSectionHeading: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  detailBioBody: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  detailSkillPill: {
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  detailSkillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.brandIndigo,
  },
  portfolioLinksGrid: {
    gap: 8,
  },
  portfolioLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  portfolioLinkLabel: {
    flex: 1,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  emptyMetaText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  reviewsListWrap: {
    gap: 8,
  },
  reviewItemCard: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewClientName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  reviewStarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  reviewScoreText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
  },
  reviewProjectTitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.brandIndigo,
    marginBottom: 4,
  },
  reviewCommentText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  detailModalFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
  },
  modalPrimaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 13,
    borderRadius: 14,
  },
  modalPrimaryActionBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
