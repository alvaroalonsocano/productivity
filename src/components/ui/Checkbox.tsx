import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  color?: string;
  size?: number;
}

export default function Checkbox({ checked, onPress, color = '#3b82f6', size = 22 }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      {checked ? (
        <Ionicons name="checkmark-circle" size={size} color={color} />
      ) : (
        <View
          style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: '#cbd5e1' }}
        />
      )}
    </TouchableOpacity>
  );
}
