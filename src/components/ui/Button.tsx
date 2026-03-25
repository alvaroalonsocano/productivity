import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, type TouchableOpacityProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    variantContainer[variant],
    sizeContainer[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle = [
    variantText[variant],
    sizeText[size],
  ];

  return (
    <TouchableOpacity
      {...rest}
      disabled={isDisabled}
      style={containerStyle}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? 'white' : '#3b82f6'} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantContainer: Record<Variant, object> = {
  primary: { backgroundColor: '#2563eb' },
  secondary: { backgroundColor: '#f1f5f9' },
  ghost: { borderWidth: 1, borderColor: '#e2e8f0' },
  danger: { backgroundColor: '#ef4444' },
};

const variantText: Record<Variant, object> = {
  primary: { color: '#ffffff', fontWeight: 'bold' },
  secondary: { color: '#334155', fontWeight: '600' },
  ghost: { color: '#334155', fontWeight: '600' },
  danger: { color: '#ffffff', fontWeight: 'bold' },
};

const sizeContainer: Record<Size, object> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16 },
  lg: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 16 },
};

const sizeText: Record<Size, object> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 16 },
};
