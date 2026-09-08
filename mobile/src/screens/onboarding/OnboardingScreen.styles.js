import { StyleSheet, Dimensions } from "react-native";
import { FONTS } from "../../theme/fonts";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slidePage: {
    width,
    height: "100%",
    position: "relative",
    justifyContent: "flex-end",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: height * 0.62,
  },
  gradientOverlay: {
    position: "absolute",
    top: height * 0.2,
    left: 0,
    right: 0,
    height: height * 0.45,
  },
  contentArea: {
    paddingHorizontal: 28,
    paddingBottom: 24,
    zIndex: 2,
  },
  topSkipBtn: {
    position: "absolute",
    top: 52,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 10,
  },
  topSkipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: "#F1F5F9",
  },
  slideBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  slideBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  headline: {
    fontFamily: FONTS.displayBold,
    fontSize: 27,
    color: "#FFFFFF",
    letterSpacing: -0.5,
    lineHeight: 35,
    marginBottom: 10,
  },
  sub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 14,
    color: "#CBD5E1",
    lineHeight: 22,
  },
  bottomBar: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 8,
    zIndex: 10,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  dotActive: {
    width: 24,
  },
  nextBtn: {
    width: "100%",
  },
});
