import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import {
  ShieldCheck,
  Mail,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Info,
} from "lucide-react-native";

export function VerificationScreen({ route, navigation }) {
  const email = route.params?.email || "email.anda@gmail.com";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);
  const { verifyOtp, resendOtp } = useAuthStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];

    if (cleanText.length > 1) {
      // User pasted full OTP
      const pastedDigits = cleanText.slice(0, 6).split("");
      pastedDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Auto advance to next box
    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      showToast("Masukkan 6 digit kode verifikasi", "warning");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email, fullOtp);
      showToast("Akun Anda berhasil diverifikasi & aktif!", "success");
      // Sesi otomatis aktif, AppNavigator akan langsung mengarahkan ke MainTabs
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Kode OTP tidak valid atau telah kedaluwarsa",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    try {
      setResending(true);
      await resendOtp(email);
      setTimer(60);
      showToast("Kode verifikasi baru telah dikirim!", "info");
    } catch (err) {
      showToast("Gagal mengirim ulang kode. Silakan coba lagi.", "danger");
    } finally {
      setResending(false);
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
        {/* Back navigation */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={COLORS.textPrimary} />
          <Text style={styles.backText}>Kembali ke Masuk</Text>
        </TouchableOpacity>

        {/* Shield Icon Graphic */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={36} color={COLORS.brandIndigo} />
          </View>
          <Text style={styles.title}>Verifikasi Akun Anda</Text>
          <Text style={styles.subtitle}>
            Masukkan 6 digit kode OTP yang telah kami kirimkan untuk mengaktifkan akun Anda.
          </Text>

          <View style={styles.targetBadge}>
            <Mail size={14} color={COLORS.brandIndigo} />
            <Text style={styles.targetEmail}>{email}</Text>
          </View>
        </View>

        {/* OTP 6-Box Inputs */}
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(ref) => (inputRefs.current[idx] = ref)}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
              ]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              textAlign="center"
            />
          ))}
        </View>

        {/* Test Code Tip */}
        <View style={styles.infoCallout}>
          <Info size={16} color={COLORS.brandIndigo} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Uji Coba Cepat: Gunakan kode verifikasi default <Text style={styles.boldText}>123456</Text> untuk langsung mengaktifkan akun.
          </Text>
        </View>

        {/* Action Button */}
        <Button
          variant="brand"
          size="lg"
          onPress={handleVerify}
          loading={loading}
          style={styles.verifyBtn}
        >
          Verifikasi & Masuk Sekarang
        </Button>

        {/* Resend Timer Controls */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendNotice}>Belum menerima kode verifikasi?</Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Kirim ulang dalam {timer} detik</Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              disabled={resending}
              style={styles.resendBtn}
            >
              {resending ? (
                <ActivityIndicator size="small" color={COLORS.brandIndigo} />
              ) : (
                <>
                  <RotateCcw size={14} color={COLORS.brandIndigo} />
                  <Text style={styles.resendBtnText}>Kirim Ulang Kode OTP</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
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
  targetBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  targetEmail: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.brandIndigo,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  otpBoxFilled: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: "#F5F3FF",
  },
  infoCallout: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    padding: 12,
    borderRadius: 14,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#3730A3",
    lineHeight: 17,
  },
  boldText: {
    fontFamily: FONTS.bold,
  },
  verifyBtn: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: "center",
    gap: 6,
  },
  resendNotice: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  timerText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  resendBtnText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.brandIndigo,
  },
});
