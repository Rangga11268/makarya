import { StyleSheet } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 20,
  },
  brandLogo: {
    width: 120,
    height: 34,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  welcomeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    lineHeight: 20,
  },
  testAccountBox: {
    backgroundColor: "#F1F5F9",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  testHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  testTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  testTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#1E293B",
  },
  testPassNotice: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
  },
  chipRow: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActiveMhs: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: "#EEF2FF",
  },
  chipActiveUmkm: {
    borderColor: COLORS.success,
    backgroundColor: "#ECFDF5",
  },
  chipIconBgIndigo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  chipIconBgGreen: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  chipLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#0F172A",
  },
  chipEmail: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#64748B",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...SHADOWS.sm,
    marginBottom: 20,
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginBottom: 16,
    marginTop: -4,
  },
  forgotPasswordLink: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.brandIndigo,
  },
  loginBtn: {
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#94A3B8",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#64748B",
  },
  registerLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    color: COLORS.brandIndigo,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  securityText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },
});
