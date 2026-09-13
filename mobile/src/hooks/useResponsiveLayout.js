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

  // Max width constraint so wide tablet screens don't look awkwardly overstretched
  const contentMaxWidth = isTablet ? 720 : "100%";

  const horizontalPadding = isCompact ? 12 : isTablet ? 24 : 16;
  const verticalPadding = isLandscape ? 10 : 16;

  return {
    width,
    height,
    isLandscape,
    isCompact,
    isTablet,
    isLargeTablet,
    contentMaxWidth,
    horizontalPadding,
    verticalPadding,
    // Pre-computed style object for centralizing content on tablets & foldables
    responsiveContainerStyle: {
      width: "100%",
      maxWidth: contentMaxWidth,
      alignSelf: "center",
    },
  };
}
