import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useTheme } from '@/lib/theme';

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
  const c = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: c.card,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        padding !== 'none' && { padding: paddingMap[padding] },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
