import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { PebbleButton } from "../ui/PebbleButton";
import { formatCurrency } from "../../utils/formatCurrency";
import { Star, Clock, ShieldCheck, Users } from "lucide-react-native";

export function ProposalCard({
  proposal,
  projectSlots = [],
  isMultiSlot = false,
  onAccept,
  onReject,
  loadingAccept,
  loadingReject,
}) {
  const [imgError, setImgError] = useState(false);
  const mhs = proposal.mhs_profile || proposal.mahasiswa || {};

  const matchedSlot = Array.isArray(projectSlots)
    ? projectSlots.find(
        (s) =>
          String(s.id) === String(proposal.slot_id) ||
          String(s.id) === String(proposal.slot?.id),
      )
    : null;

  const roleName =
    proposal.slot_nama_peran ||
    proposal.slot?.nama_peran ||
    matchedSlot?.nama_peran ||
    proposal.nama_peran ||
    null;

  return (
    <View style={styles.card}>
      {/* Mhs Info */}
      <View style={styles.header}>
        {mhs.url_foto && !imgError ? (
          <Image
            source={{ uri: mhs.url_foto }}
            style={styles.avatarImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {mhs.nama_lengkap ? mhs.nama_lengkap.charAt(0) : "M"}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>
            {mhs.nama_lengkap || "Mahasiswa Freelancer"}
          </Text>
          <Text style={styles.prodi}>
            {mhs.prodi || "Sistem Informasi • Terverifikasi"}
          </Text>
        </View>

        <View style={styles.ratingBadge}>
          <Star size={11} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>
            {mhs.rating_avg ? Number(mhs.rating_avg).toFixed(1) : "5.0"}
          </Text>
        </View>
      </View>

      {/* Target Slot/Role Badge for Multi-Student Projects */}
      {roleName ? (
        <View style={styles.slotRoleRow}>
          <View style={styles.slotRoleBadge}>
            <Users size={12} color="#2563EB" strokeWidth={2.4} />
            <Text style={styles.slotRoleLabel}>Posisi / Peran:</Text>
            <Text style={styles.slotRoleValue} numberOfLines={1}>
              {roleName}
            </Text>
          </View>
          {matchedSlot?.alokasi_budget ? (
            <Text style={styles.slotBudgetText}>
              Pagu: {formatCurrency(matchedSlot.alokasi_budget)}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* Offer Price & Days */}
      <View style={styles.offerRow}>
        <View>
          <Text style={styles.offerLabel}>Tawaran Honor</Text>
          <Text style={styles.offerPrice}>
            {formatCurrency(proposal.harga_tawar)}
          </Text>
        </View>

        <View style={styles.durationBadge}>
          <Clock size={12} color={COLORS.brandCyan} />
          <Text style={styles.durationText}>
            {proposal.estimasi_hari} Hari Kerja
          </Text>
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
          {onReject && (
            <PebbleButton
              variant="pearl"
              size="sm"
              label="Tolak"
              onPress={onReject}
              loading={loadingReject}
              style={{ flex: 1 }}
            />
          )}
          {onAccept && (
            <PebbleButton
              variant="emerald"
              size="sm"
              label="Terima & Kunci Escrow"
              icon={ShieldCheck}
              onPress={onAccept}
              loading={loadingAccept}
              style={{ flex: 2 }}
            />
          )}
        </View>
      )}

      {proposal.status === "ACCEPTED" && (
        <Badge
          label="Proposal Disetujui (Escrow Aktif)"
          variant="success"
          style={{ alignSelf: "center", marginTop: 8 }}
        />
      )}

      {proposal.status === "WITHDRAWN" && (
        <View style={styles.withdrawnBox}>
          <Badge
            label="Proposal Ditarik Mahasiswa"
            variant="warning"
            style={{ alignSelf: "flex-start", marginBottom: 6 }}
          />
          <Text style={styles.withdrawnReasonText}>
            Alasan: "
            {proposal.withdraw_reason ||
              "Mahasiswa menarik kembali proposal lamaran ini."}
            "
          </Text>
        </View>
      )}

      {proposal.status === "REJECTED" && (
        <Badge
          label="Proposal Ditolak"
          variant="danger"
          style={{ alignSelf: "center", marginTop: 8 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
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
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarText: {
    fontFamily: FONTS.displayBold,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  prodi: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 3,
  },
  ratingText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  offerLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  offerPrice: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brandIndigo,
    marginTop: 2,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  letterContainer: {
    marginBottom: 14,
  },
  letterLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  letterText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textDark,
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
  withdrawnBox: {
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginTop: 8,
  },
  withdrawnReasonText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#92400E",
    fontStyle: "italic",
    lineHeight: 16,
  },
  slotRoleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(37, 99, 235, 0.07)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.16)",
  },
  slotRoleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    paddingRight: 6,
  },
  slotRoleLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#64748B",
  },
  slotRoleValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  slotBudgetText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: "#059669",
  },
});
