import React, { memo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import type { Habit, HabitLog } from '@/types';
import { computeStreak } from '@/utils/streakUtils';
import { useTheme } from '@/lib/theme';
import { useHaptics } from '@/hooks/useHaptics';

interface HabitCardProps {
  habit: Habit;
  logs: HabitLog[];
  selectedDate: string;
  onToggle: (habitId: string, date: string, checked: boolean) => void;
  onPress: (habitId: string) => void;
}

export default memo(function HabitCard({ habit, logs, selectedDate, onToggle, onPress }: HabitCardProps) {
  const c = useTheme();
  const haptics = useHaptics();
  const isCompleted = logs.some((l) => l.habit_id === habit.id && l.log_date === selectedDate);
  const streak = computeStreak(habit, logs.filter((l) => l.habit_id === habit.id));

  const checkScale = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    if (!isCompleted) {
      haptics.success();
      Animated.sequence([
        Animated.spring(checkScale, { toValue: 1.3, useNativeDriver: true, speed: 80 }),
        Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
      ]).start();
    } else {
      haptics.light();
      Animated.sequence([
        Animated.spring(checkScale, { toValue: 0.85, useNativeDriver: true, speed: 80 }),
        Animated.spring(checkScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
      ]).start();
    }
    onToggle(habit.id, selectedDate, !isCompleted);
  };

  const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12 },
    iconContainer: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    icon: { fontSize: 24 },
    info: { flex: 1 },
    name: { fontWeight: '600', color: c.text, fontSize: 16 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
    streakText: { fontSize: 12, color: '#f97316', fontWeight: '500' },
    rateText: { fontSize: 12, color: c.textPlaceholder },
    checkButton: { width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    checkmark: { color: '#ffffff', fontSize: 18 },
  });

  return (
    <TouchableOpacity onPress={() => onPress(habit.id)} style={styles.container} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
        <Text style={styles.icon}>{habit.icon ?? '✨'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        <View style={styles.metaRow}>
          {streak.current_streak > 0 && (
            <Text style={styles.streakText}>🔥 {streak.current_streak} días</Text>
          )}
          <Text style={styles.rateText}>{Math.round(streak.completion_rate_30d * 100)}% últimos 30d</Text>
        </View>
      </View>
      <Animated.View style={{ transform: [{ scale: checkScale }] }}>
        <TouchableOpacity
          onPress={handleToggle}
          style={[styles.checkButton, {
            borderColor: isCompleted ? habit.color : c.borderStrong,
            backgroundColor: isCompleted ? habit.color : 'transparent',
          }]}
        >
          {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
});
