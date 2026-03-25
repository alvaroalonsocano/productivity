import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  backgroundColor?: string;
}

export default function ProgressBar({
  progress,
  color = '#3b82f6',
  height = 6,
  backgroundColor = '#e2e8f0',
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  return (
    <View
      style={[styles.track, { height, backgroundColor, borderRadius: height / 2 }]}
    >
      <View
        style={[
          styles.fill,
          { width: `${clampedProgress * 100}%`, height, backgroundColor: color, borderRadius: height / 2 },
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
