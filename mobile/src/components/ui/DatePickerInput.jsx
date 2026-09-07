import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { Calendar, ChevronLeft, ChevronRight, X, Clock, Check } from "lucide-react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatIndonesianDate(dateStr) {
  if (!dateStr) return "Pilih tanggal deadline...";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][d.getDay()];
  const day = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
}

function calculateDaysRemaining(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function toDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePickerInput({
  label = "Tenggat Waktu Selesai (Deadline)",
  value,
  onChangeDate,
  required = false,
  helperText,
  error,
  style,
  minDaysAhead = 1,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  // Initialize internal calendar view to selected date or today + 7
  const initialDate = value ? new Date(value) : new Date(Date.now() + 7 * 86400000);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [tempSelected, setTempSelected] = useState(value || toDateString(initialDate));

  const daysRemaining = calculateDaysRemaining(value);

  const handleOpen = () => {
    const cur = value ? new Date(value) : new Date(Date.now() + 7 * 86400000);
    setViewYear(cur.getFullYear());
    setViewMonth(cur.getMonth());
    setTempSelected(value || toDateString(cur));
    setModalOpen(true);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleApplyPreset = (days) => {
    const d = new Date(Date.now() + days * 86400000);
    const dateStr = toDateString(d);
    setTempSelected(dateStr);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleConfirm = () => {
    onChangeDate(tempSelected);
    setModalOpen(false);
  };

  // Calendar matrix calculation
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayStr = toDateString(new Date());

  const daysCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysCells.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateObj = new Date(viewYear, viewMonth, d);
    const dateStr = toDateString(dateObj);
    const isPast = dateStr < todayStr;
    const isSelected = dateStr === tempSelected;
    daysCells.push({ dayNumber: d, dateStr, isPast, isSelected });
  }

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredStar}>*</Text>}
        </View>
      )}

      {/* Trigger Button Field */}
      <TouchableOpacity
        style={[
          styles.fieldWrapper,
          error ? styles.fieldError : null,
        ]}
        onPress={handleOpen}
        activeOpacity={0.8}
      >
        <View style={styles.fieldLeft}>
          <View style={styles.iconCircle}>
            <Calendar size={18} color={COLORS.brandIndigo} />
          </View>
          <View style={styles.fieldTextCol}>
            <Text style={[styles.mainDateText, !value && styles.placeholderText]}>
              {formatIndonesianDate(value)}
            </Text>
            {daysRemaining !== null && daysRemaining >= 0 && (
              <Text style={styles.subRemainText}>
                {daysRemaining === 0
                  ? "Hari ini (Sangat Mendesak)"
                  : `${daysRemaining} hari waktu pengerjaan`}
              </Text>
            )}
          </View>
        </View>

        {daysRemaining !== null && daysRemaining > 0 && (
          <View
            style={[
              styles.remainBadge,
              daysRemaining <= 3 ? styles.remainBadgeUrgent : styles.remainBadgeNormal,
            ]}
          >
            <Clock size={11} color={daysRemaining <= 3 ? "#B45309" : COLORS.brandIndigo} />
            <Text
              style={[
                styles.remainBadgeText,
                daysRemaining <= 3 ? styles.remainBadgeTextUrgent : styles.remainBadgeTextNormal,
              ]}
            >
              +{daysRemaining} Hari
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      {/* Interactive Bottom Sheet Modal */}
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Pilih Batas Akhir (Deadline)</Text>
                <Text style={styles.modalSub}>
                  Tentukan waktu yang realistis agar mahasiswa menghasilkan karya prima
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <X size={18} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {/* Quick Preset Pills */}
            <View style={styles.presetSection}>
              <Text style={styles.presetSectionTitle}>Pilihan Cepat Waktu:</Text>
              <View style={styles.presetRow}>
                {[
                  { label: "+3 Hari (Kilat)", days: 3 },
                  { label: "+7 Hari (1 Minggu)", days: 7 },
                  { label: "+14 Hari (2 Minggu)", days: 14 },
                  { label: "+30 Hari (1 Bulan)", days: 30 },
                ].map((item) => {
                  const itemStr = toDateString(new Date(Date.now() + item.days * 86400000));
                  const isMatch = tempSelected === itemStr;
                  return (
                    <TouchableOpacity
                      key={item.days}
                      onPress={() => handleApplyPreset(item.days)}
                      style={[styles.presetPill, isMatch && styles.presetPillActive]}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.presetPillText, isMatch && styles.presetPillTextActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Calendar Controls */}
            <View style={styles.calendarWrap}>
              <View style={styles.monthHeader}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={styles.navBtn}
                  activeOpacity={0.7}
                >
                  <ChevronLeft size={18} color={COLORS.textDark} />
                </TouchableOpacity>

                <Text style={styles.monthTitle}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </Text>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  style={styles.navBtn}
                  activeOpacity={0.7}
                >
                  <ChevronRight size={18} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.daysOfWeekRow}>
                {DAY_NAMES.map((d, i) => (
                  <Text
                    key={d}
                    style={[
                      styles.dayOfWeekText,
                      i === 0 && { color: COLORS.danger },
                    ]}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.gridDays}>
                {daysCells.map((cell, idx) => {
                  if (!cell) {
                    return <View key={`empty-${idx}`} style={styles.dayCellEmpty} />;
                  }
                  return (
                    <TouchableOpacity
                      key={cell.dateStr}
                      disabled={cell.isPast}
                      onPress={() => setTempSelected(cell.dateStr)}
                      style={[
                        styles.dayCell,
                        cell.isSelected && styles.dayCellSelected,
                        cell.isPast && styles.dayCellPast,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayCellText,
                          cell.isSelected && styles.dayCellTextSelected,
                          cell.isPast && styles.dayCellTextPast,
                        ]}
                      >
                        {cell.dayNumber}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Selected Date Preview & CTA */}
            <View style={styles.modalFooter}>
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Tanggal Terpilih:</Text>
                <Text style={styles.previewValue}>
                  {formatIndonesianDate(tempSelected)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmBtn}
                activeOpacity={0.85}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.confirmBtnText}>Konfirmasi Tanggal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 4,
  },
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  requiredStar: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "700",
  },
  fieldWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 52,
  },
  fieldError: {
    borderColor: COLORS.danger,
    backgroundColor: "#FEF2F2",
  },
  fieldLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldTextCol: {
    flex: 1,
  },
  mainDateText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  placeholderText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  subRemainText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: COLORS.brandIndigo,
    marginTop: 1,
  },
  remainBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  remainBadgeNormal: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  remainBadgeUrgent: {
    backgroundColor: "#FEF3C7",
  },
  remainBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  remainBadgeTextNormal: {
    color: COLORS.brandIndigo,
  },
  remainBadgeTextUrgent: {
    color: "#B45309",
  },
  errorText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "600",
  },
  helperText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingBottom: 12,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    maxWidth: 260,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  presetSection: {
    marginTop: 14,
    marginBottom: 10,
  },
  presetSectionTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  presetPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  presetPillActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: COLORS.brandIndigo,
  },
  presetPillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  presetPillTextActive: {
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  calendarWrap: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 6,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.bgSurface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  monthTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  daysOfWeekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingBottom: 6,
    marginBottom: 6,
  },
  dayOfWeekText: {
    width: 38,
    textAlign: "center",
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  gridDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  dayCellEmpty: {
    width: 38,
    height: 36,
  },
  dayCell: {
    width: 38,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: COLORS.brandIndigo,
  },
  dayCellPast: {
    opacity: 0.3,
  },
  dayCellText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.textDark,
  },
  dayCellTextSelected: {
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dayCellTextPast: {
    color: COLORS.textMuted,
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  previewBox: {
    flex: 1,
  },
  previewLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },
  previewValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.brandIndigo,
    marginTop: 1,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  confirmBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

