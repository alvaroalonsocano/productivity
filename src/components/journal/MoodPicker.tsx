import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MOOD_EMOJIS, MOOD_LABELS } from '@/lib/constants';
import type { Mood } from '@/types';

interface MoodPickerProps {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

export default function MoodPicker({ selected, onSelect }: MoodPickerProps) {
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
                backgroundColor: selected === mood ? '#eff6ff' : '#f8fafc',
                borderWidth: selected === mood ? 2 : 0,
                borderColor: '#3b82f6',
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
    color: '#2563eb',
    fontWeight: '500',
  },
  moodLabelDefault: {
    color: '#94a3b8',
  },
});
