import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  backgroundColor?: string;
}

export default function ProgressBar({
  progress,
  color,
  height = 6,
  backgroundColor,
}: ProgressBarProps) {
  const c = useTheme();
  const resolvedColor = color ?? c.primary;
  const resolvedBg = backgroundColor ?? c.borderStrong;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  return (
    <View
      style={[styles.track, { height, backgroundColor: resolvedBg, borderRadius: height / 2 }]}
    >
      <View
        style={[
          styles.fill,
          { width: `${clampedProgress * 100}%`, height, backgroundColor: resolvedColor, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {},
});
