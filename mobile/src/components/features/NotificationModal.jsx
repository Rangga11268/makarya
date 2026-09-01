import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { useNotificationStore } from "../../store/notificationStore";
import { useAuthStore } from "../../store/authStore";
import {
  Bell,
  X,
  CheckCheck,
  ShieldCheck,
  Wallet,
  Briefcase,
  Sparkles,
  FileCheck,
} from "lucide-react-native";

export function NotificationModal({ visible, onClose }) {
  const { user } = useAuthStore();
  const { getRoleNotifications, markAsRead, markAllAsRead, getUnreadCount } =
    useNotificationStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const notifications = getRoleNotifications(user?.role);
  const unreadCount = getUnreadCount(user?.role);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "SUCCESS":
      case "PROPOSAL":
        return <ShieldCheck size={18} color={COLORS.brandIndigo} />;
      case "PAYMENT":
        return <Wallet size={18} color={COLORS.success} />;
      case "SUBMISSION":
        return <FileCheck size={18} color={COLORS.brandCyan} />;
      case "INFO":
      default:
        return <Sparkles size={18} color={COLORS.brandIndigo} />;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.bellIconCircle}>
                <Bell size={18} color={COLORS.brandIndigo} />
                {unreadCount > 0 && <View style={styles.unreadDot} />}
              </View>
              <View>
                <Text style={styles.modalTitle}>Notifikasi Anda</Text>
                <Text style={styles.modalSub}>
                  {unreadCount > 0
                    ? `${unreadCount} pemberitahuan belum dibaca`
                    : "Semua pemberitahuan telah dibaca"}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Quick Mark All Read Button */}
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={() => markAllAsRead(user?.role)}
              activeOpacity={0.75}
            >
              <CheckCheck size={14} color={COLORS.brandIndigo} />
              <Text style={styles.markAllText}>Tandai Semua Dibaca</Text>
            </TouchableOpacity>
          )}

          {/* Notifications List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyBox}>
                <Bell size={36} color={COLORS.textDim} />
                <Text style={styles.emptyTitle}>Belum Ada Notifikasi</Text>
                <Text style={styles.emptySub}>
                  Pemberitahuan aktivitas proyek dan transaksi escrow akan
                  muncul di sini.
                </Text>
              </View>
            ) : (
              notifications.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.notificationCard,
                    !item.isRead && styles.notificationCardUnread,
                  ]}
                  onPress={() => markAsRead(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconCircle}>
                    {getNotificationIcon(item.type)}
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.itemMessage}>{item.message}</Text>
                  </View>

                  {!item.isRead && <View style={styles.activePillDot} />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: "82%",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bellIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F43F5E",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  modalSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-end",
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  notificationCardUnread: {
    backgroundColor: "#F5F3FF", // Soft subtle purple/indigo tint
    borderColor: "rgba(79, 70, 229, 0.25)",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgSurface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  itemTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  itemMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  activePillDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.brandIndigo,
    marginTop: 6,
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
  },
});
