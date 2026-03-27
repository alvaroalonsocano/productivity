import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  color?: string;
  size?: number;
}

export default function Checkbox({ checked, onPress, color, size = 22 }: CheckboxProps) {
  const c = useTheme();
  const resolvedColor = color ?? c.primary;
  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      {checked ? (
        <Ionicons name="checkmark-circle" size={size} color={resolvedColor} />
      ) : (
        <View
          style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: c.borderStrong }}
        />
      )}
    </TouchableOpacity>
  );
}
