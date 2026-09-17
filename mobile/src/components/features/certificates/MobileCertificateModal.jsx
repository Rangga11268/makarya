import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  Image,
  Linking,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Share2,
  X,
  ExternalLink,
  GraduationCap,
  Building2,
  Coins,
} from "lucide-react-native";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useToastStore } from "../../../store/toastStore";

export function MobileCertificateModal({ visible, certificate, onClose }) {
  const { showToast } = useToastStore();
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const recipientName =
    certificate.recipient_name ||
    certificate.user_name ||
    certificate.nama_lengkap ||
    "Penerima Sertifikat";

  const clientName = certificate.client_name || "Mitra Klien UMKM";
  const projectTitle = certificate.project_title || "Proyek Kemitraan Industri";
  const roleName = certificate.role_name || "Pelaksana Proyek";
  const campus =
    certificate.recipient_kampus ||
    certificate.universitas ||
    "Perguruan Tinggi Terdaftar";
  const prodi =
    certificate.recipient_prodi || certificate.prodi || "Talenta Industri";
  const credentialId = certificate.credential_id || "MKY-2026-OFFICIAL";

  const verificationUrl = `https://makarya.id/certificates/verify/${credentialId}`;

  const handleCopy = async () => {
    try {
      await Share.share({
        message: verificationUrl,
        title: "Tautan Verifikasi Sertifikat",
      });
      setCopied(true);
      showToast("Tautan verifikasi siap disalin / dibagikan!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Gagal membagikan tautan", "error");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Sertifikat Resmi Makarya: ${projectTitle} (${roleName}) oleh ${recipientName}. Verifikasi & unduh PDF di: ${verificationUrl}`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenWebPdf = () => {
    Linking.openURL(verificationUrl).catch(() => {
      showToast("Gagal membuka tautan browser", "error");
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Modal Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleRow}>
              <ShieldCheck size={18} color={COLORS.success} />
              <Text style={styles.headerTitle}>Sertifikat Digital Resmi</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ================= OFFICIAL CERTIFICATE CANVAS ================= */}
            <View style={styles.certCard}>
              {/* Top Banner with Makarya Accents */}
              <View style={styles.certTopAccentRow}>
                <View style={styles.certBrandRow}>
                  <View style={styles.certLogoSquare}>
                    <Award size={18} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.brandTitleText}>MAKARYA</Text>
                    <Text style={styles.brandSubtitleText}>
                      PLATFORM KOLABORASI INDUSTRI
                    </Text>
                  </View>
                </View>

                <View style={styles.verifiedTopPill}>
                  <ShieldCheck size={12} color="#059669" />
                  <Text style={styles.verifiedTopPillText}>ESCROW VERIFIED</Text>
                </View>
              </View>

              {/* Main Title */}
              <Text style={styles.certMainTitle}>SERTIFIKAT</Text>

              {/* Badges */}
              <View style={styles.badgePillAmber}>
                <Text style={styles.badgePillAmberText}>
                  PENGHARGAAN PRESTASI PROYEK INDUSTRI
                </Text>
              </View>

              <View style={styles.badgePillSlate}>
                <Text style={styles.badgePillSlateText}>
                  SERTIFIKAT INI DENGAN BANGGA DISERAHKAN KEPADA
                </Text>
              </View>

              {/* Recipient Name & Campus */}
              <View style={styles.recipientBlock}>
                <Text style={styles.recipientNameText}>{recipientName}</Text>
                <View style={styles.campusRow}>
                  <GraduationCap size={13} color={COLORS.brandIndigo} />
                  <Text style={styles.campusText}>
                    {campus} • {prodi}
                  </Text>
                </View>
              </View>

              {/* Statement Description */}
              <Text style={styles.statementText}>
                Sertifikat ini diberikan atas penyelesaian penugasan proyek
                industri bersama mitra{" "}
                <Text style={styles.boldDarkText}>{clientName}</Text> pada
                proyek{" "}
                <Text style={styles.boldDarkText}>"{projectTitle}"</Text> sebagai{" "}
                <Text style={styles.roleHighlightText}>{roleName}</Text>, dan
                membuktikan kompetensi profesional serta integritas kerja yang
                telah terverifikasi resmi oleh Makarya Escrow Guarantee.
              </Text>

              {/* Project Meta Card */}
              <View style={styles.metaBox}>
                <View style={styles.metaRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Coins size={13} color="#059669" />
                    <Text style={styles.metaLabel}>Honor Peran:</Text>
                  </View>
                  <Text style={styles.honorValueText}>
                    {certificate.honor_amount || certificate.slot_budget
                      ? formatCurrency(
                          certificate.honor_amount || certificate.slot_budget,
                        )
                      : "Sesuai Kontrak"}
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Building2 size={13} color={COLORS.textMuted} />
                    <Text style={styles.metaLabel}>Mitra Klien UMKM:</Text>
                  </View>
                  <Text style={styles.metaValueText}>{clientName}</Text>
                </View>
              </View>

              {/* Signatures & Seal Section */}
              <View style={styles.signaturesSection}>
                {/* Left: Mitra Signature */}
                <View style={styles.signColumn}>
                  <View style={styles.signVectorWrap}>
                    <Text style={styles.signScriptText}>ttd digital</Text>
                  </View>
                  <View style={styles.signLine} />
                  <Text style={styles.signNameText} numberOfLines={1}>
                    {clientName}
                  </Text>
                  <Text style={styles.signRoleText}>Mitra Klien UMKM</Text>
                </View>

                {/* Center: Gold Rosette Medal */}
                <View style={styles.sealCenterWrap}>
                  <View style={styles.sealGoldCircle}>
                    <Award size={22} color="#92400E" />
                  </View>
                  <Text style={styles.sealText}>TERVERIFIKASI</Text>
                </View>

                {/* Right: User's Official Signature */}
                <View style={styles.signColumn}>
                  <View style={styles.signImageWrap}>
                    <Image
                      source={require("../../../../assets/signature.png")}
                      style={styles.signatureImg}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.signLine} />
                  <Text style={styles.signNameText}>Rangga / Direktur</Text>
                  <Text style={styles.signRoleText}>Platform Makarya</Text>
                </View>
              </View>

              {/* Bottom Credential Bar */}
              <View style={styles.bottomCredRow}>
                <View style={{ gap: 2 }}>
                  <Text style={styles.credLabelText}>ID KREDENSIAL RESMI</Text>
                  <Text style={styles.credIdText}>{credentialId}</Text>
                </View>
                <View style={styles.verifiedMiniTag}>
                  <CheckCircle2 size={11} color={COLORS.success} />
                  <Text style={styles.verifiedMiniTagText}>Valid Resmi</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionColumn}>
              <TouchableOpacity
                style={styles.downloadPdfBtn}
                onPress={handleOpenWebPdf}
                activeOpacity={0.85}
              >
                <ExternalLink size={16} color="#FFF" />
                <Text style={styles.downloadPdfBtnText}>
                  Buka & Unduh PDF di Web
                </Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.outlineBtn}
                  onPress={handleCopy}
                  activeOpacity={0.8}
                >
                  <Copy size={15} color={COLORS.textDark} />
                  <Text style={styles.outlineBtnText}>
                    {copied ? "Tersalin!" : "Salin Link"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <Share2 size={15} color="#FFF" />
                  <Text style={styles.secondaryBtnText}>Bagikan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  certCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  certTopAccentRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  certBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  certLogoSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitleText: {
    fontSize: 13,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandSubtitleText: {
    fontSize: 8,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  verifiedTopPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  verifiedTopPillText: {
    fontSize: 9,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
  certMainTitle: {
    fontSize: 26,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  badgePillAmber: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 100,
  },
  badgePillAmberText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: "#92400E",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  badgePillSlate: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  badgePillSlateText: {
    fontSize: 9,
    fontFamily: FONTS.bodyMedium,
    color: "#334155",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  recipientBlock: {
    alignItems: "center",
    gap: 4,
    marginVertical: 4,
  },
  recipientNameText: {
    fontSize: 20,
    fontFamily: FONTS.displayBold,
    color: "#0F172A",
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  campusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  campusText: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
  },
  statementText: {
    fontSize: 11,
    fontFamily: FONTS.bodyRegular,
    color: "#475569",
    textAlign: "center",
    lineHeight: 16.5,
    paddingHorizontal: 4,
  },
  boldDarkText: {
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  roleHighlightText: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.primary,
    fontWeight: "700",
  },
  metaBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 10,
    gap: 6,
    marginVertical: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaLabel: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  honorValueText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#059669",
    fontWeight: "700",
  },
  metaValueText: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  signaturesSection: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 12,
    marginTop: 4,
  },
  signColumn: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  signVectorWrap: {
    height: 38,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signScriptText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    fontStyle: "italic",
    color: "#475569",
  },
  signImageWrap: {
    height: 38,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signatureImg: {
    width: 72,
    height: 36,
  },
  signLine: {
    width: "80%",
    height: 1,
    backgroundColor: "#0F172A",
    marginVertical: 3,
  },
  signNameText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
    textAlign: "center",
  },
  signRoleText: {
    fontSize: 8.5,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  sealCenterWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  sealGoldCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    borderWidth: 1.5,
    borderColor: "#D97706",
    alignItems: "center",
    justifyContent: "center",
  },
  sealText: {
    fontSize: 7.5,
    fontFamily: FONTS.bodyBold,
    color: "#92400E",
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bottomCredRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  credLabelText: {
    fontSize: 8,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textMuted,
  },
  credIdText: {
    fontSize: 10,
    fontFamily: FONTS.mono || FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  verifiedMiniTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  verifiedMiniTagText: {
    fontSize: 9.5,
    fontFamily: FONTS.bodyBold,
    color: COLORS.success,
    fontWeight: "700",
  },
  actionColumn: {
    gap: 8,
    marginTop: 2,
  },
  downloadPdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  downloadPdfBtnText: {
    fontSize: 12.5,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  outlineBtnText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "700",
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  secondaryBtnText: {
    fontSize: 11.5,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
