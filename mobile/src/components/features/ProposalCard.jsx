import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { Star, Clock, Check, X } from "lucide-react-native";

export function ProposalCard({ proposal, onAccept, onReject, loadingAccept, loadingReject }) {
  const mhs = proposal.mhs_profile || {};

  return (
    <View style={styles.card}>
      {/* Mhs Info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {mhs.nama_lengkap ? mhs.nama_lengkap.charAt(0) : "M"}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{mhs.nama_lengkap || "Mahasiswa Freelancer"}</Text>
          <Text style={styles.prodi}>{mhs.prodi || "Sistem Informasi • UBSI"}</Text>
        </View>

        <View style={styles.ratingBadge}>
          <Star size={11} color="#000" fill="#000" />
          <Text style={styles.ratingText}>
            {mhs.rating_avg ? Number(mhs.rating_avg).toFixed(1) : "5.0"}
          </Text>
        </View>
      </View>

      {/* Offer Price & Days */}
      <View style={styles.offerRow}>
        <View>
          <Text style={styles.offerLabel}>Tawaran Honor</Text>
          <Text style={styles.offerPrice}>{formatCurrency(proposal.harga_tawar)}</Text>
        </View>

        <View style={styles.durationBadge}>
          <Clock size={12} color={COLORS.accentLime} />
          <Text style={styles.durationText}>{proposal.estimasi_hari} Hari Kerja</Text>
        </View>
      </View>

      {/* Cover Letter */}
      <View style={styles.letterContainer}>
        <Text style={styles.letterLabel}>Proposal & Rencana Pengerjaan:</Text>
        <Text style={styles.letterText}>"{proposal.cover_letter}"</Text>
      </View>

      {/* Actions */}
      {proposal.status === "PENDING" && (
        <View style={styles.actionRow}>
          <Button
            title="Tolak"
            variant="dark"
            size="sm"
            onPress={onReject}
            loading={loadingReject}
            style={styles.rejectBtn}
          />
          <Button
            title="Terima & Kunci Escrow"
            variant="lime"
            size="sm"
            onPress={onAccept}
            loading={loadingAccept}
            style={styles.acceptBtn}
          />
        </View>
      )}

      {proposal.status === "ACCEPTED" && (
        <Badge label="Proposal Disetujui (Escrow Aktif)" variant="lime" style={{ alignSelf: "center", marginTop: 8 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentLime,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textWhite,
  },
  prodi: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accentLime,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000",
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.bgDark,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  offerLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.accentLime,
    marginTop: 2,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textWhite,
  },
  letterContainer: {
    marginBottom: 14,
  },
  letterLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  letterText: {
    fontSize: 12,
    color: COLORS.textWhite,
    lineHeight: 18,
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 12,
  },
  rejectBtn: {
    flex: 1,
  },
  acceptBtn: {
    flex: 2,
  },
});