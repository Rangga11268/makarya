import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { ChevronLeft, Bell, CheckCircle2 } from "lucide-react-native";

export function Header({
  category,
  title,
  subtitle,
  onBack,
  rightAction,
  showBell = false,
  onBellPress,
  unreadCount = 0,
  userProfile,
  onProfilePress,
  showBrandLogo = false,
}) {
  const insets = useSafeAreaInsets();
  const topPadding =
    Math.max(insets.top, Platform.OS === "android" ? 12 : 8) + 6;

  return (
    <View style={[styles.header, { paddingTop: topPadding }]}>
      {/* 1. Left Section */}
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.65}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={22} color={COLORS.textDark} strokeWidth={2.4} />
          </TouchableOpacity>
        )}

        {/* Brand Logo Mode */}
        {showBrandLogo ? (
          <View style={styles.brandGroup}>
            <Image
              source={require("../../../assets/logo.webp")}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>
        ) : userProfile ? (
          /* User Profile Header */
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.userProfileSection}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrapper}>
              {userProfile.photoUrl || userProfile.url_foto ? (
                <Image
                  source={{ uri: userProfile.photoUrl || userProfile.url_foto }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.avatarCircle,
                    userProfile.isMahasiswa
                      ? styles.avatarMhs
                      : styles.avatarUmkm,
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {userProfile.initial || "U"}
                  </Text>
                </View>
              )}
              <View style={styles.verifiedCheckBadge}>
                <CheckCircle2
                  size={11}
                  color="#FFFFFF"
                  fill={COLORS.brandIndigo}
                />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {userProfile.name}
              </Text>
              <Text style={styles.userRole} numberOfLines={1}>
                {userProfile.roleText}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          /* Standard Apple-Clean Title + Subtitle */
          <View style={styles.titleContainer}>
            {category ? (
              <Text style={styles.categoryText} numberOfLines={1}>
                {category}
              </Text>
            ) : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      {/* 2. Right Section (Notification Bell or User Mini Avatar or Custom Action) */}
      <View style={styles.right}>
        {showBrandLogo && userProfile && (
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.userMiniAvatar}
            activeOpacity={0.8}
          >
            {userProfile.photoUrl || userProfile.url_foto ? (
              <Image
                source={{ uri: userProfile.photoUrl || userProfile.url_foto }}
                style={styles.miniAvatarImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.miniAvatarCircle,
                  userProfile.isMahasiswa
                    ? styles.avatarMhs
                    : styles.avatarUmkm,
                ]}
              >
                <Text style={styles.miniAvatarText}>
                  {userProfile.initial || "U"}
                </Text>
              </View>
            )}
            <View style={styles.miniVerifiedBadge}>
              <CheckCircle2
                size={10}
                color="#FFFFFF"
                fill={COLORS.brandIndigo}
              />
            </View>
          </TouchableOpacity>
        )}

        {showBell && (
          <TouchableOpacity
            onPress={onBellPress}
            style={styles.bellBtn}
            activeOpacity={0.65}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bell size={18} color={COLORS.textDark} strokeWidth={2} />
            {unreadCount > 0 && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}

        {rightAction && (
          <View style={styles.rightActionWrapper}>{rightAction}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.94)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
    zIndex: 20,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandLogo: {
    width: 96,
    height: 26,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
  },
  titleContainer: {
    flex: 1,
  },
  categoryText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 1,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
    lineHeight: 23,
  },
  subtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 1,
    lineHeight: 16,
  },
  userProfileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarMhs: {
    backgroundColor: "#2563EB",
  },
  avatarUmkm: {
    backgroundColor: "#0F172A",
  },
  avatarText: {
    fontFamily: FONTS.displayBold,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  verifiedCheckBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FONTS.displayBold,
    fontSize: 14.5,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.2,
  },
  userRole: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
    fontWeight: "500",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userMiniAvatar: {
    position: "relative",
  },
  miniAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  miniAvatarText: {
    fontFamily: FONTS.displayBold,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  miniVerifiedBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  rightActionWrapper: {
    marginLeft: 2,
  },
});
