import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, type TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/lib/theme';

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
  const c = useTheme();
  const isDisabled = disabled || loading;

  const variantContainer: Record<Variant, object> = {
    primary: { backgroundColor: c.primaryDark },
    secondary: { backgroundColor: c.cardAlt },
    ghost: { borderWidth: 1, borderColor: c.borderStrong },
    danger: { backgroundColor: c.danger },
  };

  const variantText: Record<Variant, object> = {
    primary: { color: '#ffffff', fontWeight: 'bold' },
    secondary: { color: c.cardAlt, fontWeight: '600' },
    ghost: { color: c.cardAlt, fontWeight: '600' },
    danger: { color: '#ffffff', fontWeight: 'bold' },
  };

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
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? 'white' : c.primary} />
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
