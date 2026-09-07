import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '../../../theme/colors';
import { FONTS } from '../../../theme/fonts';

export function TalentFilterModal({
  visible,
  onClose,
  selectedProdi,
  setSelectedProdi,
  selectedMinRating,
  setSelectedMinRating,
  selectedMinProjects,
  setSelectedMinProjects,
  resetAllFilters,
  prodiOptions = [],
  ratingOptions = [],
  projectOptions = [],
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModalSheet}>
          <View style={styles.filterModalHeader}>
            <View>
              <Text style={styles.filterModalTitle}>Filter Direktori Talenta</Text>
              <Text style={styles.filterModalSub}>
                Saring berdasarkan program studi, rating, dan pengalaman
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
            >
              <X size={18} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            {/* Prodi Section */}
            <Text style={styles.filterSectionTitle}>Program Studi</Text>
            <View style={styles.filterChipGrid}>
              {prodiOptions.map((opt) => {
                const isSelected = selectedProdi === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelectedProdi(opt.id)}
                    style={[
                      styles.modalOptionChip,
                      isSelected && styles.modalOptionChipActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.modalOptionChipText,
                        isSelected && styles.modalOptionChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Minimal Rating Section */}
            <Text style={styles.filterSectionTitle}>Minimal Reputasi Skor</Text>
            <View style={styles.filterChipGrid}>
              {ratingOptions.map((opt) => {
                const isSelected = selectedMinRating === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelectedMinRating(opt.id)}
                    style={[
                      styles.modalOptionChip,
                      isSelected && styles.modalOptionChipActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.modalOptionChipText,
                        isSelected && styles.modalOptionChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Proyek Selesai Section */}
            <Text style={styles.filterSectionTitle}>Pengalaman Proyek Tuntas</Text>
            <View style={styles.filterChipGrid}>
              {projectOptions.map((opt) => {
                const isSelected = selectedMinProjects === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelectedMinProjects(opt.id)}
                    style={[
                      styles.modalOptionChip,
                      isSelected && styles.modalOptionChipActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.modalOptionChipText,
                        isSelected && styles.modalOptionChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.modalActionButtons}>
            <TouchableOpacity
              onPress={resetAllFilters}
              style={styles.modalResetBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.modalResetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.modalApplyBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.modalApplyBtnText}>Terapkan Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  filterModalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  filterModalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  filterModalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSectionTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  filterChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  modalOptionChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalOptionChipActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
  },
  modalOptionChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  modalOptionChipTextActive: {
    fontFamily: FONTS.bodyBold,
    fontWeight: '700',
    color: COLORS.brandIndigo,
  },
  modalActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  modalResetBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalResetBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  modalApplyBtn: {
    flex: 1,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
