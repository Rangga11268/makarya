import { StyleSheet } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#091424",
  },
  heroSection: {
    width: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9, 20, 36, 0.45)",
  },
  heroContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 28,
    paddingBottom: 44,
  },
  brandLogo: {
    width: 130,
    height: 36,
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    marginBottom: 8,
  },
  heroBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#6EE7B7",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    color: "#F8FAFC",
    letterSpacing: -0.4,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12.5,
    color: "#CBD5E1",
    lineHeight: 18,
    textAlign: "center",
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
  },
  quickFillHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  quickFillTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  quickFillTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickFillNotice: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#94A3B8",
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  chipItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  chipItemActiveMhs: {
    borderColor: COLORS.brandIndigo,
    backgroundColor: "#EEF2FF",
  },
  chipItemActiveUmkm: {
    borderColor: COLORS.success,
    backgroundColor: "#ECFDF5",
  },
  chipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#334155",
  },
  chipTextActiveMhs: {
    color: COLORS.brandIndigo,
  },
  chipTextActiveUmkm: {
    color: "#059669",
  },
  formArea: {
    marginBottom: 16,
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginBottom: 16,
    marginTop: 2,
  },
  forgotPasswordLink: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
  },
  loginBtn: {
    marginTop: 4,
    width: "100%",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
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
    marginBottom: 24,
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
    paddingHorizontal: 20,
  },
  securityText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 16,
  },
});
