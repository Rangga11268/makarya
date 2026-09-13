import { useWindowDimensions } from "react-native";

/**
 * useResponsiveLayout
 * Reactive hook for handling diverse mobile devices:
 * - Compact screens & flip cover screens (width < 360)
 * - Standard mobile phones (360 <= width < 600)
 * - Tablets and unfolded foldables (width >= 600)
 * - Landscape orientation (width > height)
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isCompact = width < 360;
  const isTablet = width >= 600;
  const isLargeTablet = width >= 840;
  const isLandscapePhone = isLandscape && height < 500;

  // Max width constraint so wide tablet screens don't look awkwardly overstretched
  const contentMaxWidth = isTablet
    ? 720
    : isLandscape
      ? Math.min(width * 0.9, 800)
      : "100%";
  const authMaxWidth = 480;

  const horizontalPadding = isCompact ? 12 : isTablet ? 24 : 16;
  const verticalPadding = isLandscapePhone ? 8 : 16;

  return {
    width,
    height,
    isLandscape,
    isLandscapePhone,
    isCompact,
    isTablet,
    isLargeTablet,
    contentMaxWidth,
    authMaxWidth,
    horizontalPadding,
    verticalPadding,
    // Pre-computed style object for centralizing content on tablets & foldables
    responsiveContainerStyle: {
      width: "100%",
      maxWidth: contentMaxWidth,
      alignSelf: "center",
    },
    // Pre-computed style object for auth and modal forms
    authContainerStyle: {
      width: "100%",
      maxWidth: authMaxWidth,
      alignSelf: "center",
    },
  };
}
