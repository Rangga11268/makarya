import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Building2,
  Briefcase,
  FileCheck,
} from "lucide-react-native";
import { Button } from "../../ui/Button";

export function InvoiceReceiptModal({
  visible,
  onClose,
  project,
  proposal,
  clientName,
  mhsName,
}) {
  if (!project) return null;

  const invoiceNo = `INV-MKR-${new Date(project.created_at || Date.now()).getFullYear()}-${(project.id || "").substring(0, 8).toUpperCase()}`;
  const transactionDate = formatDate(project.created_at || new Date());
  const contractAmount = proposal?.harga_tawar || project.budget_max || 0;
  const isCompleted =
    project.status === "DONE" || project.status === "COMPLETED";

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Faktur Escrow Makarya - ${invoiceNo}`,
        message: `Faktur Transaksi Escrow Makarya\nNo: ${invoiceNo}\nProyek: ${project.judul}\nTotal Nilai: ${formatCurrency(contractAmount)}\nStatus: ${isCompleted ? "SELESAI (DICAIRKAN)" : "DANA AMAN DI ESCROW"}\n\nPerlindungan Rekening Bersama Escrow Makarya 100% Terjamin.`,
      });
    } catch (e) {
      // ignore
    }
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
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.headerLeft}>
              <ShieldCheck size={18} color={COLORS.brandIndigo} />
              <Text style={styles.headerTitle}>Faktur Resmi Escrow</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Invoice Top Brand Box */}
            <View style={styles.brandBox}>
              <View style={styles.brandRow}>
                <Text style={styles.brandName}>
                  MAKARYA<Text style={{ color: COLORS.brandIndigo }}>.</Text>
                </Text>
                <View style={styles.officialBadge}>
                  <Text style={styles.officialBadgeText}>OFFICIAL RECEIPT</Text>
                </View>
              </View>
              <Text style={styles.brandSub}>
                Platform Kolaborasi Proyek Digital UMKM & Mahasiswa Indonesia
              </Text>

              <View style={styles.invoiceMetaRow}>
                <View>
                  <Text style={styles.metaLabel}>NOMOR FAKTUR</Text>
                  <Text style={styles.metaInvoiceNo}>{invoiceNo}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.metaLabel}>TANGGAL</Text>
                  <Text style={styles.metaDate}>{transactionDate}</Text>
                </View>
              </View>
            </View>

            {/* Escrow Status Callout */}
            <View
              style={[
                styles.statusCallout,
                isCompleted
                  ? styles.statusCalloutSuccess
                  : styles.statusCalloutActive,
              ]}
            >
              <View
                style={[
                  styles.statusIconBox,
                  isCompleted
                    ? { backgroundColor: "#D1FAE5" }
                    : { backgroundColor: "#E0E7FF" },
                ]}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} color="#059669" />
                ) : (
                  <ShieldCheck size={18} color={COLORS.brandIndigo} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>
                  {isCompleted
                    ? "Transaksi Selesai & Honor Dicairkan"
                    : "Dana Tersimpan Aman di Escrow"}
                </Text>
                <Text style={styles.statusDesc}>
                  {isCompleted
                    ? "Deliverable hasil pekerjaan telah disetujui klien UMKM."
                    : "Dana dikunci sistem hingga pekerjaan selesai disetujui."}
                </Text>
              </View>
            </View>

            {/* Two Parties Info */}
            <View style={styles.partiesGrid}>
              <View style={styles.partyBox}>
                <View style={styles.partyLabelRow}>
                  <Building2 size={12} color={COLORS.textMuted} />
                  <Text style={styles.partyRoleLabel}>KLIEN UMKM</Text>
                </View>
                <Text style={styles.partyName} numberOfLines={1}>
                  {clientName || project.umkm_profile?.nama_usaha || "Klien UMKM"}
                </Text>
                <Text style={styles.partySub}>
                  {project.umkm_profile?.kota || "Indonesia"}
                </Text>
              </View>

              <View style={styles.partyBox}>
                <View style={styles.partyLabelRow}>
                  <Briefcase size={12} color={COLORS.textMuted} />
                  <Text style={styles.partyRoleLabel}>MAHASISWA</Text>
                </View>
                <Text style={styles.partyName} numberOfLines={1}>
                  {mhsName || project.accepted_mhs_nama || "Mahasiswa Pelaksana"}
                </Text>
                <Text style={styles.partySub}>Identitas Terverifikasi</Text>
              </View>
            </View>

            {/* Project Summary */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeading}>Rincian Kontrak Pengerjaan</Text>
              <View style={styles.detailCard}>
                <Text style={styles.projectJudul}>{project.judul}</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowLabel}>Kategori:</Text>
                  <Text style={styles.detailRowValue}>{project.kategori}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowLabel}>Nilai Kontrak Proyek:</Text>
                  <Text style={styles.detailRowValue}>
                    {formatCurrency(contractAmount)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowLabel}>Proteksi Escrow Makarya:</Text>
                  <Text style={[styles.detailRowValue, { color: "#059669" }]}>
                    Gratis (Rp 0)
                  </Text>
                </View>
              </View>
            </View>

            {/* Total Row */}
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total Pembayaran Escrow</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(contractAmount)}
              </Text>
            </View>

            {/* Legal / Protection Notice */}
            <View style={styles.legalNoticeBox}>
              <Text style={styles.legalNoticeTitle}>
                Jaminan Perlindungan Escrow 100%
              </Text>
              <Text style={styles.legalNoticeText}>
                Faktur ini merupakan bukti sah transaksi penjaminan dana melalui
                sistem Rekening Bersama Makarya. Dokumen ini sah digunakan untuk
                pembukuan operasional UMKM.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.bottomBar}>
            <Button
              title="Bagikan / Simpan Bukti"
              variant="brand"
              size="md"
              icon={<FileCheck size={16} color="#FFFFFF" />}
              onPress={handleShare}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  scrollBody: {
    padding: 18,
    gap: 14,
  },
  brandBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandName: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  officialBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  officialBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    fontWeight: "700",
    color: "#334155",
  },
  brandSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  metaLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  metaInvoiceNo: {
    fontFamily: FONTS.monoBold || FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 1,
  },
  metaDate: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#334155",
    marginTop: 1,
  },
  statusCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusCalloutActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  statusCalloutSuccess: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  statusIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#475569",
    marginTop: 1,
  },
  partiesGrid: {
    flexDirection: "row",
    gap: 10,
  },
  partyBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  partyLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  partyRoleLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    fontWeight: "700",
    color: "#64748B",
  },
  partyName: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  partySub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },
  detailSection: {
    gap: 6,
  },
  sectionHeading: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  projectJudul: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailRowLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
  },
  detailRowValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  totalLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  totalValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  legalNoticeBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  legalNoticeTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 2,
  },
  legalNoticeText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
    lineHeight: 14,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
});
