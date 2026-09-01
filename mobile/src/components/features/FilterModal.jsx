import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { Button } from "../ui/Button";
import { X } from "lucide-react-native";

export function FilterModal({
  visible,
  onClose,
  selectedStatus,
  onSelectStatus,
  selectedBudgetRange,
  onSelectBudgetRange,
  onReset,
  onApply,
}) {
  const statusOptions = [
    { id: "ALL", label: "Semua Status" },
    { id: "OPEN", label: "Bidding Terbuka" },
    { id: "IN_PROGRESS", label: "Sedang Dikerjakan" },
    { id: "REVIEW", label: "Dalam Review" },
    { id: "DONE", label: "Selesai" },
  ];

  const budgetOptions = [
    { id: "ALL", label: "Semua Anggaran" },
    { id: "UNDER_300K", label: "< Rp 300.000" },
    { id: "300K_1M", label: "Rp 300.000 - Rp 1.000.000" },
    { id: "ABOVE_1M", label: "> Rp 1.000.000" },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Filter Pencarian Proyek</Text>
              <Text style={styles.modalSub}>
                Saring berdasarkan status pengerjaan dan pagu anggaran
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Status Proyek Section */}
          <Text style={styles.filterSectionTitle}>Status Proyek</Text>
          <View style={styles.filterChipGrid}>
            {statusOptions.map((opt) => {
              const isSelected = selectedStatus === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => onSelectStatus(opt.id)}
                  style={[
                    styles.modalOptionChip,
                    isSelected && styles.modalOptionChipActive,
                  ]}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Rentang Anggaran Section */}
          <Text style={styles.filterSectionTitle}>Pagu Anggaran</Text>
          <View style={styles.filterChipGrid}>
            {budgetOptions.map((opt) => {
              const isSelected = selectedBudgetRange === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => onSelectBudgetRange(opt.id)}
                  style={[
                    styles.modalOptionChip,
                    isSelected && styles.modalOptionChipActive,
                  ]}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <Button
              title="Reset"
              variant="secondary"
              size="md"
              onPress={onReset}
              style={{ flex: 1 }}
            />
            <Button
              title="Terapkan Filter"
              variant="brand"
              size="md"
              onPress={() => {
                if (onApply) onApply();
                onClose();
              }}
              style={{ flex: 2 }}
            />
          </View>
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
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  modalSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textDark,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 10,
    marginTop: 10,
  },
  filterChipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  modalOptionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalOptionChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  modalOptionText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  modalOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
});
