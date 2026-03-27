import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MOOD_EMOJIS, MOOD_LABELS } from '@/lib/constants';
import type { Mood } from '@/types';
import { useTheme } from '@/lib/theme';

interface MoodPickerProps {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

export default function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  const c = useTheme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    moodButton: {
      alignItems: 'center',
      gap: 4,
    },
    moodIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moodEmoji: {
      fontSize: 28,
    },
    moodLabel: {
      fontSize: 12,
    },
    moodLabelSelected: {
      color: c.primaryDark,
      fontWeight: '500',
    },
    moodLabelDefault: {
      color: c.textPlaceholder,
    },
  });

  return (
    <View style={styles.container}>
      {([1, 2, 3, 4, 5] as Mood[]).map((mood) => (
        <TouchableOpacity
          key={mood}
          onPress={() => onSelect(mood)}
          style={styles.moodButton}
        >
          <View
            style={[
              styles.moodIconContainer,
              {
                backgroundColor: selected === mood ? c.primaryBg : c.bg,
                borderWidth: selected === mood ? 2 : 0,
                borderColor: c.primary,
              },
            ]}
          >
            <Text style={styles.moodEmoji}>{MOOD_EMOJIS[mood]}</Text>
          </View>
          <Text style={[styles.moodLabel, selected === mood ? styles.moodLabelSelected : styles.moodLabelDefault]}>
            {MOOD_LABELS[mood]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
