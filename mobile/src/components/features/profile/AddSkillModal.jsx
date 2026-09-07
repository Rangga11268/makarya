import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export function AddSkillModal({
  visible,
  onClose,
  newSkill,
  setNewSkill,
  onAdd,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Tambah Keahlian Baru</Text>
          <Text style={styles.modalSub}>
            Tambahkan keahlian teknis atau desain untuk meningkatkan peluang
            terpilih proyek
          </Text>

          <Input
            label="Nama Keahlian"
            placeholder="Contoh: Next.js, Flutter, Motion Graphic..."
            value={newSkill}
            onChangeText={setNewSkill}
          />

          <View style={styles.modalActions}>
            <Button
              title="Batal"
              variant="secondary"
              size="md"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <Button
              title="Simpan Keahlian"
              variant="brand"
              size="md"
              onPress={onAdd}
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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
});
