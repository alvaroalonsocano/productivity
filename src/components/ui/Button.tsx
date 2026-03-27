import React from 'react';
import { Text, ActivityIndicator, StyleSheet, Pressable, type PressableProps, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';
import { useHaptics } from '@/hooks/useHaptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
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
  onPress,
  ...rest
}: ButtonProps) {
  const c = useTheme();
  const haptics = useHaptics();
  const isDisabled = disabled || loading;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const variantContainer: Record<Variant, object> = {
    primary: { backgroundColor: c.primaryDark },
    secondary: { backgroundColor: c.cardAlt },
    ghost: { borderWidth: 1, borderColor: c.borderStrong },
    danger: { backgroundColor: c.danger },
  };

  const variantText: Record<Variant, object> = {
    primary: { color: '#ffffff', fontWeight: 'bold' },
    secondary: { color: c.text, fontWeight: '600' },
    ghost: { color: c.text, fontWeight: '600' },
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

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      onPress={(e) => { haptics.light(); onPress?.(e); }}
    >
      <Animated.View style={[containerStyle, animatedStyle]}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? 'white' : c.primary} />
        ) : (
          <Text style={[variantText[variant], sizeText[size]]}>{label}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
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
