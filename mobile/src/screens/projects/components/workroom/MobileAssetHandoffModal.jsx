import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { FONTS } from "../../../../theme/fonts";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { Button } from "../../../../components/ui/Button";
import { ShieldCheck, CheckCircle2, X, Check } from "lucide-react-native";

export function MobileAssetHandoffModal({
  visible,
  onClose,
  onConfirm,
  projectTitle,
  budgetAmount = 0,
  roleName,
  submitterName,
  loading = false,
}) {
  const [checklist, setChecklist] = useState({
    filesVerified: false,
    rightsTransferred: false,
    briefFulfilled: false,
    escrowApproved: false,
  });

  const toggleItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAllChecked =
    checklist.filesVerified &&
    checklist.rightsTransferred &&
    checklist.briefFulfilled &&
    checklist.escrowApproved;

  const checkAll = () => {
    const target = !isAllChecked;
    setChecklist({
      filesVerified: target,
      rightsTransferred: target,
      briefFulfilled: target,
      escrowApproved: target,
    });
  };

  const items = [
    {
      key: "filesVerified",
      title: "Berkas Master / Kode Sumber Teruji",
      desc: "File pengerjaan dapat dibuka, tidak rusak, dan berfungsi normal.",
    },
    {
      key: "rightsTransferred",
      title: "Hak Milik / Akses Digital Lengkap",
      desc: "Hak pakai, akses akun, atau aset desain telah diserahkan penuh.",
    },
    {
      key: "briefFulfilled",
      title: "Kesesuaian Deliverable",
      desc: "Hasil akhir sesuai instruksi brief awal dan bebas revisi lagi.",
    },
    {
      key: "escrowApproved",
      title: "Otorisasi Pencairan 100% Escrow",
      desc: "Menyetujui pelepasan honor escrow langsung ke dompet mahasiswa.",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.grabber} />

          {/* Sheet Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.shieldBox}>
                <ShieldCheck size={20} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerSubtitle}>
                  PROTOKOL SERAH TERIMA ASET
                </Text>
                <Text style={styles.headerTitle}>
                  Verifikasi & Pelepasan Escrow
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {/* Project Summary Box */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>PROYEK DISELESAIKAN:</Text>
              <Text style={styles.summaryTitle} numberOfLines={1}>
                {projectTitle}
              </Text>
              {(roleName || submitterName) && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 4,
                  }}
                >
                  {roleName ? (
                    <View
                      style={{
                        backgroundColor: "rgba(79, 70, 229, 0.08)",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: FONTS.displayBold,
                          color: "#4F46E5",
                        }}
                      >
                        Peran: {roleName}
                      </Text>
                    </View>
                  ) : null}
                  {submitterName ? (
                    <Text
                      style={{
                        fontSize: 10.5,
                        fontFamily: FONTS.bodyMedium,
                        color: "#334155",
                      }}
                    >
                      Talenta:{" "}
                      <Text style={{ fontFamily: FONTS.displayBold }}>
                        {submitterName}
                      </Text>
                    </Text>
                  ) : null}
                </View>
              )}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summarySub}>
                  Total Honor yang Dicairkan:
                </Text>
                <Text style={styles.summaryAmount}>
                  {formatCurrency(budgetAmount)}
                </Text>
              </View>
            </View>

            <Text style={styles.noticeText}>
              Sebelum dana garansi escrow diteruskan 100% ke mahasiswa, mohon
              konfirmasi bahwa serah terima pekerjaan telah lengkap:
            </Text>

            {/* Checklist Items */}
            <View style={styles.checklistContainer}>
              {items.map((it) => {
                const checked = checklist[it.key];
                return (
                  <TouchableOpacity
                    key={it.key}
                    style={[
                      styles.checkItem,
                      checked && styles.checkItemActive,
                    ]}
                    onPress={() => toggleItem(it.key)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        checked && styles.checkboxActive,
                      ]}
                    >
                      {checked && (
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.checkItemTitle}>{it.title}</Text>
                      <Text style={styles.checkItemDesc}>{it.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Check All Shortcut */}
            <TouchableOpacity
              onPress={checkAll}
              style={styles.checkAllBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.checkAllText}>
                {isAllChecked ? "Batal Centang Semua" : "Centang Semua Poin"}
              </Text>
            </TouchableOpacity>

            {/* Modal Actions */}
            <View style={styles.actionsRow}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={onClose}
                disabled={loading}
                style={{ flex: 1 }}
              />

              <Button
                title="Konfirmasi & Cairkan"
                variant="brand"
                size="md"
                onPress={onConfirm}
                loading={loading}
                disabled={!isAllChecked || loading}
                style={{ flex: 2 }}
              />
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
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  grabber: {
    width: 36,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  shieldBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerSubtitle: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#059669",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: "#0F172A",
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: 22,
    paddingTop: 16,
    gap: 12,
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  summaryLabel: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#64748B",
    letterSpacing: 0.5,
  },
  summaryTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summarySub: {
    fontSize: 11.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  summaryAmount: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: "#059669",
  },
  noticeText: {
    fontSize: 11.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
    lineHeight: 16,
  },
  checklistContainer: {
    gap: 8,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  checkItemActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  checkItemTitle: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  checkItemDesc: {
    fontSize: 10.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 14,
  },
  checkAllBtn: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  checkAllText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: "#2563EB",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
});
