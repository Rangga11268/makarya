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
  ArrowLeft,
  ArrowRight,
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
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      chars.forEach((c, idx) => {
        if (index + idx < 6) {
          newOtp[index + idx] = c;
        }
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + chars.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      showToast("Harap masukkan 6 digit kode OTP secara lengkap", "warning");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(email, code);
      showToast("Akun Anda berhasil diverifikasi!", "success");
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
        showsVerticalScrollIndicator={false}
      >
        {/* Back navigation */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <View style={styles.backIconCircle}>
            <ArrowLeft size={16} color={COLORS.textDark} />
          </View>
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

        {/* Action Button - Fully consistent Pill CTA */}
        <Button
          title="Verifikasi & Masuk Sekarang"
          variant="brand"
          size="lg"
          onPress={handleVerify}
          loading={loading}
          iconRight={<ArrowRight size={18} color="#FFFFFF" />}
          style={styles.verifyBtn}
        />

        {/* Resend Timer Controls */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendNotice}>Belum menerima kode verifikasi?</Text>
          {timer > 0 ? (
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>Kirim ulang dalam {timer} detik</Text>
            </View>
          ) : (
            <Button
              title="Kirim Ulang Kode OTP"
              variant="soft"
              size="md"
              onPress={handleResend}
              loading={resending}
              icon={<RotateCcw size={15} color={COLORS.brandIndigo} />}
              style={styles.resendBtn}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 36,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    marginBottom: 24,
    paddingVertical: 4,
  },
  backIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 13,
    fontFamily: FONTS.bodyMedium,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
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
    fontFamily: FONTS.displayBold,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  targetBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  targetEmail: {
    fontSize: 12,
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.bgSurface,
    fontSize: 22,
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  otpBoxFilled: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: COLORS.brandIndigoLight,
  },
  infoCallout: {
    flexDirection: "row",
    backgroundColor: COLORS.brandIndigoLight,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
    padding: 12,
    borderRadius: 16,
    marginBottom: 22,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: "#3730A3",
    lineHeight: 18,
  },
  boldText: {
    fontFamily: FONTS.bodyBold,
    fontWeight: "700",
  },
  verifyBtn: {
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: "center",
    gap: 8,
  },
  resendNotice: {
    fontSize: 12,
    fontFamily: FONTS.bodyRegular,
    color: COLORS.textMuted,
  },
  timerBadge: {
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  timerText: {
    fontSize: 12,
    fontFamily: FONTS.bodyMedium,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  resendBtn: {
    marginTop: 2,
  },
});
