import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddingMap: Record<string, number> = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 20,
};

export default function Card({ children, padding = 'md', style, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        padding !== 'none' && { padding: paddingMap[padding] },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
