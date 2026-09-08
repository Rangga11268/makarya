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
  title: {
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
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...SHADOWS.sm,
    marginBottom: 20,
  },
  industryContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  industryScroll: {
    flexDirection: "row",
  },
  industryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },
  industryChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  industryText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: "#64748B",
  },
  industryTextActive: {
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
  },
  registerBtn: {
    marginTop: 6,
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#64748B",
  },
  loginLink: {
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
