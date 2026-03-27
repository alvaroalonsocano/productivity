import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Text as SvgText, Line } from 'react-native-svg';
import { useTheme } from '@/lib/theme';

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  min?: number;
  max?: number;
}

export default function LineChart({ data, height = 120, color, min = 0, max }: LineChartProps) {
  const c = useTheme();
  const lineColor = color ?? c.primary;
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1);
  const minVal = min;
  const range = maxVal - minVal || 1;

  const svgPaddingBottom = 20;
  const svgPaddingTop = 16;
  const svgHeight = height - svgPaddingBottom;
  const chartHeight = svgHeight - svgPaddingTop;
  const pointSpacing = data.length > 1 ? 200 / (data.length - 1) : 100;
  const svgWidth = Math.max(200, (data.length - 1) * pointSpacing + 16);

  const points = data.map((d, i) => {
    const x = i * pointSpacing + 8;
    const y = svgPaddingTop + chartHeight - ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={{ height }}>
      <Svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {/* Horizontal guide lines */}
        {[0, 0.5, 1].map((ratio, i) => (
          <Line
            key={i}
            x1={0}
            y1={svgPaddingTop + chartHeight * (1 - ratio)}
            x2={svgWidth}
            y2={svgPaddingTop + chartHeight * (1 - ratio)}
            stroke={c.border}
            strokeWidth={1}
          />
        ))}
        <Polyline points={polylinePoints} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" />
        {points.map((p, i) => (
          <React.Fragment key={i}>
            <Circle cx={p.x} cy={p.y} r={4} fill={lineColor} />
            <SvgText x={p.x} y={svgHeight - 4} textAnchor="middle" fontSize={9} fill={c.textMuted}>
              {p.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}
