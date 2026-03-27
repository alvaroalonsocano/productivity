import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/lib/theme';

interface RingChartProps {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export default function RingChart({
  value,
  total,
  size = 100,
  strokeWidth = 10,
  color,
  label,
  sublabel,
}: RingChartProps) {
  const c = useTheme();
  const ringColor = color ?? c.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(value / total, 1) : 0;
  const strokeDashoffset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={c.cardAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={[styles.center, { width: size, height: size }]}>
        {label && <Text style={[styles.label, { color: c.text }]}>{label}</Text>}
        {sublabel && <Text style={[styles.sublabel, { color: c.textMuted }]}>{sublabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center' },
  center: { position: 'absolute', top: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 20, fontWeight: 'bold' },
  sublabel: { fontSize: 11 },
});
