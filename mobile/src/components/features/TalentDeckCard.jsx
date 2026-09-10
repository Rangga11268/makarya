import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Star, MapPin, GraduationCap, CheckCircle2, Heart, MessageSquare } from "lucide-react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { PebbleButton } from "../ui/PebbleButton";
import { formatCurrency } from "../../utils/formatCurrency";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width - 40, 360);

export function TalentDeckCard({
  talent,
  onPress,
  onChat,
  onBookmark,
  isBookmarked = false,
  isPrimary = true,
}) {
  if (!talent) return null;

  const displayName = talent.user?.name || talent.name || "Talenta Digital";
  const avatarUrl = talent.user?.url_foto || talent.url_foto;
  const initial = displayName.charAt(0).toUpperCase();
  const roleTitle = talent.keahlian_utama || talent.headline || "Digital Specialist";
  const university = talent.universitas || "Perguruan Tinggi";
  const city = talent.kota || "Indonesia";
  const rating = talent.rating_rata_rata || talent.rating || 4.9;
  const rateHourly = talent.tarif_per_jam || talent.rate || 150000;

  return (
    <View style={styles.deckContainer}>
      {/* 1. Perspective Background Deck Layers (The Signature FlyHire Stacked Aesthetic) */}
      <View style={[styles.deckLayer, styles.deckLayer2]} pointerEvents="none" />
      <View style={[styles.deckLayer, styles.deckLayer1]} pointerEvents="none" />

      {/* 2. Top Interactive Card */}
      <TouchableOpacity
        style={styles.mainCard}
        onPress={onPress}
        activeOpacity={0.92}
      >
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.avatarGroup}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarInitialWrap}>
                <Text style={styles.avatarInitialText}>{initial}</Text>
              </View>
            )}
            <View style={styles.verifiedDot}>
              <CheckCircle2 size={13} color="#FFFFFF" fill="#059669" />
            </View>
          </View>

          {/* Quick Action Pills on Top Right */}
          <View style={styles.topActionsRow}>
            {onChat && (
              <TouchableOpacity
                style={styles.topIconCircle}
                onPress={onChat}
                activeOpacity={0.75}
              >
                <MessageSquare size={15} color="#334155" />
              </TouchableOpacity>
            )}
            {onBookmark && (
              <TouchableOpacity
                style={[
                  styles.topIconCircle,
                  isBookmarked && { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
                ]}
                onPress={onBookmark}
                activeOpacity={0.75}
              >
                <Heart
                  size={15}
                  color={isBookmarked ? "#EF4444" : "#334155"}
                  fill={isBookmarked ? "#EF4444" : "none"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Talent Identity & Title */}
        <View style={styles.nameBlock}>
          <Text style={styles.talentName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.talentUniversity} numberOfLines={1}>
            {university}
          </Text>
        </View>

        {/* Ergonomic Pill Tags Row (Direct FlyHire Metatags Concept) */}
        <View style={styles.pillChipsRow}>
          <View style={styles.pillChip}>
            <Star size={12} color="#D97706" fill="#F59E0B" />
            <Text style={styles.pillChipText}>{Number(rating).toFixed(1)}</Text>
          </View>

          <View style={styles.pillChip}>
            <MapPin size={12} color="#475569" />
            <Text style={styles.pillChipText} numberOfLines={1}>{city}</Text>
          </View>

          <View style={styles.pillChip}>
            <GraduationCap size={12} color="#475569" />
            <Text style={styles.pillChipText}>Mahasiswa</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Bottom Section: Specialty, Rate & Action Button */}
        <View style={styles.bottomSection}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.specialtyLabel} numberOfLines={1}>
              {roleTitle}
            </Text>
            <View style={styles.rateRow}>
              <Text style={styles.rateAmount}>
                {formatCurrency(rateHourly)}
              </Text>
              <Text style={styles.ratePeriod}>/ jam</Text>
            </View>
          </View>

          <PebbleButton
            variant="sapphire"
            size="sm"
            title="Ajak Diskusi"
            onPress={onPress}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  deckContainer: {
    width: CARD_WIDTH,
    alignSelf: "center",
    marginVertical: 10,
    alignItems: "center",
    position: "relative",
  },
  deckLayer: {
    position: "absolute",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  deckLayer2: {
    width: CARD_WIDTH - 28,
    height: 190,
    bottom: -12,
    backgroundColor: "#E2E8F0",
    opacity: 0.5,
    zIndex: 1,
  },
  deckLayer1: {
    width: CARD_WIDTH - 14,
    height: 196,
    bottom: -6,
    backgroundColor: "#F1F5F9",
    opacity: 0.8,
    zIndex: 2,
  },
  mainCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.2,
    borderColor: "rgba(226, 232, 240, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    zIndex: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarGroup: {
    position: "relative",
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E2E8F0",
  },
  avatarInitialWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "#BFDBFE",
  },
  avatarInitialText: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  verifiedDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  topActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  topIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  nameBlock: {
    marginBottom: 12,
  },
  talentName: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  talentUniversity: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  pillChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  pillChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 14,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  specialtyLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
    marginTop: 2,
  },
  rateAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
  ratePeriod: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
  },
});
