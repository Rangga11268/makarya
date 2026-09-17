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
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  ShieldCheck,
} from "lucide-react-native";

export function HeaderCircleButton({
  onPress,
  icon: Icon,
  children,
  style,
  activeOpacity = 0.7,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.headerCircleBtn, style]}
      activeOpacity={activeOpacity}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {Icon ? <Icon size={18} color="#0F172A" /> : children}
    </TouchableOpacity>
  );
}

export function Header({
  category,
  title,
  subtitle,
  chipText,
  chipIcon,
  centerContent,
  onBack,
  leftAction,
  leftIcon,
  onLeftPress,
  rightAction,
  rightIcon,
  onRightPress,
  showBell = false,
  onBellPress,
  unreadCount = 0,
  showChat = false,
  onChatPress,
  chatUnreadCount = 0,
  userProfile,
  onProfilePress,
  showBrandLogo = false,
  style,
}) {
  const insets = useSafeAreaInsets();
  let nav;
  try {
    nav = useNavigation();
  } catch (_) {}

  const handleChatPress = () => {
    if (onChatPress) {
      onChatPress();
    } else if (nav?.navigate) {
      nav.navigate("ChatList");
    }
  };

  const topPadding =
    Math.max(insets?.top || 0, Platform.OS === "ios" ? 44 : 24) + 8;

  const displaySubtitle = chipText || subtitle || category;
  const hasEscrowKeyword =
    (displaySubtitle || "").toLowerCase().includes("escrow") ||
    (displaySubtitle || "").toLowerCase().includes("garansi") ||
    (displaySubtitle || "").toLowerCase().includes("proteksi");

  return (
    <View style={[styles.header, { paddingTop: topPadding }, style]}>
      {/* 1. Left Slot (Symmetric with Right) */}
      <View style={styles.sideSlot}>
        {leftAction ? (
          leftAction
        ) : onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.headerCircleBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={18} color="#0F172A" />
          </TouchableOpacity>
        ) : onLeftPress && leftIcon ? (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.headerCircleBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {React.isValidElement(leftIcon)
              ? leftIcon
              : typeof leftIcon === "function" ||
                (typeof leftIcon === "object" && leftIcon !== null)
              ? React.createElement(leftIcon, { size: 18, color: "#0F172A" })
              : null}
          </TouchableOpacity>
        ) : (
          <View style={styles.headerCircleBtnPlaceholder} />
        )}
      </View>

      {/* 2. Center Slot (Perfect Center Align) */}
      <View style={styles.headerCenter}>
        {showBrandLogo ? (
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        ) : centerContent ? (
          centerContent
        ) : (
          <>
            <Text style={styles.headerMainTitle} numberOfLines={1}>
              {title}
            </Text>
            {displaySubtitle ? (
              <View style={styles.escrowChip}>
                {chipIcon ? (
                  React.isValidElement(chipIcon) ? (
                    chipIcon
                  ) : typeof chipIcon === "function" ||
                    (typeof chipIcon === "object" && chipIcon !== null) ? (
                    React.createElement(chipIcon, {
                      size: 11,
                      color: "#059669",
                    })
                  ) : null
                ) : hasEscrowKeyword ? (
                  <ShieldCheck size={11} color="#059669" />
                ) : null}
                <Text
                  style={[
                    styles.escrowChipText,
                    hasEscrowKeyword
                      ? styles.escrowTextGreen
                      : styles.escrowTextMuted,
                  ]}
                  numberOfLines={1}
                >
                  {displaySubtitle}
                </Text>
              </View>
            ) : null}
          </>
        )}
      </View>

      {/* 3. Right Slot (Symmetric with Left) */}
      <View
        style={[
          styles.sideSlotRight,
          showBell && showChat && { flexDirection: "row", gap: 6 },
        ]}
      >
        {rightAction ? (
          rightAction
        ) : showBell || showChat ? (
          <>
            {showChat && (
              <TouchableOpacity
                onPress={handleChatPress}
                style={styles.headerCircleBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Pesan & Diskusi"
              >
                <MessageSquare size={18} color="#0F172A" />
                {chatUnreadCount > 0 && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            )}
            {showBell && (
              <TouchableOpacity
                onPress={onBellPress}
                style={styles.headerCircleBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Notifikasi"
              >
                <Bell size={18} color="#0F172A" />
                {unreadCount > 0 && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            )}
          </>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.headerCircleBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {React.isValidElement(rightIcon)
              ? rightIcon
              : typeof rightIcon === "function" ||
                (typeof rightIcon === "object" && rightIcon !== null)
              ? React.createElement(rightIcon, { size: 18, color: "#0F172A" })
              : null}
          </TouchableOpacity>
        ) : userProfile && (userProfile.photoUrl || userProfile.url_foto) ? (
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.headerCircleBtn}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: userProfile.photoUrl || userProfile.url_foto }}
              style={styles.miniAvatarImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerCircleBtnPlaceholder} />
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
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    zIndex: 10,
  },
  sideSlot: {
    minWidth: 38,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sideSlotRight: {
    minWidth: 38,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(241, 245, 249, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  headerCircleBtnPlaceholder: {
    width: 38,
    height: 38,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  headerMainTitle: {
    fontSize: 16,
    fontFamily: FONTS.displayBold || "Inter-Bold",
    color: "#0F172A",
    textAlign: "center",
  },
  escrowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    marginTop: 2,
    maxWidth: 240,
  },
  escrowChipText: {
    fontSize: 10.5,
    fontFamily: FONTS.bodyMedium || "Inter-Medium",
  },
  escrowTextGreen: {
    color: "#059669",
  },
  escrowTextMuted: {
    color: "#64748B",
  },
  brandLogo: {
    width: 96,
    height: 26,
  },
  miniAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  unreadDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});
