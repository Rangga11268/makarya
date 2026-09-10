import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
  Linking,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { Input } from "../../components/ui/Input";
import { EditProfileModal } from "../../components/features/profile/EditProfileModal";
import { AddSkillModal } from "../../components/features/profile/AddSkillModal";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { showConfirm } from "../../store/dialogStore";
import { authApi } from "../../api";
import {
  ProdiVectorIcon,
  CampusVectorIcon,
  AcademicStatusVectorIcon,
  GithubVectorIcon,
  FigmaVectorIcon,
  GlobeVectorIcon,
  LinkedinVectorIcon,
  EditPencilVectorIcon,
  WhatsappVectorIcon,
} from "../../components/icons/ProfileVectorIcons";
import {
  ShieldCheck,
  LogOut,
  Star,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Bell,
  Phone,
  FileText,
  HelpCircle,
  ExternalLink,
  Plus,
  Check,
  X,
  MapPin,
  Building,
  Camera,
} from "lucide-react-native";

export function ProfileScreen({ navigation }) {
  const { user, updateUser, logout } = useAuthStore();
  const { showToast } = useToastStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [escrowAlertsEnabled, setEscrowAlertsEnabled] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePickPhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast("Izin akses galeri diperlukan untuk memilih foto", "error");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setIsUploadingPhoto(true);
        const asset = result.assets[0];
        const base64Data = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;

        const res = await authApi.updateProfile({
          photo_url: base64Data,
        });

        if (res?.data) {
          updateUser(res.data);
          showToast("Foto profil berhasil diperbarui!", "success");
        }
      }
    } catch (err) {
      console.error("Gagal memperbarui foto profil:", err);
      showToast("Gagal mengunggah foto profil.", "error");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Skills State
  const [skillModal, setSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skillsList, setSkillsList] = useState(
    user?.skills && Array.isArray(user.skills) ? user.skills : [],
  );

  // Edit Profile Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_lengkap: "",
    bio: "",
    prodi: "",
    nim: "",
    semester: "",
    github_url: "",
    figma_url: "",
    website_url: "",
    linkedin_url: "",
    nama_bank: "",
    nomor_rekening: "",
    nama_pemilik_rekening: "",
    nama_usaha: "",
    bidang_industri: "",
    kota: "",
    no_kontak: "",
  });

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    !user?.role ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  // Sinkronisasi data awal dari database saat mount
  useEffect(() => {
    authApi
      .getMe()
      .then((res) => {
        if (res?.data) {
          updateUser(res.data);
          if (res.data.skills && Array.isArray(res.data.skills)) {
            setSkillsList(res.data.skills);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Update skillsList jika user di store berubah
  useEffect(() => {
    if (user?.skills && Array.isArray(user.skills) && user.skills.length > 0) {
      setSkillsList(user.skills);
    }
  }, [user?.skills]);

  const handleOpenEditModal = () => {
    setEditForm({
      nama_lengkap: user?.nama_lengkap || user?.nama || "",
      bio: user?.bio || "",
      prodi: user?.prodi || "",
      nim: user?.nim || "",
      semester: user?.semester ? String(user.semester) : "",
      github_url: user?.github_url || "",
      figma_url: user?.figma_url || "",
      website_url: user?.website_url || "",
      linkedin_url: user?.linkedin_url || "",
      nama_bank: user?.nama_bank || "",
      nomor_rekening: user?.nomor_rekening || "",
      nama_pemilik_rekening:
        user?.nama_pemilik_rekening ||
        user?.nama_lengkap ||
        user?.nama_usaha ||
        user?.nama ||
        "",
      nama_usaha: user?.nama_usaha || user?.nama || "",
      bidang_industri: user?.bidang_industri || "",
      kota: user?.kota || "",
      no_kontak: user?.no_kontak || "",
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const payload = isMahasiswa
        ? {
            nama_lengkap: editForm.nama_lengkap.trim(),
            bio: editForm.bio.trim(),
            prodi: editForm.prodi.trim(),
            nim: editForm.nim.trim(),
            semester: parseInt(editForm.semester, 10) || 6,
            github_url: editForm.github_url.trim(),
            figma_url: editForm.figma_url.trim(),
            website_url: editForm.website_url.trim(),
            linkedin_url: editForm.linkedin_url.trim(),
            nama_bank: editForm.nama_bank.trim(),
            nomor_rekening: editForm.nomor_rekening.trim(),
            nama_pemilik_rekening: editForm.nama_pemilik_rekening.trim(),
          }
        : {
            nama_usaha: editForm.nama_usaha.trim(),
            bidang_industri: editForm.bidang_industri.trim(),
            kota: editForm.kota.trim(),
            no_kontak: editForm.no_kontak.trim(),
            nama_bank: editForm.nama_bank.trim(),
            nomor_rekening: editForm.nomor_rekening.trim(),
            nama_pemilik_rekening: editForm.nama_pemilik_rekening.trim(),
          };

      const res = await authApi.updateProfile(payload);
      if (res?.data) {
        await updateUser(res.data);
      }
      setEditModalVisible(false);
      showToast("Informasi profil berhasil diperbarui!", "success");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal memperbarui profil. Coba lagi.",
        "danger",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenLink = async (rawUrl, defaultHint = "") => {
    const targetUrl = rawUrl || defaultHint;
    if (!targetUrl || targetUrl.trim() === "") {
      showToast(
        "Tautan belum diatur. Ketuk tombol 'Edit Profil' untuk mengaturnya.",
        "info",
      );
      return;
    }
    let fullUrl = targetUrl.trim();
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = "https://" + fullUrl;
    }
    try {
      const canOpen = await Linking.canOpenURL(fullUrl);
      if (canOpen) {
        await Linking.openURL(fullUrl);
      } else {
        showToast("Tidak dapat membuka URL: " + targetUrl, "danger");
      }
    } catch (err) {
      showToast("Terjadi kendala saat membuka URL tautan.", "danger");
    }
  };

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

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    const cleanSkill = newSkill.trim();
    if (skillsList.includes(cleanSkill)) {
      showToast("Keahlian sudah ada dalam daftar", "info");
      return;
    }
    const updatedSkills = [...skillsList, cleanSkill];
    setSkillsList(updatedSkills);
    setNewSkill("");
    setSkillModal(false);

    try {
      await authApi.updateProfile({ skills: updatedSkills });
      await updateUser({ skills: updatedSkills });
      showToast("Keahlian baru berhasil disimpan!", "success");
    } catch (_) {
      showToast("Keahlian ditambahkan secara lokal", "info");
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skillsList.filter((s) => s !== skillToRemove);
    setSkillsList(updatedSkills);

    try {
      await authApi.updateProfile({ skills: updatedSkills });
      await updateUser({ skills: updatedSkills });
      showToast("Keahlian telah dihapus", "info");
    } catch (_) {
      showToast("Keahlian dihapus", "info");
    }
  };

  const canGoBack = navigation?.canGoBack && navigation.canGoBack();

  return (
    <View style={styles.container}>
      <OrganicRibbonBackground height={360} />
      <Header
        category="PENGATURAN IDENTITAS"
        title={isMahasiswa ? "Profil Talenta Mahasiswa" : "Profil Akun UMKM"}
        subtitle={
          isMahasiswa
            ? user?.profil_subtitle ||
              "Profil talenta muda dengan rekam jejak deliverable memuaskan"
            : user?.profil_subtitle || "Informasi bisnis & manajemen akun UMKM"
        }
        onBack={canGoBack ? () => navigation.goBack() : undefined}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Profile Hero Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePickPhoto}
            disabled={isUploadingPhoto}
            style={[
              styles.avatarCircle,
              isMahasiswa ? styles.avatarMhs : styles.avatarUmkm,
            ]}
          >
            {user?.url_foto ? (
              <Image
                source={{ uri: user.url_foto }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarInitial}>
                {isMahasiswa
                  ? (user?.nama_lengkap || "D").charAt(0).toUpperCase()
                  : (user?.nama_usaha || "U").charAt(0).toUpperCase()}
              </Text>
            )}

            {isUploadingPhoto ? (
              <View style={styles.avatarLoadingOverlay}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.avatarEditBadge}>
                <Camera size={12} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>
            {isMahasiswa
              ? user?.nama_lengkap || user?.nama || "Talenta Mahasiswa"
              : user?.nama_usaha || user?.nama || "Pelaku Usaha UMKM"}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.roleTag}>
            {isMahasiswa ? (
              <ProdiVectorIcon size={14} color={COLORS.brandIndigo} />
            ) : (
              <ShieldCheck size={14} color={COLORS.brandCyan} />
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
                ? user?.status_badge || "Mahasiswa Berprestasi & Terverifikasi"
                : user?.status_badge || "Klien UMKM Terverifikasi"}
            </Text>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.metricValue}>
                  {user?.rating_avg != null
                    ? Number(user.rating_avg).toFixed(1)
                    : "-"}
                </Text>
              </View>
              <Text style={styles.metricLabel}>
                {user?.total_ulasan > 0
                  ? `Reputasi (${user.total_ulasan})`
                  : "Reputasi Skor"}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {isMahasiswa
                  ? (user?.total_proyek_selesai ?? 0)
                  : (user?.total_proyek_diterbitkan ?? 0)}
              </Text>
              <Text style={styles.metricLabel}>
                {isMahasiswa ? "Proyek Tuntas" : "Proyek Diterbitkan"}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: COLORS.success }]}>
                {user?.escrow_success_rate || "-"}
              </Text>
              <Text style={styles.metricLabel}>Sukses Escrow</Text>
            </View>
          </View>

          {/* Edit Profile Action Button */}
          <PebbleButton
            variant="sapphire"
            size="sm"
            label="Edit Profil & Portofolio"
            onPress={handleOpenEditModal}
            style={{ width: "100%", marginTop: 12 }}
          />
        </View>

        {/* 2. Bio Singkat Card */}
        {user?.bio ? (
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Ringkasan Profesional</Text>
              <TouchableOpacity
                onPress={handleOpenEditModal}
                activeOpacity={0.7}
              >
                <Text style={styles.editInlineLink}>Ubah</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bioContentText}>{user.bio}</Text>
          </View>
        ) : null}

        {/* 3. Mahasiswa Academic Credentials Card */}
        {isMahasiswa ? (
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle} numberOfLines={1}>
                Kredensial Akademik
              </Text>
              <View style={styles.verifiedCampusTag}>
                <CheckCircle2 size={11} color={COLORS.success} />
                <Text style={styles.verifiedCampusText}>Terverifikasi</Text>
              </View>
            </View>

            {/* Perguruan Tinggi */}
            <View style={styles.detailRow}>
              <View style={styles.vectorIconFrame}>
                <CampusVectorIcon size={18} color={COLORS.brandIndigo} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Perguruan Tinggi</Text>
                <Text style={styles.detailValue}>
                  {user?.universitas || "Belum diatur"}
                </Text>
              </View>
            </View>

            {/* Program Studi & Jenjang (Menggunakan Icon Vector SVG Khusus) */}
            <View style={styles.detailRow}>
              <View style={styles.vectorIconFrame}>
                <ProdiVectorIcon size={18} color={COLORS.brandCyan} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Program Studi & Jenjang</Text>
                <Text style={styles.detailValue}>
                  {user?.prodi ? `${user.prodi} (S1)` : "Belum diatur"}
                </Text>
              </View>
            </View>

            {/* Status Akademik & NIM */}
            <View style={styles.detailRow}>
              <View style={styles.vectorIconFrame}>
                <AcademicStatusVectorIcon size={18} color="#F59E0B" />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Status Akademik & NIM</Text>
                <Text style={styles.detailValue}>
                  {user?.nim
                    ? `${user.nim}${user.semester ? ` • Semester ${user.semester}` : ""} (Aktif)`
                    : "Belum diatur"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* Profil Bisnis UMKM Card */
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Informasi Bisnis UMKM</Text>
              <TouchableOpacity
                onPress={handleOpenEditModal}
                activeOpacity={0.7}
              >
                <Text style={styles.editInlineLink}>Ubah</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.vectorIconFrame}>
                <Building size={18} color={COLORS.brandCyan} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Bidang Industri</Text>
                <Text style={styles.detailValue}>
                  {user?.bidang_industri || "Belum diatur"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.vectorIconFrame}>
                <MapPin size={18} color={COLORS.brandIndigo} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Lokasi Operasional</Text>
                <Text style={styles.detailValue}>
                  {user?.kota || "Belum diatur"}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.vectorIconFrame}>
                <WhatsappVectorIcon size={18} color="#25D366" />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>No. Kontak Bisnis</Text>
                <Text style={styles.detailValue}>
                  {user?.no_kontak || "Belum diatur"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 4. Skills & Keahlian Management (Mahasiswa Only) */}
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

        {/* 5. Digital Portofolio Links (Mahasiswa Only) */}
        {isMahasiswa && (
          <View style={styles.sectionBox}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Tautan Portofolio & Repositori
              </Text>
              <TouchableOpacity
                onPress={handleOpenEditModal}
                activeOpacity={0.7}
              >
                <Text style={styles.editInlineLink}>Atur Tautan</Text>
              </TouchableOpacity>
            </View>

            {/* GitHub */}
            <TouchableOpacity
              style={styles.linkRowItem}
              activeOpacity={0.7}
              onPress={() =>
                handleOpenLink(user?.github_url, "https://github.com")
              }
            >
              <View style={styles.linkIconWrap}>
                <GithubVectorIcon size={18} color={COLORS.textDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>Profil GitHub</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {user?.github_url || "Belum diatur (Ketuk untuk membuka)"}
                </Text>
              </View>
              <ExternalLink size={14} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* Figma */}
            <TouchableOpacity
              style={styles.linkRowItem}
              activeOpacity={0.7}
              onPress={() =>
                handleOpenLink(user?.figma_url, "https://figma.com")
              }
            >
              <View style={styles.linkIconWrap}>
                <FigmaVectorIcon size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>Portofolio Desain Figma</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {user?.figma_url || "Belum diatur (Ketuk untuk membuka)"}
                </Text>
              </View>
              <ExternalLink size={14} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* Website Portfolio */}
            <TouchableOpacity
              style={styles.linkRowItem}
              activeOpacity={0.7}
              onPress={() => handleOpenLink(user?.website_url)}
            >
              <View style={styles.linkIconWrap}>
                <GlobeVectorIcon size={18} color={COLORS.brandCyan} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>Website Portofolio</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {user?.website_url || "Belum diatur (Ketuk untuk membuka)"}
                </Text>
              </View>
              <ExternalLink size={14} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* LinkedIn */}
            <TouchableOpacity
              style={styles.linkRowItem}
              activeOpacity={0.7}
              onPress={() =>
                handleOpenLink(user?.linkedin_url, "https://linkedin.com")
              }
            >
              <View style={styles.linkIconWrap}>
                <LinkedinVectorIcon size={18} color="#0A66C2" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkTitle}>Profil LinkedIn</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {user?.linkedin_url || "Belum diatur (Ketuk untuk membuka)"}
                </Text>
              </View>
              <ExternalLink size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* 6. Rekening Pencairan Honor Terdaftar */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Rekening Pencairan Honor</Text>
            <TouchableOpacity onPress={handleOpenEditModal} activeOpacity={0.7}>
              <Text style={styles.editInlineLink}>Ubah Rekening</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bankAccountRow}>
            <View style={styles.bankIconCircle}>
              <CreditCard size={18} color={COLORS.brandIndigo} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.bankNameRow}>
                <Text style={styles.bankNameText}>
                  {user?.nama_bank || "Belum Mengatur Rekening"}
                </Text>
                {user?.nomor_rekening ? (
                  <View style={styles.verifiedBankPill}>
                    <Check size={9} color={COLORS.success} strokeWidth={3} />
                    <Text style={styles.verifiedBankPillText}>
                      Terverifikasi
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.bankAccountDetail}>
                {user?.nomor_rekening
                  ? `${user.nomor_rekening} • ${
                      user?.nama_pemilik_rekening ||
                      user?.nama_lengkap ||
                      user?.nama_usaha ||
                      user?.nama ||
                      "-"
                    }`
                  : "Tambahkan data rekening untuk kemudahan transaksi & pencairan escrow"}
              </Text>
            </View>
          </View>
        </View>

        {/* 7. Settings & Security */}
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

        {/* 8. Help Center & Support */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Pusat Bantuan & Layanan</Text>

          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Help")}
          >
            <View style={styles.menuIconWrap}>
              <Phone size={15} color={COLORS.brandIndigo} />
            </View>
            <Text style={styles.menuItemTitle}>
              Hubungi Customer Support Makarya
            </Text>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Help")}
          >
            <View style={styles.menuIconWrap}>
              <FileText size={15} color={COLORS.brandIndigo} />
            </View>
            <Text style={styles.menuItemTitle}>Ketentuan Rekening Escrow</Text>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRowItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Help")}
          >
            <View style={styles.menuIconWrap}>
              <HelpCircle size={15} color={COLORS.brandIndigo} />
            </View>
            <Text style={styles.menuItemTitle}>Panduan Penggunaan Makarya</Text>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 9. Logout Button */}
        <PebbleButton
          variant="ruby"
          size="md"
          label="Keluar dari Akun"
          icon={LogOut}
          onPress={handleLogout}
          style={{ width: "100%", marginTop: 8 }}
        />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* MODAL EDIT PROFIL & PORTOFOLIO */}
      <EditProfileModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveProfile}
        isSaving={isSaving}
        isMahasiswa={isMahasiswa}
      />

      {/* MODAL TAMBAH SKILL */}
      <AddSkillModal
        visible={skillModal}
        onClose={() => setSkillModal(false)}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        onAdd={handleAddSkill}
      />
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
    paddingBottom: 110,
  },
  profileCard: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.brandIndigo,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
    gap: 6,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
    marginBottom: 16,
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
    marginBottom: 16,
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
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.brandIndigo,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    width: "100%",
  },
  editProfileBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Section Box
  sectionBox: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginRight: 6,
  },
  editInlineLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  bioContentText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  verifiedCampusTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    flexShrink: 0,
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  vectorIconFrame: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 2,
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  linkIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
    color: COLORS.brandCyan,
    marginTop: 2,
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
    flexWrap: "wrap",
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
    flexShrink: 0,
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
});
