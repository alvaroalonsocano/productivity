import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export default function Badge({ label, color = '#6366f1', size = 'md' }: BadgeProps) {
  const fontSize = size === 'sm' ? 12 : 14;
  return (
    <View
      style={[styles.container, { backgroundColor: color + '20' }]}
    >
      <Text style={[styles.text, { color, fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
});
