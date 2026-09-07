import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}) {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        {
          width,
          height,
          borderRadius,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      {/* 1. Header row: Avatar + Name/Date + Chip */}
      <View style={styles.row}>
        <Skeleton width={38} height={38} borderRadius={19} />
        <View style={{ flex: 1, gap: 6, marginLeft: 10 }}>
          <Skeleton width="60%" height={13} borderRadius={4} />
          <Skeleton width="38%" height={10} borderRadius={4} />
        </View>
        <Skeleton width={62} height={22} borderRadius={11} />
      </View>

      {/* 2. Project Title Lines */}
      <View style={{ gap: 6, marginVertical: 8 }}>
        <Skeleton width="92%" height={15} borderRadius={4} />
        <Skeleton width="68%" height={15} borderRadius={4} />
      </View>

      {/* 3. Specs Grid (Budget & Duration) */}
      <View style={styles.specsRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Skeleton width="50%" height={10} borderRadius={4} />
          <Skeleton width="75%" height={16} borderRadius={5} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Skeleton width="50%" height={10} borderRadius={4} />
          <Skeleton width="65%" height={16} borderRadius={5} />
        </View>
      </View>

      {/* 4. Footer Pill & Arrow */}
      <View style={styles.rowBetween}>
        <Skeleton width={100} height={24} borderRadius={12} />
        <Skeleton width={60} height={14} borderRadius={4} />
      </View>
    </View>
  );
}

export function TalentCardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      {/* Header: Avatar + Info + Rating */}
      <View style={styles.row}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={{ flex: 1, gap: 6, marginLeft: 12 }}>
          <Skeleton width="65%" height={15} borderRadius={4} />
          <Skeleton width="45%" height={11} borderRadius={4} />
        </View>
        <Skeleton width={48} height={24} borderRadius={12} />
      </View>

      {/* University info line */}
      <Skeleton
        width="82%"
        height={11}
        borderRadius={4}
        style={{ marginVertical: 10 }}
      />

      {/* Skills pills row */}
      <View style={styles.pillsRow}>
        <Skeleton width={75} height={22} borderRadius={11} />
        <Skeleton width={95} height={22} borderRadius={11} />
        <Skeleton width={65} height={22} borderRadius={11} />
      </View>

      {/* Action buttons row */}
      <View style={[styles.row, { marginTop: 14, gap: 10 }]}>
        <Skeleton width="48%" height={36} borderRadius={12} />
        <Skeleton width="48%" height={36} borderRadius={12} />
      </View>
    </View>
  );
}

export function TrackerCardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      {/* Header row: Avatar + Partner Info + Status Pill */}
      <View style={styles.row}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1, gap: 6, marginLeft: 10 }}>
          <Skeleton width="55%" height={14} borderRadius={4} />
          <Skeleton width="35%" height={10} borderRadius={4} />
        </View>
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>

      {/* Project Title */}
      <View style={{ gap: 6, marginVertical: 10 }}>
        <Skeleton width="88%" height={16} borderRadius={4} />
        <Skeleton width="55%" height={16} borderRadius={4} />
      </View>

      {/* Bottom info row */}
      <View style={styles.rowBetween}>
        <Skeleton width={110} height={18} borderRadius={6} />
        <Skeleton width={75} height={18} borderRadius={6} />
      </View>
    </View>
  );
}

export function ChatSkeleton() {
  return (
    <View style={styles.chatSkeletonContainer}>
      {/* Partner message bubble (left) */}
      <View style={styles.chatBubbleRowLeft}>
        <Skeleton width={30} height={30} borderRadius={15} />
        <View style={{ flex: 1, maxWidth: "75%", marginLeft: 8 }}>
          <Skeleton width="100%" height={52} borderRadius={16} />
        </View>
      </View>

      {/* User message bubble (right) */}
      <View style={styles.chatBubbleRowRight}>
        <View style={{ flex: 1, maxWidth: "60%", alignItems: "flex-end" }}>
          <Skeleton width="100%" height={40} borderRadius={16} />
        </View>
        <Skeleton
          width={30}
          height={30}
          borderRadius={15}
          style={{ marginLeft: 8 }}
        />
      </View>

      {/* Partner message bubble (left) */}
      <View style={styles.chatBubbleRowLeft}>
        <Skeleton width={30} height={30} borderRadius={15} />
        <View style={{ flex: 1, maxWidth: "80%", marginLeft: 8 }}>
          <Skeleton width="100%" height={68} borderRadius={16} />
        </View>
      </View>

      {/* User message bubble (right) */}
      <View style={styles.chatBubbleRowRight}>
        <View style={{ flex: 1, maxWidth: "50%", alignItems: "flex-end" }}>
          <Skeleton width="100%" height={44} borderRadius={16} />
        </View>
        <Skeleton
          width={30}
          height={30}
          borderRadius={15}
          style={{ marginLeft: 8 }}
        />
      </View>
    </View>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <View style={{ padding: 20, gap: 16 }}>
      {/* Hero card */}
      <View style={styles.cardContainer}>
        <View style={styles.rowBetween}>
          <Skeleton width={80} height={24} borderRadius={12} />
          <Skeleton width={110} height={20} borderRadius={6} />
        </View>
        <View style={{ gap: 8, marginVertical: 12 }}>
          <Skeleton width="92%" height={22} borderRadius={6} />
          <Skeleton width="70%" height={22} borderRadius={6} />
        </View>
        <View style={styles.row}>
          <Skeleton width={140} height={16} borderRadius={6} />
        </View>
      </View>

      {/* Stepper bar */}
      <View style={styles.cardContainer}>
        <Skeleton width="100%" height={44} borderRadius={12} />
      </View>

      {/* Client card */}
      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={{ flex: 1, gap: 6, marginLeft: 12 }}>
            <Skeleton width="60%" height={16} borderRadius={5} />
            <Skeleton width="45%" height={12} borderRadius={4} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: COLORS.borderDark || "#E2E8F0",
  },
  cardContainer: {
    backgroundColor: COLORS.bgSurface || "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border || "#E2E8F0",
    marginBottom: 12,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border || "#F1F5F9",
  },
  specsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.canvasSoft || "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginVertical: 4,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginVertical: 4,
  },
  chatSkeletonContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  chatBubbleRowLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  chatBubbleRowRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 6,
  },
});