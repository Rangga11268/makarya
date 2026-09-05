import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import {
  KeyRound,
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Info,
} from "lucide-react-native";

export function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: Input Email, 2: Input OTP & New Password
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { forgotPassword, resetPassword } = useAuthStore();
  const { showToast } = useToastStore();

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      showToast("Masukkan alamat email akun Anda", "warning");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.trim());
      showToast("Kode OTP reset password telah dikirim!", "success");
      setStep(2);
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Akun dengan email tersebut tidak ditemukan",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otpCode.trim() || !newPassword.trim()) {
      showToast("Lengkapi kode OTP dan kata sandi baru", "warning");
      return;
    }

    if (newPassword.length < 8) {
      showToast("Kata sandi minimal 8 karakter", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Konfirmasi kata sandi tidak cocok", "danger");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim(), otpCode.trim(), newPassword);
      showToast("Kata sandi berhasil diperbarui! Silakan masuk.", "success");
      navigation.navigate("Login");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Kode OTP tidak valid atau terjadi kesalahan",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 2) {
              setStep(1);
            } else {
              navigation.goBack();
            }
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={COLORS.textPrimary} />
          <Text style={styles.backText}>
            {step === 2 ? "Ganti Email" : "Kembali ke Masuk"}
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <KeyRound size={36} color={COLORS.brandIndigo} />
          </View>
          <Text style={styles.title}>
            {step === 1 ? "Lupa Kata Sandi?" : "Buat Kata Sandi Baru"}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Masukkan email yang terdaftar pada akun Makarya Anda untuk menerima kode pemulihan."
              : `Masukkan 6 digit kode OTP yang dikirimkan ke ${email} dan tentukan kata sandi baru Anda.`}
          </Text>
        </View>

        {step === 1 ? (
          <View style={styles.form}>
            <Input
              label="Alamat Email Terdaftar"
              placeholder="Contoh: nama@domain.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={18} color={COLORS.textMuted} />}
            />

            <Button
              variant="brand"
              size="lg"
              onPress={handleRequestOtp}
              loading={loading}
              style={styles.submitBtn}
            >
              Kirim Kode Pemulihan
            </Button>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Kode OTP Pemulihan"
              placeholder="Masukkan 6 digit (contoh: 123456)"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={8}
            />

            <View style={styles.infoBox}>
              <Info size={15} color={COLORS.brandIndigo} />
              <Text style={styles.infoText}>
                Kode demo dev: Gunakan <Text style={styles.boldText}>123456</Text> untuk reset instan.
              </Text>
            </View>

            <Input
              label="Kata Sandi Baru"
              placeholder="Minimal 8 karakter"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              icon={<Lock size={18} color={COLORS.textMuted} />}
            />

            <Input
              label="Konfirmasi Kata Sandi Baru"
              placeholder="Ketik ulang kata sandi baru"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon={<Lock size={18} color={COLORS.textMuted} />}
            />

            <Button
              variant="brand"
              size="lg"
              onPress={handleResetPassword}
              loading={loading}
              style={styles.submitBtn}
            >
              Simpan Kata Sandi & Masuk
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 36,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginBottom: 24,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  form: {
    gap: 16,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    padding: 10,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#3730A3",
  },
  boldText: {
    fontFamily: FONTS.bold,
  },
  submitBtn: {
    marginTop: 8,
  },
});
