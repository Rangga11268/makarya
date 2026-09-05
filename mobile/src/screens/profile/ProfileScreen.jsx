import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Modal,
  Platform,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { showConfirm } from "../../store/dialogStore";
import {
  Building2,
  Mail,
  ShieldCheck,
  LogOut,
  GraduationCap,
  Sparkles,
  Star,
  CheckCircle2,
  Award,
  ChevronRight,
  Code2,
  Palette,
  Globe,
  Github,
  Linkedin,
  CreditCard,
  Bell,
  Lock,
  HelpCircle,
  Phone,
  FileText,
  ExternalLink,
  Plus,
  Check,
} from "lucide-react-native";

export function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore();
  const { showToast } = useToastStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [escrowAlertsEnabled, setEscrowAlertsEnabled] = useState(true);

  // Skill Modal
  const [skillModal, setSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skillsList, setSkillsList] = useState([
    "UI/UX Design",
    "Figma",
    "React Native",
    "FastAPI",
    "Tailwind CSS",
    "Wireframing",
  ]);

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    !user?.role ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const handleLogout = () => {
    showConfirm({
      title: "Konfirmasi Keluar",
      message:
        "Apakah Anda yakin ingin mengakhiri sesi dan keluar dari akun Makarya?",
      type: "danger",
      confirmText: "Ya, Keluar",
      cancelText: "Batal",
      onConfirm: logout,
    });
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (skillsList.includes(newSkill.trim())) {
      showToast("Keahlian sudah ada dalam daftar", "info");
      return;
    }
    setSkillsList([...skillsList, newSkill.trim()]);
    setNewSkill("");
    setSkillModal(false);
    showToast("Keahlian baru berhasil ditambahkan!", "success");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
    showToast("Keahlian dihapus", "info");
  };

  const canGoBack = navigation?.canGoBack && navigation.canGoBack();

  return (
    <View style={styles.container}>
      <Header
        title={isMahasiswa ? "Profil Talenta Mahasiswa" : "Profil Akun UMKM"}
        subtitle={
          isMahasiswa
            ? "Identitas, portofolio & kredensial talenta"
            : "Informasi bisnis & manajemen akun UMKM"
        }
        onBack={canGoBack ? () => navigation.goBack() : undefined}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Profile Hero Card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatarCircle,
              isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
            ]}
          >
            <Text style={styles.avatarInitial}>
              {isMahasiswa
                ? user?.nama_lengkap?.charAt(0) || "D"
                : user?.nama_usaha?.charAt(0) || "U"}
            </Text>
          </View>

          <Text style={styles.userName}>
            {isMahasiswa
              ? user?.nama_lengkap || "Darell Rangga Putra"
              : user?.nama_usaha || "Brand UMKM Anda"}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.roleTag}>
            {isMahasiswa ? (
              <GraduationCap size={13} color={COLORS.brandIndigo} />
            ) : (
              <ShieldCheck size={13} color={COLORS.brandCyan} />
            )}
            <Text
              style={[
                styles.roleText,
                isMahasiswa
                  ? { color: COLORS.brandIndigo }
                  : { color: COLORS.brandCyan },
              ]}
            >
              {isMahasiswa
                ? "Mahasiswa Terverifikasi"
                : "Klien UMKM Terverifikasi"}
            </Text>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.metricValue}>5.0</Text>
              </View>
              <Text style={styles.metricLabel}>Reputasi Skor</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{isMahasiswa ? "14" : "8"}</Text>
              <Text style={styles.metricLabel}>
                {isMahasiswa ? "Proyek Tuntas" : "Proyek Diterbitkan"}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: COLORS.success }]}>
                100%
              </Text>
              <Text style={styles.metricLabel}>Sukses Escrow</Text>
            </View>
          </View>
        </View>

        {/* 2. Mahasiswa Academic Credentials Card */}
        {isMahasiswa && (
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Kredensial Akademik & Sertifikasi
              </Text>
              <View style={styles.verifiedCampusTag}>
                <CheckCircle2 size={11} color={COLORS.success} />
                <Text style={styles.verifiedCampusText}>
                  Terverifikasi Resmi
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <GraduationCap size={16} color={COLORS.brandIndigo} />
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Perguruan Tinggi</Text>
                <Text style={styles.detailValue}>
                  {user?.universitas || "Perguruan Tinggi Terakreditasi"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Sparkles size={16} color={COLORS.brandCyan} />
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Program Studi & Jenjang</Text>
                <Text style={styles.detailValue}>
                  {user?.prodi ? `${user.prodi} (S1)` : "Sistem Informasi (S1)"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Award size={16} color="#F59E0B" />
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Status Akademik</Text>
                <Text style={styles.detailValue}>
                  {user?.nim
                    ? `${user.nim} • Semester ${user.semester || 6} (Aktif)`
                    : "Mahasiswa Aktif Terverifikasi"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 3. Skills & Keahlian Management (Mahasiswa Only) */}
        {isMahasiswa && (
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Keahlian & Bidang Fokus</Text>
              <TouchableOpacity
                onPress={() => setSkillModal(true)}
                style={styles.addSkillLink}
                activeOpacity={0.7}
              >
                <Plus size={13} color={COLORS.brandIndigo} />
                <Text style={styles.addSkillLinkText}>Tambah</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.skillsWrap}>
              {skillsList.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={styles.skillPill}
                  onPress={() => handleRemoveSkill(skill)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.skillPillText}>{skill}</Text>
                  <Text style={styles.skillRemoveCross}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 4. Digital Portofolio Links (Mahasiswa Only) */}
        {isMahasiswa && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>
              Tautan Portofolio & Repositori
            </Text>

            <TouchableOpacity style={styles.linkRowItem} activeOpacity={0.7}>
              <View style={styles.linkIconWrap}>
                <Github size={16} color={COLORS.textDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>Profil GitHub</Text>
                <Text style={styles.linkUrl}>github.com/makarya-talent</Text>
              </View>
              <ExternalLink size={14} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRowItem} activeOpacity={0.7}>
              <View style={styles.linkIconWrap}>
                <Palette size={16} color="#EA4C89" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>Portofolio Desain Figma</Text>
                <Text style={styles.linkUrl}>figma.com/@makarya_portfolio</Text>
              </View>
              <ExternalLink size={14} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkRowItem} activeOpacity={0.7}>
              <View style={styles.linkIconWrap}>
                <Globe size={16} color={COLORS.brandCyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>
                  Website Portofolio Profesional
                </Text>
                <Text style={styles.linkUrl}>portofolio-digital.id</Text>
              </View>
              <ExternalLink size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* 5. Rekening Pencairan Honor Terdaftar */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Rekening Pencairan Honor</Text>

          <View style={styles.bankAccountRow}>
            <View style={styles.bankIconCircle}>
              <CreditCard size={18} color={COLORS.brandIndigo} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.bankNameRow}>
                <Text style={styles.bankNameText}>Bank Central Asia (BCA)</Text>
                <View style={styles.verifiedBankPill}>
                  <Check size={9} color={COLORS.success} strokeWidth={3} />
                  <Text style={styles.verifiedBankPillText}>Terverifikasi</Text>
                </View>
              </View>
              <Text style={styles.bankAccountDetail}>
                8270-3491-8821 • {user?.nama_lengkap || "Darell Rangga"}
              </Text>
            </View>
          </View>
        </View>

        {/* 6. Settings & Security */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Pengaturan & Notifikasi</Text>

          <View style={styles.settingToggleRow}>
            <View style={styles.settingIconWrap}>
              <Bell size={16} color={COLORS.brandIndigo} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingMainText}>Notifikasi Proyek Baru</Text>
              <Text style={styles.settingSubText}>
                Dapatkan info saat tawaran proyek baru sesuai keahlianmu dibuka
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: COLORS.borderDark,
                true: COLORS.brandIndigo,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingToggleRow}>
            <View style={styles.settingIconWrap}>
              <ShieldCheck size={16} color={COLORS.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingMainText}>
                Notifikasi Saldo Escrow
              </Text>
              <Text style={styles.settingSubText}>
                Pemberitahuan instan saat dana dikunci & dicairkan
              </Text>
            </View>
            <Switch
              value={escrowAlertsEnabled}
              onValueChange={setEscrowAlertsEnabled}
              trackColor={{
                false: COLORS.borderDark,
                true: COLORS.brandIndigo,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 7. Help Center & Support */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Pusat Bantuan & Layanan</Text>

          <TouchableOpacity style={styles.menuRowItem} activeOpacity={0.7}>
            <View style={styles.menuIconWrap}>
              <Phone size={15} color={COLORS.brandIndigo} />
            </View>
            <Text style={styles.menuItemTitle}>
              Hubungi Customer Support Makarya
            </Text>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRowItem} activeOpacity={0.7}>
            <View style={styles.menuIconWrap}>
              <FileText size={15} color={COLORS.brandIndigo} />
            </View>
            <Text style={styles.menuItemTitle}>Ketentuan Rekening Escrow</Text>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRowItem} activeOpacity={0.7}>
            <View style={styles.menuIconWrap}>
              <HelpCircle size={15} color={COLORS.brandIndigo} />
            </View>
            <Text style={styles.menuItemTitle}>Panduan Penggunaan Makarya</Text>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 8. Logout Button */}
        <Button
          title="Keluar dari Akun"
          variant="danger"
          size="lg"
          icon={<LogOut size={18} color="#FFF" />}
          onPress={handleLogout}
          style={styles.logoutBtn}
        />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal Tambah Skill */}
      <Modal visible={skillModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Tambah Keahlian Baru</Text>
            <Text style={styles.modalSub}>
              Tambahkan keahlian teknis atau desain untuk meningkatkan peluang
              terpilih
            </Text>

            <Input
              label="Nama Keahlian"
              placeholder="Contoh: Flutter, Next.js, Motion Graphic..."
              value={newSkill}
              onChangeText={setNewSkill}
            />

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={() => setSkillModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Simpan Keahlian"
                variant="brand"
                size="md"
                onPress={handleAddSkill}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarMhs: {
    backgroundColor: COLORS.brandIndigo,
  },
  avatarUmkm: {
    backgroundColor: COLORS.brandCyan,
  },
  avatarInitial: {
    fontFamily: FONTS.displayBold,
    fontSize: 30,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.4,
  },
  userEmail: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  roleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
    marginBottom: 18,
  },
  roleText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
  },
  metricsGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  metricLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderDark,
  },

  // Section Box
  sectionBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  verifiedCampusTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  verifiedCampusText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.success,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  detailValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 1,
  },

  // Skills
  addSkillLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  addSkillLinkText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  skillPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  skillPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  skillRemoveCross: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "700",
  },

  // Links
  linkRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  linkIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  linkTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  linkUrl: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  // Bank
  bankAccountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 6,
  },
  bankIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  bankNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bankNameText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  verifiedBankPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  verifiedBankPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: COLORS.success,
    fontWeight: "700",
  },
  bankAccountDetail: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Settings
  settingToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  settingMainText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  settingSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
    paddingRight: 6,
  },

  // Menu
  menuRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
    flex: 1,
  },

  logoutBtn: {
    marginTop: 6,
    marginBottom: 20,
  },

  // Modal Sheet
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
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
