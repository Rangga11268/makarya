import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { ArrowLeft, Bell, CheckCircle2 } from "lucide-react-native";

export function Header({
  title,
  subtitle,
  onBack,
  rightAction,
  showBell = false,
  onBellPress,
  unreadCount = 0,
  userProfile,
  onProfilePress,
}) {
  return (
    <View style={styles.header}>
      {/* 1. Left Section */}
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color={COLORS.textDark} />
          </TouchableOpacity>
        )}

        {/* User Profile Header (for HomeScreen) */}
        {userProfile ? (
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.userProfileSection}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.avatarCircle,
                  userProfile.isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
                ]}
              >
                <Text style={styles.avatarText}>{userProfile.initial || "U"}</Text>
              </View>
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
          /* Standard Title + Subtitle Header */
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* 2. Right Section (Notification Bell or Custom Action) */}
      <View style={styles.right}>
        {showBell && (
          <TouchableOpacity
            onPress={onBellPress}
            style={styles.bellBtn}
            activeOpacity={0.75}
          >
            <Bell size={20} color={COLORS.textDark} />
            {unreadCount > 0 && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}

        {rightAction && <View style={styles.rightActionWrapper}>{rightAction}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    backgroundColor: COLORS.bgSurface,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  userProfileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMhs: {
    backgroundColor: COLORS.brandIndigo,
  },
  avatarUmkm: {
    backgroundColor: COLORS.brandCyan,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  verifiedCheckBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  userRole: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "600",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F43F5E",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  rightActionWrapper: {
    marginLeft: 4,
  },
});