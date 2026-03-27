import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/lib/theme';

interface BarChartProps {
  data: { label: string; value: number; maxValue?: number }[];
  height?: number;
  color?: string;
  showValues?: boolean;
}

export default function BarChart({ data, height = 140, color, showValues = true }: BarChartProps) {
  const c = useTheme();
  const barColor = color ?? c.primary;
  const maxValue = Math.max(...data.map((d) => d.maxValue ?? d.value), 1);
  const svgPaddingBottom = 24;
  const svgHeight = height - svgPaddingBottom;
  const barWidth = 24;
  const gap = 8;
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <View style={{ height, alignItems: 'center' }}>
      <Svg width={totalWidth} height={svgHeight}>
        {data.map((d, i) => {
          const barH = Math.max((d.value / maxValue) * (svgHeight - 24), d.value > 0 ? 4 : 0);
          const x = i * (barWidth + gap);
          const y = svgHeight - barH;
          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={6}
                fill={d.value > 0 ? barColor : c.cardAlt}
              />
              {showValues && d.value > 0 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill={c.textMuted}
                >
                  {d.value}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={[styles.labels, { width: totalWidth }]}>
        {data.map((d, i) => (
          <Text key={i} style={[styles.label, { color: c.textMuted, width: barWidth + gap }]} numberOfLines={1}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
});
